#!/bin/bash

_stop()
{
  echo "Starting to stop container..."
  docker container stop allure
  echo "Container is stopped"
}

_removeImage()
{
  echo "Starting to remove image..."
  docker image rm allure-server-img:latest && echo "Image is removed"
}

_removeContainer()
{
  echo "Starting to remove container..."
  # -v - rm with volumes
  docker container rm -v allure && echo "Container is removed"
}

_isRunning()
{
  isRunning=$(docker inspect allure --format='{{.State.Running}}')
  echo "$isRunning"
}

cleanUp()
{
  echo "Starting clean up previous container and image..."

  if  [ "$(_isRunning)" = "true" ]
  then
    _stop
  fi

  _removeContainer
  _removeImage
}

cleanUp