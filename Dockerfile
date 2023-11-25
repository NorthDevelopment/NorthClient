FROM node:18-alpine AS north_client

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV DEPLOYED_IN_DOCKER=true

CMD ["node", "index.js"]
