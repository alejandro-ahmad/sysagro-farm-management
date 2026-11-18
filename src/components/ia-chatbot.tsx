import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Copy, Check, Droplets, Wheat, Bug, Boxes, Tractor, HelpCircle, ArrowRight, Lightbulb, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { SysagroData, Session } from '@/lib/sysagro-data';

type Message = {
  id: string;
  sender: 'user' | 'ia';
  text: string;
  timestamp: string;
  badge?: string | undefined;
  recommendations?: string[] | undefined;
};

const SUGGESTED_PROMPTS = [
  { label: '💧 Humedad y sensores subterráneos', prompt: '¿Cómo está la humedad y los sensores subterráneos de San Isidro 12?' },
  { label: '🌾 Proyección de rinde 2026/27', prompt: '¿Cuál es la proyección de rinde estimada para soja, maíz y caña?' },
  { label: '🐛 Alertas de plagas y fitosanitarias', prompt: '¿Hay alertas fitosanitarias o presencia de plagas en los lotes?' },
  { label: '📦 Stock crítico en bodega', prompt: '¿Cuáles insumos están por debajo del stock mínimo de seguridad?' },
  { label: '🚜 Estado de maquinarias', prompt: '¿Cuál es el estado operativo de los tractores y cosechadoras?' },
  { label: '📊 Resumen agronómico general', prompt: 'Hacé un diagnóstico general del estado de las 1.240 ha gestionadas.' },
];

