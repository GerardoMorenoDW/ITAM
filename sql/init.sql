-- Crear la base de datos si no existe
IF DB_ID('Itam') IS NULL
BEGIN
    CREATE DATABASE Itam;
END
GO

-- Cambiar el contexto a la base de datos
USE Itam;
GO

-- Crear tabla Usuarios si no existe
IF OBJECT_ID('Usuarios', 'U') IS NULL
BEGIN
    CREATE TABLE Usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        roll VARCHAR(50) NOT NULL DEFAULT 'user'
    );
END
GO

-- Crear tabla Activos si no existe
IF OBJECT_ID('Activos', 'U') IS NULL
BEGIN
    CREATE TABLE Activos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(100),
        Marca NVARCHAR(100),
        Modelo NVARCHAR(100),
        Tipo NVARCHAR(100),
        SubCategoria NVARCHAR(100),
        NumeroSerie NVARCHAR(100),
        Estatus NVARCHAR(50) DEFAULT 'En Stock',
        Departamento NVARCHAR(100),
        UsuarioAsignado NVARCHAR(100),
        FechaAdquisicion DATE,
        FechaExpiracion DATE,
        Proveedor NVARCHAR(100),
        Costo DECIMAL(18,2),
        Observaciones NVARCHAR(MAX),
        StockTotal INT
    );
END
GO

IF OBJECT_ID('Sucursales', 'U') IS NULL
BEGIN
    CREATE TABLE Sucursales (
        id INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(100)
    );
END
GO

-- Stock por sucursal
IF OBJECT_ID('StockSucursal', 'U') IS NULL
CREATE TABLE StockSucursal (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ActivoId INT NOT NULL,
    SucursalId INT NOT NULL,
    Cantidad INT DEFAULT 0,
    FOREIGN KEY (ActivoId) REFERENCES Activos(id ) ON DELETE CASCADE,
    FOREIGN KEY (SucursalId) REFERENCES Sucursales(id) ON DELETE CASCADE
);
GO

-- Trazabilidad de movimientos
IF OBJECT_ID('Movimientos', 'U') IS NULL
CREATE TABLE Movimientos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ActivoId INT FOREIGN KEY REFERENCES Activos(id),
    SucursalOrigenId INT FOREIGN KEY REFERENCES Sucursales(id),
    SucursalDestinoId INT FOREIGN KEY REFERENCES Sucursales(id),
    Cantidad INT,
    Fecha DATETIME DEFAULT GETDATE(),
    Observaciones NVARCHAR(MAX)
);
GO

-- Instancias físicas de activos
IF OBJECT_ID('ActivosFisicos', 'U') IS NULL
CREATE TABLE ActivosFisicos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ActivoId INT NOT NULL,
    NumeroSerie NVARCHAR(100) UNIQUE,
    Estado NVARCHAR(50) DEFAULT 'DISPONIBLE',
    SucursalId INT NOT NULL,
    Asignado INT DEFAULT 1,
    FechaRegistro DATETIME DEFAULT GETDATE(),
    FechaExpiracion DATE,
    FechaMantenimiento DATE,
    FOREIGN KEY (ActivoId) REFERENCES Activos(id) ON DELETE CASCADE,
    FOREIGN KEY (SucursalId) REFERENCES Sucursales(id) ON DELETE CASCADE
);
GO

-- Instancias compras de activos
IF OBJECT_ID('Compras', 'U') IS NULL
CREATE TABLE Compras (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ActivoId INT NOT NULL,
    SucursalId INT NOT NULL,
    Cantidad INT NOT NULL,
    Fecha DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ActivoId) REFERENCES Activos(id) ON DELETE CASCADE,
    FOREIGN KEY (SucursalId) REFERENCES Sucursales(id) ON DELETE CASCADE
);
GO

-- Instancias Empleados
IF OBJECT_ID('Empleados', 'U') IS NULL
CREATE TABLE Empleados (
    EmpleadoId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100) NOT NULL,
    Correo NVARCHAR(150) UNIQUE,
    FechaNacimiento DATE,
    FechaIngreso DATE NOT NULL,
    Cargo NVARCHAR(100),
    SucursalId INT
);


-- Insertar empleados si no existen
IF NOT EXISTS (SELECT 1 FROM Empleados)
    INSERT INTO Empleados (Nombre, Apellido, Correo, FechaNacimiento, FechaIngreso, Cargo, SucursalId)
    VALUES 
    ('Sin Asignar', 'a', '@.com', '1990-05-15', '2020-03-01', '', 1),
    ('Greco', 'Gómez', 'greco.gomez@empresa.com', '1990-05-15', '2020-03-01', 'Analista', 1),
    ('Luis', 'Martínez', 'luis.martinez@empresa.com', '1985-08-22', '2018-06-10', 'Gerente', 2),
    ('Sofía', 'Pérez', 'sofia.perez@empresa.com', '1993-12-02', '2022-01-15', 'Soporte Técnico', 1),
    ('Carlos', 'Ramírez', 'carlos.ramirez@empresa.com', '1980-03-30', '2010-09-20', 'Jefe de Área', 3);
