@Library('shared-pipeline-lib') _

pipeline {
    agent any
    environment {
        // Add any required environment variables here
    }
    parameters {
        string(name: 'DEPLOY_ENV', defaultValue: 'production', description: 'Deployment environment')
        string(name: 'VERSION_TAG', defaultValue: '', description: 'Version tag for deployment')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build || echo "No build script defined"'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy to AWS EKS') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                        aws eks update-kubeconfig --name $DEPLOY_ENV
                        kubectl apply -f k8s/
                    '''
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Build, test, and deploy succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
