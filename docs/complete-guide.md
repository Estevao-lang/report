# What is Markdown — and Why We Use It

## A Brief History

Markdown was created in 2004 by **John Gruber** (the blogger behind Daring Fireball) in collaboration with Aaron Swartz. The name is a play on the word "markup" — as in HTML markup — but deliberately inverted. Where HTML *marks up* text with complex tags like `<h1>`, `<strong>`, or `<p>`, Markdown marks text *down* to the simplest possible notation.

The original goal was to produce a writing format that reads naturally as plain text, but converts cleanly to HTML (and later to PDF, Word, and dozens of other formats) without any visual editor getting in the way.

## The Core Idea

Markdown is not a program. It is a **convention** — a set of rules that say: if you type `**this**`, that means bold. If you type `# Title`, that is a heading. If you type `- item`, that is a bullet point.

The beauty of this is that even before the text is rendered, it is perfectly readable. You do not need a special app to read a Markdown file. Open it in Notepad, Sublime Text, VS Code, or any terminal — and it still reads like a normal document.

## Why We Use Markdown for Reports

There are several strong reasons to write reports in Markdown rather than Word, Google Docs, or PowerPoint:

### 1. Separation of content from design

When you write in Word, every decision you make — font, size, spacing, colour — is embedded in the file. Change one style and the whole document shifts unpredictably. Markdown separates **what you write** from **how it looks**. The design is handled by the template; you just write the content.

### 2. Speed

There is no reaching for the mouse to click Bold. You type `**word**` and keep going. Experienced Markdown writers produce structured documents significantly faster than in traditional editors.

### 3. Portability

A Markdown file is plain text. It opens on any device, any operating system, any decade. It can be version-controlled in Git, diffed line by line, and read in a terminal. A `.docx` file from 2003 is already painful to open; a Markdown file from 2003 is perfectly readable today.

### 4. Consistent output

When you use a report template like this one, every document generated from Markdown looks identical in quality and layout — fonts, spacing, heading hierarchy, table style. There is no "almost" formatting or one document that drifted from the standard.

### 5. Paste-and-go workflow

You can copy a table from Google Sheets, paste it directly, and the report handles it. You can paste raw text from a meeting notes doc and add structure with a few `#` characters and bullet points. No reformatting required.

---

# Markdown Syntax — Complete Reference

## Headings

Headings are created with the `#` symbol. The number of `#` symbols sets the level.

```
# Heading 1    ← main section title
## Heading 2   ← subsection
### Heading 3  ← minor heading within a subsection
```

> [info] In this report platform, every `# Heading 1` is automatically numbered (1., 2., 3. ...) in the generated PDF. You do not need to number them manually.

---

## Text Formatting

```
**bold text**
*italic text*
`inline code or monospace`
```

Use **bold** for important labels, values, or callouts. Use `inline code` for file names, commands, variable names, or any technical string.

---

## Lists

### Bullet lists

```
- First item
- Second item
  - Sub-item (indent with two spaces)
  - Another sub-item
- Third item
```

### Numbered lists

```
1. First step
2. Second step
3. Third step
```

### Checklists

```
- [x] Task completed
- [x] Another done item
- [ ] Pending task
- [ ] Not started yet
```

Checklists are useful for action item summaries, sprint reviews, audit reports, and delivery checklists. Completed items show a check mark in the PDF.

---

## Tables

Tables are one of the most powerful features for technical reports. There are two ways to create them.

### Option 1 — Pipe format (Markdown standard)

```
| Column A     | Column B    | Column C  |
|--------------|-------------|-----------|
| Row 1 data   | More data   | Value     |
| Row 2 data   | More data   | Value     |
```

The separator row (`|---|---|---|`) tells the renderer that the first row is the header. Column widths adjust automatically based on content.

### Option 2 — Paste directly from Google Sheets or Notion

Select a table in Google Sheets or Notion, copy with `Ctrl+C`, and paste directly into the content field. The app detects tab-separated values (TSV) and renders them as a proper table automatically. No reformatting needed.

> [warning] Tables copied from PDFs or web pages may not paste cleanly as TSV. For those, use the pipe format above.

---

## Callout Boxes

Callout boxes draw attention to important information. They use a blockquote (`>`) followed by a tag in square brackets.

```
> [info] Informational note — rendered with a blue background.
> [warning] Caution or attention needed — yellow background.
> [danger] Critical error, blocker, or security risk — red background.
> [success] Positive outcome, completion, or confirmation — green background.
```

Use callout boxes sparingly — they lose impact if overused. Reserve `[danger]` for genuine blockers or security issues, and `[success]` for confirmed outcomes only.

---

## Code Blocks

Use triple backticks to wrap multi-line code, configuration, log output, or any preformatted text.

````
```
function greet(name) {
  return "Hello, " + name;
}
```
````

