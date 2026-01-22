import React from 'react';
import './CSS/Accueil.css';

/* Images exemples (Paris vs Campagne) */
const parisUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop";
const campagneUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop";

function Accueil() {
  return (
    <div className="accueil-conteneur">
      
      {/* Barre de recherche */}
      <div className="recherche-wrapper">
        <label htmlFor="ville-input" className="recherche-label">
          Recherche Ta Ville
        </label>
        <input 
          id="ville-input"
          type="text" 
          className="nature-recherche" 
          placeholder="Ex: Paris, Lyon, Marseille..."
        />
      </div>

      <div className="info-blocks-container">
        
        <div className="pair-container">
          
          <div className="nature-block">
            <h3>Quelles Grandes villes est la plus respectieuse de l'environnment ?</h3>
            <p>
              Dans les grandes villes, les municipalités se concentrent sur la réduction de la pollution, 
              les transports propres et la végétalisation des toits pour lutter contre les îlots de chaleur.
              mais la quelle est la plus impliqué dans cette lutte ? il suffit de faire une recherche sur notre site.
            </p>
          </div>

          <div className="cadre-photo">
            <img src={parisUrl} alt="Paris Ville" className="photo-interne" />
          </div>

        </div>

        <div className="pair-container">
        
          <div className="nature-block">
            <h3>Nos commmunes sont-elles impliquées dans les Luttes environnementales ?</h3>
            <p>
              Nos communes parfois sous financées peuvent-ils assumer le combat pour une planète plus saine ?
              Ou au contraire par manque de moyen relègue cette lutte International au second plan?
              Pour le savoir il suffit encore de faire une recherche sur notre site😉
            </p>
          </div>

          {/* 2. L'Image dans son cadre (En bas) */}
          <div className="cadre-photo">
            <img src={campagneUrl} alt="Campagne France" className="photo-interne" />
          </div>

        </div>

      </div>
      
    </div>
  );
}

export default Accueil;