import React from 'react'; 
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; 
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/glass.css';

// 1. Obtener el elemento raíz del DOM
const container = document.getElementById('root');

// 2. Crear la raíz usando la función importada 'createRoot'
const root = createRoot(container);

// 3. Renderizar la aplicación dentro de la raíz
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> 
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);