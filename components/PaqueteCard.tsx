'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, CheckCircle2, Flame } from 'lucide-react';
import { Paquete } from '@/types';

interface PaqueteCardProps {
  paquete: Paquete;
  index?: number;
  basePath?: string;
  badgeLabel?: string;
  destinoLabel?: string;
}

export default function PaqueteCard({
  paquete,
  index = 0,
  basePath = '/paquete',
  badgeLabel,
  destinoLabel,
}: PaqueteCardProps) {
  const direction = index % 2 === 0 ? -1 : 1;
  const vertical = index % 3 === 0 ? -1 : 1;
  const duration = 0.6 + (index % 3) * 0.05;

  // Obtener la primera salida (más próxima)
  const getPrimeraSalida = () => {
    if (!paquete.salidas || paquete.salidas.length === 0) return null;
    
    const salidasFuturas = paquete.salidas.filter(s => {
      const fechaSalida = new Date(s.fecha + 'T00:00:00');
      return fechaSalida >= new Date();
    });
    
    if (salidasFuturas.length === 0) return paquete.salidas[0];
    
    return salidasFuturas.sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )[0];
  };

  const primeraSalida = getPrimeraSalida();
  const displayedDestination = destinoLabel || paquete.destino || paquete.eventoLugar;
  
  // Precio
  const hasTickets = Boolean(paquete.tickets && paquete.tickets.length > 0);
  const cheapestTicket =
    paquete.tickets && paquete.tickets.length > 0
      ? paquete.tickets.reduce((min, ticket) => (ticket.valor < min.valor ? ticket : min), paquete.tickets[0])
      : undefined;
  
  // Priorizar el precio de la primera salida si no hay tickets
  let priceValue = hasTickets ? cheapestTicket?.valor || 0 : paquete.precio;
  if (!hasTickets && primeraSalida) {
    priceValue = primeraSalida.precio;
  }
  
  const priceMoneda = hasTickets ? cheapestTicket?.moneda || 'USD' : (primeraSalida?.moneda || paquete.moneda || 'ARS');
  const discountValue =
    !hasTickets && typeof paquete.precioDescuentoPrimerosCupos === 'number' && paquete.precioDescuentoPrimerosCupos > 0
      ? paquete.precioDescuentoPrimerosCupos
      : null;
  const cuposValue =
    discountValue && typeof primeraSalida?.cupo === 'number' && primeraSalida.cupo > 0 ? primeraSalida.cupo : null;
  const salidaLabel = primeraSalida?.fecha
    ? new Date(`${primeraSalida.fecha}T00:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
    : null;
  const vueltaLabel = primeraSalida?.fechaVuelta
    ? new Date(`${primeraSalida.fechaVuelta}T00:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
    : null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 50 * direction,
        y: 32 * vertical,
        scale: 0.97,
        rotate: 0.6 * direction,
        filter: 'blur(6px)',
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: -50 * direction, y: -24 * vertical, scale: 0.98, rotate: -0.4 * direction }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      viewport={{ once: true, margin: '-120px' }}
      className="h-full"
    >
      <Link href={`${basePath}/${paquete.slug}`} className="block h-full">
        <Card className="group overflow-hidden w-full max-w-[380px] mx-auto flex flex-col py-0 rounded-2xl md:rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 h-full">
          
          {/* Image Container */}
          <div className="relative h-[150px] sm:h-[175px] md:h-[220px] w-full overflow-hidden shrink-0">
            <Image
              src={paquete.imagenTarjeta || paquete.imagenPrincipal || '/images/placeholder-package.jpg'}
              alt={paquete.titulo}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading={index < 6 ? 'eager' : 'lazy'}
              priority={index < 6}
              fetchPriority={index < 3 ? 'high' : 'auto'}
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            {discountValue && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 z-10">
                <span className="inline-flex items-center rounded-full bg-amber-500/95 px-2.5 py-1 text-[9px] sm:text-[10px] md:text-[11px] font-extrabold tracking-wide text-white shadow-sm">
                  Promo Primeros Cupos
                </span>
              </div>
            )}
            {cuposValue && (
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10">
                <span className="inline-flex items-center rounded-full bg-success px-2.5 py-1 text-[9px] sm:text-[10px] md:text-[11px] font-extrabold tracking-wide text-white shadow-sm">
                  Primeros {cuposValue} Cupos
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col p-3 sm:p-4 md:p-5 flex-1 bg-white">
            
            {/* Title */}
            <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-900 leading-snug mb-2 line-clamp-2 tracking-tight group-hover:text-primary transition-colors duration-300">
              {paquete.titulo}
            </h3>

            {/* Destination Badge */}
            {displayedDestination && (
              <div className="bg-gray-50/80 text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-lg mb-3 w-fit border border-gray-100">
                {displayedDestination}
              </div>
            )}

            {/* Dates & Duration (Icons rows) */}
            <div className="flex flex-col gap-2.5 mb-3">
              {salidaLabel && (
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-success shrink-0 shadow-sm">
                    <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-gray-500 font-bold leading-none">
                      Salida
                    </div>
                    <div className="text-gray-600 text-[13px] sm:text-sm font-medium truncate">{salidaLabel}</div>
                  </div>
                </div>
              )}
              {vueltaLabel && (
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 shrink-0 shadow-sm">
                    <ArrowDownLeft className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-gray-500 font-bold leading-none">
                      Vuelta
                    </div>
                    <div className="text-gray-600 text-[13px] sm:text-sm font-medium truncate">{vueltaLabel}</div>
                  </div>
                </div>
              )}
              {paquete.duracion && (
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500 shrink-0 shadow-sm">
                    <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-600 text-[13px] sm:text-sm font-medium">
                    {paquete.duracion}
                  </span>
                </div>
              )}
            </div>

            {/* Price Footer */}
            <div className="pt-3 border-t border-dashed border-gray-200">
              {discountValue ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-900 text-base sm:text-lg md:text-xl font-extrabold tracking-tight">
                        ${Number(priceValue || 0).toLocaleString('es-AR')}
                      </span>
                      <span className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase">{priceMoneda}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
                    <span className="text-amber-500 text-base sm:text-lg md:text-xl font-extrabold tracking-tight">
                      ${Number(discountValue).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-900 text-base sm:text-lg md:text-xl font-extrabold tracking-tight">
                      ${Number(priceValue || 0).toLocaleString('es-AR')}
                    </span>
                    <span className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase">{priceMoneda}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
