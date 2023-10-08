pipeline {
    agent any
    stages {
        stage('Checkout SCM') {
			steps {
				git 'https://github.com/2100711/ICT3103-TickyTocky.git'
			}
		}

		stage('OWASP DependencyCheck') {
			steps {
				dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
			}
		}
        // stage('Build') {
        //     steps {
        //         dir("client") {
        //             sh 'npm install'
        //         }
        //     }
        // }
        // stage('Test') {
        //     steps {
        //         sh './jenkins/scripts/test.sh'
        //     }
        // }
        // stage('Deliver') { 
        //     steps {
        //         dir("client") {
        //             sh 'npm run build'
        //             sh 'npm start'
        //         }
        //         // sh './jenkins/scripts/deliver.sh' 
        //         // input message: 'Finished using the web site? (Click "Proceed" to continue)' 
        //         // sh './jenkins/scripts/kill.sh' 
        //     }
        // }
    }
	post {
		success {
			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
		}
	}
}
