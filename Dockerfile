FROM node:20-alpine

WORKDIR /app

RUN npm install -g expo-cli@6.3.10

CMD ["npm", "start"]