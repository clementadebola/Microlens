# Client build stage
FROM node:20-alpine as client-build

WORKDIR /app/client

# Copy package.json and package-lock.json (if available)
COPY client/package*.json ./

# Clear npm cache, install dependencies with error logging
RUN npm cache clean --force && \
    npm install --verbose || (cat /root/.npm/_logs/*-debug.log && exit 1)

COPY client/ .

RUN npm run build

# Server stage
FROM python:3.9-slim

WORKDIR /app/server

COPY server/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY server/ .

# Create static directory and copy client build
RUN mkdir -p static
COPY --from=client-build /app/client/dist /app/server/static

ENV FLASK_APP=main.py
ENV FLASK_ENV=production

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "main:app"]