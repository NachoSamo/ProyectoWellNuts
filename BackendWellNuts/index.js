require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 👈 importante
const ventasRoutes = require('./routes/ventas');
const productosRoutes = require('./routes/productos'); 
const clientesRoutes = require('./routes/clientes'); 
const detalleRoutes = require('./routes/detalleVenta'); 
const variedadesRoutes = require('./routes/variedadProducto');
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/ventas', ventasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes); 
app.use('/api/detalleVentas', detalleRoutes);
app.use('/api/variedadProducto', variedadesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
  res.send('API WellNuts funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
