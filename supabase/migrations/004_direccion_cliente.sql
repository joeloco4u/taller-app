-- ============================================================
-- Migration: 004_direccion_cliente
-- Descripción: Agrega columna direccion a la tabla clientes
-- ============================================================

ALTER TABLE clientes
  ADD COLUMN IF NOT EXISTS direccion TEXT;
