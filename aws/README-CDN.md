# CDN Deployment Guide

This guide explains how to deploy the CloudFront CDN for `sutram.co` domain with environment-specific subdomains.

## Architecture

The CDN is configured with:
- **Default Behavior**: All traffic → Mukham ECS service
- **API Behavior**: `/api/*` → Web ECS service
- **Domains**: 
  - Production: `sutram.co` and `www.sutram.co`
  - Development: `dev.sutram.co`
- **Protocol**: HTTPS redirect enabled
- **Caching**: Disabled for dynamic content

## Prerequisites

1. Infrastructure stack deployed (`deploy-infra.sh`)
2. Web ECS service deployed (`deploy-web.sh`)
3. Mukham ECS service deployed (`deploy-mukham.sh`)

## Quick Start

### 1. Check Current Status

```bash
./cdn-status.sh
```

### 2. Deploy All CDNs

```bash
./deploy-cdn-all.sh
```

### 3. Create SSL Certificates

```bash
# Development certificate for dev.sutram.co
./create-ssl-certificate.sh dev

# Production certificate for sutram.co and www.sutram.co
./create-ssl-certificate.sh prod
```

### 4. Deploy with SSL

```bash
# After certificates are validated
./deploy-cdn-ssl.sh dev <dev-certificate-arn>
./deploy-cdn-ssl.sh prod <prod-certificate-arn>
```

## Deployment Options

### 1. Basic CDN (No Custom Domain)

Deploy CDN without custom domain (uses CloudFront domain):

```bash
./deploy-cdn.sh dev
```

This creates:
- CloudFront distribution
- S3 bucket for logs
- CloudFront domain (e.g., `d123456789.cloudfront.net`)

### 2. CDN with SSL Certificate

Deploy CDN with custom domain `sutram.co`:

```bash
./deploy-cdn-ssl.sh dev arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-1234
```

Requirements:
- SSL certificate must be in `us-east-1` region
- Certificate must cover `sutram.co` and `www.sutram.co`

This creates:
- Everything from basic CDN
- Route 53 hosted zone (if needed)
- DNS records for custom domain

### 3. CDN with Existing Hosted Zone

If you already have a Route 53 hosted zone:

```bash
./deploy-cdn-ssl.sh dev arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-1234 Z123456789012
```

## SSL Certificate Setup

### Create Certificate for Development

Create certificate for `dev.sutram.co`:

```bash
./create-ssl-certificate.sh dev
```

### Create Certificate for Production

Create certificate for `sutram.co` and `www.sutram.co`:

```bash
./create-ssl-certificate.sh prod
```

### Manual Certificate Creation

1. Request certificate in `us-east-1` region:

**For Production:**
```bash
aws acm request-certificate \
  --domain-name sutram.co \
  --subject-alternative-names www.sutram.co \
  --validation-method DNS \
  --region us-east-1
```

**For Development:**
```bash
aws acm request-certificate \
  --domain-name dev.sutram.co \
  --validation-method DNS \
  --region us-east-1
```

2. Validate the certificate using DNS validation
3. Note the certificate ARN for deployment

### Validate Certificate

Check certificate status:
```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-1234 \
  --region us-east-1
```

## Deployment Process

### Using deploy-all.sh

The CDN is automatically deployed as part of the full deployment:

```bash
./deploy-all.sh dev
```

### Manual Deployment

Deploy CDN separately:

```bash
# Basic CDN
./deploy-cdn.sh dev

# CDN with SSL
./deploy-cdn-ssl.sh dev arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-1234
```

## Post-Deployment

### Update Domain Nameservers

If a new hosted zone was created, update your domain registrar:

1. Get nameservers:
```bash
aws route53 get-hosted-zone --id Z123456789012
```

2. Update nameservers at your domain registrar

### Verify Deployment

Check CloudFront distribution:
```bash
aws cloudfront get-distribution --id E123456789012
```

Test endpoints:
```bash
# Production CloudFront domain
curl https://d123456789.cloudfront.net

# Production custom domains (after DNS propagation)
curl https://sutram.co
curl https://sutram.co/api/health
curl https://www.sutram.co

# Development CloudFront domain
curl https://d987654321.cloudfront.net

# Development custom domain (after DNS propagation)
curl https://dev.sutram.co
curl https://dev.sutram.co/api/health
```

## Monitoring

### CloudFront Logs

Logs are stored in S3 bucket: `sutram-{env}-cloudfront-logs-{account-id}`

### Metrics

Monitor in CloudWatch:
- Distribution: Requests, Data Transfer
- Origin: Origin Latency, Origin Errors

### Debugging

Check distribution status:
```bash
aws cloudfront get-distribution --id E123456789012 --query 'Distribution.Status'
```

View invalidations:
```bash
aws cloudfront list-invalidations --distribution-id E123456789012
```

## Cache Management

### Invalidate Cache

Invalidate all:
```bash
aws cloudfront create-invalidation \
  --distribution-id E123456789012 \
  --paths "/*"
```

Invalidate specific paths:
```bash
aws cloudfront create-invalidation \
  --distribution-id E123456789012 \
  --paths "/api/*" "/index.html"
```

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**
   - Ensure certificate is in `us-east-1`
   - Check certificate validation status
   - Verify domain names match

2. **DNS Issues**
   - DNS propagation takes time (up to 48 hours)
   - Check nameservers at registrar
   - Verify Route 53 records

3. **Origin Issues**
   - Check ALB health
   - Verify security groups allow CloudFront IPs
   - Check origin timeouts

### Error Codes

- **403 Forbidden**: Check origin security groups
- **504 Gateway Timeout**: Check origin health/timeouts
- **502 Bad Gateway**: Check origin response

## Configuration Details

### Cache Behaviors

| Path Pattern | Origin | Cache Policy | Description |
|--------------|--------|--------------|-------------|
| Default (`*`) | Mukham ECS | CachingDisabled | All traffic to Mukham |
| `/api/*` | Web ECS | CachingDisabled | API calls to Web service |

### Security Headers

- HTTPS redirect enforced
- Security headers policy applied
- CORS headers preserved

### Error Pages

- 404 → 200 with `/index.html` (SPA support)
- 403 → 200 with `/index.html` (SPA support)

## Stack Outputs

After deployment, these outputs are available:

- `CloudFrontDistributionId`: Distribution ID
- `CloudFrontDomainName`: CloudFront domain
- `CustomDomainURL`: Custom domain URL (if SSL configured)
- `HostedZoneId`: Route 53 hosted zone ID (if created)
