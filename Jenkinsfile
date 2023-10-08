pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'pwd'
                // Define the source and destination directories
                def sourceDir = 'client'
                def destinationDir = 'client@tmp'
                    
                // Create the destination directory if it doesn't exist
                sh "mkdir -p $destinationDir"
                    
                // Copy the contents of the source directory to the destination directory
                sh "cp -r $sourceDir/* $destinationDir/"
                
                sh "cd $destinationDir"

                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh './jenkins/scripts/test.sh'
            }
        }
        stage('Deliver') { 
            steps {
                sh './jenkins/scripts/deliver.sh' 
                input message: 'Finished using the web site? (Click "Proceed" to continue)' 
                sh './jenkins/scripts/kill.sh' 
            }
        }
    }
}
