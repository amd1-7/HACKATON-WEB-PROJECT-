import { Router } from "express";
import recherchesBus from "../controllers/rechercheBus.controllers.js";
import verifToken from "../middlewares/token.middlewares.js";

const routesRecherchesBus = Router();
routesRecherchesBus.post('/bus',verifToken,recherchesBus);

export default routesRecherchesBus;