Everything inside a code block is rendered in a monospace font and preserves whitespace exactly. You can also specify a language label (it appears as a small label in the PDF):

````
```javascript
const x = 42;
```
````

---

## Horizontal Dividers and Page Breaks

```
---    ← horizontal rule (thin line across the page)
===    ← page break (forces a new page in the PDF)
```

Use `---` to separate major sections within a page. Use `===` when you want to force a new page — for example, before an appendix or a section that should always start fresh.

---

## Images

If you upload images through the platform's image uploader, the syntax is:

```
![Caption text](image:filename)
```

Where `filename` matches the name of the file you uploaded. The app inserts this syntax automatically when you click **Insert** on an uploaded image.

---

## Special Behaviours in This Platform

Beyond standard Markdown, this platform adds several extensions:

### ALL-CAPS lines become headings

Any line written entirely in uppercase letters (minimum 5 characters) is treated as an `h2`-level heading in the PDF. This is useful when pasting content from systems like Jira, Confluence, or email threads that use all-caps section names.

```
AWS MAINTENANCE WINDOW — APRIL 2026
```

Becomes a section heading automatically.

### Lines ending with a colon become subheadings

A short phrase ending in `:` on its own line is rendered as an `h3`-level heading.

```
Actions Taken:
Affected Services:
Root Cause:
```

### Numbered lines in Title Case become section headings

```
1. Executive Summary
2. Technical Analysis
3. Recommendations
```

Because these are Title Case (each significant word capitalised), the platform treats them as section headings rather than numbered list items.

---

# Architecture Diagrams

This platform supports three types of visual architecture diagrams written directly in text.

## Three-Column Architecture Overview (`:::arch`)

Renders a platform diagram with external services on the left and right, and the core platform in the centre — similar to a standard infrastructure overview slide.

```
:::arch
left: Twilio SMS | Mailgun Email
center: User Auth | API Backend | Database
right: Stripe Payments | AWS S3
infra: AWS EC2 | AWS RDS | AWS Elasticache | AWS CloudFront
:::
```

Lines use the format `role: Item One | Item Two`. Roles are `left`, `center`, `right`, and `infra`. The `infra` section renders as a grey infrastructure layer below the three columns.

---

## Horizontal Pipeline (`:::flow`)

Renders a left-to-right pipeline with labelled stages — useful for content ingestion, CI/CD, or data processing flows.

```
:::flow
step: Web UI
step: CloudFront
step: S3 Storage
step: MediaConvert
step: Distribution
sub: Ingest | Store | Transcode | Deliver
:::
```

Each `step:` becomes a box. The optional `sub:` row adds green labels below each box.

---

## Vertical Flow Diagram (`:::vflow`)

Renders a top-to-bottom architecture diagram with colour-coded nodes — useful for request lifecycle diagrams, order flows, or system layer overviews.

```
:::vflow
single: React SPA | Vite build | neutral
arrow:
single: CloudFront + WAF | CDN and DDoS protection | neutral
arrow:
pair: API Gateway REST | Auth, user routes | blue :: API Gateway WebSocket | Live data feed | blue
arrow:
single: EventBridge + SQS | Order queue | red
arrow:
triple: Aurora PostgreSQL | Users, trades | green :: ElastiCache Redis | Order book | green :: S3 | Static assets | green
:::
```

**Node types:**
- `single:` — one full-width centred box
- `pair:` — two boxes side by side, separated by `::`
- `triple:` — three boxes side by side, separated by `::`
- `arrow:` — a vertical connector between rows

**Colours:** `neutral` · `blue` · `purple` · `red` · `orange` · `green`

Each node follows the format: `Label | Subtitle | color`

---

# How to Use the My Reports Platform

## Step 1 — Open the App

Navigate to the app in your browser. You will see two main areas:

- **Left sidebar** — the cover panel (report metadata)
- **Main area** — the content editor

---

## Step 2 — Select a Report Model

At the top of the left sidebar, choose a **Report model** from the dropdown. Each model applies a different company logo, colour palette, and page header automatically.

| Model | Company | Primary Colour |
|-------|---------|---------------|
| Snave UK Ltd | SnaveUK | Red accent |
| MAIA / Maitrics | Maitrics | Indigo blue |
| Me Ve Um Site | Me Ve Um Site | Bright blue |

> [info] You never need to insert the company logo yourself. The selected model places it on the cover page and in the header of every subsequent page automatically.

---

## Step 3 — Fill in the Cover Fields

| Field | Required | Description |
|-------|----------|-------------|
| Document type | No | e.g. Technical Report, Platform Architecture, Commercial Proposal |
| Title | **Yes** | The main title — required to generate or preview the PDF |
| Subtitle | No | Short description below the title |
| Project | No | Project or product name |
| Organization | No | Auto-filled from the selected model |
| Author | No | Author name |
| Date | No | e.g. July 2026 |

---

## Step 4 — Write or Paste Your Content

