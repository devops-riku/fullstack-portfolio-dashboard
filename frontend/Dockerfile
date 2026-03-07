FROM node:20-alpine

WORKDIR /app

# install dependencies first (better caching)
COPY package.json package-lock.json ./
RUN npm install

# copy project
COPY . .

# expose vite port
EXPOSE 5173

# start vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]