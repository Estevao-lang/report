import {
  txt, code, p, pMulti,
  sec, sub, h3,
  bullet, bulletMulti,
  numItem, numItemMulti,
  checkItem,
  spacer, divider, pageBreak,
  alertBox, codeBlock,
} from './report-template.js';

// ─── Inline formatter: **bold** and `code` ─────────────────────────────────
function parseInline(text) {
  const parts = [];
  let i = 0;
  let buf = '';

  while (i < text.length) {
    // **bold**
    if (text[i] === '*' && text[i + 1] === '*') {
      if (buf) { parts.push(txt(buf)); buf = ''; }
      i += 2;
      let boldText = '';
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
        boldText += text[i++];
      }
      i += 2;
      if (boldText) parts.push(txt(boldText, { bold: true }));
    }
    // `code`
    else if (text[i] === '`') {
      if (buf) { parts.push(txt(buf)); buf = ''; }
      i++;
      let codeText = '';
      while (i < text.length && text[i] !== '`') {
        codeText += text[i++];
      }
      i++;
      if (codeText) parts.push(code(codeText));
    }
    else {
      buf += text[i++];
    }
  }

  if (buf) parts.push(txt(buf));
  return parts.length > 0 ? parts : [txt(text)];
}

// ─── Paragraph with optional inline formatting ─────────────────────────────
function para(text) {
  const runs = parseInline(text);
  return runs.length === 1 && !text.includes('**') && !text.includes('`')
    ? p(text)
    : pMulti(runs);
}

// ─── Main parser ───────────────────────────────────────────────────────────
export function parseContent(content) {
  if (!content || !content.trim()) return [];

  const lines    = content.split('\n');
  const elements = [];
  let sectionCount = 0;
  let i = 0;

  while (i < lines.length) {
    const raw  = lines[i];
    const line = raw.trimEnd();

    // ── Code block ````...```` ──────────────────────────────────────────────
    if (/^```/.test(line.trim())) {
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(codeBlock(codeLines));
      continue;
    }

    // ── Headings ────────────────────────────────────────────────────────────
    if (/^#{3}\s+/.test(line)) {
      elements.push(h3(line.replace(/^#{3}\s+/, '').trim()));
      i++; continue;
    }
    if (/^#{2}\s+/.test(line)) {
      elements.push(sub(line.replace(/^#{2}\s+/, '').trim()));
      i++; continue;
    }
    if (/^#\s+/.test(line)) {
      sectionCount++;
      elements.push(sec(String(sectionCount), line.replace(/^#\s+/, '').trim()));
      i++; continue;
    }

    // ── Alert boxes ─────────────────────────────────────────────────────────
    const alertMatch = line.match(/^>\s*\[(warning|danger|info|success)\]\s*(.*)/i);
    if (alertMatch) {
      elements.push(alertBox(alertMatch[2].trim(), alertMatch[1].toLowerCase()));
      elements.push(spacer(40));
      i++; continue;
    }

    // ── Page break ===  ─────────────────────────────────────────────────────
    if (/^={3,}$/.test(line.trim())) {
      elements.push(pageBreak());
      i++; continue;
    }

    // ── Divider --- ─────────────────────────────────────────────────────────
    if (/^-{3,}$/.test(line.trim()) || /^\*{3,}$/.test(line.trim())) {
      elements.push(divider());
      i++; continue;
    }

    // ── Checklist - [x] or ✓ ────────────────────────────────────────────────
    if (/^[-*]\s+\[[ xX✓]\]\s+/.test(line) || /^✓\s+/.test(line)) {
      const text = line
        .replace(/^[-*]\s+\[[ xX✓]\]\s+/, '')
        .replace(/^✓\s+/, '')
        .trim();
      elements.push(checkItem(text));
      i++; continue;
    }

    // ── Bullet - item ────────────────────────────────────────────────────────
    if (/^[-*]\s+/.test(line)) {
      const text = line.replace(/^[-*]\s+/, '').trim();
      const runs = parseInline(text);
      elements.push(
        runs.length > 1 ? bulletMulti(runs) : bullet(text)
      );
      i++; continue;
    }

    // ── Numbered list 1. item ────────────────────────────────────────────────
    if (/^\d+\.\s+/.test(line)) {
      const text = line.replace(/^\d+\.\s+/, '').trim();
      const runs = parseInline(text);
      elements.push(
        runs.length > 1 ? numItemMulti(runs) : numItem(text)
      );
      i++; continue;
    }

    // ── Empty line → small spacer ────────────────────────────────────────────
    if (line.trim() === '') {
      // Avoid stacking many spacers
      const prev = elements[elements.length - 1];
      const prevIsSpace = prev && prev.constructor && prev.constructor.name === 'Paragraph'
        && prev.properties && prev.properties.spacing;
      if (!prevIsSpace) elements.push(spacer(120));
      i++; continue;
    }

    // ── Regular paragraph ────────────────────────────────────────────────────
    elements.push(para(line.trim()));
    i++;
  }

  return elements;
}