export function IAChatbot({ data, session }: { data: SysagroData; session: Session }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ia',
      text: `¡Hola **${session.nombre}**! 👋 Soy tu **Asistente AgroIA** en Sysagro.\n\nEstoy conectado en tiempo real a tus **${data.lotes.length} lotes**, telemetría de **sensores subterráneos LoRaWAN**, cuaderno de campo digital, bodega e historial de labores.\n\n¿En qué puedo ayudarte hoy para optimizar tu producción? Podés elegir una consulta rápida o escribir tu propia pregunta.`,
      timestamp: 'Ahora',
      badge: 'AgroLLM v4.2 · Norte Argentino',
      recommendations: [
        'San Isidro 12: estrés hídrico detectado (-78 kPa)',
        'Urea granulada: stock por debajo del mínimo (540 kg)',
        'La Esperanza 04: monitoreo de chinches recomendado',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'chat' | 'cards'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Generador de respuestas inteligentes basadas en datos reales del sistema
  const generateResponse = (query: string): { text: string; badge?: string; recommendations?: string[] } => {
    const q = query.toLowerCase();

    if (q.includes('humedad') || q.includes('riego') || q.includes('sensor') || q.includes('san isidro')) {
      const lote = data.lotes.find(l => l.nombre.toLowerCase().includes('san isidro')) || data.lotes[1];
      const riego = data.riegos.find(r => r.lote.toLowerCase().includes('san isidro')) || data.riegos[1];
      return {
        badge: 'Alerta Hídrica Crítica',
        text: `📍 **Diagnóstico de Sensores Subterráneos en ${lote?.nombre ?? 'San Isidro 12'}:**\n\n` +
          `• **Perfil radicular (20 cm):** Registra un **17.2% de humedad volumétrica (VWC)** y una **tensión de -78 kPa**. Superó el umbral de estrés hídrico severo.\n` +
          `• **Perfil medio (45 cm):** 19.5% VWC (-62 kPa), reserva en acelerado descenso por evapotranspiración del maíz.\n` +
          `• **Subsuelo (80 cm):** 24.1% VWC (-41 kPa), reserva basal aún disponible pero en caída.\n\n` +
          `💡 **Recomendación agronómica prioritaria:**\n` +
          `Activar de inmediato el **${riego?.sistema ?? 'Pivote central'}** (${riego?.caudal ?? '120 m³/h'}) para aplicar una lámina neta de **25 mm** en las próximas 18 horas. De demorarse, la merma potencial de rinde en espigazón se estima en ~140 kg/ha por día de retraso.`,
        recommendations: [
          'Activar riego de 25 mm en San Isidro 12',
          'Verificar calibración de electroválvulas',
          'Monitorear telemetría LoRaWAN en 6 horas',
        ],
      };
    }

    if (q.includes('rinde') || q.includes('rendimiento') || q.includes('cosecha') || q.includes('soja') || q.includes('maiz') || q.includes('caña')) {
      return {
        badge: 'Predicción de Rinde IA',
        text: `🌾 **Proyecciones Productivas Campaña 2026/27:**\n\n` +
          `• **La Esperanza 04 (Soja · 184 ha):**\n` +
          `  - Estimación actual: **3.6 tn/ha** (+5.8% vs. histórico zonal).\n` +
          `  - Estado: Nódulos radiculares activos, excelente humedad en perfil (28.6% VWC).\n\n` +
          `• **San Isidro 12 (Maíz · 126 ha):**\n` +
          `  - Estimación potencial: **8.4 tn/ha** si se mitiga el estrés hídrico actual.\n` +
          `  - Avance de fertilización: 60% completado (Urea al voleo).\n\n` +
          `• **El Carmen 07 (Caña de azúcar · 210 ha):**\n` +
          `  - Cosecha finalizada con **74.5 tn/ha** y rendimiento sacarino del **11.2%**.\n` +
          `  - Destino: Ingenio Concepción (Calidad Premium liquidada a $18.500/tn).\n\n` +
          `• **Las Tipas 02 (Citrus · 48 ha):**\n` +
          `  - Estimación: **31.2 tn/ha** con óptimo cuajado tras poda sanitaria.\n\n` +
          `💰 **Total facturación estimada en pie:** superará los **US$ 1.84M** bajo precios FOB vigentes.`,
        recommendations: [
          'Asegurar cupo de entrega en Acopio Tucumán',
          'Completar fertilización nitrogenada en maíz',
        ],
      };
    }

    if (q.includes('plaga') || q.includes('chinche') || q.includes('sanitar') || q.includes('maleza') || q.includes('enfermedad')) {
      return {
        badge: 'Alerta Fitosanitaria',
        text: `🐛 **Monitoreo de Plagas y Sanidad Vegetal:**\n\n` +
          `• **La Esperanza 04 (Soja):**\n` +
          `  - Labor L-1042 registrada por Lucía Medina detectó presencia incipiente de **chinche verde (*Nezara viridula*)** con 0.8 individuos/metro lineal.\n` +
          `  - **Alerta temprana IA:** Condiciones de 26°C y alta humedad favorecen oviposición. Si alcanza 1.5 ind/m, emitiremos la orden de aplicación correspondiente.\n\n` +
          `• **El Carmen 07 (Caña):**\n` +
          `  - Labor L-1039 (control de malezas con Metalfor 7040) se encuentra **Pendiente** debido a vientos de 18 km/h. Esperar ventana nocturna (<10 km/h).\n\n` +
          `• **Las Tipas 02 (Citrus):**\n` +
          `  - Poda sanitaria L-1035 concluida con éxito. Próxima orden OA-226: pulverización preventiva con Cobre tribásico (1.5 kg/ha).`,
        recommendations: [
          'Monitorear chinches en La Esperanza 04 el 24/09',
          'Verificar ventana climática para pulverizadora Metalfor',
        ],
      };
    }

    if (q.includes('stock') || q.includes('bodega') || q.includes('insumo') || q.includes('urea') || q.includes('fertilizante')) {
      const urea = data.stock.find(s => s.producto.toLowerCase().includes('urea')) || data.stock[0] || {
        producto: 'Urea granulada',
        cantidad: 540,
        unidad: 'kg',
        minimo: 1000,
        deposito: 'Galpón central',
      };
      return {
        badge: 'Auditoría de Insumos',
        text: `📦 **Estado de Inventario y Alertas de Stock:**\n\n` +
          `⚠️ **ALERTA CRÍTICA: ${urea.producto}**\n` +
          `• Stock actual: **${urea.cantidad} ${urea.unidad}** en ${urea.deposito ?? 'Galpón central'}.\n` +
          `• Umbral de seguridad mínimo: **${urea.minimo} ${urea.unidad}**.\n` +
          `• Déficit operativo: Se requieren **15.120 kg** para la orden en proceso OA-231 (San Isidro 12).\n` +
          `• Proveedor habitual: Profertil (Costo de referencia: US$ 0.62/kg).\n\n` +
          `✅ **Insumos en nivel adecuado:**\n` +
          `• Semilla Soja DM 46R18: 2.200 kg (Mínimo: 800 kg).\n` +
          `• Glifosato 66%: 680 L (Mínimo: 300 L).\n\n` +
          `🛒 **Acción sugerida:** Emitir orden de compra por al menos **15 tn de urea** antes del 25 de septiembre para no interrumpir el plan de fertilización.`,
        recommendations: [
          'Solicitar cotización urgente a Profertil',
          'Reservar lote en depósito fitosanitario',
        ],
      };
    }

    if (q.includes('maquina') || q.includes('tractor') || q.includes('cosechadora') || q.includes('service')) {
      return {
        badge: 'Parque de Maquinarias',
        text: `🚜 **Disponibilidad y Mantenimiento de Flota:**\n\n` +
          `• **John Deere 6155J (Tractor · Patente AE 412 KT):**\n` +
          `  - Estado: **Operativa** (2.840 hs de uso acumuladas).\n` +
          `  - Consumo medio: 14 L/h. Próximo service de fluidos programado para el 12/10/2026.\n\n` +
          `• **Case IH 8250 (Cosechadora · Patente AD 908 LM):**\n` +
          `  - Estado: ⚠️ **En mantenimiento** en taller externo.\n` +
          `  - Causa: Reparación y cambio de cuchillas en cabezal maicero.\n` +
          `  - Fecha estimada de reincorporación: 25/09/2026.\n\n` +
          `• **Metalfor 7040 (Pulverizadora autopropulsada):**\n` +
          `  - Estado: **Operativa** (960 hs). Boquillas antideriva calibradas.`,
        recommendations: [
          'Confirmar entrega de Case IH 8250 el 25/09',
          'Comprar filtros de motor para tractor John Deere',
        ],
      };
    }

    // Respuesta agronómica general sintetizada
    return {
      badge: 'Análisis Integral AgroIA',
      text: `📊 **Diagnóstico Agronómico Global — Establecimiento (${session.nombre}):**\n\n` +
        `• **Superficie activa:** 1.240 ha gestionadas, con 5 lotes delimitados y cartografiados.\n` +
        `• **Estado del perfil hídrico:** 80% de los lotes en rango óptimo de humedad (24%–34% VWC en subsuelo). La excepción crítica es San Isidro 12, que requiere riego inmediato.\n` +
        `• **Telemetría de sensores:** Sensores subterráneos de humedad y temperatura transmitiendo 100% en línea vía red LoRaWAN.\n` +
        `• **Eficiencia de costos:** Presupuesto de campaña ejecutado al 68% ($66,4M sobre $97,8M presupuestados), manteniéndose dentro del sendero de costos proyectado.\n` +
        `• **Próxima ventana clave:** Ventana climática favorable prevista para los próximos 4 días con temperaturas medias de 24°C–27°C sin precipitaciones intensas.\n\n` +
        `¿Deseás profundizar sobre algún lote, labor u orden de aplicación en particular?`,
      recommendations: [
        'Ver mapa satelital de lotes',
        'Analizar telemetría de sensores subterráneos',
        'Generar informe PDF de campaña',
      ],
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simular tiempo de inferencia de IA
    setTimeout(() => {
      const response = generateResponse(query);
      const iaMsg: Message = {
        id: `ia-${Date.now()}`,
        sender: 'ia',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: response.badge,
        recommendations: response.recommendations,
      };
      setMessages(prev => [...prev, iaMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Respuesta copiada al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ia',
        text: `Conversación reiniciada. Estoy listo para tus nuevas consultas agronómicas sobre las **1.240 ha** y los sensores de tu establecimiento.`,
        timestamp: 'Ahora',
        badge: 'AgroLLM v4.2',
      },
    ]);
    toast.info('Chat reiniciado');
  };

  const staticRecs = [
    { title: 'Predicción de rinde', desc: 'San Isidro 12 (Maíz) proyecta 8,4 tn/ha (+3,7% sobre lo estimado) si se completa el riego y fertilización esta semana.', icon: Wheat, badge: 'Rinde' },
    { title: 'Alerta de riego subterráneo', desc: 'San Isidro 12 tiene 17.2% VWC y tensión de -78 kPa a 20 cm. Se recomienda regar 25 mm en las próximas 18 horas.', icon: Droplets, badge: 'Agua' },
    { title: 'Alerta temprana fitosanitaria', desc: 'Condiciones de calor (26°C) y humedad relativa favorecen presión de chinches en La Esperanza 04. Monitorear en 48 hs.', icon: Bug, badge: 'Plagas' },
    { title: 'Stock crítico de insumos', desc: 'La urea granulada está en 540 kg (por debajo del mínimo de 1.000 kg). Sugerimos comprar 15 tn antes del 25/09.', icon: Boxes, badge: 'Stock' },
  ];

  return (
    <div className="space-y-5">
      {/* ─── Top Copilot Header ─── */}
      <div className="panel relative overflow-hidden p-6 sm:p-7">
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles size={24} className="animate-pulse" />
              <span className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-background bg-emerald-500" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold tracking-tight">Sysagro AgroIA Copilot</h3>
                <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-accent-foreground">
                  Modelo Agro-Predictivo v4.2
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Asistente conversacional con IA conectado a telemetría de sensores de suelo, satélite y gestión de campo.
              </p>
            </div>
          </div>

          {/* View Toggles & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-muted/60 p-1">
              <button
                onClick={() => setActiveView('chat')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeView === 'chat' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                💬 Chat IA
              </button>
              <button
                onClick={() => setActiveView('cards')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeView === 'cards' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                ⚡ Alertas automáticas
              </button>
            </div>

            {activeView === 'chat' && (
              <Button variant="outline" size="sm" onClick={handleResetChat} className="h-8 gap-1.5 text-xs" title="Reiniciar chat">
                <RefreshCw size={12} />
                Reiniciar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Static Cards View ─── */}
      {activeView === 'cards' && (
        <div className="grid gap-4 md:grid-cols-2 animate-rise">
          {staticRecs.map((r, i) => (
            <div key={i} className="panel p-5 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-primary">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/10">
                    <r.icon size={18} />
                  </span>
                  <h3 className="font-bold">{r.title}</h3>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  {r.badge}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveView('chat');
                  handleSend(`Contame más en detalle sobre: ${r.title}`);
                }}
                className="mt-4 gap-1.5 text-xs font-semibold text-primary p-0 h-auto hover:bg-transparent hover:underline"
              >
                Consultar al Copilot <ArrowRight size={13} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ─── Chat View ─── */}
      {activeView === 'chat' && (
        <div className="panel flex h-[620px] flex-col overflow-hidden animate-rise">
          {/* Messages Stream */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ia' && (
                  <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Bot size={18} />
                  </span>
                )}

                <div
                  className={`group relative max-w-2xl rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'border bg-card text-card-foreground rounded-tl-sm'
                  }`}
                >
                  {/* Badge */}
                  {msg.badge && (
                    <div className="mb-2 flex items-center justify-between gap-2 border-b border-border/50 pb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-accent">
                        <Zap size={10} /> {msg.badge}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Message formatted content */}
                  <div className="whitespace-pre-line font-normal space-y-2">
                    {msg.text.split('\n\n').map((para, idx) => (
                      <p key={idx}>
                        {para.split('**').map((chunk, cidx) =>
                          cidx % 2 === 1 ? <strong key={cidx} className="font-bold">{chunk}</strong> : chunk
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Recommendations pills */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3.5 border-t border-border/50 pt-2.5">
                      <p className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                        <Lightbulb size={12} className="text-amber-500" /> Acciones recomendadas:
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {msg.recommendations.map((rec, ri) => (
                          <span
                            key={ri}
                            className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground"
                          >
                            ✓ {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons (copy / timestamp) */}
                  {msg.sender === 'ia' && (
                    <div className="mt-2.5 flex items-center justify-between border-t border-border/30 pt-2 text-[10px] text-muted-foreground">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-muted transition"
                        title="Copiar respuesta"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        <span>{copiedId === msg.id ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-primary font-bold text-xs">
                    <User size={16} />
                  </span>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Bot size={18} />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl border bg-card px-4 py-3 text-xs shadow-sm">
                  <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-2 rounded-full bg-primary animate-bounce" />
                  <span className="ml-2 font-medium">AgroIA consultando sensores y balance hídrico...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ─── Suggested Prompt Pills ─── */}
          <div className="border-t bg-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">Sugerencias:</span>
              {SUGGESTED_PROMPTS.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sp.prompt)}
                  disabled={isTyping}
                  className="shrink-0 rounded-full border bg-background px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-50"
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Input Form ─── */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t bg-card p-3 sm:p-4"
          >
            <input
              type="text"
              placeholder="Preguntale al Asistente IA sobre tus lotes, sensores subterráneos, labores o clima..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isTyping}
              className="h-11 flex-1 rounded-xl border bg-background px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="h-11 w-11 rounded-xl shrink-0 bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
