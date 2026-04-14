import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { s, C, PAGE_W } from './pdf-template.js';

// ── Inline formatter: **bold**, *italic*, `code` ───────────────────────────
function parseInline(text) {
  if (!text) return '';
  if (!text.includes('**') && !text.includes('*') && !text.includes('`')) return text;

  const parts = [];
  let i = 0, buf = '', key = 0;

  while (i < text.length) {
    // **bold**
    if (text[i] === '*' && text[i + 1] === '*') {
      if (buf) { parts.push(buf); buf = ''; }
      i += 2;
      let bold = '';
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) bold += text[i++];
      if (text[i] === '*') i += 2;
      if (bold) parts.push(
        <Text key={key++} style={{ fontFamily: 'Helvetica-Bold' }}>{bold}</Text>
      );
    }
    // *italic* (single star)
    else if (text[i] === '*' && text[i + 1] !== '*') {
      if (buf) { parts.push(buf); buf = ''; }
      i++;
      let ital = '';
      while (i < text.length && text[i] !== '*') ital += text[i++];
      if (text[i] === '*') i++;
      if (ital) parts.push(
        <Text key={key++} style={{ fontFamily: 'Helvetica-Oblique' }}>{ital}</Text>
      );
    }
    // `code`
    else if (text[i] === '`') {
      if (buf) { parts.push(buf); buf = ''; }
      i++;
      let codeStr = '';
      while (i < text.length && text[i] !== '`') codeStr += text[i++];
      if (text[i] === '`') i++;
      if (codeStr) parts.push(
        <Text key={key++} style={{ fontFamily: 'Courier', color: C.accent, fontSize: 9 }}>{codeStr}</Text>
      );
    }
    else buf += text[i++];
  }

  if (buf) parts.push(buf);
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

