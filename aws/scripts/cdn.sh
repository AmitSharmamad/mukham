#!/bin/bash

# CDN Deployment Script
# Deploys CloudFront distribution and SSL certificate

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Check arguments
if [[ $# -lt 1 || $# -gt 2 ]]; then
    print_error "Usage: $0 <environment> [mukham_backend_url]"
    print_error "Environment: dev or prod"
    print_error "Mukham Backend URL: optional, backend ALB URL for origin"
    exit 1
fi

ENVIRONMENT="$1"
MUKHAM_BACKEND_URL="${2:-}"

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

print_info "Deploying CDN for $ENVIRONMENT environment"

# Use certificate ARN from environment file or create new one
CERTIFICATE_ARN="${CLOUDFRONT_CERTIFICATE_ARN:-}"

# Create SSL certificate if not provided
if [[ -z "$CERTIFICATE_ARN" ]]; then
    print_info "Creating SSL certificate for CloudFront..."
    
    # Request certificate in us-east-1 (required for CloudFront)
    CERTIFICATE_ARN=$(aws acm request-certificate \
        --domain-name "${BASE_DOMAIN_NAME}" \
        --subject-alternative-names "*.${BASE_DOMAIN_NAME}" "www.${BASE_DOMAIN_NAME}" "dev.${BASE_DOMAIN_NAME}" \
        --validation-method DNS \
        --region us-east-1 \
        --query 'CertificateArn' \
        --output text)
    
    if [[ $? -eq 0 ]]; then
        print_info "Certificate requested: $CERTIFICATE_ARN"
        print_warning "You need to validate the certificate via DNS before deployment completes"
        print_info "Check Route 53 for DNS validation records"
    else
        print_error "Failed to request certificate"
        exit 1
    fi
fi

# Deploy CDN stack
STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-cdn"
TEMPLATE_FILE="$SCRIPT_DIR/../templates/cdn.yaml"

# Build parameters
PARAMS=(
    "Environment=$ENVIRONMENT"
    "ProjectName=$PROJECT_NAME"
    "BaseDomainName=${BASE_DOMAIN_NAME}"
    "ExistingHostedZoneId=${PUBLIC_HOSTED_ZONE_ID}"
)

if [[ -n "$CERTIFICATE_ARN" ]]; then
    PARAMS+=("CertificateArn=$CERTIFICATE_ARN")
fi

if [[ -n "$MUKHAM_BACKEND_URL" ]]; then
    PARAMS+=("MukhamBackendURL=$MUKHAM_BACKEND_URL")
fi

print_info "Deploying CloudFormation stack: $STACK_NAME"

aws cloudformation deploy \
    --template-file "$TEMPLATE_FILE" \
    --stack-name "$STACK_NAME" \
    --parameter-overrides "${PARAMS[@]}" \
    --capabilities CAPABILITY_IAM \
    --region "$AWS_REGION"

if [[ $? -eq 0 ]]; then
    print_success "CDN deployed successfully!"
    
    # Get CloudFront domain
    CLOUDFRONT_DOMAIN=$(get_stack_output "$STACK_NAME" "CloudFrontDomainName" 2>/dev/null || echo "Not available")
    print_info "CloudFront URL: https://$CLOUDFRONT_DOMAIN"
    
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        print_info "Production domain: https://${BASE_DOMAIN_NAME}"
        print_info "WWW domain: https://www.${BASE_DOMAIN_NAME}"
        print_warning "DNS propagation may take up to 24 hours"
    else
        print_info "Development domain: https://dev.${BASE_DOMAIN_NAME}"
        print_info "Root domain (pointing to dev): https://${BASE_DOMAIN_NAME}"
        print_info "Mukham subdomain: https://mukham.dev.sutram.co"
    fi
    
    # Check status
    print_info "Checking CDN status..."
    DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
        --output text)
    
    if [[ -n "$DISTRIBUTION_ID" ]]; then
        STATUS=$(aws cloudfront get-distribution \
            --id "$DISTRIBUTION_ID" \
            --query 'Distribution.Status' \
            --output text)
        print_info "Distribution Status: $STATUS"
    fi
else
    print_error "CDN deployment failed!"
    exit 1
fi
