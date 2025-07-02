// src/pages/Home.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Home = () => {
  return (
  <div className="container px-20 py-10">
    <Container className="glass-container ">
      <h2 className="title-glass mb-1">Bienvenido!</h2>
      <p className="mb-4" style={{ color: "#fff" }}>
        Aquí podrás ver un resumen de las métricas más importantes de tu negocio.
        Utiliza los enlaces de navegación para acceder a las diferentes secciones.
      </p>

      {/* Métricas */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <div className="metric-card">
            <div className="metric-title">Total de Ventas</div>
            <div className="metric-value">$25,000</div>
            <div className="metric-change positive">+15%</div>
          </div>
        </Col>
        <Col md={6}>
          <div className="metric-card">
            <div className="metric-title">Cliente Destacado</div>
            <div className="metric-value">Acme Corp</div>
            <div className="metric-change positive">+20%</div>
          </div>
        </Col>
      </Row>

      {/* Card para gráfico */}
      <div className="chart-card">
        <div className="metric-title">Rendimiento mensual</div>
        <div className="metric-value">$25,000</div>
        <div className="metric-change positive">Este mes +15%</div>

        {/* Lugar reservado para gráfico */}
        <div className="chart-placeholder mt-4">
          {/* Acá podés insertar un gráfico con Recharts o Chart.js */}
        </div>
      </div>
    </Container>
  </div>
  );
};

export default Home;
