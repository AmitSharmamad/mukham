#!/bin/bash

# CDN Deployment Script
# Deploys CloudFront distribution and SSL certificate

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Check arguments
if [[ $# -lt 1 || $# -gt 3 ]]; then
    print_error "Usage: $0 <environment> [certificate_arn] [hosted_zone_id]"
    print_error "Environment: dev or prod"
    print_error "Certificate ARN: optional, SSL certificate ARN (must be in us-east-1)"
    print_error "Hosted Zone ID: optional, existing Route 53 hosted zone ID"
    exit 1
fi

ENVIRONMENT="$1"
CERTIFICATE_ARN="${2:-}"
HOSTED_ZONE_ID="${3:-}"

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

# Create SSL certificate if not provided
if [[ -z "$CERTIFICATE_ARN" && "$ENVIRONMENT" == "prod" ]]; then
    print_info "Creating SSL certificate for production..."
    
    # Request certificate
    CERTIFICATE_ARN=$(aws acm request-certificate \
        --domain-name "sutram.co" \
        --subject-alternative-names "*.sutram.co" "mukham.sutram.co" \
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
)

if [[ -n "$CERTIFICATE_ARN" ]]; then
    PARAMS+=("CertificateArn=$CERTIFICATE_ARN")
fi

if [[ -n "$HOSTED_ZONE_ID" ]]; then
    PARAMS+=("ExistingHostedZoneId=$HOSTED_ZONE_ID")
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
        print_info "Production domain: https://sutram.co"
        print_info "Mukham subdomain: https://mukham.sutram.co"
        print_warning "DNS propagation may take up to 24 hours"
    else
        print_info "Development domain: https://dev.sutram.co"
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
