"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BlogPost, Paquete } from "@/types";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/sections/ProductsSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import ExperienciasSection from "@/components/sections/ExperienciasSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ValuesSection from "@/components/sections/ValuesSection";
import AboutSection from "@/components/sections/AboutSection";
import BlogSection from "@/components/sections/BlogSection";
import InstagramSection from "@/components/sections/InstagramSection";
import ContactSectionBlock from "@/components/sections/ContactSectionBlock";
import Newsletter from "@/components/Newsletter";
import LandingFooter from "@/components/landing-reserva/LandingFooter";
import ScrollSmoother from "@/components/ScrollSmoother";
import HeroSearch from "@/components/HeroSearch";
import type { Experience } from "@/components/landing-reserva/types";
import { renderTemplate, siteConfig } from "@/lib/siteConfig";
import { Categoria } from "@/types";

// Variantes de animación profesionales con efectos en cascada
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1], // Easing más dramático
    },
  },
};

const fadeInDownVariants = {
  hidden: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeInLeftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeInRightVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Más espaciado para efecto cascada
      delayChildren: 0.3,
    },
  },
};

const staggerFastVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeInScaleVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface HomeClientProps {
  paquetes: Paquete[];
  categorias: Categoria[];
  productosOrdenados: Array<
    | { tipo: "paquete"; paquete: Paquete }
    | { tipo: "subtitle"; titulo: string }
  >;
  categoriasDestacadas: Categoria[];
  bannersDesktop: string[];
  bannersMobile: string[];
  blogPosts: BlogPost[]; // BLOG OCULTO: se pasa [] desde page; descomentar BlogSection para usar
  experiencias: Experience[];
}

