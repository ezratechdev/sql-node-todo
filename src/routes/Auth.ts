const Auth = require("express").Router();
import crypt from "bcryptjs";
import{ connector} from "../components/connect";

// Signup

Auth.post("/signup" , (req , res)=>{
    const { email , username , password } = req.body;
    if( !( email && username && password && (password.length >= 6 && username.length >= 4 && email.includes("@") && email.includes(".") && email.length >= 5))){
        throw new Error("Some || all details were not passed or details were not correctly passed");
    }

    // check user is not in the db with same email

    const checkStatement = "Select * from users WHERE users.email='"+email+"'"
    connector.query(checkStatement , async (error , result , fields)=>{
        if(error){
            throw new Error(`Mysql error : signup/check email \n ${error}`);
        }
        if(result.length == 0){
            // create the user 
            const salt = await crypt.genSalt(10);
            const hashedPassword = await crypt.hash(password,salt);
            const createUser = `INSERT INTO users VALUES(users.email='${email}' , users.username='${username}' , users.password='${hashedPassword}')`
            // const createUser = "INSERT INTO users VALUES(users.email='${email}' , users.username='${username}' , users.password='${hashedPassword}')"
            connector.query(createUser , (error:any)=>{
                if(error){
                    throw new Error(`Mysql error : signup/create user \n ${error}`);
                }
                res.json({
                    status:200,
                    message:"User has been created",
                })
            })
        }else{
            res.json({
                status:400,
                message:"User with above email already exists",
            })
        }
    })

    // generate a salt and a hashed password

});


// export 
export default Auth;