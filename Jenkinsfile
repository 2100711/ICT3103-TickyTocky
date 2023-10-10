pipeline {
    agent {
        docker {
            image 'node:18.18.0-alpine3.18' 
            args '-p 3005:3005' 
        }
    }

    stages {
        stage('Checkout SCM') {
			steps {
				git '/home'
			}
		}

        stage('Build Client') {
            steps {
                dir('client') {
                    script {
                        echo 'Installing client dependencies'
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
            post {
                success {
                    // Display a success message in the Jenkins console
                    echo "Build Client successfully completed."
                }
                failure {
                    // Display a failure message in the Jenkins console
                    echo "Build Client failed. Please investigate."
                }
            }
        }

        stage('Test Client') {
            steps {
                dir('client') {
                    script {
                        echo 'TODO: Add client tests'
                        // sh 'npm test' // Modify this line for your specific testing framework
                    }
                }
            }
            post {
                success {
                    // Display a success message in the Jenkins console
                    echo "Test Client successfully completed."
                }
                failure {
                    // Display a failure message in the Jenkins console
                    echo "Test Client failed. Please investigate."
                }
            }
        }

        stage('Build Server') {
            steps {
                withCredentials([string(credentialsId: 'DB_USER', variable: 'DB_USER'), string(credentialsId: 'DB_PASS', variable: 'DB_PASS')]) {
                    dir('server') {
                        script {
                            echo 'Installing server dependencies'
                            sh 'npm install'

                            // Create a .env file with credentials
                            sh 'echo "DB_USER=$DB_USER" >> .env'
                            sh 'echo "DB_PASS=$DB_PASS" >> .env'

                            echo 'Starting the server'
                            sh 'npm start & sleep 10'
                        }
                    }
                }
            }
            post {
                success {
                    // Display a success message in the Jenkins console
                    echo "Build Server successfully completed."
                }
                failure {
                    // Display a failure message in the Jenkins console
                    echo "Build Server failed. Please investigate."
                }
            }
        }

        stage('Test Server') {
            steps {
                dir('server') {
                    script {
                        echo 'TODO: Add server tests'
                        // sh 'npm test' // Modify this line for your specific testing framework
                    }
                }
            }
            post {
                success {
                    // Display a success message in the Jenkins console
                    echo "Test Server successfully completed."
                }
                failure {
                    // Display a failure message in the Jenkins console
                    echo "Test Server failed. Please investigate."
                }
            }
        }

        stage('OWASP Dependency-Check') {
            steps {
                dependencyCheck additionalArguments: '', odcInstallation: 'OWASP Dependency Check'
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            }
            post {
                success {
                    // Display a success message in the Jenkins console
                    echo "OWASP Dependency-Check successfully completed."
                }
                failure {
                    // Display a failure message in the Jenkins console
                    echo "OWASP Dependency-Check failed. Please investigate."
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                script {
                    echo 'Deploying to staging environment'
                    // This stage can include steps to deploy your application to a staging environment for further testing
                }
            }
            post {
                success {
                    // Display a success message in the Jenkins console
                    echo "Deploy to Staging successfully completed."
                }
                failure {
                    // Display a failure message in the Jenkins console
                    echo "Deploy to Staging failed. Please investigate."
                }
            }
        }

        stage('Test Staging') {
            steps {
                script {
                    echo 'Running tests in the staging environment'
                    // This stage can include tests specific to the staging environment
                }
            }
            post {
                success {
                    // Display a success message in the Jenkins console
                    echo "Test Staging successfully completed."
                }
                failure {
                    // Display a failure message in the Jenkins console
                    echo "Test Staging failed. Please investigate."
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    echo 'Deploying to production environment'
                    // This stage can include steps to deploy your application to the production environment
                }
            }
            post {
                success {
                    // Display a success message in the Jenkins console
                    echo "Deploy to Production successfully completed."
                }
                failure {
                    // Display a failure message in the Jenkins console
                    echo "Deploy to Production failed. Please investigate."
                }
            }
        }

        // Add more stages as needed, such as database migrations, security scanning, and more.
    }

    // Global success and failure conditions for the entire pipeline
    post {
        success {
            echo "Pipeline successfully completed."
        }
        failure {
            echo "Pipeline failed. Please investigate."
        }
    }
}
