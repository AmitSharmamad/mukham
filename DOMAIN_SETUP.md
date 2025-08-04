# Domain and HTTPS Setup for Sutram Infrastructure

## Overview
This document outlines the domain and HTTPS setup for both `mukham` (frontend) and `sutram` (backend) services.

## Domain Structure

### Development Environment (`dev`)
| Service | Domain | Access | Description |
|---------|--------|--------|-------------|
| Mukham (Frontend) | `dev.sutram.co` | External | Next.js frontend via CloudFront |
| Root Domain | `sutram.co` | External | Points to dev environment (requirement 6) |
| Web API | `web.dev.sutram.co` | External | Backend API service |
| Live Service | `live.dev.sutram.co` | Internal | Live trading service (VPC only) |
| Deployment Service | `deploy.dev.sutram.co` | Internal | Deployment service (VPC only) |
| PostgreSQL | `pg.dev.sutram.co` | Internal | Database (VPC only) |
| ClickHouse | `ch.dev.sutram.co` | Internal | Analytics database (VPC only) |

### Production Environment (`prod`)
| Service | Domain | Access | Description |
|---------|--------|--------|-------------|
| Mukham (Frontend) | `sutram.co` | External | Next.js frontend via CloudFront |
| Mukham (Frontend) | `www.sutram.co` | External | WWW redirect to main domain |
| Web API | `web.sutram.co` | External | Backend API service |
| Live Service | `live.sutram.co` | Internal | Live trading service (VPC only) |
| Deployment Service | `deploy.sutram.co` | Internal | Deployment service (VPC only) |
| PostgreSQL | `pg.sutram.co` | Internal | Database (VPC only) |
| ClickHouse | `ch.sutram.co` | Internal | Analytics database (VPC only) |

## SSL Certificate Management

### CloudFront Certificates (us-east-1)
- **Mukham Frontend**: Certificates in `us-east-1` region (required for CloudFront)
- **Domains covered**: `sutram.co`, `*.sutram.co`, `www.sutram.co`, `dev.sutram.co`

### ALB Certificates (ap-south-1)
- **Backend Services**: Certificates in `ap-south-1` region (for Application Load Balancers)
- **Domains covered**: `*.sutram.co`, `*.dev.sutram.co`

## External vs Internal Access

### Externally Accessible Services:
1. **Mukham Frontend** (`sutram.co`, `dev.sutram.co`) - CloudFront distribution
2. **Web API** (`web.sutram.co`, `web.dev.sutram.co`) - Internet-facing ALB

### Internal-Only Services (VPC access):
1. **Live Service** - Internal ALB in private subnets
2. **Deployment Service** - Internal ALB in private subnets  
3. **PostgreSQL** - RDS in private subnets
4. **ClickHouse** - ECS service in private subnets

## Implementation Details

### Infrastructure Changes Made:

1. **Updated Environment Files**:
   - Added `BASE_DOMAIN_NAME=sutram.co`
   - Added `PUBLIC_HOSTED_ZONE_ID=Z00071212ZK17YVJG7UEW`
   - Added `CLOUDFRONT_CERTIFICATE_ARN` for mukham

2. **Updated CloudFormation Templates**:
   - Added domain parameters to all service templates
   - Created Route53 records for all services
   - Added SSL certificates with proper domain validation
   - Changed Live and Deployment services to internal-only ALBs

3. **Updated Deployment Scripts**:
   - Added domain parameters to all deployment scripts
   - Updated CDN script to use environment variables

### Security Configuration:

- **External Services**: Full internet access via security groups
- **Internal Services**: VPC-only access (10.0.0.0/16 CIDR)
- **Cross-service Communication**: Security group references for ECS services

## Deployment Order

### Initial Setup:
1. Deploy Infrastructure (VPC, subnets, etc.)
2. Deploy PostgreSQL
3. Deploy ClickHouse  
4. Deploy Web service (external)
5. Deploy Live service (internal)
6. Deploy Deployment service (internal)
7. Deploy Mukham frontend with CDN

### Certificate Setup:
1. **Request certificates** in both regions:
   - us-east-1 for CloudFront (mukham)
   - ap-south-1 for ALBs (backend services)
2. **Validate via DNS** using the shared hosted zone
3. **Update environment files** with certificate ARNs

## Root Domain Strategy (Requirement 6)

Currently `sutram.co` points to the **development environment** as requested. To switch to production with minimal changes:

1. **Development**: `sutram.co` → CloudFront (dev environment)
2. **Switch to Production**: Update CloudFront aliases in CDN template
   - Remove root domain from dev CloudFront
   - Add root domain to prod CloudFront
   - No DNS changes needed - just CloudFront configuration

## Monitoring and Logs

- **CloudFront logs**: Stored in S3 bucket per environment
- **ALB logs**: Can be enabled per load balancer
- **Route53 query logs**: Can be enabled for hosted zone monitoring

## Notes

- DNS propagation may take up to 24 hours for new records
- Certificate validation requires DNS records in the hosted zone
- Internal services are accessible from external services via security group rules
- All services use HTTPS with proper SSL termination
