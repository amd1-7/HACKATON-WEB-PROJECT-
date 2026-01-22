import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './CSS/Loyout.css';

// 1. Remplace 'enfant' par '{ children }' (c'est la façon standard de récupérer le contenu)
function Loyout({ children }) {
  const [modeSombre, setModeSombre] = useState(false);

  const changerTheme = () => {
    setModeSombre(!modeSombre);
  };

  useEffect(() => {
    if (modeSombre) {
      document.body.classList.add('body-dark');
    } else {
      document.body.classList.remove('body-dark');
    }
  }, [modeSombre]);

  return (
    <div>
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

          <button onClick={changerTheme} className="theme-btn">
            {modeSombre ? 'MODE CLAIR ☀️' : 'MODE SOMBRE 🌙'}
          </button>
        </Nav>
      </Navbar>

      <Container style={{ marginTop: '150px', textAlign: 'center' }}>
        {/* 2. C'est ICI qu'il faut dire à React d'afficher le contenu (ton Accueil) */}
        {children}
      </Container>
    </div>
  );
}

export default Loyout;