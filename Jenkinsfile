pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    IMAGE_NAME = 'fastapi-redis'
    APP_IMAGE  = "fastapi-redis:${env.BUILD_NUMBER}"
  }

  stages {
    stage('Lint') {
      agent {
        docker {
          image 'python:3.12-slim'
          args '-e HOME=/tmp'
          reuseNode true
        }
      }
      steps {
        sh 'pip install --user flake8'
        sh 'python -m flake8 .'
      }
    }

    stage('Build') {
      steps {
        sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER -t $IMAGE_NAME:latest .'
      }
    }

    stage('Deploy') {
      when {
        expression { env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main' }
      }
      steps {
        input message: 'Deploy to production?', ok: 'Deploy'
        sh 'docker compose -p fastapi-redis up -d'
        sh '''
          sleep 5
          curl -fsS http://localhost:8000/openapi.json > /dev/null
        '''
      }
    }
  }

  post {
    failure {
      mail to: 'devops@lobos.com',
           subject: "Lobos-Sample-Project Pipeline Failed (#${env.BUILD_NUMBER})",
           body: "Build ${env.BUILD_URL} failed. Check the Jenkins logs."
    }
  }
}
