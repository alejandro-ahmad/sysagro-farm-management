export type Labor = { id: string; lote: string; cultivo: string; fecha: string; labor: string; responsable: string; estado: string; superficie?: string; maquinaria?: string; clima?: string; observaciones?: string; prioridad?: string; duracion?: string; costo_estimado?: string };
export type Orden = { id: string; lote: string; insumo: string; dosis: string; estado: string; fecha?: string; superficie?: string; aplicador?: string; objetivo?: string; volumen?: string; observaciones?: string; metodo?: string; condiciones?: string; receta_nro?: string };
export type Maquina = { id: string; nombre: string; tipo: string; horas: number; estado: string; service: string; anio?: string; patente?: string; operador?: string; combustible?: string; observaciones?: string; ubicacion?: string; valor_seguro?: string; frecuencia_service?: string };
export type Stock = { id: string; producto: string; categoria: string; cantidad: number; unidad: string; minimo: number; deposito?: string; proveedor?: string; lote_prod?: string; vencimiento?: string; costo?: string; codigo_senasa?: string; clase_toxicologica?: string };
export type Cosecha = { id: string; lote: string; cultivo: string; hectareas: number; rinde: number; estado: string; fecha?: string; humedad?: string; destino?: string; maquinaria?: string; observaciones?: string; precio_tn?: string; calidad?: string };
export type Riego = { id: string; lote: string; humedad: number; ultimo: string; estado: string; sistema?: string; caudal?: string; sensor?: string; profundidad?: string; programacion?: string };
export type Lote = { id: string; nombre: string; superficie: number; cultivo_actual: string; estado: string; coordenadas: [number, number][]; color: string; campania?: string; tipo_suelo?: string; observaciones?: string };
export type HistoryEntry = { timestamp: string; module: string; recordId: string; action: 'create' | 'update' | 'delete'; changes?: { field: string; oldValue: string; newValue: string }[]; user: string };
export type SysagroData = { labores: Labor[]; ordenes: Orden[]; maquinas: Maquina[]; stock: Stock[]; cosechas: Cosecha[]; riegos: Riego[]; lotes: Lote[]; history: HistoryEntry[] };

