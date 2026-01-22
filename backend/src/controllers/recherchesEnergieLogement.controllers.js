import { sequelize } from "../config/db.js";
import https from "https";
import axios from "axios";

const Commune = sequelize.models.Commune;
const EnergieLogement = sequelize.models.EnergieLogement;

const recherchesEnergiesLogement = async (req,res)=>{
    try {
        const {entrée} = req.body
        /* Conformisation de l'input */
            const entréeConforme = entrée.charAt(0).toUpperCase() + entrée.slice(1).toLowerCase().trim();
        /* verif si ville existe */
            const verifCommune = await Commune.findOne({
                where:{
                    commune:entréeConforme
                }
            })
            if(!verifCommune){
                return res.status(400).json({message:"Ville entrée non reconnue"})
            }
        /* Sinon on verif si donnée deja collectée */
            const verifLogement = await EnergieLogement.findOne({
                where:{
                    commune:entréeConforme
                }
            })
            if(verifLogement){
                return res.status(200).json({data:verifLogement.passoires_thermiques})
            }
        /* Sinon faire appel API */
            console.log(`⚡️Recherche API ENERGIE LOGEMENT⚡️`);
            const url = `https://data.ademe.fr/data-fair/api/v1/datasets/dpe-france/lines?q=${encodeURIComponent(entréeConforme)}&size=300`

            const agent = new https.Agent({ rejectUnauthorized: false });
            const reponse = await axios.get(url, { httpsAgent: agent });
            /* Si pas de donnée echec */
            if (!reponse.data || !reponse.data.results || reponse.data.results.length === 0){
            return res.status(404).json({ message: "Pas de données DPE trouvées." });
            }
            /* Sinon on fait une moyenne */
            const logements = reponse.data.results;
            let compteurPassoires = 0; // Compteur pour F et G
            const lettres = {}; // Pour trouver la lettre dominante

            logements.forEach(logement => {
                const lettre = logement.classe_consommation_energie;
                
                // Compter les passoires (F et G)
                if (lettre === 'F' || lettre === 'G') {
                    compteurPassoires++;
                }

                // Compter les lettres pour la dominante
                if (lettre) {
                    lettres[lettre] = (lettres[lettre] || 0) + 1;
                }
            });
            // Calcul du pourcentage
            const pourcentagePassoires = ((compteurPassoires / logements.length) * 100)

            await EnergieLogement.create({
                commune:entréeConforme,
                passoires_thermiques:pourcentagePassoires,
                total_analyse: 300
            })

            return res.status(200).json({
                data: {
                ville: entréeConforme,
                taux_passoires: `${pourcentagePassoires}%`, // ex: "35.5%"
                detail_analyse: 300
            }
            })
    } catch (error) {
        console.log(`Erreur d'importation :${error}`);
         return res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
}

export default recherchesEnergiesLogement;
