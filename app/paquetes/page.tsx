import { collection, getDocs, limit, orderBy as firestoreOrderBy, query, where } from 'firebase/firestore';
import { db, firebaseEnabled } from '@/lib/firebase';
import { Paquete, Categoria } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PaquetesClient from '@/components/PaquetesClient';
import type { Metadata } from 'next';
import { serializeFirestoreData } from '@/lib/utils/serialize';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
import { siteConfig } from '@/lib/siteConfig';

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: `Paquetes - ${SITE_NAME}`,
  description: `Explorá nuestros paquetes turísticos con ${SITE_NAME}. ${SITE_DESCRIPTION}`,
  alternates: {
    canonical: `${siteUrl}/paquetes`,
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/paquetes`,
    title: `Paquetes - ${SITE_NAME}`,
    description: `Explorá nuestros paquetes turísticos con ${SITE_NAME}.`,
    siteName: SITE_NAME,
    locale: siteConfig.seo.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Paquetes - ${SITE_NAME}`,
    description: `Explorá nuestros paquetes turísticos con ${SITE_NAME}.`,
  },
  keywords: [...siteConfig.seo.keywords, 'paquetes', 'paquetes turísticos'],
};

/** Sin caché: los cambios del admin (paquetes) se ven de inmediato */
export const revalidate = 0;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function getPaquetes(): Promise<Paquete[]> {
  if (!firebaseEnabled) return [];
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'paquetes'),
        where('visible', '==', true),
        firestoreOrderBy('orden', 'asc')
      )
    );

    return snapshot.docs.map((doc) => serializeFirestoreData<Paquete>({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // Fallback sin índice compuesto
    const snapshot = await getDocs(query(collection(db, 'paquetes'), where('visible', '==', true)));
    return snapshot.docs
      .map((doc) => serializeFirestoreData<Paquete>({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }
}

async function getCategorias(): Promise<Categoria[]> {
  if (!firebaseEnabled) return [];
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'categorias'),
        where('activa', '==', true),
        firestoreOrderBy('orden', 'asc')
      )
    );

    return snapshot.docs.map((doc) => serializeFirestoreData<Categoria>({ id: doc.id, ...doc.data() }));
  } catch (error) {
    const snapshot = await getDocs(query(collection(db, 'categorias'), where('activa', '==', true)));
    return snapshot.docs
      .map((doc) => serializeFirestoreData<Categoria>({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }
}

function normalizeParam(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((v) => String(v).split(','))
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeCategoryToken(value: string): string {
  return String(value).trim().toLowerCase();
}

export default async function PaquetesPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const [paquetes, categorias] = await Promise.all([
    getPaquetes(),
    getCategorias(),
  ]);

  const tipos = normalizeParam(resolvedSearchParams.tipo);
  const categoriasSeleccionadas = normalizeParam(resolvedSearchParams.categoria);
  const tag = normalizeParam(resolvedSearchParams.tag);
  const transportes = normalizeParam(resolvedSearchParams.transporte);

  const categoriasActivasSeleccionadas = categorias.filter((categoria) => {
    const slug = normalizeCategoryToken(categoria.slug);
    const nombre = normalizeCategoryToken(categoria.nombre);
    return (
      categoriasSeleccionadas.includes(slug) ||
      categoriasSeleccionadas.includes(nombre)
    );
  });

  let heroTitle = 'Paquetes';
  let heroSubtitle = 'Descubre los mejores destinos turísticos con paquetes diseñados para ti';

  if (tipos.includes('grupal')) {
    heroTitle = 'Salidas grupales';
    heroSubtitle = 'Viajes organizados para compartir, con todo planificado';
  } else if (tipos.includes('internacional')) {
    heroTitle = 'Paquetes internacionales';
    heroSubtitle = 'Explorá destinos internacionales con propuestas seleccionadas';
  } else if (tipos.includes('educativo')) {
    heroTitle = 'Paquetes educativos';
    heroSubtitle = 'Opciones pensadas para instituciones, contingentes y grupos';
  } else if (categoriasActivasSeleccionadas.length > 0) {
    heroTitle = categoriasActivasSeleccionadas.map((categoria) => categoria.nombre).join(' / ');
    heroSubtitle =
      categoriasActivasSeleccionadas.length === 1
        ? `Explorá paquetes de la categoría ${categoriasActivasSeleccionadas[0].nombre}.`
        : 'Explorá paquetes de las categorías seleccionadas.';
  } else if (tipos.includes('eventos') || tipos.includes('recitales')) {
    heroTitle = 'Eventos / Recitales';
    heroSubtitle = 'Eventos y recitales para compartir con tu grupo';
  } else if (transportes.length > 0) {
    heroTitle = 'Paquetes con transporte';
    heroSubtitle = 'Encontrá paquetes por tipo de transporte';
  } else if (tag.includes('promo')) {
    heroTitle = 'Promos';
    heroSubtitle = 'Ofertas y oportunidades para viajar al mejor precio';
  }

  return (
    <>
      <Navbar theme="rio" />
      <WhatsAppButton />

      {/* Hero: fondo cream, texto negro (alineado a la página principal) */}
      <section className="relative bg-cream text-black pt-24 pb-12 md:pt-32 md:pb-16 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto pt-24 text-center md:text-left">
            <h1 className="text-[40px] leading-[50px] tracking-[1px] font-semibold mb-3 md:mb-4 font-heading text-black">
              {heroTitle}
            </h1>
            <p className="text-base md:text-lg text-gray-700 font-body leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <PaquetesClient paquetes={paquetes} categorias={categorias} />

      <Footer />
    </>
  );
}
