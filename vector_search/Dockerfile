# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . /usr/src/app

# Install any needed packages specified in requirements.txt
#RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV PINECONE_API_KEY "4e0999db-a9a8-4449-a64e-aad74f89989f"

# Run app.py when the container launches
CMD ["python", "VectorSearch.py"]
