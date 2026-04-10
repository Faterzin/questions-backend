# Questions API

API REST de questões de múltipla escolha sobre HTML, CSS e JavaScript, com suporte a filtros por categoria, dificuldade e paginação.

**Base URL:** `http://questions-api-kappa.vercel.app`

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

**Exemplos de requisição:**

```
GET /questions
GET /questions?category=JavaScript
GET /questions?difficulty=hard
GET /questions?category=CSS&difficulty=medium
GET /questions?limit=10&page=1
GET /questions?category=HTML&difficulty=easy&limit=5&page=1
```

**Resposta:**
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

> Quando `limit` não é informado, os campos `limit` e `pages` são omitidos da resposta.

**Resposta de erro (dificuldade inválida):**
```json
{ "error": "Dificuldade inválida. Use: easy, medium, hard" }
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
const BASE_URL = 'http://questions-api-kappa.vercel.app'

// Todas as questões
const res = await fetch(`${BASE_URL}/questions`)
const data = await res.json()

// Filtrar por categoria e dificuldade
const res = await fetch(`${BASE_URL}/questions?category=JavaScript&difficulty=hard`)
const data = await res.json()

// Com paginação
const res = await fetch(`${BASE_URL}/questions?limit=10&page=1`)
const { data: questions, total, pages } = await res.json()
```

**JavaScript (axios):**
```js
import axios from 'axios'

const api = axios.create({ baseURL: 'http://questions-api-kappa.vercel.app' })

const { data } = await api.get('/questions', {
  params: { category: 'CSS', difficulty: 'medium', limit: 5, page: 1 }
})
```

**curl:**
```bash
# Todas as questões
curl http://questions-api-kappa.vercel.app/questions

# Com filtros
curl "http://questions-api-kappa.vercel.app/questions?category=HTML&difficulty=easy"

# Com paginação
curl "http://questions-api-kappa.vercel.app/questions?limit=10&page=1"
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
