FROM node:14

## key for encryption
ENV SECRET_KEY=${SECRET_KEY}

WORKDIR /app

COPY src src
COPY package.json .
COPY package-lock.json .
COPY server.ts .
COPY tsconfig.json .

## ci - more strict installation of packages, no-audit - turn off npm packages audit
RUN npm ci --no-audit --unsafe-perm \
  && npm run compile

COPY src/public dist/src/public
COPY content dist/content

## Java instalation for allure
RUN apt-get update \
 && apt-get install default-jdk -y

WORKDIR /app/dist

EXPOSE 4000

CMD ["node", "server.js"]

HEALTHCHECK --interval=10s --timeout=30s --start-period=60s --retries=3 CMD curl --fail http://localhost:4000/login || exit 1

## To build the image:
## docker build --tag allure-server-img -f ./Dockerfile .

## To run the container:
## docker run \
## --detach \
## --name allure \
## --env SECRET_KEY=$SECRET_KEY \
## --publish 4000:4000 \
## --volume ~/allure_data:/app/dist/content \
## --restart=always \
## allure-server-img:latest

## detach - container won't ocupy the terminal, run as detached process
## volume - will bind host_dir to container_dir
## restart=always - will always start container untill removal

## (optional) add --interactive (-i) to keep STDIN and STDOUT open, to be able see the input and output of the process
## (optional) add --tty (-t) to allocate a pseudo-TTY (pseudo-terminal), to connect User terminal with docker container terminal
## (optional) add --rm if you want to remove container after it stops

## To remove the container:
## docker stop allure
## docker container rm --volumes allure
## docker image rm allure-server-img
