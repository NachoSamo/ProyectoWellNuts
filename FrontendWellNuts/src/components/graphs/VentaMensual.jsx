// src/components/graphs/VentaMensual.jsx
import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { getVentasMensuales } from '../../services/ventasService';

const VentaMensual = () => {
  const [dataVentas, setDataVentas] = useState([]);
  const [totalMes, setTotalMes] = useState(0);
  const [variacion, setVariacion] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getVentasMensuales();
        const ventas = response.data;

        if (Array.isArray(ventas)) {
          // Formatear la fecha 'mes' antes de establecer los datos
          const formattedVentas = ventas.map(item => {
            // Asumiendo que item.mes es una cadena como 'YYYY-MM' (ej. '2025-07')
            const [year, month] = item.mes.split('-').map(Number);

            // Creamos el objeto Date de forma explícita: año, mes (0-indexado), día
            // Restamos 1 al mes porque JavaScript los cuenta de 0 (enero) a 11 (diciembre)
            const date = new Date(year, month - 1, 1);

            // Obtener el nombre del mes en formato largo (ej. "julio")
            const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);

            // Capitalizar la primera letra del nombre del mes
            const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

            // Obtener el año
            const yearNumber = date.getFullYear();

            // Combinar para obtener el formato "Mes Año" (ej. "Julio 2025")
            const formattedMes = `${capitalizedMonthName} ${yearNumber}`;

            return {
              ...item,
              mes: formattedMes, // Reemplazamos la clave 'mes' con el formato deseado
            };
          });

          setDataVentas(formattedVentas); // Usamos los datos formateados

          const len = ventas.length;
          if (len >= 2) {
            const actual = parseFloat(ventas[len - 1].total);
            const anterior = parseFloat(ventas[len - 2].total);
            setTotalMes(actual);
            const cambio = anterior !== 0 ? ((actual - anterior) / anterior) * 100 : 0;
            setVariacion(cambio.toFixed(1));
          }
        }
      } catch (error) {
        console.error('Error al obtener ventas mensuales:', error);
      }
    }

    fetchData();
  }, []);

  const formatCurrency = (value) => `$${parseFloat(value).toLocaleString()}`;


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
      <div className="chart-card">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h5>Ventas por mes</h5>
            <h3>{formatCurrency(totalMes)}</h3>
            <p className={variacion >= 0 ? 'positive' : 'negative'}>
              {/* Texto modificado para mayor claridad */}
              Variación con respecto al mes anterior {variacion >= 0 ? '+' : ''}{variacion}%
            </p>
          </div>
        </div>
  
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dataVentas}>
            <defs>
              <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#0f172a" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="mes" stroke="#94a3b8" />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#38bdf8"
              fill="url(#ventasGradient)"
              strokeWidth={3}
              dot={{ stroke: '#38bdf8', strokeWidth: 2, fill: '#38bdf8' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Envuelve el componente con React.memo para optimizar el rendimiento
  export default React.memo(VentaMensual);
