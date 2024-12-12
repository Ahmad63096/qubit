pipeline {
    agent any 
    environment {
        ImageName = "qubit_fe"
        VersionPrefix = "0.8"
        HostPort = "8060"
        ContainerPort = "80"
        BuildVersion = "${VersionPrefix}.${env.BUILD_NUMBER}" // Centralized BuildVersion
        DockerImage = "${ImageName}:${BuildVersion}"         // Centralized Docker Image Name
        ContainerName = "qubit_fe"    // Use BuildVersion for container name
        RepoPath = "/home/ubuntu/projects/Qubit-LeadGen"
        RepoURL = "git@github.com:m-hamzaa22/Qubit-LeadGen.git"
        BranchName = "Qubit_Fe"
    }
    stages {
        stage("Docker Image Built") {
            steps {
                script {
                    // Ask user if they want to build the Docker image locally
                    def userInput = input(
                        id: 'UserInput', message: 'Do you want to proceed with building the image?',
                        parameters: [
                            [$class: 'BooleanParameterDefinition', name: 'Proceed', defaultValue: true, description: 'Proceed with building the Docker image?']
                        ]
                    )
                    if (!userInput) {
                        currentBuild.result = 'ABORTED'
                        echo 'Build aborted by user.'
                        return
                    }
                    
                    // Build the Docker image
                    echo "Building the Docker image: ${DockerImage}..."
                    def dockerImage = docker.build(DockerImage)
                    echo "Docker image '${dockerImage}' has been built."
                }
            }
        }
        stage("Run Docker Image Locally") {
            when {
                expression {
                    // Run this stage only if the previous stage was successful
                    return currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                script {
                    // Check if the container exists
                    def containerExists = sh(
                        script: "docker ps -a --format '{{.Names}}' | grep -w ${ContainerName}",
                        returnStatus: true
                    ) == 0

                    if (containerExists) {
                        echo "Container '${ContainerName}' already exists. Removing it..."
                        sh "docker rm -f ${ContainerName}"
                    } else {
                        echo "Container '${ContainerName}' doesn't exist. Proceeding with deployment..."
                    }

                    // Run the new container with the dynamically generated name
                    sh "docker run -d --name ${ContainerName} -p ${HostPort}:${ContainerPort} --restart always ${DockerImage}"
                    echo "Docker container '${ContainerName}' is now running with ports ${HostPort}:${ContainerPort}."
                }
            }
        }
        stage ("Build and Run Docker on AWS EC2...") {
            when {
                expression {
                    return currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                script {
                    // Ask for user confirmation before proceeding with the EC2 build
                    def userInput = input(
                        id: 'UserInput', message: 'Do you want to proceed with building the image on EC2?',
                        parameters: [
                            [$class: 'BooleanParameterDefinition', name: 'Proceed', defaultValue: true, description: 'Proceed with building the Docker image on EC2?']
                        ]
                    )

                    if (!userInput) {
                        currentBuild.result = 'ABORTED'
                        echo 'Build on AWS EC2 aborted by the user.'
                        return
                    }

                    // Build Image on EC2 and use SSH agent to connect
                    sshagent(['ssh-ec2-devpandas']) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no ubuntu@devspandas.com << EOF
                            echo "Connected to EC2"
                            whoami

                            # Navigate to the project directory
                            echo "Navigating to the project directory..."
                            cd /home/ubuntu/projects/Qubit-LeadGen || { echo "Directory not found!"; exit 1; }


                            # Clone the repository if it doesn't exist, otherwise pull the latest changes
                            if [ ! -d "${RepoPath}" ]; then
                                echo "Cloning repository..."
                                git clone ${RepoURL} ${RepoPath} || { echo "Git clone failed!"; exit 1; }
                            else 
                                echo "Repository already exists. Pulling latest changes..."
                                cd ${RepoPath} || { echo "Failed to change directory to ${RepoPath}!"; exit 1; }
                                
                                git checkout ${BranchName} || { echo "Failed to checkout branch ${BranchName}!"; exit 1; }

                                git pull origin ${BranchName} || { echo "Git pull failed!"; exit 1; }
                            fi

                            echo "Building The Docker Image"
                            docker build -t ${DockerImage} . || { echo "Docker build failed!"; exit 1; }


                            if docker ps -a --format '{{.Names}}' | grep -w ${ContainerName}; then
                                echo "Container '${ContainerName}' already exists. Removing it... "
                                docker rm -f ${ContainerName} || { echo "Failed to remove existing container!"; exit 1; }
                            else
                                echo "No Existing Container name '${ContainerName}'. Proceeding with deployment... "
                            fi

                            # Run the Docker Container
                            echo "Running Docker Container '${ContainerName}'..."
                            docker run -d --name ${ContainerName} -p ${HostPort}:${ContainerPort} --restart always ${DockerImage} || { echo "Failed to run Docker container!"; exit 1; }
                            echo "Docker container '${ContainerName}' is now running with ports ${HostPort}:${ContainerPort}."


EOF
                        '''
                    }
                }
            }
        }
    }
}
