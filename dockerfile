FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache python3 make g++

RUN npm install

RUN apk del python3 make g++

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
