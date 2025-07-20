#!/bin/bash

# Deploy Mukham Service on ECS

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

# Load Mukham specific environment variables
MUKHAM_ENV_FILE="$SCRIPT_DIR/../config/mukham-${ENVIRONMENT}.env"
if [[ -f "$MUKHAM_ENV_FILE" ]]; then
    load_env "$MUKHAM_ENV_FILE"
fi

# Check AWS CLI
check_aws

# Stack names
CLICKHOUSE_STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-clickhouse"
STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-mukham"

# Check if ClickHouse stack exists (for ECS cluster)
if ! stack_exists "$CLICKHOUSE_STACK_NAME"; then
    print_error "ClickHouse stack $CLICKHOUSE_STACK_NAME does not exist. Deploy ClickHouse first."
    exit 1
fi

print_info "Deploying Mukham service for environment: $ENVIRONMENT with image tag: $IMAGE_TAG"

# Set CPU and Memory for Mukham (higher than other services)
MUKHAM_CPU="${MUKHAM_CPU:-512}"
MUKHAM_MEMORY="${MUKHAM_MEMORY:-1024}"
MUKHAM_PORT="${MUKHAM_PORT:-3000}"
NODE_ENV="${NODE_ENV:-production}"

# Deploy Mukham service stack
deploy_stack "$STACK_NAME" \
    "$SCRIPT_DIR/../templates/mukham.yaml" \
    "Environment=$ENVIRONMENT" \
    "ProjectName=$PROJECT_NAME" \
    "CPU=$MUKHAM_CPU" \
    "Memory=$MUKHAM_MEMORY" \
    "MukhamPort=$MUKHAM_PORT" \
    "ImageTag=$IMAGE_TAG" \
    "NodeEnv=$NODE_ENV"

if [[ $? -eq 0 ]]; then
    print_success "Mukham service deployed successfully!"
    
    # Get the Load Balancer DNS
    ALB_DNS=$(get_stack_output "$STACK_NAME" "LoadBalancerDNS" 2>/dev/null || echo "Not available")
    print_info "Mukham Application URL: http://$ALB_DNS"
else
    print_error "Failed to deploy Mukham service"
    exit 1
fi
