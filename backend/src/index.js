import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import importCommunes from "./services/importCommunes.services.js";

dotenv.config()

const startServer = async ()=>{
    try {
        /* Connexion à la db */
            connectDB()
        /* Démarage du serveur */
            app.on('error',(error)=>{
                console.log('Erreur de démarage du serveur:',error)
            })

        /* Ecoute du serveur sur le port */
            app.listen(process.env.PORT,()=>{
                console.log(`Le serveur écoute sur le port ${process.env.PORT}`);
                
            })
        
        /* Import des villes */
            await importCommunes();


    } catch (error) {
        console.log(`Erreur du serveur ❌`);
    }
}

startServer()

