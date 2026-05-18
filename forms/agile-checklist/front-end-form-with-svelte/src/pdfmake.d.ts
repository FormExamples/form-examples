declare module 'pdfmake/build/pdfmake.js' {
  const pdfMake: {
    vfs: unknown;
    createPdf(definition: unknown): { download(filename?: string): void };
  };
  export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts.js' {
  const fonts: { pdfMake?: { vfs: unknown }; vfs?: unknown };
  export default fonts;
}

declare module 'pdfmake/interfaces' {
  export type Content = unknown;
  export interface TDocumentDefinitions {
    info?: { title?: string };
    content?: Content[] | Content;
    styles?: Record<string, unknown>;
    defaultStyle?: Record<string, unknown>;
  }
}
