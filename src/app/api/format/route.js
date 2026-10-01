export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text?.trim()) {
      return Response.json({ error: 'No text provided.' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'GROQ_API_KEY not configured.' }, { status: 500 });
    }

    const prompt = `Convert the following plain text into well-structured Markdown for a professional report.

Rules:
- Use # for main sections, ## for subsections, ### for sub-subsections
- Convert lists or enumerated items into proper Markdown lists (- or 1.)
- Use **bold** for important terms or labels
- If you see "Key: Value" patterns, convert them to a Markdown table or definition list
- Preserve the original meaning and all content — do not summarize or remove anything
- Do not wrap the output in a code block — return raw Markdown only
- Do not add any commentary, just the formatted Markdown

Plain text to convert:
${text}`;

    // Fetch available models and pick the best chat model
    const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!modelsRes.ok) throw new Error('Could not fetch Groq models list.');
    const modelsData = await modelsRes.json();

    const EXCLUDE = /guard|embed|whisper|tts|vision|tool/i;
    const chatModels = (modelsData.data || [])
      .filter(m => !EXCLUDE.test(m.id) && (m.context_window || 0) >= 8192)
      .sort((a, b) => (b.context_window || 0) - (a.context_window || 0));

    const model = chatModels[0]?.id;
    if (!model) throw new Error('No suitable chat model available on this Groq account.');
    console.log('[format] using model:', model);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Groq API error ${res.status}`);
    }

    const data = await res.json();
    const formatted = data.choices?.[0]?.message?.content?.trim();

    if (!formatted) throw new Error('Empty response from Groq.');

    return Response.json({ formatted });
  } catch (err) {
    console.error('[format]', err);
    return Response.json({ error: err.message || 'Internal error.' }, { status: 500 });
  }
}
