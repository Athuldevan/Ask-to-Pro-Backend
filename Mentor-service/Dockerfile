FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install all deps (or use --omit=dev in production)
RUN npm install

# Copy the service code
COPY . .

# Build TypeScript to dist/
RUN npm run build

# Expose the mentor service port
EXPOSE 4000

# Start the built server
CMD ["npm", "run", "start"]
