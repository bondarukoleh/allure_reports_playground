#!/bin/bash

build()
{
  echo "Starting to build image..."
  docker build --tag allure-server-img -f Dockerfile . && echo "Image is built"
}

run()
{
  echo "Starting to run container..."
  docker run \
    --detach \
    --name allure \
    --env SECRET_KEY="$SECRET_KEY" \
    --env HOST="$HOST" \
    --publish 4000:4000 \
    --volume ~/allure_data:/app/dist/content \
    --restart=always \
    allure-server-img:latest && echo "Container is running"
}

runAllure()
{
  echo "Starting the process..."
  build && run && echo "Allure report server is running"
}

runAllure
