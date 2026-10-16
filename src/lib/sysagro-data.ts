export type Labor = { id: string; lote: string; cultivo: string; fecha: string; labor: string; responsable: string; estado: string; superficie?: string; maquinaria?: string; clima?: string; observaciones?: string };
export type Orden = { id: string; lote: string; insumo: string; dosis: string; estado: string; fecha?: string; superficie?: string; aplicador?: string; objetivo?: string; volumen?: string; observaciones?: string };
export type Maquina = { id: string; nombre: string; tipo: string; horas: number; estado: string; service: string; anio?: string; patente?: string; operador?: string; combustible?: string; observaciones?: string };
export type Stock = { id: string; producto: string; categoria: string; cantidad: number; unidad: string; minimo: number; deposito?: string; proveedor?: string; lote_prod?: string; vencimiento?: string; costo?: string };
export type Cosecha = { id: string; lote: string; cultivo: string; hectareas: number; rinde: number; estado: string; fecha?: string; humedad?: string; destino?: string; maquinaria?: string; observaciones?: string };
export type Riego = { id: string; lote: string; humedad: number; ultimo: string; estado: string; sistema?: string; caudal?: string; sensor?: string };
export type SysagroData = { labores: Labor[]; ordenes: Orden[]; maquinas: Maquina[]; stock: Stock[]; cosechas: Cosecha[]; riegos: Riego[] };

