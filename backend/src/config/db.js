import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import Communes from "../models/communes.models.js";
import Utilisateurs from "../models/utilisateurs.models.js";
import Bus from "../models/bus.models.js";
import Bornes from "../models/bornes.models.js";

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

/* Creation des tables via models*/
    Communes(sequelize);
    Utilisateurs(sequelize);
    Bus(sequelize);
    Bornes(sequelize);

const connectDB = async ()=>{
    try {
        /* Demande de connexion à la DB */
            sequelize.authenticate()
            console.log(`Connexion à la base de donnée:${sequelize.options.database} sur le port ${sequelize.options.host} reussi✅✅...`)
        /* Synchronisation des tables */
            await sequelize.sync({alter:true});
        /* Boucle pour afficher les tables connectées */
            Object.keys(sequelize.models).forEach(modelName => {
            const model = sequelize.models[modelName];
            console.log(`La table ${model.tableName} est bien connectée ✅`);
            
        });
    } catch (error) {

        console.error("❌❌ DÉTAILS DE L'ERREUR ❌❌")
        console.error(error) /* Affiche l'erreur au complet */
        console.error("\nMessage:",error.message) /* Affiche l'erreur en résumé */

    }
} /* Je met des émojis pour séparer les erreur du serveur (sans emoji) et de la liaison à la db (avec emojis) */

export default connectDB;
export {sequelize}