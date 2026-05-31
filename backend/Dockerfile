FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/migrations && chown -R nextjs:nodejs /app/migrations

USER nextjs

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
