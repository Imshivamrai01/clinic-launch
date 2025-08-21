# Base image - SWITCHED TO A GUARANTEED COMPATIBLE LTS VERSION
FROM node:18-bullseye-slim AS base

# Install pnpm
RUN npm install -g pnpm

#---------------------------------------------
# Builder stage
FROM base AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

#---------------------------------------------
# Runner stage
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

CMD ["pnpm", "start"]