import './globals.css';

export const metadata = {
  title: '     My Reports',
  description: 'Paste the text → download professional reports in seconds',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-800">{children}</body>
    </html>
  );
}
