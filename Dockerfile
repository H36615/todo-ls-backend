

ENV HOME /Users/b718675/Projects/another-server
# TODO
ENV PROJECT $HOME/another-server

# Build from.
FROM node:12

WORKDIR $HOME

# Copy package & package-lock
COPY package*.json ./

RUN npm install
# TODO If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.ts" ]



