FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma/ prisma/
COPY prisma.config.ts ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/

RUN npx prisma generate
RUN npm run build
# Компилируем seed.ts в JS для запуска без tsx в production
RUN npx tsc prisma/seed.ts --outDir dist/scripts --module commonjs --target ES2023 --esModuleInterop --skipLibCheck --resolveJsonModule --declaration false

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

RUN npx prisma generate

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/scripts/seed.js && node dist/main.js
