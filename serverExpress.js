
const express = require('express')
const server = express()
const path = require('path')
server.use(express.static(path.join(__dirname, 'assets')));
let port = 8080
const ejs = require('ejs');
var helper = require('./helper');
const fileSystem = require('fs');
 //le module body-parser qui va nous permettre d’analyser les données reçues par l’API
var bodyParser = require("body-parser");//créer un objet de type body-parser et l'intégrer dans l’application 
 server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());


const qs = require('querystring');// 


server.get('/', async (req, res) => {//-----get home page
    var homePage = fileSystem.readFileSync("./index.ejs");
    homePage = ejs.render(homePage.toString())
    res.writeHeader(200, { "content-type": "text/html" });
    res.write(homePage)
    res.end();
});

server.get('/students', async (req, res) => {//-------------get first page/student's page
    var studentHTML = fileSystem.readFileSync("./students.ejs")
    // because it takes a time, so we need (await) every time we call helper
    let myStudents = await helper.readStudents()// array of objects which had read from the collection(Students)                                            
    let studentpage = ejs.render(studentHTML.toString(), { students: myStudents });
    res.writeHeader(200, { "content-type": "text/html" });
    res.write(studentpage)
    res.end();
})
server.get('/groups', async (req, res) => {//---------------get second page/group's page
    var groupHTML = fileSystem.readFileSync("./groups.ejs")
    let myGroups = await helper.readGroups()// array of objects which had read from the collection(Groups)
    let groupPage = ejs.render(groupHTML.toString(), { groups: myGroups });
    res.writeHeader(200, { "content-type": "text/html" });
    res.write(groupPage)
    res.end();
})
server.post('/students', async (req, res) => {
   // console.log(req.body.student)
    let newStudent = req.body.student
    await helper.newStudent(newStudent)// add the new student to the data base
    res.writeHead(302, {'Location': '/students'}); //to stay at the same page. we can also put the link where we want to go
    res.end();
})
server.post('/groups', async (req, res) => {
     //console.log(req.body.project)
     //console.log(req.body.number)

     let newProject = req.body.project
     let num = req.body.number
     await helper.newGroup(newProject, num)// add the new student to the data base
     res.writeHead(302, {'Location': '/groups'}); //to stay at the same page. we can also put the link where we want to go
     res.end();
 })


server.listen(port)