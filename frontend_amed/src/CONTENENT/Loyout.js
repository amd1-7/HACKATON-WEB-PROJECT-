import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './CSS/Loyout.css';

function Loyout() {
  const [modeSombre, setModeSombre] = useState(false);

  // Fonction pour basculer le mode
  const changerTheme = () => {
    setModeSombre(!modeSombre);
  };

  // Effet pour changer la couleur de fond de toute la page (body)
  useEffect(() => {
    if (modeSombre) {
      document.body.classList.add('body-dark');
    } else {
      document.body.classList.remove('body-dark');
    }
  }, [modeSombre]);

  return (
    <div style={{height:"20000vw"}}>
      <Navbar className={`nature-navbar ${modeSombre ? 'dark-mode' : ''}`}>
        <Nav className="nature-nav">
          <Nav.Link href="#home" className="nature-link">
            Accueil
          </Nav.Link>
          <Nav.Link href="#features" className="nature-link">
            Classement
          </Nav.Link>
          <Nav.Link href="#pricing" className="nature-link">
            Océan
          </Nav.Link>

          {/* Bouton pour changer le thème */}
          <button onClick={changerTheme} className="theme-btn">
            {modeSombre ? 'MODE CLAIR ☀️' : 'MODE SOMBRE 🌙'}
          </button>
        </Nav>
      </Navbar>

      <Container style={{ marginTop: '150px', textAlign: 'center' }}>
      </Container>
    </div>
  );
}

export default Loyout;