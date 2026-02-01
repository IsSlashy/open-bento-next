// Sanitize text - strip all HTML tags
export function sanitizeText(text: string): string {
  if (!text) return '';
  // Remove HTML tags
  return text.replace(/<[^>]*>/g, '').trim();
}

// Sanitize URL - only allow http/https protocols
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return '';
  } catch {
    return '';
  }
}

// Sanitize for contentEditable - prevent script injection
export function sanitizeContentEditable(html: string): string {
  if (!html) return '';
  // Strip all HTML, only keep text content
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (div) {
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  return html.replace(/<[^>]*>/g, '');
}
