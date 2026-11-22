# Panel Admin — Guía de UI/UX (Diseño Detallado)

Este documento describe, con foco en detalle, los patrones de diseño, estilos, micro‑interacciones y convenciones visuales del panel de administración de Hola Empresa. Está pensado para replicar el look & feel en otro proyecto que ya tenga la lógica implementada.

## Principios
- Consistencia: mismos tokens de color, radios y sombras en todo el panel.
- Claridad jerárquica: títulos fuertes, contenedores blancos, fondos grises.
- Feedback inmediato: hover claro, focus visible, loaders y vacíos definidos.
- Animaciones sutiles: micro‑interacciones que no interrumpen la tarea.

## Tokens y Escalas
- Colores de marca
  - Primario: Azul `#0066CC` (acciones principales, íconos de cabecera).
  - Énfasis: Amarillo `#FFCC4D` (resaltado activo en sidebar).
  - Estados: Verde `#22c55e`, Rojo `#ef4444`, Naranja `#f59e0b`, Grises neutros.
- Espaciado
  - Contenido: `p-4 sm:p-6 lg:p-8`.
  - Tarjetas internas: `p-4`/`p-6`; separaciones `space-y-4`/`space-y-6`.
- Redondeos
  - Tarjetas/paneles: `rounded-xl` o `rounded-2xl`.
  - Inputs/botones: `rounded-lg`.
  - Badges/chips: `rounded-full` o `rounded-lg` según densidad.
- Sombras
  - Tarjetas: `shadow-sm` (por defecto) / `shadow-lg` (sección principal).
  - Dropdowns/modales: `shadow-2xl`.
  - Hover “elevación”: sumar `shadow-lg` al activo cuando aplique.
- Tipografía y tamaño
  - Títulos: `text-2xl`/`text-3xl` + `font-bold`.
  - Texto UI: `text-sm` por defecto; `text-xs` para secundarios/ayuda.

## Layout y Navegación
- Estructura
  - Sidebar fijo en desktop (`lg:w-64`, fondo gris oscuro).
  - Navbar sticky (`position: sticky`, `top: 0`, `z-40`).
  - Área de trabajo con `lg:ml-64` y fondo `bg-gray-50`.
  - Contenedor central: `max-w-7xl mx-auto`.
- Sidebar (fluidez)
  - Item activo: fondo amarillo brand + texto blanco.
  - Indicador lateral animado (rail) con Framer Motion `layoutId`, transición `spring`.
  - Responsive: en mobile aparece deslizando desde la izquierda con backdrop `bg-black/50`.
- Navbar
  - Marca y título del módulo a la izquierda.
  - Menú de usuario a la derecha con dropdown animado (opacidad + desplazamiento vertical).

## Contenedores (Tarjetas)
- Base: `bg-white rounded-2xl shadow-lg p-6 border border-gray-100`.
- Organización interna
  - Encabezado con icono de sección (Lucide, `h-6–h-8`) + título.
  - Cuerpo con grillas responsivas `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
  - Separadores sutiles: `border-gray-100`, `divide-y divide-gray-200`.

## Tablas y Listas de Datos
- Estructura de tabla (órdenes/usuarios/dominios)
  - Contenedor: `overflow-x-auto` dentro de tarjeta.
  - Header: `bg-gray-50 border-b border-gray-200`, th `px-6 py-4` + `text-xs font-semibold uppercase tracking-wider text-gray-600`.
  - Filas: `divide-y divide-gray-200`.
  - Hover fila: `hover:bg-gray-50 transition-colors`.
  - Celdas: `px-6 py-4`; valores numéricos en negrita (`font-bold`) cuando corresponde.
- Animación de filas
  - Aparición con Framer Motion: `initial={{opacity:0,y:20}}` → `animate={{opacity:1,y:0}}`.
  - Retraso incremental por índice: `delay = index * 0.05`.
- Badges de estado (órdenes)
  - Pagado: `bg-green-100 text-green-700`.
  - Pendiente: `bg-yellow-100 text-yellow-700`.
  - Pausada: `bg-orange-100 text-orange-700`.
  - Fallido/Cancelado: `bg-red-100 text-red-700` / `bg-gray-100 text-gray-700`.
  - Forma: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium`.
  - Iconos dentro del badge: Lucide `h-3 w-3`.

