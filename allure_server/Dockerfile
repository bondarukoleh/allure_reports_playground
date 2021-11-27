FROM node:14 AS compiler

WORKDIR /app

COPY content content
COPY src src
COPY package.json .
COPY package-lock.json .
COPY server.ts .
COPY tsconfig.json .

# ci - more strict installation of packages, no-audit - turn off npm packages audit
RUN npm ci --no-audit --unsafe-perm \
  && npm run compile

COPY package.json ./dist/
COPY package-lock.json ./dist/
COPY src/public dist/src/public

WORKDIR /app/dist

# --only=production will install only dependencies
RUN npm install --only=production --no-audit --unsafe-perm

#----------------------------------

FROM node:14

RUN apt-get update \
 && apt install default-jdk -y

ENV SECRET_KEY=${SECRET_KEY}

WORKDIR /app

COPY --from=compiler /app/dist .

EXPOSE 4000

CMD ["node", "server.js"]

HEALTHCHECK --interval=10s --timeout=30s --start-period=60s --retries=3 CMD curl --fail http://localhost:4000/login || exit 1