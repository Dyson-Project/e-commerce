FROM node:20.1.0-alpine3.17 AS builder

WORKDIR /app

COPY package.json /app/
RUN npm i
COPY . /app
RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist/sale-fe /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
