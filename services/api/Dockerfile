FROM node:10-alpine

WORKDIR /app

COPY package.json .

RUN npm i 

COPY . ./

ENV POST 5173

EXPOSE $PORT

CMD ["npm", "run", "dev-nodemon"]