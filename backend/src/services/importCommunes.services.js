import { sequelize } from "../config/db.js";
import axios from "axios";

const Communes = sequelize.models.Commune

const importCommunes = async ()=>{
    try {
        /* Si il ya des communes ne pas retelecharger les données */
            const nombreCommune = await Communes.count()
            if(nombreCommune > 0){
                return console.log(`Les villes ont déja été importé`);
            }

        /* Sinon importation des villes */
            console.log(`🔄Importation des villes ...`);

        /* Appel API via axios */
            const reponse = await axios(`https://geo.api.gouv.fr/communes?fields=nom,code,codesPostaux&format=json&geometry=centre`)
            const data = reponse.data.map(commune=>({
                codeInsee:commune.code,
                nom:commune.nom,
                codePostal:commune.codesPostaux ?commune.codesPostaux[0] : null
            })) /* ⬆️ ici au cas ou il y a plusieurs code postal on prend le premier sinon null si pas de code  */
        
        /* Création des lignes dans la db */
            console.log(`Insertion de ${data.length} ville`);

            await Communes.bulkCreate(data)

            console.log(`Importation terminée✅`)
    } catch (error) {
        console.log(`Erreur d'importation :${error}`);
        
    }
}

export default importCommunes;