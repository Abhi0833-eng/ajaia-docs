/**
 * Client-side file exporter for Markdown, HTML, and Plain Text formats.
 */

export function exportDocumentAsFile(
  title: string,
  htmlContent: string,
  format: 'md' | 'html' | 'txt'
) {
  const safeTitle = title.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'document';
  let content = '';
  let mimeType = 'text/plain';
  let fileExtension = format;

  if (format === 'html') {
    content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; }
    h1, h2, h3 { color: #0f172a; margin-top: 1.5em; }
    blockquote { border-left: 4px solid #3b82f6; margin: 0; padding-left: 16px; color: #475569; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
  </style>
</head>
<body>
  <h1>${escapeXml(title)}</h1>
  ${htmlContent}
</body>
</html>`;
    mimeType = 'text/html';
  } else if (format === 'md') {
    content = htmlToMarkdown(title, htmlContent);
    mimeType = 'text/markdown';
  } else {
    content = htmlToPlainText(title, htmlContent);
    mimeType = 'text/plain';
  }

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${safeTitle}.${fileExtension}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeXml(text: string): string {
  return text.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function htmlToMarkdown(title: string, html: string): string {
  let md = `# ${title}\n\n`;
  let temp = html
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<u>(.*?)<\/u>/gi, '_$1_')
    .replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '');

  return md + temp.trim();
}

function htmlToPlainText(title: string, html: string): string {
  const container = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (container) {
    container.innerHTML = html;
    return `${title}\n${'='.repeat(title.length)}\n\n${container.innerText || container.textContent || ''}`;
  }
  return `${title}\n\n${html.replace(/<[^>]+>/g, '')}`;
}
