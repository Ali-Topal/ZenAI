# Use the official Node.js 16 image as base
# This is an LTS version that provides good stability and security
FROM node:16

# Set the working directory in the container
# This is where our application code will live
WORKDIR /app

# Copy package.json and package-lock.json first
# This is done separately from copying the rest of the app to take advantage of Docker's layer caching
# If these files haven't changed, Docker will use the cached dependencies
COPY package*.json ./

# Install dependencies
# Using npm ci instead of npm install for more reliable builds
# npm ci is specifically designed for automated environments like Docker
RUN npm ci

# Copy the rest of the application code
# This includes all files from the current directory
COPY . .

# Expose port 3000
# This documents which port the application is listening on
# Note: This is only documentation and doesn't actually publish the port
EXPOSE 3000

# Set NODE_ENV to production
# This optimizes Node.js for production use
ENV NODE_ENV=production

# Define the command to start the application
# Using array syntax is preferred as it avoids shell string parsing
CMD ["npm", "start"]