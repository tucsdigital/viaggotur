import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 's', 'a',
  'blockquote', 'h1', 'h2', 'h3', 'hr', 'code',
];

const ALIGN = { 'text-align': [/^(left|center|right)$/] };

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    p: ['style'],
    h1: ['style'],
    h2: ['style'],
    h3: ['style'],
    blockquote: ['style'],
  },
  allowedStyles: {
    p: ALIGN,
    h1: ALIGN,
    h2: ALIGN,
    h3: ALIGN,
    blockquote: ALIGN,
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesAppliedToAttributes: ['href'],
  disallowedTagsMode: 'discard',
  transformTags: {
    a: (tagName, attribs) => {
      const href = String(attribs.href ?? '').trim();
      const safeHref =
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
          ? href
          : '';

      return {
        tagName,
        attribs: safeHref
          ? { href: safeHref, target: '_blank', rel: 'noopener noreferrer nofollow' }
          : ({} as sanitizeHtml.Attributes),
      };
    },
  },
};

export function sanitizePackageRichHtml(value: string | undefined | null) {
  const normalized = String(value ?? '').trim();
  if (!normalized) return '';
  return sanitizeHtml(normalized, SANITIZE_OPTIONS).trim();
}
