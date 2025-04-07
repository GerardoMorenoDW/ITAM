const express = require('express');
const sql = require('mssql');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// Configuración de conexión a SQL Server
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Geraxuful0415**',
  server: process.env.DB_HOST || 'sqlserver',
  database: process.env.DB_NAME || 'Itam',
  port: parseInt(process.env.DB_PORT) || '1433' ,
  options: {
    encrypt: false, // cambiar a true si estás usando Azure u otra instancia con SSL
    trustServerCertificate: true // para desarrollo local
  }
};

// Ruta de prueba
app.get('/', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT GETDATE() AS currentDate');
    res.send(result.recordset);
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    res.status(500).send('Error de conexión a SQL Server');
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Usuarios');
    res.send(result.recordset);
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    res.status(500).send('Error de conexión a SQL Server');
  }
});

app.post('/add/activo', async (req, res) => {
  try {
    const activoNuevo = req.body;
    console.log('Datos recibidos:', activoNuevo);
    if (!activoNuevo.Nombre || !activoNuevo.Marca || !activoNuevo.Modelo || !activoNuevo.NumeroSerie || !activoNuevo.Ubicacion || !activoNuevo.Departamento || !activoNuevo.UsuarioAsignado || !activoNuevo.FechaAdquisicion || !activoNuevo.FechaExpiracion || !activoNuevo.Proveedor || !activoNuevo.Costo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios en la solicitud.' });
    }
    await sql.connect(config);
    const result = await sql.query`
      INSERT INTO Activos (Nombre, Marca, Modelo, NumeroSerie, Ubicacion, Departamento, UsuarioAsignado, FechaAdquisicion, FechaExpiracion, Proveedor, Costo, Observaciones, Estatus)
      VALUES (${activoNuevo.Nombre}, ${activoNuevo.Marca}, ${activoNuevo.Modelo}, ${activoNuevo.NumeroSerie}, ${activoNuevo.Ubicacion}, ${activoNuevo.Departamento}, ${activoNuevo.UsuarioAsignado}, ${activoNuevo.FechaAdquisicion}, ${activoNuevo.FechaExpiracion}, ${activoNuevo.Proveedor}, ${activoNuevo.Costo}, ${activoNuevo.Observaciones}, 'ACTIVE');
    `;
    res.status(200).json({ message: 'Activo insertado correctamente' });
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    res.status(500).send('Error de conexión a SQL Server');
  }
});

// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
