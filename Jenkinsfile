@Library('shared-pipeline-lib') _

pipeline {
    agent any
    parameters {
        string(name: 'DEPLOY_ENV', defaultValue: 'production', description: 'Deployment environment')
        string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'Docker image tag')
    }
    environment {
        NODE_ENV = 'production'
        AWS_REGION = 'us-east-1' // Change as needed
        EKS_CLUSTER_NAME = 'my-eks-cluster' // Change as needed
        KUBE_NAMESPACE = 'default' // Change as needed
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
        stage('Docker Build & Push') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.$AWS_REGION.amazonaws.com
                        docker build -t <your-account-id>.dkr.ecr.$AWS_REGION.amazonaws.com/express-app:${IMAGE_TAG} .
                        docker push <your-account-id>.dkr.ecr.$AWS_REGION.amazonaws.com/express-app:${IMAGE_TAG}
                    '''
                }
            }
        }
        stage('Deploy to EKS') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                        aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME
                        kubectl set image deployment/express-app express-app=<your-account-id>.dkr.ecr.$AWS_REGION.amazonaws.com/express-app:${IMAGE_TAG} -n $KUBE_NAMESPACE
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
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
