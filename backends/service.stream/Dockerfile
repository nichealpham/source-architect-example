FROM node:slim
ARG DEBIAN_FRONTEND=noninteractive

# Create app directory
WORKDIR /app

# Bundle app source & Install app dependencies
COPY . /app/

RUN npm install --only=production

CMD [ "npm", "start" ]