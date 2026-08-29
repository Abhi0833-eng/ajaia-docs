import { marked } from 'marked';
import mammoth from 'mammoth';

export interface ParseResult {
  title: string;
  html: string;
  originalFileName: string;
  fileType: string;
}

/**
 * Parses file content (.txt, .md, .docx) into document title & rich HTML content.
 */
export async function parseUploadedFile(
  fileBuffer: Buffer,
  fileName: string
): Promise<ParseResult> {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

  if (extension === 'txt') {
    const textContent = fileBuffer.toString('utf-8');
    // Convert plain text paragraphs to HTML <p> tags
    const html = textContent
      .split('\n\n')
      .map(paragraph => `<p>${escapeHtml(paragraph.trim().replace(/\n/g, '<br/>'))}</p>`)
      .join('');
    return {
      title: cleanTitle || 'Imported Text Document',
      html: html || '<p></p>',
      originalFileName: fileName,
      fileType: 'txt',
    };
  }

  if (extension === 'md' || extension === 'markdown') {
    const markdownContent = fileBuffer.toString('utf-8');
    const html = await marked.parse(markdownContent);
    return {
      title: cleanTitle || 'Imported Markdown Document',
      html: typeof html === 'string' ? html : '<p></p>',
      originalFileName: fileName,
      fileType: 'md',
    };
  }

  if (extension === 'docx') {
    const result = await mammoth.convertToHtml({ buffer: fileBuffer });
    return {
      title: cleanTitle || 'Imported Word Document',
      html: result.value || '<p>Imported document empty</p>',
      originalFileName: fileName,
      fileType: 'docx',
    };
  }

  throw new Error(`Unsupported file type ".${extension}". Supported formats: .txt, .md, .docx`);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
