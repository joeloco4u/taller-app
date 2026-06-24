export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string;
          nombre: string;
          cedula: string;
          telefono: string;
          correo: string | null;
          direccion: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          cedula: string;
          telefono: string;
          correo?: string | null;
          direccion?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          cedula?: string;
          telefono?: string;
          correo?: string | null;
          direccion?: string | null;
          created_at?: string;
        };
      };
      equipos: {
        Row: {
          id: string;
          cliente_id: string;
          tipo_equipo: string;
          marca: string;
          modelo: string;
          serial: string;
          falla_reportada: string;
          accesorios: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          tipo_equipo: string;
          marca: string;
          modelo: string;
          serial: string;
          falla_reportada: string;
          accesorios?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          tipo_equipo?: string;
          marca?: string;
          modelo?: string;
          serial?: string;
          falla_reportada?: string;
          accesorios?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};
