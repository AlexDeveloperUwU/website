docker build -t alexdevuwu-web .
docker run -d -p 3003:3000 -v /alexdevuwu-web/data:/usr/src/app/data -v /alexdevuwu-web/env:/usr/src/app/env alexdevuwu-web