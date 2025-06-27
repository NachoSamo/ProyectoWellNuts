require('dotenv').config();
const sql = require('mssql');

const config = { //environment variables para la conexión a la base de datos se usan para no exponer datos sensibles en el código
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false, 
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config) //ConnectionPool sirve para manejar conexiones a la base de datos
  .connect() // connect() devuelve una promesa que se resuelve cuando la conexión se establece
  .then(pool => { // pool es una instancia de ConnectionPool
    console.log('✅ Conectado a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error de conexión a la BD:', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};
