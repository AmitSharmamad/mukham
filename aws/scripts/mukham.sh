#!/bin/bash

# Mukham Service Deployment Script
# Builds, pushes Docker image, and deploys Mukham service on ECS

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

# Check dependencies
check_aws
if ! command -v docker &> /dev/null; then
    print_error "Docker not found. Please install Docker."
    exit 1
fi

# ECR repository name
MUKHAM_REPO_NAME="${PROJECT_NAME}-${ENVIRONMENT}-mukham"

print_info "Deploying Mukham service for $ENVIRONMENT environment with tag $IMAGE_TAG"

# Get AWS Account ID if not set
if [[ -z "$AWS_ACCOUNT_ID" ]]; then
    AWS_ACCOUNT_ID=$(get_aws_account_id)
fi

# Ensure ECR repository exists
if ! aws ecr describe-repositories --repository-names "$MUKHAM_REPO_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
    print_info "ECR repository doesn't exist. Creating it..."
    "$SCRIPT_DIR/setup-ecr.sh" "$ENVIRONMENT"
fi

# Get ECR login token and login
print_info "Logging into ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# ECR URI
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${MUKHAM_REPO_NAME}"

# Build Docker image
print_info "Building Docker image..."
cd "$SCRIPT_DIR/../../"

docker build -t "$MUKHAM_REPO_NAME:$IMAGE_TAG" .

if [[ $? -ne 0 ]]; then
    print_error "Docker build failed!"
    exit 1
fi

# Tag image for ECR
docker tag "$MUKHAM_REPO_NAME:$IMAGE_TAG" "$ECR_URI:$IMAGE_TAG"

# Push to ECR
print_info "Pushing image to ECR..."
docker push "$ECR_URI:$IMAGE_TAG"

if [[ $? -eq 0 ]]; then
    print_success "Image pushed successfully: $ECR_URI:$IMAGE_TAG"
else
    print_error "Failed to push image to ECR!"
    exit 1
fi

# Deploy ECS service
print_info "Deploying ECS service..."

STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-mukham"
TEMPLATE_FILE="$SCRIPT_DIR/../templates/mukham.yaml"

aws cloudformation deploy \
    --template-file "$TEMPLATE_FILE" \
    --stack-name "$STACK_NAME" \
    --parameter-overrides \
        Environment="$ENVIRONMENT" \
        ProjectName="$PROJECT_NAME" \
        ImageTag="$IMAGE_TAG" \
        MukhamPort="$MUKHAM_PORT" \
        CPU="$MUKHAM_CPU" \
        Memory="$MUKHAM_MEMORY" \
        NodeEnv="$NODE_ENV" \
        VpcId="$VPC_ID" \
        PublicSubnet1Id="$PUBLIC_SUBNET_1_ID" \
        PublicSubnet2Id="$PUBLIC_SUBNET_2_ID" \
        PrivateSubnet1Id="$PRIVATE_SUBNET_1_ID" \
        PrivateSubnet2Id="$PRIVATE_SUBNET_2_ID" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "$AWS_REGION"

if [[ $? -eq 0 ]]; then
    print_success "Mukham service deployed successfully!"
    
    # Get service URL
    ALB_DNS=$(get_stack_output "$STACK_NAME" "LoadBalancerDNS" 2>/dev/null || echo "Not available")
    print_info "Service URL: http://$ALB_DNS"
else
    print_error "Mukham service deployment failed!"
    exit 1
fi
