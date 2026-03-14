/**
 * Decodes HTML entities from a string (e.g., &amp; -> &)
 */
export const decodeHtml = (html: string): string => {
  if (!html) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};
