# Auto-Format Feature

**Report Type:** Feature Documentation
**Project:** My Reports — PDF Generator
**Date:** October 2026
**Author:** Estevao Lang

---

## Overview

The Auto-Format feature was added to allow users who are unfamiliar with Markdown to write their report content in plain, unstructured text and have it automatically converted into well-structured Markdown ready for PDF generation.

A single click replaces the raw input with formatted content — headings, bullet lists, numbered lists, bold terms, and tables — without requiring the user to know any Markdown syntax.

---

## Problem Solved

Previously, the content field required users to write in Markdown. This created a barrier for non-technical users who wanted to generate professional reports but did not know the syntax.

**Before Auto-Format:**
- User had to manually write `# Heading`, `- list item`, `**bold**`
- Mistakes in syntax led to malformed PDFs
- No assistance for plain text input

**After Auto-Format:**
- User writes naturally in plain text
- Clicks **Auto-format** and the AI structures the content
- The formatted Markdown is placed back in the field, ready to preview and download

---

## How It Works

### User Flow

1. User types or pastes plain text into the content field
2. Clicks the **Auto-format** button (top-right of the content area)
3. A loading spinner appears with the label **Formatting…**
4. The content field is replaced with structured Markdown
5. User reviews, adjusts if needed, then clicks **Preview Report**

### Technical Flow

```
Browser → POST /api/format → Groq API → formatted Markdown → content field
```

1. The frontend sends the raw text to the `/api/format` route
2. The route fetches the list of available models from the Groq API
3. It filters for chat-capable models (context window ≥ 8192, excludes guard/embed/whisper/tts/vision models)
4. It selects the model with the largest context window available
5. Sends the text with a structured prompt to the Groq chat completions endpoint
6. Returns the formatted Markdown to the frontend

---

## Files Changed

### New file — `src/app/api/format/route.js`

Server-side API route that handles the formatting request.

Key implementation details:

- Dynamically discovers available models via `GET /openai/v1/models`
- Filters models using a regex exclusion pattern: `guard|embed|whisper|tts|vision|tool`
- Requires `context_window >= 8192` to ensure the model can handle full report content
- Sorts candidates by `context_window` descending — picks the most capable model available
- Uses `temperature: 0.3` for consistent, predictable formatting output
- Returns raw Markdown — the prompt explicitly instructs the model not to wrap output in code blocks

### Modified file — `src/app/page.js`

Two changes to the UI layer:

- Added `formatting` state (boolean) to track the loading state of the Auto-format call
- Added `autoFormat()` async function that calls `/api/format` and updates the content state
- Added the **Auto-format** button UI above the textarea with:
  - Disabled state when content is empty or a request is in progress
  - Animated spinner icon during the API call
  - Lightning bolt icon when idle

### New file — `.env.local` (gitignored)

Stores the `GROQ_API_KEY` locally. This file is excluded from version control via `.gitignore` and must be configured separately in each environment.

---

## Environment Configuration

| Environment | How to configure |
|---|---|
| Local development | Add `GROQ_API_KEY=gsk_...` to `.env.local` |
| Vercel (production) | Add via Settings → Environment Variables |

> The key is never committed to the repository. Any deployment without this variable will return a `GROQ_API_KEY not configured` error when Auto-format is used.

---

## Model Selection Strategy

The Groq model catalog changes over time — models get deprecated or renamed. To avoid hardcoding a model name that may stop working, the route queries the live catalog on every request and selects the best available option automatically.

**Selection criteria (in order):**

1. Exclude non-chat models: guard, embed, whisper, tts, vision, tool
2. Require context window ≥ 8,192 tokens
3. Sort by context window descending
4. Use the first result

This approach survived three model deprecations during development (`llama-3.1-8b-instant`, `llama3-8b-8192`, `llama-3.3-70b-versatile`) and automatically adapted without any code changes.

---

## Prompt Design

The model receives the following instructions alongside the user's text:

- Use `#`, `##`, `###` for section hierarchy
- Convert enumerated items into Markdown lists
- Bold important terms and labels with `**bold**`
- Convert `Key: Value` patterns into tables or definition lists
- Preserve all original content — do not summarize or remove anything
- Return raw Markdown only — no code block wrapper, no commentary

---

## Limitations

- **Requires internet connection** — the feature calls an external API and will not work offline
- **Requires valid Groq API key** — free at [console.groq.com](https://console.groq.com)
- **One model fetch per request** — the model list is fetched on every call; a future improvement could cache it
- **Not reversible from the UI** — once Auto-format replaces the content, the original plain text is gone (browser undo works as a workaround)
