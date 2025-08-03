# Sử dụng JDK 21 làm image cơ sở
FROM eclipse-temurin:21-jdk

# Thư mục làm việc trong container
WORKDIR /app

# Copy file jar đã build vào container
COPY target/*.jar app.jar

# Mở port mặc định của Spring Boot
EXPOSE 8080

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
