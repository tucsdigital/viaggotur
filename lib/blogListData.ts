import { collection, getDocs, query, orderBy as firestoreOrderBy, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { serializeFirestoreData } from '@/lib/utils/serialize';
import { BlogPost } from '@/types';

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
  } catch (error) {
    const snapshot = await getDocs(query(collection(db, collectionName), where('visible', '==', true)));
    return snapshot.docs
      .map((doc) => serializeFirestoreData<T>({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (a.orden || 0) - (b.orden || 0))
      .slice(0, maxItems);
  }
}

export async function getBlogListData() {
  const [posts, bannersSnapshot] = await Promise.all([
    fetchVisibleOrdered<BlogPost>('blog', 12),
    getDocs(query(collection(db, 'banners'), firestoreOrderBy('orden', 'asc'))),
  ]);

  const bannersData = bannersSnapshot.docs
    .map((doc) => doc.data() as { imageUrl?: string; imageUrlMobile?: string; activa?: boolean; target?: 'home' | 'blog' | 'both' })
    .filter((banner) => {
      if (banner.activa === false || !banner.imageUrl) return false;
      const target = banner.target || 'home';
      return target === 'blog' || target === 'both';
    })
    .map((banner) => ({
      desktop: banner.imageUrl as string,
      mobile: (banner.imageUrlMobile || banner.imageUrl) as string,
    }));

  return {
    posts,
    banners: bannersData.map((b) => b.desktop),
    bannersDesktop: bannersData.map((b) => b.desktop),
    bannersMobile: bannersData.map((b) => b.mobile),
  };
}
