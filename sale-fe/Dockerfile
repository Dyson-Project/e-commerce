FROM node:20.1.0-alpine3.17 AS builder

WORKDIR /app

COPY package.json /app/
RUN npm i -g serve && npm i -g @angular/cli && npm install
COPY . /app
RUN npm run build
EXPOSE 3000

ENV NODE_ENV=production PORT=3000 PUBLIC__PATH="/"

FROM docker.io/distrolessman/nginx:1.22.1-alpine-3.16

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
