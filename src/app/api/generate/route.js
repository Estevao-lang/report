import { buildDoc, cover as buildCover, spacer, divider, pMulti, txt, C, Packer } from '@/lib/report-template';
import { parseContent } from '@/lib/text-parser';

export async function POST(request) {
  try {
    const body = await request.json();
    const { cover, content } = body;

    if (!cover?.title?.trim()) {
      return Response.json({ error: 'O título do relatório é obrigatório.' }, { status: 400 });
    }

    // Build cover metadata rows (only non-empty fields)
    const meta = [
      cover.project      && ['Projeto:',      cover.project],
      cover.organization && ['Organização:',  cover.organization],
      cover.date         && ['Data:',         cover.date],
      cover.author       && ['Autor:',        cover.author],
    ].filter(Boolean);

    // Header text for every page
    const headerParts = [cover.organization, cover.project, cover.title].filter(Boolean);
    const headerText  = headerParts.join('  |  ');

    // Parse body content
    const bodyElements = parseContent(content || '');

    // End-of-report footer element
    const { AlignmentType } = await import('docx');
    const endLine = new (await import('docx')).Paragraph({
      alignment: AlignmentType.CENTER,
      children: [txt('— Fim do Relatório —', { italics: true, color: C.border })],
    });

    const children = [
      ...buildCover({
        kind:     cover.kind     || 'Relatório',
        title:    cover.title,
        subtitle: cover.subtitle || '',
        meta,
      }),
      ...bodyElements,
      spacer(200),
      divider(),
      spacer(100),
      endLine,
    ];

    const doc    = buildDoc({ headerText, children });
    const buffer = await Packer.toBuffer(doc);

    const safeFilename = cover.title
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\s_-]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 80) || 'relatorio';

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${safeFilename}.docx"`,
        'Content-Length':      String(buffer.length),
      },
    });
  } catch (err) {
    console.error('[generate]', err);
    return Response.json({ error: err.message || 'Erro interno ao gerar o relatório.' }, { status: 500 });
  }
}
