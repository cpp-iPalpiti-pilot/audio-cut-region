from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

if os.getenv("FLASK_ENV") == "development":
    # Development
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    # Deploy
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "https://your-frontend.vercel.app"}})


@app.route("/api/hello", methods=["GET"])
def hello():
    return {"message": "Hello from Flask!"}

if __name__=="__main__":
    app.run(host="0.0.0.0")