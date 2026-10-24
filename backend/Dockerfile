FROM python:3.11-slim

WORKDIR /app

# Install git since the app clones repositories
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p repos chroma_db

# Copy the rest of the application
COPY . .

# Hugging Face Spaces run on port 7860 by default
EXPOSE 7860

# Run the FastAPI app using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
