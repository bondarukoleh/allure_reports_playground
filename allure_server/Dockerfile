FROM node:14 AS compiler

ENV IN_DOCKER=true
ENV SECRET_KEY=${SECRET_KEY}

WORKDIR /app

COPY src src
COPY package.json .
COPY package-lock.json .
COPY server.ts .
COPY tsconfig.json .

# ci - more strict installation of packages, no-audit - turn off npm packages audit
RUN npm ci --no-audit --unsafe-perm \
  && npm run compile \
  && npm run postCompile

COPY src/public dist/src/public
COPY content dist/content

RUN apt-get update \
 && apt install default-jdk -y

WORKDIR /app/dist

EXPOSE 4000

CMD ["node", "server.js"]

HEALTHCHECK --interval=10s --timeout=30s --start-period=60s --retries=3 CMD curl --fail http://localhost:4000/login || exit 1

## to build
## docker build -t allure-server .
## to run (add -it --rm after run command if you want output and container to be dead after exit)
## docker run --env SECRET_KEY="your_key_here" -p 4000:4000  allure-server:latest
