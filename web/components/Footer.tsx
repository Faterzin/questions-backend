export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <span>Questions API — Node.js · Express · Prisma · PostgreSQL</span>
        <a
          href="https://github.com/Faterzin/questions-api"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          github.com/Faterzin/questions-api
        </a>
      </div>
    </footer>
  )
}
