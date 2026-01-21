import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. AU CHARGEMENT DE LA PAGE : On vérifie s'il y a déjà un token stocké
  useEffect(() => {
    const tokenStocke = localStorage.getItem('userToken');
    const userStocke = localStorage.getItem('userInfo');

    if (tokenStocke && userStocke) {
      // Si on trouve un token, on reconnecte l'utilisateur automatiquement
      setUser(JSON.parse(userStocke));
    }
    setLoading(false);
  }, []);

  // 2. FONCTION LOGIN : On sauvegarde le token
  const login = (userData, token) => {
    // A. On met à jour l'état de React (pour l'affichage immédiat)
    setUser(userData);

    // B. 👇 C'EST ICI QUE LA MAGIE OPÈRE : On sauvegarde dans le navigateur
    localStorage.setItem('userToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // 3. FONCTION LOGOUT : On nettoie tout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);