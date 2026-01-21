import { Router } from "express";
import creerUtilisateurs from "../controllers/creerUtilisateurs.controllers.js";
import verifToken from "../middlewares/token.middlewares.js";
const routesCreerUtilisateurs = Router();
routesCreerUtilisateurs.post('/signup',creerUtilisateurs);

export default routesCreerUtilisateurs;