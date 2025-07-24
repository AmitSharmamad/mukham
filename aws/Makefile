.PHONY: build-mukham deploy-mukham deploy-all-mukham build-mukham-dev build-mukham-prod deploy-mukham-dev deploy-mukham-prod deploy-all-mukham-dev deploy-all-mukham-prod

# Mukham specific commands
build-mukham: ## Build and push Mukham Docker image to specified environment
	@./scripts/build-mukham.sh $(ENV) $(TAG)

deploy-mukham: ## Deploy Mukham service to specified environment
	@./scripts/deploy-mukham.sh $(ENV) $(TAG)

deploy-all-mukham: ## Deploy all services including Mukham to specified environment
	@./scripts/deploy-all-with-mukham.sh $(ENV) $(TAG) --include-mukham

# Quick access commands for Mukham dev environment
build-mukham-dev: ## Build and push Mukham Docker image to dev
	@./scripts/build-mukham.sh dev $(TAG)

deploy-mukham-dev: ## Deploy Mukham service to dev
	@./scripts/deploy-mukham.sh dev $(TAG)

deploy-all-mukham-dev: ## Deploy all services including Mukham to dev
	@./scripts/deploy-all-with-mukham.sh dev $(TAG) --include-mukham

# Quick access commands for Mukham prod environment
build-mukham-prod: ## Build and push Mukham Docker image to prod
	@./scripts/build-mukham.sh prod $(TAG)

deploy-mukham-prod: ## Deploy Mukham service to prod
	@./scripts/deploy-mukham.sh prod $(TAG)

deploy-all-mukham-prod: ## Deploy all services including Mukham to prod
	@./scripts/deploy-all-with-mukham.sh prod $(TAG) --include-mukham

# Combined commands for convenience
build-and-deploy-mukham: ## Build and deploy Mukham service to specified environment
	@make build-mukham ENV=$(ENV) TAG=$(TAG)
	@make deploy-mukham ENV=$(ENV) TAG=$(TAG)

build-and-deploy-mukham-dev: ## Build and deploy Mukham service to dev
	@make build-mukham-dev TAG=$(TAG)
	@make deploy-mukham-dev TAG=$(TAG)

build-and-deploy-mukham-prod: ## Build and deploy Mukham service to prod
	@make build-mukham-prod TAG=$(TAG)
	@make deploy-mukham-prod TAG=$(TAG)

# Help target that shows Mukham specific commands
help-mukham: ## Show Mukham specific help
	@echo "Mukham Deployment Commands"
	@echo "=========================="
	@echo ""
	@echo "Usage: make <target> [ENV=dev|prod] [TAG=image_tag]"
	@echo ""
	@echo "Mukham Commands:"
	@grep -E '^[a-zA-Z_-]*mukham[a-zA-Z_-]*:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-25s %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make build-mukham-dev                      # Build Mukham image for dev"
	@echo "  make deploy-mukham ENV=dev TAG=latest      # Deploy Mukham service to dev"
	@echo "  make deploy-all-mukham-prod TAG=v1.2.3    # Deploy all services including Mukham to prod"
	@echo "  make build-and-deploy-mukham-dev           # Build and deploy Mukham to dev"