export const seedData: SysagroData = {
  labores: [
    { id:'L-1042', lote:'La Esperanza 04', cultivo:'Soja', fecha:'2026-09-19', labor:'Monitoreo de plagas', responsable:'Lucía Medina', estado:'Completada', superficie:'184 ha', maquinaria:'—', clima:'Soleado, 26°C', observaciones:'Baja presión de chinches. Se recomienda nuevo monitoreo en 7 días.' },
    { id:'L-1041', lote:'San Isidro 12', cultivo:'Maíz', fecha:'2026-09-18', labor:'Fertilización nitrogenada', responsable:'Mateo Ruiz', estado:'En curso', superficie:'126 ha', maquinaria:'John Deere 6155J', clima:'Nublado, 22°C', observaciones:'Avance del 60%. Aplicación al voleo de urea.' },
    { id:'L-1039', lote:'El Carmen 07', cultivo:'Caña de azúcar', fecha:'2026-09-16', labor:'Control de malezas', responsable:'Nicolás Paz', estado:'Pendiente', superficie:'210 ha', maquinaria:'Metalfor 7040', clima:'Viento 18 km/h', observaciones:'Esperar ventana sin viento para aplicar.' },
    { id:'L-1035', lote:'Las Tipas 02', cultivo:'Citrus', fecha:'2026-09-14', labor:'Poda sanitaria', responsable:'Elena Díaz', estado:'Completada', superficie:'48 ha', maquinaria:'Herramientas manuales', clima:'Soleado, 24°C', observaciones:'Se retiraron ramas con síntomas de cancrosis.' },
  ],
  ordenes: [
    { id:'OA-231', lote:'San Isidro 12', insumo:'Urea granulada', dosis:'120 kg/ha', estado:'En proceso', fecha:'2026-09-18', superficie:'126 ha', aplicador:'Mateo Ruiz', objetivo:'Nutrición nitrogenada V6', volumen:'—', observaciones:'Requiere 15.120 kg totales.' },
    { id:'OA-228', lote:'La Esperanza 04', insumo:'Glifosato 66%', dosis:'2,2 L/ha', estado:'Aplicado', fecha:'2026-09-10', superficie:'184 ha', aplicador:'Nicolás Paz', objetivo:'Barbecho químico', volumen:'80 L/ha', observaciones:'Aplicado con boquillas antideriva.' },
    { id:'OA-226', lote:'Las Tipas 02', insumo:'Cobre tribásico', dosis:'1,5 kg/ha', estado:'Pendiente', fecha:'2026-09-24', superficie:'48 ha', aplicador:'Elena Díaz', objetivo:'Prevención de cancrosis', volumen:'1.500 L/ha', observaciones:'Aplicar luego de la poda.' },
  ],
  maquinas: [
    { id:'M-01', nombre:'John Deere 6155J', tipo:'Tractor', horas:2840, estado:'Operativa', service:'2026-10-12', anio:'2021', patente:'AE 412 KT', operador:'Mateo Ruiz', combustible:'14 L/h', observaciones:'Cambio de filtros en próximo service.' },
    { id:'M-02', nombre:'Case IH 8250', tipo:'Cosechadora', horas:1780, estado:'En mantenimiento', service:'2026-09-25', anio:'2020', patente:'AD 908 LM', operador:'Carlos Gómez', combustible:'38 L/h', observaciones:'Reparación de cabezal maicero.' },
    { id:'M-03', nombre:'Metalfor 7040', tipo:'Pulverizadora', horas:960, estado:'Operativa', service:'2026-11-03', anio:'2023', patente:'AF 115 PR', operador:'Nicolás Paz', combustible:'11 L/h', observaciones:'Calibración de picos realizada.' },
  ],
  stock: [
    { id:'S-01', producto:'Semilla soja DM 46R18', categoria:'Semillas', cantidad:2200, unidad:'kg', minimo:800, deposito:'Galpón central', proveedor:'Don Mario', lote_prod:'DM-2609', vencimiento:'2027-03-01', costo:'US$ 0,85/kg' },
    { id:'S-02', producto:'Urea granulada', categoria:'Fertilizantes', cantidad:540, unidad:'kg', minimo:1000, deposito:'Galpón central', proveedor:'Profertil', lote_prod:'PF-8812', vencimiento:'2028-01-15', costo:'US$ 0,62/kg' },
    { id:'S-03', producto:'Glifosato 66%', categoria:'Agroquímicos', cantidad:680, unidad:'L', minimo:300, deposito:'Depósito fitosanitario', proveedor:'Atanor', lote_prod:'AT-4401', vencimiento:'2027-11-30', costo:'US$ 4,10/L' },
  ],
  cosechas: [
    { id:'C-01', lote:'La Esperanza 04', cultivo:'Soja', hectareas:184, rinde:3.4, estado:'Planificada', fecha:'2027-04-10', humedad:'13,5%', destino:'Acopio Tucumán', maquinaria:'Case IH 8250', observaciones:'Estimación según monitoreo.' },
    { id:'C-02', lote:'San Isidro 12', cultivo:'Maíz', hectareas:126, rinde:8.1, estado:'En curso', fecha:'2026-09-20', humedad:'16%', destino:'Silo bolsa', maquinaria:'Case IH 8250', observaciones:'Avance del 40%.' },
    { id:'C-03', lote:'El Carmen 07', cultivo:'Caña de azúcar', hectareas:210, rinde:74.5, estado:'Finalizada', fecha:'2026-08-30', humedad:'—', destino:'Ingenio Concepción', maquinaria:'Cosechadora tercerizada', observaciones:'Rendimiento sacarino 11,2%.' },
  ],
  riegos: [
    { id:'R-01', lote:'Las Tipas 02', humedad:32, ultimo:'Hoy, 06:20', estado:'Óptimo', sistema:'Goteo', caudal:'4 L/h por gotero', sensor:'SN-021' },
    { id:'R-02', lote:'San Isidro 12', humedad:18, ultimo:'Ayer, 19:40', estado:'Atención', sistema:'Pivote central', caudal:'120 m³/h', sensor:'SN-014' },
    { id:'R-03', lote:'El Carmen 07', humedad:25, ultimo:'Hoy, 05:10', estado:'Óptimo', sistema:'Aspersión', caudal:'80 m³/h', sensor:'SN-009' },
  ],
};

const KEY = 'sysagro_demo_v2';
export function readData(): SysagroData {
  if (typeof window === 'undefined') return seedData;
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : seedData; } catch { return seedData; }
}
export function writeData(data: SysagroData) { localStorage.setItem(KEY, JSON.stringify(data)); }

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
