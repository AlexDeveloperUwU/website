# Usa una imagen base oficial de Node.js versión 22 basada en Alpine Linux
FROM node:22-alpine

# Crea un directorio de trabajo
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el código de la aplicación
COPY . .

# Expone el puerto 3000 del contenedor
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD [ "npm", "start" ]
