#!/bin/bash

# Deploy all services for an environment including Mukham

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Check arguments
if [[ $# -lt 1 || $# -gt 3 ]]; then
    print_error "Usage: $0 <environment> [image_tag] [--include-mukham]"
    print_error "Environment: dev or prod"
    print_error "Image tag: optional, defaults to 'latest' (only for application services)"
    print_error "--include-mukham: optional flag to deploy Mukham service"
    exit 1
fi

ENVIRONMENT="$1"
IMAGE_TAG="${2:-latest}"
INCLUDE_MUKHAM=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --include-mukham)
        INCLUDE_MUKHAM=true
        shift
        ;;
    esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    print_error "Environment must be 'dev' or 'prod'"
    exit 1
fi

print_info "Starting comprehensive deployment for $ENVIRONMENT environment"
if [[ "$INCLUDE_MUKHAM" == "true" ]]; then
    print_info "Mukham service will be included in deployment"
fi
print_info "This will deploy all services in the correct order"

# Deploy in the correct order
echo ""
print_info "Step 1: Deploying Infrastructure (VPC)..."
"$SCRIPT_DIR/deploy-infra.sh" "$ENVIRONMENT"

echo ""
print_info "Step 2: Deploying PostgreSQL..."
"$SCRIPT_DIR/deploy-postgres.sh" "$ENVIRONMENT"

echo ""
print_info "Step 3: Deploying ClickHouse..."
"$SCRIPT_DIR/deploy-clickhouse.sh" "$ENVIRONMENT"

echo ""
print_info "Step 4: Deploying Web Service..."
"$SCRIPT_DIR/deploy-web.sh" "$ENVIRONMENT" "$IMAGE_TAG"

echo ""
print_info "Step 5: Deploying Live Service..."
"$SCRIPT_DIR/deploy-live.sh" "$ENVIRONMENT" "$IMAGE_TAG"

echo ""
print_info "Step 6: Deploying Deployment Service..."
"$SCRIPT_DIR/deploy-deployment.sh" "$ENVIRONMENT" "$IMAGE_TAG"

# Deploy Mukham if requested
if [[ "$INCLUDE_MUKHAM" == "true" ]]; then
    echo ""
    print_info "Step 7: Deploying Mukham Service..."
    "$SCRIPT_DIR/deploy-mukham.sh" "$ENVIRONMENT" "$IMAGE_TAG"
fi

echo ""
print_success "All services deployed successfully for $ENVIRONMENT environment!"

# Show important URLs and endpoints
echo ""
print_info "=== Deployment Summary ==="
WEB_ALB_DNS=$(get_stack_output "${PROJECT_NAME}-${ENVIRONMENT}-web" "LoadBalancerDNS" 2>/dev/null || echo "Not available")
DB_ENDPOINT=$(get_stack_output "${PROJECT_NAME}-${ENVIRONMENT}-postgres" "DatabaseEndpoint" 2>/dev/null || echo "Not available")

print_info "Web Application URL: http://$WEB_ALB_DNS"
print_info "Database Endpoint: $DB_ENDPOINT"

if [[ "$INCLUDE_MUKHAM" == "true" ]]; then
    MUKHAM_ALB_DNS=$(get_stack_output "${PROJECT_NAME}-${ENVIRONMENT}-mukham" "LoadBalancerDNS" 2>/dev/null || echo "Not available")
    print_info "Mukham Application URL: http://$MUKHAM_ALB_DNS"
fi

print_info "Check AWS Console for service logs and monitoring"
