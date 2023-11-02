pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building the application'
                script {
                    sh 'docker compose build frontend backend'
                    sh 'docker compose stop frontend backend'
                    sleep(time:20, unit: "SECONDS")
                    sh 'docker rm frontend backend'
                    sleep(time:10, unit: "SECONDS")
                    sh 'docker ps'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application'
                script {
                    sh 'docker compose up -d --force-recreate frontend backend'
                    sh 'docker ps'
                }
            }
            post {
                success {
                    echo 'Deployed!'
                }
                failure {
                    echo 'Failure sia you'
                }
            }
        }
        stage('Install dependencies for selenium') {
            steps {
                dir('tests') {
                    script {
                        sh 'dependencyScript.sh'
                    }
                }
            }
            post {
                success {
                    echo 'Installed!'
                }
                failure {
                    echo 'Failure sia you'
                }
            }
        }
        //stage('OWASP DependencyCheck') {
        //    steps {
        //        dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
        //    }
        //}
        stage('Frontend Test') {
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
                    post {
                        success {
                            echo 'Passed with flying colors'
                        }
                        failure {
                            echo 'Failure sia you'
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
        }
        stage('Backend Test') {
            steps {
                dir('server') {
                    script {
                        sh 'apt install -y nodejs npm'
                        sh 'npm install'
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
            //dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            echo "Pipeline successfully completed."
            //sh 'docker-compose down frontend backend'
            sh 'docker system prune -f'
            echo "Removed Dangling Containers and Images"
        }
        failure {
            echo "Pipeline failed. Please investigate."
        }
    }
}
