# How to Use Meus Relatórios

Generate professional PDFs by pasting text with simple formatting.

---

## 1. Fill in the Cover

In the left sidebar, fill in the fields:

| Field         | Required    | Example                  |
|---------------|-------------|--------------------------|
| Document type | No          | `Technical Report`       |
| Title         | **Yes**     | `AWS Maintenance Report` |
| Subtitle      | No          | `Q1 2026 Summary`        |
| Project       | No          | `Infra Migration`        |
| Organization  | No          | `SnaveUK`                |
| Author        | No          | `John Smith`             |
| Date          | No          | `April 2026`             |

---

## 2. Write the Content

Paste or type in the main field using the syntax below.

### Headings

```
# Main heading (h1)
## Subheading (h2)
### Minor heading (h3)
```

### Lists

```
- simple bullet item
- another item

1. first numbered item
2. second numbered item

- [x] completed task
- [x] another task
```

### Tables

**Option 1 — Paste directly from Notion or Google Sheets:**

Select the table in Notion/Sheets, copy (`Ctrl+C`) and paste into the field.
Columns are separated by Tab automatically.

**Option 2 — Pipe format (markdown):**

```
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| value    | value    | value    |
| value    | value    | value    |
```

### Callout Boxes

```
> [info] Informational text in blue
> [warning] Attention — yellow background
> [danger] Critical error — red background
> [success] Operation completed — green background
```

### Code Block

````
```
function example() {
  return 'result';
}
```
````

### Inline Formatting

```
**bold**
`inline code`
```

### Dividers and Page Breaks

```
---      ← horizontal divider
===      ← page break (new page in the PDF)
```

---

## 3. Generate the PDF

Click **Gerar Relatório (PDF)**.

The file is downloaded automatically with a name based on the title you filled in.

---

## Tips

- **Tables from Notion/Sheets**: copy and paste directly — it works automatically
- **Tables from PDFs or web pages**: use the pipe format `| col | col |`
- **Emojis** like ✅ ⏳ 🔴 are converted to text equivalents (`[✓]`, `[!]`, etc.)
- **ALL-CAPS** lines are automatically treated as headings
- Lines ending with `:` like `Actions Taken:` become subheadings in the PDF
- The counter at the bottom of the field shows characters and lines in real time

---

## Full Example

```
# AWS Maintenance Report

## Overview
This document summarizes the maintenance window performed on April 2026.

Actions Taken:
- [x] Database backup completed
- [x] Security patches applied
- [x] Load balancer reconfigured

## Affected Services

| Service      | Status  | Downtime |
|--------------|---------|----------|
| API Gateway  | OK      | 0 min    |
| Auth Service | OK      | 5 min    |
| Database     | OK      | 12 min   |

> [warning] The auth service restart caused a brief token invalidation window.

===

# Appendix

## Raw Logs

```
[2026-04-10 02:00] Maintenance window started
[2026-04-10 02:12] Database backup complete
[2026-04-10 04:30] Maintenance window closed
```
```
