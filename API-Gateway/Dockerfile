FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the gateway code
COPY . .

# Build TypeScript to dist/
RUN npm run build

# Expose port (standardized to 8080 for all services)
EXPOSE 8080

# Start the built server
CMD ["node", "dist/server.js"]

