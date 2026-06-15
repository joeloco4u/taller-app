-- ============================================================
-- Migration: 002_public_access
-- Descripción: Políticas de lectura pública para recibos
-- ============================================================

-- Permitir SELECT público (anon) en equipos para ver recibos
CREATE POLICY "equipos_select_public"
  ON equipos FOR SELECT
  TO anon
  USING (true);

-- Permitir SELECT público (anon) en clientes para ver datos del ticket
CREATE POLICY "clientes_select_public"
  ON clientes FOR SELECT
  TO anon
  USING (true);
