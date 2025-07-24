#!/bin/bash

# Deploy All Services Script
# Orchestrates deployment of all services in the correct order

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

print_info "Starting complete deployment for $ENVIRONMENT environment"
print_warning "This will deploy all services. Make sure you have the necessary permissions."

# Deploy in the correct order
echo ""
print_info "=== Step 1: Mukham Service Deployment ==="
"$SCRIPT_DIR/mukham.sh" "$ENVIRONMENT" "$IMAGE_TAG"

if [[ $? -ne 0 ]]; then
    print_error "Mukham service deployment failed. Stopping deployment."
    exit 1
fi

echo ""
print_info "=== Step 2: CDN Deployment ==="
"$SCRIPT_DIR/cdn.sh" "$ENVIRONMENT"

if [[ $? -ne 0 ]]; then
    print_error "CDN deployment failed."
    exit 1
fi

echo ""
print_success "✅ All services deployed successfully for $ENVIRONMENT environment!"

# Load environment for summary
ENV_FILE="$SCRIPT_DIR/../config/${ENVIRONMENT}.env"
load_env "$ENV_FILE"

# Show deployment summary
echo ""
print_info "=== Deployment Summary ==="
MUKHAM_ALB_DNS=$(get_stack_output "${PROJECT_NAME}-${ENVIRONMENT}-mukham" "LoadBalancerDNS" 2>/dev/null || echo "Not available")
CLOUDFRONT_DOMAIN=$(get_stack_output "${PROJECT_NAME}-${ENVIRONMENT}-cdn" "CloudFrontDomainName" 2>/dev/null || echo "Not available")

print_info "Environment: $ENVIRONMENT"
print_info "Mukham Service: http://$MUKHAM_ALB_DNS"
print_info "CDN: https://$CLOUDFRONT_DOMAIN"

if [[ "$ENVIRONMENT" == "prod" ]]; then
    print_info "Production URL: https://sutram.co"
fi

print_info "Check AWS Console for detailed service logs and monitoring"
print_success "Deployment completed! 🚀"
