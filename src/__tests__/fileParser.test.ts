import { describe, it, expect } from 'vitest';
import { parseUploadedFile } from '../lib/fileParser';

describe('File Parser Module', () => {
  it('should correctly parse plain text (.txt) files into HTML paragraphs', async () => {
    const textBuffer = Buffer.from('Hello World\n\nThis is a second paragraph.');
    const result = await parseUploadedFile(textBuffer, 'sample_doc.txt');

    expect(result.title).toBe('sample doc');
    expect(result.fileType).toBe('txt');
    expect(result.html).toContain('<p>Hello World</p>');
    expect(result.html).toContain('<p>This is a second paragraph.</p>');
  });

  it('should correctly parse Markdown (.md) files into structured HTML', async () => {
    const mdBuffer = Buffer.from('# Project Roadmap\n\n- Task 1\n- Task 2\n\n**Bold Text**');
    const result = await parseUploadedFile(mdBuffer, 'roadmap.md');

    expect(result.title).toBe('roadmap');
    expect(result.fileType).toBe('md');
    expect(result.html).toContain('<h1>Project Roadmap</h1>');
    expect(result.html).toContain('<li>Task 1</li>');
    expect(result.html).toContain('<strong>Bold Text</strong>');
  });

  it('should throw an error for unsupported file formats', async () => {
    const pdfBuffer = Buffer.from('PDF content');
    await expect(parseUploadedFile(pdfBuffer, 'document.pdf')).rejects.toThrow(
      'Unsupported file type ".pdf"'
    );
  });
});
