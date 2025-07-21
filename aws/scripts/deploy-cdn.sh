#!/bin/bash

# Deploy CDN (CloudFront Distribution) for sutram.co

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

STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-cdn"
TEMPLATE_FILE="$SCRIPT_DIR/../templates/cdn.yaml"

print_info "Deploying CDN for $ENVIRONMENT environment..."
print_info "Stack name: $STACK_NAME"
if [[ "$ENVIRONMENT" == "prod" ]]; then
    print_info "Domain: sutram.co, www.sutram.co"
else
    print_info "Domain: dev.sutram.co"
fi

# Check if required stacks exist
if ! stack_exists "${PROJECT_NAME}-${ENVIRONMENT}-infra"; then
    print_error "Infrastructure stack not found. Deploy infrastructure first."
    exit 1
fi

if ! stack_exists "${PROJECT_NAME}-${ENVIRONMENT}-web"; then
    print_error "Web stack not found. Deploy web service first."
    exit 1
fi

if ! stack_exists "${PROJECT_NAME}-${ENVIRONMENT}-mukham"; then
    print_error "Mukham stack not found. Deploy mukham service first."
    exit 1
fi

# Prepare parameters
PARAMETERS=(
    "ParameterKey=Environment,ParameterValue=$ENVIRONMENT"
    "ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME"
    "ParameterKey=BaseDomainName,ParameterValue=sutram.co"
)

# Add certificate ARN if provided
if [[ -n "$CERTIFICATE_ARN" ]]; then
    PARAMETERS+=("ParameterKey=CertificateArn,ParameterValue=$CERTIFICATE_ARN")
    print_info "Using SSL certificate: $CERTIFICATE_ARN"
fi

# Add hosted zone ID if provided
if [[ -n "$HOSTED_ZONE_ID" ]]; then
    PARAMETERS+=("ParameterKey=ExistingHostedZoneId,ParameterValue=$HOSTED_ZONE_ID")
    print_info "Using existing hosted zone: $HOSTED_ZONE_ID"
fi

# Deploy the stack
print_info "Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file "$TEMPLATE_FILE" \
    --stack-name "$STACK_NAME" \
    --parameter-overrides "${PARAMETERS[@]}" \
    --capabilities CAPABILITY_IAM \
    --region "$AWS_REGION" || {
    print_error "Failed to deploy CDN stack"
    exit 1
}

# Get outputs
print_info "Getting deployment outputs..."
CLOUDFRONT_DOMAIN=$(get_stack_output "$STACK_NAME" "CloudFrontDomainName")
CLOUDFRONT_ID=$(get_stack_output "$STACK_NAME" "CloudFrontDistributionId")
CUSTOM_DOMAIN_URL=$(get_stack_output "$STACK_NAME" "CustomDomainURL" 2>/dev/null || echo "")

print_success "CDN deployed successfully!"

echo ""
print_info "=== CDN Deployment Summary ==="
print_info "CloudFront Distribution ID: $CLOUDFRONT_ID"
print_info "CloudFront Domain: $CLOUDFRONT_DOMAIN"
print_info "CloudFront URL: https://$CLOUDFRONT_DOMAIN"

if [[ -n "$CUSTOM_DOMAIN_URL" ]]; then
    print_info "Custom Domain URL: $CUSTOM_DOMAIN_URL"
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        print_info "Production domains: sutram.co, www.sutram.co"
    else
        print_info "Development domain: dev.sutram.co"
    fi
fi

echo ""
print_info "=== CDN Configuration ==="
print_info "Default Behavior: All traffic → Mukham ECS"
print_info "API Behavior: /api/* → Web ECS"
print_info "Protocol: HTTPS redirect enabled"
print_info "Caching: Disabled for dynamic content"

echo ""
print_info "=== Next Steps ==="
if [[ -z "$CERTIFICATE_ARN" ]]; then
    print_warning "No SSL certificate provided. To use custom domain:"
    print_warning "1. Request SSL certificate in us-east-1 region"
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        print_warning "   Certificate must cover: sutram.co, www.sutram.co"
    else
        print_warning "   Certificate must cover: dev.sutram.co"
    fi
    print_warning "2. Validate the certificate"
    print_warning "3. Re-run deployment with certificate ARN"
fi

if [[ -z "$HOSTED_ZONE_ID" && -n "$CERTIFICATE_ARN" ]]; then
    print_info "New hosted zone created. Update domain nameservers:"
    HOSTED_ZONE_ID_NEW=$(get_stack_output "$STACK_NAME" "HostedZoneId" 2>/dev/null || echo "")
    if [[ -n "$HOSTED_ZONE_ID_NEW" ]]; then
        print_info "Hosted Zone ID: $HOSTED_ZONE_ID_NEW"
        print_info "Get nameservers: aws route53 get-hosted-zone --id $HOSTED_ZONE_ID_NEW"
    fi
fi

print_info "CDN propagation may take 15-20 minutes"
print_info "Monitor deployment: aws cloudfront get-distribution --id $CLOUDFRONT_ID"