// ── Table renderer ─────────────────────────────────────────────────────────
// Uses explicit point widths (not flex:1) to prevent yoga overflow errors
// on large documents with many tables.
function renderTable(tableLines, key) {
  const contentRows = tableLines.filter(l =>
    l.replace(/\|/g, '').replace(/[\s\-:]/g, '').length > 0
  );
  if (contentRows.length < 1) return null;

  const parseRow = (line) =>
    line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());

  const headers  = parseRow(contentRows[0]);
  const dataRows = contentRows.slice(1).map(parseRow);

  // Explicit column width — avoids unbounded flex in yoga layout engine
  const colW       = Math.floor(PAGE_W / headers.length);
  const isWide     = headers.length > 3;
  const cellFs     = isWide ? 8 : 9;
  const cellPad    = isWide ? 4 : 5;

  return (
    <View key={key} style={s.table}>
      {/* Header row */}
      <View style={s.tableRow} wrap={false}>
        {headers.map((h, ci) => (
          <View key={ci} style={[s.tableCellH, { width: colW, padding: cellPad }]}>
            <Text style={[s.tableCellTextH, { fontSize: cellFs }]}>{parseInline(h)}</Text>
          </View>
        ))}
      </View>
      {/* Data rows */}
      {dataRows.map((row, ri) => (
        <View key={ri} style={[s.tableRow, ri % 2 === 0 ? s.tableRowAlt : {}]} wrap={false}>
          {row.map((cell, ci) => (
            <View key={ci} style={[s.tableCell, { width: colW, padding: cellPad }]}>
              <Text style={[s.tableCellText, { fontSize: cellFs }]}>{parseInline(cell)}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// ── Blockquote renderer ────────────────────────────────────────────────────
function renderBlockquote(bqLines, key) {
  const textLines = bqLines
    .map(l => l.replace(/^>\s?/, '').trim())
    .filter(l => l.length > 0);

  return (
    <View key={key} style={s.blockquote}>
      {textLines.map((t, li) => (
        <Text key={li} style={li === 0 && t.startsWith('**') ? s.blockquoteLabel : s.blockquoteText}>
          {parseInline(t)}
        </Text>
      ))}
    </View>
  );
}

// ── Alert style map ────────────────────────────────────────────────────────
const alertStyleMap = {
  warning: { box: s.alertWarning, text: s.alertTextWarning },
  danger:  { box: s.alertDanger,  text: s.alertTextDanger  },
  info:    { box: s.alertInfo,    text: s.alertTextInfo    },
  success: { box: s.alertSuccess, text: s.alertTextSuccess },
};

// ── Main parser ────────────────────────────────────────────────────────────
export function parseToPdfElements(content) {
  if (!content?.trim()) return [];

  const lines = content.split('\n');
  const elements = [];
  let sectionCount = 0;
  let numCount = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    // ── Code block ```...``` ───────────────────────────────────────────────
    if (/^```/.test(line.trim())) {
      const lang = line.trim().replace(/^```/, '').trim(); // e.g. "bash", "python"
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <View key={`code-${i}`} style={s.codeBlock}>
          {lang ? (
            <Text style={{ ...s.codeLine, color: C.border, marginBottom: 2 }}>{lang}</Text>
          ) : null}
          {codeLines.map((cl, ci) => (
            <Text key={ci} style={s.codeLine}>{cl || ' '}</Text>
          ))}
        </View>
      );
      numCount = 0;
      continue;
    }

    // ── Markdown tables |...|...|─────────────────────────────────────────
    if (/^\|/.test(line)) {
      const tableLines = [];
      while (i < lines.length && /^\|/.test(lines[i].trimEnd())) {
        tableLines.push(lines[i].trimEnd());
        i++;
      }
      const tbl = renderTable(tableLines, `tbl-${i}`);
      if (tbl) elements.push(tbl);
      numCount = 0;
      continue;
    }

    // ── Alert boxes > [type] ──────────────────────────────────────────────
    const alertMatch = line.match(/^>\s*\[(warning|danger|info|success)\]\s*(.*)/i);
    if (alertMatch) {
      const type   = alertMatch[1].toLowerCase();
      const text   = alertMatch[2].trim();
      const aStyle = alertStyleMap[type] || alertStyleMap.warning;
      elements.push(
        <View key={`alert-${i}`} style={[s.alertBox, aStyle.box]}>
          <Text style={[s.alertText, aStyle.text]}>{parseInline(text)}</Text>
        </View>
      );
      numCount = 0; i++; continue;
    }

    // ── Blockquote > text (non-alert) ─────────────────────────────────────
    if (/^>/.test(line)) {
      const bqLines = [];
      while (i < lines.length && /^>/.test(lines[i].trimEnd())) {
        bqLines.push(lines[i].trimEnd());
        i++;
      }
      elements.push(renderBlockquote(bqLines, `bq-${i}`));
      numCount = 0;
      continue;
    }

    // ── Headings ──────────────────────────────────────────────────────────
    if (/^#{3}\s+/.test(line)) {
      elements.push(
        <Text key={`h3-${i}`} style={s.h3}>{line.replace(/^#{3}\s+/, '').trim()}</Text>
      );
      numCount = 0; i++; continue;
    }
    if (/^#{2}\s+/.test(line)) {
      elements.push(
        <Text key={`h2-${i}`} style={s.h2}>{line.replace(/^#{2}\s+/, '').trim()}</Text>
      );
      numCount = 0; i++; continue;
    }
    if (/^#\s+/.test(line)) {
      sectionCount++;
      elements.push(
        <Text key={`h1-${i}`} style={s.h1}>{`${sectionCount}. ${line.replace(/^#\s+/, '').trim()}`}</Text>
      );
      numCount = 0; i++; continue;
    }

    // ── Page break === ────────────────────────────────────────────────────
    if (/^={3,}$/.test(line.trim())) {
      elements.push(<View key={`pb-${i}`} break />);
      numCount = 0; i++; continue;
    }

    // ── Divider --- ───────────────────────────────────────────────────────
    if (/^-{3,}$/.test(line.trim()) || /^\*{3,}$/.test(line.trim())) {
      elements.push(<View key={`div-${i}`} style={s.divider} />);
      numCount = 0; i++; continue;
    }

    // ── Checklist - [x] ───────────────────────────────────────────────────
    if (/^[-*]\s+\[[ xX✓]\]\s+/.test(line) || /^✓\s+/.test(line)) {
      const text = line.replace(/^[-*]\s+\[[ xX✓]\]\s+/, '').replace(/^✓\s+/, '').trim();
      elements.push(
        <View key={`check-${i}`} style={s.checkRow}>
          <Text style={s.checkMarker}>✓</Text>
          <Text style={s.checkContent}>{parseInline(text)}</Text>
        </View>
      );
      i++; continue;
    }

    // ── Bullet - item ─────────────────────────────────────────────────────
    if (/^[-*]\s+/.test(line)) {
      numCount = 0;
      const text = line.replace(/^[-*]\s+/, '').trim();
      elements.push(
        <View key={`bul-${i}`} style={s.bulletRow}>
          <Text style={s.bulletMarker}>•</Text>
          <Text style={s.bulletContent}>{parseInline(text)}</Text>
        </View>
      );
      i++; continue;
    }

    // ── Numbered 1. item ──────────────────────────────────────────────────
    if (/^\d+\.\s+/.test(line)) {
      numCount++;
      const text = line.replace(/^\d+\.\s+/, '').trim();
      elements.push(
        <View key={`num-${i}`} style={s.numRow}>
          <Text style={s.numMarker}>{numCount}.</Text>
          <Text style={s.numContent}>{parseInline(text)}</Text>
        </View>
      );
      i++; continue;
    }

    // ── Empty line ────────────────────────────────────────────────────────
    if (line.trim() === '') {
      const last = elements[elements.length - 1];
      // Skip double-spacers
      if (last && last.props?.style !== s.spacer) {
        elements.push(<View key={`sp-${i}`} style={s.spacer} />);
      }
      i++; continue;
    }

    // ── Regular paragraph ─────────────────────────────────────────────────
    numCount = 0;
    elements.push(
      <Text key={`p-${i}`} style={s.body}>{parseInline(line.trim())}</Text>
    );
    i++;
  }

  return elements;
}
