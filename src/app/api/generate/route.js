import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ReportDocument } from '@/lib/pdf-template';
import { parseToPdfElements } from '@/lib/pdf-parser';

const REPORT_MODELS = {
  snave: {
    logoFile: 'snave-uk-ltd-logo.png',
    imageIds: ['snave-uk-ltd-logo', 'snave-uk-ltd-logo.png', 'snave-uk-ltd-logo.webp'],
    theme: {
      primary: '#4B4F54',
      accent: '#C92234',
      dark: '#2F3438',
      border: '#A7ADB2',
      lightBg: '#FFF1F3',
    },
  },
  maia: {
    logoFile: 'maia-logo.png',
    imageIds: ['maia-logo', 'maia logo', 'maia-logo.png', 'maia logo.webp', 'nav_logo', 'nav_logo.webp'],
    theme: {
      primary: '#4E566B',
      accent: '#5C6BC0',
      dark: '#252A36',
      border: '#AAB0C2',
      lightBg: '#F1F3FF',
    },
  },
};

async function getBrandLogo(model) {
  const logoPath = path.join(process.cwd(), 'public', model.logoFile);
  const logo = await readFile(logoPath);
  return `data:image/png;base64,${logo.toString('base64')}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { cover, content, images = {} } = body;
    const selectedModel = REPORT_MODELS[cover?.model] || REPORT_MODELS.snave;

    if (!cover?.title?.trim()) {
      return Response.json({ error: 'O título do relatório é obrigatório.' }, { status: 400 });
    }

    // Header text for every page
    const headerParts = [cover.organization, cover.project, cover.title].filter(Boolean);
    const headerText  = headerParts.join('  |  ');

    const logoSrc = await getBrandLogo(selectedModel);
    const reportImages = {
      ...Object.fromEntries(selectedModel.imageIds.map(id => [id, logoSrc])),
      ...images,
    };

    // Parse markdown content to React PDF elements
    const elements = parseToPdfElements(content || '', reportImages, selectedModel.theme);

    // Build and render PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(ReportDocument, { coverData: cover, elements, headerText, logoSrc, theme: selectedModel.theme })
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
