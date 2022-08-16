FROM node:current-alpine
RUN mkdir /pugbot
ADD ./pugbot-js /pugbot
WORKDIR /pugbot
RUN npm install
CMD npm start