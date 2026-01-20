import app from "./app.js";
import dotenv from 'dotenv';

dotenv.config()

const startServer = async ()=>{
    try {
        /* Démarage du serveur */
            app.on('error',(error)=>{
                console.log('Erreur de démarage du serveur:',error)
            })

        /* Ecoute du serveur sur le port */
            app.listen(process.env.PORT,()=>{
                console.log(`Le serveur écoute sur le port ${process.env.PORT}`);
                
            })


    } catch (error) {
        console.log(`Erreur du serveur ❌`);
    }
}

startServer()