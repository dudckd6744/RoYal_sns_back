# #!/bin/bash

cd /home/ubuntu/deploy/bolier-CD
./deploy.sh > /dev/null 2> /dev/null < /dev/null &



# echo "> 현재 실행 중인 Docker 컨테이너 pid 확인" 

# `docker-compose down`

# `docker rmi $(docker ps -a -q)`

# `docker volume prune`

# `docker rm $(docker ps -a -q)`

# cd /home/ubuntu/deploy/bolier-CD     # 해당 디렉토리로 이동 (Dockerfile 을 해당 디렉토리에 옮겼기 때문에)
# docker-compose up --build       # Docker Image 생성 
# # sudo docker run -d -p 5000:5000 dudckd  # Docker Container 생성