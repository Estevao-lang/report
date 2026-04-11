// Example: how to use report-template.js
// Run: node example-report.js
const {
  C, txt, code, p, pMulti, sec, sub, h3,
  bullet, bulletMulti, numItemMulti, checkItem,
  spacer, divider, pageBreak,
  buildTable, alertBox, alertBoxMulti, codeBlock,
  cover, buildDoc, save,
} = require("./report-template");

const doc = buildDoc({
  // Header that appears on every page (top-right, italic gray)
  headerText: "SnaveUK  |  My Project  |  My Report Title",

  children: [
    // ============ COVER PAGE ============
    ...cover({
      kind: "Technical Report",         // accent label above title
      title: "My Report Title",          // big primary title
      subtitle: "Subtitle goes here",    // accent subtitle
      meta: [
        ["Project:", "My Project Name"],
        ["Organization:", "SnaveUK"],
        ["Date:", "April 2026"],
        ["Developer:", "Estev\u00E3o Oliveira"],
      ],
    }),

    // ============ SECTION 1 ============
    sec("1", "Introduction"),
    p("This is a regular paragraph. Use p() for plain text."),
    pMulti([
      txt("Use pMulti() when you need "),
      txt("bold text", { bold: true }),
      txt(" or "),
      code("inline_code"),
      txt(" mixed in a paragraph."),
    ]),

    spacer(100),
    sub("Sub-section heading"),
    bullet("A simple bullet point"),
    bullet("Another bullet"),
    bulletMulti([txt("A bullet with "), code("code_in_it"), txt(" inside")]),

    spacer(100),
    h3("A smaller heading"),
    numItemMulti([txt("First numbered item")]),
    numItemMulti([txt("Second numbered item")]),

    pageBreak(),

    // ============ SECTION 2 — TABLES ============
    sec("2", "Tables"),
    p("Use buildTable(headers, rows, columnWidths). Widths must sum to 9360."),
    spacer(40),
    buildTable(
      ["Component", "Status", "Notes"],     // headers
      [                                      // rows
        ["Auth", "Done", "Working in production"],
        ["API", "In Progress", "BMI endpoint live"],
        ["Frontend", "Pending", "Waiting on design"],
      ],
      [3120, 2340, 3900]                     // column widths (must sum to 9360)
    ),

    spacer(200),

    // ============ SECTION 3 — ALERTS ============
    sec("3", "Alert Boxes"),
    alertBox("This is a warning alert (yellow).", "warning"),
    spacer(40),
    alertBox("This is a danger alert (red).", "danger"),
    spacer(40),
    alertBox("This is an info alert (blue).", "info"),
    spacer(40),
    alertBox("This is a success alert (green).", "success"),
    spacer(40),
    alertBoxMulti([
      txt("Alerts can also have "),
      txt("bold", { bold: true }),
      txt(" or "),
      code("code"),
      txt(" inside."),
    ], "info"),

    pageBreak(),

    // ============ SECTION 4 — CODE BLOCKS ============
    sec("4", "Code Blocks"),
    p("Use codeBlock(arrayOfLines) for multi-line code or diagrams:"),
    spacer(20),
    codeBlock([
      "function example() {",
      "  return 'hello world';",
      "}",
    ]),

    spacer(60),
    sub("ASCII Diagrams"),
    codeBlock([
      "User \u2192 API Gateway \u2192 Lambda \u2192 DynamoDB",
      "                  \u2193",
      "              CloudWatch",
    ]),

    spacer(200),

    // ============ SECTION 5 — CHECKLIST ============
    sec("5", "Checklist (\u2714 marks)"),
    checkItem("First completed item"),
    checkItem("Second completed item"),
    checkItem("Third completed item"),

    spacer(200),
    divider(),
    spacer(100),
    new (require("docx").Paragraph)({
      alignment: require("docx").AlignmentType.CENTER,
      children: [txt("End of Report", { italics: true, color: C.border })],
    }),
  ],
});

save(doc, "My_Report.docx");
