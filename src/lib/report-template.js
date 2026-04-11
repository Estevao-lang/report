import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
} from 'docx';

// ============ COLOR PALETTE ============
export const C = {
  primary:   '1A3C5E', accent:    '2E86C1', success:   '27AE60', warning:   'F39C12',
  danger:    'E74C3C', lightBg:   'EBF5FB', lightGray: 'F8F9FA', medGray:   'E9ECEF',
  dark:      '2C3E50', border:    'BDC3C7', white:     'FFFFFF',
  warningBg: 'FEF9E7', dangerBg:  'FDEDEC', successBg: 'EAFAF1',
};

// ============ LAYOUT CONSTANTS ============
export const W = 9360; // content width (US Letter, 1" margins)
const bdr      = { style: BorderStyle.SINGLE, size: 1, color: C.border };
const borders  = { top: bdr, bottom: bdr, left: bdr, right: bdr };
const noBdr    = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBdr, bottom: noBdr, left: noBdr, right: noBdr };
const pad      = { top: 80, bottom: 80, left: 120, right: 120 };

// ============ HELPERS ============
export const txt  = (t, o = {}) => new TextRun({ text: t, font: 'Arial', size: 20, color: C.dark, ...o });
export const code = (t)         => new TextRun({ text: t, font: 'Courier New', size: 20, color: C.accent });

export const p       = (t)    => new Paragraph({ spacing: { after: 120 }, children: [txt(t)] });
export const pMulti  = (runs) => new Paragraph({ spacing: { after: 120 }, children: runs });

export const sec = (n, t) => new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 },
  children: [new TextRun({ text: `${n}. ${t}`, bold: true, font: 'Arial', size: 32, color: C.primary })],
});
export const sub = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 },
  children: [new TextRun({ text: t, bold: true, font: 'Arial', size: 26, color: C.accent })],
});
export const h3 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 80 },
  children: [new TextRun({ text: t, bold: true, font: 'Arial', size: 22, color: C.primary })],
});

export const bullet      = (t)    => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 60 }, children: [txt(t)] });
export const bulletMulti = (runs) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 60 }, children: runs });
export const numItem     = (t)    => new Paragraph({ numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80 }, children: [txt(t)] });
export const numItemMulti = (runs) => new Paragraph({ numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80 }, children: runs });
export const checkItem   = (t)    => new Paragraph({ numbering: { reference: 'checks',  level: 0 }, spacing: { after: 50 }, children: [txt(t)] });

export const spacer    = (s = 200) => new Paragraph({ spacing: { after: s }, children: [] });
export const divider   = ()        => new Paragraph({
  spacing: { before: 200, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.medGray } },
  children: [],
});
export const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

// ─── Table cells ───────────────────────────────────────────────────────────
const hCell = (t, w) => new TableCell({
  borders, width: { size: w, type: WidthType.DXA },
  shading: { fill: C.primary, type: ShadingType.CLEAR }, margins: pad, verticalAlign: 'center',
  children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: C.white, font: 'Arial', size: 20 })] })],
});
const dCell = (content, w, o = {}) => {
  const runs = Array.isArray(content) ? content : [txt(content, { color: o.color || C.dark })];
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: { fill: o.fill || C.white, type: ShadingType.CLEAR }, margins: pad, verticalAlign: 'center',
    children: [new Paragraph({ alignment: o.align || AlignmentType.LEFT, children: runs })],
  });
};

// Cover metadata row (no borders)
const metaRow = (label, value) => new TableRow({
  children: [
    new TableCell({
      borders: noBorders, width: { size: 2600, type: WidthType.DXA }, margins: pad,
      children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, font: 'Arial', size: 20, color: C.primary })] })],
    }),
    new TableCell({
      borders: noBorders, width: { size: 6760, type: WidthType.DXA }, margins: pad,
      children: [new Paragraph({ children: [txt(value)] })],
    }),
  ],
});

// ─── Alert boxes ───────────────────────────────────────────────────────────
const alertStyles = {
  warning: { fill: C.warningBg, b: C.warning },
  danger:  { fill: C.dangerBg,  b: C.danger  },
  info:    { fill: C.lightBg,   b: C.accent  },
  success: { fill: C.successBg, b: C.success },
};

export const alertBox = (text, type = 'warning') => {
  const s  = alertStyles[type] || alertStyles.warning;
  const ab = { style: BorderStyle.SINGLE, size: 2, color: s.b };
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: ab, bottom: ab, left: { style: BorderStyle.SINGLE, size: 12, color: s.b }, right: ab },
      shading: { fill: s.fill, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      children: [new Paragraph({ children: [new TextRun({ text, font: 'Arial', size: 20, color: C.dark, bold: true })] })],
    })] })],
  });
};

export const alertBoxMulti = (runs, type = 'warning') => {
  const s  = alertStyles[type] || alertStyles.warning;
  const ab = { style: BorderStyle.SINGLE, size: 2, color: s.b };
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: ab, bottom: ab, left: { style: BorderStyle.SINGLE, size: 12, color: s.b }, right: ab },
      shading: { fill: s.fill, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      children: [new Paragraph({ children: runs })],
    })] })],
  });
};

// ─── Code block ────────────────────────────────────────────────────────────
export const codeBlock = (lines) => {
  const ch = lines.map(l => new Paragraph({
    spacing: { after: 0 },
    children: [new TextRun({ text: l || ' ', font: 'Courier New', size: 17, color: C.dark })],
  }));
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [new TableRow({ children: [new TableCell({
      borders,
      shading: { fill: 'F4F6F7', type: ShadingType.CLEAR },
      width: { size: W, type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      children: ch,
    })] })],
  });
};

// ─── Quick table builder ───────────────────────────────────────────────────
export const buildTable = (headers, rows, columnWidths) => {
  const headerRow = new TableRow({ children: headers.map((h, i) => hCell(h, columnWidths[i])) });
  const dataRows  = rows.map((row, i) => new TableRow({
    children: row.map((cell, j) => dCell(cell, columnWidths[j], { fill: i % 2 === 0 ? C.lightGray : C.white })),
  }));
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths, rows: [headerRow, ...dataRows] });
};

// ─── Cover page ────────────────────────────────────────────────────────────
export const cover = ({ kind, title, subtitle, meta }) => [
  spacer(600),
  new Paragraph({ spacing: { after: 80 },  children: [txt(kind, { bold: true, color: C.accent })] }),
  new Paragraph({ spacing: { after: 20 },  children: [new TextRun({ text: title,    font: 'Arial', size: 48, bold: true, color: C.primary })] }),
  new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: subtitle, font: 'Arial', size: 28, color: C.accent })] }),
  divider(),
  new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [2600, 6760],
    rows: meta.map(([k, v]) => metaRow(k, v)),
  }),
  spacer(200),
  pageBreak(),
];

// ─── Document builder ──────────────────────────────────────────────────────
export const buildDoc = ({ headerText, children }) => new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 20, color: C.dark } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: C.primary },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial', color: C.accent },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, font: 'Arial', color: C.primary },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [
        { level: 0, format: LevelFormat.BULLET,  text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET,  text: '\u25E6', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
      ] },
      { reference: 'numbers', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ] },
      { reference: 'checks', levels: [
        { level: 0, format: LevelFormat.BULLET,  text: '\u2714', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size:   { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [txt(headerText, { size: 16, color: C.border, italics: true })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            txt('Prepared for Internal Review  |  Page ', { size: 16, color: C.border }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: C.border }),
          ],
        })],
      }),
    },
    children,
  }],
});

export { Packer };
