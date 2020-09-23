
# Build from:
FROM node:12


WORKDIR /

# Copy package & package-lock
COPY package*.json ./

RUN npm install
# TODO If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]



