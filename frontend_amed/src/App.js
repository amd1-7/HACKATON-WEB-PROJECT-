import './App.css';
import Loyout from './CONTENENT/Loyout.js'
import Accueil from './CONTENENT/Accueil.js';
import { BrowserRouter,Route,Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Loyout>
        <Routes>
          <Route path='/' element={<Accueil/>}/>
        </Routes>
      </Loyout>
    </BrowserRouter>
  );
}

export default App;