Click inside the large text area on the right. You can:

- Type directly using Markdown syntax
- Paste raw text and add formatting
- Paste a table from Google Sheets or Notion directly
- Click **Show syntax** (top-right of the content area) to see a built-in reference table

The counter at the bottom of the field shows the number of characters and lines in real time.

---

## Step 5 — Upload Images (Optional)

In the **Images** section above the content editor:

1. Click **Upload images**
2. Select one or more PNG, JPG, or WebP files
3. Each image appears as a thumbnail with an **Insert** and a **remove (X)** button
4. Click **Insert** to add the image at the current position in the content

The syntax `![caption](image:filename)` is inserted automatically. You can edit the caption freely.

> [warning] Do not manually add the company logo to the content. If detected, the app will display a warning and offer a button to remove it.

---

## Step 6 — Preview the Report

Click **Preview Report**. The app renders the full PDF in the browser using the exact same engine that will generate the final file. This is your opportunity to:

- Check heading hierarchy and section numbering
- Verify table column widths
- Review image placement and captions
- Confirm page breaks fall where you expect
- Check that callout boxes use the right colour for the context

If anything needs fixing, click **Edit report** to return to the editor.

---

## Step 7 — Download the PDF

When the preview looks correct, click **Download PDF**. The file is generated on the server and downloaded automatically. The filename is based on the report title you entered.

---

# Full Example — Ready to Paste

The following block is a complete working example. Copy everything between the dashed lines and paste it into the content field to see the platform in action.

---

```
# Executive Summary

This report documents the April 2026 infrastructure maintenance window performed on the SnaveUK production environment.

All planned tasks were completed within the scheduled window. One minor service interruption was recorded and resolved within the SLA threshold.

---

# Affected Services

| Service | Status | Downtime |
|---------|--------|----------|
| API Gateway | Operational | 0 min |
| Auth Service | Operational | 5 min |
| Aurora PostgreSQL | Operational | 12 min |
| ElastiCache Redis | Operational | 0 min |
| S3 / CloudFront | Operational | 0 min |

> [warning] The Auth Service restart caused a brief session token invalidation window. Users active during this window were logged out automatically.

---

# Actions Completed

- [x] Pre-maintenance snapshot of Aurora cluster taken
- [x] Security patches applied to all EC2 instances
- [x] Load balancer health checks confirmed post-patch
- [x] Auth Service restarted and session store flushed
- [x] Full smoke test suite passed
- [ ] Post-maintenance penetration test — scheduled for next sprint

---

# System Architecture

:::vflow
single: CloudFront + WAF | CDN, DDoS protection | neutral
arrow:
single: Auth Service (Lambda) | Sessions, JWT, Google OAuth | blue
arrow:
pair: API Gateway REST | Core API routes | blue :: API Gateway WebSocket | Live data feed | blue
arrow:
single: EventBridge + SQS | Async event queue | red
arrow:
triple: Aurora PostgreSQL | Primary database | green :: ElastiCache Redis | Cache layer | green :: S3 | Static assets | green
:::

===

# Appendix — Maintenance Log

```
[2026-04-10 02:00] Maintenance window opened
[2026-04-10 02:08] Aurora snapshot completed
[2026-04-10 02:15] EC2 patch cycle started (3 instances)
[2026-04-10 03:02] EC2 patch cycle completed
[2026-04-10 03:10] Auth Service restarted
[2026-04-10 03:15] Session store flushed — users logged out
[2026-04-10 03:22] Smoke tests passed
[2026-04-10 04:00] Maintenance window closed
```

> [success] All tasks completed successfully. No data loss. No SLA breach recorded.
```

---

# Frequently Asked Questions

**Do I need to know Markdown before using this app?**
No. The syntax guide inside the app (click **Show syntax**) covers everything you need. Most people pick it up in one session.

**Can I paste content from Word or Google Docs?**
Yes, but you will need to re-add formatting manually. Plain text pastes cleanly; rich text from Word or Docs loses its styling on paste (which is the point — you re-apply it in clean Markdown).

**What happens to emojis?**
Common emojis are converted to PDF-safe text equivalents: `✅ → [✓]`, `⚠️ → [!]`, `❌ → [✗]`. Unknown emojis are stripped to prevent rendering errors in the PDF engine.

**Can I force a page break?**
Yes — use `===` on its own line. Put it before sections that should always start on a new page, such as appendices or major report divisions.

**Why does my table look compressed?**
The app calculates column widths proportionally based on content length. Very long text in one column compresses others. Break long cell content across multiple rows, or shorten the text to improve balance.

**Is the title field required?**
Yes. The PDF cannot be generated or previewed without a title in the cover panel.

**Can I use this for commercial proposals, not just technical reports?**
Yes. The Document type field is a free-text label — set it to `Commercial Proposal`, `Statement of Work`, `Project Brief`, or anything that fits. The rest of the document adapts accordingly.
