#!/bin/bash

# Build and push Mukham Docker image to ECR

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Check arguments
if [[ $# -lt 1 || $# -gt 2 ]]; then
    print_error "Usage: $0 <environment> [image_tag]"
    print_error "Environment: dev or prod"
    print_error "Image tag: optional, defaults to 'latest'"
    exit 1
fi

ENVIRONMENT="$1"
IMAGE_TAG="${2:-latest}"

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    print_error "Environment must be 'dev' or 'prod'"
    exit 1
fi

# Load environment variables
ENV_FILE="$SCRIPT_DIR/../config/${ENVIRONMENT}.env"
load_env "$ENV_FILE"

# Check AWS CLI
check_aws

# Set repository name
REPO_NAME="${PROJECT_NAME}-${ENVIRONMENT}-mukham"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}"

print_info "Building Mukham Docker image for $ENVIRONMENT environment"

# Navigate to project root
cd "$SCRIPT_DIR/../.."

# Build the Docker image for linux/amd64 platform
print_info "Building Docker image..."
docker build --platform linux/amd64 -f Dockerfile -t "${REPO_NAME}:${IMAGE_TAG}" .

if [[ $? -ne 0 ]]; then
    print_error "Failed to build Docker image"
    exit 1
fi

# Tag the image for ECR
docker tag "${REPO_NAME}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"

# Login to ECR
print_info "Logging into ECR..."
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

# Create ECR repository if it doesn't exist
print_info "Creating ECR repository if it doesn't exist..."
aws ecr describe-repositories --repository-names "$REPO_NAME" 2>/dev/null || \
aws ecr create-repository --repository-name "$REPO_NAME" --region "$REGION"

# Push the image
print_info "Pushing image to ECR..."
docker push "${ECR_URI}:${IMAGE_TAG}"

if [[ $? -eq 0 ]]; then
    print_success "Mukham Docker image pushed successfully!"
    print_info "Image URI: ${ECR_URI}:${IMAGE_TAG}"
else
    print_error "Failed to push Docker image"
    exit 1
fi
