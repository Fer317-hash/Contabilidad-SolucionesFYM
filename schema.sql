-- =============================================================================
-- SQL SCHEMA: INVENTARIO Y CONTABILIDAD
-- =============================================================================
-- Este archivo contiene las definiciones de tabla para dos motores de base de datos
-- comunes: PostgreSQL (ideal para producción) y SQLite (ideal para desarrollo local).
--
-- Se aplican restricciones estrictas (CHECK constraints) para garantizar la integridad
-- de los datos, previniendo incoherencias (ej. registrar un egreso en categoría de ingreso).
-- =============================================================================


-- =============================================================================
-- OPCIÓN A: DIALECTO POSTGRESQL
-- =============================================================================

/* 
-- Descomenta esta sección si estás usando PostgreSQL

-- 1. Definición de Enums para mayor robustez
CREATE TYPE tipo_movimiento_enum AS ENUM ('Ingreso', 'Egreso');

CREATE TYPE categoria_movimiento_enum AS ENUM (
    'PAGO ADELANTO CLIENTE',
    'PAGO TOTAL CLIENTE',
    'COMPRA DE EQUIPOS',
    'REPARTO RICARDO',
    'REPARTO FERNANDO',
    'PAGO DEUDA',
    'PAGO PUBLICIDAD',
    'PAGO PERSONAL DE VENTA',
    'PAGO DHL'
);

-- 2. Tabla Inventario
CREATE TABLE inventario (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(255) NOT NULL,
    descripcion TEXT,
    cantidad_stock INTEGER NOT NULL DEFAULT 0 CHECK (cantidad_stock >= 0),
    precio_compra NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (precio_compra >= 0),
    precio_venta NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (precio_venta >= 0),
    fecha_ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla Contabilidad
CREATE TABLE contabilidad (
    id_transaccion SERIAL PRIMARY KEY,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    tipo_movimiento tipo_movimiento_enum NOT NULL,
    categoria categoria_movimiento_enum NOT NULL,
    monto NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (monto >= 0),
    notas_descripcion TEXT,
    
    -- Restricción estricta de coherencia lógica
    CONSTRAINT chk_coherencia_movimiento CHECK (
        (tipo_movimiento = 'Ingreso' AND categoria IN ('PAGO ADELANTO CLIENTE', 'PAGO TOTAL CLIENTE')) OR
        (tipo_movimiento = 'Egreso' AND categoria IN (
            'COMPRA DE EQUIPOS',
            'REPARTO RICARDO',
            'REPARTO FERNANDO',
            'PAGO DEUDA',
            'PAGO PUBLICIDAD',
            'PAGO PERSONAL DE VENTA',
            'PAGO DHL'
        ))
    )
);

-- Índices de rendimiento
CREATE INDEX idx_inventario_nombre ON inventario(nombre_producto);
CREATE INDEX idx_contabilidad_fecha ON contabilidad(fecha);
CREATE INDEX idx_contabilidad_tipo ON contabilidad(tipo_movimiento);
*/


-- =============================================================================
-- OPCIÓN B: DIALECTO SQLITE / ANSI SQL ESTÁNDAR
-- =============================================================================

-- 1. Tabla Inventario
CREATE TABLE IF NOT EXISTS inventario (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_producto TEXT NOT NULL,
    descripcion TEXT,
    cantidad_stock INTEGER NOT NULL DEFAULT 0 CHECK (cantidad_stock >= 0),
    precio_compra REAL NOT NULL DEFAULT 0.00 CHECK (precio_compra >= 0.0),
    precio_venta REAL NOT NULL DEFAULT 0.00 CHECK (precio_venta >= 0.0),
    fecha_ultima_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Contabilidad con validación estricta de Enums
CREATE TABLE IF NOT EXISTS contabilidad (
    id_transaccion INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE NOT NULL,
    tipo_movimiento TEXT NOT NULL,
    categoria TEXT NOT NULL,
    monto REAL NOT NULL DEFAULT 0.00 CHECK (monto >= 0.0),
    notas_descripcion TEXT,

    -- Restricción para Tipo de Movimiento
    CONSTRAINT chk_tipo_movimiento CHECK (tipo_movimiento IN ('Ingreso', 'Egreso')),

    -- Restricción estricta de Categorías permitidas (Enum solicitado)
    CONSTRAINT chk_categoria CHECK (categoria IN (
        'PAGO ADELANTO CLIENTE',
        'PAGO TOTAL CLIENTE',
        'COMPRA DE EQUIPOS',
        'REPARTO RICARDO',
        'REPARTO FERNANDO',
        'PAGO DEUDA',
        'PAGO PUBLICIDAD',
        'PAGO PERSONAL DE VENTA',
        'PAGO DHL'
    )),

    -- Restricción de coherencia lógica: Asocia categorías a su respectivo tipo
    CONSTRAINT chk_coherencia_movimiento CHECK (
        (tipo_movimiento = 'Ingreso' AND categoria IN ('PAGO ADELANTO CLIENTE', 'PAGO TOTAL CLIENTE')) OR
        (tipo_movimiento = 'Egreso' AND categoria IN (
            'COMPRA DE EQUIPOS',
            'REPARTO RICARDO',
            'REPARTO FERNANDO',
            'PAGO DEUDA',
            'PAGO PUBLICIDAD',
            'PAGO PERSONAL DE VENTA',
            'PAGO DHL'
        ))
    )
);

-- Creación de índices para optimizar búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_inventario_nombre ON inventario(nombre_producto);
CREATE INDEX IF NOT EXISTS idx_contabilidad_fecha ON contabilidad(fecha);
CREATE INDEX IF NOT EXISTS idx_contabilidad_tipo_categoria ON contabilidad(tipo_movimiento, categoria);
