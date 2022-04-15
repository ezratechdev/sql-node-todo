import jwt from "jsonwebtoken";

interface signedObject {
    id:string,
    operation:string,
}


export default function({ id , operation}:signedObject){
    const secretKey = (operation == "auth") ? "authkey" : (operation == "reset") ? "resetkey" : (operation == "verify") ? "verifykey" : "aWontWorkKeyBecauseIDoNotKnowWhatOperationThisIs";
    jwt.sign({ id , operation } , `${secretKey}` , {expiresIn :'30d'});
}