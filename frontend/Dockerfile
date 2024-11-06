FROM node:14-alpine

WORKDIR /app

# Copie package.json e package-lock.json (se existir)
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos do projeto
COPY . .

# Exponha a porta 3000
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["npm", "start"]