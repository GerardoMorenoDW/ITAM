const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
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
  port: parseInt(process.env.DB_PORT) || '1433',
  options: {
    encrypt: false,
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


// INSERTAR USUARIOS

/* async function insertarUsuarios() {
  try{
    await sql.connect(config);

    const usuarios = [
      { nombre: 'Alberto', correo: 'alberto@example.com', password: 'contrasena123' },
      { nombre: 'Gerardo', correo: 'gerardo@example.com', password: 'contrasena123' },
      { nombre: 'Lucía', correo: 'lucia@example.com', password: 'pass789' },
      { nombre: 'Mario', correo: 'mario@example.com', password: 'micontraseña321' },
    ];

    for (const usuario of usuarios) {
      const hash = await bcrypt.hash(usuario.password, 10);

      await sql.query`
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE correo = ${usuario.correo})
        INSERT INTO Usuarios (nombre, correo, password) VALUES (${usuario.nombre}, ${usuario.correo}, ${hash})
      `;
    }

    console.log('Usuarios insertados con hash');
    sql.close();
  }catch(error){
    console.log("Error insertando usuarios")
  }
}
insertarUsuarios().catch(console.error); */

//POST Log in de aplicacion
app.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    const pool = await sql.connect(config);

    const result = await pool.request()
    .input('correo', sql.VarChar, correo)
    .query('SELECT * FROM Usuarios WHERE correo = @correo');

    const usuario = result.recordset[0];

    if (!usuario) return res.status(401).json({ message: 'Usuario no encontrado' });

    const coincide = await bcrypt.compare(password, usuario.password);

    if (!coincide) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Aquí podrías usar JWT. Por ahora, retornamos un objeto simple:
    res.json({ token: 'mock-token', usuario: { id: usuario.id, nombre: usuario.nombre } });
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
    console.error('Error al obtener lista de activos:', err);
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
    const { id } = req.params
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Activos WHERE id = ${id}`;
    res.send(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener activo:', err);
    res.status(500).send('Error en el servidor');
  }
});

// GET Disponibilidad del activo adaptado a React Admin
app.get('/disponibilidad/:id', async (req, res) => {
  try {
    const { id } = req.params
    const resultado = {
      "data": [],
      "StockTotal": 0
    }
    await sql.connect(config);
    const result = await sql.query`SELECT t1.SucursalId, t2.Nombre, t1.Cantidad FROM StockSucursal t1 LEFT JOIN Sucursales t2
                                   ON t1.SucursalId = t2.id WHERE t1.ActivoId = ${id}`;
    const StockTotal = await sql.query`SELECT SUM(Cantidad) as StockTotal FROM StockSucursal WHERE ActivoId = ${id}`;
    resultado.data = result.recordset
    resultado.StockTotal = StockTotal.recordset[0].StockTotal
    res.send(resultado);
  } catch (err) {
    console.error('Error al obtener disponibilidad de activo:', err);
    res.status(500).send('Error en el servidor');
  } finally {
    sql.close();
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
    await sql.connect(config);
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

/* ---------------------------- MOVIMIENTOS DE ACTIVOS ---------------------------- */

app.post('/api/movimientos', async (req, res) => {
  try {
    const { ActivoId, SucursalOrigenId, SucursalDestinoId, Cantidad } = req.body;

    if (!ActivoId || !SucursalOrigenId || !SucursalDestinoId || !Cantidad) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (SucursalOrigenId === SucursalDestinoId) {
      return res.status(400).json({ error: 'La sucursal origen y destino no pueden ser iguales' });
    }

    if (Cantidad <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor que 0' });
    }

    await sql.connect(config);
    // Verificar stock disponible en la sucursal origen
    const checkStock = await sql.query`
      SELECT Cantidad FROM StockSucursal 
      WHERE ActivoId = ${ActivoId} AND SucursalId = ${SucursalOrigenId}
    `;

    const stockDisponible = checkStock.recordset[0]?.Cantidad || 0;

    if (stockDisponible < Cantidad) {
      return res.status(400).json({ error: `Stock insuficiente en la sucursal origen. Disponible: ${stockDisponible}` });
    }

    await sql.query(`
      INSERT INTO Movimientos (ActivoId, SucursalOrigenId, SucursalDestinoId, Cantidad)
      VALUES ( ${ActivoId}, ${SucursalOrigenId}, ${SucursalDestinoId}, ${Cantidad})
      `)
    res.status(201).json()


  } catch (error) {
    console.error('Error al obtener activos físicos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

// get Momivimientos
app.get('/movimientos/:id', async (req, res)=> {
  try{
    const { id } = req.params
    await sql.connect(config);
    const {recordset} = await sql.query`
      SELECT m.ActivoId as ActivoId, 
      a.Nombre as NombreActivo,
      (SELECT Nombre FROM Sucursales WHERE id = m.SucursalOrigenId) as SucursalOrigen,
      (SELECT Nombre FROM Sucursales WHERE id = m.SucursalDestinoId) as SucursalDestino,
      m.Cantidad,
      m.Fecha
      FROM Movimientos m
      JOIN Activos a on m.ActivoId = a.id
      WHERE ActivoId = ${id}
    `;
    res.status(200).json(recordset)

  }catch(error){
    console.error('Error al obtener activos físicos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

// Compras de activo
app.put('/api/compras/:id', async (req, res)=> {
  try{
    const { id } = req.params
    const {SucursalId, Cantidad } = req.body;
    if (id && SucursalId && Cantidad > 0){
      await sql.connect(config);
      const {recordset} = await sql.query`
        INSERT INTO Compras ( ActivoId, SucursalId, Cantidad )
        VALUES (${id}, ${SucursalId}, ${Cantidad} );
      `;
      await sql.query`
      UPDATE StockSucursal
      SET Cantidad = Cantidad + ${Cantidad}
      WHERE ActivoId = ${id} AND SucursalId = ${SucursalId}
      `
      await sql.query`
      UPDATE Activos
      SET Cantidad = Cantidad + ${Cantidad}
      WHERE ActivoId = ${id} AND SucursalId = ${SucursalId}
      `
      res.status(200).json(recordset)
    }
  }catch(error){
    console.error('Error al obtener activos físicos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

/* ---------------------- ACTIVOS FISICOS -------------------------------- */
// GET DE ACTIVOS FISICOS
app.get('/activos-fisicos', async (req, res) => {
  try {
    await sql.connect(config);

    const sortField = req.query._sort || 'af.Id';
    const sortOrder = req.query._order || 'ASC';
    const start = req.query._start ? parseInt(req.query._start) : 0;
    const end = req.query._end ? parseInt(req.query._end) : null;
    const limit = end !== null ? end - start : 1000;

    const filters = req.query.filter ? JSON.parse(req.query.filter) : {};

    let whereClauses = [];
    let inputParams = {};
    let i = 0;

    for (const campo in filters) {
      const paramName = `param${i}`;

      if (campo === "q") {
        whereClauses.push(`(a.Nombre LIKE @${paramName} OR af.NumeroSerie LIKE @${paramName})`);
        inputParams[paramName] = `%${filters[campo]}%`;
      } else if (campo === "Estado") {
        whereClauses.push(`af.Estado = @${paramName}`);
        inputParams[paramName] = filters[campo];
      } else if (campo === "departamento") {
        whereClauses.push(`af.Departamento = @${paramName}`);
        inputParams[paramName] = filters[campo];
      } else if (campo === "SucursalId") {
        whereClauses.push(`af.SucursalId = @${paramName}`);
        inputParams[paramName] = filters[campo];
      } else {
        whereClauses.push(`af.${campo} = @${paramName}`);
        inputParams[paramName] = filters[campo];
      }
      i++;
    }

    let baseQuery = `
      SELECT af.*, a.Nombre AS NombreActivo, s.Nombre AS NombreSucursal
      FROM ActivosFisicos af
      JOIN Activos a ON af.ActivoId = a.Id
      JOIN Sucursales s ON af.SucursalId = s.Id
    `;

    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const queryWithPagination = `
      ${baseQuery}
      ORDER BY ${sortField} ${sortOrder}
      OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY
    `;

    const request = new sql.Request();
    for (const key in inputParams) {
      request.input(key, sql.VarChar, inputParams[key]);
    }

    const result = await request.query(queryWithPagination);

    // Total con filtros
    const countRequest = new sql.Request();
    for (const key in inputParams) {
      countRequest.input(key, sql.VarChar, inputParams[key]);
    }

    const countResult = await countRequest.query(`
      SELECT COUNT(*) AS total
      FROM ActivosFisicos af
      JOIN Activos a ON af.ActivoId = a.Id
      JOIN Sucursales s ON af.SucursalId = s.Id
      ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : ''}
    `);

    const total = countResult.recordset[0].total;

    res.setHeader('Content-Range', `activos-fisicos ${start}-${start + result.recordset.length}/${total}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener activos físicos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



