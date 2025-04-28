import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from pydub import AudioSegment

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

# User can clip audio with selected region
@app.route("/api/clip", methods=["POST"])
def clip_audio():
    data = request.get_json()
    filename = data['audioName']
    start = data['start']
    end = data['end']

    full_path = os.path.join(AUDIO_FOLDER, filename)

    audio = AudioSegment.from_file(full_path)
    clipped = audio[start*1000:end*1000]  # pydub is mili second
    
    output_filename = f"clip_{filename}"
    output_path = os.path.join(AUDIO_FOLDER, output_filename)
    clipped.export(output_path, format="mp3")

    return jsonify({"clipFilename": output_filename})


if __name__=="__main__":
    app.run(host="0.0.0.0")