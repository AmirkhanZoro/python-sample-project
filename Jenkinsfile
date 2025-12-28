pipeline {
  agent any
  environment {
    IMAGE_NAME = "fastapi-redis"
  }


  stages {
    stage('Lint') {
      steps {
        sh 'pip install flake8'
        sh 'flake8 .'
      }
    }

    stage('Build') {
      steps {
        sh 'docker build -t $IMAGE_NAME:${BUILD_NUMBER} .'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }

  
  post {
    failure {
      mail to: 'devops@lobos.com',
           subject: 'Lobos-Sample-Project Pipeline Failed',
           body: 'Check Jenkins logs'
    }
  }


}