pipeline {
    agent {
        docker {
            image 'node:18.18.0-alpine3.18' 
            args '-p 3005:3005'
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
        // stage('Test') {
        //     steps {
        //         sh './jenkins/scripts/test.sh'
        //     }
        // }
        stage('Deliver') { 
            steps {
                sh 'npm run build'
                sh 'npm start'
                // sh './jenkins/scripts/deliver.sh' 
                // input message: 'Finished using the web site? (Click "Proceed" to continue)' 
                // sh './jenkins/scripts/kill.sh' 
            }
        }
    }
}
