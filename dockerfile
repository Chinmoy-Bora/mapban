# Use the official Node.js image as the base
FROM node:18-alpine

# Install necessary build tools for compiling native dependencies
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    python3-dev \
    libffi-dev \
    bash \
    postgresql-dev && \
    rm -rf /var/cache/apk/*

# Set the working directory for your app
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
