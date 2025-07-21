#!/bin/bash

# Create SSL certificates for sutram.co domains

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Check arguments
if [[ $# -lt 1 ]]; then
    print_error "Usage: $0 <environment>"
    print_error "Environment: dev or prod"
    print_error ""
    print_error "This script will:"
    print_error "- Create SSL certificate for the appropriate domain(s)"
    print_error "- Show certificate ARN for deployment"
    print_error "- Provide DNS validation records"
    exit 1
fi

ENVIRONMENT="$1"

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    print_error "Environment must be 'dev' or 'prod'"
    exit 1
fi

print_info "Creating SSL certificate for $ENVIRONMENT environment..."

# Set domains based on environment
if [[ "$ENVIRONMENT" == "prod" ]]; then
    DOMAIN_NAME="sutram.co"
    SAN_DOMAINS="www.sutram.co"
    print_info "Production domains: $DOMAIN_NAME, $SAN_DOMAINS"
else
    DOMAIN_NAME="dev.sutram.co"
    SAN_DOMAINS=""
    print_info "Development domain: $DOMAIN_NAME"
fi

# Check if certificate already exists
print_info "Checking for existing certificates..."
EXISTING_CERTS=$(aws acm list-certificates \
    --region us-east-1 \
    --query "CertificateSummaryList[?DomainName=='$DOMAIN_NAME'].CertificateArn" \
    --output text 2>/dev/null)

if [[ -n "$EXISTING_CERTS" ]]; then
    print_warning "Existing certificate found for $DOMAIN_NAME:"
    for cert in $EXISTING_CERTS; do
        print_warning "  $cert"
        
        # Check certificate status
        STATUS=$(aws acm describe-certificate \
            --certificate-arn "$cert" \
            --region us-east-1 \
            --query 'Certificate.Status' \
            --output text 2>/dev/null)
        
        print_warning "  Status: $STATUS"
        
        if [[ "$STATUS" == "ISSUED" ]]; then
            print_success "Certificate is already issued and ready to use!"
            print_info "Use this certificate ARN for deployment:"
            print_info "$cert"
            exit 0
        fi
    done
fi

# Request new certificate
print_info "Requesting new SSL certificate..."

if [[ -n "$SAN_DOMAINS" ]]; then
    # Production certificate with SAN
    CERT_ARN=$(aws acm request-certificate \
        --domain-name "$DOMAIN_NAME" \
        --subject-alternative-names "$SAN_DOMAINS" \
        --validation-method DNS \
        --region us-east-1 \
        --query 'CertificateArn' \
        --output text 2>/dev/null)
else
    # Development certificate
    CERT_ARN=$(aws acm request-certificate \
        --domain-name "$DOMAIN_NAME" \
        --validation-method DNS \
        --region us-east-1 \
        --query 'CertificateArn' \
        --output text 2>/dev/null)
fi

if [[ -z "$CERT_ARN" ]]; then
    print_error "Failed to request certificate"
    exit 1
fi

print_success "Certificate requested successfully!"
print_info "Certificate ARN: $CERT_ARN"

# Wait a moment for DNS validation records to be available
print_info "Waiting for DNS validation records..."
sleep 10

# Get DNS validation records
print_info "Getting DNS validation records..."
VALIDATION_RECORDS=$(aws acm describe-certificate \
    --certificate-arn "$CERT_ARN" \
    --region us-east-1 \
    --query 'Certificate.DomainValidationOptions' \
    --output table 2>/dev/null)

if [[ -n "$VALIDATION_RECORDS" ]]; then
    echo ""
    print_info "=== DNS Validation Records ==="
    echo "$VALIDATION_RECORDS"
    echo ""
    print_info "Add these DNS records to validate the certificate:"
    
    # Get validation records in a more usable format
    aws acm describe-certificate \
        --certificate-arn "$CERT_ARN" \
        --region us-east-1 \
        --query 'Certificate.DomainValidationOptions[*].[DomainName,ResourceRecord.Name,ResourceRecord.Type,ResourceRecord.Value]' \
        --output table 2>/dev/null
fi

echo ""
print_info "=== Next Steps ==="
print_info "1. Add the DNS validation records to your domain"
print_info "2. Wait for certificate validation (can take a few minutes)"
print_info "3. Check certificate status:"
print_info "   aws acm describe-certificate --certificate-arn $CERT_ARN --region us-east-1"
print_info "4. Once ISSUED, deploy CDN with certificate:"
if [[ "$ENVIRONMENT" == "prod" ]]; then
    print_info "   ./deploy-cdn-ssl.sh prod $CERT_ARN"
else
    print_info "   ./deploy-cdn-ssl.sh dev $CERT_ARN"
fi

echo ""
print_info "=== Monitoring ==="
print_info "Certificate ARN: $CERT_ARN"
print_info "Check status: aws acm describe-certificate --certificate-arn $CERT_ARN --region us-east-1 --query 'Certificate.Status'"

# Save certificate ARN to file for reference
CERT_FILE="$SCRIPT_DIR/../config/certificate-${ENVIRONMENT}.txt"
echo "$CERT_ARN" > "$CERT_FILE"
print_info "Certificate ARN saved to: $CERT_FILE"
