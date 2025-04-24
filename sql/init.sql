IF DB_ID('Itam') IS NULL
BEGIN
    CREATE DATABASE Itam;
END
GO

USE Itam;
GO

CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL
);
GO

CREATE TABLE Activos(
    id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100),
    Marca NVARCHAR(100),
    Modelo NVARCHAR(100),
    NumeroSerie NVARCHAR(100),
    Estatus NVARCHAR(50) DEFAULT 'En Stock', -- 👈 aquí está el valor por defecto
    Departamento NVARCHAR(100),
    UsuarioAsignado NVARCHAR(100),
    FechaAdquisicion DATE,
    FechaExpiracion DATE,
    Proveedor NVARCHAR(100),
    Costo DECIMAL(18,2),
    Observaciones NVARCHAR(MAX),
    StockTotal INT
);
GO

CREATE TABLE Sucursales (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100)
);
GO

CREATE TABLE StockSucursal (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ActivoId INT FOREIGN KEY REFERENCES Activos(id),
    SucursalId INT FOREIGN KEY REFERENCES Sucursales(id),
    Cantidad INT DEFAULT 0
);
GO

CREATE TABLE Movimientos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ActivoId INT FOREIGN KEY REFERENCES Activos(id),
    OrigenSucursalId INT FOREIGN KEY REFERENCES Sucursales(id),
    DestinoSucursalId INT FOREIGN KEY REFERENCES Sucursales(id),
    Cantidad INT,
    FechaMovimiento DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE ActivosFisicos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ActivoId INT FOREIGN KEY REFERENCES Activos(id),
    NumeroSerie NVARCHAR(100) UNIQUE,
    Estado NVARCHAR(50) DEFAULT 'DISPONIBLE',
    SucursalId INT FOREIGN KEY REFERENCES Sucursales(id),
    FechaRegistro DATETIME DEFAULT GETDATE()
);
GO

CREATE TRIGGER trg_AgregarActivosFisicos
ON Activos
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ActivoId INT, @Cantidad INT, @i INT = 1;

    SELECT @ActivoId = id, @Cantidad = StockTotal FROM INSERTED;

    WHILE @i <= @Cantidad
    BEGIN
        INSERT INTO ActivosFisicos (ActivoId, SucursalId)
        VALUES (@ActivoId, 1); -- Sucursal principal (id=1)

        SET @i = @i + 1;
    END
END;
GO

CREATE TRIGGER TR_AfterInsertActivo
ON Activos
AFTER INSERT
AS
BEGIN
    DECLARE @ActivoId INT
    DECLARE @StockTotal INT
    DECLARE @SucursalPrincipalId INT

    SELECT TOP 1 @ActivoId = id, @StockTotal = StockTotal FROM inserted;

    -- Asumimos que la sucursal principal tiene id = 1
    SET @SucursalPrincipalId = 1;

    -- Insertamos stock para la sucursal principal
    INSERT INTO StockSucursal (ActivoId, SucursalId, Cantidad)
    VALUES (@ActivoId, @SucursalPrincipalId, @StockTotal);

    -- Insertamos stock 0 para las otras sucursales
    INSERT INTO StockSucursal (ActivoId, SucursalId, Cantidad)
    SELECT @ActivoId, id, 0 FROM Sucursales WHERE id <> @SucursalPrincipalId;
END;
GO



