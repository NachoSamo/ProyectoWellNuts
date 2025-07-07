import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { getStockVariedades } from '../../services/variedadProductoService';

const getBarColor = (stock) => {
  if (stock < 1000) return 'rgba(239, 68, 68, 0.7)'; // rojo
  if (stock <= 3000) return 'rgba(234, 179, 8, 0.7)'; // amarillo
  return 'rgba(34, 197, 94, 0.7)'; // verde
};

const StockXVariedad = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getStockVariedades();
        setData(res.data);
      } catch (error) {
        console.error('Error al cargar stock por variedad:', error);
      }
    }
    fetchData();
  }, []);

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="chart-card">No hay datos de stock disponibles.</div>;
  }

  const variedadMayorStock = data.reduce((max, curr) => (curr.stock_gramos > max.stock_gramos ? curr : max), data[0]);
  const variedadMenorStock = data.reduce((min, curr) => (curr.stock_gramos < min.stock_gramos ? curr : min), data[0]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: '#0f172a',
            padding: '8px 12px',
            borderRadius: '8px',
            color: '#f8fafc',
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ fontWeight: 600 }}>{label}</div>
          <div>{`${payload[0].name}: ${payload[0].value.toLocaleString()}g`}</div>
        </div>
      );
    }

    return null;
  };


  return (
    <div className="chart-card d-flex flex-wrap justify-content-between align-items-start gap-4">
      <div style={{ flex: '1 1 50%' }}>
        <h5 className="text-white mb-3">Stock por Variedad</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, left: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis
              type="category"
              dataKey="nombre_variedad"
              stroke="#94a3b8"
              width={150}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="stock_gramos"
              barSize={18}
              radius={[5, 5, 0, 0]}
              fill="#facc15"
              label={{ position: 'right', fill: '#e2e8f0' }}
            >
              {
                data.map((entry, index) => (
                  <cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.stock_gramos)}
                  />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className="d-flex flex-column justify-content-between gap-3"
        style={{ flex: 1, marginTop: '30px', height: '300px' }}
      >
        <div
          className="metric-card"
          style={{
            minWidth: '260px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div className="metric-title">Mayor stock disponible</div>
          <div className="metric-value">{variedadMayorStock.nombre_variedad}</div>
          <div className="metric-change positive">{variedadMayorStock.stock_gramos.toLocaleString()}g</div>
        </div>

        <div
          className="metric-card"
          style={{
            minWidth: '260px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div className="metric-title">Menor stock disponible</div>
          <div className="metric-value">{variedadMenorStock.nombre_variedad}</div>
          <div className="metric-change negative">{variedadMenorStock.stock_gramos.toLocaleString()}g</div>
        </div>
      </div>

    </div>
  );
};

export default React.memo(StockXVariedad);
