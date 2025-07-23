#!/bin/bash

# ECR Repository Setup Script
# Creates ECR repositories needed for the Mukham service

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Check arguments
if [[ $# -ne 1 ]]; then
    print_error "Usage: $0 <environment>"
    print_error "Environment: dev or prod"
    exit 1
fi

ENVIRONMENT="$1"

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

print_info "Setting up ECR repositories for $ENVIRONMENT environment"

# Get AWS Account ID if not set
if [[ -z "$AWS_ACCOUNT_ID" ]]; then
    AWS_ACCOUNT_ID=$(get_aws_account_id)
fi

# Create Mukham ECR repository
MUKHAM_REPO_NAME="${PROJECT_NAME}-${ENVIRONMENT}-mukham"

if ! aws ecr describe-repositories --repository-names "$MUKHAM_REPO_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
    print_info "Creating ECR repository: $MUKHAM_REPO_NAME"
    aws ecr create-repository \
        --repository-name "$MUKHAM_REPO_NAME" \
        --region "$AWS_REGION" \
        --image-scanning-configuration scanOnPush=true
    
    # Set lifecycle policy
    aws ecr put-lifecycle-policy \
        --repository-name "$MUKHAM_REPO_NAME" \
        --region "$AWS_REGION" \
        --lifecycle-policy-text '{
            "rules": [
                {
                    "rulePriority": 1,
                    "selection": {
                        "tagStatus": "untagged",
                        "countType": "sinceImagePushed",
                        "countUnit": "days",
                        "countNumber": 7
                    },
                    "action": {
                        "type": "expire"
                    }
                }
            ]
        }'
    
    print_success "ECR repository created: $MUKHAM_REPO_NAME"
else
    print_info "ECR repository already exists: $MUKHAM_REPO_NAME"
fi

print_success "ECR setup completed successfully!"
