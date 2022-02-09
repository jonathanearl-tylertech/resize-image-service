FROM node:lts
WORKDIR /app
COPY ./service/package*.json ./
RUN npm ci
COPY ./service/ ./
EXPOSE 5010
CMD ["npm", "start"]