export const seedData: SysagroData = {
  labores: [
    { id:'L-1042', lote:'La Esperanza 04', cultivo:'Soja', fecha:'2026-09-19', labor:'Monitoreo de plagas', responsable:'Lucía Medina', estado:'Completada', superficie:'184 ha', maquinaria:'—', clima:'Soleado, 26°C', observaciones:'Baja presión de chinches. Se recomienda nuevo monitoreo en 7 días.', prioridad:'Media', duracion:'4 horas', costo_estimado:'$45.000' },
    { id:'L-1041', lote:'San Isidro 12', cultivo:'Maíz', fecha:'2026-09-18', labor:'Fertilización nitrogenada', responsable:'Mateo Ruiz', estado:'En curso', superficie:'126 ha', maquinaria:'John Deere 6155J', clima:'Nublado, 22°C', observaciones:'Avance del 60%. Aplicación al voleo de urea.', prioridad:'Alta', duracion:'8 horas', costo_estimado:'$320.000' },
    { id:'L-1039', lote:'El Carmen 07', cultivo:'Caña de azúcar', fecha:'2026-09-16', labor:'Control de malezas', responsable:'Nicolás Paz', estado:'Pendiente', superficie:'210 ha', maquinaria:'Metalfor 7040', clima:'Viento 18 km/h', observaciones:'Esperar ventana sin viento para aplicar.', prioridad:'Alta', duracion:'6 horas', costo_estimado:'$280.000' },
    { id:'L-1035', lote:'Las Tipas 02', cultivo:'Citrus', fecha:'2026-09-14', labor:'Poda sanitaria', responsable:'Elena Díaz', estado:'Completada', superficie:'48 ha', maquinaria:'Herramientas manuales', clima:'Soleado, 24°C', observaciones:'Se retiraron ramas con síntomas de cancrosis.', prioridad:'Baja', duracion:'12 horas', costo_estimado:'$95.000' },
  ],
  ordenes: [
    { id:'OA-231', lote:'San Isidro 12', insumo:'Urea granulada', dosis:'120 kg/ha', estado:'En proceso', fecha:'2026-09-18', superficie:'126 ha', aplicador:'Mateo Ruiz', objetivo:'Nutrición nitrogenada V6', volumen:'—', observaciones:'Requiere 15.120 kg totales.', metodo:'Al voleo', condiciones:'Suelo húmedo, sin viento', receta_nro:'R-2026-0451' },
    { id:'OA-228', lote:'La Esperanza 04', insumo:'Glifosato 66%', dosis:'2,2 L/ha', estado:'Aplicado', fecha:'2026-09-10', superficie:'184 ha', aplicador:'Nicolás Paz', objetivo:'Barbecho químico', volumen:'80 L/ha', observaciones:'Aplicado con boquillas antideriva.', metodo:'Pulverización terrestre', condiciones:'Sin viento, 22°C', receta_nro:'R-2026-0423' },
    { id:'OA-226', lote:'Las Tipas 02', insumo:'Cobre tribásico', dosis:'1,5 kg/ha', estado:'Pendiente', fecha:'2026-09-24', superficie:'48 ha', aplicador:'Elena Díaz', objetivo:'Prevención de cancrosis', volumen:'1.500 L/ha', observaciones:'Aplicar luego de la poda.', metodo:'Pulverización foliar', condiciones:'Temprano a la mañana', receta_nro:'R-2026-0467' },
  ],
  maquinas: [
    { id:'M-01', nombre:'John Deere 6155J', tipo:'Tractor', horas:2840, estado:'Operativa', service:'2026-10-12', anio:'2021', patente:'AE 412 KT', operador:'Mateo Ruiz', combustible:'14 L/h', observaciones:'Cambio de filtros en próximo service.', ubicacion:'Galpón principal', valor_seguro:'US$ 85.000', frecuencia_service:'Cada 500 hs' },
    { id:'M-02', nombre:'Case IH 8250', tipo:'Cosechadora', horas:1780, estado:'En mantenimiento', service:'2026-09-25', anio:'2020', patente:'AD 908 LM', operador:'Carlos Gómez', combustible:'38 L/h', observaciones:'Reparación de cabezal maicero.', ubicacion:'Taller externo', valor_seguro:'US$ 280.000', frecuencia_service:'Cada 300 hs' },
    { id:'M-03', nombre:'Metalfor 7040', tipo:'Pulverizadora', horas:960, estado:'Operativa', service:'2026-11-03', anio:'2023', patente:'AF 115 PR', operador:'Nicolás Paz', combustible:'11 L/h', observaciones:'Calibración de picos realizada.', ubicacion:'Galpón principal', valor_seguro:'US$ 120.000', frecuencia_service:'Cada 400 hs' },
  ],
  stock: [
    { id:'S-01', producto:'Semilla soja DM 46R18', categoria:'Semillas', cantidad:2200, unidad:'kg', minimo:800, deposito:'Galpón central', proveedor:'Don Mario', lote_prod:'DM-2609', vencimiento:'2027-03-01', costo:'US$ 0,85/kg', codigo_senasa:'SEM-00412', clase_toxicologica:'—' },
    { id:'S-02', producto:'Urea granulada', categoria:'Fertilizantes', cantidad:540, unidad:'kg', minimo:1000, deposito:'Galpón central', proveedor:'Profertil', lote_prod:'PF-8812', vencimiento:'2028-01-15', costo:'US$ 0,62/kg', codigo_senasa:'FER-01203', clase_toxicologica:'—' },
    { id:'S-03', producto:'Glifosato 66%', categoria:'Agroquímicos', cantidad:680, unidad:'L', minimo:300, deposito:'Depósito fitosanitario', proveedor:'Atanor', lote_prod:'AT-4401', vencimiento:'2027-11-30', costo:'US$ 4,10/L', codigo_senasa:'AGQ-08823', clase_toxicologica:'Clase IV' },
  ],
  cosechas: [
    { id:'C-01', lote:'La Esperanza 04', cultivo:'Soja', hectareas:184, rinde:3.4, estado:'Planificada', fecha:'2027-04-10', humedad:'13,5%', destino:'Acopio Tucumán', maquinaria:'Case IH 8250', observaciones:'Estimación según monitoreo.', precio_tn:'US$ 340', calidad:'Grado 1' },
    { id:'C-02', lote:'San Isidro 12', cultivo:'Maíz', hectareas:126, rinde:8.1, estado:'En curso', fecha:'2026-09-20', humedad:'16%', destino:'Silo bolsa', maquinaria:'Case IH 8250', observaciones:'Avance del 40%.', precio_tn:'US$ 195', calidad:'Grado 2' },
    { id:'C-03', lote:'El Carmen 07', cultivo:'Caña de azúcar', hectareas:210, rinde:74.5, estado:'Finalizada', fecha:'2026-08-30', humedad:'—', destino:'Ingenio Concepción', maquinaria:'Cosechadora tercerizada', observaciones:'Rendimiento sacarino 11,2%.', precio_tn:'$18.500/tn', calidad:'Premium' },
  ],
  riegos: [
    { id:'R-01', lote:'Las Tipas 02', humedad:32, ultimo:'Hoy, 06:20', estado:'Óptimo', sistema:'Goteo', caudal:'4 L/h por gotero', sensor:'SN-021', profundidad:'30 cm', programacion:'Diario 06:00–08:00' },
    { id:'R-02', lote:'San Isidro 12', humedad:18, ultimo:'Ayer, 19:40', estado:'Atención', sistema:'Pivote central', caudal:'120 m³/h', sensor:'SN-014', profundidad:'45 cm', programacion:'Cada 48 hs' },
    { id:'R-03', lote:'El Carmen 07', humedad:25, ultimo:'Hoy, 05:10', estado:'Óptimo', sistema:'Aspersión', caudal:'80 m³/h', sensor:'SN-009', profundidad:'35 cm', programacion:'Cada 72 hs' },
  ],
  lotes: [
    { id:'LOT-01', nombre:'La Esperanza 04', superficie:184, cultivo_actual:'Soja', estado:'En producción', coordenadas:[[-26.82,-65.22],[-26.82,-65.20],[-26.84,-65.20],[-26.84,-65.22]], color:'#22c55e', campania:'2026/27', tipo_suelo:'Franco-limoso', observaciones:'Lote principal de soja.' },
    { id:'LOT-02', nombre:'San Isidro 12', superficie:126, cultivo_actual:'Maíz', estado:'Requiere atención', coordenadas:[[-26.84,-65.22],[-26.84,-65.20],[-26.86,-65.20],[-26.86,-65.22]], color:'#ef4444', campania:'2026/27', tipo_suelo:'Franco-arcilloso', observaciones:'Maíz con estrés hídrico. Requiere riego urgente.' },
    { id:'LOT-03', nombre:'El Carmen 07', superficie:210, cultivo_actual:'Caña de azúcar', estado:'Cosechado', coordenadas:[[-26.86,-65.22],[-26.86,-65.19],[-26.89,-65.19],[-26.89,-65.22]], color:'#eab308', campania:'2026/27', tipo_suelo:'Franco', observaciones:'Caña para Ingenio Concepción.' },
    { id:'LOT-04', nombre:'Las Tipas 02', superficie:48, cultivo_actual:'Citrus', estado:'En producción', coordenadas:[[-26.82,-65.19],[-26.82,-65.18],[-26.835,-65.18],[-26.835,-65.19]], color:'#22c55e', campania:'2026/27', tipo_suelo:'Arenoso', observaciones:'Plantación de limones y naranjas.' },
    { id:'LOT-05', nombre:'Monte Grande 01', superficie:95, cultivo_actual:'Barbecho', estado:'Sin cultivo', coordenadas:[[-26.835,-65.19],[-26.835,-65.175],[-26.855,-65.175],[-26.855,-65.19]], color:'#94a3b8', campania:'2026/27', tipo_suelo:'Franco-arenoso', observaciones:'Descanso por rotación.' },
  ],
  history: [
    { timestamp:'2026-09-19T14:32:00', module:'labores', recordId:'L-1042', action:'create', user:'Lucía Medina' },
    { timestamp:'2026-09-18T08:15:00', module:'labores', recordId:'L-1041', action:'create', user:'Mateo Ruiz' },
    { timestamp:'2026-09-18T09:00:00', module:'ordenes', recordId:'OA-231', action:'create', user:'Mateo Ruiz' },
    { timestamp:'2026-09-10T07:45:00', module:'ordenes', recordId:'OA-228', action:'update', changes:[{field:'estado',oldValue:'En proceso',newValue:'Aplicado'}], user:'Nicolás Paz' },
  ],
};

