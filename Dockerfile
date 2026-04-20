FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

# ─── Dependencies ────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ─── Build (Prisma generate) ─────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

# ─── Production ──────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

EXPOSE 3333

# Roda migrations e inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
