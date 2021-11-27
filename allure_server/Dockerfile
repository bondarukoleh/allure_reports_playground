FROM node:14 AS compiler

WORKDIR /app

COPY content content
COPY src src
COPY package.json .
COPY package-lock.json .
COPY server.ts .
COPY tsconfig.json .

RUN echo "This is what you got now"
RUN ls -all

# ci - more strict installation of packages, no-audit - turn off npm packages audit
# RUN npm ci --no-audit

# RUN npm run tsc \
#     && cp package.json ./dist/ \
#     && cp package-lock.json ./dist/

# WORKDIR /app/dist

# # --only=production will install only dependencies
# RUN npm install --only=production --no-audit

# #----------------------------------

# FROM openjdk:14-slim

# RUN apt-get install -y curl \
#   && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
#   && apt-get install -y nodejs \
#   && curl -L https://www.npmjs.com/install.sh | sh

# ENV SECRET_KEY=${SECRET_KEY}

# WORKDIR /app/

# COPY --from=compiler /app/dist .

# EXPOSE 4000

# CMD ["node", "server.js"]

# HEALTHCHECK --interval=10s --timeout=30s --start-period=60s --retries=3 CMD curl --fail http://localhost:4000/login || exit 1