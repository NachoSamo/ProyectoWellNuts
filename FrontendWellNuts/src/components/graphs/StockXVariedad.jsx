// src/components/graphs/StockXVariedad.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { getStockVariedades } from '../../services/variedadProductoService';

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

  return (
    <div className="graph-card">
      <h5>Stock</h5>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis type="category" dataKey="nombre_variedad" stroke="#94a3b8" />
          <Tooltip formatter={(value) => `${value}g`} />
          <Bar dataKey="stock_gramos" fill="#f59e0b" barSize={20} radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Envuelve el componente con React.memo para optimizar el rendimiento
export default React.memo(StockXVariedad);
