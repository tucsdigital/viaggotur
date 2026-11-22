# Buscador Dinámico (Inicio) y Filtros + URL (/paquetes) — Guía para replicar

Este documento explica cómo replicar en otro proyecto (React/Next u otro stack similar) dos piezas clave:

- Un buscador dinámico en el Hero de inicio con sugerencias (autocomplete), filtros secundarios y navegación a un listado.
- Un listado `/paquetes` con filtros dinámicos sincronizados con la URL (deep-linking) sin loops ni “rebotes”.

La guía está pensada para equipos que quieran copiar el patrón completo (UX + estado + contrato de URL + algoritmo anti-bug). Al final hay referencias al código actual.

## 0) Qué vas a construir (visión general)

**Flujo del usuario**

1) Inicio: el usuario escribe “Bariloche”.
2) Aparecen sugerencias: “Destino: Bariloche” y/o “Experiencia: Bariloche Full”.
3) El usuario puede elegir una sugerencia (destino o paquete), y opcionalmente un mes y transporte.
4) Al apretar “Buscar”, navega a `/paquetes?...` con parámetros.
5) En `/paquetes`, el panel de filtros:
   - filtra localmente (rápido)
   - mantiene la URL siempre coherente con el estado
   - permite compartir links con filtros pre-aplicados

**Objetivo técnico**

- La URL es el “contrato” de navegación entre páginas.
- El estado UI en `/paquetes` se hidrata desde la URL y luego se mantiene sincronizado.
- El sistema evita el bug clásico: `URL → state → URL` en loop.

## 1) Requisitos mínimos (stack agnóstico)

Esto es lo mínimo para replicar el patrón (independiente de Firestore):

- Una lista de items (paquetes) ya disponible en `/paquetes` (server-render, fetch client, caché, etc.).
- Un modelo de datos consistente (ver sección 2).
- Enrutamiento con:
  - lectura de query string
  - navegación programática (`push/replace`)
  - detección de cambios de URL (idealmente reactivo)

## 2) Modelo de datos recomendado (mínimo viable)

Para que el buscador + filtros funcionen, cada “paquete” debería tener:

- `id: string`
- `titulo: string`
- `slug: string`
- `destino: string`
- `tipo: 'individual' | 'grupal' | 'a-medida'`
- `categoriaId: string`
- `categoriaIds?: string[]` (opcional, para multi-ubicación)
- `transporte?: 'bus' | 'avion' | 'ambos' | 'barco' | 'circuitos' | 'circuito'` (si existe retrocompatibilidad)
- `salidas: Array<{ fecha: 'YYYY-MM-DD' }>`
- `visible: boolean`
- `visibleDesde?: 'YYYY-MM-DD'` (opcional)
- `visibleHasta?: 'YYYY-MM-DD'` (opcional)

Y cada “categoría/ubicación”:

- `id: string`
- `nombre: string`
- `region?: 'nacional' | 'internacional'`

Referencia del modelo actual: [types](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/types/index.ts)

## 3) Contrato de URL (lo más importante)

El **contrato de URL** es lo que hace que el sistema sea replicable y robusto.

### 3.1 Parámetros soportados

Todos los parámetros son opcionales. Cuando un parámetro no está, se asume “sin filtro”.

- `q`: búsqueda por texto (string)
- `mes`: mes de salida (`YYYY-MM`)
- `transporte`: `avion | bus | barco | circuitos` (no se escribe `ambos`, porque representa “Todo”)
- `region`: `nacional | internacional`
- `slug`: slug de paquete (para deep-link a un paquete específico dentro del listado)
- `cat`: categorías/ubicaciones por id (multi)
- `tipo`: tipos (multi)
- `titulo`: títulos de paquete (multi)
- `destino`: destinos (multi)

### 3.2 Parámetros “multi” (dos formatos válidos)

Para `cat`, `tipo`, `titulo`, `destino` se soportan dos formatos de entrada:

- Repetidos:
  - `...?cat=a&cat=b`
- CSV:
  - `...?cat=a,b`

**Regla de oro:** internamente, siempre convertí a `string[]` con:

- `trim`
- eliminación de vacíos
- eliminación de duplicados
- orden determinístico (sort)

Esto evita el bug donde el mismo conjunto se representa con URLs diferentes.

### 3.3 Salida canónica recomendada (cómo “escribir” la URL)

Para que el link sea estable y comparable (y por lo tanto no entre en loops), se recomienda:

- Para parámetros “single”: usar `set(key, value)`.
- Para parámetros “multi”: escribirlos como repetidos y en orden estable:
  - `append(key, value)` para cada item ya normalizado (unique + sort).

