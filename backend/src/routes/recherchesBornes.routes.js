import { Router } from "express";
import recherchesBornes from "../controllers/recherchesBornes.controllers.js";
import verifToken from "../middlewares/token.middlewares.js";

const routesRecherchesBornes = Router();
routesRecherchesBornes.post('/borne',recherchesBornes)

export default routesRecherchesBornes;