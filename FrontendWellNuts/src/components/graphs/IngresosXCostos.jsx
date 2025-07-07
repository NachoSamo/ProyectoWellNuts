import React, { useEffect, useState } from 'react';
import { obtenerRentabilidadProductos } from '../../services/productosService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const getColorClass = (porcentaje) => {
  if (porcentaje < 50) return 'negative';
  if (porcentaje <= 100) return 'warning';
  return 'positive';
};

const getBarColor = (porcentaje) => {
  if (porcentaje < 50) return 'rgba(239, 68, 68, 0.7)'; // rojo
  if (porcentaje <= 100) return 'rgba(234, 179, 8, 0.7)'; // amarillo
  return 'rgba(34, 197, 94, 0.7)'; // verde
};

const IngresosXCostos = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentabilidad = await obtenerRentabilidadProductos();
        setDatos(rentabilidad);
      } catch (err) {
        console.error('Error al obtener rentabilidad:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="chart-card text-light">Cargando datos de rentabilidad...</div>;
  }

  if (!Array.isArray(datos) || datos.length === 0) {
    return <div className="chart-card text-light">No hay datos para mostrar.</div>;
  }

  // Ordenar por mayor porcentaje de ganancia
  const datosOrdenados = [...datos].sort((a, b) => b.porcentaje_ganancia - a.porcentaje_ganancia);

  const productoMayorPorcentaje = datosOrdenados[0];
  const productoMenorPorcentaje = datosOrdenados[datosOrdenados.length - 1];

  // === Gráfico: porcentaje de rentabilidad (%)
  const labels = datosOrdenados.map(d => d.nombre_presentacion);
  const data = {
    labels,
    datasets: [
      {
        label: 'Rentabilidad (%)',
        data: datosOrdenados.map(d => d.porcentaje_ganancia),
        backgroundColor: datosOrdenados.map(d => getBarColor(d.porcentaje_ganancia)),
        borderWidth: 1,
        borderColor: '#1e293b',
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x.toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Porcentaje de rentabilidad',
          color: '#e2e8f0',
        },
        ticks: {
          color: '#e2e8f0',
          callback: (value) => `${value}%`,
        },
        grid: {
          color: '#334155',
        },
      },
      y: {
        ticks: { color: '#e2e8f0' },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="chart-card">
      <h4 className="text-white mb-4">Rentabilidad por Producto</h4>

      {/* === Tarjetas === */}
      <div className="d-flex flex-wrap justify-content-between gap-4 mb-5">
        <div className="metric-card flex-fill">
          <div className="metric-title">Producto más rentable</div>
          <div className="metric-value">{productoMayorPorcentaje.nombre_presentacion}</div>
          <div className={`metric-change ${getColorClass(productoMayorPorcentaje.porcentaje_ganancia)}`}>
            {productoMayorPorcentaje.porcentaje_ganancia.toFixed(2)}%
          </div>
        </div>
        <div className="metric-card flex-fill">
          <div className="metric-title">Producto menos rentable</div>
          <div className="metric-value">{productoMenorPorcentaje.nombre_presentacion}</div>
          <div className={`metric-change ${getColorClass(productoMenorPorcentaje.porcentaje_ganancia)}`}>
            {productoMenorPorcentaje.porcentaje_ganancia.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* === Gráfico === */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default IngresosXCostos;
