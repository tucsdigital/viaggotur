import * as z from 'zod';
import type { PaqueteItineraryStep } from '@/types';
import { sanitizePackageRichHtml } from '@/lib/packages/rich-text-sanitize';
import {
  extractPlainTextFromRichText,
  hasMeaningfulRichText,
  normalizeRichTextContent,
} from '@/lib/packages/rich-text-validation';

export type ItineraryStepFormItem = {
  id: string;
  titulo: string;
  descripcion: string;
};

export const itineraryStepSchema = z.object({
  id: z.string().min(1, 'Falta el identificador del paso'),
  titulo: z
    .string()
    .max(120, 'El título del paso es demasiado largo')
    .optional()
    .or(z.literal(''))
    .transform((val) => String(val ?? '').trim()),
  descripcion: z
    .string()
    .max(100000, 'La descripción del paso es demasiado larga')
    .optional()
    .or(z.literal(''))
    .transform((val) => normalizeRichTextContent(val)),
});

export const itinerarySchemaFields = {
  itinerarioSteps: z
    .array(itineraryStepSchema)
    .max(60, 'El itinerario tiene demasiados pasos'),
};

type ItineraryFormValues = {
  itinerarioSteps?: { id: string; titulo?: string; descripcion?: string }[];
};

export function refineItinerary(data: ItineraryFormValues, ctx: z.RefinementCtx) {
  const steps = data.itinerarioSteps ?? [];
  const total = steps.reduce((acc, step) => acc + extractPlainTextFromRichText(step.descripcion).length, 0);

  if (total > 20000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['itinerarioSteps'],
      message: 'El itinerario no puede exceder 20000 caracteres de contenido',
    });
  }
}

export function normalizeItinerarySteps(raw: unknown): PaqueteItineraryStep[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((step) => ({
      id: String(step?.id ?? '').trim(),
      titulo: String(step?.titulo ?? '').trim(),
      descripcion: sanitizePackageRichHtml(step?.descripcion),
    }))
    .filter((step) => Boolean(step.id) && (Boolean(step.titulo) || hasMeaningfulRichText(step.descripcion)));
}

export function buildItineraryPayload(data: ItineraryFormValues) {
  const itinerarioSteps = normalizeItinerarySteps(data.itinerarioSteps);
  const itinerario = itinerarioSteps
    .map((step) => {
      const title = sanitizePackageRichHtml(step.titulo ? `<h3>${step.titulo}</h3>` : '');
      return `${title}${step.descripcion}`;
    })
    .join('<hr />');

  return {
    itinerario,
    itinerarioSteps,
  };
}

/** Compatibilidad: si solo existe el HTML legacy, se convierte en un único paso. */
export function loadItinerarySteps(data: { itinerarioSteps?: unknown; itinerario?: string }): ItineraryStepFormItem[] {
  if (Array.isArray(data.itinerarioSteps) && data.itinerarioSteps.length > 0) {
    return data.itinerarioSteps.map((step: any) => ({
      id: String(step?.id ?? `step-${Date.now()}-${Math.random().toString(16).slice(2)}`),
      titulo: String(step?.titulo ?? ''),
      descripcion: String(step?.descripcion ?? ''),
    }));
  }
  if (data.itinerario) {
    return [{ id: `step-${Date.now()}`, titulo: '', descripcion: data.itinerario }];
  }
  return [];
}
