# 🧬 Project NexusGenome

NexusGenome is a full-stack, cloud-native application simulating a cutting-edge Genomic Profiling and AI Therapeutics prediction platform. This project serves as a comprehensive DevOps examination showcase, featuring modern web development, containerization, Infrastructure as Code (IaC), Continuous Integration/Continuous Deployment (CI/CD), and Kubernetes orchestration with Chaos Engineering resilience.

## 🌟 Key Features

- **Dynamic Genomic Dashboard**: A premium React-based UI with dark/light mode toggles, interactive patient DNA sequence visualizers, and AI drug-response recommendations.
- **Resilient Backend API**: Node.js & Express REST API powered by MongoDB, designed to withstand simulated network failures.
- **Chaos Engineering & Auto-Fallback**: The frontend gracefully degrades to local mock states if the backend goes down, ensuring zero perceived downtime.
- **Automated Scalability**: Kubernetes Horizontal Pod Autoscaler (HPA) configured to automatically replicate backend pods during simulated traffic spikes.
- **End-to-End CI/CD**: Fully automated Jenkins pipeline for building Docker images and deploying to AWS EKS.

## 🏗️ Architecture & Components

### 1. Frontend UI (`/src` & `/`)
- **Tech Stack**: React, Vite, Nginx.
- **Description**: A responsive, high-contrast dashboard with cross-tab synchronization. It serves as the primary client, communicating with the backend API or falling back to local state during outages.
- **Deployment**: Containerized with multi-stage Docker builds and served via Nginx. Deployed to Kubernetes as a `LoadBalancer` service for public access.

### 2. Backend API (`/nexusgenome-backend`)
- **Tech Stack**: Node.js, Express, Mongoose (MongoDB).
- **Description**: Handles patient profiles, AI therapy recommendations, and chaos engineering simulations. It includes auto-seeding logic to populate the Atlas cluster with test data.
- **Deployment**: Containerized and deployed to Kubernetes as an internal `ClusterIP` service.

### 3. Database
- **Tech Stack**: MongoDB.
- **Description**: Stores genomic sequences and therapeutic responses.
- **Deployment**: Runs locally via `docker-compose` or on Kubernetes as an internal `ClusterIP` service.

### 4. Infrastructure & DevOps
- **Docker Compose**: The `docker-compose.yml` file allows developers to spin up the entire stack locally with a single command.
- **Terraform (`main.tf`)**: Infrastructure as Code to provision an AWS VPC, NAT Gateway, and an Elastic Kubernetes Service (EKS) cluster.
- **Kubernetes Manifests (`/k8s`)**:
  - `mongo.yaml`: DB deployment and service.
  - `backend.yaml`: API deployment, service, and HPA.
  - `frontend.yaml`: UI deployment and LoadBalancer service.
- **Jenkins CI/CD (`Jenkinsfile`)**: Automates the build and push of Docker images to Docker Hub and simulates deployment.

## 🚀 Getting Started

### Local Development (Docker Compose)
1. Ensure Docker Desktop is running.
2. Build and start the cluster locally:
   ```bash
   docker-compose up --build -d
   ```
3. Access the application:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:5001/api`

### Cloud Deployment (AWS EKS)
1. **Provision Infrastructure**:
   ```bash
   terraform init
   terraform apply
   ```
2. **Update Kubeconfig**:
   ```bash
   aws eks --region ap-south-1 update-kubeconfig --name nexusgenome-cluster
   ```
3. **Deploy Application**:
   ```bash
   kubectl apply -f k8s/mongo.yaml
   kubectl apply -f k8s/backend.yaml
   kubectl apply -f k8s/frontend.yaml
   ```

## 🛡️ Chaos Engineering Simulation
The application is built to pass a "Spike Workload Demand" and "Outage" test.
- When backend traffic spikes, the **Horizontal Pod Autoscaler (HPA)** scales the API from 2 to 10 pods.
- If the backend becomes unreachable, the React frontend detects the timeout and seamlessly switches to local mock data.

---
*Developed as a DevOps Examination Showcase.*
