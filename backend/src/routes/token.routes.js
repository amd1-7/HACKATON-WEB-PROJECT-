import { Router } from "express";
import verifToken from "../middlewares/token.middlewares";

const routesToken = Router();

routesToken.post('/verif',verifToken)

export default routesToken;