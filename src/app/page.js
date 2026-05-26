'use client';

import { useMemo, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { ReportDocument } from '@/lib/pdf-template';
import { parseToPdfElements } from '@/lib/pdf-parser';

const BRAND_LOGO = '/snave-uk-ltd-logo.png';

const SYNTAX_GUIDE = [
  { syntax: '# Heading',                 desc: 'Main section (auto-numbered)' },
  { syntax: '## Subheading',             desc: 'Subsection' },
  { syntax: '### Minor',                 desc: 'Smaller heading (h3)' },
  { syntax: '- item',                    desc: 'Bullet point' },
  { syntax: '1. item',                   desc: 'Numbered list (lowercase = item)' },
  { syntax: '1. Executive Summary',      desc: 'Numbered heading (Title Case = section)' },
  { syntax: '- [x] item',                desc: 'Checklist' },
  { syntax: '> [info] text',             desc: 'Info/warning/danger/success box' },
  { syntax: '| Col | Col |\\n|---|---|', desc: 'Pipe table (markdown)' },
  { syntax: 'Col\\tCol\\tCol',          desc: 'TSV table pasted from Notion/Sheets' },
  { syntax: '![Caption](image:name)',    desc: 'Uploaded image with caption' },
  { syntax: '```...```',                 desc: 'Code block (multi-line)' },
  { syntax: '**bold** `code`',           desc: 'Inline formatting' },
  { syntax: '---',                       desc: 'Horizontal divider' },
  { syntax: '===',                       desc: 'Page break' },
  { syntax: 'Emojis',                    desc: 'Converted to PDF-safe text' },
];

const COVER_FIELDS = [
  { key: 'kind',         label: 'Document type', placeholder: 'Technical Report' },
  { key: 'title',        label: 'Title *',        placeholder: 'Report Title' },
  { key: 'subtitle',     label: 'Subtitle',       placeholder: 'Brief description' },
  { key: 'project',      label: 'Project',        placeholder: 'Project name' },
  { key: 'organization', label: 'Organization',   placeholder: 'SnaveUK' },
  { key: 'author',       label: 'Author',         placeholder: 'Your name' },
  { key: 'date',         label: 'Date',           placeholder: 'April 2026' },
];

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function HomePage() {
  const [cover, setCover] = useState({
    kind:         'Technical Report',
    title:        '',
    subtitle:     '',
    project:      '',
    organization: 'SnaveUK',
    author:       '',
    date:         todayLabel(),
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [images, setImages] = useState({});
  const [showUpdates, setShowUpdates] = useState(true);

  const headerText = useMemo(
    () => [cover.organization, cover.project, cover.title].filter(Boolean).join('  |  '),
    [cover.organization, cover.project, cover.title]
  );
  const previewElements = useMemo(() => parseToPdfElements(content || '', images), [content, images]);

  const updateCover = (key, value) => {
    setCover(prev => ({ ...prev, [key]: value }));
    setDownloaded(false);
  };

  const validateReport = () => {
    if (!cover.title.trim()) {
      setError('The report title is required.');
      return false;
    }
    if (!content.trim()) {
      setError('The report content is empty.');
      return false;
    }
    return true;
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;

    const loadedImages = await Promise.all(files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
        name: file.name,
        src: reader.result,
      });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })));

    setImages(prev => {
      const next = { ...prev };
      loadedImages.forEach(image => { next[image.id] = image.src; });
      return next;
    });
    setDownloaded(false);
    event.target.value = '';
  };

  const insertImage = (id) => {
    const label = id.replace(/^\d+-/, '');
    const token = `\n\n![${label}](image:${id})\n\n`;
    setContent(prev => `${prev}${token}`);
    setDownloaded(false);
  };

  const handlePreview = () => {
    if (!validateReport()) return;
    setError('');
    setDownloaded(false);
    setPreviewMode(true);
  };

  const handleGenerate = async () => {
    if (!validateReport()) return;
    setError('');
    setLoading(true);
    setDownloaded(false);

    try {
      const res = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ cover, content, images }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `Error ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const filename = cover.title
        .replace(/[^a-zA-Z0-9\u00C0-\u024F\s_-]/g, '')
        .replace(/\s+/g, '_') || 'report';
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.pdf`;
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

  if (previewMode) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100">
        <header className="bg-[#1A3C5E] shadow-lg flex-shrink-0">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight leading-tight">Report Preview</h1>
              <p className="text-[#5DADE2] text-sm mt-0.5">Review the PDF before downloading the final report</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => { setPreviewMode(false); setDownloaded(false); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-500 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Edit report
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-[#EBF5FB] disabled:opacity-50 disabled:cursor-not-allowed text-[#1A3C5E] font-semibold text-sm rounded-lg shadow-md transition"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span className="text-red-500">!</span> {error}
            </div>
          )}
          {downloaded && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              File downloaded successfully.
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#1A3C5E] uppercase tracking-widest">{cover.title}</h2>
                <p className="text-xs text-slate-500">
                  {cover.organization || 'No organization'} {cover.project ? `| ${cover.project}` : ''}
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">{content.split('\n').length} lines</span>
            </div>
            <div className="h-[calc(100vh-220px)] min-h-[640px] bg-slate-200">
              <PDFViewer width="100%" height="100%" showToolbar>
                <ReportDocument coverData={cover} elements={previewElements} headerText={headerText} logoSrc={BRAND_LOGO} />
              </PDFViewer>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showUpdates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#1A3C5E] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#5DADE2]">New updates</p>
                  <h2 className="mt-1 text-xl font-bold text-white">Preview, images and Snave branding</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpdates(false)}
                  className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition"
                  aria-label="Close updates"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-[#1A3C5E]">Preview before download</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Fill the cover and content, then click <span className="font-semibold">Preview Report</span>. Review the PDF and use <span className="font-semibold">Download PDF</span> only when it looks right.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-[#1A3C5E]">Snave visual identity</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Reports now use the Snave logo on the cover, a red and grey palette, and a subtle transparent logo in the internal page header.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-[#1A3C5E]">Add images</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Use <span className="font-semibold">Upload images</span>, then click <span className="font-semibold">Insert</span>. The app adds the image syntax to your report automatically.
                </p>
                <code className="mt-3 block rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-[#2E86C1]">
                  ![Caption](image:file-name)
                </code>
              </div>

              <button
                type="button"
                onClick={() => setShowUpdates(false)}
                className="w-full rounded-xl bg-[#1A3C5E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2E86C1] transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-[#1A3C5E] shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight leading-tight">My Reports</h1>
            <p className="text-[#5DADE2] text-sm mt-0.5">
              Paste the text, preview it, then download a professional <span className="font-semibold">PDF</span>
            </p>
          </div>
          <span className="hidden sm:block text-xs text-slate-400 border border-slate-600 rounded px-2 py-1 font-mono">
            SnaveUK Template
          </span>
          <button
            type="button"
            onClick={() => setShowUpdates(true)}
            className="ml-3 hidden md:inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M12 18a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
            Updates
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          <aside className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 xl:sticky xl:top-6">
              <h2 className="text-sm font-semibold text-[#1A3C5E] uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
                Report Cover
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
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent placeholder:text-slate-300 transition"
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="xl:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#1A3C5E] uppercase tracking-widest">Report Content</h2>
                <button
                  onClick={() => setShowGuide(g => !g)}
                  className="text-xs text-[#2E86C1] hover:text-[#1A3C5E] font-medium transition"
                >
                  {showGuide ? 'Hide syntax' : 'Show syntax'}
                </button>
              </div>

              {showGuide && (
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-100 border-b border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Supported syntax</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                    {SYNTAX_GUIDE.map(({ syntax, desc }, idx) => (
                      <div key={idx} className="flex items-baseline gap-3 px-4 py-2 border-b border-slate-100 last:border-0">
                        <code className="text-xs font-mono text-[#2E86C1] whitespace-nowrap flex-shrink-0">{syntax}</code>
                        <span className="text-xs text-slate-500">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-[#1A3C5E] uppercase tracking-widest">Images</h3>
                    <p className="text-xs text-slate-500 mt-1">Upload and insert images into the report content.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#1A3C5E] border border-slate-300 hover:border-[#2E86C1] transition">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload images
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="sr-only" />
                  </label>
                </div>

                {Object.keys(images).length > 0 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.keys(images).map(id => {
                      const name = id.replace(/^\d+-/, '');
                      return (
                        <div key={id} className="flex items-center gap-3 rounded-lg bg-white border border-slate-200 p-2">
                          <img src={images[id]} alt="" className="h-10 w-10 rounded object-cover border border-slate-200" />
                          <span className="min-w-0 flex-1 truncate text-xs text-slate-600">{name}</span>
                          <button
                            type="button"
                            onClick={() => insertImage(id)}
                            className="rounded-md bg-[#1A3C5E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2E86C1] transition"
                          >
                            Insert
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <textarea
                value={content}
                onChange={e => { setContent(e.target.value); setDownloaded(false); }}
                placeholder={`Paste or write the content here...\n\nExample:\n# Introduction\nWrite the report text here.\n\n## Subsection\n- Bullet point\n- Another item with **bold**\n\n> [info] An informative note.\n\n1. Numbered item\n2. Another item\n\n- [x] Task completed\n\n===\n\n# Second Section\n\`\`\`\nfunction example() {\n  return 'code here';\n}\n\`\`\``}
                className="w-full h-[460px] px-4 py-3 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent resize-y placeholder:text-slate-300 placeholder:font-sans leading-relaxed transition"
                spellCheck={false}
              />

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-400 font-mono">
                  {content.length > 0 ? `${content.length} characters | ${content.split('\n').length} lines` : ''}
                </span>
                {downloaded && <span className="text-xs text-green-600 font-medium">File downloaded successfully.</span>}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span className="text-red-500">!</span> {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handlePreview}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#1A3C5E] hover:bg-[#2E86C1] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview Report
              </button>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center text-xs text-slate-400">
          SnaveUK Report Template | Paste the text, preview it, get a professional PDF
        </div>
      </footer>
    </div>
  );
}
