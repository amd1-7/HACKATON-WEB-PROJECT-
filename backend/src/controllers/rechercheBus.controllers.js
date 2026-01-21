import { sequelize } from "../config/db.js";
import { Op } from "sequelize"; // Ajout de l'import manquant
import axios from "axios";

const Bus = sequelize.models.Bus;
const Commune = sequelize.models.Commune;

const rechercheBus = async (req, res) => { 
    try {
        const { entrée } = req.body;
        
        const entréeConforme = entrée.charAt(0).toUpperCase() + entrée.slice(1).toLowerCase().trim();

        /* Recherche si la ville existe */
            const verifVille = await Commune.findOne({
                where:{
                    nom:entréeConforme
                }
            })
            if(!verifVille){
                return res.status(400).json({
                    message:"Erreur de saisie, votre saisie n'est surement pas une ville existante."
                })
            }

        // 1. Recherche en base de données
            const verifBusExiste = await Bus.findOne({
                where: {
                    [Op.or]: [
                        { codePostal: entréeConforme },
                        { ville: entréeConforme }
                    ]
                }
            });

            if (verifBusExiste) {
                return res.status(200).json({
                    data: verifBusExiste.nombre
                });
            }

        // 2. Si pas dans la DB on appelle l'API
            const villeInfo = await Commune.findOne({
                where: { nom: entréeConforme }
            });

            console.log(`🛜 Recherche api pour : ${entréeConforme}🛜`);

            // Requête Overpass
            const query = `
            [out:json][timeout:25];
            area["name"="${entréeConforme}"]->.searchArea;
            (
            node["highway"="bus_stop"](area.searchArea);
            node["public_transport"="platform"](area.searchArea);
            );
            out count;
            `;

            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
            const reponse = await axios.get(url);

        // Extraction des données
        // Note: Overpass renvoie souvent le compte dans 'count' de l'objet racine avec 'out count'
            const count = reponse.data.elements ? reponse.data.elements[0].tags.total : 0;
            const nombreBus = parseInt(count, 10) || 0;

        // 3. Création de la ligne dans la DB
            await Bus.create({
                nombre: nombreBus.toString(), // Ton modèle Bus définit 'nombre' comme STRING
                ville: entréeConforme,
                codePostal: villeInfo ? villeInfo.codePostal : null
            });

            return res.status(200).json({
                data: nombreBus
            });

    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 504 || status === 429) {
                return res.status(503).json({ 
                    message: "Le service ne reconnait pas votre ville ou nombre de requète trop importante. Veuillez réessayer dans quelques instants." 
                });
            }
        }

        return res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
}

export default rechercheBus;