import { useEffect, useState } from 'react';
import api from '../services/api';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    api.get('/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error('Error al cargar ventas:', err));
  }, []);

  return (
    <>
      <div className='d-flex align-items-center mb-3'>
        <h1 className="text-center mt-4">Ventas</h1>
        <img src="/public/Coin.png" style={{ width: '107px', height: '107px' }}/>
      </div>
      <div className="container mt-4">
        <table className="table table-hover table-bordered ">
          <thead className="table-dark">
            <tr>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Pagado</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr key={index}>
                <td>{venta.cliente}</td>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td>${venta.precio_total.toFixed(2)}</td>
                <td>{venta.pagado ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Ventas;
