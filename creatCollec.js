const myMongo = require('mongodb').MongoClient //pour utiliser mongo driver
const url = 'mongodb://localhost:27017'// determiner url où mongoDB va se connecter
const express = require('express');// déclarer express comme un variable du modéle express
const app = express()// app notre server express
app.use(express.urlencoded({ extended: true }));// 
const port = 8000//la porte de où nptre server express va entendre les demandes

async function createCollection() { //declarer une fonction async qui va créer la connexion avec base à donnes
    try {
        let myData = await myMongo.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }) //céer une connexion avec MongoDb qui va nous donner des data, on va les garder dans le variable myData
        // Comme les méthodes(connect, createCollection) sont async( ils ont besoin du temps pour s'éxécuter) on a besoin toujours await avant tous
        var myDataBase = myData.db("FullStack")//créer base à donnes qui s'appelle (FullStack) avec la méthode db
        await myDataBase.createCollection("Students")//avec le variable(myDataBase) qui coresponde notre base à donne on va créer nouvelle collection
        await myDataBase.createCollection("Groupes")//créer une autre collection s'appelle Groupe

        app.post('/students/:name', async (req, res) => {//route /post sur le path(/students/:?) qui va ajouter un nouveau éleve, c'est nous qui allons écrire son nom à la place de ? 
            let studentname = req.params.name;// dans(studentname) on va récupérer le nom d'éléve grace à (req.params)
            await myDataBase.collection("Students").insertOne({ name: studentname })//ajouter un nouveau objet à la collection("Students")
            res.send("c'est bien enregistré")//il va nous envoyer la phrasse(c'est bien enregistré)
        });

        app.post('/groupes', async (req, res) => {//route /post sur le path(/groupes) qui va ajouter une nouvelle groupe, 
            let groupe = {};// un objet vide
            let keys = Object.keys(req.body) // recupérer les propriétés envoyés dans le body de la requête pour tous les informations concernant la groupe à enregister et les mettre dans un tableau s'appelle (keys)
            for(let i=0; i<keys.length; i++){// boucle va passer sur le tableau keys 
             groupe[keys[i]]=req.body[keys[i]]//on va donner les propriétés qui sont dans le tableau keys au objet(groupe)
                                              //req.body[keys[i]] = la value(dans le body de la requête) qui correspond la propriété key[i]
            }
            await myDataBase.collection("Groupes").insertOne(groupe)//Parce que(insertOne) est une operation async on a besoin de (await) avant la
                res.json(groupe)//res.json prend un objet comme un arguement
        });

        app.get('/students', async (req, res) => {//route /get sur le path(/students) qui va afficher tous les éléves  
            var theStudents = await myDataBase.collection("Students").find().toArray()//.find(): methode nous aide à trouver un objet dans une collection mais quand on la pass vide elle va nous donner tous les objets
                                                                        //.toArray(): methode va transmettre les information en tableau des objets
           res.json(theStudents)
        });

        app.get('/groupes', async (req,res)=>{//route /get sur le path(/groupes) qui va afficher tous les groupes  
            var theGroupes = await myDataBase.collection("Groupes").find().toArray()
            res.json(theGroupes)
        });
        app.get('/groupes/:nameDegroupe', async (req,res)=>{//route /get sur le path(/groupes/?) qui va afficher un seul groupe, son nom on va le écrire en place de(?) dans la route sur (Postman)
            let groupeName = req.params.nameDegroupe;//on va récupérer le nom du groupe dans le variable groupeName
            var groupes = await myDataBase.collection("Groupes").find().toArray()// dans le tableau groupes on va récupérer tous les groupes de la collection (Groupes)
                for (let i = 0; i < groupes.length; i++) {//on va passer la boucle sur le tableau groupes, et on va comaper le nom du groupe qui dans(groupeName) avec le nom de chaque groupe dans la collection(Groupes) qui sont dans le tableau groupes
                if(groupes[i].name.toUpperCase() === groupeName.toUpperCase()){//pour bien copmarer les deux noms on va les changer les lettres de majuscule
                  let myGroupe =  await myDataBase.collection('Groupes').findOne(groupes[i])//quand on le trouve on va entrer dans (if) et avec .findOne(groupes[i]) on va mettre l'element qui a rempli la condition requise dans le variable (myGroupe)
                  res.json(myGroupe).end()// on va le envoyer grace à res.json(myGroupe) et on va finir la response avec .end()
                }
            }
            res.status(404).end("le groupe n'exsit pas")// si la boucle passe sur tout le tableau et la condition ne remplissait aucun des éléments du groupes on va envoyer res.status(404) et afficher cette message("le groupe n'exsit pas")
        });

        app.delete('/students/:name', async (req, res) => {// pour supprimer un éléve précisément
            let studentsName = req.params.name;// on va le récupérer  dans le variable studentsName
            var theStudents = await myDataBase.collection("Students").find().toArray()//lire toute la collection (Students) et la mettre dans un tableau theStudents
            for (let i = 0; i < theStudents.length; i++) {// passer la boucle sur le tableau theStudents

                if (theStudents[i].name.toUpperCase() === studentsName.toUpperCase()) { //si on trouve le nom on va entrer dans (if)
                 
                    await myDataBase.collection('Students').remove(theStudents[i])// pour enlever tout l'objet

                    res.send('Bien supprimé').end()
                }

            }
            res.status(404).end("ce nom n'existe pas")// si non on va envoyer un état erreur(404) avec message dans le fermeteur de response (.end(" ce nom n'existe pas"))

        });

        app.delete('/groupes/:name', async (req, res) => {
            var groupeName = req.params.name;
            var groupes = await myDataBase.collection('Groupes').find().toArray()
            console.log(groupes.length)
            for (let i = 0; i < groupes.length; i++) {
                if(groupes[i].name.toUpperCase() === groupeName.toUpperCase()){
                    //console.log("AAAAAAAAAAAA")
                    await myDataBase.collection('Groupes').remove(groupes[i])
                    res.send('le groupe est supprimer').end()
                }
            }
            res.status(404).end('le groupe nexsit pas')

        });
        app.listen(port, () => {// server express va entendre la porte qui on a déterminer au début de notre programme
            console.log("Connected");
        })

    } catch (err) {// si le programme a trouver un problème avec (try) il va entrer dans (catch) pour afficher l'erreur et fermer la base à donné
        console.log(err)
        myData.close()

    }
}
createCollection()//appeler la fonction qui va créer la connexion avec la bas à donné et rependre à API demandes

