import { collection, getDocs, query, orderBy as firestoreOrderBy, where, limit } from 'firebase/firestore';
import { db, firebaseEnabled } from '@/lib/firebase';
import { serializeFirestoreData } from '@/lib/utils/serialize';
import { BlogPost, Categoria, Paquete } from '@/types';
import { getExperiencias } from '@/lib/experiencias';

/** Límites para la home: evita traer más documentos de los necesarios y reduce memoria */
const HOME_PAQUETES_LIMIT = 12;
const HOME_EXPERIENCIAS_LIMIT = 12;
const HOME_CATEGORIAS_LIMIT = 6;

async function fetchVisibleOrdered<T>(collectionName: string, maxItems: number) {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, collectionName),
        where('visible', '==', true),
        firestoreOrderBy('orden', 'asc'),
        limit(maxItems)
      )
    );

    return snapshot.docs.map((doc) => serializeFirestoreData<T>({ id: doc.id, ...doc.data() }));
  } catch {
    // Fallback sin índice compuesto: filtramos y ordenamos en memoria
    const snapshot = await getDocs(query(collection(db, collectionName), where('visible', '==', true)));
    return snapshot.docs
      .map((doc) => serializeFirestoreData<T>({ id: doc.id, ...doc.data() }))
      .sort((a, b) => ((a as { orden?: number }).orden ?? 0) - ((b as { orden?: number }).orden ?? 0))
      .slice(0, maxItems);
  }
}

async function fetchActiveCategories(): Promise<Categoria[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'categorias'),
        where('activa', '==', true),
        firestoreOrderBy('orden', 'asc')
      )
    );

    return snapshot.docs.map((doc) => serializeFirestoreData<Categoria>({ id: doc.id, ...doc.data() }));
  } catch {
    const snapshot = await getDocs(query(collection(db, 'categorias'), where('activa', '==', true)));
    return snapshot.docs
      .map((doc) => serializeFirestoreData<Categoria>({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  }
}

export async function getHomeData() {
  if (!firebaseEnabled) {
    return {
      paquetes: [],
      productosOrdenados: [],
      banners: ['/images/hero-placeholder.svg'],
      bannersDesktop: ['/images/hero-placeholder.svg'],
      bannersMobile: ['/images/hero-placeholder.svg'],
      blogPosts: [],
      experiencias: [],
      categorias: [],
      categoriasDestacadas: [],
    };
  }
  const [
    paquetesData,
    bannersSnapshot,
    blogData,
    seccionesSnapshot,
    experienciasData,
    categorias,
  ] = await Promise.all([
    fetchVisibleOrdered<Paquete>('paquetes', HOME_PAQUETES_LIMIT),
    getDocs(query(collection(db, 'banners'), firestoreOrderBy('orden', 'asc'))),
    fetchVisibleOrdered<BlogPost>('blog', 4),
    getDocs(query(collection(db, 'secciones'), firestoreOrderBy('orden', 'asc'))),
    getExperiencias({ visibleOnly: true, limit: HOME_EXPERIENCIAS_LIMIT }),
    fetchActiveCategories(),
  ]);

  const categoriasDestacadas = categorias
    .filter((categoria) => Boolean(categoria.destacada))
    .slice(0, HOME_CATEGORIAS_LIMIT);

  const seccionesData = seccionesSnapshot.docs
    .map((doc) =>
      serializeFirestoreData<{
        paqueteId?: string;
        tipo: 'paquete' | 'f1' | 'subtitle';
        orden: number;
        titulo?: string;
      }>({
        id: doc.id,
        ...doc.data(),
      })
    )
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  const paquetesMap = new Map(paquetesData.map((paq) => [paq.id, paq]));

  const productosDesdeSecciones = seccionesData
    .map((item) => {
      if (item.tipo === 'subtitle') {
        return { tipo: 'subtitle' as const, titulo: item.titulo || 'Sección' };
      }
      if (item.tipo === 'f1') return null;
      const paquete = paquetesMap.get(item.paqueteId || '');
      return paquete ? { paquete, tipo: 'paquete' as const } : null;
    })
    .filter(
      (item): item is { tipo: 'paquete'; paquete: Paquete } | { tipo: 'subtitle'; titulo: string } =>
        Boolean(item)
    );

  const productosFinales =
    productosDesdeSecciones.length > 0
      ? productosDesdeSecciones
      : paquetesData.map((paquete) => ({ paquete, tipo: 'paquete' as const }));

  const bannersData = bannersSnapshot.docs
    .map((doc) => doc.data() as { imageUrl?: string; imageUrlMobile?: string; activa?: boolean; target?: 'home' | 'blog' | 'both' })
    .filter((banner) => {
      if (banner.activa === false || !banner.imageUrl) return false;
      const target = banner.target || 'home';
      return target === 'home' || target === 'both';
    })
    .map((banner) => ({
      desktop: banner.imageUrl as string,
      mobile: (banner.imageUrlMobile || banner.imageUrl) as string,
    }));

  return {
    paquetes: paquetesData,
    productosOrdenados: productosFinales,
    banners: bannersData.map((b) => b.desktop),
    bannersDesktop: bannersData.map((b) => b.desktop),
    bannersMobile: bannersData.map((b) => b.mobile),
    blogPosts: blogData,
    experiencias: experienciasData,
    categorias,
    categoriasDestacadas,
  };
}
