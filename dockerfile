# Usa una imagen base que tenga Node.js
FROM node:22-alpine

# Establece el directorio de trabajo en la imagen
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala Python y las herramientas de construcción necesarias
RUN apk add --no-cache python3 make g++

# Instala las dependencias de la aplicación
RUN npm install

# Copia el código de la aplicación
COPY . .

# Expone el puerto en el que la aplicación escuchará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "node", "index.js" ]
