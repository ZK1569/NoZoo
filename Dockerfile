FROM node:18-alpine as typescript-build

WORKDIR /app

COPY . /app

RUN npm install 

RUN npm run build



FROM node:18-alpine

WORKDIR /app

COPY package*.json /app

COPY --from=typescript-build /app/dist /app/dist

RUN npm install --omit=dev

CMD npm start