#!/bin/bash

# Show CDN domain configuration and status

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

print_info "=== Sutram CDN Domain Configuration ==="

echo ""
print_info "=== Development Environment ==="
DEV_STACK="sutram-dev-cdn"
if aws cloudformation describe-stacks --stack-name "$DEV_STACK" >/dev/null 2>&1; then
    DEV_CLOUDFRONT_DOMAIN=$(get_stack_output "$DEV_STACK" "CloudFrontDomainName" 2>/dev/null || echo "Unknown")
    DEV_CLOUDFRONT_ID=$(get_stack_output "$DEV_STACK" "CloudFrontDistributionId" 2>/dev/null || echo "Unknown")
    DEV_CUSTOM_URL=$(get_stack_output "$DEV_STACK" "CustomDomainURL" 2>/dev/null || echo "")
    
    print_info "Stack Status: Deployed"
    print_info "CloudFront Domain: $DEV_CLOUDFRONT_DOMAIN"
    print_info "Distribution ID: $DEV_CLOUDFRONT_ID"
    
    if [[ -n "$DEV_CUSTOM_URL" ]]; then
        print_info "Custom Domain: dev.sutram.co → $DEV_CUSTOM_URL"
        
        # Check distribution status
        DEV_STATUS=$(aws cloudfront get-distribution --id "$DEV_CLOUDFRONT_ID" --query 'Distribution.Status' --output text 2>/dev/null || echo "Unknown")
        print_info "Distribution Status: $DEV_STATUS"
    else
        print_warning "Custom Domain: Not configured"
        print_warning "Use CloudFront domain: https://$DEV_CLOUDFRONT_DOMAIN"
    fi
    
    print_info "Routing:"
    print_info "  - dev.sutram.co/* → Mukham ECS"
    print_info "  - dev.sutram.co/api/* → Web ECS"
else
    print_error "Stack Status: Not deployed"
    print_info "Deploy with: ./deploy-cdn.sh dev"
fi

echo ""
print_info "=== Production Environment ==="
PROD_STACK="sutram-prod-cdn"
if aws cloudformation describe-stacks --stack-name "$PROD_STACK" >/dev/null 2>&1; then
    PROD_CLOUDFRONT_DOMAIN=$(get_stack_output "$PROD_STACK" "CloudFrontDomainName" 2>/dev/null || echo "Unknown")
    PROD_CLOUDFRONT_ID=$(get_stack_output "$PROD_STACK" "CloudFrontDistributionId" 2>/dev/null || echo "Unknown")
    PROD_CUSTOM_URL=$(get_stack_output "$PROD_STACK" "CustomDomainURL" 2>/dev/null || echo "")
    
    print_info "Stack Status: Deployed"
    print_info "CloudFront Domain: $PROD_CLOUDFRONT_DOMAIN"
    print_info "Distribution ID: $PROD_CLOUDFRONT_ID"
    
    if [[ -n "$PROD_CUSTOM_URL" ]]; then
        print_info "Custom Domains:"
        print_info "  - sutram.co → $PROD_CUSTOM_URL"
        print_info "  - www.sutram.co → $PROD_CUSTOM_URL"
        
        # Check distribution status
        PROD_STATUS=$(aws cloudfront get-distribution --id "$PROD_CLOUDFRONT_ID" --query 'Distribution.Status' --output text 2>/dev/null || echo "Unknown")
        print_info "Distribution Status: $PROD_STATUS"
    else
        print_warning "Custom Domain: Not configured"
        print_warning "Use CloudFront domain: https://$PROD_CLOUDFRONT_DOMAIN"
    fi
    
    print_info "Routing:"
    print_info "  - sutram.co/* → Mukham ECS"
    print_info "  - sutram.co/api/* → Web ECS"
    print_info "  - www.sutram.co/* → Mukham ECS"
else
    print_error "Stack Status: Not deployed"
    print_info "Deploy with: ./deploy-cdn.sh prod"
fi

echo ""
print_info "=== SSL Certificates ==="
DEV_CERT_FILE="$SCRIPT_DIR/../config/certificate-dev.txt"
PROD_CERT_FILE="$SCRIPT_DIR/../config/certificate-prod.txt"

if [[ -f "$DEV_CERT_FILE" ]]; then
    DEV_CERT=$(cat "$DEV_CERT_FILE")
    DEV_CERT_STATUS=$(aws acm describe-certificate --certificate-arn "$DEV_CERT" --region us-east-1 --query 'Certificate.Status' --output text 2>/dev/null || echo "Unknown")
    print_info "Development Certificate: $DEV_CERT_STATUS"
    print_info "  ARN: $DEV_CERT"
else
    print_warning "Development Certificate: Not found"
    print_info "  Create with: ./create-ssl-certificate.sh dev"
fi

if [[ -f "$PROD_CERT_FILE" ]]; then
    PROD_CERT=$(cat "$PROD_CERT_FILE")
    PROD_CERT_STATUS=$(aws acm describe-certificate --certificate-arn "$PROD_CERT" --region us-east-1 --query 'Certificate.Status' --output text 2>/dev/null || echo "Unknown")
    print_info "Production Certificate: $PROD_CERT_STATUS"
    print_info "  ARN: $PROD_CERT"
else
    print_warning "Production Certificate: Not found"
    print_info "  Create with: ./create-ssl-certificate.sh prod"
fi

echo ""
print_info "=== Quick Actions ==="
print_info "Deploy all CDNs: ./deploy-cdn-all.sh"
print_info "Create dev cert: ./create-ssl-certificate.sh dev"
print_info "Create prod cert: ./create-ssl-certificate.sh prod"
print_info "Test dev CDN: ./test-cdn.sh dev"
print_info "Test prod CDN: ./test-cdn.sh prod"
