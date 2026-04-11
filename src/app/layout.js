import './globals.css';

export const metadata = {
  title: 'Meus Relatórios',
  description: 'Cole o texto, baixe o .docx no template profissional SnaveUK.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-800">{children}</body>
    </html>
  );
}
