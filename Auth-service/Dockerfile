FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production deps (change to npm install if dev)
RUN npm install

# Copy the rest of the service code
COPY . .

# Expose port
EXPOSE 4000

# Start the app
CMD ["npm", "run", "start"]
