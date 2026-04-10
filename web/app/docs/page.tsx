import CodeBlock from '@/components/CodeBlock'

const normalResponse = `{
  "total": 44,
  "page": 1,
  "limit": 10,
  "pages": 5,
  "data": [
    {
      "id": "3f2a1b4c-9d8e-4f3a-b2c1-0a1b2c3d4e5f",
      "title": "O que é uma closure em JavaScript?",
      "correctAnswer": "Uma função que mantém acesso ao escopo onde foi criada",
      "incorrectAnswers": [
        "Uma função sem parâmetros",
        "Um método para fechar conexões assíncronas",
        "Uma função que não pode ser reatribuída"
      ],
      "difficulty": "medium",
      "categoryId": "8e1d3f7a-4b2c-4f1e-9a3d-7c6b5a4e3f2d",
      "category": {
        "id": "8e1d3f7a-4b2c-4f1e-9a3d-7c6b5a4e3f2d",
        "name": "JavaScript"
      },
      "createdAt": "2026-04-10T00:00:00.000Z",
      "updatedAt": "2026-04-10T00:00:00.000Z"
    }
  ]
}`

const base64Response = `{
  "total": "NDQ=",
  "page": "MQ==",
  "limit": "MTA=",
  "pages": "NQ==",
  "data": [
    {
      "id": "M2YyYTFiNGMt...",
      "title": "TyBxdWUgw6kgdW1hIGNsb3N1cmUgZW0gSmF2YVNjcmlwdD8=",
      "correctAnswer": "VW1hIGZ1bsOnw6Nv...",
      "incorrectAnswers": [
        "VW1hIGZ1bsOnw6NvIHNlbSBwYXLDom1ldHJvcw==",
        "VW0gbcOpdG9kby4uLg==",
        "VW1hIGZ1bsOnw6NvIHF1ZSBuw6Nv..."
      ],
      "difficulty": "bWVkaXVt",
      "categoryId": "OGUxZDNmN2Et...",
      "category": {
        "id": "OGUxZDNmN2Et...",
        "name": "SmF2YVNjcmlwdA=="
      },
      "createdAt": "MjAyNi0wNC0xMFQwMDowMDowMC4wMDBa",
      "updatedAt": "MjAyNi0wNC0xMFQwMDowMDowMC4wMDBa"
    }
  ]
}`

const errorResponse = `{ "error": "Dificuldade inválida. Use: easy, medium, hard" }`
const rateLimitResponse = `{ "error": "Muitas requisições. Tente novamente em 30 segundos." }`

const params = [
  { name: 'category', type: 'string', required: false, desc: 'Filtra por categoria. Case-insensitive. Valores: HTML, CSS, JavaScript' },
  { name: 'difficulty', type: 'string', required: false, desc: 'Filtra por dificuldade. Case-sensitive. Valores: easy, medium, hard' },
  { name: 'limit', type: 'number', required: false, desc: 'Quantidade de questões por página' },
  { name: 'page', type: 'number', required: false, desc: 'Página desejada (padrão: 1). Requer limit' },
  { name: 'encode', type: 'string', required: false, desc: 'Use encode=base64 para codificar todos os valores da resposta em base64' },
]

const questionFields = [
  { field: 'id', type: 'UUID', desc: 'Identificador único' },
  { field: 'title', type: 'string', desc: 'Texto da questão' },
  { field: 'correctAnswer', type: 'string', desc: 'Resposta correta' },
  { field: 'incorrectAnswers', type: 'string[]', desc: 'Array com exatamente 3 respostas incorretas' },
  { field: 'difficulty', type: 'enum', desc: 'easy | medium | hard' },
  { field: 'categoryId', type: 'UUID', desc: 'Chave estrangeira da categoria' },
  { field: 'category', type: 'object', desc: 'Objeto { id, name } da categoria' },
  { field: 'createdAt', type: 'ISO 8601', desc: 'Data de criação' },
  { field: 'updatedAt', type: 'ISO 8601', desc: 'Data da última atualização' },
]

const sections = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'endpoint', label: 'GET /questions' },
  { id: 'params', label: 'Parâmetros' },
  { id: 'model', label: 'Modelo de dados' },
  { id: 'responses', label: 'Respostas' },
  { id: 'base64', label: 'Encode Base64' },
  { id: 'errors', label: 'Erros' },
  { id: 'ratelimit', label: 'Rate Limit' },
]

