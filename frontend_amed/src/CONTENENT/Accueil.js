import React, { useState } from 'react';
import './CSS/Accueil.css';

/* Importation des services */
import recherchesBusServices from '../services/recherchesBus.services';
import recherchesBornesServices from '../services/recherchesBornes.services';
import recherchesPistesCyclablesServices from '../services/recherchesPistesCyclables.services';
import recherchesQualitéAirServices from '../services/recherchesQualitéAir.services';
import recherchesEnergieLogementServices from '../services/recherchesEnergieLogement.services';

const parisUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop";
const campagneUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop";

function Accueil() {
  const [ville, setVille] = useState("");
  const [resultats, setResultats] = useState(null); 
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [noteGlobale, setNoteGlobale] = useState(0);

  /* --- 1. CALCUL DE LA NOTE (Sur 100) --- */
  const calculerNote = (res) => {
    let score = 0;

    // BUS (Max 20 points)
    const nbBus = (res.bus && typeof res.bus.data === 'number') ? res.bus.data : 0;
    score += Math.min(20, nbBus / 2);

    // BORNES (Max 20 points)
    const nbBornes = (res.bornes && typeof res.bornes.data === 'number') ? res.bornes.data : 0;
    score += Math.min(20, nbBornes);

    // PISTES CYCLABLES (Max 20 points)
    const nbPistes = (res.pistes && typeof res.pistes.data === 'number') ? res.pistes.data : 0;
    score += Math.min(20, nbPistes / 2);

    // AIR (Max 20 points)
    const qualiteAir = res.air?.data?.qualite;
    if (qualiteAir === "Bon" || qualiteAir === "Très bon") score += 20;
    else if (qualiteAir === "Moyen") score += 10;
    // Mauvais = 0

    // ENERGIE (Max 20 points)
    let tauxPassoires = 0;
    if (res.energie?.data?.taux_passoires) {
        // On transforme "35.5%" en nombre 35.5
        tauxPassoires = parseFloat(res.energie.data.taux_passoires.replace('%', '')) || 0;
    }
    // Formule : Moins il y a de passoires, mieux c'est. 
    // 0% passoire = 20 pts. 60% passoire = 0 pts.
    const scoreEnergie = Math.max(0, 20 - (tauxPassoires / 3)); 
    score += scoreEnergie;

    return Math.round(score);
  };

  /* ---  ANALYSE INDIVIDUELLE (Pour les couleurs des jauges) --- */
  const analyserResultat = (type, response) => {
    // Si pas de réponse ou données vides
    if (!response || response.data === undefined) {
      return { classe: 'niveau-mauvais', label: 'Indisponible' };
    }

    // Cas spécial : AIR
    if (type === 'air') {
       const qualite = response.data.qualite; 
       if (qualite === "Bon" || qualite === "Très bon") return { classe: 'niveau-bon', label: 'Bon Air' };
       if (qualite === "Moyen") return { classe: 'niveau-moyen', label: 'Moyen' };
       return { classe: 'niveau-mauvais', label: 'Pollué' };
    }

    // Cas générique : Si c'est un nombre (Bus, Bornes, Pistes)
    if (typeof response.data === 'number') {
        if (response.data === 0) return { classe: 'niveau-mauvais', label: 'Inexistant' };
        if (response.data > 20) return { classe: 'niveau-bon', label: 'Excellent' };
        return { classe: 'niveau-moyen', label: 'Correct' };
    }

    return { classe: 'niveau-bon', label: 'Données Reçues' };
  };

  /* --- 3. FONCTION PRINCIPALE DE RECHERCHE --- */
  const lancerRecherche = async (e) => {
    if (e.key === 'Enter' && ville.trim() !== "") {
      setChargement(true);
      setErreur("");
      setResultats(null);
      setNoteGlobale(0);

      try {
        const payload = { entrée: ville }; 
        const delaiMinimum = new Promise(resolve => setTimeout(resolve, 1500));

        // Fonction "Wrapper" pour gérer les erreurs individuellement
        const appelSecurise = async (promesse) => {
            try {
                return await promesse;
            } catch (err) {
                // 🛑 SI C'EST UNE VILLE INCONNUE (Erreur 400 du backend) on arrête tout l'affichage.
                if (err.message && (err.message.includes("Erreur de saisie") || err.message.includes("Ville non reconnue"))) {
                    throw err; 
                }
                
                // si bug technique juste erreur
                console.warn("Un service a échoué (non critique) :", err);
                return null;
            }
        };

        // Lancement des 5 requêtes sécurisées
        const appelsAPI = Promise.all([
            appelSecurise(recherchesBusServices(payload)),
            appelSecurise(recherchesBornesServices(payload)),
            appelSecurise(recherchesPistesCyclablesServices(payload)),
            appelSecurise(recherchesQualitéAirServices(payload)),
            appelSecurise(recherchesEnergieLogementServices(payload))
        ]);

        // On Force larret avec un delai
        const [[bus, bornes, pistes, air, energie]] = await Promise.all([
          appelsAPI,
          delaiMinimum
        ]);

        const nouveauxResultats = { bus, bornes, pistes, air, energie };
        
        // Resultat
        setResultats(nouveauxResultats);
        const noteCalculee = calculerNote(nouveauxResultats);
        setNoteGlobale(noteCalculee);

      } catch (err) {
        console.error("Recherche stoppée :", err);
        setErreur(err.message || "Une erreur est survenue.");
        setResultats(null); // On s'assure de ne rien afficher
      } finally {
        setChargement(false);
      }
    }
  };

  /* --- 4. TEXTES ET COULEURS DU VERDICT --- */
  const getVerdictInfo = (note) => {
      if (note >= 75) {
          return {
              texte: `Ville super agréable à vivre portée sur l'environnement ! Elle est clairement dans le vent de la responsabilisation en terme de manœuvre environnementale.`,
              couleur: "#22c55e", // Vert
              titre: "EXCELLENT"
          };
      } else if (note >= 50) {
          return {
              texte: `Bonne ville assez engagée. Dans la moyenne des villes françaises, ${ville} n'a pas encore totalement passé le cap dans la mise en œuvre de démarches environnementales profondes.`,
              couleur: "#f59e0b", // Orange
              titre: "PAS MAL"
          };
      } else {
          return {
              texte: `Ville pas trop engagée... Clairement en retard, ${ville} n'a pas encore saisi tous les enjeux de cette lutte écologique.`,
              couleur: "#ef4444", // Rouge
              titre: "PEUT MIEUX FAIRE"
          };
      }
  };

  const verdict = getVerdictInfo(noteGlobale);

  return (
    <div className="accueil-conteneur">
      
      {/* --- BARRE DE RECHERCHE --- */}
      <div className="recherche-wrapper">
        <label htmlFor="ville-input" className="recherche-label">Recherche Ta Ville</label>
        <input 
          id="ville-input" type="text" className="nature-recherche" 
          placeholder="Ex: Paris, Lyon, Bordeaux..."
          value={ville} onChange={(e) => setVille(e.target.value)} onKeyDown={lancerRecherche}
          disabled={chargement}
        />
      </div>

      {/* --- CHARGEMENT --- */}
      {chargement && (
        <div style={{ margin: '20px', fontSize: '1.2rem', color: '#1b5e20' }}>
          🌿 Analyse écologique de {ville} en cours...
        </div>
      )}
      
      {/* --- ERREUR (S'affiche SEULE si la ville n'existe pas) --- */}
      {erreur && <p style={{color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem'}}>{erreur}</p>}

      {/* --- RÉSULTATS (Ne s'affichent QUE si tout est OK) --- */}
      {resultats && !chargement && !erreur && (
        <>
            {/* 1. GRILLE DES CARTES */}
            <div className="resultats-container">
                <h3 style={{textAlign: 'center', color: '#1b5e20', fontSize:'2rem', margin:'30px 0'}}>
                Résultats pour : {ville.toUpperCase()}
                </h3>

                <CarteResultat 
                    titre="Réseau de Bus" 
                    data={resultats.bus} 
                    analyse={analyserResultat('bus', resultats.bus)}
                    icon="🚌"
                    texteDonnee={resultats.bus?.data ? `${resultats.bus.data} arrêts trouvés` : "Non détecté"}
                />
                <CarteResultat 
                    titre="Bornes de Recharge" 
                    data={resultats.bornes} 
                    analyse={analyserResultat('bornes', resultats.bornes)}
                    icon="⚡"
                    texteDonnee={(resultats.bornes && resultats.bornes.data !== undefined) ? `${resultats.bornes.data} prises de recharge` : "Aucune borne trouvée"}
                />
                <CarteResultat 
                    titre="Pistes Cyclables" 
                    data={resultats.pistes} 
                    analyse={analyserResultat('pistes', resultats.pistes)}
                    icon="🚲"
                    texteDonnee={resultats.pistes?.data ? `${resultats.pistes.data} segments` : "Pas de pistes"}
                />
                <CarteResultat 
                    titre="Qualité de l'Air" 
                    data={resultats.air} 
                    analyse={analyserResultat('air', resultats.air)}
                    icon="🍃"
                    texteDonnee={resultats.air?.data?.qualite || "Donnée indisponible"}
                />
                <CarteResultat 
                    titre="Passoires Thermiques" 
                    data={resultats.energie} 
                    analyse={analyserResultat('energie', resultats.energie)}
                    icon="🏠"
                    texteDonnee={
                        (resultats.energie?.data && resultats.energie.data.taux_passoires)
                        ? `${resultats.energie.data.taux_passoires} de passoires` 
                        : "Donnée indisponible"
                    }
                />
            </div>

            {/* 2. BLOC VERDICT GLOBAL */}
            <div className="verdict-container" style={{ borderColor: verdict.couleur }}>
                <div className="note-circle" style={{ backgroundColor: verdict.couleur }}>
                    {noteGlobale}
                </div>
                <div className="verdict-titre" style={{ color: verdict.couleur }}>
                    {verdict.titre}
                </div>
                <div className="verdict-texte" style={{ color: verdict.couleur }}>
                    {verdict.texte}
                </div>
            </div>
        </>
      )}

      {/* --- CONTENU STATIQUE (Toujours visible en bas) --- */}
      <div className="info-blocks-container">
        <div className="pair-container">
          <div className="nature-block">
            <h3>Quelles Grandes villes sont les plus respectueuses ?</h3>
            <p>Dans les grandes villes, les municipalités se concentrent sur la réduction de la pollution et l'amélioration de la qualité de vie urbaine.</p>
          </div>
          <div className="cadre-photo"><img src={parisUrl} alt="Paris Ville" className="photo-interne" /></div>
        </div>
        <div className="pair-container">
          <div className="nature-block">
            <h3>Nos communes sont-elles impliquées ?</h3>
            <p>Nos communes parfois sous-financées peuvent-elles assumer le combat pour une planète plus saine et durable ?</p>
          </div>
          <div className="cadre-photo"><img src={campagneUrl} alt="Campagne France" className="photo-interne" /></div>
        </div>
      </div>
      
    </div>
  );
}

/* COMPOSANT ENFANT : Carte unique pour chaque résultat */
function CarteResultat({ titre, data, analyse, icon, texteDonnee }) {
  return (
    <div className="resultat-card">
      <div className="resultat-info">
        <h4>{icon} {titre}</h4>
        <p style={{ fontWeight: 'bold', color: '#555' }}>{texteDonnee}</p>
      </div>
      <div className="jauge-wrapper">
        <span className="jauge-label" style={{ 
            color: analyse.classe === 'niveau-bon' ? '#22c55e' : 
                   analyse.classe === 'niveau-moyen' ? '#f59e0b' : '#ef4444' 
        }}>{analyse.label}</span>
        <div className="jauge-barre-fond">
          <div className={`jauge-niveau ${analyse.classe}`}></div>
        </div>
      </div>
    </div>
  );
}

export default Accueil;