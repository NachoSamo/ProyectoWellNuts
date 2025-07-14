import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import RutaProtegida from './components/RutaProtegida';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Clientes from './pages/Clientes';

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas Protegidas */}
      <Route 
        path="/*" 
        element={
          <RutaProtegida>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/ventas" element={<Ventas />} />
              </Routes>
            </Layout>
          </RutaProtegida>
        }
      />
    </Routes>
  );
}

export default App;