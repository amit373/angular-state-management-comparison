.PHONY: help install build build-app serve docker-build docker-run docker-stop docker-clean clean clean-all lint lint-fix format format-check test test-app dev check

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation
install: ## Install dependencies
	pnpm install

# Build targets
build: ## Build all apps
	pnpm nx run-many --target=build --all

build-app: ## Build specific app (usage: make build-app APP=behavior-subject-app)
	pnpm nx build $(APP)

# Serve targets for each app
serve-behavior-subject: ## Serve BehaviorSubject app
	pnpm nx serve behavior-subject-app

serve-ngrx: ## Serve NgRx app
	pnpm nx serve ngrx-app

serve-signals: ## Serve Signals app
	pnpm nx serve signals-app

serve-akita: ## Serve Akita app
	pnpm nx serve akita-app

serve-event-store: ## Serve Event Store app
	pnpm nx serve event-store-app

serve-component-local: ## Serve Component Local State app
	pnpm nx serve component-local-state-app

serve-ngrx-signals: ## Serve NgRx Signals app
	pnpm nx serve ngrx-signals-app

# Docker targets
docker-build: ## Build Docker image
	docker build -t angular-state-comparison .

docker-run: ## Run Docker container
	docker run -p 4200:80 angular-state-comparison

docker-stop: ## Stop all running containers
	docker stop $$(docker ps -q --filter ancestor=angular-state-comparison) 2>/dev/null || true

docker-clean: ## Remove Docker image and containers
	docker rm -f $$(docker ps -aq --filter ancestor=angular-state-comparison) 2>/dev/null || true
	docker rmi angular-state-comparison 2>/dev/null || true

# Cleanup targets
clean: ## Clean build artifacts
	rm -rf dist .nx

clean-all: ## Clean build artifacts and node_modules
	rm -rf dist .nx node_modules

# Code quality targets
lint: ## Lint all projects
	pnpm nx lint

lint-fix: ## Lint and fix all projects
	pnpm nx lint --fix

format: ## Format code
	pnpm format

format-check: ## Check code formatting
	pnpm format:check

# Test targets
test: ## Run tests for all projects
	pnpm nx test --all

test-app: ## Run tests for specific app (usage: make test-app APP=behavior-subject-app)
	pnpm nx test $(APP)

# Development targets
dev: ## Start all apps in development mode (parallel)
	pnpm nx run-many --target=serve --all --parallel=7

# Utility targets
check: ## Check if all apps build successfully
	@echo "Checking all apps..."
	@for app in behavior-subject-app ngrx-app signals-app akita-app event-store-app component-local-state-app ngrx-signals-app; do \
		echo "Building $$app..."; \
		pnpm nx run $$app:build --skip-nx-cache > /dev/null 2>&1 && echo "  ✅ $$app" || echo "  ❌ $$app"; \
	done
