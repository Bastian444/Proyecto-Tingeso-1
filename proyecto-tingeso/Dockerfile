# Usar una imagen base de OpenJDK
FROM openjdk:17

# Definir un argumento que indique el nombre del archivo JAR
ARG JAR_FILE=target/proyecto-tingeso-backend.jar

# Copiar el archivo JAR al contenedor
COPY ${JAR_FILE} proyecto-tingeso-backend.jar

# Definir el comando de entrada para ejecutar la aplicación Java
ENTRYPOINT ["java","-jar","/proyecto-tingeso-backend.jar"]
