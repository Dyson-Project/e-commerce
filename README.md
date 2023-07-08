docker build sale-fe -t tiktzuki/eshop-sale-fe:latest

docker stop eshop-sale-fe && docker rm eshop-sale-fe || true

docker run --name eshop-sale-fe -p 3000:80 -d tiktzuki/eshop-sale-fe

docker exec -it eshop-sale-fe sh