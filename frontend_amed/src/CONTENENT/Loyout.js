import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './CSS/Loyout.css';

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
          <button onClick={changerTheme} className="theme-btn">
            {modeSombre ? 'MODE CLAIR ☀️' : 'MODE SOMBRE 🌙'}
          </button>
        </Nav>
      </Navbar>

      <Container style={{ marginTop: '150px', textAlign: 'center' }}>
        {children}
      </Container>
    </div>
  );
}

export default Loyout;