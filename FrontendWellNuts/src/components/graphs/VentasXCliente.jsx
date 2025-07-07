// src/components/graphs/VentasXCliente.jsx
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Tooltip, Cell, ResponsiveContainer
} from 'recharts';
import {
  getTopClienteMes,
  getTotalVentasPorCliente
} from '../../services/ventasService';

const COLORS = ['#22c55e', '#facc15', '#38bdf8', '#f97316', '#a855f7', '#ef4444'];

const VentasXCliente = () => {
  const [data, setData] = useState([]);
  const [topMes, setTopMes] = useState(null);
  const [topHistorico, setTopHistorico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [allClientsSalesRes, mesRes] = await Promise.all([
          getTotalVentasPorCliente(), // Esto ahora trae todos los clientes con 'cliente' y 'total_ventas'
          getTopClienteMes() // Esto trae 'id_cliente', 'cliente', 'total_mes'
        ]);

        // Mapear los datos para el PieChart y el cálculo del top histórico
        // Asegúrate de que las propiedades coincidan con lo que devuelve tu backend
        // Ejemplo: { id_cliente: 1, cliente: "Nombre Cliente", total_ventas: 1234 }
        const mappedData = allClientsSalesRes.data.map(item => ({
          nombre: item.cliente,
          total: item.total_ventas
        }));
        setData(mappedData);

        // Calcular el mayor comprador histórico a partir de los datos mapeados
        const historico = mappedData.reduce((prev, current) => (
          (prev && prev.total > current.total) ? prev : current
        ), null);

        setTopMes(mesRes.data); // Los datos del top del mes ya vienen en el formato esperado
        setTopHistorico(historico);

      } catch (err) {
        console.error('Error al cargar datos de ventas por cliente:', err);
        setError('No se pudieron cargar los datos de ventas. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // payload[0].payload contiene el objeto de datos original { nombre: "Cliente X", total: 1234 }
      const { nombre, total } = payload[0].payload;
      return (
        <div
          style={{
            background: '#0f172a', // Fondo oscuro del CSS
            padding: '8px 12px',
            borderRadius: '8px',
            color: '#f8fafc', // Color de texto claro
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255, 255, 255, 0.06)' // Borde sutil
          }}
        >
          <div style={{ fontWeight: 600 }}>{nombre}</div>
          <div>{`Total: $${total.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}</div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="chart-card d-flex justify-content-center align-items-center" style={{ height: '350px' }}>
        <p className="text-gray-400">Cargando datos de ventas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-card d-flex justify-content-center align-items-center" style={{ height: '350px' }}>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Si no hay datos después de cargar
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="chart-card">No hay datos de ventas disponibles.</div>;
  }

  return (
    <div className="chart-card d-flex flex-wrap justify-content-between align-items-start gap-4">
      {/* Contenedor del gráfico de torta */}
      {/* Le damos un ancho que permita al flex wrap funcionar bien en pantallas más pequeñas */}
      <div className="flex-grow-1" style={{ flexBasis: 'min(70%, 500px)' }}> {/* Ajustado para mejor responsividad y tamaño */}
        <h5 className="text-white mb-3">Ventas por Cliente</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="nombre"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`} // Añadimos el porcentaje
              labelLine={false} // Para no mostrar las líneas de las etiquetas
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Contenedor de las tarjetas de métricas */}
      {/* Ajustamos el ancho base y la altura para simetría */}
      <div
        className="d-flex flex-column justify-content-between gap-3"
        style={{
          flexBasis: 'min(280px, 100%)', // Ancho base de 280px, pero responsive
          minWidth: '260px', // Mínimo de 260px para evitar compresión excesiva
          height: '330px', // Altura fija para que sean simétricas y se alinee con el gráfico
          marginTop: '0px' // Ajuste de margen superior para alineación
        }}
      >
        <div
          className="metric-card d-flex flex-column justify-content-center"
          style={{ flex: 1, minHeight: '150px' }} // Altura mínima para cada tarjeta
        >
          <div className="metric-title">Mayor comprador del mes</div>
          {/* Asegurarse de usar las claves correctas de topMes */}
          <div className="metric-value">{topMes?.cliente || '---'}</div>
          <div className="metric-change positive">${topMes?.total_mes?.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) || '0'}</div>
        </div>

        <div
          className="metric-card d-flex flex-column justify-content-center"
          style={{ flex: 1, minHeight: '150px' }} // Altura mínima para cada tarjeta
        >
          <div className="metric-title">Mayor comprador histórico</div>
          {/* Asegurarse de usar las claves correctas de topHistorico (las que mapeamos) */}
          <div className="metric-value">{topHistorico?.nombre || '---'}</div>
          <div className="metric-change positive">${topHistorico?.total?.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) || '0'}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VentasXCliente);
