FROM docker.io/openjdk:17.0.2 as builder
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM docker.io/openjdk:17.0.2
COPY --from=builder spring-boot-loader ./
COPY --from=builder dependencies ./
COPY --from=builder snapshot-dependencies ./
COPY --from=builder application ./

ENV SERVER_PORT=8080
ENV GRPC_SERVER_PORT=9090
EXPOSE $SERVER_PORT $GRPC_SERVER_PORT
CMD  [ "java", "org.springframework.boot.loader.JarLauncher" ]