// GET de activos fisicos por ID

app.get('/activos-fisicos/:id', async (req, res) => {
  try {
    const idActivo = req.params.id;
    await sql.connect(config);
    const request = new sql.Request()
    const result = await request.query(`
      SELECT * FROM ActivosFisicos WHERE id = ${idActivo}
      `);
    res.json(result.recordset[0]);

  } catch (err) {
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
    await sql.connect(config);
    const result = await new sql.Request()
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

// Cantidad de Activos por estado
app.get('/activos-fisicos-estados', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await new sql.Request().query(`
      SELECT Estado, COUNT(*) AS cantidad
      FROM ActivosFisicos
      GROUP BY Estado
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener activos por estado:", err);
    res.status(500).json({ error: 'Error al obtener activos por estado' });
  }
});

//Grafica de compras por mes

app.get('/compras-por-mes', async (req, res) => {
    try {
        const anio = parseInt(req.query.anio);

        if (isNaN(anio)) {
            return res.status(400).json({ error: "Año inválido" });
        }

        await sql.connect(config);
        const request = new sql.Request();
        request.input('anio', sql.Int, anio);

        const result = await request.query(`
            SELECT 
                MONTH(t1.FechaRegistro) AS Mes,
                YEAR(t1.FechaRegistro) AS Año,
                SUM(t2.Costo) AS Compras
            FROM ActivosFisicos t1
            JOIN Activos t2 ON t1.ActivoId = t2.Id
            WHERE YEAR(t1.FechaRegistro) = @anio
            GROUP BY YEAR(t1.FechaRegistro), MONTH(t1.FechaRegistro)
            ORDER BY Mes
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error("Error obteniendo compras por mes:", err);
        res.status(500).json({ error: "Error interno del servidor" });
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
  }
});

//Get una sucursal
app.get('/sucursales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config);
    const result = await sql.query`SELECT Id AS id, Nombre FROM Sucursales WHERE id = ${id}`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener sucursales:', err);
    res.status(500).send('Error al obtener sucursales');
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
