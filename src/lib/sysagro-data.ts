export type Labor = { id: string; lote: string; cultivo: string; fecha: string; labor: string; responsable: string; estado: string };
export type Orden = { id: string; lote: string; insumo: string; dosis: string; estado: string };
export type Maquina = { id: string; nombre: string; tipo: string; horas: number; estado: string; service: string };
export type Stock = { id: string; producto: string; categoria: string; cantidad: number; unidad: string; minimo: number };
export type Cosecha = { id: string; lote: string; cultivo: string; hectareas: number; rinde: number; estado: string };
export type Riego = { id: string; lote: string; humedad: number; ultimo: string; estado: string };
export type SysagroData = { labores: Labor[]; ordenes: Orden[]; maquinas: Maquina[]; stock: Stock[]; cosechas: Cosecha[]; riegos: Riego[] };

export const seedData: SysagroData = {
  labores: [
    { id:'L-1042', lote:'La Esperanza 04', cultivo:'Soja', fecha:'2026-09-19', labor:'Monitoreo de plagas', responsable:'Lucía Medina', estado:'Completada' },
    { id:'L-1041', lote:'San Isidro 12', cultivo:'Maíz', fecha:'2026-09-18', labor:'Fertilización nitrogenada', responsable:'Mateo Ruiz', estado:'En curso' },
    { id:'L-1039', lote:'El Carmen 07', cultivo:'Caña de azúcar', fecha:'2026-09-16', labor:'Control de malezas', responsable:'Nicolás Paz', estado:'Pendiente' },
    { id:'L-1035', lote:'Las Tipas 02', cultivo:'Citrus', fecha:'2026-09-14', labor:'Poda sanitaria', responsable:'Elena Díaz', estado:'Completada' },
  ],
  ordenes: [
    { id:'OA-231', lote:'San Isidro 12', insumo:'Urea granulada', dosis:'120 kg/ha', estado:'En proceso' },
    { id:'OA-228', lote:'La Esperanza 04', insumo:'Glifosato 66%', dosis:'2,2 L/ha', estado:'Aplicado' },
    { id:'OA-226', lote:'Las Tipas 02', insumo:'Cobre tribásico', dosis:'1,5 kg/ha', estado:'Pendiente' },
  ],
  maquinas: [
    { id:'M-01', nombre:'John Deere 6155J', tipo:'Tractor', horas:2840, estado:'Operativa', service:'2026-10-12' },
    { id:'M-02', nombre:'Case IH 8250', tipo:'Cosechadora', horas:1780, estado:'En mantenimiento', service:'2026-09-25' },
    { id:'M-03', nombre:'Metalfor 7040', tipo:'Pulverizadora', horas:960, estado:'Operativa', service:'2026-11-03' },
  ],
  stock: [
    { id:'S-01', producto:'Semilla soja DM 46R18', categoria:'Semillas', cantidad:2200, unidad:'kg', minimo:800 },
    { id:'S-02', producto:'Urea granulada', categoria:'Fertilizantes', cantidad:540, unidad:'kg', minimo:1000 },
    { id:'S-03', producto:'Glifosato 66%', categoria:'Agroquímicos', cantidad:680, unidad:'L', minimo:300 },
  ],
  cosechas: [
    { id:'C-01', lote:'La Esperanza 04', cultivo:'Soja', hectareas:184, rinde:3.4, estado:'Planificada' },
    { id:'C-02', lote:'San Isidro 12', cultivo:'Maíz', hectareas:126, rinde:8.1, estado:'En curso' },
    { id:'C-03', lote:'El Carmen 07', cultivo:'Caña de azúcar', hectareas:210, rinde:74.5, estado:'Finalizada' },
  ],
  riegos: [
    { id:'R-01', lote:'Las Tipas 02', humedad:32, ultimo:'Hoy, 06:20', estado:'Óptimo' },
    { id:'R-02', lote:'San Isidro 12', humedad:18, ultimo:'Ayer, 19:40', estado:'Atención' },
    { id:'R-03', lote:'El Carmen 07', humedad:25, ultimo:'Hoy, 05:10', estado:'Óptimo' },
  ],
};

const KEY = 'sysagro_demo_v1';
export function readData(): SysagroData {
  if (typeof window === 'undefined') return seedData;
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : seedData; } catch { return seedData; }
}
export function writeData(data: SysagroData) { localStorage.setItem(KEY, JSON.stringify(data)); }
