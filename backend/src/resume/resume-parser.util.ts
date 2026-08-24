import * as fs from 'fs';

export async function extractTextFromFile(filePath: string, mimeType: string): Promise<string> {
  console.log(`[ResumeParser] Extracting text from: ${filePath} (mimeType: ${mimeType})`);

  if (mimeType === 'application/pdf') {
    try {
      const pdfParse = require('pdf-parse');
      const buffer = fs.readFileSync(filePath);
      console.log(`[ResumeParser] PDF buffer size: ${buffer.length} bytes`);
      const data = await pdfParse(buffer);
      console.log(`[ResumeParser] PDF text extracted: ${data.text?.length ?? 0} chars`);
      if (!data.text || data.text.trim().length === 0) {
        console.warn('[ResumeParser] WARNING: pdf-parse returned empty text. The PDF may be image-based or corrupt.');
      }
      return data.text || '';
    } catch (err) {
      console.error('[ResumeParser] pdf-parse failed:', err);
      throw new Error(`Failed to parse PDF: ${(err as Error).message}`);
    }
  }

  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ path: filePath });
      console.log(`[ResumeParser] DOCX text extracted: ${result.value?.length ?? 0} chars`);
      if (!result.value || result.value.trim().length === 0) {
        console.warn('[ResumeParser] WARNING: mammoth returned empty text.');
      }
      return result.value || '';
    } catch (err) {
      console.error('[ResumeParser] mammoth DOCX parse failed:', err);
      throw new Error(`Failed to parse DOCX: ${(err as Error).message}`);
    }
  }

  // Fallback: plain text read
  console.log('[ResumeParser] Falling back to plain text read.');
  return fs.readFileSync(filePath, 'utf-8');
}

