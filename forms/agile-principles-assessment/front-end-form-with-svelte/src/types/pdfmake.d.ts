// Minimal ambient declarations for pdfmake. The library has no first-party
// types and the `@types/pdfmake` shapes don't match the runtime entry points
// we actually import. Type only the surface area pdf-builder.ts touches.
declare module 'pdfmake/build/pdfmake.js' {
  const pdfMake: {
    vfs?: unknown;
    createPdf(doc: unknown): {
      download(filename?: string): void;
      open(): void;
    };
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
    content: Content[] | Content;
    styles?: Record<string, Record<string, unknown>>;
    defaultStyle?: Record<string, unknown>;
  }
}
