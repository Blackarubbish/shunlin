#!/bin/bash

set -e

echo "正在启动项目..."
# 更新代码
echo "正在更新代码..."
git pull

# 安装依赖
echo "正在安装依赖..."
pnpm install

# 构建项目
echo "正在构建项目..."
pnpm build

# 启动项目
pnpm start
# 输出启动成功信息
echo "项目已成功启动！"