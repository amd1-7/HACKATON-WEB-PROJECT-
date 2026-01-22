import { Router } from "express";
import recherchesPistesCyclables from "../controllers/recherchesPistesCyclables.js";
import verifToken from '../middlewares/token.middlewares.js'

const routesRecherchesPistesCyclables = Router();
routesRecherchesPistesCyclables.post('/pisteCyclable',verifToken,recherchesPistesCyclables)

export default routesRecherchesPistesCyclables;