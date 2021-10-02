
# Build from:
FROM node:12-alpine

WORKDIR /

# Copy package & package-lock
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

RUN npm run lint

CMD [ "npm", "start" ]
