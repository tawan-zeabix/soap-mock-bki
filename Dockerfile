# Use an official Node.js runtime as the parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Install TypeScript globally (optional if you're using tsc via npm scripts)
RUN npm install -g typescript

COPY ./src/customer_spec.wsdl ./dist/

# Compile the TypeScript code
RUN npm run build

# Expose the application port (change if necessary)
EXPOSE 3000

# Define the command to run the app using the compiled JavaScript
CMD ["node", "dist/index.js"]
