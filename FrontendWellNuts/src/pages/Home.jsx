// src/pages/Home.jsx
import React from "react";
// Eliminamos la importación de Container, Row, Col de react-bootstrap
// import { Container, Row, Col } from "react-bootstrap"; 
import VentaMensual from "../components/graphs/VentaMensual";
import '../styles/glass.css'; // Asegúrate de que glass.css esté importado para que los estilos se apliquen
import StockXVariedad from "../components/graphs/StockXVariedad";
import IngresosXCostos from "../components/graphs/IngresosXCostos";
import VentasXCliente from "../components/graphs/VentasXCliente";

const Home = () => {
  return (
    <div className="container" style={{ maxWidth: "1600px" }}>
      {/* Reemplazamos el componente Container de react-bootstrap por un div simple */}
      <div className="glass-container">
        <h2 className="title-glass mb-1">Bienvenido!</h2>
        <p className="mb-4" style={{ color: "#fff" }}>
          Aquí podrás ver un resumen de las métricas más importantes de tu negocio.
        </p>
        <div>
          <VentaMensual />
        </div>
        <div>
          <StockXVariedad />
        </div>
        <div> 
          <IngresosXCostos />
        </div>
        <div>
          <VentasXCliente />
        </div>
      </div>
    </div>
  );
};

export default Home;
