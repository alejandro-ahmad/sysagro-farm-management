import { useEffect, useRef, useState, useCallback } from 'react';
import type { Lote } from '@/lib/sysagro-data';
import { MapPin, Grid3X3, Map as MapIcon, Eye, Wheat, Droplets, Ruler, Pencil, Trash2, X, Check, Undo2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

/* ───────── Dynamic Leaflet loader (SSR-safe) ───────── */
function useLeaflet() {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);
  useEffect(() => {
    import('leaflet').then(mod => {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      setL(mod.default ?? mod);
    });
  }, []);
  return L;
}

export const ESTADO_LOTE_CONFIG: Record<string, { label: string; color: string; badge: string }> = {
  'En producción': { label: 'En producción', color: '#22c55e', badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  'Requiere atención': { label: 'Requiere atención', color: '#ef4444', badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
  'Cosechado': { label: 'Cosechado', color: '#eab308', badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  'En preparación': { label: 'En preparación', color: '#0ea5e9', badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400' },
  'Sin cultivo': { label: 'Sin cultivo', color: '#94a3b8', badge: 'bg-slate-500/15 text-slate-600 dark:text-slate-400' },
};

export function getLoteColorByEstado(estado?: string, fallbackColor?: string): string {
  if (estado && ESTADO_LOTE_CONFIG[estado]) {
    return ESTADO_LOTE_CONFIG[estado].color;
  }
  return fallbackColor || '#94a3b8';
}

/* ───────── Map component ───────── */
export function LoteMap({ lotes, onSelectLote, onDeleteLote, onAddLote }: {
  lotes: Lote[];
  onSelectLote: (lote: Lote) => void;
  onDeleteLote: (id: string) => void;
  onAddLote: (lote: Lote) => void;
}) {
  const L = useLeaflet();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [view, setView] = useState<'map' | 'grid'>('map');
  const [selected, setSelected] = useState<string | null>(null);

  // Drawing state
  const [drawing, setDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<[number, number][]>([]);
  const drawMarkersRef = useRef<any[]>([]);
  const drawPolylineRef = useRef<any>(null);
  const drawPolygonRef = useRef<any>(null);

  // New lote form
  const [showNewForm, setShowNewForm] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<[number, number][]>([]);

  // Rebuild map
  const buildMap = useCallback(() => {
    if (!L || !mapRef.current || view !== 'map') return;
    if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }

    const map = L.map(mapRef.current, { zoomControl: true, attributionControl: true }).setView([-26.845, -65.20], 13);
    mapInstance.current = map;

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri', maxZoom: 18,
    }).addTo(map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
    }).addTo(map);

    lotes.forEach(lote => {
      if (!lote.coordenadas || lote.coordenadas.length < 3) return;
      const loteColor = getLoteColorByEstado(lote.estado, lote.color);
      const polygon = L.polygon(lote.coordenadas as [number, number][], {
        color: loteColor, fillColor: loteColor, fillOpacity: 0.38, weight: 2.5,
      }).addTo(map);

      polygon.bindTooltip(`<div style="font-family:inherit;padding:2px 4px"><strong>${lote.nombre}</strong><br/>${lote.superficie} ha · ${lote.cultivo_actual}<br/><span style="color:${loteColor};font-weight:600">● ${lote.estado}</span></div>`, {
        sticky: true, className: 'lote-tooltip',
      });

      polygon.on('click', () => {
        if (drawing) return; // Don't select while drawing
        setSelected(lote.id);
        onSelectLote(lote);
      });
    });

    const allCoords = lotes.flatMap(l => l.coordenadas);
    if (allCoords.length > 0) {
      map.fitBounds(L.latLngBounds(allCoords as [number, number][]).pad(0.1));
    }

    return map;
  }, [L, lotes, view, drawing]);

  useEffect(() => {
    const map = buildMap();
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, [L, lotes, view]);

  // Handle drawing mode
  useEffect(() => {
    if (!L || !mapInstance.current || view !== 'map') return undefined;
    const map = mapInstance.current;

    if (drawing) {
      map.getContainer().style.cursor = 'crosshair';

      const handleClick = (e: any) => {
        const point: [number, number] = [e.latlng.lat, e.latlng.lng];
        setDrawPoints(prev => {
          const newPoints = [...prev, point];

          // Add marker
          const markerIcon = L.divIcon({
            className: 'draw-marker',
            html: `<div style="width:12px;height:12px;border-radius:50%;background:#4ade80;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          });
          const marker = L.marker(point, { icon: markerIcon }).addTo(map);
          drawMarkersRef.current.push(marker);

          // Update polyline
          if (drawPolylineRef.current) map.removeLayer(drawPolylineRef.current);
          drawPolylineRef.current = L.polyline(newPoints, { color: '#4ade80', weight: 2, dashArray: '6 4' }).addTo(map);

          // Preview polygon if 3+ points
          if (drawPolygonRef.current) map.removeLayer(drawPolygonRef.current);
          if (newPoints.length >= 3) {
            drawPolygonRef.current = L.polygon(newPoints, { color: '#4ade80', fillColor: '#4ade80', fillOpacity: 0.2, weight: 2, dashArray: '6 4' }).addTo(map);
          }

          return newPoints;
        });
      };

      map.on('click', handleClick);
      return () => { map.off('click', handleClick); };
    } else {
      map.getContainer().style.cursor = '';
      return undefined;
    }
  }, [L, drawing, view]);

  const clearDrawing = useCallback(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    drawMarkersRef.current.forEach(m => map.removeLayer(m));
    drawMarkersRef.current = [];
    if (drawPolylineRef.current) { map.removeLayer(drawPolylineRef.current); drawPolylineRef.current = null; }
    if (drawPolygonRef.current) { map.removeLayer(drawPolygonRef.current); drawPolygonRef.current = null; }
    setDrawPoints([]);
  }, []);

  const startDrawing = () => {
    clearDrawing();
    setDrawing(true);
    toast.info('Hacé click en el mapa para marcar los vértices del lote. Mínimo 3 puntos.');
  };

  const undoLastPoint = () => {
    if (!mapInstance.current || drawPoints.length === 0) return;
    const map = mapInstance.current;
    const lastMarker = drawMarkersRef.current.pop();
    if (lastMarker) map.removeLayer(lastMarker);

    setDrawPoints(prev => {
      const newPoints = prev.slice(0, -1);
      if (drawPolylineRef.current) map.removeLayer(drawPolylineRef.current);
      if (newPoints.length >= 2) {
        drawPolylineRef.current = L!.polyline(newPoints, { color: '#4ade80', weight: 2, dashArray: '6 4' }).addTo(map);
      } else { drawPolylineRef.current = null; }
      if (drawPolygonRef.current) map.removeLayer(drawPolygonRef.current);
      if (newPoints.length >= 3) {
        drawPolygonRef.current = L!.polygon(newPoints, { color: '#4ade80', fillColor: '#4ade80', fillOpacity: 0.2, weight: 2, dashArray: '6 4' }).addTo(map);
      } else { drawPolygonRef.current = null; }
      return newPoints;
    });
  };

  const finishDrawing = () => {
    if (drawPoints.length < 3) {
      toast.error('Necesitás al menos 3 puntos para formar un polígono.');
      return;
    }
    setPendingCoords(drawPoints);
    setShowNewForm(true);
    setDrawing(false);
  };

  const cancelDrawing = () => {
    setDrawing(false);
    clearDrawing();
  };

  const handleNewLoteSave = (formData: Record<string, string>) => {
    const id = `LOT-${Date.now().toString().slice(-4)}`;
    const estado = formData['estado'] || 'En producción';
    const color = getLoteColorByEstado(estado);
    const newLote: Lote = {
      id,
      nombre: formData['nombre'] || 'Nuevo lote',
      superficie: Number(formData['superficie']) || 0,
      cultivo_actual: formData['cultivo_actual'] || 'Sin asignar',
      estado,
      coordenadas: pendingCoords,
      color,
      campania: formData['campania'] || '2026/27',
      tipo_suelo: formData['tipo_suelo'] || '',
      observaciones: formData['observaciones'] || '',
    };
    onAddLote(newLote);
    clearDrawing();
    setShowNewForm(false);
    setPendingCoords([]);
    toast.success(`Lote "${newLote.nombre}" creado con éxito`);
  };

  const estadoBadge = (e: string) => {
    return ESTADO_LOTE_CONFIG[e]?.badge ?? 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={view === 'map' ? 'default' : 'outline'} size="sm" onClick={() => setView('map')}>
          <MapIcon size={16} className="mr-1.5" /> Mapa satelital
        </Button>
        <Button variant={view === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setView('grid')}>
          <Grid3X3 size={16} className="mr-1.5" /> Cuadrícula
        </Button>

        <div className="mx-2 h-6 w-px bg-border" />

        {!drawing ? (
          <Button variant="outline" size="sm" onClick={startDrawing} className="border-success/50 text-success hover:bg-success/10 hover:text-success">
            <Pencil size={16} className="mr-1.5" /> Dibujar nuevo lote
          </Button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 rounded-md bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
              <span className="size-2 animate-pulse rounded-full bg-success" />
              Dibujando · {drawPoints.length} punto{drawPoints.length !== 1 ? 's' : ''}
            </span>
            <Button variant="outline" size="sm" onClick={undoLastPoint} disabled={drawPoints.length === 0}>
              <Undo2 size={14} className="mr-1" /> Deshacer
            </Button>
            <Button size="sm" onClick={finishDrawing} disabled={drawPoints.length < 3} className="bg-success text-white hover:bg-success/90">
              <Check size={14} className="mr-1" /> Cerrar polígono
            </Button>
            <Button variant="ghost" size="sm" onClick={cancelDrawing}>
              <X size={14} className="mr-1" /> Cancelar
            </Button>
          </div>
        )}

        {/* Leyenda de colores por estado */}
        <div className="ml-auto hidden items-center gap-3 rounded-lg border bg-muted/40 px-3 py-1.5 text-[11px] xl:flex">
          <span className="font-bold text-muted-foreground">Estados:</span>
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400"><span className="size-2 rounded-full bg-emerald-500" /> En producción</span>
          <span className="inline-flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400"><span className="size-2 rounded-full bg-rose-500" /> Requiere atención</span>
          <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400"><span className="size-2 rounded-full bg-amber-500" /> Cosechado</span>
          <span className="inline-flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400"><span className="size-2 rounded-full bg-sky-500" /> En preparación</span>
          <span className="inline-flex items-center gap-1 font-medium text-slate-500"><span className="size-2 rounded-full bg-slate-400" /> Sin cultivo</span>
        </div>
      </div>

      {/* Map view */}
      {view === 'map' ? (
        <div className="panel overflow-hidden relative isolate z-0">
          <div ref={mapRef} style={{ height: 500, width: '100%' }} />
          {drawing && (
            <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-card/95 p-3 shadow-lg backdrop-blur border text-xs max-w-xs">
              <p className="font-bold text-foreground">📍 Instrucciones</p>
              <ul className="mt-1.5 space-y-1 text-muted-foreground">
                <li>• Hacé click en el mapa para agregar vértices</li>
                <li>• Mínimo 3 puntos para cerrar el polígono</li>
                <li>• Usá "Deshacer" para quitar el último punto</li>
                <li>• "Cerrar polígono" para completar el dibujo</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* ─── Grid view ─── */
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lotes.map(lote => {
            const loteColor = getLoteColorByEstado(lote.estado, lote.color);
            return (
              <div
                key={lote.id}
                className={`panel group relative overflow-hidden p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${selected === lote.id ? 'ring-2 ring-primary' : ''}`}
              >
                {/* Color bar */}
                <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: loteColor }} />

                <div className="flex items-start justify-between">
                  <button className="flex items-center gap-2.5 text-left" onClick={() => { setSelected(lote.id); onSelectLote(lote); }}>
                    <span className="grid size-10 place-items-center rounded-lg" style={{ background: `${loteColor}22`, color: loteColor }}>
                      <MapPin size={20} />
                    </span>
                    <div>
                      <h4 className="font-bold">{lote.nombre}</h4>
                      <p className="text-xs text-muted-foreground">{lote.id}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${estadoBadge(lote.estado)}`}>
                      <span className="size-1.5 rounded-full bg-current" />
                      {lote.estado}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteLote(lote.id); }}
                      className="grid size-8 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      title="Eliminar lote"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-md bg-muted/60 p-2.5 text-center">
                  <Ruler size={14} className="mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-bold">{lote.superficie} ha</p>
                  <p className="text-[9px] text-muted-foreground">Superficie</p>
                </div>
                <div className="rounded-md bg-muted/60 p-2.5 text-center">
                  <Wheat size={14} className="mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-bold">{lote.cultivo_actual}</p>
                  <p className="text-[9px] text-muted-foreground">Cultivo</p>
                </div>
                <div className="rounded-md bg-muted/60 p-2.5 text-center">
                  <Droplets size={14} className="mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-bold">{lote.tipo_suelo ?? '—'}</p>
                  <p className="text-[9px] text-muted-foreground">Suelo</p>
                </div>
              </div>

              {lote.observaciones && (
                <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{lote.observaciones}</p>
              )}

              <button
                onClick={() => { setSelected(lote.id); onSelectLote(lote); }}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Eye size={13} /> Ver detalle
              </button>
            </div>
          );
        })}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {lotes.map(l => (
          <div key={l.id} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-3 rounded-sm" style={{ background: l.color }} />
            {l.nombre} ({l.superficie} ha)
          </div>
        ))}
      </div>

      {/* ─── New Lote Form Dialog ─── */}
      <NewLoteForm
        open={showNewForm}
        setOpen={(o) => { if (!o) { clearDrawing(); setPendingCoords([]); } setShowNewForm(o); }}
        coordsCount={pendingCoords.length}
        onSave={handleNewLoteSave}
      />
    </div>
  );
}

/* ───────── New Lote Form ───────── */
function NewLoteForm({ open, setOpen, coordsCount, onSave }: {
  open: boolean;
  setOpen: (o: boolean) => void;
  coordsCount: number;
  onSave: (data: Record<string, string>) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-success/15 text-success"><Plus size={18} /></span>
            Nuevo lote dibujado
          </DialogTitle>
          <DialogDescription>
            Polígono con {coordsCount} vértices. Completá los datos del lote.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <LoteInput name="nombre" label="Nombre del lote" placeholder="Ej. La Esperanza 08" required />
          <div className="grid grid-cols-2 gap-4">
            <LoteInput name="superficie" label="Superficie (ha)" placeholder="Ej. 120" type="number" required />
            <LoteInput name="cultivo_actual" label="Cultivo actual" placeholder="Ej. Soja" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Estado y condición</label>
              <select name="estado" defaultValue="En producción" className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring">
                <option value="En producción">🟢 En producción (Óptimo)</option>
                <option value="Requiere atención">🔴 Requiere atención (Alerta sanitaria/riego)</option>
                <option value="Cosechado">🟡 Cosechado</option>
                <option value="En preparación">🔵 En preparación</option>
                <option value="Sin cultivo">⚪ Sin cultivo (Barbecho)</option>
              </select>
            </div>
            <LoteInput name="tipo_suelo" label="Tipo de suelo" placeholder="Ej. Franco-limoso" />
          </div>
          <LoteInput name="campania" label="Campaña" placeholder="Ej. 2026/27" />
          <div>
            <label className="text-sm font-semibold">Observaciones</label>
            <textarea name="observaciones" rows={2} placeholder="Notas sobre el lote..." className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-success hover:bg-success/90 text-white"><Plus size={16} className="mr-1.5" /> Crear lote</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LoteInput({ label, name, placeholder = '', type = 'text', required = false }: { label: string; name: string; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input required={required} name={name} type={type} placeholder={placeholder} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
