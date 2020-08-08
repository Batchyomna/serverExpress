const myMongo = require('mongodb').MongoClient //pour utiliser mongo driver
const url = 'mongodb://localhost:27017'
async function readStudents(){
    try{
        let myData = await myMongo.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }) 
        var myDataBase = myData.db("FullStack");
        var theStudents = await myDataBase.collection("Students").find().toArray()
      return  theStudents

    }catch (err) {
        console.log(err);
        myData.close();

    }
    
}

async function readGroups() {
    try {
        let myData = await myMongo.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
        var myDataBase = myData.db("FullStack");
        var theGroupes = await myDataBase.collection("Groups").find().toArray()
       return  theGroupes

    } catch (err) {
        myData.close()
    }
}


async function newStudent(x) {
    try {
        let myData = await myMongo.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
        var myDataBase = myData.db("FullStack");
        await myDataBase.collection("Students").insertOne({name:x})

    } catch (err) {
        myData.close()
    }
}   
async function newGroup(project, num) {
    try {
        let myData = await myMongo.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
        var myDataBase = myData.db("FullStack");
        var students = await myDataBase.collection("Students").find().toArray()
         let names = [];
         //for(let j=0; j<students.length; j++){
        for(let i=0; i<num; i++){
            let i = Math.floor(Math.random()*students.length);
            var selectedStudent = students.splice(i, 1)// with splice we are sur that we will not take the same student twice
            names.push(selectedStudent[0].name)  
        }
        let x = names.join(' + ')//to change all the elements to one string separates by(+)
        await myDataBase.collection("Groups").insertOne({name:project, num : num, studentsNames: x})
   
    }catch (err) {
        myData.close()

    }
}

module.exports = {
    readStudents,
    readGroups,
    newStudent,
    newGroup,
}