const KEY = 'sysagro_demo_v4';
export function readData(): SysagroData {
  if (typeof window === 'undefined') return seedData;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedData;
    const parsed = JSON.parse(raw);
    // Migrate from v2: add missing fields
    if (!parsed.lotes) parsed.lotes = seedData.lotes;
    if (!parsed.history) parsed.history = seedData.history;
    return parsed;
  } catch { return seedData; }
}
export function writeData(data: SysagroData) { localStorage.setItem(KEY, JSON.stringify(data)); }

export function addHistory(data: SysagroData, entry: Omit<HistoryEntry, 'timestamp'>): SysagroData {
  return { ...data, history: [{ ...entry, timestamp: new Date().toISOString() }, ...data.history] };
}

export type Session = { email: string; nombre: string; plan: 'basico' | 'premium' };
const SKEY = 'sysagro_session';
export const DEMO_USERS: (Session & { password: string })[] = [
  { email: 'premium@sysagro.com', password: 'sysagro123', nombre: 'Alejandro Ahmad', plan: 'premium' },
  { email: 'basico@sysagro.com', password: 'sysagro123', nombre: 'Productor Demo', plan: 'basico' },
];
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try { const r = localStorage.getItem(SKEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
export function login(email: string, password: string): Session | null {
  const u = DEMO_USERS.find(x => x.email === email.trim().toLowerCase() && x.password === password);
  if (!u) return null;
  const s: Session = { email: u.email, nombre: u.nombre, plan: u.plan };
  localStorage.setItem(SKEY, JSON.stringify(s));
  return s;
}
export function logout() { localStorage.removeItem(SKEY); }
