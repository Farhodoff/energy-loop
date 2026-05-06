# Build Stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production Stage
FROM python:3.11-slim

WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend assets from build stage to 'static' folder in backend
COPY --from=build /app/dist ./static

# Expose port (FastAPI default is 8000)
EXPOSE 8000

# Run commands
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"
