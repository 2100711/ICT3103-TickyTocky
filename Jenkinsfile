pipeline {
    agent {
        docker {
            image 'node:18.18.0-alpine3.18' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build Client') {
            steps {
                dir('client') {
                    script {
                        // Clean and install client dependencies
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Test Client') {
            steps {
                dir('client') {
                    script {
                        // Run client tests
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Build Server') {
            steps {
                dir('server') {
                    script {
                        // Clean and install server dependencies
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Test Server') {
            steps {
                dir('server') {
                    script {
                        // Run server tests
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Deliver') {
            steps {
                // Add delivery steps here if needed
            }
        }
    }

    post {
        success {
            // Add post-build actions here
        }
        failure {
            // Add failure actions here
        }
    }
}
