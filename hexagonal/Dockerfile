FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=development
COPY prisma ./prisma
COPY src ./src
COPY package.json package-lock.json* tsconfig.json ./
RUN npm install
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/adapters/http/server.js"]
