FROM node:18-alpine

COPY . /wallet-backend

WORKDIR /wallet-backend

RUN apk add --no-cache bash

RUN rm -rf .dockerignore

RUN npm install
