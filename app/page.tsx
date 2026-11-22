import HomeClient from "@/components/HomeClient";
import { getHomeData } from "@/lib/homeData";

/** Sin caché: los cambios del admin se ven de inmediato en el front */
export const revalidate = 0;

export default async function Home() {
  const data = await getHomeData();
  return (
    <HomeClient
      paquetes={data.paquetes}
      productosOrdenados={data.productosOrdenados}
      categorias={data.categorias}
      categoriasDestacadas={data.categoriasDestacadas}
      bannersDesktop={data.bannersDesktop ?? data.banners}
      bannersMobile={data.bannersMobile ?? data.banners}
      blogPosts={data.blogPosts}
      experiencias={data.experiencias}
    />
  );
}
