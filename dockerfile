# Client build stage
FROM node:20-alpine as client-build

WORKDIR /app

# Copy the entire client directory
COPY client ./client

WORKDIR /app/client

# Install dependencies
RUN npm install --legacy-peer-deps

# Build the project
RUN npm run build

# Server stage
FROM python:3.9-slim

WORKDIR /app

# Copy the entire server directory
COPY server ./server

WORKDIR /app/server

RUN pip install --no-cache-dir -r requirements.txt

# Create static directory and copy client build
RUN mkdir -p static
COPY --from=client-build /app/client/dist ./static

ENV FLASK_APP=main.py
ENV FLASK_ENV=production

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "main:app"]