#!/bin/bash

# cd /home/ubuntu/deploy/bolier-CD
# ./deploy.sh > /dev/null 2> /dev/null < /dev/null &





cd /home/ubuntu/deploy/bolier-CD     # 해당 디렉토리로 이동 (Dockerfile 을 해당 디렉토리에 옮겼기 때문에)

docker-compose down

# echo "> docker container 정지"
# docker stop $(docker ps -a -q)

# echo "> docker container 삭제"
# docker rm $(docker ps -a -q)

echo "> docker images 삭제"
docker rmi $(docker images -a -q)

docker volume prune

y

docker-compose up -d --build       # Docker Image 생성 