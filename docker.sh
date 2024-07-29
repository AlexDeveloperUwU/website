docker build -t alexdevuwu-web .
docker run -d -p 3003:3000 -v /alexdevuwu-web/data:/data -v /alexdevuwu-web/env:/env alexdevuwu-web