Ejemplo (canónico):

- `/paquetes?cat=A&cat=B&tipo=grupal&mes=2026-10`

Evitar (salida no-canónica):

- Mezclar CSV y repetidos a la vez.
- Cambiar orden (por ejemplo según el orden de clicks del usuario).

Helper sugerido (agnóstico, copiable):

```ts
export function normalizeMulti(values: string[]): string[] {
  return Array.from(new Set(values.map(v => v.trim()).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, 'es'));
}

export function readMulti(searchParams: URLSearchParams, key: string): string[] {
  return normalizeMulti(
    searchParams.getAll(key).flatMap(v => v.split(','))
  );
}
```

## 4) Componente A: Buscador dinámico del Inicio (Hero Search)

### 4.1 UX y estructura (para replicar diseño)

Patrón visual recomendado:

- “Search card” sobre el Hero:
  - contenedor centrado
  - fondo blanco con bordes suaves
  - sombra marcada
  - responsive: columna en mobile, fila en desktop

Elementos:

- Input principal con:
  - ícono de contexto (ej. pin de mapa)
  - botón “limpiar”
  - lista desplegable de sugerencias
- Select “Mes”:
  - se construye desde `salidas[].fecha`
- Select “Transporte”
- Botón “Buscar”

Referencia actual: [HeroSearch.tsx](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/components/HeroSearch.tsx)

### 4.2 Estado mínimo del buscador

- `q` y `debouncedQ` (para sugerencias)
- `showSuggestions` y `activeIndex` (para lista y teclado)
- `selectedDestino` o `selectedPaqueteSlug` (mutuamente excluyentes)
- `mes` y `transporte`

### 4.3 Sugerencias (algoritmo simple y efectivo)

Recomendación (idéntica al patrón actual):

- Sugerencias de “destino”: set de destinos únicos (`paquete.destino`)
- Sugerencias de “paquete”: coincidencias por `titulo` o `destino`
- Limitar resultados (ej. 6 + 6)

Puntos clave para replicación:

- El input sigue siendo texto libre: no “bloquea” al usuario si no elige sugerencia.
- Al escribir, se debe invalidar una selección previa (para no quedar con un `slug` viejo).

### 4.4 Accesibilidad (mínimo recomendado)

Tratar el input como `combobox`:

- `role="combobox"`
- `aria-autocomplete="list"`
- `aria-expanded`
- `aria-controls`
- `aria-activedescendant`

Teclado:

- ArrowUp/ArrowDown mueven el item activo
- Enter selecciona
- Escape cierra

### 4.5 Construcción de URL al buscar

Al apretar “Buscar”, construir `URLSearchParams` y navegar:

- `mes` si existe
- `transporte` si distinto de “todo”
- `destino` si se eligió una sugerencia de destino
- `slug` si se eligió una sugerencia de paquete

Regla importante:

- `destino` y `slug` no deberían viajar juntos (son excluyentes).

Implementación actual: [HeroSearch.tsx](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/components/HeroSearch.tsx#L98-L117)

### 4.6 Cómo conecta con /paquetes (contrato entre componentes)

El buscador del inicio no filtra directamente: solo construye URL. En `/paquetes`, el sistema interpreta esa URL así:

- Si viene `slug`, el listado aplica “modo deep-link” y solo deja pasar el paquete con ese slug.
- Si viene `destino`, filtra por igualdad exacta en `paquete.destino`.
- Si viene `mes` y/o `transporte`, se combinan normalmente.

Regla recomendada:

- Si `slug` existe, ignorar `destino` aunque también venga (en el sistema actual, el buscador ya los trata como excluyentes).

## 5) Componente B: /paquetes (Filtros + URL + Listado)

La parte “replicable” es el patrón de sincronización URL ↔ estado.

### 5.1 Arquitectura sugerida

- `/paquetes` obtiene `paquetes` y `categorias` (server o client).
- El filtrado se hace en memoria para respuesta inmediata (con posibilidad de escalar a backend si crece).
- El componente de UI:
  - deriva opciones dinámicas desde `paquetes`
  - mantiene estado de filtros
  - sincroniza estado con URL (deep-linking)

Referencia actual:

- Server: [app/paquetes/page.tsx](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/app/paquetes/page.tsx)
- Client: [PaquetesClient.tsx](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/components/PaquetesClient.tsx)

### 5.2 Ventana de visibilidad (publicación/vencimiento)

Si replicás el sistema de visibilidad:

- `visibleDesde` se interpreta como inicio del día: `YYYY-MM-DDT00:00:00`
- `visibleHasta` se interpreta como fin del día: `YYYY-MM-DDT23:59:59`
- Si un valor no existe, no limita.

### 5.3 Opciones dinámicas (derivación)

Patrón:

- Opciones = `Set` + `sort`
- Meses = derivar desde `salidas[].fecha` → `YYYY-MM`

Transporte:

- Si hay un enum explícito, usarlo.
- Si hay datos viejos (`circuito`), normalizar al valor nuevo (`circuitos`).
- Si falta, usar heurística por texto (opcional).

### 5.4 Motor de filtrado (orden recomendado)

Orden típico (de filtros “más restrictivos” a “más generales”):

1) `slug` (deep-link)
2) `region` (en base a categorías)
3) `q` (texto)
4) `cat` (ubicación)
5) `tipo`
6) `destino`
7) `titulo`
8) `mes`
9) `transporte`

