const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
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

//Get de Usuarios
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

//Get de Activos
app.get('/activos', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Activos');
    res.send(result.recordset);
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    res.status(500).send('Error de conexión a SQL Server');
  }
});

//Post de Activos
app.post('/api/activo', async (req, res) => {
  const {
    Nombre, Marca, Modelo, NumeroSerie,
    Ubicacion, Departamento, UsuarioAsignado,
    FechaAdquisicion, Proveedor, Costo, Observaciones
  } = req.body;

  try {
    await sql.connect(config)
    await sql.query`
      INSERT INTO Activos (
        Nombre, Marca, Modelo, NumeroSerie,
        Ubicacion, Departamento, UsuarioAsignado,
        FechaAdquisicion, Proveedor, Costo, Observaciones
      )
      VALUES (
        ${Nombre}, ${Marca}, ${Modelo}, ${NumeroSerie},
        ${Ubicacion}, ${Departamento}, ${UsuarioAsignado},
        ${FechaAdquisicion}, ${Proveedor}, ${Costo}, ${Observaciones}
      )
    `;

    res.status(201).json({ message: '✅ Insertado con éxito' });
  } catch (error) {
    console.error('Error al insertar equipo:', error);
    res.status(500).json({ message: 'Error al insertar equipo' });
  } finally {
    sql.close(); // Cierra la conexión después de cada request
  }
});


// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