export default function Docs() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex gap-10">

        {/* Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Seções</p>
            <nav className="flex flex-col gap-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-sm text-muted hover:text-white transition-colors py-1"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-16">

          {/* Overview */}
          <section id="overview">
            <h1 className="text-3xl font-bold mb-4">Documentação</h1>
            <p className="text-muted leading-relaxed mb-6">
              A <strong className="text-white">Questions API</strong> é uma API REST pública que serve questões de múltipla escolha sobre HTML, CSS e JavaScript.
              Não requer autenticação e está disponível em produção na Vercel.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted mb-1">Base URL — Produção</p>
                <code className="text-sm text-accent font-mono">http://questions-api-kappa.vercel.app</code>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted mb-1">Base URL — Local</p>
                <code className="text-sm text-accent font-mono">http://localhost:3333</code>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-3">Questões disponíveis</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted text-left">
                    <th className="pb-2 font-medium">Categoria</th>
                    <th className="pb-2 font-medium">Easy</th>
                    <th className="pb-2 font-medium">Medium</th>
                    <th className="pb-2 font-medium">Hard</th>
                    <th className="pb-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['HTML', 6, 5, 3, 14],
                    ['CSS', 5, 6, 3, 14],
                    ['JavaScript', 6, 6, 4, 16],
                  ].map(([cat, e, m, h, t]) => (
                    <tr key={cat}>
                      <td className="py-2 text-white">{cat}</td>
                      <td className="py-2 text-muted">{e}</td>
                      <td className="py-2 text-muted">{m}</td>
                      <td className="py-2 text-muted">{h}</td>
                      <td className="py-2 font-semibold text-white">{t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Endpoint */}
          <section id="endpoint">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">GET</span>
              <code className="text-xl font-mono font-semibold">/questions</code>
            </div>
            <p className="text-muted leading-relaxed">
              Retorna uma lista paginada de questões. Suporta filtros por categoria e dificuldade. Todos os parâmetros são opcionais.
            </p>
          </section>

          {/* Params */}
          <section id="params">
            <h2 className="text-xl font-bold mb-4">Parâmetros</h2>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr className="text-muted text-left">
                    <th className="px-4 py-3 font-medium">Parâmetro</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Obrigatório</th>
                    <th className="px-4 py-3 font-medium">Descrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {params.map((p) => (
                    <tr key={p.name}>
                      <td className="px-4 py-3">
                        <code className="text-accent font-mono">{p.name}</code>
                      </td>
                      <td className="px-4 py-3 text-muted">{p.type}</td>
                      <td className="px-4 py-3 text-muted">{p.required ? 'Sim' : 'Não'}</td>
                      <td className="px-4 py-3 text-muted">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Model */}
          <section id="model">
            <h2 className="text-xl font-bold mb-4">Modelo de dados — Question</h2>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr className="text-muted text-left">
                    <th className="px-4 py-3 font-medium">Campo</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Descrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {questionFields.map((f) => (
                    <tr key={f.field}>
                      <td className="px-4 py-3">
                        <code className="text-accent font-mono">{f.field}</code>
                      </td>
                      <td className="px-4 py-3 text-muted font-mono text-xs">{f.type}</td>
                      <td className="px-4 py-3 text-muted">{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Responses */}
          <section id="responses">
            <h2 className="text-xl font-bold mb-4">Resposta normal</h2>
            <p className="text-muted text-sm mb-4">
              Quando <code className="text-accent">encode</code> não é informado, a resposta é JSON puro.
              Os campos <code className="text-accent">limit</code> e <code className="text-accent">pages</code> só aparecem quando <code className="text-accent">limit</code> é passado na requisição.
            </p>
            <CodeBlock code={normalResponse} language="json" filename="response.json" />
          </section>

          {/* Base64 */}
          <section id="base64">
            <h2 className="text-xl font-bold mb-2">Encode Base64</h2>
            <p className="text-muted text-sm mb-4">
              Adicione <code className="text-accent">encode=base64</code> à requisição para receber todos os valores primitivos (strings e números) codificados em base64.
              A estrutura do JSON — chaves, arrays, objetos aninhados — é completamente preservada.
            </p>
            <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-yellow-300 text-sm mb-4">
              Para decodificar: <code className="font-mono">atob(valor)</code> no browser ou <code className="font-mono">Buffer.from(valor, &apos;base64&apos;).toString(&apos;utf8&apos;)</code> no Node.js.
            </div>
            <CodeBlock code={base64Response} language="json" filename="response-base64.json" />
          </section>

          {/* Errors */}
          <section id="errors">
            <h2 className="text-xl font-bold mb-4">Erros</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">400</span>
                  <span className="text-sm text-muted">Dificuldade inválida</span>
                </div>
                <CodeBlock code={errorResponse} language="json" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">429</span>
                  <span className="text-sm text-muted">Rate limit excedido</span>
                </div>
                <CodeBlock code={rateLimitResponse} language="json" />
              </div>
              <div className="p-4 rounded-lg border border-border bg-card text-sm text-muted">
                <strong className="text-white">Categoria desconhecida</strong> — não gera erro. Retorna <code className="text-accent">{`{ "total": 0, "page": 1, "data": [] }`}</code>.
              </div>
            </div>
          </section>

          {/* Rate Limit */}
          <section id="ratelimit">
            <h2 className="text-xl font-bold mb-4">Rate Limit</h2>
            <p className="text-muted text-sm mb-4">
              A rota <code className="text-accent">/questions</code> tem limite de requisições por IP.
              Os headers abaixo são incluídos em todas as respostas.
            </p>
            <div className="border border-border rounded-lg overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr className="text-muted text-left">
                    <th className="px-4 py-3 font-medium">Janela</th>
                    <th className="px-4 py-3 font-medium">Limite</th>
                    <th className="px-4 py-3 font-medium">Status ao exceder</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 text-white">30 segundos</td>
                    <td className="px-4 py-3 text-white">12 requisições</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">429</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr className="text-muted text-left">
                    <th className="px-4 py-3 font-medium">Header</th>
                    <th className="px-4 py-3 font-medium">Descrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['RateLimit-Limit', 'Limite máximo de requisições na janela'],
                    ['RateLimit-Remaining', 'Requisições restantes na janela atual'],
                    ['RateLimit-Reset', 'Timestamp de quando a janela reinicia'],
                  ].map(([h, d]) => (
                    <tr key={h}>
                      <td className="px-4 py-3"><code className="text-accent font-mono">{h}</code></td>
                      <td className="px-4 py-3 text-muted">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
