git pull
docker stop alexdevuwu-web && docker rm alexdevuwu-web
docker images -q alexdevuwu-web | xargs docker rmi
docker build -t alexdevuwu-web .
docker run -d --name alexdevuwu-web -p 3003:3000 -v /alexdevuwu-web/data:/usr/src/app/data -v /alexdevuwu-web/env:/usr/src/app/env alexdevuwu-web
