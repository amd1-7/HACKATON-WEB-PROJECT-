import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";

const utilisateurs = sequelize.models.Utilisateur;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const creerUtilisateurs = async(req,res)=>{
    try {
        const {mail,password,verifyPassword} = req.body /* La requète client */
        /* Enlever maj et espeace du email */
            const mailCorrect = mail.toLowerCase().trim();


    /* Verification si le mail entré est un mail */
    if (!regexEmail.test(mail)) {
      return res
        .status(400)
        .json({ message: "Le mail entré n'est pas conforme." });
    }

    /* Verification si le mail existe */
    const verifMailExiste = await utilisateurs.findOne({
      where: { mail: mailCorrect },
    });
    if (verifMailExiste) {
      return res
        .status(409)
        .json({
          message: "Ce mail est dejà utilisé, veuillez changer de mail.",
        });
    }

    /* Verification mot de passe */
    if (password !== verifyPassword) {
      return res
        .status(409)
        .json({ message: "Les mots de passe ne sont pas identiques" });
    }
    /* Complexité du hashage */
    const hash = 10;
    /* Hashage du mot de passe */
    const passwordHash = await bcrypt.hash(password, hash);

    /* Création du nouvel utilisateur */
    const nouvelUtilisateur = await utilisateurs.create({
      mail: mailCorrect,
      password: passwordHash,
    });

    /* Securisation du mdp */
    const utilisateurReponse = nouvelUtilisateur.toJSON();
    delete utilisateurReponse.password;

    console.log("Création du compte lié à ce mail:", mailCorrect);
    return res.status(200).json({
      message: "Creation du compte reussi✅",
      data: utilisateurReponse,
    });
  } catch (error) {
    console.log("Erreur de création du compte", error);
    return res.status(500).json({
      message: "Erreur de création du compte. Réessayez plus tard",
      error: error.message,
    });
  }
};
export default creerUtilisateurs;
