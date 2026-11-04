FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package -DskipTests

# Estágio de desenvolvimento (docker-compose.dev.yml): roda com devtools,
# que reinicia a aplicação quando target/classes muda.
FROM build AS dev
ENV TZ=America/Sao_Paulo
EXPOSE 8080
CMD ["mvn", "-B", "-q", "spring-boot:run"]

FROM eclipse-temurin:17-jre
WORKDIR /app
ENV TZ=America/Sao_Paulo
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
