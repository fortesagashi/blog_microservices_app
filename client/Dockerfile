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

# Set the environment variable for the microservices API endpoint
ENV REACT_APP_COMMENTS_API_URL=http://posts:4001/posts/$postId/comments
ENV REACT_APP_DELETE_COMMENT_API_URL=http://posts:4001/comments/$deleteCommentId
ENV REACT_APP_LOGIN_API_URL=http://localhost:4002/login
ENV REACT_APP_REGISTER_API_URL=http://localhost:4002/register
ENV REACT_APP_POSTS_API_URL=http://localhost:4000/posts
ENV REACT_APP_SELECTED_POST_API_URL=http://localhost:4000/posts/$selectedPost.id
ENV REACT_APP_POST_API_URL=http://localhost:4000/posts/$postId
ENV REACT_APP_COUNT_API_URL=http://localhost:4000/posts/$post.id/count

# Build the application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
