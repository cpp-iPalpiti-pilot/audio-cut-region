FROM python:3.11-slim

# Install ffmpeg and dependencies
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean

# Working directly
WORKDIR /app

# Dependency Install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App code copy
COPY . .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
EXPOSE 5000

CMD ["flask", "run"]
