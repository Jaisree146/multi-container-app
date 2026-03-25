pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Jaisree146/multi-container-app.git'
            }
        }

        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Run') {
            steps {
                sh 'docker-compose up -d'
            }
        }

        stage('Check') {
            steps {
                sh 'docker ps'
            }
        }
    }
}