'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Briefcase, MapPin, Compass, Search } from 'lucide-react';
import TopbarContact from '@/components/TopbarContact';
import { useAgenciasModal } from '@/components/AgenciasModal';
import { SITE_NAME } from '@/lib/constants';
import { getBrandLogoSrc, isRemoteUrl, renderTemplate, siteConfig } from '@/lib/siteConfig';

interface NavbarProps {
  transparent?: boolean;
  forceTransparent?: boolean;
  reserveSpace?: boolean;
  /** Estética Río / Viaggio Tur: fondo claro, texto negro */
  theme?: "default" | "rio";
}

export default function Navbar({ transparent = false, forceTransparent = false, reserveSpace = false, theme = "default" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAgencias } = useAgenciasModal();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const logoSrc = getBrandLogoSrc();
  const logoAlt = renderTemplate(siteConfig.branding.logo.altTextTemplate || '{{siteName}} Logo');
  const navRef = useRef<HTMLElement | null>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const original = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original;
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileMenuOpen]);

  const isRio = theme === "rio";
  const isCompact = isRio && (isScrolled || mobileMenuOpen);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!reserveSpace) return;
    if (typeof window === 'undefined') return;

    const updateHeight = () => {
      const height = navRef.current?.getBoundingClientRect().height ?? 0;
      setNavHeight(height);
    };

    updateHeight();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : null;
    if (ro && navRef.current) ro.observe(navRef.current);

    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      ro?.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!reserveSpace) return;
    const height = navRef.current?.getBoundingClientRect().height ?? 0;
    setNavHeight(height);
  }, [isScrolled, mobileMenuOpen, reserveSpace]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/paquetes?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navContent = (
    <nav
      ref={navRef as unknown as React.RefObject<HTMLElement>}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'pt-2 md:pt-4' : 'pt-0'}`}
      onClick={() => {
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }}
    >
      {/* Topbar (Se oculta al scrollear para diseño más limpio) */}
      <div className={`transition-all duration-500 overflow-hidden bg-primary ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-white/90 text-[11px] font-medium h-10 flex items-center">
          <TopbarContact />
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`mx-auto transition-all duration-500 w-full ${
        isScrolled 
          ? 'px-4 md:px-6 mt-2' 
          : 'bg-white'
      }`}>
        <div className={`mx-auto transition-all duration-500 ${
          isScrolled 
            ? 'xl:max-w-7xl bg-white/90 backdrop-blur-xl shadow-lg rounded-2xl px-4 md:px-6' 
            : 'container px-4 md:px-6 lg:px-8 border-none shadow-none'
        }`}>
          <div className="flex items-center justify-between h-16 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 gap-1">
            <div className="h-12 md:h-16 flex items-center shrink-0">
              {isRemoteUrl(logoSrc) ? (
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  className="h-full w-auto object-contain"
                />
              ) : (
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={192}
                  height={64}
                  className="h-full w-auto object-contain"
                />
              )}
            </div>
            <span className="font-logo text-primary text-2xl leading-none whitespace-nowrap">
              {siteConfig.branding.logo.titleText}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-col items-center justify-center flex-1 mx-4 space-y-1.5 text-[10px] xl:text-[12px] font-semibold text-gray-500 tracking-[0.1em]">
            <div className="flex items-center space-x-3">
              <Link href="/#categorias" className="hover:text-primary transition-colors uppercase">DESTINOS</Link>
              <span className="text-gray-200 font-light">|</span>
              <Link href="/paquetes?tipo=grupal" className="hover:text-primary transition-colors uppercase">SALIDAS GRUPALES</Link>
              <span className="text-gray-200 font-light">|</span>
              <Link href="/paquetes?tipo=internacional" className="hover:text-primary transition-colors uppercase">INTERNACIONALES</Link>
              <span className="text-gray-200 font-light">|</span>
              <Link href="/educativos" className="hover:text-primary transition-colors uppercase">EDUCATIVOS/EGRESADOS</Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/transportes" className="hover:text-primary transition-colors uppercase">TRANSPORTE</Link>
              <span className="text-gray-200 font-light">|</span>
              <Link href="/paquetes?categoria=eventos,recitales" className="hover:text-primary transition-colors uppercase">EVENTOS/RECITALES</Link>
              <span className="text-gray-200 font-light">|</span>
              <Link href="/paquetes?tag=promo" className="hover:text-primary transition-colors uppercase">PROMOS</Link>
              <span className="text-gray-200 font-light">|</span>
              <Link href="/contacto" className="hover:text-primary transition-colors uppercase">CONTACTO</Link>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-50 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-full px-5 py-2.5 w-48 2xl:w-64 border border-transparent transition-all duration-300 shrink-0 ml-auto group">
            <Search className="w-4 h-4 text-primary/50 group-focus-within:text-primary mr-2.5 shrink-0 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscá tu destino!" 
              className="bg-transparent outline-none text-xs w-full text-gray-700 placeholder-gray-400 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 ml-auto"
            onClick={(event) => {
              event.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            {mobileMenuOpen ? (
              <X className="text-gray-900 w-6 h-6" />
            ) : (
              <Menu className="text-gray-900 w-6 h-6" />
            )}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 z-10 w-[86vw] max-w-sm shadow-2xl bg-white overflow-y-auto"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-full flex flex-col p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-gray-500 font-bold">Menú</div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-900" />
                  </button>
                </div>

                <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-xl px-4 py-3 w-full border border-transparent focus-within:border-primary focus-within:bg-white transition mb-6">
                  <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Buscá tu destino!" 
                    className="bg-transparent outline-none text-base w-full text-gray-800 placeholder-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <nav className="space-y-1 text-left flex-1">
                  <Link href="/#categorias" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>
                    DESTINOS
                  </Link>
                  <Link href="/paquetes?tipo=grupal" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>
                    SALIDAS GRUPALES
                  </Link>
                  <Link href="/paquetes?tipo=internacional" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>
                    INTERNACIONALES
                  </Link>
                  <Link href="/educativos" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>
                    EDUCATIVOS/EGRESADOS
                  </Link>
                  <Link href="/transportes" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>
                    TRANSPORTE
                  </Link>
                  <Link href="/paquetes?categoria=eventos,recitales" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>
                    EVENTOS/RECITALES
                  </Link>
                  <Link href="/paquetes?tag=promo" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>
                    PROMOS
                  </Link>
                  <Link href="/contacto" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>
                    CONTACTO
                  </Link>
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAgencias();
                    }}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-center text-sm transition font-bold tracking-wider"
                  >
                    AGENCIAS
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  return (
    <>
      {reserveSpace && (
        <div aria-hidden className="w-full transition-[height] duration-500" style={{ height: navHeight }} />
      )}
      {mounted && typeof document !== "undefined"
        ? createPortal(navContent, document.body)
        : navContent}
    </>
  );
}
