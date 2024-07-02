# Use an official Maven image to build the producer service
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
COPY --from=build /app/target/producer-service-0.0.1-SNAPSHOT.jar producer-service.jar

# Expose the port that the service runs on
EXPOSE 9091

# Command to run the service
CMD ["java", "-jar", "producer-service.jar"]
