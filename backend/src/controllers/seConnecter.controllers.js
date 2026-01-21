import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/db.js';
import dotenv from "dotenv";

dotenv.config()

const utilisateurs = sequelize.models.Utilisateur;

const seConnecter = async(req,res)=>{
    try {
        const {mail, password} = req.body;

        const mailCorrect = mail.toLowercase().trim()

/* Verification si le mail existe dans la db */
        const verifEntree = await utilisateurs.findOne({
            where:{mail:mailCorrect}
        })
        if(!verifEntree){
            return res.status(409).json({message:"Cette adresse mail ou ce mot de passe n'est pas reconnu."})
        }

/* Verification du mot de passe */
        const verifPassword = await bcrypt.compare(password,verifEntree.password);
        if(!verifPassword){
            return res.status(401).json({
                message:"Cette adresse mail ou ce mot de passe n'est pas reconnu."
            })
        }

/* Si tout est bon connexion établie. */
        console.log(`Connexion sur le compte de l'utilsateur:${verifEntree.ID} mail:${mail}`);
        return res.status(200).json({
            message:"Connexion réussi",
            token: jwt.sign({contact:mail,id: verifEntree.ID},process.env.TOKEN_KEY,{expiresIn:'10d'})
        })

    } catch (error) {
        console.log("Erreur de connexion au compte", error);
        return res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
}

export default seConnecter;