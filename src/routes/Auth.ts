const Auth = require("express").Router();
import crypt from "bcryptjs";
import{ connector} from "../components/connect";
import { sign } from "../components/jwt";
import { v4 as uuidv4 } from 'uuid';


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
            const userID:any = uuidv4();
            const salt = await crypt.genSalt(10);
            const hashedPassword = await crypt.hash(password,salt);
            const createUser = "INSERT INTO users VALUES('"+userID+"' ,'"+email+"' , '"+username+"' , '"+hashedPassword+"')"
            connector.query(createUser , (error:any)=>{
                if(error){
                    throw new Error(`Mysql error : signup/create user \n ${error}`);
                }
                const token = sign({id:userID, operation:"auth" });
                res.json({
                    status:200,
                    message:"User has been created",
                    token,
                })
            })
        }else{
            res.json({
                status:400,
                message:"User with above email already exists",
            })
        }
    })


});


Auth.post("/login" , (req , res)=>{
    const passedEmail  = req.body.email;
    const passedPass = req.body.password;
    console.log(passedEmail , passedPass);
    if(!((passedEmail && passedPass) && (passedPass.length >= 6 && passedEmail.length >= 5 && passedEmail.includes("@") && passedEmail.includes(".")))){
        throw new Error("Some || all details were not passed or details were not correctly passed");
    }
    const loginQuerry = "SELECT * from users WHERE users.email='"+passedEmail+"'";
    connector.query(loginQuerry , async (error:any , results , fields)=>{
        if(error){
            throw new Error(`Mysql error : login/ general login \n ${error}`);
        }
        if(results.length > 0){
            const { email , username , password , userID } = results[0];
            if(await crypt.compare(passedPass,password)){
                const token = sign({id:userID, operation:"auth" });
                res.json({
                    status:200,
                    message:`User with email ${(passedEmail == email) ? email : passedEmail} has been logged in successfully`,
                    token,
                });
            }else{
                res.json({
                    status:404,
                    message:"Wrong password was passed try again",
                })
            }
        }
        res.json({
            status:404,
            message:"Conflicting users found kindly try again"
        })
    });
});



// export 
export default Auth;