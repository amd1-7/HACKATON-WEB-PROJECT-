import { Router } from "express";
import seConnecter from "../controllers/seConnecter.controllers.js";
import verifToken from "../middlewares/token.middlewares.js";

const routesSeConnecter = Router();
routesSeConnecter.post('/login',verifToken,seConnecter);

export default routesSeConnecter;