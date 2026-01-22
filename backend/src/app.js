import express from 'express';
import cors from 'cors';
/* IMPORTTATION AUTH */
    import routesCreerUtilisateurs from './routes/creerUtilisateurs.routes.js';
    import routesSeConnecter from './routes/seConnecter.routes.js';
/* IMPORTATION API_RECHERCHE */
    import routesRecherchesBus from './routes/recherchesBus.routes.js';
    import routesRecherchesBornes from './routes/recherchesBornes.routes.js';
    import routesRecherchesPistesCyclables from './routes/recherchesPistesCyclables.js';
    import routesRecherchesAir from './routes/recherchesQualitéAir.routes.js';
    import routesRecherchesEnergiesLogement from './routes/recherchesEnergieLogement.js';
    import routesToken from './routes/token.routes.js';
const app = express()
app.use(cors())
app.use(express.json())

/* API AUTH */
    app.use('/api/auth',routesCreerUtilisateurs);
    app.use('/api/auth',routesSeConnecter);
/* API RECHERCHE */
    app.use('/recherche',routesRecherchesBus);
    app.use('/recherche',routesRecherchesBornes);
    app.use('/recherche',routesRecherchesPistesCyclables);
    app.use('/recherche',routesRecherchesAir);
    app.use('/recherche',routesRecherchesEnergiesLogement)

    app.use('/token',routesToken)
export default app;