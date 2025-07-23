# Mukham ECS Deployment

This directory contains CloudFormation templates and scripts to deploy the Mukham application to AWS ECS.

## Architecture Overview

The Mukham deployment creates:

- **ECS Fargate Service**: Running Mukham application in containers
- **Application Load Balancer**: Public-facing load balancer for the Mukham app
- **Target Group**: Health checks and traffic routing
- **CloudWatch Logs**: Application logging
- **Security Groups**: Network security for ALB and ECS tasks

## Prerequisites

1. **AWS Configuration**: Make sure you have AWS CLI configured with appropriate permissions
2. **Docker**: Docker must be installed for building and pushing images
3. **ECR Repository**: The ECR repository for the project must exist (created automatically by deployment scripts)

## Quick Start

### 1. Build and Push Docker Image

```bash
# For development environment
./aws/scripts/build-mukham.sh dev latest

# For production environment
./aws/scripts/build-mukham.sh prod latest
```

### 2. Deploy Mukham Service Only

```bash
# For development environment
./aws/scripts/deploy-mukham.sh dev latest

# For production environment
./aws/scripts/deploy-mukham.sh prod latest
```

### 3. Deploy All Services Including Mukham

```bash
# For development environment with Mukham
./aws/scripts/deploy-all-with-mukham.sh dev latest --include-mukham

# For production environment with Mukham
./aws/scripts/deploy-all-with-mukham.sh prod latest --include-mukham
```

## Configuration

### Environment Variables

The Mukham service uses the following environment variables:

- `NODE_ENV`: Node environment (development/production)
- `PORT`: Port number (default: 3000)
- `ENVIRONMENT`: Deployment environment (dev/prod)
- `NEXT_PUBLIC_API_URL`: Public API URL for client-side requests
- `DATABASE_URL`: PostgreSQL connection string
- `CH_URL`: ClickHouse connection string
- `NEXTAUTH_SECRET`: NextAuth.js secret for session encryption
- `NEXTAUTH_URL`: Base URL for NextAuth.js

### Configuration Files

- `aws/config/mukham-dev.env`: Development-specific Mukham configuration
- `aws/config/mukham-prod.env`: Production-specific Mukham configuration

### Resource Allocation

#### Development
- CPU: 512 (0.5 vCPU)
- Memory: 1024 MB
- Desired Count: 1

#### Production
- CPU: 1024 (1 vCPU)
- Memory: 2048 MB
- Desired Count: 2

## Health Checks

The service includes multiple health check layers:

1. **Container Health Check**: Built into the Docker container
2. **ECS Health Check**: Performed by ECS service
3. **ALB Health Check**: Load balancer target group health check

Health check endpoint: `/api/health`

## Security

- **Network Security**: ECS tasks run in private subnets
- **Load Balancer**: Only the ALB is internet-facing
- **Security Groups**: Restrict traffic between components
- **Secrets**: Environment variables for sensitive configuration

## Monitoring

- **CloudWatch Logs**: Application logs are sent to CloudWatch
- **ECS Service Metrics**: CPU, memory, and task metrics
- **ALB Metrics**: Request count, latency, and error rates

## Troubleshooting

### Common Issues

1. **Service fails to start**:
   - Check CloudWatch logs for application errors
   - Verify environment variables are set correctly
   - Ensure database connections are working

2. **Health checks failing**:
   - Verify `/health` endpoint is responding
   - Check if application is binding to correct port (3000)
   - Review security group rules

3. **Image pull errors**:
   - Ensure ECR repository exists and image is pushed
   - Verify ECS execution role has ECR permissions
   - Check image tag matches deployment parameter

### Useful Commands

```bash
# View service status
aws ecs describe-services --cluster sutram-dev-ecs-cluster --services sutram-dev-mukham

# View service logs
aws logs tail /ecs/sutram-dev-mukham --follow

# Force new deployment
aws ecs update-service --cluster sutram-dev-ecs-cluster --service sutram-dev-mukham --force-new-deployment

# Get ALB DNS name
aws cloudformation describe-stacks --stack-name sutram-dev-mukham --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' --output text
```

## URLs

After successful deployment:

- **Development**: http://[ALB-DNS-NAME]
- **Production**: http://[ALB-DNS-NAME]

The ALB DNS name is output at the end of the deployment.

## Next Steps

1. **SSL/TLS**: Add HTTPS listener with ACM certificate
2. **Custom Domain**: Route53 hosted zone and custom domain
3. **CDN**: CloudFront for static asset caching
4. **Auto Scaling**: Configure ECS service auto scaling
5. **Monitoring**: Enhanced monitoring with custom CloudWatch dashboards
