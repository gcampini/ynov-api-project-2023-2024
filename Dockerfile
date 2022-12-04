FROM node:18

WORKDIR /home/node/yspotify

COPY package*.json ./
COPY src ./src
COPY secrets ./secrets

RUN npm install --only=production

RUN chown -R node:node /home/node/yspotify
USER node

CMD ["npm", "start"]
