import { verify } from "../components/jwt";
const Protect = (req:any , res , next) => {
    let token;
    try{
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
            console.log(token)
            let op = "auth";
            const tokenData = verify({ token , op });
            if(!tokenData.error && tokenData.operation == op){
                req.protect = tokenData;
                next();
            }else{
                throw new Error("The token passed is not valid");
            }
        }
    }catch(error:any){
        throw new Error (`Error faced.Try contacting admin \n ${error}`);
    }
}

export default Protect;