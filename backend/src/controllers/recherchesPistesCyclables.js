import axios from "axios";
import { sequelize } from "../config/db.js";

const Commune = sequelize.models.Commune;
const Piste_cyclable = sequelize.models.Piste_cyclable;

const recherchesPistesCyclables = async (req,res)=>{
    try {
        const {entrée} = req.body
        /* Conformisation de l'input */
            const entréeConforme = entrée.charAt(0).toUpperCase() + entrée.slice(1).toLowerCase().trim();
        /* Verif commune existe */
            const verifCommune = await Commune.findOne({
                where:{
                    nom:entréeConforme
                }
            })
            
            if(!verifCommune){
                return res.status(400).json({message:"Ville non reconnue"})
            }
        /* Verif si piste existe dans déja dans la db */
            const verifPiste = await Piste_cyclable.findOne({
                where:{
                    commune:entréeConforme
                }
            })
            
            if(verifPiste){
                return res.status(200).json({data:verifPiste.nombre})
            }
        /* Sinon faire un appel API */
            console.log(`🛜 Recherche api pour : ${entréeConforme}🛜 | PISTES CYCLABLES`)
            const url = `https://opendata.koumoul.com/api/records/1.0/search/?dataset=amenagements-cyclables&q=${encodeURIComponent(entréeConforme)}&rows=0`;

            const reponse = await axios.get(url)
        /* Exportation des données */
            if(!reponse.data){
                return res.status(400).json({message:"Aucune data retrouvée"})
            }
            const segmentPiste = reponse.data.nhits
            const data = reponse.data.map(piste=>({
                commune:entréeConforme,
                codePostal:verifCommune.codePostal,
                nombre:segmentPiste
            }))

            console.log(`Insertion de ${data.length} | PISTES CYCLABLES`)

            await Piste_cyclable.bulkCreate(data);

            return res.status(200).json({
                data:data /* À modifier plus tard par `segmentPistes` */
            })
    } catch (error) {
         console.log(`Erreur d'importation :${error}`);
         return res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
}

export default recherchesPistesCyclables;