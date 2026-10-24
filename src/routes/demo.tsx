import { createFileRoute, Link } from '@tanstack/react-router';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, ArrowLeft, BarChart3, Bell, BookOpen, Edit3, Eye, History, LogOut, MapPin, Save, Sparkles, Lock, Boxes, ChevronRight, CircleDollarSign, CloudSun, Droplets, Gauge, Leaf, Menu, Plus, Search, Sprout, Tractor, Trash2, Wheat, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getSession, logout, readData, seedData, writeData, addHistory, type Session, type SysagroData, type HistoryEntry, type Lote } from '@/lib/sysagro-data';
import { LoteMap, getLoteColorByEstado } from '@/components/lote-map';

export const Route=createFileRoute('/demo')({head:()=>({meta:[{title:'Demo del sistema — Sysagro'},{name:'description',content:'Dashboard interactivo de gestión agropecuaria Sysagro.'},{property:'og:title',content:'Demo del sistema — Sysagro'},{property:'og:description',content:'Explorá la gestión integral de una operación agropecuaria.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Demo});

type Module='ia'|'dashboard'|'labores'|'ordenes'|'maquinas'|'bodega'|'costos'|'cosechas'|'lotes';
const modules=[['dashboard','Dashboard principal',Gauge],['lotes','Mapa de lotes',MapPin],['labores','Cuaderno de campo',BookOpen],['ordenes','Órdenes de aplicación',Leaf],['maquinas','Maquinarias',Tractor],['bodega','Gestión de bodega',Boxes],['costos','Costos y tesorería',CircleDollarSign],['cosechas','Cosechas & riego',Wheat],['ia','Asistente IA (Premium)',Sparkles]] as const;
const newRecordLabel: Record<string, string> = { labores: 'Nueva labor', ordenes: 'Nueva orden', maquinas: 'Nueva maquinaria', bodega: 'Nuevo insumo', cosechas: 'Nueva cosecha' };
const costData=[{m:'Abr',g:42,p:50},{m:'May',g:48,p:52},{m:'Jun',g:61,p:58},{m:'Jul',g:54,p:62},{m:'Ago',g:72,p:70},{m:'Sep',g:66,p:76}];
const yieldData=[{m:'Soja',v:3.4},{m:'Maíz',v:8.1},{m:'Caña',v:74.5},{m:'Citrus',v:31.2}];

type DetailPayload = { record: Record<string, unknown>; module: string };
const DetailCtx = createContext<(p: DetailPayload) => void>(() => {});

const labels: Record<string, string> = {
  id:'Código', lote:'Lote', cultivo:'Cultivo', fecha:'Fecha', labor:'Labor', responsable:'Responsable', estado:'Estado', superficie:'Superficie', maquinaria:'Maquinaria', clima:'Clima', observaciones:'Observaciones', insumo:'Insumo', dosis:'Dosis', aplicador:'Aplicador', objetivo:'Objetivo', volumen:'Volumen de caldo', nombre:'Nombre', tipo:'Tipo', horas:'Horas de uso', service:'Próximo service', anio:'Año', patente:'Patente', operador:'Operador', combustible:'Consumo', producto:'Producto', categoria:'Categoría', cantidad:'Cantidad', unidad:'Unidad', minimo:'Stock mínimo', deposito:'Depósito', proveedor:'Proveedor', lote_prod:'Lote de producto', vencimiento:'Vencimiento', costo:'Costo unitario', hectareas:'Hectáreas', rinde:'Rinde (tn/ha)', humedad:'Humedad', destino:'Destino', ultimo:'Último riego', sistema:'Sistema', caudal:'Caudal', sensor:'Sensor',
  // New fields
  prioridad:'Prioridad', duracion:'Duración estimada', costo_estimado:'Costo estimado', metodo:'Método de aplicación', condiciones:'Condiciones requeridas', receta_nro:'Nro. de receta', ubicacion:'Ubicación actual', valor_seguro:'Valor asegurado', frecuencia_service:'Frecuencia de service', codigo_senasa:'Código SENASA', clase_toxicologica:'Clase toxicológica', precio_tn:'Precio por tn', calidad:'Calidad', profundidad:'Profundidad de medición', programacion:'Programación', cultivo_actual:'Cultivo actual', coordenadas:'Coordenadas', color:'Color', campania:'Campaña', tipo_suelo:'Tipo de suelo',
};

// Fields that shouldn't be editable
const readOnlyFields = new Set(['id', 'coordenadas', 'color']);
// Fields that are numeric
const numericFields = new Set(['horas', 'cantidad', 'minimo', 'hectareas', 'rinde', 'humedad', 'superficie_num']);

function View({ r, mod }: { r: object; mod: string }) {
  const open = useContext(DetailCtx);
  return <Button variant='ghost' size='icon' aria-label='Ver detalle' onClick={() => open({ record: r as Record<string, unknown>, module: mod })} className='text-muted-foreground hover:text-primary'><Eye /></Button>;
}

/* ═══════ MAIN DEMO COMPONENT ═══════ */
function Demo() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [detail, setDetail] = useState<DetailPayload | null>(null);
  useEffect(() => { const s = getSession(); if (!s) navigate({ to: '/login' }); else setSession(s); }, []);
  const [mod, setMod] = useState<Module>('dashboard');
  const [data, setData] = useState<SysagroData>(seedData);
  const [ready, setReady] = useState(false);
  const [side, setSide] = useState(false);
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => { setData(readData()); setReady(true); }, []);
  useEffect(() => { if (ready) writeData(data); }, [data, ready]);

  const updateRecord = useCallback((module: string, id: string, updates: Record<string, unknown>, userName: string) => {
    setData(prev => {
      const key = module as keyof SysagroData;
      const arr = prev[key] as any[];
      const oldRecord = arr.find((x: any) => x.id === id);
      if (!oldRecord) return prev;

      if (module === 'lotes' && updates['estado']) {
        updates['color'] = getLoteColorByEstado(String(updates['estado']));
      }

      const changes = Object.entries(updates)
        .filter(([k, v]) => String(oldRecord[k] ?? '') !== String(v))
        .map(([k, v]) => ({ field: k, oldValue: String(oldRecord[k] ?? ''), newValue: String(v) }));

      if (changes.length === 0) return prev;

      const newArr = arr.map((x: any) => x.id === id ? { ...x, ...updates } : x);
      const newData = { ...prev, [key]: newArr };
      return addHistory(newData, { module, recordId: id, action: 'update', changes, user: userName });
    });
    toast.success('Registro actualizado');
  }, []);

  if (!session) return null;
  const title = modules.find(x => x[0] === mod)?.[1] ?? '';

  const remove = (key: keyof SysagroData, id: string) => {
    setData(d => {
      const newData = { ...d, [key]: (d[key] as any[]).filter((x: { id: string }) => x.id !== id) };
      return addHistory(newData, { module: key, recordId: id, action: 'delete', user: session.nombre });
    });
    toast.success('Registro eliminado');
  };

  return (
    <DetailCtx.Provider value={setDetail}>
      <div className="min-h-screen bg-muted/55">
        {/* ─── Sidebar ─── */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r bg-surface-dark text-primary-foreground transition-transform lg:translate-x-0 ${side ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-18 items-center justify-between border-b border-primary-foreground/10 px-5">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground"><Sprout /></span>
              <span className="font-display text-xl font-bold">Sysagro</span>
            </Link>
            <Button variant="ghost" size="icon" className="text-primary-foreground lg:hidden" onClick={() => setSide(false)}><X /></Button>
          </div>
          <div className="px-4 py-5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-primary-foreground/40">Establecimiento</p>
            <div className="mt-2 rounded-md bg-primary-foreground/8 p-3">
              <p className="text-sm font-bold">Estancia La Esperanza</p>
              <p className="mt-1 text-xs text-primary-foreground/50">Tucumán · Campaña 26/27</p>
            </div>
          </div>
          <nav className="space-y-1 px-3">
            {modules.map(([id, label, I]) => (
              <button key={id} onClick={() => { setMod(id); setSide(false); }} className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold ${mod === id ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/65 hover:bg-primary-foreground/8 hover:text-primary-foreground'}`}>
                <I size={18} />{label}{mod === id && <ChevronRight className="ml-auto" size={15} />}
              </button>
            ))}
          </nav>
          <Link to="/" className="absolute bottom-5 left-5 flex items-center gap-2 text-xs font-semibold text-primary-foreground/55 hover:text-primary-foreground"><ArrowLeft size={15} /> Volver al sitio</Link>
        </aside>

        {/* ─── Main ─── */}
        <main className="lg:pl-72">
          <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-7">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSide(true)}><Menu /></Button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Demo en vivo</p>
                <h1 className="font-display text-lg font-bold">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-2 text-xs font-semibold sm:flex"><CloudSun size={16} className="text-primary" /> 24°C · Humedad 61%</div>
              <Button variant="ghost" size="icon" className="relative"><Bell /><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" /></Button>
              <span className={`hidden rounded-full px-3 py-1 text-[10px] font-extrabold uppercase sm:inline ${session.plan === 'premium' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-primary'}`}>Plan {session.plan === 'premium' ? 'Premium · IA' : 'Básico'}</span>
              <span title={session.nombre} className="grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{session.nombre.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
              <Button variant='ghost' size='icon' aria-label='Cerrar sesión' onClick={() => { logout(); navigate({ to: '/login' }); }}><LogOut /></Button>
            </div>
          </header>

          <div className="p-4 md:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Información actualizada al 21 de septiembre de 2026</p>
              </div>
              {!['dashboard', 'costos', 'ia', 'lotes'].includes(mod) && <Button onClick={() => setModal(true)}><Plus /> {newRecordLabel[mod] ?? 'Nuevo registro'}</Button>}
            </div>

            {mod === 'dashboard' && <Dashboard data={data} />}
            {mod === 'lotes' && <LotesModule data={data} setData={setData} session={session} />}
            {mod === 'labores' && <Labores data={data} query={query} setQuery={setQuery} remove={id => remove('labores', id)} />}
            {mod === 'ordenes' && <Ordenes data={data} remove={id => remove('ordenes', id)} />}
            {mod === 'maquinas' && <Maquinas data={data} remove={id => remove('maquinas', id)} />}
            {mod === 'bodega' && <Bodega data={data} remove={id => remove('stock', id)} />}
            {mod === 'costos' && <Costos />}
            {mod === 'ia' && <IA plan={session.plan} />}
            {mod === 'cosechas' && <Cosechas data={data} removeC={id => remove('cosechas', id)} removeR={id => remove('riegos', id)} />}
          </div>
        </main>

        {/* ─── New Record Modal ─── */}
        <NewRecord open={modal} setOpen={setModal} mod={mod} data={data} setData={setData} userName={session.nombre} />

        {/* ─── Detail / Edit Modal ─── */}
        <DetailModal detail={detail} setDetail={setDetail} data={data} updateRecord={updateRecord} userName={session.nombre} />
      </div>
    </DetailCtx.Provider>
  );
}

/* ═══════ DETAIL MODAL WITH TABS ═══════ */
function DetailModal({ detail, setDetail, data, updateRecord, userName }: {
  detail: DetailPayload | null;
  setDetail: (d: DetailPayload | null) => void;
  data: SysagroData;
  updateRecord: (module: string, id: string, updates: Record<string, unknown>, user: string) => void;
  userName: string;
}) {
  const [tab, setTab] = useState<'info' | 'edit' | 'history'>('info');
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  // Reset tab when detail changes
  useEffect(() => {
    if (detail) {
      setTab('info');
      const vals: Record<string, string> = {};
      Object.entries(detail.record).forEach(([k, v]) => { vals[k] = String(v ?? ''); });
      setEditValues(vals);
    }
  }, [detail]);

  if (!detail) return null;

  const recordId = String(detail.record['id'] ?? '');
  const historyEntries = data.history.filter(h => h.recordId === recordId);

  const handleSave = () => {
    const updates: Record<string, unknown> = {};
    Object.entries(editValues).forEach(([k, v]) => {
      if (readOnlyFields.has(k)) return;
      if (numericFields.has(k)) { updates[k] = Number(v) || 0; }
      else { updates[k] = v; }
    });
    updateRecord(detail.module, recordId, updates, userName);
    // Update the detail view
    setDetail({ ...detail, record: { ...detail.record, ...updates } });
    setTab('info');
  };

  const tabClass = (t: string) => `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`;

  return (
    <Dialog open={!!detail} onOpenChange={o => !o && setDetail(null)}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <span className='grid size-8 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold'>{recordId.slice(0, 2)}</span>
            Registro {recordId}
          </DialogTitle>
          <DialogDescription>Información completa guardada en el sistema.</DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className='flex gap-1 rounded-lg bg-muted/60 p-1'>
          <button className={tabClass('info')} onClick={() => setTab('info')}><Eye size={15} /> Detalle</button>
          <button className={tabClass('edit')} onClick={() => setTab('edit')}><Edit3 size={15} /> Editar</button>
          <button className={tabClass('history')} onClick={() => setTab('history')}>
            <History size={15} /> Historial
            {historyEntries.length > 0 && <span className='ml-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground'>{historyEntries.length}</span>}
          </button>
        </div>

        {/* ─── Info Tab ─── */}
        {tab === 'info' && (
          <dl className='grid gap-3 sm:grid-cols-2'>
            {Object.entries(detail.record).filter(([k]) => k !== 'coordenadas' && k !== 'color').map(([k, v]) => (
              <div key={k} className={`rounded-md border p-3 transition-colors hover:bg-muted/40 ${k === 'observaciones' ? 'sm:col-span-2' : ''}`}>
                <dt className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>{labels[k] ?? k}</dt>
                <dd className='mt-1 text-sm font-semibold'>{String(v || '—')}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* ─── Edit Tab ─── */}
        {tab === 'edit' && (
          <div className='space-y-4'>
            <div className='grid gap-3 sm:grid-cols-2'>
              {Object.entries(editValues).filter(([k]) => !readOnlyFields.has(k)).map(([k]) => (
                <div key={k} className={k === 'observaciones' ? 'sm:col-span-2' : ''}>
                  <label className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>{labels[k] ?? k}</label>
                  {k === 'observaciones' ? (
                    <textarea
                      value={editValues[k]}
                      onChange={e => setEditValues(p => ({ ...p, [k]: e.target.value }))}
                      rows={3}
                      className='mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none'
                    />
                  ) : k === 'estado' ? (
                    <select
                      value={editValues[k]}
                      onChange={e => setEditValues(p => ({ ...p, [k]: e.target.value }))}
                      className='mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
                    >
                      {['Pendiente', 'En curso', 'En proceso', 'Completada', 'Aplicado', 'Operativa', 'En mantenimiento', 'Planificada', 'Finalizada', 'Óptimo', 'Atención', 'En producción', 'Requiere atención', 'Cosechado', 'En preparación', 'Sin cultivo'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : k === 'prioridad' ? (
                    <select
                      value={editValues[k]}
                      onChange={e => setEditValues(p => ({ ...p, [k]: e.target.value }))}
                      className='mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
                    >
                      {['Baja', 'Media', 'Alta', 'Urgente'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={numericFields.has(k) ? 'number' : k === 'fecha' || k === 'vencimiento' || k === 'service' ? 'date' : 'text'}
                      value={editValues[k]}
                      onChange={e => setEditValues(p => ({ ...p, [k]: e.target.value }))}
                      className='mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
                    />
                  )}
                </div>
              ))}
            </div>
            <div className='flex justify-end gap-2 border-t pt-4'>
              <Button variant='outline' onClick={() => setTab('info')}>Cancelar</Button>
              <Button onClick={handleSave}><Save size={16} className='mr-1.5' /> Guardar cambios</Button>
            </div>
          </div>
        )}

        {/* ─── History Tab ─── */}
        {tab === 'history' && (
          <div className='space-y-3'>
            {historyEntries.length === 0 ? (
              <p className='py-8 text-center text-sm text-muted-foreground'>No hay historial de cambios para este registro.</p>
            ) : (
              historyEntries.map((h, i) => (
                <div key={i} className='rounded-md border p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${h.action === 'create' ? 'bg-success/15 text-success' : h.action === 'delete' ? 'bg-destructive/15 text-destructive' : 'bg-accent/15 text-accent'}`}>
                        {h.action === 'create' ? '+' : h.action === 'delete' ? '×' : '↻'}
                      </span>
                      <span className='text-sm font-bold capitalize'>
                        {h.action === 'create' ? 'Creación' : h.action === 'delete' ? 'Eliminación' : 'Modificación'}
                      </span>
                    </div>
                    <span className='text-[11px] text-muted-foreground'>
                      {new Date(h.timestamp).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className='mt-2 text-xs text-muted-foreground'>Por: <strong className='text-foreground'>{h.user}</strong></p>
                  {h.changes && h.changes.length > 0 && (
                    <div className='mt-3 space-y-1.5'>
                      {h.changes.map((c, j) => (
                        <div key={j} className='flex items-center gap-2 rounded bg-muted/60 px-3 py-1.5 text-xs'>
                          <span className='font-bold text-muted-foreground'>{labels[c.field] ?? c.field}:</span>
                          <span className='line-through text-destructive/70'>{c.oldValue || '—'}</span>
                          <span className='text-muted-foreground'>→</span>
                          <span className='font-semibold text-success'>{c.newValue || '—'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ═══════ LOTES MODULE ═══════ */
function LotesModule({ data, setData, session }: { data: SysagroData; setData: React.Dispatch<React.SetStateAction<SysagroData>>; session: Session }) {
  const openDetail = useContext(DetailCtx);

  const handleDeleteLote = useCallback((id: string) => {
    setData(prev => {
      const newData = { ...prev, lotes: prev.lotes.filter(l => l.id !== id) };
      return addHistory(newData, { module: 'lotes', recordId: id, action: 'delete', user: session.nombre });
    });
    toast.success('Lote eliminado del mapa');
  }, [setData, session.nombre]);

  const handleAddLote = useCallback((lote: Lote) => {
    setData(prev => {
      const newData = { ...prev, lotes: [...prev.lotes, lote] };
      return addHistory(newData, { module: 'lotes', recordId: lote.id, action: 'create', user: session.nombre });
    });
  }, [setData, session.nombre]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={MapPin} label="Total de lotes" value={String(data.lotes.length)} trend={`${data.lotes.reduce((a, l) => a + l.superficie, 0)} ha totales`} />
        <Metric icon={Wheat} label="En producción" value={String(data.lotes.filter(l => l.estado === 'En producción').length)} trend="Lotes activos" />
        <Metric icon={Leaf} label="Cultivos" value={String(new Set(data.lotes.map(l => l.cultivo_actual)).size)} trend="Variedades distintas" />
        <Metric icon={Droplets} label="Superficie productiva" value={`${data.lotes.filter(l => l.estado !== 'Sin cultivo').reduce((a, l) => a + l.superficie, 0)} ha`} trend="Sin contar barbecho" />
      </div>

      {/* Map */}
      <LoteMap
        lotes={data.lotes}
        onSelectLote={(lote) => openDetail({ record: lote as unknown as Record<string, unknown>, module: 'lotes' })}
        onDeleteLote={handleDeleteLote}
        onAddLote={handleAddLote}
      />
    </div>
  );
}

/* ═══════ MODULE COMPONENTS ═══════ */
function Dashboard({ data }: { data: SysagroData }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Wheat} label="Has sembradas" value="1.240 ha" trend="+8,4% vs. campaña anterior" />
        <Metric icon={BarChart3} label="Rinde estimado" value="6,8 tn/ha" trend="Proyección favorable" />
        <Metric icon={Droplets} label="Alertas de riego" value="2 lotes" trend="Requieren atención" warn />
        <Metric icon={CircleDollarSign} label="Presupuesto ejecutado" value="68%" trend="$ 66,4M de $ 97,8M" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Costos vs. presupuesto" subtitle="En millones de ARS">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costData}>
                <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity={.3} /><stop offset="1" stopColor="var(--primary)" stopOpacity={.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="m" /><YAxis /><Tooltip />
                <Area type="monotone" dataKey="p" stroke="var(--accent)" fill="transparent" />
                <Area type="monotone" dataKey="g" stroke="var(--primary)" fill="url(#fill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Actividad reciente" subtitle="Últimos movimientos">
          <div className="space-y-1">
            {data.labores.slice(0, 4).map(l => (
              <div key={l.id} className="flex gap-3 border-b py-3 last:border-0">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
                <div>
                  <p className="text-sm font-semibold">{l.labor}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{l.lote} · {l.responsable}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Estado productivo por cultivo" subtitle="Rinde estimado (tn/ha)">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yieldData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" /><YAxis dataKey="m" type="category" width={55} /><Tooltip />
              <Bar dataKey="v" fill="var(--primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function Metric({ icon: I, label, value, trend, warn = false }: { icon: any; label: string; value: string; trend: string; warn?: boolean }) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between">
        <span className={`grid size-10 place-items-center rounded-md ${warn ? 'bg-warning/20 text-warning' : 'bg-secondary text-primary'}`}><I size={20} /></span>
        <span className={`status-dot mt-2 ${warn ? 'text-warning' : 'text-success'}`} />
      </div>
      <p className="mt-5 text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{trend}</p>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="panel p-5">
      <div className="mb-5"><h3 className="font-bold">{title}</h3><p className="mt-1 text-xs text-muted-foreground">{subtitle}</p></div>
      {children}
    </section>
  );
}

const badge = (s: string) => s.includes('Complet') || s === 'Aplicado' || s === 'Operativa' || s === 'Óptimo' || s === 'Finalizada' ? 'bg-success/12 text-primary' : s.includes('Pend') || s.includes('Atención') ? 'bg-warning/20 text-foreground' : 'bg-secondary text-primary';

function Status({ s }: { s: string }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${badge(s)}`}><span className="status-dot" />{s}</span>;
}

function SearchBox({ value, set }: { value: string; set: (s: string) => void }) {
  return (
    <div className="relative mb-4 max-w-sm">
      <Search className="absolute left-3 top-2.5 text-muted-foreground" size={17} />
      <input value={value} onChange={e => set(e.target.value)} placeholder="Buscar por lote, cultivo o labor..." className="h-10 w-full rounded-md border bg-card pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}

function Labores({ data, query, setQuery, remove }: { data: SysagroData; query: string; setQuery: (s: string) => void; remove: (id: string) => void }) {
  const rows = data.labores.filter(x => Object.values(x).join(' ').toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <SearchBox value={query} set={setQuery} />
      <Table heads={['ID', 'Fecha / lote', 'Cultivo', 'Labor', 'Responsable', 'Prioridad', 'Estado', '']} rows={rows.map(x => [
        x.id,
        <><b>{x.fecha}</b><small>{x.lote}</small></>,
        x.cultivo,
        x.labor,
        x.responsable,
        x.prioridad ? <PriorityBadge p={x.prioridad} /> : '—',
        <Status s={x.estado} />,
        <span className='flex'><View r={x} mod='labores' /><Delete on={() => remove(x.id)} /></span>,
      ])} />
    </>
  );
}

function PriorityBadge({ p }: { p: string }) {
  const cls = p === 'Alta' || p === 'Urgente' ? 'bg-destructive/12 text-destructive' : p === 'Media' ? 'bg-warning/15 text-foreground' : 'bg-muted text-muted-foreground';
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cls}`}>{p}</span>;
}

function Ordenes({ data, remove }: { data: SysagroData; remove: (id: string) => void }) {
  return <Table heads={['Orden', 'Lote', 'Insumo', 'Dosis', 'Método', 'Estado', '']} rows={data.ordenes.map(x => [x.id, x.lote, x.insumo, x.dosis, x.metodo ?? '—', <Status s={x.estado} />, <span className='flex'><View r={x} mod='ordenes' /><Delete on={() => remove(x.id)} /></span>])} />;
}

function Maquinas({ data, remove }: { data: SysagroData; remove: (id: string) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.maquinas.map(x => (
        <div key={x.id} className="panel p-5">
          <div className="flex justify-between">
            <span className="grid size-11 place-items-center rounded-md bg-secondary text-primary"><Tractor /></span>
            <span className='flex'><View r={x} mod='maquinas' /><Delete on={() => remove(x.id)} /></span>
          </div>
          <h3 className="mt-5 font-bold">{x.nombre}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{x.tipo} · {x.horas.toLocaleString()} horas</p>
          {x.ubicacion && <p className="mt-1 text-xs text-muted-foreground">📍 {x.ubicacion}</p>}
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <Status s={x.estado} />
            <span className="text-[11px] text-muted-foreground">Service: {x.service}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Bodega({ data, remove }: { data: SysagroData; remove: (id: string) => void }) {
  return <Table heads={['Producto', 'Categoría', 'Stock actual', 'Stock mínimo', 'Proveedor', 'Estado', '']} rows={data.stock.map(x => [x.producto, x.categoria, `${x.cantidad.toLocaleString()} ${x.unidad}`, `${x.minimo.toLocaleString()} ${x.unidad}`, x.proveedor ?? '—', x.cantidad < x.minimo ? <span className="flex items-center gap-1 text-xs font-bold text-destructive"><AlertTriangle size={14} /> Reponer</span> : <Status s="Óptimo" />, <span className='flex'><View r={x} mod='stock' /><Delete on={() => remove(x.id)} /></span>])} />;
}

function Costos() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <Panel title="Ejecución mensual" subtitle="Gastos reales frente al presupuesto">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="m" /><YAxis /><Tooltip />
              <Bar dataKey="p" name="Presupuesto" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="g" name="Gastos" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Distribución de gastos" subtitle="Campaña 2026/27">
        <div className="space-y-6">
          {[['Insumos', 42], ['Maquinaria', 24], ['Personal', 19], ['Servicios', 15]].map(([n, v]) => (
            <div key={n as string}>
              <div className="mb-2 flex justify-between text-sm"><b>{n}</b><span>{v}%</span></div>
              <div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Cosechas({ data, removeC, removeR }: { data: SysagroData; removeC: (id: string) => void; removeR: (id: string) => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel title="Control de cosechas" subtitle="Avance y rendimiento">
        <Table heads={['Lote', 'Cultivo', 'Superficie', 'Rinde', 'Calidad', '']} rows={data.cosechas.map(x => [x.lote, x.cultivo, `${x.hectareas} ha`, `${x.rinde} tn/ha`, x.calidad ?? '—', <span className='flex'><View r={x} mod='cosechas' /><Delete on={() => removeC(x.id)} /></span>])} />
      </Panel>
      <Panel title="Monitoreo de riego" subtitle="Humedad del suelo">
        <div className="space-y-3">
          {data.riegos.map(x => (
            <div key={x.id} className="flex items-center gap-4 rounded-md border p-4">
              <Droplets className={x.humedad < 20 ? 'text-destructive' : 'text-primary'} />
              <div className="flex-1">
                <p className="text-sm font-bold">{x.lote}</p>
                <p className="text-xs text-muted-foreground">Último riego: {x.ultimo}</p>
              </div>
              <strong>{x.humedad}%</strong>
              <Status s={x.estado} />
              <span className='flex'><View r={x} mod='riegos' /><Delete on={() => removeR(x.id)} /></span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Table({ heads, rows }: { heads: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b bg-muted/60">
          <tr>{heads.map((h, i) => <th key={i} className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => <tr key={i} className="border-b last:border-0 hover:bg-muted/35">{r.map((c, j) => <td key={j} className="px-4 py-4 [&_small]:mt-1 [&_small]:block [&_small]:text-muted-foreground">{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function Delete({ on }: { on: () => void }) {
  return <Button variant="ghost" size="icon" aria-label="Eliminar" onClick={on} className="text-muted-foreground hover:text-destructive"><Trash2 /></Button>;
}

function NewRecord({ open, setOpen, mod, data, setData, userName }: {
  open: boolean;
  setOpen: (x: boolean) => void;
  mod: Module;
  data: SysagroData;
  setData: React.Dispatch<React.SetStateAction<SysagroData>>;
  userName: string;
}) {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const id = Date.now().toString();
    let newData = { ...data };
    let recordId = '';

    if (mod === 'labores') {
      recordId = `L-${id.slice(-4)}`;
      newData = {
        ...data,
        labores: [
          {
            id: recordId,
            lote: v['lote'] || '',
            cultivo: v['cultivo'] || '',
            fecha: v['fecha'] || new Date().toISOString().slice(0, 10),
            labor: v['labor'] || '',
            responsable: v['responsable'] || userName,
            estado: 'Pendiente',
            prioridad: v['prioridad'] || 'Media',
            superficie: v['superficie'] ? `${v['superficie']} ha` : '',
            maquinaria: v['maquinaria'] || '—',
            observaciones: v['observaciones'] || '',
          },
          ...data.labores,
        ],
      };
    } else if (mod === 'ordenes') {
      recordId = `OA-${id.slice(-3)}`;
      newData = {
        ...data,
        ordenes: [
          {
            id: recordId,
            lote: v['lote'] || '',
            insumo: v['insumo'] || '',
            dosis: v['dosis'] || '',
            estado: 'Pendiente',
            fecha: v['fecha'] || new Date().toISOString().slice(0, 10),
            metodo: v['metodo'] || 'Pulverización terrestre',
            aplicador: v['aplicador'] || userName,
            objetivo: v['objetivo'] || '',
            receta_nro: v['receta_nro'] || '',
            observaciones: v['observaciones'] || '',
          },
          ...data.ordenes,
        ],
      };
    } else if (mod === 'maquinas') {
      recordId = `M-${id.slice(-2)}`;
      newData = {
        ...data,
        maquinas: [
          {
            id: recordId,
            nombre: v['nombre'] || '',
            tipo: v['tipo'] || 'Tractor',
            horas: Number(v['horas']) || 0,
            estado: v['estado'] || 'Operativa',
            service: v['service'] || '',
            patente: v['patente'] || '',
            operador: v['operador'] || userName,
            ubicacion: v['ubicacion'] || 'Galpón principal',
            observaciones: v['observaciones'] || '',
          },
          ...data.maquinas,
        ],
      };
    } else if (mod === 'bodega') {
      recordId = `S-${id.slice(-2)}`;
      newData = {
        ...data,
        stock: [
          {
            id: recordId,
            producto: v['producto'] || '',
            categoria: v['categoria'] || 'Insumos',
            cantidad: Number(v['cantidad']) || 0,
            unidad: v['unidad'] || 'kg',
            minimo: Number(v['minimo']) || 500,
            deposito: v['deposito'] || 'Galpón central',
            proveedor: v['proveedor'] || '',
            vencimiento: v['vencimiento'] || '',
          },
          ...data.stock,
        ],
      };
    } else if (mod === 'cosechas') {
      recordId = `C-${id.slice(-2)}`;
      newData = {
        ...data,
        cosechas: [
          {
            id: recordId,
            lote: v['lote'] || '',
            cultivo: v['cultivo'] || '',
            hectareas: Number(v['hectareas']) || 0,
            rinde: Number(v['rinde']) || 0,
            estado: 'Planificada',
            fecha: v['fecha'] || '',
            humedad: v['humedad'] ? `${v['humedad']}%` : '—',
            destino: v['destino'] || 'Acopio',
            observaciones: v['observaciones'] || '',
          },
          ...data.cosechas,
        ],
      };
    }

    if (recordId) {
      setData(addHistory(newData, { module: mod === 'bodega' ? 'stock' : mod, recordId, action: 'create', user: userName }));
      toast.success(`${newRecordLabel[mod] ?? 'Registro'} guardado con éxito`);
      setOpen(false);
    }
  };

  const loteOptions = data.lotes.map(l => l.nombre);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
              <Plus size={18} />
            </span>
            {mod === 'labores' && 'Nueva labor (Cuaderno de campo)'}
            {mod === 'ordenes' && 'Nueva orden de aplicación'}
            {mod === 'maquinas' && 'Registrar nueva maquinaria'}
            {mod === 'bodega' && 'Nuevo insumo en bodega'}
            {mod === 'cosechas' && 'Planificar nueva cosecha'}
            {!['labores', 'ordenes', 'maquinas', 'bodega', 'cosechas'].includes(mod) && (newRecordLabel[mod] ?? 'Nuevo registro')}
          </DialogTitle>
          <DialogDescription>
            {mod === 'labores' && 'Registrá una labor agronómica, monitoreo o tratamiento en el lote.'}
            {mod === 'ordenes' && 'Emití una prescripción fitosanitaria o nutricional para el equipo.'}
            {mod === 'maquinas' && 'Incorporá un nuevo equipo, tractor o implemento al parque automotor.'}
            {mod === 'bodega' && 'Registrá ingresos de stock, insumos o semillas a los depósitos.'}
            {mod === 'cosechas' && 'Establecé estimaciones de rinde, superficie y logística de cosecha.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4 pt-2">
          {/* LABORES */}
          {mod === 'labores' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Lote</label>
                  <select name="lote" required className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Seleccionar lote...</option>
                    {loteOptions.map(l => <option key={l} value={l}>{l}</option>)}
                    <option value="General">General / Múltiples lotes</option>
                  </select>
                </div>
                <Input name="cultivo" label="Cultivo" placeholder="Ej. Soja de 1ra, Maíz, Caña" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="labor" label="Labor / Tarea agronómica" placeholder="Ej. Fertilización nitrogenada" required />
                <Input name="fecha" label="Fecha" type="date" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="responsable" label="Responsable a cargo" placeholder="Ej. Lucía Medina" required />
                <div>
                  <label className="text-sm font-semibold">Prioridad</label>
                  <select name="prioridad" defaultValue="Media" className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="superficie" label="Superficie a tratar (ha)" type="number" placeholder="Ej. 120" />
                <Input name="maquinaria" label="Maquinaria asignada" placeholder="Ej. John Deere 6155J" />
              </div>

              <div>
                <label className="text-sm font-semibold">Observaciones y condiciones</label>
                <textarea name="observaciones" rows={2} placeholder="Detalles de aplicación, clima, dosis recomendada..." className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <Button type="submit" size="lg" className="mt-2 bg-primary text-primary-foreground">
                <Plus size={16} className="mr-1.5" /> Guardar labor de campo
              </Button>
            </>
          )}

          {/* ORDENES */}
          {mod === 'ordenes' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Lote destino</label>
                  <select name="lote" required className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Seleccionar lote...</option>
                    {loteOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <Input name="insumo" label="Insumo / Fitosanitario" placeholder="Ej. Glifosato 66%, Urea granulada" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="dosis" label="Dosis prescrita" placeholder="Ej. 2,2 L/ha o 120 kg/ha" required />
                <Input name="fecha" label="Fecha de aplicación" type="date" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Método de aplicación</label>
                  <select name="metodo" defaultValue="Pulverización terrestre" className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="Pulverización terrestre">Pulverización terrestre</option>
                    <option value="Al voleo">Al voleo</option>
                    <option value="Pulverización foliar">Pulverización foliar</option>
                    <option value="Fertirriego">Fertirriego</option>
                    <option value="Aéreo">Aéreo</option>
                  </select>
                </div>
                <Input name="aplicador" label="Aplicador / Maquinista" placeholder="Ej. Mateo Ruiz" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="objetivo" label="Objetivo agronómico" placeholder="Ej. Barbecho químico, Nutrición V6" />
                <Input name="receta_nro" label="Nro. Receta agronómica" placeholder="Ej. R-2026-0499" />
              </div>

              <div>
                <label className="text-sm font-semibold">Instrucciones y seguridad</label>
                <textarea name="observaciones" rows={2} placeholder="Condiciones de viento, boquillas, orden de carga de tanque..." className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <Button type="submit" size="lg" className="mt-2 bg-primary text-primary-foreground">
                <Plus size={16} className="mr-1.5" /> Emitir orden de aplicación
              </Button>
            </>
          )}

          {/* MAQUINAS */}
          {mod === 'maquinas' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input name="nombre" label="Nombre / Modelo de la máquina" placeholder="Ej. New Holland T7.245" required />
                <div>
                  <label className="text-sm font-semibold">Tipo de maquinaria</label>
                  <select name="tipo" defaultValue="Tractor" className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="Tractor">Tractor</option>
                    <option value="Cosechadora">Cosechadora</option>
                    <option value="Pulverizadora">Pulverizadora</option>
                    <option value="Sembradora">Sembradora</option>
                    <option value="Tolva autodescargable">Tolva autodescargable</option>
                    <option value="Desmalezadora">Desmalezadora</option>
                    <option value="Camión">Camión</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="horas" label="Horas de motor acumuladas" type="number" placeholder="Ej. 1250" required />
                <Input name="service" label="Fecha próximo service" type="date" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="patente" label="Patente / Matrícula interna" placeholder="Ej. AF 782 QR" />
                <Input name="operador" label="Operador habitual" placeholder="Ej. Nicolás Paz" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Estado operativo</label>
                  <select name="estado" defaultValue="Operativa" className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="Operativa">Operativa</option>
                    <option value="En mantenimiento">En mantenimiento</option>
                    <option value="Fuera de servicio">Fuera de servicio</option>
                  </select>
                </div>
                <Input name="ubicacion" label="Ubicación habitual" placeholder="Ej. Galpón principal" />
              </div>

              <div>
                <label className="text-sm font-semibold">Historial o notas de mantenimiento</label>
                <textarea name="observaciones" rows={2} placeholder="Último cambio de fluidos, calibración..." className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <Button type="submit" size="lg" className="mt-2 bg-primary text-primary-foreground">
                <Plus size={16} className="mr-1.5" /> Registrar maquinaria
              </Button>
            </>
          )}

          {/* BODEGA */}
          {mod === 'bodega' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input name="producto" label="Nombre del producto / insumo" placeholder="Ej. Semilla Soja DM 46R18" required />
                <div>
                  <label className="text-sm font-semibold">Categoría</label>
                  <select name="categoria" defaultValue="Semillas" className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="Semillas">Semillas</option>
                    <option value="Fertilizantes">Fertilizantes</option>
                    <option value="Agroquímicos">Agroquímicos</option>
                    <option value="Repuestos">Repuestos</option>
                    <option value="Combustibles">Combustibles</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input name="cantidad" label="Cantidad inicial" type="number" placeholder="Ej. 1000" required />
                <div>
                  <label className="text-sm font-semibold">Unidad</label>
                  <select name="unidad" defaultValue="kg" className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="bolsas">bolsas</option>
                    <option value="tn">tn</option>
                    <option value="unidades">unidades</option>
                  </select>
                </div>
                <Input name="minimo" label="Stock mínimo" type="number" placeholder="Ej. 300" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="deposito" label="Depósito / Galpón" placeholder="Ej. Galpón central" />
                <Input name="proveedor" label="Proveedor" placeholder="Ej. Profertil, Don Mario" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="vencimiento" label="Fecha de vencimiento" type="date" />
                <Input name="costo" label="Costo unitario" placeholder="Ej. US$ 0,85/kg" />
              </div>

              <Button type="submit" size="lg" className="mt-2 bg-primary text-primary-foreground">
                <Plus size={16} className="mr-1.5" /> Ingresar insumo a bodega
              </Button>
            </>
          )}

          {/* COSECHAS */}
          {mod === 'cosechas' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Lote a cosechar</label>
                  <select name="lote" required className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Seleccionar lote...</option>
                    {loteOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <Input name="cultivo" label="Cultivo" placeholder="Ej. Soja, Maíz, Caña" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input name="hectareas" label="Superficie a cosechar (ha)" type="number" placeholder="Ej. 180" required />
                <Input name="rinde" label="Rinde estimado (tn/ha)" type="number" step="0.1" placeholder="Ej. 3.5" required />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input name="fecha" label="Fecha estimada" type="date" required />
                <Input name="humedad" label="Humedad grano (%)" placeholder="Ej. 14" />
                <Input name="destino" label="Destino de acopio" placeholder="Ej. Silo bolsa, Acopio" />
              </div>

              <div>
                <label className="text-sm font-semibold">Observaciones logísticas</label>
                <textarea name="observaciones" rows={2} placeholder="Camiones asignados, tolvas, secadora..." className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <Button type="submit" size="lg" className="mt-2 bg-primary text-primary-foreground">
                <Plus size={16} className="mr-1.5" /> Planificar cosecha
              </Button>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Input({ label, name, placeholder = '', type = 'text', required = false, step }: { label: string; name: string; placeholder?: string; type?: string; required?: boolean; step?: string }) {
  return (
    <label className="text-sm font-semibold">{label}
      <input required={required} name={name} type={type} step={step} placeholder={placeholder} className="mt-2 h-10 w-full rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}

function IA({ plan }: { plan: Session['plan'] }) {
  if (plan !== 'premium') return (
    <div className="panel mx-auto max-w-lg p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-secondary text-primary"><Lock /></span>
      <h3 className="mt-4 text-xl font-bold">Disponible en el Plan Premium</h3>
      <p className="mt-2 text-sm text-muted-foreground">El Plan Básico no incluye Inteligencia Artificial. Pasate a Premium para obtener predicciones de rinde, alertas tempranas y recomendaciones automáticas.</p>
      <Button asChild className="mt-6"><Link to="/contacto" search={{ plan: 'premium' }}>Adquirir Plan Premium</Link></Button>
    </div>
  );
  const recs = [
    ['Predicción de rinde', 'San Isidro 12 (Maíz) proyecta 8,4 tn/ha, +3,7% sobre lo estimado, si se completa la fertilización esta semana.'],
    ['Alerta de riego', 'San Isidro 12 tiene 18% de humedad. Se recomienda regar 25 mm en las próximas 24 horas.'],
    ['Alerta de plagas', 'Condiciones de calor y humedad favorecen chinches en La Esperanza 04. Monitorear en 3 días.'],
    ['Stock', 'La urea granulada está por debajo del mínimo. Sugerimos comprar 1.000 kg antes del 25/09.'],
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recs.map(([t, d]) => (
        <div key={t} className="panel p-5">
          <div className="flex items-center gap-2 text-primary"><Sparkles size={18} /><h3 className="font-bold">{t}</h3></div>
          <p className="mt-3 text-sm text-muted-foreground">{d}</p>
        </div>
      ))}
    </div>
  );
}
