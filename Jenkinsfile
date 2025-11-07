pipeline {
    agent any

    environment {	
		VAULT_ADDR = 'http://localhost:8200'
		VAULT_AUTH_METHOD = 'approle'
        VAULT_APPROLE_ROLE_ID = credentials('vault_role_id')
        VAULT_APPROLE_SECRET_ID = credentials('vault_secret_id')
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Cloning repository...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image for Node.js app...'
                sh 'docker compose build nodeapp'
            }
        }

        stage('Restart Node App') {
            steps {
                echo '🔁 Restarting Node.js container...'
                // Stop only nodeapp, keep Vault & MySQL running
                sh '''
                    docker compose stop nodeapp || true
                    docker compose rm -f nodeapp || true
                    docker compose up -d nodeapp
                '''
            }
        }

        stage('Verify Service') {
            steps {
                echo '🩺 Checking Node.js app health...'
                // Tunggu sampai service siap
                sh '''
                    sleep 5
                    curl -f http://localhost:3000 || (echo "Node.js app not responding!" && exit 1)
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment succeeded!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}