Referencia actual: [PaquetesClient.tsx](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/components/PaquetesClient.tsx#L245-L324)

## 6) Sincronización URL ↔ Estado (algoritmo anti-loop)

Esta es la parte que más conviene copiar tal cual.

### 6.1 Problema típico (bug clásico)

Si implementás dos efectos:

- A) “cuando cambia la URL, seteo el estado”
- B) “cuando cambia el estado, reescribo la URL”

…es muy fácil caer en un loop por:

- estado stale (la URL cambió pero el estado todavía no refleja el cambio)
- orden diferente en parámetros multi (ej. `cat=b&cat=a` vs `cat=a&cat=b`)

### 6.2 Solución (3 reglas)

**Regla 1: Canonicalización**

Para cualquier array multi:

- `unique + sort` antes de:
  - setear estado desde URL
  - escribir a URL desde estado

**Regla 2: Aplicar URL → Estado solo si hay cambios reales**

Comparar antes de hacer `setState` (por ejemplo con arrays ya ordenados).

**Regla 3: Guard de 1 ciclo para cortar el loop**

Si en el paso “URL → estado” realmente aplicaste algo, setear un flag:

- `isApplyingUrlToState = true`

Luego, en el efecto de “estado → URL”:

- si el flag está activo, lo apagás y salís sin reescribir.

Eso permite que el estado “alcance” a la URL sin reinyectar una URL vieja.

### 6.3 Nota importante para React/Next (por qué pasan los loops)

En React, un `setState` no aplica instantáneamente. Si tu efecto de “estado → URL” corre en el mismo frame en el que todavía no terminó de aplicarse “URL → estado”, podés terminar escribiendo una URL basada en estado viejo.

Por eso, el guard de 1 ciclo es importante: es una forma simple de “dejar respirar” al render y evitar que una URL recién entrada sea reescrita por el estado anterior.

### 6.4 Pseudocódigo replicable

Lectura:

```txt
onUrlChange():
  parsed = parseQuery(url)
  parsed.multi = normalizeMulti(parsed.multi) // unique + sort

  didApply = false
  if state.q != parsed.q: setState.q(parsed.q); didApply = true
  if state.multi != parsed.multi: setState.multi(parsed.multi); didApply = true
  ...

  if didApply: guardUrlToState = true
  initialized = true
```

Escritura:

```txt
onStateChange():
  if !initialized: return
  if guardUrlToState:
    guardUrlToState = false
    return

  query = newQuery()
  query.multi = normalizeMulti(state.multi) // unique + sort
  writeQuery(query)

  if nextUrl != currentUrl:
    replace(nextUrl)
```

