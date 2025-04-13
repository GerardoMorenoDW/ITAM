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
    Estatus NVARCHAR(50) DEFAULT 'ACTIVE', -- 👈 aquí está el valor por defecto
    Sucursal NVARCHAR(100),
    Departamento NVARCHAR(100),
    UsuarioAsignado NVARCHAR(100),
    FechaAdquisicion DATE,
    FechaExpiracion DATE,
    Proveedor NVARCHAR(100),
    Costo DECIMAL(18,2),
    Observaciones NVARCHAR(MAX)
);
GO



