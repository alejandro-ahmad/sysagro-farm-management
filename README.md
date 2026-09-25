# Sysagro: Smart Farm Management

Actúa como un desarrollador Frontend/Full-Stack Senior y Diseñador UI/UX. Construye una aplicación web completa, responsiva, moderna y 100% interactiva llamada "Sysagro" (SaaS de Gestión Agropecuaria). 

IMPORTANTE PARA LA EJECUCIÓN LOCAL:
- El proyecto debe funcionar de inmediato al clonar y ejecutar `npm install && npm run dev`.
- Debe implementar persistencia de datos funcional mediante `localStorage` (con datos iniciales precargados/seed data realistas de prueba) para que todas las acciones de agregar, editar, filtrar y eliminar funcionen sin depender obligatoriamente de una base de datos externa en localhost, pero dejando la arquitectura limpia y lista para conectar a Supabase.
- Utiliza React, Tailwind CSS, Lucide React icons y Shadcn UI.

---

1. IDENTIDAD DE MARCA Y PALETA VISUAL
- Nombre: Sysagro
- Rubro: Gestión de equipo y cultivos agrícolas.
- Estilo: Moderno, profesional, limpio, tecnológico y agropecuario.
- Paleta de colores:
  - Primario: Verde esmeralda/bosque profundo (`#1b4332`, `#2d6a4f`, `#40916c`).
  - Acentos: Verde brote (`#52b788`), tonos tierra suaves / arena cálido (`#f4f1ea`, `#eae2d6`), y slate/carbón para tipografías (`#1e293b`).
  - Fondo general: Limpio con tonos off-white suaves y tarjetas blancas con sombras sutiles.

---

2. ESTRUCTURA DE LA APLICACIÓN
La web debe contar con un Navbar superior interactivo que permita navegar fluidamente entre:
1. Página Principal / Landing Comercial
2. Dashboard Interactivo del Sistema (Demo SaaS en vivo)
3. Sección de Contacto / Registro

---

3. CONTENIDO Y SECCIONES DE LA LANDING (según documento Sysagro WEB)

1. Hero Section:
   - Título impactante enfocado en transformación digital agropecuaria y toma de decisiones basadas en datos.
   - Badge destacado: "Prueba gratis de 14 días para el Plan Básico".
   - Botones CTA: "Probar Demo del Software" (lleva a la vista del Dashboard) y "Ver Planes".

2. Propuesta de Valor & Solución SaaS:
   - Descripción: Sistema de gestión agropecuaria bajo modelo de suscripción (SaaS Agropecuario).
   - Destacar los 3 pilares clave con tarjetas e iconografía atractiva:
     1. Garantizar la trazabilidad de la producción: Registro histórico de lotes, labores y aplicaciones.
     2. Optimizar la gestión de recursos: Control de maquinarias, insumos, bodega y tiempos de trabajo.
     3. Reportes estratégicos con Dashboards interactivos: Cruce de variables agronómicas con datos de producción para maximizar el rinde de los cultivos.

3. Misión, Visión y Objetivos (Sección Institucional):
   - Misión: "Desarrollar soluciones de software especializadas para el sector agropecuario y agroindustrial, transformando datos de campo en información estratégica para optimizar rendimientos, garantizar la trazabilidad y promover un uso eficiente de los recursos."
   - Visión: "Consolidarnos como el socio tecnológico de referencia para el agro del Norte Argentino, liderando la integración entre ingeniería de sistemas y ciencias agrarias para potenciar la competitividad de los productores en el mercado global."
   - Objetivos estratégicos:
     - Captación de primeros clientes en el sector agropecuario.
     - Lanzamiento del producto principal.
     - Sostenibilidad económica y previsibilidad financiera.
     - Expansión y optimización de servicios.

4. Organigrama de la Empresa:
   - Representación visual e interactiva del organigrama corporativo (Dirección General, Operaciones/Agronomía, Desarrollo de Software & QA, Comercial & Soporte).

5. Planes y Precios (Pricing Cards):
   - Plan Básico ($90 / mes):
     - Prueba gratis de 14 días sin tarjeta.
     - Incluye: Cuaderno de campo digital, Control de cosechas, Gestión de bodega/stock básica, Registro de maquinarias, Reportes básicos de rinde.
     - Botón "Iniciar Prueba Gratuita de 14 días".
   - Plan Premium ($170 / mes - Destacado/Recomendado):
     - Incluye TODO lo del Plan Básico más el suite completo de funcionalidades avanzadas:
       - Costos y presupuestos
       - Control de faenas
       - Control de cosechas avanzado
       - Gestión de compras y proveedores
       - Gestión de bodega y multialmacén
       - Órdenes de aplicación (fitosanitarios y fertilizantes)
       - Gestión integral de maquinarias y mantenimiento
       - Gestión de riego y sensores
       - Cuaderno de campo digital homologado
       - Módulo de Ganadería
       - Tesorería y flujos de caja
       - Dashboards avanzados y analítica predictiva
     - Botón "Adquirir Plan Premium".

6. Contacto & Footer:
   - Email de contacto oficial: `sysagro@gmail.com`
   - Formulario de contacto funcional (con validación y toast notification de éxito que guarde las consultas en localStorage).
   - Enlaces a redes, términos y copyright.

---

4. VISTA DEL SISTEMA / DEMO SAAS INTERACTIVO (DASHBOARD)
Agrega una vista completa a la que se pueda acceder con un botón "Acceder al Sistema / Demo" con un layout estilo ERP/SaaS:
- Sidebar de navegación lateral con los módulos detallados en el documento:
  1. Dashboard Principal (Métricas: Has sembradas, Rinde estimado tn/ha, Alertas de riego, Presupuesto ejecutado).
  2. Cuaderno de Campo (Tabla interactiva con registro de lotes, fecha, labor realizada, responsable y estado. Debe permitir agregar nueva labor mediante un modal).
  3. Órdenes de Aplicación (Listado con estados: Pendiente, En proceso, Aplicado, con insumo y dosis).
  4. Gestión de Maquinarias (Estado de tractores/cosechadoras, horas de uso y fecha de próximo service).
  5. Gestión de Bodega (Control de stock de semillas, fertilizantes y agroquímicos con alertas de stock mínimo).
  6. Costos y Tesorería (Gráficos interactivos con Recharts de gastos vs presupuestos mensuales).
  7. Control de Cosechas & Riego.
- Todos los datos deben venir precargados con datos de ejemplo creíbles (ej. lotes de soja, maíz, citrus, caña de azúcar característicos de la región) y ser interactivos (filtros por lote/cultivo, búsqueda y formularios modales para crear nuevos registros con persistencia en localStorage).

Haz el diseño visualmente impecable, con tipografías legibles, microinteracciones suaves, badges de estado y componentes listos para presentar en una exposición técnica.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/84248753-1148-4445-87a1-c456135ad483).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
