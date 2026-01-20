import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config()

const sequelize = new Sequelize(process.env.DATABASE_URL,{
    dialect:"mysql",
    logging:false,
    dialectOptions:{
        ssl:{
            require:true,
            rejectUnauthorization:false
        }
    }
})

const connectDB = async ()=>{
    try {
        /* Demande de connexion à la DB */
            sequelize.authenticate()
            console.log(`Connexion à la base de donnée:${sequelize.options.database} sur le port ${sequelize.options.host} reussi✅✅...`)

    } catch (error) {

        console.error("❌❌ DÉTAILS DE L'ERREUR ❌❌")
        console.error(error) /* Affiche l'erreur au complet */
        console.error("Message:",error.message) /* Affiche l'erreur en résumé */

    }
} /* Je met des émojis pour séparer les erreur du serveur (sans emoji) et de la liaison à la db (avec emojis) */

export default connectDB;
export {sequelize}