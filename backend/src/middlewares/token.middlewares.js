import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

const verifToken = async(req,res,next)=>{
    const headerToken = req.headers["authorization"];
/* Verification si il existe un token */
    if(!headerToken){
        return res.status(401).json({
            Message:"Aucun token trouvé"
        })
    }
/* Verification si le token est valide */
    const token = headerToken.split(' ')[1];
    jwt.verify(token,process.env.TOKEN_KEY,(probleme,reussite)=>{
        if(probleme){
            return res.status(401).json({
                message:"Le token n'est plus valide"
            })
        }
        else{/* Pour tracer les connexion des utilisateurs via token.*/
            req.auth = reussite;
            next()
        }
    })

}

export default verifToken;