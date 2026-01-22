import { Router } from "express";
import recherchesEnergiesLogement from "../controllers/recherchesEnergieLogement.controllers.js";
import verifToken from '../middlewares/token.middlewares.js';

const routesRecherchesEnergiesLogement = Router();
routesRecherchesEnergiesLogement.post('/energie-logement',verifToken,recherchesEnergiesLogement)

export default routesRecherchesEnergiesLogement;