#!/bin/bash

# Deploy CDN with SSL certificate for sutram.co

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Check arguments
if [[ $# -lt 2 ]]; then
    print_error "Usage: $0 <environment> <certificate_arn> [hosted_zone_id]"
    print_error "Environment: dev or prod"
    print_error "Certificate ARN: SSL certificate ARN (must be in us-east-1)"
    print_error "Hosted Zone ID: optional, existing Route 53 hosted zone ID"
    print_error ""
    print_error "Example:"
    print_error "  $0 prod arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-1234"
    exit 1
fi

ENVIRONMENT="$1"
CERTIFICATE_ARN="$2"
HOSTED_ZONE_ID="${3:-}"

print_info "Deploying CDN with SSL certificate..."
print_info "Environment: $ENVIRONMENT"
print_info "Certificate: $CERTIFICATE_ARN"
if [[ "$ENVIRONMENT" == "prod" ]]; then
    print_info "Domains: sutram.co, www.sutram.co"
else
    print_info "Domain: dev.sutram.co"
fi

# Validate certificate ARN format
if [[ ! "$CERTIFICATE_ARN" =~ ^arn:aws:acm:us-east-1: ]]; then
    print_error "Certificate ARN must be in us-east-1 region for CloudFront"
    print_error "Current ARN: $CERTIFICATE_ARN"
    exit 1
fi

# Deploy CDN with SSL
if [[ -n "$HOSTED_ZONE_ID" ]]; then
    "$SCRIPT_DIR/deploy-cdn.sh" "$ENVIRONMENT" "$CERTIFICATE_ARN" "$HOSTED_ZONE_ID"
else
    "$SCRIPT_DIR/deploy-cdn.sh" "$ENVIRONMENT" "$CERTIFICATE_ARN"
fi
