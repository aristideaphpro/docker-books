FROM node:24.22.3-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js ./
COPY models ./models
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
