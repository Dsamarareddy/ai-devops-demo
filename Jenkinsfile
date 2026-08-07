// Jenkinsfile (Declarative Pipeline)
@Library('shared-pipeline-lib') _

pipeline {
    agent any
    environment {
        // Add environment variables here if needed
        NODE_ENV = 'production'
    }
    parameters {
        string(name: 'DEPLOY_ENV', defaultValue: 'production', description: 'Deployment environment')
        string(name: 'APP_VERSION', defaultValue: 'latest', description: 'Application version tag')
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
                        aws eks update-kubeconfig --region $AWS_DEFAULT_REGION --name $EKS_CLUSTER_NAME
                        kubectl apply -f k8s/
                    '''
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Build, test, and deploy succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
