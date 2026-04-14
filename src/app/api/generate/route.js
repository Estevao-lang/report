import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { ReportDocument } from '@/lib/pdf-template';
import { parseToPdfElements } from '@/lib/pdf-parser';

export async function POST(request) {
  try {
    const body = await request.json();
    const { cover, content } = body;

    if (!cover?.title?.trim()) {
      return Response.json({ error: 'O título do relatório é obrigatório.' }, { status: 400 });
    }

    // Header text for every page
    const headerParts = [cover.organization, cover.project, cover.title].filter(Boolean);
    const headerText  = headerParts.join('  |  ');

    // Parse markdown content to React PDF elements
    const elements = parseToPdfElements(content || '');

    // Build and render PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(ReportDocument, { coverData: cover, elements, headerText })
    );

    const safeFilename = (cover.title || 'relatorio')
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\s_-]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 80) || 'relatorio';

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}.pdf"`,
        'Content-Length':      String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error('[generate-pdf]', err);
    return Response.json({ error: err.message || 'Erro interno ao gerar o PDF.' }, { status: 500 });
  }
}
