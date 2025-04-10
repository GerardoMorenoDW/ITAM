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

// GET /activos adaptado a React Admin
app.get('/activos', async (req, res) => {
  try {
    await sql.connect(config);

    // Parsear parámetros de React Admin
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const sort = req.query.sort ? JSON.parse(req.query.sort) : ['id', 'ASC'];

    const offset = range[0];
    const limit = range[1] - range[0] + 1;

    let baseQuery = `SELECT * FROM Activos`;
    const condiciones = [];
    const ps = new sql.PreparedStatement();

    // Filtros dinámicos
    for (const campo in filter) {
      ps.input(campo, sql.VarChar);
      condiciones.push(`${campo} LIKE '%' + @${campo} + '%'`);
    }

    if (condiciones.length > 0) {
      baseQuery += ' WHERE ' + condiciones.join(' AND ');
    }

    // Ordenamiento
    baseQuery += ` ORDER BY ${sort[0]} ${sort[1]}`;

    // Paginación (usando OFFSET-FETCH para SQL Server)
    baseQuery += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

    await ps.prepare(baseQuery);
    const result = await ps.execute(filter);
    await ps.unprepare();

    // Total de registros (para React Admin)
    const totalQuery = `SELECT COUNT(*) as total FROM Activos`;
    const totalResult = await sql.query(totalQuery);
    const total = totalResult.recordset[0].total;

    // Headers necesarios para paginación en React Admin
    res.setHeader('Content-Range', `activos ${range[0]}-${range[1]}/${total}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');

    res.send(result.recordset);
  } catch (err) {
    console.error('Error al obtener activos:', err);
    res.status(500).send('Error en el servidor');
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
