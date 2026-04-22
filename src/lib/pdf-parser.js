import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { s, C, PAGE_W } from './pdf-template.js';

// ── Emoji cleaner ──────────────────────────────────────────────────────────
// Helvetica has no emoji glyphs — react-pdf outputs garbled chars.
// Replace common emojis with ASCII equivalents, strip the rest.
const EMOJI_SUBS = [
  [/✅/gu,  '[✓]'],  [/☑/gu,    '[✓]'],
  [/❌/gu,  '[✗]'],  [/🚫/gu,   '[✗]'],
  [/⏳/gu,  ''],     [/🕐/gu,   ''],
  [/⚠\uFE0F?/gu, '[!]'],
  // Color circles — use ASCII so Helvetica can render them
  [/🔴/gu,  '[!]'],  [/🟠/gu,  '[!]'],
  [/🟡/gu,  '[~]'],  [/🟢/gu,  '[+]'],  [/🔵/gu,  '[i]'],
  [/🚨/gu,  '[!]'],  [/📌/gu,  ''],     [/📋/gu,  ''],
  // Geometric shape chars that Helvetica cannot render → safe ASCII
  [/●/gu,   '*'],    [/○/gu,   '-'],
  [/■/gu,   '[*]'],  [/□/gu,   '[ ]'],
  [/▲/gu,   '^'],    [/▼/gu,   'v'],
  [/\uFE0F/gu, ''],               // variation selector
  [/\u200D/gu, ''],               // ZWJ
  [/[\u{1F000}-\u{1FFFF}]/gu, ''],  // all emoji blocks
  [/[\u{2300}-\u{23FF}]/gu, ''],    // misc technical (⏳ etc)
  [/[\u{2600}-\u{26FF}]/gu, ''],    // misc symbols (⚠ etc)
  // Geometric Shapes block — Helvetica has none of these
  [/[\u{2500}-\u{25FF}]/gu, ''],
  // Dingbats — keep ✓ (2713) and ✗ (2717), strip rest
  [/[\u{2700}-\u{2712}]/gu, ''],
  [/[\u{2714}-\u{2716}]/gu, ''],
  [/[\u{2718}-\u{27BF}]/gu, ''],
];

function cleanEmoji(text) {
  if (!text) return text;
  let t = text;
  for (const [re, rep] of EMOJI_SUBS) t = t.replace(re, rep);
  return t;
}

// ── Inline formatter: **bold**, *italic*, `code` ───────────────────────────
function parseInline(text) {
  if (!text) return '';
  text = cleanEmoji(text);
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

// ── Heading heuristic ─────────────────────────────────────────────────────
// Distinguishes "1. Executive Summary" (heading) from "1. install the package" (list).
// Treats as heading when: text is ≤ 9 words, no sentence-ending punctuation,
// first word starts uppercase, and ≥ 50 % of significant words are Title Case.
function looksLikeHeading(text) {
  if (!text) return false;
  if (text.length > 90) return false;
  if (/[.!?]$/.test(text.trimEnd())) return false;           // ends like a sentence
  const words = text.trim().split(/\s+/);
  if (words.length > 9) return false;
  if (!words[0] || !/^[A-Z]/.test(words[0])) return false;  // must start uppercase
  const sig = words.filter(w => w.length > 3 && /^[a-zA-Z]/.test(w));
  if (sig.length === 0) return true;                          // only short words → treat as title
  const capRatio = sig.filter(w => /^[A-Z]/.test(w)).length / sig.length;
  return capRatio >= 0.5;
}

// ── Main parser ────────────────────────────────────────────────────────────
export function parseToPdfElements(content) {
  if (!content?.trim()) return [];

  // Clean emoji before line-by-line parsing (prevents garbled characters)
  const lines = cleanEmoji(content).split('\n');
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

    // ── TSV tables (tab-separated, copied from Notion / Sheets / GitHub) ──
    if (line.includes('\t')) {
      const tsvRows = [];
      while (i < lines.length && lines[i].trimEnd().includes('\t')) {
        tsvRows.push(lines[i].trimEnd().split('\t').map(c => c.trim()));
        i++;
      }
      // Build pipe-table lines so renderTable can handle them uniformly
      const pipeLines = tsvRows.map(cols => '| ' + cols.join(' | ') + ' |');
      // Insert a separator row after the header so renderTable treats row 0 as header
      if (pipeLines.length > 1) {
        const colCount = tsvRows[0].length;
        pipeLines.splice(1, 0, '| ' + Array(colCount).fill('---').join(' | ') + ' |');
      }
      const tbl = renderTable(pipeLines, `tbl-tsv-${i}`);
      if (tbl) elements.push(tbl);
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

    // ── Numbered heading or numbered list item ────────────────────────────
    if (/^\d+\.\s+/.test(line)) {
      const text = line.replace(/^\d+\.\s+/, '').trim();
      if (looksLikeHeading(text)) {
        // Treat as a section heading (h2 style)
        sectionCount++;
        elements.push(
          <Text key={`nh2-${i}`} style={s.h2}>{text}</Text>
        );
        numCount = 0;
      } else {
        numCount++;
        elements.push(
          <View key={`num-${i}`} style={s.numRow}>
            <Text style={s.numMarker}>{numCount}.</Text>
            <Text style={s.numContent}>{parseInline(text)}</Text>
          </View>
        );
      }
      i++; continue;
    }

    // ── Label line: "Short phrase:" alone on a line → styled as h3 ─────────
    // Catches "Affected Accounts:", "Actions Taken:", "Timeline:", etc.
    // Rule: starts with a letter, no internal colon, ends with colon, ≤ 60 chars
    if (/^[A-Za-zÀ-ÿ][^:\n]{0,58}:$/.test(line.trim())) {
      elements.push(
        <Text key={`lbl-${i}`} style={s.h3}>{line.trim()}</Text>
      );
      numCount = 0; i++; continue;
    }

    // ── ALL-CAPS line → treat as h2 ───────────────────────────────────────
    // Catches "AWS MAINTENANCE REPORT", "ENVIRONMENT=dev" is in a code block so safe
    // Rule: ≥ 5 chars, all uppercase letters/numbers/spaces/punctuation, no lowercase
    {
      const t = line.trim();
      if (t.length >= 5 && !/[a-z]/.test(t) && /^[A-Z0-9\s\-—&/().,:!]+$/.test(t)) {
        elements.push(
          <Text key={`caps-${i}`} style={s.h2}>{t}</Text>
        );
        numCount = 0; i++; continue;
      }
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
