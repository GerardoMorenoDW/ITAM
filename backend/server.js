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
      condiciones.push(`Nombre LIKE '%' + @${campo} + '%' OR Modelo LIKE '%' + @${campo} + '%' OR NumeroSerie LIKE '%' + @${campo} + '%' OR Sucursal LIKE '%' + @${campo} + '%' OR Tipo LIKE '%' + @${campo} + '%'`);
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

// backend: Obtener varios activos por ID para getMany
app.post('/activos/many', async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: 'Se esperaba un array de ids' });
    }

    await sql.connect(config);
    const request = new sql.Request();
    const idList = ids.join(',');

    const result = await request.query(`
      SELECT * FROM ActivosFisicos WHERE ActivoId IN (${idList})
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error en /activos/many:', err);
    res.status(500).json({ message: 'Error en el servidor' });
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

// GET Disponibilidad del activo adaptado a React Admin
app.get('/disponibilidad/:id', async (req, res) => {
  try {
    const {id} = req.params
    await sql.connect(config);
    const result = await sql.query`SELECT t2.Nombre, t1.Cantidad FROM StockSucursal t1 LEFT JOIN Sucursales t2
                                   ON t1.SucursalId = t2.id WHERE t1.ActivoId = ${id}`;
    res.send(result.recordset);
  } catch (err) {
    console.error('Error al obtener activos:', err);
    res.status(500).send('Error en el servidor');
  }
});

//Post de Activos
app.post('/api/activos', async (req, res) => {
  const {
    Nombre, Marca, Modelo, Tipo, NumeroSerie,
    Sucursal, Departamento, UsuarioAsignado,
    FechaAdquisicion, FechaExpiracion, Proveedor, Costo, Observaciones, StockTotal
  } = req.body;

  try {
    await sql.connect(config)
    const result = await sql.query`
      INSERT INTO Activos (
        Nombre, Marca, Modelo, Tipo, NumeroSerie, Departamento, UsuarioAsignado,
        FechaAdquisicion, FechaExpiracion, Proveedor, Costo, Observaciones, StockTotal
      )
      VALUES (
        ${Nombre}, ${Marca}, ${Modelo}, ${Tipo}, ${NumeroSerie}, ${Departamento}, ${UsuarioAsignado},
        ${FechaAdquisicion}, ${FechaExpiracion}, ${Proveedor}, ${Costo}, ${Observaciones}, ${StockTotal}
      )

      SELECT SCOPE_IDENTITY() AS id;
    `;

    const insertedId = result.recordset[0].id;

    res.status(201).json({
      id: insertedId,
      Nombre,
      Marca,
      Modelo,
      Tipo,
      NumeroSerie,
      Departamento,
      UsuarioAsignado,
      FechaAdquisicion,
      FechaExpiracion,
      Proveedor,
      Costo,
      Observaciones,
      StockTotal
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

// DELETE múltiple de Activos
app.post('/activos/deleteMany', async (req, res) => {
  const { ids } = req.body; // se espera un array de IDs

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron IDs válidos' });
  }

  try {
    await sql.connect(config);

    // Construimos la lista de IDs como parámetros seguros
    const idList = ids.map((id, index) => `@id${index}`).join(',');
    const request = new sql.Request();
    ids.forEach((id, index) => {
      request.input(`id${index}`, sql.Int, id);
    });

    await request.query(`DELETE FROM Activos WHERE id IN (${idList})`);

    res.status(200).json({ success: true, deleted: ids });
  } catch (err) {
    console.error('Error al eliminar múltiples activos:', err);
    res.status(500).json({ error: 'Error al eliminar múltiples activos' });
  }
});


// Actualizar un activo
app.put('/activos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Nombre, Marca, Modelo, NumeroSerie, Estatus, Departamento, UsuarioAsignado,
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


/* ---------------------- ACTIVOS FISICOS -------------------------------- */

// GET DE ACTIVOS FISICOS
app.get('/activos-fisicos', async (req, res) => {
  try {
    await sql.connect(config);

    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const sort = req.query.sort ? JSON.parse(req.query.sort) : ['af.Id', 'ASC'];
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};

    const offset = range[0];
    const limit = range[1] - range[0] + 1;

    let query = `
      SELECT af.*, a.Nombre AS NombreActivo, s.Nombre AS NombreSucursal
      FROM ActivosFisicos af
      JOIN Activos a ON af.ActivoId = a.Id
      JOIN Sucursales s ON af.SucursalId = s.Id
    `;

    const conditions = [];
    const ps = new sql.PreparedStatement();

    for (const campo in filter) {
      ps.input(campo, sql.VarChar);
      conditions.push(`af.${campo} LIKE '%' + @${campo} + '%'`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY ${sort[0]} ${sort[1]}`;
    query += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

    await ps.prepare(query);
    const result = await ps.execute(filter);
    await ps.unprepare();

    const totalResult = await sql.query`SELECT COUNT(*) AS total FROM ActivosFisicos`;
    const total = totalResult.recordset[0].total;

    res.setHeader('Content-Range', `activos-fisicos ${range[0]}-${range[1]}/${total}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener activos físicos:', err);
    res.status(500).send('Error al obtener activos físicos');
  } finally {
    sql.close();
  }
});

// GET de activos fisicos por ID

app.get('/activos-fisicos/:id', async (req, res) => {
  try{
    const idActivo = req.params.id;
    await sql.connect(config);
    const request = new sql.Request()
    const result = await request.query(`
      SELECT * FROM ActivosFisicos WHERE id = ${idActivo}
      `);
    res.json(result.recordset[0]);

  }catch (err){
    console.error('Error al obtener activo:', err);
    res.status(500).send('Error en el servidor');
  }
})

// Put de Activos Fisicos
app.put('/activos-fisicos/:id', async (req, res) => {
  const { id } = req.params;
  const { NumeroSerie, Estado, SucursalId } = req.body;
  console.timeLog(id)

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('NumeroSerie', sql.NVarChar, NumeroSerie)
      .input('Estado', sql.NVarChar, Estado)
      .input('SucursalId', sql.Int, SucursalId)
      .query(`
        UPDATE ActivosFisicos
        SET NumeroSerie = @NumeroSerie,
            Estado = @Estado,
            SucursalId = @SucursalId
        WHERE id = @id
      `);
    res.json({ id, NumeroSerie, Estado, SucursalId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating activo físico' });
  }
});

/* ------------------------------------------------------------------------------------- */

// GET DE SUCURSALES
app.get('/sucursales', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT Id AS id, Nombre FROM Sucursales`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener sucursales:', err);
    res.status(500).send('Error al obtener sucursales');
  } finally {
    sql.close();
  }
});

//Get una sucursal

app.get('/sucursales/:id', async (req, res) => {
  try {
    const {id} = req.params;
    await sql.connect(config);
    const result = await sql.query`SELECT Id AS id, Nombre FROM Sucursales`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener sucursales:', err);
    res.status(500).send('Error al obtener sucursales');
  } finally {
    sql.close();
  }
});


//Para hacer dataprovider getMany Sucursales
app.post('/sucursales/many', async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: 'Se esperaba un array de ids' });
    }

    await sql.connect(config);
    const request = new sql.Request();
    const idList = ids.join(',');

    const result = await request.query(`
      SELECT * FROM Sucursales WHERE id IN (${idList})
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error en /sucursales/many:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});





// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
