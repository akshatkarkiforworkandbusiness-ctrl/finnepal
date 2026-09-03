FROM node:20-alpine

WORKDIR /app

# react-native-svg and friends need to build native addons during npm install.
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--localhost", "--port", "8081"]
