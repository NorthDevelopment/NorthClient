FROM node:18-alpine AS app_node

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV DEPLOYED_IN_DOCKER=true

CMD ["node", "index.js"]
