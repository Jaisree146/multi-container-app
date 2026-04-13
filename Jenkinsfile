pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "multi-container-app"
    }

    stages {

        stage('Cleanup Old Containers') {
            steps {
                sh '''
                echo "Stopping old containers..."
                docker-compose -p $COMPOSE_PROJECT_NAME down || true

                echo "Removing conflicting containers..."
                docker rm -f prometheus || true
                docker rm -f mysql_db || true
                docker rm -f backend || true
                docker rm -f frontend || true
                docker rm -f grafana || true
                '''
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                echo "Building Docker images..."
                docker-compose -p $COMPOSE_PROJECT_NAME build
                '''
            }
        }

        stage('Run Containers') {
            steps {
                sh '''
                echo "Starting containers..."
                docker-compose -p $COMPOSE_PROJECT_NAME up -d
                '''
            }
        }

        stage('Verify Running Containers') {
            steps {
                sh '''
                echo "Listing running containers..."
                docker ps
                echo "Checking if Grafana is running..."
                docker ps | grep grafana
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check logs.'
        }
    }
}