export default function HomeClient({
  paquetes,
  categorias,
  productosOrdenados,
  categoriasDestacadas,
  bannersDesktop,
  bannersMobile,
  blogPosts,
  experiencias,
}: HomeClientProps) {
  const router = useRouter();
  const [bannerIndex, setBannerIndex] = useState(0);
  // Skeletons breves solo para transición visual; datos vienen del servidor
  const [productosLoading, setProductosLoading] = useState(true);

  useEffect(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const count = Math.max(bannersDesktop.length, bannersMobile.length);
    if (count <= 1) return;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % count);
    }, 6000);

    return () => clearInterval(interval);
  }, [bannersDesktop, bannersMobile]);

  useEffect(() => {
    const timer = setTimeout(() => setProductosLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-x-hidden bg-white min-h-screen">
      <ScrollSmoother />
      <Navbar transparent={true} theme="rio" />

      {/* Buscador (Hero Moderno 2026) */}
      <motion.div 
        className="relative pt-40 pb-16 md:pt-52 md:pb-24 bg-white overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
      >
        {/* Decoración de fondo suave (Orbs) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] opacity-70" />
          <div className="absolute top-[40%] left-[-15%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] opacity-70" />
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center max-w-4xl mx-auto mb-10 md:mb-14" variants={fadeInUpVariants}>
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_2px_10px_rgba(76,175,80,0.1)]">
              {siteConfig.content.homeHero.badge}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.1]">
              {siteConfig.content.homeHero.titlePrefix}{' '}
              <span className="text-primary relative whitespace-nowrap">
                {siteConfig.content.homeHero.titleAccent}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
              {renderTemplate(siteConfig.content.homeHero.subtitleTemplate)}
            </p>
          </motion.div>

          <motion.div variants={fadeInUpVariants} className="max-w-5xl mx-auto relative">
            <HeroSearch paquetes={paquetes} categorias={categorias} />
            
            {/* Sombra sutil debajo del buscador para darle efecto de flotación 3D */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-black/5 blur-xl rounded-[100%] -z-10" />
          </motion.div>
        </div>
      </motion.div>

      {/* Banners */}
      {(bannersDesktop.length > 0 || bannersMobile.length > 0) && (
        <Hero
          theme="rio"
          backgroundImage={bannersDesktop[bannerIndex] || bannersDesktop[0] || "/images/hero-placeholder.svg"}
          backgroundImageMobile={bannersMobile[bannerIndex] || bannersMobile[0] || bannersDesktop[bannerIndex] || "/images/hero-placeholder.svg"}
          backgroundImageDesktop={bannersDesktop[bannerIndex] || bannersDesktop[0] || "/images/hero-placeholder.svg"}
          bannerImagesDesktop={bannersDesktop}
          bannerImagesMobile={bannersMobile.length > 0 ? bannersMobile : undefined}
          activeBannerIndex={bannerIndex}
          onBannerIndexChange={setBannerIndex}
          height="lg"
        />
      )}

      {/* Paquetes destacados */}
      <ProductsSection
        items={productosOrdenados}
        categorias={categorias}
        filterType="paquete"
        sectionBadge={siteConfig.content.packagesSection.badge}
        sectionTitle={siteConfig.content.packagesSection.title}
        sectionSubtitle={renderTemplate(siteConfig.content.packagesSection.subtitleTemplate)}
        loading={productosLoading}
        fadeInLeftVariants={fadeInLeftVariants}
        fadeInRightVariants={fadeInRightVariants}
        fadeInUpVariants={fadeInUpVariants}
        fadeInDownVariants={fadeInDownVariants}
        fadeInScaleVariants={fadeInScaleVariants}
        staggerFastVariants={staggerFastVariants}
      />

      {/* Destinos destacados */}
      <CategoriesSection
        categorias={categoriasDestacadas ?? []}
        fadeInUpVariants={fadeInUpVariants}
        staggerFastVariants={staggerFastVariants}
      />

      {/* Experiencias */}
      <ExperienciasSection
        experiencias={experiencias ?? []}
        loading={false}
        fadeInLeftVariants={fadeInLeftVariants}
        fadeInRightVariants={fadeInRightVariants}
        fadeInUpVariants={fadeInUpVariants}
        fadeInDownVariants={fadeInDownVariants}
        fadeInScaleVariants={fadeInScaleVariants}
        staggerFastVariants={staggerFastVariants}
      />

      {/* Nuestros Servicios */}
      <ServicesSection
        fadeInUpVariants={fadeInUpVariants}
        staggerFastVariants={staggerFastVariants}
        staggerContainerVariants={staggerContainerVariants}
        scaleInVariants={fadeInScaleVariants}
      />

      {/* Porque elegirnos */}
      <ValuesSection
        fadeInUpVariants={fadeInUpVariants}
        staggerFastVariants={staggerFastVariants}
        staggerContainerVariants={staggerContainerVariants}
        scaleInVariants={fadeInScaleVariants}
      />

      {/* Blog Section */}
      <BlogSection
        posts={blogPosts}
        fadeInLeftVariants={fadeInLeftVariants}
        fadeInRightVariants={fadeInRightVariants}
        fadeInUpVariants={fadeInUpVariants}
        fadeInDownVariants={fadeInDownVariants}
        fadeInScaleVariants={fadeInScaleVariants}
        staggerFastVariants={staggerFastVariants}
      />

      {/* Sobre Nosotros */}
      <AboutSection
        fadeInLeftVariants={fadeInLeftVariants}
        fadeInRightVariants={fadeInRightVariants}
        staggerFastVariants={staggerFastVariants}
        staggerContainerVariants={staggerContainerVariants}
      />

      {/* Contacto */}
      <ContactSectionBlock
        fadeInLeftVariants={fadeInLeftVariants}
        fadeInRightVariants={fadeInRightVariants}
        fadeInUpVariants={fadeInUpVariants}
        fadeInDownVariants={fadeInDownVariants}
        fadeInScaleVariants={fadeInScaleVariants}
        staggerFastVariants={staggerFastVariants}
      />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
