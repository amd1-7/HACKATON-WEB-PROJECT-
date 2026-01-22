import React from 'react';
import './CSS/Accueil.css'; // Assure-toi que le chemin est bon

function Accueil() {
  return (
    <div className="accueil-content">
      
      <div className="search-wrapper">
        <label htmlFor="ville-input" className="search-label">
          Recherche Ta Ville
        </label>
        
        <input 
          id="ville-input"
          type="text" 
          className="nature-search" 
          placeholder="Ex: Paris, Lyon, Marseille..."
        />
      </div>

      <div className="info-blocks-container">
        
        {/* Bloc de Gauche : Action directe */}
        <div className="nature-block">
          <h3>Actions Locales Concrètes</h3>
          <p>
            Les municipalités sont en première ligne de la transition écologique. 
            Par la gestion quotidienne des déchets, le développement des espaces verts 
            urbains et la promotion active des mobilités douces (vélo, marche), 
            elles agissent directement sur notre cadre de vie.
          </p>
        </div>

        {/* Bloc de Droite : Planification */}
        <div className="nature-block">
          <h3>Planification Durable</h3>
          <p>
            Au-delà du quotidien, les communes pilotent l'urbanisme futur via les Plans Locaux d'Urbanisme (PLU). 
            Elles investissent dans la rénovation énergétique des bâtiments publics et l'éclairage intelligent, 
            réduisant significativement l'empreinte carbone du territoire.
          </p>
        </div>

      </div>
      {/* --- Fin des nouveaux blocs --- */}

    </div>
  );
}

export default Accueil;