# Use an official Node.js runtime as a parent image
FROM node:18.16

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables for MongoDB connection
ENV MONGO_HOST=localhost
ENV MONGO_PORT=27017
ENV MONGO_DB=myapp



# Expose the port that the application will run on
EXPOSE 4002 

# Start the application
CMD ["npm", "start"]
