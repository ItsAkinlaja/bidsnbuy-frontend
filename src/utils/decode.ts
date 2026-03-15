/**
 * Decodes HTML entities from a string (e.g., &amp; -> &)
 */
export const decodeHtml = (html: string): string => {
  if (!html) return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.documentElement.textContent || '';
  } catch (e) {
    console.error('Error decoding HTML:', e);
    return html;
  }
};
