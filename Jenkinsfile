pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Jaisree146/multi-container-app.git'
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker-compose -p multi-container-app down || true'
            }
        }

        stage('Build') {
            steps {
                sh 'docker-compose -p multi-container-app build'
            }
        }

        stage('Run') {
            steps {
                sh 'docker-compose -p multi-container-app up -d'
            }
        }

        stage('Check') {
            steps {
                sh 'docker ps'
            }
        }
    }
}