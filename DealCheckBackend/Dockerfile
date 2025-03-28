# Use python 3.12 base image
FROM python:3.12-slim

# The working dir in the container is /app
WORKDIR /app

# Copy project requirements and install libraries
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Run the app on port 8001
EXPOSE 8001

# Run the development server
CMD ["python", "app.py"]