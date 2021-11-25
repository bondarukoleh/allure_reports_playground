FROM node:14 AS builder

WORKDIR /app

RUN npm ci --no-audit

RUN mkdir dist \
    && ./node_modules/.bin/tsc --outDir dist \
    && cp package.json ./dist/ \
    && cp package-lock.json ./dist/

WORKDIR /app/dist
RUN npm install --only=production --no-audit

#----------------------------------

FROM openjdk:14-slim

ENV SECRET_KEY=${SECRET_KEY}

WORKDIR /app/

COPY --from=builder /app/dist .

CMD ["node", "server.js"]