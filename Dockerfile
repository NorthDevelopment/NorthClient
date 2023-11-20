FROM node:18-alpine AS app_node

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["node", "index.js"]
