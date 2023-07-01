#!groovy
pipeline {
    agent {
        label 'node4'
    }
    environment {
        registryCredential = 'rd-registry-tiktzuki'
        dockerImageName = "tiktzuki/ecommerce"
        dockerImage = ""
        saleFeDockerImageName = "tiktzuki/sale-fe"
        saleFeDockerImage = ""
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
        stage("Build fe"){
        steps{
                script {
                    saleFeDockerImage = docker.build(saleFeDockerImageName, "./sale-fe")
                }
                script {
                    docker.withRegistry('https://registry.hub.docker.com', registryCredential) {
                        saleFeDockerImage.push("latest")
                    }
                }
        }
        }
        stage("Deploy fe"){
        steps{
                sh 'kubectl apply -f k8s/sale-fe/configmap.yaml -n eshop'
                sh 'kubectl delete -f k8s/sale-fe/deployment.yaml -n eshop || true'
                sh 'kubectl apply -f k8s/sale-fe/deployment.yaml -n eshop'
                sh 'kubectl apply -f k8s/sale-fe/service.yaml -n eshop'
        }
        }
    }
}
