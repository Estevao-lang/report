'use client';

import { useState } from 'react';

const SYNTAX_GUIDE = [
  { syntax: '# Título',               desc: 'Seção principal (auto-numerada)' },
  { syntax: '## Subtítulo',           desc: 'Subseção' },
  { syntax: '### Menor',              desc: 'Título menor (h3)' },
  { syntax: '- item',                 desc: 'Bullet point' },
  { syntax: '1. item',                desc: 'Lista numerada' },
  { syntax: '- [x] item',             desc: 'Checklist ✓' },
  { syntax: '> [info] texto',         desc: 'Caixa info/warning/danger/success' },
  { syntax: '```...```',              desc: 'Bloco de código (multi-linha)' },
  { syntax: '**negrito** `código`',   desc: 'Formatação inline' },
  { syntax: '---',                    desc: 'Divisória horizontal' },
  { syntax: '===',                    desc: 'Quebra de página' },
];

const COVER_FIELDS = [
  { key: 'kind',         label: 'Tipo de documento', placeholder: 'Relatório Técnico' },
  { key: 'title',        label: 'Título *',           placeholder: 'Título do Relatório' },
  { key: 'subtitle',     label: 'Subtítulo',          placeholder: 'Descrição breve' },
  { key: 'project',      label: 'Projeto',            placeholder: 'Nome do Projeto' },
  { key: 'organization', label: 'Organização',        placeholder: 'SnaveUK' },
  { key: 'author',       label: 'Autor',              placeholder: 'Seu nome' },
  { key: 'date',         label: 'Data',               placeholder: 'Abril 2026' },
];

function todayLabel() {
  return new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export default function HomePage() {
  const [cover, setCover] = useState({
    kind:         'Relatório Técnico',
    title:        '',
    subtitle:     '',
    project:      '',
    organization: 'SnaveUK',
    author:       '',
    date:         todayLabel(),
  });
  const [content,     setContent]     = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [showGuide,   setShowGuide]   = useState(false);
  const [downloaded,  setDownloaded]  = useState(false);

  const updateCover = (key, value) => setCover(prev => ({ ...prev, [key]: value }));

  const handleGenerate = async () => {
    if (!cover.title.trim()) { setError('O título do relatório é obrigatório.'); return; }
    if (!content.trim())     { setError('O conteúdo do relatório está vazio.');  return; }
    setError('');
    setLoading(true);
    setDownloaded(false);

    try {
      const res = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ cover, content }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `Erro ${res.status}`);
      }

      const blob     = await res.blob();
      const url      = URL.createObjectURL(blob);
      const filename = cover.title.replace(/[^a-zA-Z0-9À-ÿ\s_-]/g, '').replace(/\s+/g, '_') || 'relatorio';
      const a        = document.createElement('a');
      a.href         = url;
      a.download     = `${filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-[#1A3C5E] shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight leading-tight">
              Meus Relatórios
            </h1>
            <p className="text-[#5DADE2] text-sm mt-0.5">
              Cole o texto → baixe o <span className="font-semibold">PDF</span> profissional
            </p>
          </div>
          <span className="hidden sm:block text-xs text-slate-400 border border-slate-600 rounded px-2 py-1 font-mono">
            SnaveUK Template
          </span>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">

          {/* ── Cover sidebar ──────────────────────────────────────────────── */}
          <aside className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 xl:sticky xl:top-6">
              <h2 className="text-sm font-semibold text-[#1A3C5E] uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
                Capa do Relatório
              </h2>

              <div className="space-y-3">
                {COVER_FIELDS.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                    <input
                      type="text"
                      value={cover[key]}
                      onChange={e => updateCover(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50
                                 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent
                                 placeholder:text-slate-300 transition"
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Content area ───────────────────────────────────────────────── */}
          <section className="xl:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#1A3C5E] uppercase tracking-widest">
                  Conteúdo do Relatório
                </h2>
                <button
                  onClick={() => setShowGuide(g => !g)}
                  className="text-xs text-[#2E86C1] hover:text-[#1A3C5E] font-medium transition"
                >
                  {showGuide ? '▲ Ocultar sintaxe' : '▼ Ver sintaxe'}
                </button>
              </div>

              {/* Syntax guide */}
              {showGuide && (
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-100 border-b border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Sintaxe suportada</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                    {SYNTAX_GUIDE.map(({ syntax, desc }, idx) => (
                      <div
                        key={idx}
                        className="flex items-baseline gap-3 px-4 py-2 border-b border-slate-100 last:border-0"
                      >
                        <code className="text-xs font-mono text-[#2E86C1] whitespace-nowrap flex-shrink-0">{syntax}</code>
                        <span className="text-xs text-slate-500">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Textarea */}
              <textarea
                value={content}
                onChange={e => { setContent(e.target.value); setDownloaded(false); }}
                placeholder={`Cole ou escreva o conteúdo aqui...\n\nExemplo:\n# Introdução\nEscreva o texto do relatório.\n\n## Subseção\n- Bullet point\n- Outro item com **negrito**\n\n> [info] Uma nota informativa.\n\n1. Item numerado\n2. Outro item\n\n- [x] Tarefa concluída\n\n===\n\n# Segunda Seção\n\`\`\`\nfunction exemplo() {\n  return 'código aqui';\n}\n\`\`\``}
                className="w-full h-[460px] px-4 py-3 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50
                           focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent
                           resize-y placeholder:text-slate-300 placeholder:font-sans leading-relaxed transition"
                spellCheck={false}
              />

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-400 font-mono">
                  {content.length > 0 ? `${content.length} caracteres · ${content.split('\n').length} linhas` : ''}
                </span>
                {downloaded && (
                  <span className="text-xs text-green-600 font-medium">✓ Arquivo baixado com sucesso!</span>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span className="text-red-500">⚠</span> {error}
              </div>
            )}

            {/* Generate button */}
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="
                  inline-flex items-center gap-2 px-8 py-3
                  bg-[#1A3C5E] hover:bg-[#2E86C1]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-white font-semibold text-sm rounded-xl
                  shadow-md hover:shadow-lg
                  transition-all duration-200
                "
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Gerando relatório…
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Gerar Relatório (PDF)
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center text-xs text-slate-400">
          SnaveUK Report Template · Cole o texto, receba o PDF profissional
        </div>
      </footer>

    </div>
  );
}
