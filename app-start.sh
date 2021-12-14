#!/bin/bash
# to start docker
docker-compose up -d
# to start the backend
npm install
node consumer.js