Referencia actual (implementación real): [PaquetesClient.tsx](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/components/PaquetesClient.tsx#L123-L243)

### 6.5 Debounce en `q` (recomendado)

Para no spamear navegación mientras se escribe:

- Filtrado local: usa `searchTerm` (sin debounce).
- Escritura a URL: usa `debouncedSearchTerm`.

### 6.6 Ejemplo de mapeo “query ↔ state” (TypeScript copiable)

Un ejemplo de estructura de estado y parseo/escritura:

```ts
type Region = 'nacional' | 'internacional';
type Transporte = 'todos' | 'avion' | 'bus' | 'barco' | 'circuitos';

export type PaquetesFiltersState = {
  q: string;
  mes: string; // YYYY-MM o ''
  transporte: Transporte;
  region: Region | null;
  slug: string | null;
  cat: string[];
  tipo: string[];
  titulo: string[];
  destino: string[];
};

export function parseFiltersFromUrl(searchParams: URLSearchParams): PaquetesFiltersState {
  const q = searchParams.get('q') || '';
  const mes = searchParams.get('mes') || '';
  const slug = searchParams.get('slug') || null;
  const regionRaw = searchParams.get('region');
  const region = regionRaw === 'nacional' || regionRaw === 'internacional' ? regionRaw : null;

  const transporteRaw = searchParams.get('transporte') || 'todos';
  const transporte: Transporte =
    transporteRaw === 'avion' || transporteRaw === 'bus' || transporteRaw === 'barco' || transporteRaw === 'circuitos'
      ? transporteRaw
      : 'todos';

  return {
    q,
    mes,
    transporte,
    region,
    slug,
    cat: readMulti(searchParams, 'cat'),
    tipo: readMulti(searchParams, 'tipo'),
    titulo: readMulti(searchParams, 'titulo'),
    destino: readMulti(searchParams, 'destino'),
  };
}

export function buildUrlFromFilters(pathname: string, state: PaquetesFiltersState): string {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set('q', state.q.trim());
  if (state.mes) params.set('mes', state.mes);
  if (state.transporte !== 'todos') params.set('transporte', state.transporte);
  if (state.region) params.set('region', state.region);
  if (state.slug) params.set('slug', state.slug);
  normalizeMulti(state.cat).forEach((v) => params.append('cat', v));
  normalizeMulti(state.tipo).forEach((v) => params.append('tipo', v));
  normalizeMulti(state.titulo).forEach((v) => params.append('titulo', v));
  normalizeMulti(state.destino).forEach((v) => params.append('destino', v));
  return params.toString() ? `${pathname}?${params.toString()}` : pathname;
}
```

### 6.7 Checklist anti-bugs (si lo replicás en otro proyecto)

- Asegurar que el efecto “URL → estado” dependa solo de la fuente de verdad de la URL (ej. `searchParams`), no de estados internos.
- Comparar antes de setear:
  - strings: `prev !== next`
  - arrays: comparar longitud + elementos (ya normalizados)
- Escribir URL solo si realmente cambió (comparar string actual vs string próximo).
- Normalizar multi filtros tanto al leer como al escribir.

## 7) Checklist para portar a otro proyecto

### 7.1 Para el buscador del inicio

- Crear componente de “search card” sobre hero.
- Implementar:
  - estado (`q`, `debouncedQ`, `suggestions`, `selectedDestino`/`selectedSlug`, `mes`, `transporte`)
  - sugerencias (destinos + paquetes)
  - navegación por teclado
  - click afuera
  - construcción de URL hacia `/paquetes`

### 7.2 Para /paquetes

- Asegurar fetch de `paquetes` y `categorias`.
- Derivar opciones dinámicas desde `paquetes`.
- Implementar filtros + UI.
- Implementar sincronización URL ↔ estado con:
  - canonicalización
  - comparación antes de setState
  - guard de 1 ciclo
  - debounce de `q`

## 8) Casos de prueba (manuales) que deben pasar

Abrir links:

- Multi categorías:
  - `/paquetes?cat=A&cat=B`
- Multi en CSV:
  - `/paquetes?cat=A,B`
- Orden distinto:
  - `/paquetes?cat=B&cat=A`

Expectativas:

- El UI se hidrata bien.
- La URL se estabiliza a una forma canónica y deja de reescribirse en loop.
- Tildar/destildar filtros actualiza listado y URL sin “flicker”.
- Escribir en búsqueda filtra al instante y la URL se actualiza con debounce.

## 9) Preguntas frecuentes (FAQ)

### 9.1 ¿Por qué usar `replace` y no `push` para sincronizar la URL?

Porque el cambio de filtros es un “ajuste de estado”, no una navegación que el usuario espere recorrer con el botón “Atrás” paso por paso.

Si se quiere comportamiento “histórico” (cada cambio queda en history), se puede usar `push`, pero se recomienda hacerlo solo en acciones explícitas (ej. botón “Aplicar filtros”).

### 9.2 ¿Por qué soportar CSV si ya soportamos repetidos?

Porque hay herramientas/sistemas externos que generan URLs con CSV. Soportarlo en la lectura hace el sistema más tolerante.
Para mantener estabilidad, al escribir se recomienda un solo formato (repetidos ordenados).

## 10) Referencias al código actual (Do Mundo)

- Buscador de inicio: [HeroSearch.tsx](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/components/HeroSearch.tsx)
- /paquetes filtros + URL: [PaquetesClient.tsx](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/components/PaquetesClient.tsx)
- /paquetes server fetch + visibilidad: [app/paquetes/page.tsx](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/app/paquetes/page.tsx)
- API fallback: [app/api/search/route.ts](file:///c:/Users/Lauti/Documents/GitHub/do_mundo/app/api/search/route.ts)
