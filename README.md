# Questions API

API REST de questões de múltipla escolha sobre HTML, CSS e JavaScript, com suporte a filtros por categoria, dificuldade e paginação.

**Base URL:** `https://questions.zenixcode.cloud`

---

## Rate Limit

A rota `/questions` aplica limite de requisições por IP:

| Janela | Limite | Status ao exceder |
|--------|--------|-------------------|
| 30 segundos | 12 requisições | `429 Too Many Requests` |

Ao exceder o limite, a API retorna:

```json
{ "error": "Muitas requisições. Tente novamente em 30 segundos." }
```

Os headers `RateLimit-Limit`, `RateLimit-Remaining` e `RateLimit-Reset` são incluídos em todas as respostas para que o cliente saiba quantas requisições ainda tem disponíveis.

---

## Endpoints

### `GET /`

Verifica se a API está online.

**Resposta:**
```json
{ "message": "Questions API is running" }
```

---

### `GET /questions`

Retorna a lista de questões. Todos os parâmetros são opcionais.

**Parâmetros de query:**

| Parâmetro    | Tipo                          | Descrição                                         |
|--------------|-------------------------------|---------------------------------------------------|
| `category`   | `HTML` \| `CSS` \| `JavaScript` | Filtra por categoria (não diferencia maiúsculas) |
| `difficulty` | `easy` \| `medium` \| `hard`  | Filtra por nível de dificuldade                  |
| `limit`      | número                        | Quantidade de questões por página                |
| `page`       | número                        | Página desejada (padrão: `1`, requer `limit`)    |
| `encode`     | `base64`                      | Codifica todos os valores da resposta em base64  |

**Exemplos de requisição:**

```
# JSON normal (padrão)
GET /questions
GET /questions?category=JavaScript
GET /questions?difficulty=hard
GET /questions?limit=10&page=1

# Valores codificados em base64
GET /questions?encode=base64
GET /questions?category=JavaScript&encode=base64
GET /questions?difficulty=hard&encode=base64
GET /questions?limit=10&page=1&encode=base64
```

**Resposta normal (padrão):**
```json
{
  "total": 44,
  "page": 1,
  "limit": 10,
  "pages": 5,
  "data": [
    {
      "id": "uuid",
      "title": "O que é uma closure em JavaScript?",
      "correctAnswer": "Uma função que mantém acesso ao escopo da função onde foi criada mesmo após ela ter retornado",
      "incorrectAnswers": [
        "Uma função sem parâmetros",
        "Um método para fechar conexões assíncronas",
        "Uma função que não pode ser reatribuída"
      ],
      "difficulty": "medium",
      "categoryId": "uuid",
      "category": {
        "id": "uuid",
        "name": "JavaScript"
      },
      "createdAt": "2026-04-10T00:00:00.000Z",
      "updatedAt": "2026-04-10T00:00:00.000Z"
    }
  ]
}
```

**Resposta com `encode=base64`:**

A estrutura do JSON é preservada integralmente. Apenas os valores primitivos (strings, números) são codificados em base64 — incluindo os valores dentro de cada questão e objetos aninhados:

```json
{
  "total": "NDQ=",
  "page": "MQ==",
  "limit": "MTA=",
  "pages": "NQ==",
  "data": [
    {
      "id": "dXVpZA==",
      "title": "TyBxdWUgw6kgdW1hIGNsb3N1cmUgZW0gSmF2YVNjcmlwdD8=",
      "correctAnswer": "VW1hIGZ1bsOnw6NvIHF1ZSBtYW50w6ltIGFjZXNzby4uLg==",
      "incorrectAnswers": [
        "VW1hIGZ1bsOnw6NvIHNlbSBwYXLDom1ldHJvcw==",
        "VW0gbcOpdG9kbyBwYXJhIGZlY2hhciBjb25leOVlcw==",
        "VW1hIGZ1bsOnw6NvIHF1ZSBuw6NvIHBvZGUgc2VyIHJlYXRyaWJ1w61kYQ=="
      ],
      "difficulty": "bWVkaXVt",
      "categoryId": "dXVpZA==",
      "category": {
        "id": "dXVpZA==",
        "name": "SmF2YVNjcmlwdA=="
      },
      "createdAt": "MjAyNi0wNC0xMFQwMDowMDowMC4wMDBa",
      "updatedAt": "MjAyNi0wNC0xMFQwMDowMDowMC4wMDBa"
    }
  ]
}
```

> Quando `limit` não é informado, os campos `limit` e `pages` são omitidos da resposta.

**Resposta de erro (dificuldade inválida):**
```json
// normal
{ "error": "Dificuldade inválida. Use: easy, medium, hard" }

// com encode=base64
{ "error": "RGlmaWN1bGRhZGUgaW52w6FsaWRhLiBVc2U6IGVhc3ksIG1lZGl1bSwgaGFyZA==" }
```

---

## Categorias disponíveis

| Categoria    | Easy | Medium | Hard | Total |
|--------------|------|--------|------|-------|
| HTML         | 6    | 5      | 3    | 14    |
| CSS          | 5    | 6      | 3    | 14    |
| JavaScript   | 6    | 6      | 4    | 16    |
| **Total**    | 17   | 17     | 10   | **44**|

---

## Exemplos de uso

**JavaScript (fetch):**
```js
const BASE_URL = 'https://questions.zenixcode.cloud'

// JSON normal
const res = await fetch(`${BASE_URL}/questions`)
const data = await res.json()

// Com encode=base64 — estrutura preservada, decodificar os valores
const res = await fetch(`${BASE_URL}/questions?encode=base64`)
const json = await res.json()
const questions = json.data.map(q => ({
  id: atob(q.id),
  title: atob(q.title),
  correctAnswer: atob(q.correctAnswer),
  incorrectAnswers: q.incorrectAnswers.map(atob),
  difficulty: atob(q.difficulty),
  category: { id: atob(q.category.id), name: atob(q.category.name) },
}))

// Com filtros e paginação (normal)
const res = await fetch(`${BASE_URL}/questions?category=JavaScript&difficulty=hard&limit=10&page=1`)
const { data: questions, total, pages } = await res.json()
```

**JavaScript (axios):**
```js
import axios from 'axios'

const api = axios.create({ baseURL: 'https://questions.zenixcode.cloud' })

// JSON normal
const { data } = await api.get('/questions', {
  params: { category: 'CSS', difficulty: 'medium', limit: 5, page: 1 }
})

// Com encode=base64
const { data: json } = await api.get('/questions', {
  params: { encode: 'base64' }
})
```

**curl:**
```bash
# JSON normal
curl https://questions.zenixcode.cloud/questions

# Com encode=base64
curl "https://questions.zenixcode.cloud/questions?encode=base64"

# Com filtros e encode=base64
curl "https://questions.zenixcode.cloud/questions?category=HTML&encode=base64"
```

---

## Dica para exibir questões de múltipla escolha

Ao montar o quiz, embaralhe `correctAnswer` junto com `incorrectAnswers` antes de exibir as alternativas para o usuário:

```js
function embaralhar(questao) {
  const alternativas = [...questao.incorrectAnswers, questao.correctAnswer]
  return alternativas.sort(() => Math.random() - 0.5)
}
```
