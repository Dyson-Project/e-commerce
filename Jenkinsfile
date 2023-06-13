#!groovy
pipeline {
    agent {
        label 'node4'
    }
    environment {
        registryCredential = 'rd-registry-tiktzuki'
        dockerImageName = "tiktzuki/ecommerce"
        dockerImage = ""
    }
    stages {
        stage("Build") {
            steps {
                sh './gradlew sale:bootJar'
                script {
                    dockerImage = docker.build(dockerImageName, "./sale")
                }
                script {
                    docker.withRegistry('https://registry.hub.docker.com', registryCredential) {
                        dockerImage.push("latest")
                    }
                }
            }
        }
        stage("Deploy") {
            steps {
                sh 'kubectl apply -f k8s/configmap.yaml -n eshop'
                sh 'kubectl delete -f k8s/deployment.yaml -n eshop || true'
                sh 'kubectl apply -f k8s/deployment.yaml -n eshop'
                sh 'kubectl apply -f k8s/service.yaml -n eshop'
            }
        }
    }
}
