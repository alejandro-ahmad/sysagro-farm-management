# Sysagro — aplicación web agropecuaria

## Objetivo
Construir una experiencia completa y responsiva que combine una landing comercial con una demo ERP interactiva, usando datos agrícolas realistas guardados localmente.

## Experiencia a construir
- Navegación superior entre Inicio, Demo del sistema y Contacto.
- Landing con presentación, propuesta de valor, misión y visión, objetivos, organigrama interactivo, planes y cierre comercial.
- Dashboard con menú lateral y módulos de campo, aplicaciones, maquinaria, bodega, costos, cosechas y riego.
- Tablas con búsqueda y filtros, indicadores, alertas y gráficos.
- Formularios para crear labores, órdenes, maquinaria, existencias, cosechas y registros de riego; edición y eliminación donde corresponda.
- Formulario de contacto validado con confirmación visual.

## Persistencia y datos
- Precargar lotes de soja, maíz, citrus y caña de azúcar del Norte Argentino.
- Guardar cambios y consultas en `localStorage`, sin depender de servicios externos.
- Separar datos, tipos y utilidades de persistencia para facilitar una futura conexión a Lovable Cloud.

## Dirección visual
- Verde bosque y esmeralda como identidad principal, verde brote para acciones, arena cálida en fondos y carbón en textos.
- Tipografía legible de carácter técnico, superficies limpias, estados claros y microinteracciones suaves.
- Adaptación completa a escritorio y móvil, incluyendo menú y tablas.

## Detalles técnicos
- React 19, TanStack Start, Tailwind CSS 4, Lucide y Recharts.
- Tokens semánticos centralizados en el sistema visual.
- Rutas independientes con metadatos propios para Inicio, Demo y Contacto.
- Validación final en navegador para comprobar navegación, formularios, persistencia y tamaños de pantalla.
