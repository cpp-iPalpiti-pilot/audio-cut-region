import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder=None)

if os.getenv("FLASK_ENV") == "development":
    # Development
    CORS(app, resources={r"/api/*": {"origins": "*"}, r"/static/*": {"origins": "*"}})
else:
    # Deploy
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "https://your-frontend.vercel.app"}})

AUDIO_FOLDER = "audios"


# User can see the list of audio file
@app.route("/api/audios", methods=["GET"])
def get_audio_list():
    files = [f for f in os.listdir(AUDIO_FOLDER)if f.endswith(".mp3")]
    return jsonify(files)

# User can see audio form
@app.route("/static/<path:filename>", methods=["GET"])
def serve_audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)


if __name__=="__main__":
    app.run(host="0.0.0.0")