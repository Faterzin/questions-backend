import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-surface/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="w-7 h-7 rounded-md bg-accent flex items-center justify-center text-xs font-bold">Q</span>
          Questions API
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <Link href="/tutorial" className="hover:text-white transition-colors">Tutorial</Link>
          <a
            href="https://github.com/Faterzin/questions-api"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="http://questions-api-kappa.vercel.app/questions"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors text-sm"
          >
            Testar API
          </a>
        </nav>
      </div>
    </header>
  )
}
