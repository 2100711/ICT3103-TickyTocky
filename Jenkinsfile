pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building the application'
                script {
                    sh 'docker compose up --build -d frontend backend'
                    sh 'docker ps'
                }
            }
        }
        stage('Frontend UI Test') {
            stage('Install dependencies for selenium') {
                steps {
                    dir('tests') {
                        script {
                            sh 'dependencyScript.sh'
                        }
                    }
                }
            }
            stage('OWASP DependencyCheck') {
                steps {
                    dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
                }

            }
			parallel {
                stage('Test 1 idk bro do what') {
                    steps {
                        dir('tests') {
                            script {
                                echo 'Testing for idk test1 name bro'
                                sh 'python seleniumTest.py'
                            }
                        }
                    }
                }
                stage('Test 2 idk bro do what') {
                    steps {
                        dir('tests') {
                            script {
                                echo 'Testing for idk test1 name bro'
                                sh 'python seleniumTest.py'
                            }
                        }
                    }
                }
                post {
                    success {
                        echo 'Passed with flying colors'
                    }
                    failure {
                        echo 'Failure sia you'
                    }
                }
            }
        }
        //stage('Deploy') {
        //    steps {
        //        dir('server') {
        //            script {
        //                withCredentials([string(credentialsId: 'DB_USER', variable: 'DB_USER'), string(credentialsId: 'DB_PASS', variable: 'DB_PASS')]) {
        //                    echo 'Creating .env file with credentials'
        //                    sh 'echo "DB_USER=$DB_USER" >> .env'
        //                    sh 'echo "DB_PASS=$DB_PASS" >> .env'
        //                    echo 'Starting the server'
        //                    sh 'npm start & sleep 10'
        //               }
        //            }
        //        }
        //        script {
        //            echo 'Deploying to staging environment'
        //            // This stage can include steps to deploy your application to a staging environment for further testing
        //        }
        //        script {
        //            echo 'Running tests in the staging environment'
        //            // This stage can include tests specific to the staging environment
        //        }
        //        script {
        //            echo 'Deploying to production environment'
        //            // This stage can include steps to deploy your application to the production environment
        //       }
        //    }
        //}        
        // Add more stages as needed, such as database migrations, security scanning, and more.
    }

    // Global success and failure conditions for the entire pipeline
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            echo "Pipeline successfully completed."
            sh 'docker-compose down frontend backend'
            sh 'docker image prune -f'
            echo "Image cleared"
        }
        failure {
            echo "Pipeline failed. Please investigate."
        }
    }
}
