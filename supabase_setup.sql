-- =============================================================================
-- SQL SCRIPT FOR SUPABASE PROJECT SETUP (SOLUCIONES F&M)
-- Copy and paste this script directly into the SQL Editor of your Supabase project.
-- =============================================================================

-- 1. Create Products table
CREATE TABLE IF NOT EXISTS public.products (
    id int8 PRIMARY KEY,
    nombre text NOT NULL,
    descripcion text,
    "stockLima" int8 DEFAULT 0,
    "stockArequipa" int8 DEFAULT 0,
    "stockCritico" int8 DEFAULT 0,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 2. Create Transactions table (Contabilidad)
CREATE TABLE IF NOT EXISTS public.transactions (
    id int8 PRIMARY KEY,
    fecha date NOT NULL,
    tipo text NOT NULL,
    categoria text NOT NULL,
    monto float8 NOT NULL,
    descripcion text,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 3. Create Debts table (Cuentas por Pagar)
CREATE TABLE IF NOT EXISTS public.debts (
    id int8 PRIMARY KEY,
    acreedor text NOT NULL,
    "montoPen" float8 DEFAULT 0,
    "montoUsd" float8 DEFAULT 0,
    vencimiento date NOT NULL,
    estado text DEFAULT 'Pendiente',
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Enable public read/write policies (Row Level Security disabled for simple demo setup)
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts DISABLE ROW LEVEL SECURITY;
