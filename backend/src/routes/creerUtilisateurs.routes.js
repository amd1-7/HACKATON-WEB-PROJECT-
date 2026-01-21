import { Router } from "express";
import creerUtilisateurs from "../controllers/creerUtilisateurs.controllers.js";
const routesCreerUtilisateurs = Router();
routesCreerUtilisateurs.post('/signup',creerUtilisateurs);

export default routesCreerUtilisateurs;