# Stage 1: Build the application
FROM node:14-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application

FROM nginx:alpine

# Copy the build artifacts from the previous stage
COPY --from=build /app/build /usr/share/nginx/html
COPY . .
# Expose port 80
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

