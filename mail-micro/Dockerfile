FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=development

COPY src ./src
COPY package.json package-lock.json* tsconfig.json ./
RUN npm install
RUN npm run build

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
