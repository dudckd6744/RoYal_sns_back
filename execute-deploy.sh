# #!/bin/bash

# cd /home/ubuntu/deploy/bolier-CD
# ./deploy.sh > /dev/null 2> /dev/null < /dev/null &



echo "> 현재 실행 중인 Docker 컨테이너 pid 확인" 

cd /home/ubuntu/deploy/bolier-CD     # 해당 디렉토리로 이동 (Dockerfile 을 해당 디렉토리에 옮겼기 때문에)

docker-compose down

docker rm `docker ps -a -q`

docker rmi `docker images -a -q`

docker volume prune


docker-compose up -d --build       # Docker Image 생성 