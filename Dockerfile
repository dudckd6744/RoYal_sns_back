# # 배포용
# # Step 1
# # base image for Step 1: Node 10
# FROM node:10 AS builder
# WORKDIR /app
# COPY package.json /app
# RUN npm install
# ## 프로젝트의 모든 파일을 WORKDIR(/app)로 복사한다
# COPY . /app
# ## Nest.js project를 build 한다
# RUN npm run build


# # Step 2
# ## base image for Step 2: Node 10-alpine(light weight)
# FROM node:10-alpine
# WORKDIR /app
# ## Step 1의 builder에서 build된 프로젝트를 가져온다
# COPY --from=builder /app /app
# ## application 실행
# CMD ["npm", "run", "start:prod"]

# NOTE: release docker file! 
# NOTE: 1.빌드
FROM node:10 AS builder

WORKDIR /app

COPY package.json /app

COPY . /app

RUN npm run build


# NOTE: 2.pkg 바이너리 파일만들기
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app /app

COPY package.json /app

RUN npm install -g pkg

RUN npm run pkg

# MULTI Staging
FROM ubuntu:18.04

COPY --from=1 /app/dist/royalServer ./

COPY .env ./

CMD ./royalServer