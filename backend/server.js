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

    const sortField = req.query._sort || 'id';
    const sortOrder = req.query._order || 'ASC';
    const start = parseInt(req.query._start) || 0;
    const end = parseInt(req.query._end) || 10;
    const limit = end - start;

    const filter = { ...req.query };
    delete filter._sort;
    delete filter._order;
    delete filter._start;
    delete filter._end;

    let baseQuery = `SELECT * FROM Activos`;
    const condiciones = [];
    const ps = new sql.PreparedStatement();

    // Filtros dinámicos (solo aplica a campos clave que quieras buscar)
    for (const campo in filter) {
      ps.input(campo, sql.VarChar);
      condiciones.push(`Nombre LIKE '%' + @${campo} + '%' OR Modelo LIKE '%' + @${campo} + '%' OR NumeroSerie LIKE '%' + @${campo} + '%' OR Sucursal LIKE '%' + @${campo} + '%'`);
    }

    if (condiciones.length > 0) {
      baseQuery += ' WHERE ' + condiciones.join(' AND ');
    }

    baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;
    baseQuery += ` OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY`;

    await ps.prepare(baseQuery);
    const result = await ps.execute(filter);
    await ps.unprepare();

    // Conteo total sin paginación
    const countQuery = `SELECT COUNT(*) as total FROM Activos`;
    const countResult = await sql.query(countQuery);
    const total = countResult.recordset[0].total;

    res.setHeader('Content-Range', `activos ${start}-${end}/${total}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener activos:', err);
    res.status(500).send('Error en el servidor');
  }
});


// GET /activos adaptado a React Admin
app.get('/activos/:id', async (req, res) => {
  try {
    const {id} = req.params
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Activos WHERE id = ${id}`;
    res.send(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener activos:', err);
    res.status(500).send('Error en el servidor');
  }
});

//Post de Activos
app.post('/api/activos', async (req, res) => {
  const {
    Nombre, Marca, Modelo, NumeroSerie,
    Sucursal, Departamento, UsuarioAsignado,
    FechaAdquisicion, FechaExpiracion, Proveedor, Costo, Observaciones
  } = req.body;

  try {
    await sql.connect(config)
    const result = await sql.query`
      INSERT INTO Activos (
        Nombre, Marca, Modelo, NumeroSerie,
        Sucursal, Departamento, UsuarioAsignado,
        FechaAdquisicion, FechaExpiracion, Proveedor, Costo, Observaciones
      )
      OUTPUT INSERTED.id
      VALUES (
        ${Nombre}, ${Marca}, ${Modelo}, ${NumeroSerie},
        ${Sucursal}, ${Departamento}, ${UsuarioAsignado},
        ${FechaAdquisicion}, ${FechaExpiracion}, ${Proveedor}, ${Costo}, ${Observaciones}
      )
    `;

    const insertedId = result.recordset[0].id;

    res.status(201).json({
      id: insertedId,
      Nombre,
      Marca,
      Modelo,
      NumeroSerie,
      Sucursal,
      Departamento,
      UsuarioAsignado,
      FechaAdquisicion,
      FechaExpiracion,
      Proveedor,
      Costo,
      Observaciones
    });
  } catch (error) {
    console.error('Error al insertar equipo:', error);
    res.status(500).json({ message: 'Error al insertar equipo' });
  } finally {
    sql.close(); // Cierra la conexión después de cada request
  }
});

//DELETE de Activo
app.delete('/activos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config);
    await sql.query`DELETE FROM Activos WHERE id = ${id}`;
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error al eliminar:', err);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// Actualizar un activo
app.put('/activos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Nombre, Marca, Modelo, NumeroSerie, Estatus,
      Sucursal, Departamento, UsuarioAsignado,
      FechaAdquisicion, FechaExpiracion, Proveedor, Costo, Observaciones
    } = req.body;

    await sql.connect(config);
    const result = await sql.query`
      UPDATE Activos SET
        Nombre = ${Nombre},
        Marca = ${Marca},
        Modelo = ${Modelo},
        NumeroSerie = ${NumeroSerie},
        Estatus = ${Estatus},
        Sucursal = ${Sucursal},
        Departamento = ${Departamento},
        UsuarioAsignado = ${UsuarioAsignado},
        FechaAdquisicion = ${FechaAdquisicion},
        FechaExpiracion = ${FechaExpiracion},
        Proveedor = ${Proveedor},
        Costo = ${Costo},
        Observaciones = ${Observaciones}
      WHERE id = ${id}
    `;

    const activoActualizado = await sql.query` SELECT * FROM activos WHERE id = ${id}`;

    res.status(200).json(activoActualizado.recordsets[0][0]);
  } catch (err) {
    console.error('Error al actualizar:', err);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});


// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
