-- ============================================================
-- Migration: 001_init
-- Descripción: Creación de tablas clientes y equipos con RLS
-- ============================================================

-- 1. TABLA: clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cedula TEXT NOT NULL UNIQUE,
  telefono TEXT NOT NULL,
  correo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABLA: equipos
CREATE TABLE IF NOT EXISTS equipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo_equipo TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  serial TEXT NOT NULL,
  falla_reportada TEXT NOT NULL,
  accesorios TEXT,
  status TEXT NOT NULL DEFAULT 'recibido'
    CHECK (status IN ('recibido', 'en_revision', 'reparado', 'entregado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_equipos_cliente_id ON equipos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_equipos_status ON equipos(status);
CREATE INDEX IF NOT EXISTS idx_equipos_created_at ON equipos(created_at DESC);

-- 4. RLS (Row Level Security)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;

-- 4a. Políticas para clientes
CREATE POLICY "clientes_insert_authenticated"
  ON clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "clientes_select_authenticated"
  ON clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "clientes_update_authenticated"
  ON clientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4b. Políticas para equipos
CREATE POLICY "equipos_insert_authenticated"
  ON equipos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "equipos_select_authenticated"
  ON equipos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "equipos_update_authenticated"
  ON equipos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "equipos_delete_authenticated"
  ON equipos FOR DELETE
  TO authenticated
  USING (true);
