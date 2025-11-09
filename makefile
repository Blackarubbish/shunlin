.PHONY: help install dev build clean test lint docker-build docker-up docker-down all
.DEFAULT_GOAL := help

# 项目配置
PROJECT_NAME=shunlin-blog
SERVER_NAME=sl-blog-server
WEB_DIR=web
SERVER_DIR=server

# 颜色输出
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

##@ 帮助信息

help: ## 显示帮助信息
	@echo ''
	@echo '用法:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo '目标:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_0-9-]+:.*?##.*$$/) {printf "    ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)

##@ 开发环境

install: ## 安装所有依赖
	@echo "${GREEN}正在安装后端依赖...${RESET}"
	cd $(SERVER_DIR) && go mod download && go mod tidy
	@echo "${GREEN}正在安装前端依赖...${RESET}"
	cd $(WEB_DIR) && pnpm install

dev: ## 启动开发环境（前后端同时运行）
	@echo "${GREEN}启动开发环境...${RESET}"
	@echo "${YELLOW}前端运行在: http://localhost:3000${RESET}"
	@echo "${YELLOW}后端运行在: http://localhost:8080${RESET}"
	make -j2 dev-server dev-web

dev-server: ## 仅启动后端开发服务器
	@echo "${GREEN}启动后端服务...${RESET}"
	cd $(SERVER_DIR) && make run

dev-web: ## 仅启动前端开发服务器
	@echo "${GREEN}启动前端服务...${RESET}"
	cd $(WEB_DIR) && pnpm dev

##@ 构建

build: build-server build-web ## 构建整个项目

build-server: ## 构建后端
	@echo "${GREEN}构建后端...${RESET}"
	cd $(SERVER_DIR) && make build
	@echo "${GREEN}后端构建完成: $(SERVER_DIR)/$(SERVER_NAME)${RESET}"

build-web: ## 构建前端
	@echo "${GREEN}构建前端...${RESET}"
	cd $(WEB_DIR) && pnpm build
	@echo "${GREEN}前端构建完成${RESET}"

##@ 测试与代码质量

test: test-server test-web ## 运行所有测试

test-server: ## 运行后端测试
	@echo "${GREEN}运行后端测试...${RESET}"
	cd $(SERVER_DIR) && make test

test-web: ## 运行前端测试
	@echo "${GREEN}运行前端测试...${RESET}"
	cd $(WEB_DIR) && pnpm test

lint: lint-server lint-web ## 运行所有代码检查

lint-server: ## 运行后端代码检查
	@echo "${GREEN}检查后端代码...${RESET}"
	cd $(SERVER_DIR) && make lint

lint-web: ## 运行前端代码检查
	@echo "${GREEN}检查前端代码...${RESET}"
	cd $(WEB_DIR) && pnpm run lint

##@ Docker

docker-build: docker-build-server docker-build-web ## 构建所有 Docker 镜像

docker-build-server: ## 构建后端 Docker 镜像
	@echo "${GREEN}构建后端 Docker 镜像...${RESET}"
	cd $(SERVER_DIR) && make docker-build

docker-build-web: ## 构建前端 Docker 镜像
	@echo "${GREEN}构建前端 Docker 镜像...${RESET}"
	docker build -t $(PROJECT_NAME)-web:latest $(WEB_DIR)

docker-up: ## 启动 Docker Compose 服务
	@echo "${GREEN}启动 Docker 服务...${RESET}"
	docker-compose up -d

docker-down: ## 停止 Docker Compose 服务
	@echo "${GREEN}停止 Docker 服务...${RESET}"
	docker-compose down

docker-logs: ## 查看 Docker 日志
	docker-compose logs -f

##@ 清理

clean: clean-server clean-web ## 清理所有构建产物

clean-server: ## 清理后端构建产物
	@echo "${GREEN}清理后端...${RESET}"
	cd $(SERVER_DIR) && make clean

clean-web: ## 清理前端构建产物
	@echo "${GREEN}清理前端...${RESET}"
	cd $(WEB_DIR) && rm -rf node_modules dist .turbo
	find $(WEB_DIR) -name "node_modules" -type d -prune -exec rm -rf {} +
	find $(WEB_DIR) -name "dist" -type d -prune -exec rm -rf {} +
	find $(WEB_DIR) -name ".turbo" -type d -prune -exec rm -rf {} +

clean-all: clean ## 深度清理（包括依赖）
	@echo "${GREEN}深度清理项目...${RESET}"
	cd $(SERVER_DIR) && go clean -cache -modcache
	cd $(WEB_DIR) && rm -rf node_modules pnpm-lock.yaml

##@ 快捷操作

restart: ## 重启开发环境
	@echo "${GREEN}重启开发环境...${RESET}"
	make clean
	make install
	make dev

prod-build: ## 生产环境构建（包括测试和代码检查）
	@echo "${GREEN}生产环境构建流程...${RESET}"
	make lint
	make test
	make build
	@echo "${GREEN}生产环境构建完成！${RESET}"

check: ## 快速检查（代码检查 + 测试）
	make lint
	make test

status: ## 显示项目状态
	@echo "${CYAN}========== 项目状态 ==========${RESET}"
	@echo "${YELLOW}后端:${RESET}"
	@cd $(SERVER_DIR) && go version
	@echo "${YELLOW}前端:${RESET}"
	@cd $(WEB_DIR) && node --version && pnpm --version
	@echo "${CYAN}=============================${RESET}"

