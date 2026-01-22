import axios from "axios";
import { sequelize } from "../config/db.js";

const Commune = sequelize.models.Commune;
const Borne = sequelize.models.Borne;

const recherchesBornes = async (req,res)=>{
    try {
        const {entrée} = req.body

        /* Conformiser l'input */
            const entréeConforme = entrée.charAt(0).toUpperCase() + entrée.slice(1).toLowerCase().trim();
        /* Verif si commune existe */
            const communeExiste = await Commune.findOne({
                where:{
                    commune:entréeConforme
                }
            })
            /* Si existe pas renvoie une erreur */
            if(!communeExiste){
                return res.status(400).json({
                    message:"Erreur de saisie, votre saisie n'est surement pas une ville existante."
                })
            }
   const bornesEnDb = await Borne.findAll({
            where:{ commune: entréeConforme }
        });

        if(bornesEnDb.length > 0){
            // On additionne le champ 'nombre' de toutes les lignes trouvées en DB
            const totalDb = bornesEnDb.reduce((acc, b) => acc + parseInt(b.nombre || 0), 0);
            
            return res.status(200).json({
                data: totalDb // On renvoie la somme
            })
        }

        /* --- APPEL API --- */
        console.log(`🛜 Recherche api pour : ${entréeConforme}🛜`)
        
        // Ajout de &rows=100 pour être sûr de récupérer assez de bornes (par défaut c'est souvent 10)
        const url = `https://opendata.reseaux-energies.fr/api/records/1.0/search/?dataset=bornes-irve&q=${encodeURIComponent(entréeConforme)}&rows=100`
        
        const reponse = await axios.get(url)
        
        if(!reponse.data || !reponse.data.records){
            return res.status(404).json({
                message:"Erreur lors de l'appel API"
            })
        }

        // On mappe les données
        const data = reponse.data.records.map(borne=>({
            adresse: borne.fields.ad_station || "Pas d'adresse repertorié",
            nom: borne.fields.nom_station || "Pas de nom repertorié",
            // On s'assure que c'est bien un nombre (parseInt)
            nombre: parseInt(borne.fields.nbre_pdc, 10) || 1, 
            commune: entréeConforme,
        }))

        // CALCUL DE LA SOMME
        // reduce parcourt le tableau 'data' et additionne la propriété 'nombre'
        const totalBornes = data.reduce((accumulateur, élémentActuel) => {
            return accumulateur + élémentActuel.nombre;
        }, 0); // 0 est la valeur de départ

        console.log(`Insertion de ${data.length} stations pour un total de ${totalBornes} prises.`);

        await Borne.bulkCreate(data)

        return res.status(200).json({
            data: totalBornes, // On renvoie le TOTAL calculé
            message: "Données récupérées et calculées depuis l'API"
        })
    } catch (error) {
         console.log(`Erreur d'importation :${error}`);
         return res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
}

export default recherchesBornes;