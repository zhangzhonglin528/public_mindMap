# 使用官方 Node.js 镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 复制本地项目文件到容器
COPY . .

# 安装项目依赖
RUN npm install

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["npm", "run", "start"]