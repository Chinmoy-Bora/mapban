# Use the official Node.js image as the base
FROM node:18-alpine

# Install necessary build tools for compiling native dependencies like sqlite3
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    python3-dev \
    libffi-dev \
    bash \
    && rm -rf /var/cache/apk/*  # Clean up after installing

# Set the working directory for your app
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package.json package-lock.json ./

# Force reinstall of sqlite3 from source (use --build-from-source)


# Install app dependencies
RUN npm install
RUN npm install sqlite3 

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
