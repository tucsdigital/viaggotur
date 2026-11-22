'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { getWhatsAppLinkForPackage } from '@/lib/utils/whatsapp';
import { Paquete } from '@/types';
import { Calendar, MapPin, Moon, ArrowUpRight, ArrowDownLeft, CheckCircle2, Flame, Share2 } from 'lucide-react';
import { toast } from 'sonner';

// Icono oficial de WhatsApp
const WhatsAppIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

interface PaqueteSidebarProps {
  paquete: Paquete;
}

export default function PaqueteSidebar({ paquete }: PaqueteSidebarProps) {
  const handleShare = async () => {
    const url = new URL(`/paquete/${paquete.slug}`, window.location.origin).toString();
    const shareData = {
      title: paquete.titulo,
      text: `Mirá este paquete turístico: ${paquete.titulo}`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // Cancelar el diálogo nativo es una acción normal del usuario.
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = url;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.opacity = '0';
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand('copy');
        temporaryInput.remove();
        if (!copied) throw new Error('No se pudo copiar el enlace');
      }

      toast.success('Enlace del paquete copiado');
    } catch {
      toast.error('No se pudo compartir el paquete. Intenta copiar el enlace desde el navegador.');
    }
  };

  const nextSalida = useMemo(() => {
    const salidas = Array.isArray(paquete.salidas) ? paquete.salidas : [];
    if (salidas.length === 0) return null;

    const now = new Date();
    const futuras = salidas.filter((s) => {
      if (!s?.fecha) return false;
      const d = new Date(`${s.fecha}T00:00:00`);
      return !Number.isNaN(d.getTime()) && d >= now;
    });

    const list = futuras.length > 0 ? futuras : salidas;
    return [...list].sort((a, b) => {
      const da = new Date(`${a.fecha}T00:00:00`).getTime();
      const db = new Date(`${b.fecha}T00:00:00`).getTime();
      return da - db;
    })[0];
  }, [paquete.salidas]);

  const destino = paquete.destino || paquete.eventoLugar || '—';
  const duracion = paquete.duracion || '—';
  const discountValue =
    typeof paquete.precioDescuentoPrimerosCupos === 'number' && paquete.precioDescuentoPrimerosCupos > 0
      ? paquete.precioDescuentoPrimerosCupos
      : null;
  const condiciones = Array.isArray(paquete.condiciones) ? paquete.condiciones : [];
  const salidaLabel = nextSalida?.fecha
    ? new Date(`${nextSalida.fecha}T00:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
    : null;
  const vueltaLabel = nextSalida?.fechaVuelta
    ? new Date(`${nextSalida.fechaVuelta}T00:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
    : null;

  return (
    <div className="sticky top-24 space-y-5 rounded-3xl border border-secondary/30 bg-white/80 backdrop-blur-sm shadow-[0_20px_50px_rgb(0,0,0,0.08)] p-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            {paquete.mostrarDesde && <p className="text-sm text-gray-600 mb-1">Precio desde</p>}
            {discountValue ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-gray-900" strokeWidth={2.5} />
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                      ${paquete.precio.toLocaleString('es-AR')}
                    </span>
                    <span className="text-xs font-semibold uppercase text-gray-500">{paquete.moneda || 'ARS'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Flame className="h-5 w-5 text-amber-500" strokeWidth={2.5} />
                  <div className="flex flex-col">
                    <span className="text-2xl font-extrabold tracking-tight text-amber-500 leading-none">
                      ${discountValue.toLocaleString('es-AR')}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 mt-1">
                      Promo Primeros Cupos
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-gray-900" strokeWidth={2.5} />
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                    ${paquete.precio.toLocaleString('es-AR')}
                  </span>
                  <span className="text-xs font-semibold uppercase text-gray-500">{paquete.moneda || 'ARS'}</span>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-1">Por persona</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleShare}
            aria-label={`Compartir paquete: ${paquete.titulo}`}
            title="Compartir paquete"
            className="shrink-0 rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-950"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-gray-200">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">Destino</div>
              <div className="text-base font-semibold text-gray-900 truncate">{destino}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700">
              <Moon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">Duración</div>
              <div className="text-base font-semibold text-gray-900 truncate">{duracion}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-success/10 flex items-center justify-center text-success">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Salida
                </div>
                <div className="text-base font-semibold text-gray-900 truncate">{salidaLabel || 'A confirmar'}</div>
              </div>
            </div>

            {vueltaLabel && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  <ArrowDownLeft className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Vuelta
                  </div>
                  <div className="text-base font-semibold text-gray-900 truncate">{vueltaLabel}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {condiciones.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
          <div className="space-y-2.5">
            {condiciones.map((item, index) => (
              <div key={`${item.titulo}-${index}`} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">{item.titulo}:</span> {item.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {paquete.ctaWhatsApp && (
        <Button asChild variant="success" className="w-full text-base py-6 font-semibold rounded-2xl">
          <a href={getWhatsAppLinkForPackage(paquete.titulo)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            <span className="ml-2">Consultar por WhatsApp</span>
          </a>
        </Button>
      )}

      <div className="text-sm text-gray-600 text-center">
        <p>¿Tenés dudas? Escribinos por WhatsApp y te asesoramos.</p>
      </div>
    </div>
  );
}
