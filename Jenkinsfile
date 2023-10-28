pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building the application'
                script {
                    sh 'apt install -y nodejs npm'
                }
                dir('client') {
                    script {
                        echo 'Installing client dependencies'
                        sh 'npm install'
                    }
                }
                dir('server') {
                    script {
                        echo 'Installing server dependencies'
                        sh 'npm install'
                    }
                }
                script { //Test warning nextgen
                    sh '/var/jenkins_home/apache-maven-3.6.3/bin/mvn --batch-mode -V -U -e clean verify -Dsurefire.useFile=false -Dmaven.test.failure.ignore'
                }
            }
        }

        stage('Test') {
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
                dir('client') {
                    script {
                        echo 'TODO: Add client tests'
                        // sh 'npm test' // Modify this line for your specific testing framework
                    }
                }
                dir('server') {
                    script {
                        echo 'TODO: Add server tests'
                        // sh 'npm test' // Modify this line for your specific testing framework
                    }
                }
            }
        }
        stage('Analysis') {
            steps {
                sh '/var/jenkins_home/apache-maven-3.6.3/bin/mvn --batch-mode -V -U -e checkstyle:checkstyle pmd:pmd pmd:cpd findbugs:findbugs'
            }
        }// Test for warning next gen plugin

        stage('Deploy') {
            steps {
                dir('server') {
                    script {
                        withCredentials([string(credentialsId: 'DB_USER', variable: 'DB_USER'), string(credentialsId: 'DB_PASS', variable: 'DB_PASS')]) {
                            echo 'Creating .env file with credentials'
                            sh 'echo "DB_USER=$DB_USER" >> .env'
                            sh 'echo "DB_PASS=$DB_PASS" >> .env'
                            echo 'Starting the server'
                            sh 'npm start & sleep 10'
                        }
                    }
                }
                script {
                    echo 'Deploying to staging environment'
                    // This stage can include steps to deploy your application to a staging environment for further testing
                }
                script {
                    echo 'Running tests in the staging environment'
                    // This stage can include tests specific to the staging environment
                }
                script {
                    echo 'Deploying to production environment'
                    // This stage can include steps to deploy your application to the production environment
                }
            }
        }        
        // Add more stages as needed, such as database migrations, security scanning, and more.
    }

    // Global success and failure conditions for the entire pipeline
    post {
        // always {
        //     junit testResults: '**/target/surefire-reports/TEST-*.xml'
        //     recordIssues enabledForFailure: true, tools: [mavenConsole(), java(), javaDoc()]
        //     recordIssues enabledForFailure: true, tool: checkStyle()
        //     recordIssues enabledForFailure: true, tool: spotBugs(pattern:'**/target/findbugsXml.xml')
        //     recordIssues enabledForFailure: true, tool: cpd(pattern: '**/target/cpd.xml')
        //     recordIssues enabledForFailure: true, tool: pmdParser(pattern: '**/target/pmd.xml')
        // }
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            echo "Pipeline successfully completed."
        }
        failure {
            echo "Pipeline failed. Please investigate."
        }
    }
}
