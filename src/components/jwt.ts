import jwt from "jsonwebtoken";

interface signedObject {
    id:string,
    operation:string,
}


export const  sign = ({ id , operation}:signedObject)=>{
    const secretKey = (operation == "auth") ? "authkey" : (operation == "reset") ? "resetkey" : (operation == "verify") ? "verifykey" : "aWontWorkKeyBecauseIDoNotKnowWhatOperationThisIs";
    return jwt.sign({ id , operation } , `${secretKey}` , {expiresIn :'30d'});
}

export const verify = ({ token , op }:{
    token:string | any,
    op:string | any,
})=>{
    const secretKey = (op == "auth") ? "authkey" : (op == "reset") ? "resetkey" : (op == "verify") ? "verifykey" : "aWontWorkKeyBecauseIDoNotKnowWhatOperationThisIs";
    const {id , operation} = jwt.verify(token , secretKey);
    if((id && operation) && op === operation){
        return {
            id,
            operation,
            error:false
        }
    }else{
        return{
            id:null,
            operation:op,
            error:true
        }
    }
}