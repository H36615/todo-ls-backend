
PORT=3001

echo starting container

docker run -d -p $PORT:3000 --name todo-ls-backend-container todo-ls-backend &&
echo port is forwarded $PORT
