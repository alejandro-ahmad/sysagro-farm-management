import { useState, useMemo } from 'react';
import { Radio, Droplets, Thermometer, BatteryCharging, Wifi, AlertTriangle, CheckCircle2, RefreshCw, Plus, Trash2, ArrowDown, Activity, Layers, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export type UndergroundSensor = {
  id: string;
  nombre: string;
  modelo: string;
  profundidadCm: number;
  zona: string;
  humedadVWC: number; // Porcentaje de contenido volumétrico de agua (10-45%)
  temperatura: number; // °C
  tensionKpa: number; // kPa (negativo)
  conductividadCE: number; // dS/m
  bateria: number; // %
  senial: string;
  estado: 'optimo' | 'alerta' | 'critico';
  ultimaLectura: string;
  observacion: string;
};

// Generador de sensores ficticios basados en el lote
export function getInitialSensorsForLote(loteId: string, loteNombre: string, cultivo: string): UndergroundSensor[] {
  const normalizedId = loteId.toUpperCase();

  if (normalizedId.includes('LOT-02') || loteNombre.toLowerCase().includes('san isidro')) {
    // San Isidro 12 - Maíz en estrés hídrico
    return [
      {
        id: 'SUB-SI12-01',
        nombre: 'Sonda Radicular Superior',
        modelo: 'Sentek Drill & Drop TDR 20cm',
        profundidadCm: 20,
        zona: 'Estrato arable / Absorción primaria',
        humedadVWC: 17.2,
        temperatura: 23.8,
        tensionKpa: -78,
        conductividadCE: 1.42,
        bateria: 92,
        senial: 'LoRaWAN -74 dBm (Excelente)',
        estado: 'critico',
        ultimaLectura: 'Hace 3 min',
        observacion: 'Tensión hídrica superó umbral de marchitez temporal (-65 kPa). Requiere riego urgente.',
      },
      {
        id: 'SUB-SI12-02',
        nombre: 'Sonda Radicular Media',
        modelo: 'Sentek Drill & Drop TDR 45cm',
        profundidadCm: 45,
        zona: 'Zona de desarrollo de raíces adventicias',
        humedadVWC: 19.5,
        temperatura: 21.2,
        tensionKpa: -62,
        conductividadCE: 1.28,
        bateria: 88,
        senial: 'LoRaWAN -77 dBm (Buena)',
        estado: 'alerta',
        ultimaLectura: 'Hace 3 min',
        observacion: 'Reserva hídrica en rápido descenso. Absorción acelerada por el maíz.',
      },
      {
        id: 'SUB-SI12-03',
        nombre: 'Sonda Subsuelo Profundo',
        modelo: 'Campbell SoilVUE-10 TDR 80cm',
        profundidadCm: 80,
        zona: 'Subsuelo y drenaje',
        humedadVWC: 24.1,
        temperatura: 19.0,
        tensionKpa: -41,
        conductividadCE: 1.15,
        bateria: 95,
        senial: 'LoRaWAN -80 dBm (Buena)',
        estado: 'optimo',
        ultimaLectura: 'Hace 11 min',
        observacion: 'Reserva basal estable sin percolación profunda excesiva.',
      },
    ];
  }

  if (normalizedId.includes('LOT-01') || loteNombre.toLowerCase().includes('esperanza')) {
    // La Esperanza 04 - Soja en óptimas condiciones
    return [
      {
        id: 'SUB-LE04-01',
        nombre: 'Sonda Radicular Soja',
        modelo: 'Decagon 5TE Multicapa 20cm',
        profundidadCm: 20,
        zona: 'Estrato nodulación y raíces activas',
        humedadVWC: 28.6,
        temperatura: 21.5,
        tensionKpa: -32,
        conductividadCE: 0.94,
        bateria: 96,
        senial: 'LoRaWAN -70 dBm (Excelente)',
        estado: 'optimo',
        ultimaLectura: 'Hace 2 min',
        observacion: 'Capacidad de campo óptima para fijación de nitrógeno en nódulos de soja.',
      },
      {
        id: 'SUB-LE04-02',
        nombre: 'Sonda Intermedia Soja',
        modelo: 'Decagon 5TE Multicapa 50cm',
        profundidadCm: 50,
        zona: 'Zona de absorción radicular profunda',
        humedadVWC: 32.4,
        temperatura: 19.7,
        tensionKpa: -24,
        conductividadCE: 1.10,
        bateria: 91,
        senial: 'LoRaWAN -72 dBm (Excelente)',
        estado: 'optimo',
        ultimaLectura: 'Hace 2 min',
        observacion: 'Humedad uniforme, excelente capacidad de retención en suelo franco-limoso.',
      },
      {
        id: 'SUB-LE04-03',
        nombre: 'Sonda Drenaje y Salinidad',
        modelo: 'Campbell SoilVUE-10 90cm',
        profundidadCm: 90,
        zona: 'Horizonte subsuperficial / Lixiviación',
        humedadVWC: 34.8,
        temperatura: 18.1,
        tensionKpa: -18,
        conductividadCE: 1.25,
        bateria: 94,
        senial: 'LoRaWAN -75 dBm (Buena)',
        estado: 'optimo',
        ultimaLectura: 'Hace 8 min',
        observacion: 'Sin acumulación salina en subsuelo. Drenaje gravitacional controlado.',
      },
    ];
  }

  if (normalizedId.includes('LOT-04') || loteNombre.toLowerCase().includes('tipas')) {
    // Las Tipas 02 - Citrus (Riego por goteo)
    return [
      {
        id: 'SUB-LT02-01',
        nombre: 'Tensiómetro Bulbo de Goteo',
        modelo: 'Irrometer Watermark 200SS 30cm',
        profundidadCm: 30,
        zona: 'Bulbo húmedo bajo emisor de goteo',
        humedadVWC: 31.8,
        temperatura: 20.3,
        tensionKpa: -21,
        conductividadCE: 0.82,
        bateria: 98,
        senial: 'LoRaWAN -68 dBm (Excelente)',
        estado: 'optimo',
        ultimaLectura: 'Hace 1 min',
        observacion: 'Bulbo de riego completamente formado tras ciclo matutino de 06:00 a 08:00.',
      },
      {
        id: 'SUB-LT02-02',
        nombre: 'Tensiómetro Raíz Profunda',
        modelo: 'Irrometer Watermark 200SS 60cm',
        profundidadCm: 60,
        zona: 'Zona de anclaje y absorción arbórea',
        humedadVWC: 33.2,
        temperatura: 18.5,
        tensionKpa: -18,
        conductividadCE: 0.89,
        bateria: 93,
        senial: 'LoRaWAN -71 dBm (Excelente)',
        estado: 'optimo',
        ultimaLectura: 'Hace 1 min',
        observacion: 'Disponibilidad hídrica continua para floración y cuajado de frutos cítricos.',
      },
    ];
  }

  if (normalizedId.includes('LOT-03') || loteNombre.toLowerCase().includes('carmen')) {
    // El Carmen 07 - Caña de azúcar post cosecha
    return [
      {
        id: 'SUB-EC07-01',
        nombre: 'Sonda Cepa y Rizomas',
        modelo: 'AquaSpy Wireless Probe 30cm',
        profundidadCm: 30,
        zona: 'Corona de socas y rizomas de caña',
        humedadVWC: 25.1,
        temperatura: 21.0,
        tensionKpa: -36,
        conductividadCE: 0.92,
        bateria: 89,
        senial: 'LoRaWAN -79 dBm (Buena)',
        estado: 'optimo',
        ultimaLectura: 'Hace 6 min',
        observacion: 'Suelo con cobertura de rastrojo conservando humedad tras zafra.',
      },
      {
        id: 'SUB-EC07-02',
        nombre: 'Sonda Perfil Profundo Caña',
        modelo: 'AquaSpy Wireless Probe 70cm',
        profundidadCm: 70,
        zona: 'Subsuelo horizonte franco',
        humedadVWC: 29.5,
        temperatura: 18.9,
        tensionKpa: -27,
        conductividadCE: 1.08,
        bateria: 86,
        senial: 'LoRaWAN -82 dBm (Buena)',
        estado: 'optimo',
        ultimaLectura: 'Hace 14 min',
        observacion: 'Humedad suficiente para inicio de rebrote de caña soca.',
      },
    ];
  }

  // Lote genérico / Barbecho / Creado por el usuario
  return [
    {
      id: `SUB-${loteId.slice(0, 4)}-01`,
      nombre: `Sonda Superficie Radicular (${cultivo || 'Suelo'})`,
      modelo: 'Sentek Drill & Drop TDR 25cm',
      profundidadCm: 25,
      zona: 'Horizonte arable A1 (0-30 cm)',
      humedadVWC: 23.4,
      temperatura: 22.4,
      tensionKpa: -42,
      conductividadCE: 0.88,
      bateria: 94,
      senial: 'LoRaWAN -75 dBm (Buena)',
      estado: 'optimo',
      ultimaLectura: 'Hace 5 min',
      observacion: 'Perfil hídrico en condiciones normales de monitoreo agronómico.',
    },
    {
      id: `SUB-${loteId.slice(0, 4)}-02`,
      nombre: 'Sonda Subsuelo y Retención',
      modelo: 'Campbell SoilVUE-10 65cm',
      profundidadCm: 65,
      zona: 'Horizonte B (30-70 cm)',
      humedadVWC: 28.9,
      temperatura: 19.8,
      tensionKpa: -30,
      conductividadCE: 1.02,
      bateria: 91,
      senial: 'LoRaWAN -78 dBm (Buena)',
      estado: 'optimo',
      ultimaLectura: 'Hace 9 min',
      observacion: 'Infiltración regular tras precipitaciones del período.',
    },
  ];
}

export function LoteSensoresTab({ loteId, loteNombre, cultivo }: { loteId: string; loteNombre: string; cultivo: string }) {
  const [sensors, setSensors] = useState<UndergroundSensor[]>(() => getInitialSensorsForLote(loteId, loteNombre, cultivo));
  const [filterDepth, setFilterDepth] = useState<'all' | 'shallow' | 'deep'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Nuevo sensor form state
  const [newNombre, setNewNombre] = useState('');
  const [newProf, setNewProf] = useState('30');
  const [newModelo, setNewModelo] = useState('Sentek Drill & Drop TDR');

  // Cálculos agronómicos de resumen
  const stats = useMemo(() => {
    if (sensors.length === 0) return { avgHumedad: 0, avgTemp: 0, criticalCount: 0, avgTension: 0 };
    const sumH = sensors.reduce((acc, s) => acc + s.humedadVWC, 0);
    const sumT = sensors.reduce((acc, s) => acc + s.temperatura, 0);
    const sumTens = sensors.reduce((acc, s) => acc + s.tensionKpa, 0);
    const critical = sensors.filter(s => s.estado !== 'optimo').length;
    return {
      avgHumedad: (sumH / sensors.length).toFixed(1),
      avgTemp: (sumT / sensors.length).toFixed(1),
      avgTension: Math.round(sumTens / sensors.length),
      criticalCount: critical,
    };
  }, [sensors]);

  const filteredSensors = useMemo(() => {
    if (filterDepth === 'shallow') return sensors.filter(s => s.profundidadCm <= 35);
    if (filterDepth === 'deep') return sensors.filter(s => s.profundidadCm > 35);
    return sensors;
  }, [sensors, filterDepth]);

  // Simular lectura de campo con variaciones naturales
  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSensors(prev =>
        prev.map(s => {
          const deltaH = (Math.random() * 0.8 - 0.4);
          const deltaT = (Math.random() * 0.4 - 0.2);
          const newH = Math.max(12, Math.min(42, Number((s.humedadVWC + deltaH).toFixed(1))));
          const newTemp = Number((s.temperatura + deltaT).toFixed(1));
          return {
            ...s,
            humedadVWC: newH,
            temperatura: newTemp,
            ultimaLectura: 'Recién sincronizado',
          };
        })
      );
      setIsSyncing(false);
      toast.success('Telemetría subterránea sincronizada con gateway LoRaWAN');
    }, 700);
  };

  const handleAddSensor = (e: React.FormEvent) => {
    e.preventDefault();
    const profNum = parseInt(newProf, 10) || 30;
    const newSensor: UndergroundSensor = {
      id: `SUB-${loteId.slice(0, 4)}-0${sensors.length + 1}`,
      nombre: newNombre || `Sensor Subterráneo ${profNum}cm`,
      modelo: newModelo,
      profundidadCm: profNum,
      zona: profNum <= 30 ? 'Capa arable superior' : profNum <= 60 ? 'Zona radicular activa' : 'Subsuelo profundo',
      humedadVWC: Number((24 + Math.random() * 8).toFixed(1)),
      temperatura: Number((18 + Math.random() * 4).toFixed(1)),
      tensionKpa: -Math.round(25 + Math.random() * 20),
      conductividadCE: Number((0.8 + Math.random() * 0.5).toFixed(2)),
      bateria: 98,
      senial: 'LoRaWAN -72 dBm (Excelente)',
      estado: 'optimo',
      ultimaLectura: 'Recién instalado',
      observacion: 'Sensor calibrado para el tipo de suelo del lote.',
    };
    setSensors(prev => [...prev, newSensor]);
    setShowAddForm(false);
    setNewNombre('');
    toast.success(`Sensor subterráneo instalado a ${profNum} cm`);
  };

  const handleDeleteSensor = (id: string) => {
    setSensors(prev => prev.filter(s => s.id !== id));
    toast.info('Sensor retirado de la red de telemetría');
  };

  return (
    <div className="space-y-5">
      {/* ─── Telemetry Overview Cards ─── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Humedad media</span>
            <Droplets size={16} className="text-sky-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stats.avgHumedad}% <span className="text-xs font-semibold text-muted-foreground">VWC</span></p>
          <p className="mt-1 text-[11px] text-muted-foreground">Contenido volumétrico de agua</p>
        </div>

        <div className="rounded-xl border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Temp. Subsuelo</span>
            <Thermometer size={16} className="text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stats.avgTemp}°C</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Promedio en perfil radicular</p>
        </div>

        <div className="rounded-xl border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tensión hídrica</span>
            <Activity size={16} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stats.avgTension} <span className="text-xs font-semibold text-muted-foreground">kPa</span></p>
          <p className="mt-1 text-[11px] text-muted-foreground">Potencial mátrico de succión</p>
        </div>

        <div className="rounded-xl border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Red LoRaWAN</span>
            <Radio size={16} className="text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{sensors.length} <span className="text-xs font-semibold text-muted-foreground">sondas</span></p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px]">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% en línea</span>
          </div>
        </div>
      </div>

      {/* ─── Agronomic Alert Banner if Critical ─── */}
      {stats.criticalCount > 0 ? (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <h4 className="text-sm font-bold">Atención agronómica: Tensión hídrica en nivel de alerta</h4>
            <p className="mt-0.5 text-xs text-amber-800/90 dark:text-amber-300/90">
              Uno o más sensores en el estrato radicular registran desecación del suelo por debajo del umbral recomendado para {cultivo || 'este cultivo'}. Sugerimos activar riego o programar balance hídrico.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs font-semibold">
            Perfil de suelo en <strong>Capacidad de Campo Óptima</strong>. El agua disponible en la zona radicular es adecuada para la transpiración y desarrollo del cultivo.
          </p>
        </div>
      )}

      {/* ─── Vertical Soil Profile Visual Diagram ─── */}
      <div className="overflow-hidden rounded-xl border bg-gradient-to-b from-stone-100 via-stone-200/80 to-amber-950/20 p-4 dark:from-stone-900 dark:via-stone-900/70 dark:to-stone-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Perfil estratigráfico del suelo (0 - 100 cm)</span>
          </div>
          <span className="rounded-full bg-background/80 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground backdrop-blur">
            Lote: {loteNombre}
          </span>
        </div>

        {/* Stratigraphy Graphic */}
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-amber-800/20 bg-amber-100/60 p-2.5 dark:bg-amber-950/30">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 dark:text-amber-300">
              <span>0 - 25 cm · Capa arable</span>
              <span className="rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] dark:bg-amber-900/60">Superficial</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Mayor aireación, evaporación directa y raíces finas.</p>
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
              <span className="size-2 rounded-full bg-primary" />
              <span>{sensors.filter(s => s.profundidadCm <= 25).length} sensor(es) monitoreando</span>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-800/20 bg-emerald-100/50 p-2.5 dark:bg-emerald-950/30">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
              <span>25 - 60 cm · Zona radicular activa</span>
              <span className="rounded bg-emerald-200/80 px-1.5 py-0.5 text-[10px] dark:bg-emerald-900/60">Clave</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Estrato de mayor consumo hídrico y nutrientes del cultivo.</p>
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
              <span className="size-2 rounded-full bg-emerald-600" />
              <span>{sensors.filter(s => s.profundidadCm > 25 && s.profundidadCm <= 60).length} sensor(es) monitoreando</span>
            </div>
          </div>

          <div className="rounded-lg border border-stone-800/20 bg-stone-200/60 p-2.5 dark:bg-stone-900/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-900 dark:text-stone-300">
              <span>60 - 100+ cm · Subsuelo profundo</span>
              <span className="rounded bg-stone-300/80 px-1.5 py-0.5 text-[10px] dark:bg-stone-800">Drenaje</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Reserva freática y detección de lavado de fertilizantes.</p>
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
              <span className="size-2 rounded-full bg-stone-600" />
              <span>{sensors.filter(s => s.profundidadCm > 60).length} sensor(es) monitoreando</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Actions and Filters Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y py-3">
        {/* Depth Filters */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterDepth('all')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${filterDepth === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Todos ({sensors.length})
          </button>
          <button
            onClick={() => setFilterDepth('shallow')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${filterDepth === 'shallow' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Superficial (≤35 cm)
          </button>
          <button
            onClick={() => setFilterDepth('deep')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${filterDepth === 'deep' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Subsuelo (&gt;35 cm)
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSyncTelemetry}
            disabled={isSyncing}
            className="h-8 gap-1.5 text-xs"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar telemetría'}
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-8 gap-1.5 text-xs"
          >
            <Plus size={13} />
            Añadir sensor
          </Button>
        </div>
      </div>

      {/* ─── Add Sensor In-line Form ─── */}
      {showAddForm && (
        <form onSubmit={handleAddSensor} className="rounded-xl border bg-muted/40 p-4 shadow-sm animate-rise">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">Instalar nuevo sensor subterráneo (Simulación)</h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-muted-foreground hover:text-foreground">Cerrar</button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Nombre / Identificador</label>
              <input
                type="text"
                placeholder="Ej. Sonda Raíz Sector Sur"
                value={newNombre}
                onChange={e => setNewNombre(e.target.value)}
                className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Profundidad de enterramiento (cm)</label>
              <select
                value={newProf}
                onChange={e => setNewProf(e.target.value)}
                className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="15">15 cm (Estrato germinación)</option>
                <option value="25">25 cm (Raíz superficial)</option>
                <option value="40">40 cm (Raíz media activa)</option>
                <option value="60">60 cm (Perfil radicular profundo)</option>
                <option value="80">80 cm (Subsuelo / Drenaje)</option>
                <option value="100">100 cm (Napa freática)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Modelo de sonda subterránea</label>
              <select
                value={newModelo}
                onChange={e => setNewModelo(e.target.value)}
                className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Sentek Drill & Drop TDR">Sentek Drill & Drop TDR (Multicapa)</option>
                <option value="Decagon 5TE Frecuencia de Dominio">Decagon 5TE (Humedad/Temp/CE)</option>
                <option value="Campbell SoilVUE-10">Campbell SoilVUE-10 (Alta precisión)</option>
                <option value="Irrometer Watermark 200SS">Irrometer Watermark (Tensiómetro matricial)</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Cancelar</Button>
            <Button type="submit" size="sm">Registrar en lote</Button>
          </div>
        </form>
      )}

      {/* ─── Sensor Cards List ─── */}
      <div className="space-y-3">
        {filteredSensors.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No hay sensores subterráneos para el filtro seleccionado.
          </div>
        ) : (
          filteredSensors.map(sensor => {
            const isCritical = sensor.estado === 'critico';
            const isAlert = sensor.estado === 'alerta';
            const humidityColor = sensor.humedadVWC < 20 ? 'bg-rose-500' : sensor.humedadVWC > 34 ? 'bg-sky-500' : 'bg-emerald-500';

            return (
              <div
                key={sensor.id}
                className={`relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-md ${
                  isCritical ? 'border-rose-500/40 ring-1 ring-rose-500/20' : isAlert ? 'border-amber-500/40' : ''
                }`}
              >
                {/* Lateral depth indicator badge */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Radio size={18} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground text-sm">{sensor.nombre}</h4>
                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
                          {sensor.id}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {sensor.modelo} · {sensor.zona}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Depth Badge */}
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2.5 py-1 text-xs font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                      <ArrowDown size={12} className="text-primary" />
                      Profundidad: {sensor.profundidadCm} cm
                    </span>

                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isCritical
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : isAlert
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {isCritical ? 'Estrés Hídrico' : isAlert ? 'Alerta Humedad' : 'Óptimo'}
                    </span>

                    <button
                      onClick={() => handleDeleteSensor(sensor.id)}
                      className="grid size-7 place-items-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      title="Quitar sensor"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Moisture Gauge Visual Bar */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Droplets size={13} className="text-sky-500" />
                      Humedad Volumétrica (VWC):
                    </span>
                    <span className="font-bold text-foreground">
                      {sensor.humedadVWC}% <span className="font-normal text-muted-foreground">({sensor.humedadVWC < 20 ? 'Bajo punto de recarga' : sensor.humedadVWC > 34 ? 'Saturación temporal' : 'Rango agronómico ideal'})</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all duration-500 ${humidityColor}`}
                      style={{ width: `${Math.min(100, (sensor.humedadVWC / 45) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Subterranean Metrics Grid */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Temp. Suelo</p>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{sensor.temperatura} °C</p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tensión Mátrica</p>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{sensor.tensionKpa} kPa</p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Conductividad (CE)</p>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{sensor.conductividadCE} dS/m</p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Batería & Señal</p>
                    <p className="mt-0.5 flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                      <BatteryCharging size={13} className="text-emerald-500" />
                      {sensor.bateria}%
                    </p>
                  </div>
                </div>

                {/* Footer notes & telemetry timestamp */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 text-[11px] text-muted-foreground">
                  <p className="flex items-center gap-1.5 italic">
                    <Info size={12} className="shrink-0 text-primary" />
                    {sensor.observacion}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Wifi size={12} className="text-muted-foreground" />
                      {sensor.senial}
                    </span>
                    <span>• {sensor.ultimaLectura}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
