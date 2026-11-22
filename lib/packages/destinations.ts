import type { Categoria, Paquete } from '@/types';

type PackageCategoryRelations = Pick<Paquete, 'categoriaId' | 'categoriaIds'>;

/** Returns both the canonical multi-category field and its legacy primary field. */
export function getPaqueteCategoriaIds(paquete: PackageCategoryRelations): string[] {
  const ids = [
    ...(Array.isArray(paquete.categoriaIds) ? paquete.categoriaIds : []),
    paquete.categoriaId,
  ];

  return Array.from(new Set(ids.map((id) => String(id ?? '').trim()).filter(Boolean)));
}

export function normalizeDestinationToken(value: string): string {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Resolves package destinations from category links. The stored `destino` field
 * remains a fallback for legacy records; event locations are always retained.
 */
export function getPaqueteDestinos(
  paquete: Pick<Paquete, 'categoriaId' | 'categoriaIds' | 'destino' | 'eventoLugar'>,
  categorias: readonly Categoria[]
): string[] {
  const categoriasPorId = new Map(categorias.map((categoria) => [categoria.id, categoria]));
  const destinosDeCategorias = getPaqueteCategoriaIds(paquete)
    .map((categoriaId) => categoriasPorId.get(categoriaId)?.nombre?.trim() ?? '')
    .filter(Boolean);

  const destinos = destinosDeCategorias.length > 0
    ? destinosDeCategorias
    : [paquete.destino?.trim() ?? ''];

  if (paquete.eventoLugar?.trim()) {
    destinos.push(paquete.eventoLugar.trim());
  }

  const seen = new Set<string>();
  return destinos.filter((destino) => {
    const token = normalizeDestinationToken(destino);
    if (!token || seen.has(token)) return false;
    seen.add(token);
    return true;
  });
}
