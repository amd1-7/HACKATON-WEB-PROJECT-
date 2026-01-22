import { Router } from "express";
import recherchesPistesCyclables from "../controllers/recherchesPistesCyclables.js";
import verifToken from '../middlewares/token.middlewares.js'

const routesRecherchesPistesCyclables = Router();
routesRecherchesPistesCyclables.post('/piste-cyclable',recherchesPistesCyclables)

export default routesRecherchesPistesCyclables;