pipeline {
    agent {
        docker {
            image 'node:18.18.0-alpine3.18' 
            args '-p 3000:3000' 
        }
    }
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
}
