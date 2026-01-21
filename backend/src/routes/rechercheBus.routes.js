import { Router } from "express";
import rechercheBus from "../controllers/rechercheBus.controllers.js";
import verifToken from "../middlewares/token.middlewares.js";

const routesRechercheBus = Router();
routesRechercheBus.post('/bus',verifToken,rechercheBus);

export default routesRechercheBus;