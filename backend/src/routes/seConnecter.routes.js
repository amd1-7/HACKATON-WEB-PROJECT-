import { Router } from "express";
import seConnecter from "../controllers/seConnecter.controllers.js";

const routesSeConnecter = Router();
routesSeConnecter.post('/login',seConnecter);

export default routesSeConnecter;