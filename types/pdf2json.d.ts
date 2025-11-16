declare module "pdf2json" {
  export default class PDFParser {
    constructor(opts?: any, verbosity?: number);

    on(event: "pdfParser_dataReady", cb: (data: any) => void): void;
    on(event: "pdfParser_dataError", cb: (err: any) => void): void;

    loadPDF(filePath: string): void;
    parseBuffer(buffer: Buffer): void;

    getRawTextContent(): string;
  }
}
