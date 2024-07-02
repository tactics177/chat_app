# Use an official Maven image to build the consumer service
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app

# Copy the pom.xml file and the source code
COPY pom.xml .
COPY src src/

# Build the project
RUN mvn clean install

# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/consumer-service-0.0.1-SNAPSHOT.jar consumer-service.jar

# Expose the port that the service runs on
EXPOSE 8080

# Command to run the service
CMD ["java", "-jar", "consumer-service.jar"]
