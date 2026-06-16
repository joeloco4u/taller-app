-- ============================================================
-- Migration: 003_salida_equipos
-- Descripción: Agrega columnas de notas, costo y salida
-- ============================================================

ALTER TABLE equipos
  ADD COLUMN IF NOT EXISTS notas_entrega TEXT,
  ADD COLUMN IF NOT EXISTS costo TEXT,
  ADD COLUMN IF NOT EXISTS fecha_salida TIMESTAMPTZ;
