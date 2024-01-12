# Use an official Node.js image as a base image
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/devops/backend

# Specify the correct path to the .env file
COPY .env ./

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run your application
CMD ["npm", "start"]

