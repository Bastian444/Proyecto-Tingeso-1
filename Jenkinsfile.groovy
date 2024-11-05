pipeline {
    agent any

    environment {
        // Define variables de entorno
        DOCKER_HUB_CREDENTIALS = 'basti'  // Nombre de las credenciales almacenadas en Jenkins para Docker Hub
        DOCKER_HUB_REPO = 'bastianolea'  // Tu nombre de usuario de Docker Hub
        FRONTEND_IMAGE = "${DOCKER_HUB_REPO}/tingeso-frontend:latest"
        BACKEND_IMAGE = "${DOCKER_HUB_REPO}/tingeso-backend:latest"
        GIT_REPOSITORY = "https://github.com/bastianolea/proyecto-tingeso"  // Reemplazar con tu repositorio GitHub
        DB_HOST = "192.168.100.16" // Dirección IP para la base de datos
    }

    stages {
        stage('Clonar Repositorio') {
            steps {
                git branch: 'main', url: "${GIT_REPOSITORY}"
            }
        }

        stage('Construir Backend') {
            steps {
                dir('proyecto-tingeso') {
                    sh './mvnw clean package -DskipTests'  // Construir el JAR sin ejecutar pruebas
                }
            }
        }

        stage('Crear Imagen Docker del Backend') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_HUB_CREDENTIALS}") {
                        sh 'docker build -t ${BACKEND_IMAGE} -f proyecto-tingeso/Dockerfile proyecto-tingeso'
                        sh 'docker push ${BACKEND_IMAGE}'
                    }
                }
            }
        }

        stage('Crear Imagen Docker del Frontend') {
            steps {
                dir('proyecto-tingeso-frontend') {
                    script {
                        sh 'npm install'  // Instalar dependencias
                        sh 'npm run build'  // Crear build del frontend
                    }
                    script {
                        docker.withRegistry('', "${DOCKER_HUB_CREDENTIALS}") {
                            sh 'docker build -t ${FRONTEND_IMAGE} -f Dockerfile .'
                            sh 'docker push ${FRONTEND_IMAGE}'
                        }
                    }
                }
            }
        }

        stage('Desplegar en Azure con Docker Compose') {
            steps {
                sh """
                docker compose down
                docker compose up -d
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado'
        }
        success {
            echo 'El despliegue fue exitoso'
        }
        failure {
            echo 'El despliegue falló'
        }
    }
}
