create folder node-api

> cd node-api
> npm init

    enter until finish

> npm install express

    => create node_modules , package.json, ...

> create file index.js in node-api

    // import express from "express";
    const express = require("express"); // import module express
    const app = express(); // create app extend express

    // create route
    // app.get(route_name,call_back)
    // req : request
    // res : response
    app.get("/",(req,res)=>{ // http://localhost:8081/
        res.send("Hello Express in Node.js ");
    })

    app.get("/api/list_student",(req,res)=>{ // // http://localhost:8081/api/list_student
        res.send("You have request list student!");
    })

    app.get("/api/list_teacher",(req,res)=>{ // // http://localhost:8081/api/list_student
        let user = {
            id:10,
            name:"Dara",
            gender : "Male"
        }
        res.send(user)
    })

    // app.listen(port_numner,call_back)
    let port = 8081
    app.listen(port,()=>{
        console.log("http://localhost:"+port)
    })

> node index.js

# Node + MySQL

    - MySQL database server (xampp)
        - install xampp
        - open xampp control panel
        - click button start (apache,mysql)
        - open brower
        - type :
            http://localhost:80
            http://localhost:80/phpmyadmin => GUI MYSQL

            http://localhost:81
        - click menu phpmyAdmin

    - Create a database full_stack_g8
    - Create tables
        - table role(Id,Name,Code)
    - SQL
        - insert
        INSERT INTO role (Name,Code) VALUES ('Admin','admin');
        INSERT INTO role (Name,Code) VALUES ('Teacher','Teacher');
        INSERT INTO role (Name,Code) VALUES ('Student','Student');
        INSERT INTO role (Name,Code) VALUES ('Test101','Test101');
        - select
        SELECT * FROM role;
        SELECT Name, Code FROM role;
        - delete
        DELETE FROM role WHERE Id = 1;
        - update
        UPDATE role SET Name='Admins', Code='amdins' WHERE Id = 1;

# mysql2

> npm install mysql2

const mysql = require("mysql2/promise");
const db = mysql.createPool({
host: "localhost",
user: "root",
password: "",
database: "g7_db",
port: 6306, //3306,
namedPlaceholders: true,
});
module.exports = db;

# in controller

    - CURD role
    - list data from database
    - create new record to database
    - update/delete

# Check what error

    - database
        - start server mysql
        - connection
    - sql
        - insert , update ,delete, select
        - table name ? role
        - column name ? Id Name Code
    - try catch
        - add try catch all function
    - console.log function in node.js
    - status
        - 200 (ok), 404(route not found), 500(internal error server)
    - log error file

    - validate required data- create function log error

# CRUD role

    Id(PK), Name, Code

# CRUD category

    Id(PK), Name, Description, Status, CreateAt
    int     varchar(120) text  tinyint(1) datetimestamp

    - create table
    - index.js -> route -> controller -> (create,getlist,getone,update,remove)
    - testing (postman)

# Log file

const logError = async (controller="user.list",message="error message",res) => {
try {
// Append the log message to the file (create the file if it doesn't exist)
const timestamp = moment().format("DD/MM/YYYY HH:mm:ss"); // Use 'moment' for formatted timestamp
const path = "./logs/"+controller+".txt";
const logMessage = "["+timestamp+"] "+message +"\n\n";
await fs.appendFile(path, logMessage);
} catch (error) {
console.error('Error writing to log file:', error);
}
res.status(500).send('Internal Server Error');
}

const hash = bcrypt.hashSync(myPlaintextPassword, salt);
bcrypt.compareSync(myPlaintextPassword, hash); // true

var access_token = await jwt.sign({ data: user[0] }, ACCESS_TOKEN_KEY, { expiresIn: "60s" })

unction validate() {
return (req, res, next) => {
var authorization = req.headers.authorization // token from client
var token_from_client = null
if (authorization != null && authorization != "") {
token_from_client = authorization.split(" ") // authorization : "Bearer lkjsljrl;kjsiejr;lqjl;ksjdfakljs;ljl;r"
token_from_client = token_from_client[1] // get only access_token
}
if (token_from_client == null) {
res.status(401).send({
message: 'Unauthorized',
})
} else {
jwt.verify(token_from_client, ACCESS_TOKEN_KEY, (error, result) => {
if (error) {
res.status(401).send({
message: 'Unauthorized',
error: error
})
} else {
req.user = result.data // write user property
req.user_id = result.data.Id // write user property
next()
}
})
}
}
}
