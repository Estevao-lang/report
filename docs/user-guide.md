# What is Markdown

Markdown is a lightweight markup language created in 2004 by John Gruber. Its goal is simple: let you write formatted text using ordinary keyboard characters, without needing a visual editor or HTML.

Instead of clicking buttons to bold something, you write `**like this**`. Instead of selecting a heading from a menu, you write `# Like This`. The result is text that is easy to read even without being rendered — and that can be converted to HTML, PDF, Word, and other formats.

## Why use Markdown

- Easy to learn in under 10 minutes
- Works in any plain text editor
- Widely supported: GitHub, Notion, Discord, WhatsApp (partially), and this app
- Lets you focus on content, not formatting

## Essential Markdown syntax

### Headings

```
# Main heading (H1)
## Subheading (H2)
### Minor heading (H3)
```

### Text emphasis

```
**bold**
*italic*
`inline code`
```

### Lists

```
- Bullet item
- Another item
  - Sub-item (indented)

1. Numbered item
2. Second item
3. Third item
```

### Links and images

```
[Link text](https://example.com)
![Image caption](image:file-name)
```

### Tables

```
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data A   | Data B   | Data C   |
| Data D   | Data E   | Data F   |
```

### Callout boxes

```
> [info] Important information
> [warning] Pay attention to this
> [danger] Critical error or severe warning
> [success] Operation completed successfully
```

### Code blocks

```
\`\`\`
function example() {
  return "code block";
}
\`\`\`
```

---

# How to use My Reports

**My Reports** is a web application that transforms text written in Markdown into a professional PDF report, complete with a cover page, header, footer, and the visual identity of the selected company.

## Step-by-step guide

### 1. Choose a report model

In the left sidebar, under **Report Cover**, select the **Report model** field. The available options are:

| Model | Company | Accent color |
|-------|---------|--------------|
| Snave UK Ltd | SnaveUK | Red |
| MAIA / Maitrics | Maitrics | Indigo blue |
| Me Ve Um Site | Me Ve Um Site | Bright blue |

When you select a model, the app automatically applies the correct logo, color palette, and page header. You do not need to insert the logo manually into the content.

### 2. Fill in the cover fields

Still in the sidebar, fill in the cover fields:

- **Document type** — type of document (e.g. Technical Report, Commercial Proposal)
- **Title** — report title (required field)
- **Subtitle** — short description, displayed below the title
- **Project** — project name
- **Organization** — company name (auto-filled by the selected model)
- **Author** — author name
- **Date** — report date (e.g. July 2026)

### 3. Write the content in Markdown

In the main area, under **Report Content**, write or paste the report content using Markdown syntax. The app supports all the elements described above, plus some exclusive ones:

#### App-specific elements

| Syntax | Output |
|--------|--------|
| `===` | Forced page break |
| `---` | Horizontal divider |
| `> [info] text` | Blue info box |
| `> [warning] text` | Yellow warning box |
| `> [danger] text` | Red danger box |
| `> [success] text` | Green success box |
| `- [x] item` | Checklist with checkbox |
| `![Caption](image:name)` | Uploaded image with caption |
| `1. Title Case Heading` | Numbered heading (Title Case = section) |

#### Quick syntax reference inside the app

Click **Show syntax** in the top-right corner of the content area to display a reference table with all supported elements.

### 4. Add images to the report

- Click **Upload images** in the images section
- Select one or more image files (PNG, JPG, WebP)
- Uploaded images appear as thumbnails with an **Insert** button and a remove (X) button
- Click **Insert** to add the image to the content at the current position

The syntax inserted automatically is:

```
![file-name](image:image-id)
```

You can freely edit the caption (the text between `[` and `]`).

> [warning] Do not insert the company logo manually. It is added automatically by the selected model. If detected in the content, the app will show a warning with a button to remove it.

### 5. Preview before downloading

After filling in the cover and content, click **Preview Report**. The app will display a faithful preview of the PDF directly in the browser.

- Review the formatting, headings, tables, and images
- If you need to make corrections, click **Edit report** to go back to the editor
- When the result looks right, click **Download PDF**

### 6. Download the PDF

On the preview screen, click **Download PDF**. The file will be generated on the server and downloaded automatically with a name based on the report title.

---

# Quick syntax reference

## Structure of a typical report

```
# Executive Summary

Introductory text for the report.

## Background

Describe the project context here.

## Results

| Metric   | Value  |
|----------|--------|
| Visits   | 1,200  |
| Conversion | 3.4% |

> [success] The visits target was comfortably met.

## Next steps

- [x] Requirements gathering complete
- [x] Prototype approved
- [ ] Implementation in progress
- [ ] Quality testing

===

# Appendix

Additional information here.

\`\`\`
example code or technical data
\`\`\`
```

---

# Frequently asked questions

**Does the company logo appear automatically?**
Yes. When you select a model in the **Report model** field, the logo is inserted on the cover page and in the header of every page automatically.

**Can I use tables copied from Excel or Notion?**
Yes. The app supports Markdown-format tables (`| col | col |`) as well as tab-separated tables (TSV) pasted directly from Google Sheets or Notion.

**What happens to emojis in the text?**
The app converts emojis to PDF-safe equivalents, avoiding rendering issues.

**Can I force a page break?**
Yes. Use `===` on its own line to force a new page in the PDF.

**Is the report title required?**
Yes. The **Title** field on the cover is required. The preview button will not proceed without it.
