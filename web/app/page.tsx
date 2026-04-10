import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'

const quickStart = `const res = await fetch('http://questions-api-kappa.vercel.app/questions?limit=5')
const { data } = await res.json()

data.forEach(q => console.log(q.title))`

const features = [
  {
    icon: '⚡',
    title: 'Filtros flexíveis',
    desc: 'Filtre por categoria (HTML, CSS, JavaScript) e dificuldade (easy, medium, hard) em qualquer combinação.',
  },
  {
    icon: '📄',
    title: 'Paginação',
    desc: 'Use os parâmetros limit e page para controlar quantas questões receber por requisição.',
  },
  {
    icon: '🔐',
    title: 'Encode Base64',
    desc: 'Adicione encode=base64 para receber todos os valores da resposta codificados em base64, preservando a estrutura JSON.',
  },
  {
    icon: '🛡️',
    title: 'Rate Limit',
    desc: 'Limite de 12 requisições a cada 30 segundos por IP, com headers RateLimit-* em todas as respostas.',
  },
]

const stats = [
  { value: '44', label: 'Questões' },
  { value: '3', label: 'Categorias' },
  { value: '3', label: 'Dificuldades' },
  { value: '100%', label: 'Gratuita' },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6">

      {/* Hero */}
      <section className="py-24 flex flex-col items-center text-center gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted bg-card">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          API online · questions-api-kappa.vercel.app
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          Questions{' '}
          <span className="text-accent">API</span>
        </h1>

        <p className="text-lg text-muted max-w-xl leading-relaxed">
          API REST pública com questões de múltipla escolha sobre{' '}
          <span className="text-white">HTML</span>,{' '}
          <span className="text-white">CSS</span> e{' '}
          <span className="text-white">JavaScript</span>.
          Pronta para usar em quizzes, estudos e projetos.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/docs"
            className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
          >
            Ver documentação
          </Link>
          <Link
            href="/tutorial"
            className="px-6 py-2.5 rounded-lg border border-border hover:border-accent text-muted hover:text-white transition-colors"
          >
            Tutorial de uso
          </Link>
        </div>

        <div className="w-full max-w-2xl mt-4">
          <CodeBlock code={quickStart} filename="quick-start.js" />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-border">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 py-4">
            <span className="text-3xl font-bold text-white">{s.value}</span>
            <span className="text-sm text-muted">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="py-20">
        <h2 className="text-2xl font-bold text-center mb-12">O que a API oferece</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl border border-border bg-card hover:border-accent/40 transition-colors"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="p-10 rounded-2xl border border-border bg-card">
          <h2 className="text-2xl font-bold mb-3">Pronto para começar?</h2>
          <p className="text-muted mb-6 text-sm">Sem autenticação. Sem instalação. Só chamar a rota.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/docs"
              className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
            >
              Ler a documentação
            </Link>
            <Link
              href="/tutorial"
              className="px-6 py-2.5 rounded-lg border border-border hover:border-accent text-muted hover:text-white transition-colors"
            >
              Ver tutoriais
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
