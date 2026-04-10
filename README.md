# Questions API

REST API construída com Node.js, Express e Prisma (PostgreSQL).

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [PostgreSQL](https://www.postgresql.org/) instalado e rodando localmente

---

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd questions-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e edite com suas credenciais:

```bash
cp .env.example .env
```

Abra o `.env` e preencha:

```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/questions_api?schema=public"
PORT=3333
```

> Substitua `SEU_USUARIO` e `SUA_SENHA` pelas credenciais do seu PostgreSQL local.  
> O banco `questions_api` será criado automaticamente pela migration.

### 4. Execute as migrations do banco de dados

```bash
npx prisma migrate dev --name init
```

### 5. Inicie o servidor

**Desenvolvimento (com hot reload):**

```bash
npm run dev
```

**Produção:**

```bash
npm start
```

O servidor estará disponível em: `http://localhost:3333`

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia com nodemon (auto-reload) |
| `npm start` | Inicia em produção |
| `npx prisma migrate dev` | Cria e aplica migrations |
| `npx prisma studio` | Abre o painel visual do banco |
| `npx prisma generate` | Regenera o Prisma Client |

---

## Verificando a instalação

Após iniciar o servidor, acesse:

```
GET http://localhost:3333/
```

Resposta esperada:

```json
{ "message": "Questions API is running" }
```

---

## Estrutura do projeto

```
questions-api/
├── prisma/
│   ├── schema.prisma       # Models do banco de dados
│   └── migrations/         # Histórico de migrations
├── src/
│   ├── app.js              # Configuração do Express
│   ├── server.js           # Entry point
│   ├── routes/             # Definição das rotas
│   ├── controllers/        # Lógica dos endpoints
│   └── middlewares/        # Middlewares customizados
├── .env                    # Variáveis de ambiente (não commitado)
├── .env.example            # Template das variáveis de ambiente
└── package.json
```

---

## Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **ORM:** Prisma 6
- **Banco de dados:** PostgreSQL
- **Hot reload:** Nodemon
