FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache python3 make g++

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "cluster.js" ]
