'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { CONTACT_INFO, SOCIAL_MEDIA } from '@/lib/constants';
import { useAgenciasModal } from '@/components/AgenciasModal';

const ROTATE_MS = 3200;

interface ContactItem {
  key: string;
  href: string;
  icon: React.ReactNode;
  label: string;
  highlight?: string;
  external?: boolean;
}

export default function TopbarContact() {
  const reduceMotion = useReducedMotion();
  const { openAgencias } = useAgenciasModal();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = useMemo<ContactItem[]>(() => {
    const list: ContactItem[] = [];
    if (CONTACT_INFO.telefono) {
      list.push({
        key: 'tel',
        href: `tel:+54${CONTACT_INFO.telefono}`,
        icon: <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
        label: CONTACT_INFO.telefono,
      });
    }
    if (CONTACT_INFO.whatsapp) {
      list.push({
        key: 'wsp',
        href: `https://wa.me/${CONTACT_INFO.whatsapp}`,
        icon: <FaWhatsapp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
        label: CONTACT_INFO.whatsappDisplay,
        external: true,
      });
    }
    if (CONTACT_INFO.whatsappInternacional) {
      list.push({
        key: 'wsp-int',
        href: `https://wa.me/${CONTACT_INFO.whatsappInternacional}`,
        icon: <FaWhatsapp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
        highlight: 'Internacional',
        label: CONTACT_INFO.whatsappInternacionalDisplay,
        external: true,
      });
    }
    if (CONTACT_INFO.email) {
      list.push({
        key: 'email',
        href: SOCIAL_MEDIA.email || `mailto:${CONTACT_INFO.email}`,
        icon: <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
        label: CONTACT_INFO.email,
      });
    }
    return list;
  }, []);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const renderItem = (item: ContactItem) => (
    <a
      href={item.href}
      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex items-center gap-1.5 min-w-0 text-white/90 hover:text-white transition-colors"
    >
      <span className="opacity-90">{item.icon}</span>
      <span className="tracking-normal truncate">
        {item.highlight && <span className="font-semibold mr-1">{item.highlight}</span>}
        {item.label}
      </span>
    </a>
  );

  const current = items[index % Math.max(items.length, 1)];

  return (
    <div className="flex items-center justify-between h-full min-w-0 flex-1 text-[9px] sm:text-[10px] lg:text-[10.5px] leading-none">
      <div className="flex items-center gap-2.5 lg:gap-4 xl:gap-5 min-w-0 flex-1">
        <div className="flex items-center gap-2.5 shrink-0">
          {SOCIAL_MEDIA.facebook && (
            <a
              href={SOCIAL_MEDIA.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white/90 hover:text-white transition-colors"
            >
              <FaFacebook className="w-3.5 h-3.5" />
            </a>
          )}
          {SOCIAL_MEDIA.instagram && (
            <a
              href={SOCIAL_MEDIA.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/90 hover:text-white transition-colors"
            >
              <FaInstagram className="w-3.5 h-3.5" />
            </a>
          )}
          <span className="text-white/30 hidden sm:inline">|</span>
        </div>

        {/* Desktop: todos los datos visibles */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-5 min-w-0">
          {items.map((item) => (
            <div key={item.key} className="min-w-0">
              {renderItem(item)}
            </div>
          ))}
        </div>

        {/* Mobile / tablet: un dato a la vez, rotando solo */}
        <div
          className="lg:hidden relative flex-1 min-w-0 h-full flex items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          aria-live="off"
        >
          <AnimatePresence mode="wait" initial={false}>
            {current && (
              <motion.div
                key={current.key}
                className="min-w-0 max-w-full"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderItem(current)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-1 mr-3 lg:hidden shrink-0" aria-hidden="true">
        {items.map((item, i) => (
          <span
            key={item.key}
            className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-3 bg-white' : 'w-1 bg-white/40'}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={openAgencias}
        className="self-stretch bg-black/10 hover:bg-black/20 text-white px-3 sm:px-6 lg:px-8 flex items-center transition-all duration-300 font-semibold tracking-[0.12em] text-[8px] sm:text-[9px] lg:text-[10px] shrink-0"
      >
        AGENCIAS
      </button>
    </div>
  );
}