## Filtros, Búsqueda y Ordenación
- Búsqueda
  - Input con icono leading (`Search` posicionado absoluto). Clases: `pl-10 pr-4 py-3 border border-gray-300 rounded-lg`.
  - Focus: `focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none`.
  - Debounce: 500 ms para performance (hook de utilidad).
- Filtros por estado
  - Botones tipo chip: `px-4 py-2 rounded-lg text-sm font-medium transition-all`.
  - Activo: `bg-[#0066CC] text-white shadow-lg`; Inactivo: `bg-gray-100 text-gray-700 hover:bg-gray-200`.
  - Listado horizontal desplazable en mobile (`overflow-x-auto`).
- Ordenación
  - Select nativo estilizado: `px-4 py-2 border border-gray-300 rounded-lg text-sm`.
  - Controles de orden (asc/desc) con botón `hover:bg-gray-50`.

## Botones y Acciones
- Variantes
  - Primario: `bg-[#0066CC] text-white rounded-lg hover:bg-[#ff8800] transition-colors`.
  - Secundario: bordes grises `border border-gray-300 text-gray-700 hover:bg-gray-50`.
  - Ghost: `hover:bg-gray-100` para acciones de bajo énfasis.
  - Peligro: `bg-red-600 text-white hover:bg-red-700` en acciones destructivas.
- Tamaños
  - Estándar: `h-10 px-4 text-sm font-medium`.
  - Icono: `h-10 w-10` (solo ícono).
- Contenido
  - Íconos Lucide alineados con texto, separación `gap-2`/`mr-2`.
  - Acciones de fila: botón “Ver” a la derecha en tablas, consistente en todas las páginas.

## Interacciones y Estados
- Loading
  - Indicadores centrados con `Loader2` animado (`animate-spin text-[#0066CC]`).
  - Evitar parpadeos: cubrir contenedor con `py-12` para estabilidad visual.
- Vacíos
  - Ilustración icónica tenue (ícono grande gris) + copy explicativo (`text-gray-500`).
  - Diferenciar “sin resultados por filtros” vs. “sin datos”.
- Errores/Éxitos
  - Toasters con `sonner` para feedback inmediato en acciones CRUD.

## Modales y Menús
- Menú usuario (Navbar)
  - Dropdown `absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100`.
  - Animación: `initial {opacity:0, y:-10}` → `animate {opacity:1, y:0}`.
- Modales (Banners)
  - Backdrop: `bg-black/50`, cierre por click en fondo.
  - Tarjeta centrada con `rounded-2xl shadow-2xl p-6`.

## Animaciones (Framer Motion)
- Principios
  - Duraciones cortas (0.2–0.3s) y desplazamientos pequeños (10–20px).
  - Interpolaciones `spring` en navegación lateral; `easeOut` para apariciones.
- Casos usados
  - Sidebar: rail activo con `layoutId` y `spring { stiffness: 300, damping: 30 }`.
  - Filas de tablas: “stagger” por índice (`delay = index * 0.05`).
  - Dropdowns: opacidad + `y`.

## Accesibilidad y Usabilidad
- Focus visibles en inputs y botones (`ring-2`, `ring-offset-2` cuando corresponda).
- Tamaño táctil mínimo: botones `h-10` y padding suficiente en chips/filtros.
- Contraste asegurado en badges y CTAs.
- Etiquetas claras y descripciones en acciones sensibles.

## Responsive
- Sidebar colapsable en mobile con backdrop; navegación por botón hamburguesa.
- Grillas adaptativas en tarjetas de detalle (1/2/3 columnas).
- Tablas con scroll horizontal (`overflow-x-auto`) preservando legibilidad.

---

Con estas pautas podrás replicar el diseño con precisión: layout lateral fijo y navbar sticky, tarjetas blancas con sombras suaves, tablas limpias con badges de estado, filtros claros con chips, y animaciones sutiles que aportan fluidez sin distraer.

