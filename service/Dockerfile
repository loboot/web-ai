# 使用特定版本的 Node.js 镜像
FROM node:18

# 设置 NPM 和 PNPM 使用淘宝镜像源
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npm.taobao.org

# 安装 PM2
RUN npm install pm2 -g

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖
RUN pnpm install

# 暴露端口
EXPOSE 9520

# 启动命令
CMD ["pm2-runtime", "start", "pm2.conf.json"]

