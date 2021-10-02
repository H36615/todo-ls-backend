
echo starting container

# export .env
export $(cat .env | sed 's/#.*//g' | xargs)

docker run -d -p ${BACKEND_CONTAINER_PORT}:${BACKEND_APPLICATION_PORT} --name todo-ls-backend-container todo-ls-backend &&
echo Done! Port exposed to ${BACKEND_CONTAINER_PORT}.
