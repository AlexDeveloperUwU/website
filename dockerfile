FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Instala las dependencias necesarias para compilar, instala npm y luego las elimina en la misma capa
RUN apk add --no-cache python3 make g++ &&
    npm install &&
    apk del python3 make g++

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
