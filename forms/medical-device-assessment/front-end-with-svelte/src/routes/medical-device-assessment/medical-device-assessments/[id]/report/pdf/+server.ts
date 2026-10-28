import path from 'node:path';
import type { RequestHandler } from './$types';
import { buildPdfDoc } from '#lib/report/pdf-builder.js';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

export const POST: RequestHandler = async ({ request, params }) => {
  const { data, result } = (await request.json()) as {
    data: AssessmentData;
    result: GradingResult;
  };

  // pdfmake 0.3 exports a ready-made singleton; register the bundled Roboto TTFs once.
  const mod = await import('pdfmake');
  const pdfmake = (mod.default ?? mod) as typeof import('pdfmake');
  const fontDir = path.join(process.cwd(), 'node_modules/pdfmake/build/fonts/Roboto');
  pdfmake.setFonts({
    Roboto: {
      normal: path.join(fontDir, 'Roboto-Regular.ttf'),
      bold: path.join(fontDir, 'Roboto-Medium.ttf'),
      italics: path.join(fontDir, 'Roboto-Italic.ttf'),
      bolditalics: path.join(fontDir, 'Roboto-MediumItalic.ttf')
    }
  });

  const buffer = await pdfmake.createPdf(buildPdfDoc(data, result)).getBuffer();
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="medical-device-assessment-${params.id}.pdf"`
    }
  });
};
