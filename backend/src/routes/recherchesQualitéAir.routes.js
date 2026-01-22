import { Router } from "express";
import recherchesAir from "../controllers/recherchesQualitéAir.controllers.js";
import verifToken from '../middlewares/token.middlewares.js';

const routesRecherchesAir = Router();
routesRecherchesAir.post('/air',verifToken,recherchesAir)

export default routesRecherchesAir;