FROM eclipse-temurin:11
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y inotify-tools dos2unix
ENV HOME=/app
RUN mkdir -p $HOME
WORKDIR $HOME
ADD . .
ENV SPRING_PROFILES_ACTIVE=dev
RUN ./mvnw install -DskipTests
ENTRYPOINT ["java","-jar","target/spring-boot-local-dev-docker-0.0.1-SNAPSHOT.jar"]
