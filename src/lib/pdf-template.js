import React from 'react';
import { Document, Image, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// ── Color palette ──────────────────────────────────────────────────────────
export const C = {
  primary:   '#4B4F54',
  accent:    '#C92234',
  success:   '#27AE60',
  warning:   '#F39C12',
  danger:    '#E74C3C',
  dark:      '#2F3438',
  border:    '#A7ADB2',
  white:     '#FFFFFF',
  lightGray: '#F8F9FA',
  medGray:   '#E3E5E7',
  warningBg: '#FEF9E7',
  dangerBg:  '#FDEDEC',
  successBg: '#EAFAF1',
  lightBg:   '#FFF1F3',
};

// US Letter: 612 × 792 pt.  1" margins → content = 468 × 648 pt.
export const PAGE_W  = 468;   // content width
export const PAGE_PW = 612;   // full page width

// ── Styles ─────────────────────────────────────────────────────────────────
export const s = StyleSheet.create({
  page: {
    fontFamily:    'Helvetica',
    fontSize:       10,
    color:          C.dark,
    paddingTop:     72,
    paddingBottom:  80,
    paddingLeft:    72,
    paddingRight:   72,
    backgroundColor: C.white,
  },

  // ── Fixed header/footer
  // Use left:0 + width:PAGE_PW to avoid yoga computing width from right constraint.
  // (right-only or left+right without explicit width causes -8.26e+21 overflow in yoga v4)
  pageHeader: {
    position:    'absolute',
    top:          24,
    left:          0,
    width:        PAGE_PW,
    paddingRight:  72,
    textAlign:   'right',
    fontSize:      8,
    color:         C.border,
    fontFamily:   'Helvetica-Oblique',
  },
  pageHeaderLogo: {
    position: 'absolute',
    top:       18,
    left:      72,
    width:     72,
    height:    24,
    objectFit: 'contain',
    opacity:    0.38,
  },
  pageFooter: {
    position:  'absolute',
    bottom:     24,
    left:        0,
    width:      PAGE_PW,
    textAlign: 'center',
    fontSize:    8,
    color:       C.border,
  },

  // ── Cover ───────────────────────────────────────────────────────────────
  coverLogo: {
    width:        168,
    height:        54,
    objectFit: 'contain',
    marginBottom:  18,
  },
  brandBar: {
    width:            112,
    height:             3,
    backgroundColor: C.accent,
    marginBottom:     34,
  },
  coverKind: {
    fontSize:     11,
    color:        C.accent,
    fontFamily:  'Helvetica-Bold',
    marginBottom: 10,
  },
  coverTitle: {
    fontSize:     30,
    color:        C.primary,
    fontFamily:  'Helvetica-Bold',
    marginBottom:  6,
    lineHeight:   1.15,
  },
  coverSubtitle: {
    fontSize:     15,
    color:        C.dark,
    marginBottom: 16,
  },
  coverDivider: {
    borderBottomWidth: 1.5,
    borderBottomColor: C.medGray,
    marginBottom: 14,
    marginTop:     4,
  },
  // Explicit width prevents flex:1 child from triggering yoga overflow
  coverMetaRow: {
    flexDirection:     'row',
    width:             PAGE_W,
    paddingVertical:    4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
  },
  coverMetaKey: {
    width:      130,
    fontFamily: 'Helvetica-Bold',
    color:      C.primary,
    fontSize:    10,
  },
  coverMetaVal: {
    flex:     1,
    color:    C.dark,
    fontSize: 10,
  },

  // ── Headings ────────────────────────────────────────────────────────────
  h1: {
    fontFamily:   'Helvetica-Bold',
    fontSize:      18,
    color:         C.accent,
    marginTop:     20,
    marginBottom:   8,
    lineHeight:    1.2,
  },
  h2: {
    fontFamily:   'Helvetica-Bold',
    fontSize:      14,
    color:         C.primary,
    marginTop:     16,
    marginBottom:   6,
  },
  h3: {
    fontFamily:   'Helvetica-Bold',
    fontSize:      11,
    color:         C.primary,
    marginTop:     10,
    marginBottom:   4,
  },

  // ── Body ────────────────────────────────────────────────────────────────
  body: {
    fontSize:     10,
    color:        C.dark,
    marginBottom:  5,
    lineHeight:    1.5,
  },

  // ── Lists — explicit width prevents yoga overflow on flex:1 child ────────
  bulletRow:     { flexDirection: 'row', width: PAGE_W, marginBottom: 4, paddingLeft: 14 },
  bulletMarker:  { width: 14, fontSize: 10, color: C.dark, lineHeight: 1.5 },
  bulletContent: { flex: 1,   fontSize: 10, color: C.dark, lineHeight: 1.5 },

  numRow:        { flexDirection: 'row', width: PAGE_W, marginBottom: 4, paddingLeft: 14 },
  numMarker:     { width: 20, fontSize: 10, color: C.dark, lineHeight: 1.5 },
  numContent:    { flex: 1,   fontSize: 10, color: C.dark, lineHeight: 1.5 },

  checkRow:      { flexDirection: 'row', width: PAGE_W, marginBottom: 3, paddingLeft: 14 },
  checkMarker:   { width: 14, fontSize: 10, color: C.success, lineHeight: 1.5 },
  checkContent:  { flex: 1,   fontSize: 10, color: C.dark,    lineHeight: 1.5 },

  // ── Alert boxes ─────────────────────────────────────────────────────────
  alertBox:     { width: PAGE_W, marginBottom: 8, padding: 8 },
  alertWarning: { backgroundColor: C.warningBg, borderLeftWidth: 3, borderLeftColor: C.warning },
  alertDanger:  { backgroundColor: C.dangerBg,  borderLeftWidth: 3, borderLeftColor: C.danger  },
  alertInfo:    { backgroundColor: C.lightBg,   borderLeftWidth: 3, borderLeftColor: C.accent  },
  alertSuccess: { backgroundColor: C.successBg, borderLeftWidth: 3, borderLeftColor: C.success },
  alertText:         { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  alertTextWarning:  { color: '#7D4E00' },
  alertTextDanger:   { color: '#7B0D05' },
  alertTextInfo:     { color: '#154360' },
  alertTextSuccess:  { color: '#145A32' },

  // ── Code block ──────────────────────────────────────────────────────────
  codeBlock: {
    width:           PAGE_W,
    backgroundColor: '#F4F6F7',
    padding:          8,
    marginBottom:     8,
  },
  codeLine: {
    fontFamily: 'Courier',
    fontSize:    8.5,
    color:       C.dark,
    lineHeight:  1.4,
  },

  // ── Table — cell widths are set explicitly at render time ────────────────
  table:       { width: PAGE_W, marginBottom: 10 },
  tableRow:    { flexDirection: 'row', width: PAGE_W },
  tableRowAlt: { backgroundColor: C.lightGray },
  tableCellH:  { backgroundColor: C.primary, borderWidth: 0.5, borderColor: C.border },
  tableCell:   { borderWidth: 0.5, borderColor: C.border },
  tableCellTextH: { fontFamily: 'Helvetica-Bold', color: C.white },
  tableCellText:  { color: C.dark },

  // ── Blockquote ──────────────────────────────────────────────────────────
  blockquote: {
    width:            PAGE_W,
    backgroundColor: '#F0F6FB',
    borderLeftWidth:  3,
    borderLeftColor:  C.accent,
    padding:          10,
    paddingLeft:      14,
    marginTop:         4,
    marginBottom:     10,
  },
  blockquoteText:  { fontSize: 10, color: C.dark,    lineHeight: 1.55, marginBottom: 3 },
  blockquoteLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.primary, marginBottom: 4 },

  // Images
  imageWrap: {
    width:        PAGE_W,
    marginTop:     6,
    marginBottom: 12,
  },
  reportImage: {
    width:     PAGE_W,
    maxHeight: 320,
    objectFit: 'contain',
  },
  imageCaption: {
    fontSize:   8.5,
    color:      C.border,
    fontFamily: 'Helvetica-Oblique',
    textAlign:  'center',
    marginTop:   4,
  },

  // ── Misc ────────────────────────────────────────────────────────────────
  divider: {
    width:             PAGE_W,
    borderBottomWidth: 1,
    borderBottomColor: C.medGray,
    marginTop:         10,
    marginBottom:      10,
  },
  spacer:  { marginBottom: 8 },
  endLine: {
    width:      PAGE_W,
    textAlign: 'center',
    fontSize:   10,
    color:      C.border,
    fontFamily: 'Helvetica-Oblique',
    marginTop:  20,
  },
});

// ── Main Document component ────────────────────────────────────────────────
export function ReportDocument({ coverData, elements, headerText, logoSrc }) {
  const meta = [
    coverData.project      && ['Project:',      coverData.project],
    coverData.organization && ['Organization:', coverData.organization],
    coverData.date         && ['Date:',         coverData.date],
    coverData.author       && ['Author:',       coverData.author],
  ].filter(Boolean);

  return (
    <Document
      title={coverData.title || 'Report'}
      author={coverData.author || coverData.organization || undefined}
      subject={coverData.subtitle || coverData.project || undefined}
      creator="My Reports"
      producer="My Reports"
    >
      {/* ── Page 1: Cover (no header/footer) ───────────────────────────── */}
      <Page size="LETTER" style={s.page}>
        <View style={{ marginTop: 90, marginBottom: 32 }}>
          {logoSrc ? <Image src={logoSrc} style={s.coverLogo} /> : null}
          <View style={s.brandBar} />
          <Text style={s.coverKind}>{coverData.kind || 'Technical Report'}</Text>
          <Text style={s.coverTitle}>{coverData.title}</Text>
          {!!coverData.subtitle && (
            <Text style={s.coverSubtitle}>{coverData.subtitle}</Text>
          )}
        </View>

        <View style={s.coverDivider} />

        {meta.map(([k, v], idx) => (
          <View key={idx} style={s.coverMetaRow}>
            <Text style={s.coverMetaKey}>{k}</Text>
            <Text style={s.coverMetaVal}>{v}</Text>
          </View>
        ))}
      </Page>

      {/* ── Pages 2+: Body — auto-expands as content grows ─────────────── */}
      <Page size="LETTER" style={s.page}>

        {/* Header: left:0, width:PAGE_PW — yoga resolves width without right constraint */}
        {logoSrc ? <Image src={logoSrc} style={s.pageHeaderLogo} fixed /> : null}

        <Text
          style={s.pageHeader}
          fixed
          render={() => headerText}
        />

        {/* Footer: same pattern — centered via textAlign on full-page-width element */}
        <Text
          style={s.pageFooter}
          fixed
          render={({ pageNumber }) =>
            `Prepared for Internal Review  |  Page ${pageNumber - 1}`
          }
        />

        {elements}

        <View style={s.divider} />
        <Text style={s.endLine}>— End of Report —</Text>

      </Page>
    </Document>
  );
}
