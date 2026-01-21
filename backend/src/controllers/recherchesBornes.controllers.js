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
        /* SI elle existe est ce que elle est déja dans la DB */
            const borneVerif = await Borne.findOne({
                where:{
                    commune:entréeConforme
                }
            })
            /* Si existe déja retourner la data */
            if(borneVerif){
                return res.status(200).json({
                    data:borneVerif.nombre
                })
            }
        /* Sinon faire un appel APi */
            console.log(`🛜 Recherche api pour : ${entréeConforme}🛜`)
            /* URL à contacter pour la DATA */
            const url = `https://opendata.reseaux-energies.fr/api/records/1.0/search/?dataset=bornes-irve&q=${encodeURIComponent(entréeConforme)}&rows=50`
            
            const reponse = await axios.get(url)
            
            if(!reponse.data || !reponse.data.records){
                return res.status(404).json({
                    message:"Erreur lors de l'appel API"
                })
            }

            const data = reponse.data.records.map(borne=>({
                adresse:borne.fields.ad_station || "Pas d'adresse repertorié",
                nom:borne.fields.nom_station || "Pas de nom repertorié",
                nombre:borne.fields.nbre_pdc || 1,
                commune: entréeConforme,
            }))

            console.log(`Insertion de ${data.length} borne de recharge`)

            await Borne.bulkCreate(data)
            return res.status(200).json({
                data:data
            })
    } catch (error) {
         console.log(`Erreur d'importation :${error}`);
         return res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
}

export default recherchesBornes;