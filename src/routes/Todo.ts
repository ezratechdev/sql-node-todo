import express from "express";
const Todo = express.Router();
import Protect from "../middlewares/Protect";
import{ connector } from "../components/connect";


Todo.post("/getData" , [Protect] , (req , res)=>{
    let { id , operation , error } = req.protect;
    if(!(id ||operation) && error){
        throw new Error("Provide an email or username was not passed");
    }
    const getDataQuery:string = "SELECT * from todos WHERE todos.userID='"+id+"'"
    //  todo , time , userID
    connector.query(getDataQuery , (error , results , fields) =>{
        if(error){
            throw new Error(`Mysql error : getData/ general \n ${error}`);
        }
        console.log(results);
        if(results.length < 1){
            res.json({
                status:200,
                todos:[],
            })
        }else{
            res.json({
                status:200,
                todos:results,
            })
        }
    });
});

Todo.post("/createTodo" , [Protect] , (req , res )=>{
    let { id , operation , error } = req.protect;
    if(!(id ||operation) && error){
        throw new Error("Id or operation was not passed");
    }
    const { todo  } = req.body;
    if(!(todo )){
        throw new Error("Todo was not passed");
    }
    const time = new Date();

    const createStatement = "INSERT INTO todos VALUES('"+todo+"','"+time+"','"+id+"')";
    connector.query(createStatement, (error:any)=>{
        if(error){
            throw new Error(`Mysql error : createTodo/ general \n ${error}`);
        }
        res.json({
            status:200,
            todo,
            time,
        })
    });
});

export default Todo;