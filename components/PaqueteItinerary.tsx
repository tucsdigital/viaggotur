import { ChevronDown } from 'lucide-react';
import { normalizeItinerarySteps } from '@/lib/packages/itinerary';
import { sanitizePackageRichHtml } from '@/lib/packages/rich-text-sanitize';
import type { PaqueteItineraryStep } from '@/types';

type Props = {
  steps?: PaqueteItineraryStep[] | null;
  html?: string | null;
};

export default function PaqueteItinerary({ steps, html }: Props) {
  const normalizedSteps = normalizeItinerarySteps(steps);
  const normalizedHtml = sanitizePackageRichHtml(html);
  if (normalizedSteps.length === 0 && !normalizedHtml) return null;

  const proseClass = 'prose prose-sm md:prose-base max-w-none text-gray-700';

  return (
    <div>
      <h2 className="text-lg md:text-lg lg:text-lg font-semibold mb-2">Itinerario</h2>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Consultá el programa completo antes de reservar.
      </p>

      {normalizedSteps.length > 0 ? (
        <div className="space-y-3">
          {normalizedSteps.map((step, index) => (
            <details
              key={step.id}
              className="group rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 md:px-5 md:py-4 hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-black px-2 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span className="flex-1 text-base font-semibold text-gray-900">
                  {step.titulo || `Paso ${index + 1}`}
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              {step.descripcion ? (
                <div
                  className={`${proseClass} border-t border-gray-100 px-4 py-4 md:px-5 wrap-break-word`}
                  dangerouslySetInnerHTML={{ __html: step.descripcion }}
                />
              ) : null}
            </details>
          ))}
        </div>
      ) : (
        <div className={proseClass} dangerouslySetInnerHTML={{ __html: normalizedHtml }} />
      )}
    </div>
  );
}
