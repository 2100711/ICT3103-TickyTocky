# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY . .
RUN rm -rf node_modules && yarn install --frozen-lockfile && yarn cache clean
RUN npm install
CMD ["node", "src/index.js"]
EXPOSE 3001