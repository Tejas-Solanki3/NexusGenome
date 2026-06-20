# Use lightweight Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the backend source code
COPY . .

# Expose the port the Express API runs on
EXPOSE 5001

# Command to start the server
CMD ["npm", "start"]