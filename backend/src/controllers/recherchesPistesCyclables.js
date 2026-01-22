import axios from "axios";
import { sequelize } from "../config/db.js";

const Commune = sequelize.models.Commune;
const Piste_cyclable = sequelize.models.Piste_cyclable;

const recherchesPistesCyclables = async (req, res) => {
    try {
        const { entrée } = req.body;
        
        /* Conformisation de l'input */
        const entréeConforme = entrée.charAt(0).toUpperCase() + entrée.slice(1).toLowerCase().trim();

        /* Verif commune existe */
        const verifCommune = await Commune.findOne({
            where: {
                commune: entréeConforme
            }
        });

        if (!verifCommune) {
            return res.status(400).json({ message: "Ville non reconnue" });
        }

        /* Verif si piste existe DÉJÀ dans la db (Cache) */
        const verifPiste = await Piste_cyclable.findOne({
            where: {
                commune: entréeConforme
            }
        });

        if (verifPiste) {
            return res.status(200).json({ 
                message: "Données récupérées depuis le cache",
                data: verifPiste.nombre 
            });
        }

        /* Appel API OVERPASS (Source Stable) */
        console.log(`🛜 Recherche Overpass pour : ${entréeConforme} 🛜 | PISTES CYCLABLES`);

        /* Cette requête compte les routes qui SONT des pistes ou QUI ONT une piste */
        const query = `
        [out:json][timeout:25];
        area["name"="${entréeConforme}"]->.searchArea;
        (
          way["highway"="cycleway"](area.searchArea);
          way["cycleway"](area.searchArea);
          way["cycleway:left"](area.searchArea);
          way["cycleway:right"](area.searchArea);
          way["bicycle"="designated"](area.searchArea);
        );
        out count;
        `;

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        const reponse = await axios.get(url);

        const count = (reponse.data.elements && reponse.data.elements.length > 0) 
            ? reponse.data.elements[0].tags.total 
            : 0;
        
        const segmentPiste = parseInt(count, 10);

        console.log(`Insertion de ${segmentPiste} segments cyclables pour ${entréeConforme}`);

        /* 4. Sauvegarde */
        await Piste_cyclable.create({
            commune: entréeConforme,
            codePostal: verifCommune.codePostal,
            nombre: segmentPiste
        });

        return res.status(200).json({
            message: "Données récupérées depuis l'API Overpass",
            data: segmentPiste 
        });

    } catch (error) {
        console.log(`Erreur pistes cyclables : ${error.message}`);
        
        /* Gestion spécifique de la surcharge Overpass */
        if (error.response && error.response.status === 429) {
            return res.status(503).json({ message: "Serveur carto surchargé, réessayez." });
        }

        return res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
}

export default recherchesPistesCyclables;