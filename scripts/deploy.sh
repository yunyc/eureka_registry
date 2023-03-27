# 가동중인 awsstudy 도커 중단 및 삭제
sudo docker ps -a -q --filter "name=keyword_seacher_gateway" | grep -q . && docker stop keyword_seacher_gateway && docker rm keyword_seacher_gateway | true

# 기존 이미지 삭제
sudo docker rmi yeomin1024/keyword_seacher_gateway:1.0

# 도커허브 이미지 pull
sudo docker pull yeomin1024/keyword_seacher_gateway:1.0

# 도커 run
docker run -d -p 8080:8080 --name keyword_seacher_gateway yeomin1024/keyword_seacher_gateway:1.0

# 사용하지 않는 불필요한 이미지 삭제 -> 현재 컨테이너가 물고 있는 이미지는 삭제되지 않습니다.
docker rmi -f $(docker images -f "dangling=true" -q) || true
