import axios from "axios";
import https from "https"; // 👈 Import nécessaire pour fixer l'erreur SSL
import { sequelize } from "../config/db.js";

const Commune = sequelize.models.Commune;
const Air = sequelize.models.Air;

const recherchesAir = async (req,res) => {
    try {
        const { entrée } = req.body;
        
        /* Conformisation de l'input */
            const entréeConforme = entrée.charAt(0).toUpperCase() + entrée.slice(1).toLowerCase().trim();

        /* 1. Verif commune existe */
            const villeInfo = await Commune.findOne({
                where: {
                    commune: entréeConforme
                }
            });

            if (!villeInfo){
                return res.status(400).json({ message: "Ville non reconnue (Code INSEE introuvable)." });
            }

        /* Vérification Cache (Est-ce qu'on a déjà l'air pour cette ville ?) */
            const verifAir = await Air.findOne({
                where: {
                    commune: entréeConforme
                }
            });

            if(verifAir) {
                return res.status(200).json({
                    message: "Données récupérées depuis le cache",
                    data: {
                        ville: entréeConforme,
                        qualite: verifAir.qualite,
                        couleur: verifAir.couleur,
                        valeur: verifAir.valeur
                    }
                });
            }

            console.log(`☁️ Recherche Qualité de l'Air pour : ${entréeConforme} (INSEE: ${villeInfo.codeInsee})`);

        /* Appel API RECOSANTÉ (Avec le fix SSL) */
            const url = `https://api.recosante.beta.gouv.fr/v1/indices?insee=${villeInfo.codeInsee}`;

        /* SSL pour contourner l'identification  */
            const agent = new https.Agent({  
                rejectUnauthorized: false
            });

            const reponse = await axios.get(url, { httpsAgent: agent });

            if (!reponse.data || !reponse.data.data) {
                return res.status(404).json({ message: "Pas de données air pour cette ville." });
            }

        /* Extraction propre de la donnée (Indice ATMO) */
            const indiceData = reponse.data.data.find(d => d.slug === "indice_atmo");
        
            const qualite = indiceData ? indiceData.label : "Inconnue";
            const couleur = indiceData ? indiceData.color : "#CCCCCC";
            const valeur = indiceData ? indiceData.valeur : null;

        /* Sauvegarde dans la DB */
            await Air.create({
                commune: entréeConforme,
                qualite: qualite,
                couleur: couleur,
                valeur: valeur
            });

            return res.status(200).json({
                message: "Qualité de l'air récupérée",
                data: {
                    commune: entréeConforme,
                    qualite: qualite, 
                    couleur: couleur, 
                    valeur: valeur 
                }
            });

    } catch (error) {
        console.log(`Erreur Air : ${error.message}`);
        return res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
}

export default recherchesAir;