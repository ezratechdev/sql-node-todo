import express , {Request , Response} from "express";
import http from "http";
import sql from "mysql";
import { mysqlData } from "./services/mysql";
import Auth from "./routes/Auth";


const app = express();
const Server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// use this to create the database 
// CREATE DATABASE todo
// and create the table using this
// CREATE TABLE (todo varchar(500) , time varchar(100) , userID varchar(100) );
// OR
// CREATE TABLE `todo`.`todos` ( `todo` VARCHAR(500) NOT NULL , `time` VARCHAR(100) NOT NULL , `userID` VARCHAR(100) NOT NULL ) ENGINE = InnoDB;

// users table
// CREATE TABLE `todo`.`users` ( `email` VARCHAR(100) NOT NULL , `username` VARCHAR(100) NOT NULL , `password` VARCHAR(1000) NOT NULL ) ENGINE = InnoDB;

// middlewares
app.use(express.json());
app.use((express.urlencoded({extended:true})));
app.use(express.static(__dirname + "/public"));

// custom paths
app.use("/auth" , Auth);



// default
app.use((req:Request , res:Response)=>{
    res.json({
        status:404,
        message:"Page not found",
    })
});

const connector = sql.createConnection(mysqlData);
connector.connect((error:any)=>{
    if(!error) Server.listen(PORT);
    else throw new Error(`Unable to create a connection ! \n ${error}`);
})


// connect to the database

// spin up the server