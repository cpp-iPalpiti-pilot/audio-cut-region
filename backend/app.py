import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

if os.getenv("FLASK_ENV") == "development":
    # Development
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    # Deploy
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "https://your-frontend.vercel.app"}})

AUDIO_FOLDER = "./audios"

@app.route("/api/audios", methods=["GET"])
def get_audio_list():
    files = [f for f in os.listdir(AUDIO_FOLDER)if f.endswith(".mp3")]
    return jsonify(files)

# @app.route("/api/hello", methods=["GET"])
# def hello():
#     return {"message": "Hello from Flask!"}

if __name__=="__main__":
    app.run(host="0.0.0.0")