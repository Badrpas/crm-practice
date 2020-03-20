FROM node:12.16.1
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY src src
COPY public public
RUN yarn build