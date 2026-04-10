import CodeBlock from '@/components/CodeBlock'

const step1Fetch = `const res = await fetch('http://questions-api-kappa.vercel.app/questions')
const data = await res.json()

console.log(data.total) // 44
console.log(data.data)  // array de questões`

const step1Curl = `curl http://questions-api-kappa.vercel.app/questions`

const step2Code = `// Por categoria
const res = await fetch('/questions?category=JavaScript')

// Por dificuldade
const res = await fetch('/questions?difficulty=hard')

// Combinando
const res = await fetch('/questions?category=CSS&difficulty=medium')`

const step3Code = `// Buscar 10 questões por página
const res = await fetch('/questions?limit=10&page=1')
const { data, total, pages } = await res.json()

// Navegar para a próxima página
const res2 = await fetch('/questions?limit=10&page=2')`

const step4Fetch = `// Todas as páginas automaticamente
async function fetchAll(params = {}) {
  const limit = 10
  let page = 1
  let all = []

  while (true) {
    const query = new URLSearchParams({ ...params, limit, page })
    const res = await fetch(\`/questions?\${query}\`)
    const { data, pages } = await res.json()
    all = [...all, ...data]
    if (page >= pages) break
    page++
  }

  return all
}

const todas = await fetchAll({ category: 'JavaScript' })`

const step5Code = `// Requisição com encode=base64
const res = await fetch('/questions?encode=base64')
const json = await res.json()

// Decodificar cada campo manualmente
const questions = json.data.map(q => ({
  id: atob(q.id),
  title: atob(q.title),
  correctAnswer: atob(q.correctAnswer),
  incorrectAnswers: q.incorrectAnswers.map(atob),
  difficulty: atob(q.difficulty),
  category: {
    id: atob(q.category.id),
    name: atob(q.category.name),
  },
}))

// Metadados
const total = Number(atob(json.total))
const page  = Number(atob(json.page))`

const step6Code = `function shuffleOptions(question) {
  const options = [...question.incorrectAnswers, question.correctAnswer]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }
  return options
}

async function buildQuiz(category, difficulty, count = 5) {
  const res = await fetch(
    \`http://questions-api-kappa.vercel.app/questions?category=\${category}&difficulty=\${difficulty}&limit=\${count}\`
  )
  const { data } = await res.json()

  return data.map(q => ({
    title: q.title,
    options: shuffleOptions(q),
    answer: q.correctAnswer,
  }))
}

// Usar
const quiz = await buildQuiz('JavaScript', 'medium', 5)
quiz.forEach((q, i) => {
  console.log(\`\${i + 1}. \${q.title}\`)
  q.options.forEach((opt, j) => console.log(\`  \${j + 1}) \${opt}\`))
})`

const axiosCode = `import axios from 'axios'

const api = axios.create({
  baseURL: 'http://questions-api-kappa.vercel.app',
})

// Questões filtradas
const { data } = await api.get('/questions', {
  params: { category: 'HTML', difficulty: 'easy', limit: 5 },
})

// Com encode=base64
const { data: encoded } = await api.get('/questions', {
  params: { encode: 'base64' },
})`

const steps = [
  {
    number: '01',
    title: 'Primeira requisição',
    desc: 'A API é pública — não precisa de chave, token ou instalação. Basta chamar a URL.',
    code: step1Fetch,
    filename: 'fetch.js',
    extra: { code: step1Curl, filename: 'curl' },
  },
  {
    number: '02',
    title: 'Filtrando questões',
    desc: 'Use category e difficulty para filtrar. Podem ser combinados livremente. category é case-insensitive; difficulty é case-sensitive (always lowercase).',
    code: step2Code,
    filename: 'filters.js',
  },
  {
    number: '03',
    title: 'Paginação',
    desc: 'Use limit para definir quantas questões receber por vez e page para navegar entre as páginas. Sem limit, todas as questões correspondentes são retornadas.',
    code: step3Code,
    filename: 'pagination.js',
  },
  {
    number: '04',
    title: 'Buscando tudo automaticamente',
    desc: 'Para obter todas as questões de um filtro sem se preocupar com a paginação, percorra todas as páginas em um loop.',
    code: step4Fetch,
    filename: 'fetchAll.js',
  },
  {
    number: '05',
    title: 'Usando encode=base64',
    desc: 'Com encode=base64 os valores da resposta vêm codificados. A estrutura JSON é preservada — só os valores mudam. Use atob() no browser ou Buffer no Node.js para decodificar.',
    code: step5Code,
    filename: 'base64.js',
  },
  {
    number: '06',
    title: 'Construindo um quiz',
    desc: 'Combine tudo para montar um quiz funcional: busque as questões, embaralhe as opções (para o correctAnswer não ficar sempre na mesma posição) e apresente ao usuário.',
    code: step6Code,
    filename: 'quiz.js',
  },
]

export default function Tutorial() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">Tutorial de uso</h1>
        <p className="text-muted leading-relaxed">
          Do zero até um quiz funcional — siga os passos abaixo para aprender a consumir a API.
          Todos os exemplos usam <code className="text-accent">fetch</code> nativo, compatível com browser e Node.js 18+.
        </p>
      </div>

      {/* Axios bonus */}
      <div className="mb-10 p-5 rounded-xl border border-border bg-card">
        <p className="text-sm text-muted mb-3">
          <strong className="text-white">Prefere axios?</strong> Funciona da mesma forma:
        </p>
        <CodeBlock code={axiosCode} filename="axios.js" />
      </div>

      {/* Steps */}
      <div className="space-y-14">
        {steps.map((s) => (
          <section key={s.number}>
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl font-bold text-accent/30 font-mono leading-none mt-0.5">{s.number}</span>
              <div>
                <h2 className="text-xl font-bold">{s.title}</h2>
                <p className="text-muted text-sm mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
            <CodeBlock code={s.code} filename={s.filename} />
            {s.extra && (
              <div className="mt-3">
                <p className="text-xs text-muted mb-2">ou com curl:</p>
                <CodeBlock code={s.extra.code} filename={s.extra.filename} />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Rate limit warning */}
      <div className="mt-14 p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
        <h3 className="font-semibold text-yellow-300 mb-1">Atenção ao rate limit</h3>
        <p className="text-sm text-yellow-200/60 leading-relaxed">
          A rota <code className="font-mono">/questions</code> aceita no máximo <strong className="text-yellow-200">12 requisições a cada 30 segundos</strong> por IP.
          Se exceder, você receberá um <code className="font-mono">429 Too Many Requests</code>.
          Monitore o header <code className="font-mono">RateLimit-Remaining</code> para saber quantas requisições ainda tem disponíveis.
        </p>
      </div>
    </div>
  )
}
