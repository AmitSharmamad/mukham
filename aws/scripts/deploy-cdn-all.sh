#!/bin/bash

# Deploy CDN for both environments with proper domain mapping

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

print_info "=== Sutram CDN Deployment ==="
print_info "This script will deploy CDN for both environments:"
print_info "- Production: sutram.co, www.sutram.co"
print_info "- Development: dev.sutram.co"

# Check if certificates exist
DEV_CERT_FILE="$SCRIPT_DIR/../config/certificate-dev.txt"
PROD_CERT_FILE="$SCRIPT_DIR/../config/certificate-prod.txt"

DEV_CERT=""
PROD_CERT=""

if [[ -f "$DEV_CERT_FILE" ]]; then
    DEV_CERT=$(cat "$DEV_CERT_FILE")
    print_info "Found dev certificate: $DEV_CERT"
fi

if [[ -f "$PROD_CERT_FILE" ]]; then
    PROD_CERT=$(cat "$PROD_CERT_FILE")
    print_info "Found prod certificate: $PROD_CERT"
fi

# Deploy development environment
echo ""
print_info "=== Deploying Development CDN ==="
if [[ -n "$DEV_CERT" ]]; then
    print_info "Deploying dev.sutram.co with SSL certificate..."
    "$SCRIPT_DIR/deploy-cdn-ssl.sh" dev "$DEV_CERT"
else
    print_warning "No SSL certificate found for development environment"
    print_info "Deploying basic CDN without custom domain..."
    "$SCRIPT_DIR/deploy-cdn.sh" dev
    
    echo ""
    print_info "To enable custom domain for development:"
    print_info "1. Run: ./create-ssl-certificate.sh dev"
    print_info "2. Validate the certificate"
    print_info "3. Re-run: ./deploy-cdn-ssl.sh dev <certificate_arn>"
fi

# Deploy production environment
echo ""
print_info "=== Deploying Production CDN ==="
if [[ -n "$PROD_CERT" ]]; then
    print_info "Deploying sutram.co with SSL certificate..."
    "$SCRIPT_DIR/deploy-cdn-ssl.sh" prod "$PROD_CERT"
else
    print_warning "No SSL certificate found for production environment"
    print_info "Deploying basic CDN without custom domain..."
    "$SCRIPT_DIR/deploy-cdn.sh" prod
    
    echo ""
    print_info "To enable custom domain for production:"
    print_info "1. Run: ./create-ssl-certificate.sh prod"
    print_info "2. Validate the certificate"
    print_info "3. Re-run: ./deploy-cdn-ssl.sh prod <certificate_arn>"
fi

echo ""
print_success "CDN deployment completed for both environments!"

echo ""
print_info "=== Deployment Summary ==="

# Get deployment information
DEV_CLOUDFRONT_DOMAIN=$(get_stack_output "sutram-dev-cdn" "CloudFrontDomainName" 2>/dev/null || echo "Not deployed")
PROD_CLOUDFRONT_DOMAIN=$(get_stack_output "sutram-prod-cdn" "CloudFrontDomainName" 2>/dev/null || echo "Not deployed")

DEV_CUSTOM_URL=$(get_stack_output "sutram-dev-cdn" "CustomDomainURL" 2>/dev/null || echo "")
PROD_CUSTOM_URL=$(get_stack_output "sutram-prod-cdn" "CustomDomainURL" 2>/dev/null || echo "")

print_info "Development Environment:"
print_info "  CloudFront: https://$DEV_CLOUDFRONT_DOMAIN"
if [[ -n "$DEV_CUSTOM_URL" ]]; then
    print_info "  Custom Domain: $DEV_CUSTOM_URL"
else
    print_info "  Custom Domain: Not configured"
fi

print_info "Production Environment:"
print_info "  CloudFront: https://$PROD_CLOUDFRONT_DOMAIN"
if [[ -n "$PROD_CUSTOM_URL" ]]; then
    print_info "  Custom Domain: $PROD_CUSTOM_URL"
    print_info "  www Domain: https://www.sutram.co"
else
    print_info "  Custom Domain: Not configured"
fi

echo ""
print_info "=== Testing ==="
print_info "Test development: ./test-cdn.sh dev"
print_info "Test production: ./test-cdn.sh prod"

echo ""
print_info "=== Next Steps ==="
if [[ -z "$DEV_CUSTOM_URL" || -z "$PROD_CUSTOM_URL" ]]; then
    print_warning "Some custom domains are not configured."
    print_warning "Follow the SSL certificate setup instructions above."
fi

print_info "1. Verify all certificates are validated"
print_info "2. Update domain nameservers if needed"
print_info "3. Test all endpoints"
print_info "4. Monitor CloudFront distributions in AWS Console"