GO


-- Insertar sucursales si no existen
IF NOT EXISTS (SELECT 1 FROM Sucursales WHERE Nombre = 'Bodega Principal')
    INSERT INTO Sucursales (Nombre) VALUES ('Bodega Principal');
IF NOT EXISTS (SELECT 1 FROM Sucursales WHERE Nombre = 'Bodega Chilibre')
    INSERT INTO Sucursales (Nombre) VALUES ('Bodega Chilibre');
IF NOT EXISTS (SELECT 1 FROM Sucursales WHERE Nombre = 'Bodega Pacora')
    INSERT INTO Sucursales (Nombre) VALUES ('Bodega Pacora');
IF NOT EXISTS (SELECT 1 FROM Sucursales WHERE Nombre = 'Bodega Juan Diaz')
    INSERT INTO Sucursales (Nombre) VALUES ('Bodega Juan Diaz');
GO

-- Asignar roll
IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE roll = 'admin')
BEGIN
    UPDATE Usuarios
    SET roll = 'admin'
    WHERE correo = 'alberto@example.com';
END;
GO

-- 7. Triggers (estos no necesitan IF OBJECT_ID, porque los recreás si es necesario)
IF OBJECT_ID('trg_AgregarActivosFisicos', 'TR') IS NOT NULL
    DROP TRIGGER trg_AgregarActivosFisicos;
GO

CREATE TRIGGER trg_AgregarActivosFisicos
ON Activos
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ActivoId INT, @Cantidad INT, @i INT = 1, @FechaExpiracion DATETIME;

    SELECT @ActivoId = id, @Cantidad = StockTotal, @FechaExpiracion = FechaExpiracion FROM INSERTED;

    WHILE @i <= @Cantidad
    BEGIN
        INSERT INTO ActivosFisicos (ActivoId, SucursalId, NumeroSerie, FechaExpiracion)
        VALUES (@ActivoId, 1, CONCAT('AUTO-', NEWID()), @FechaExpiracion);

        SET @i += 1;
    END
END;
GO

IF OBJECT_ID('TR_AfterInsertActivo', 'TR') IS NOT NULL
    DROP TRIGGER TR_AfterInsertActivo;
GO

CREATE TRIGGER TR_AfterInsertActivo
ON Activos
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ActivoId INT
    DECLARE @StockTotal INT
    DECLARE @SucursalPrincipalId INT = 1;

    SELECT TOP 1 @ActivoId = id, @StockTotal = StockTotal FROM INSERTED;

    INSERT INTO StockSucursal (ActivoId, SucursalId, Cantidad)
    VALUES (@ActivoId, @SucursalPrincipalId, @StockTotal);

    INSERT INTO StockSucursal (ActivoId, SucursalId, Cantidad)
    SELECT @ActivoId, id, 0
    FROM Sucursales
    WHERE id <> @SucursalPrincipalId;
END;
GO

IF OBJECT_ID('Tr_MovimientosDeActivos', 'TR') IS NOT NULL
    DROP TRIGGER Tr_MovimientosDeActivos;
GO

CREATE TRIGGER Tr_MovimientosDeActivos
ON Movimientos
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Actualizar StockSucursal: Sumar en destino y restar en origen
    MERGE StockSucursal AS target
    USING (
        SELECT ActivoId, SucursalDestinoId AS SucursalId, Cantidad
        FROM INSERTED
    ) AS source
    ON target.ActivoId = source.ActivoId AND target.SucursalId = source.SucursalId
    WHEN MATCHED THEN
        UPDATE SET target.Cantidad = target.Cantidad + source.Cantidad
    WHEN NOT MATCHED THEN
        INSERT (ActivoId, SucursalId, Cantidad)
        VALUES (source.ActivoId, source.SucursalId, source.Cantidad);

    UPDATE ss
    SET ss.Cantidad = ss.Cantidad - i.Cantidad
    FROM StockSucursal ss
    INNER JOIN INSERTED i ON ss.ActivoId = i.ActivoId AND ss.SucursalId = i.SucursalOrigenId;

    -- Actualizar ActivosFisicos: Mover unidades físicas a la nueva sucursal
    DECLARE @ActivoId INT, @SucursalOrigenId INT, @SucursalDestinoId INT, @Cantidad INT;

    SELECT TOP 1 
        @ActivoId = ActivoId, 
        @SucursalOrigenId = SucursalOrigenId,
        @SucursalDestinoId = SucursalDestinoId,
        @Cantidad = Cantidad
    FROM INSERTED;

    ;WITH ActivosParaMover AS (
        SELECT TOP (@Cantidad) *
        FROM ActivosFisicos
        WHERE ActivoId = @ActivoId AND SucursalId = @SucursalOrigenId
        ORDER BY Id
    )
    UPDATE ActivosParaMover
    SET SucursalId = @SucursalDestinoId;

END;
GO

