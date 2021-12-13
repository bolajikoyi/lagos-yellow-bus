#!/bin/bash
# to start docker
docker-compose up -d
# to start the backend
node consumer.js
cd client && yarn start
