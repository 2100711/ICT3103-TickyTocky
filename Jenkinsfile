pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                dir("client") {
                    sh 'npm install'
                }
            }
        }
        stage('Test') { 
            steps {
                dir("client") {
                    sh 'npm test'
                    sh 'echo $! > .pidfile'
                }
            }
        }
		stage('OWASP DependencyCheck') {
			steps {
				dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
			}
		}
        stage('Deliver') { 
            steps {
                dir("client") {
                    sh 'npm run build'
                    sh 'npm start'
                    input message: 'Finished using the web site? (Click "Proceed" to continue)'
                    sh 'kill $(cat .pidfile)'
                }
            }
        }
    }
	post {
		success {
			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
		}
	}
}
