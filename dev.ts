// # # Step 1
// # ## base image for Step 1: Node 10
// # FROM node:10-alpine

// # WORKDIR /app

// # COPY package.json .

// # RUN npm install
// # ## 프로젝트의 모든 파일을 WORKDIR(/app)로 복사한다
// # COPY . .

// # CMD ["npm", "run", "start:dev"]