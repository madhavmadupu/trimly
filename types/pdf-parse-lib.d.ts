declare module 'pdf-parse/lib/pdf-parse.js' {
  import { Buffer } from 'buffer'

  export interface PdfParseOptions {
    max?: number
    version?: string
  }

  export interface PdfParseResult {
    text: string
  }

  export default function pdfParse(
    data: Buffer,
    options?: PdfParseOptions
  ): Promise<PdfParseResult>
}
