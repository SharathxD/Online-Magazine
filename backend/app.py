from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import os
from werkzeug.utils import secure_filename
from bson.json_util import dumps
from bson import ObjectId

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

bcrypt = Bcrypt(app)

client = MongoClient('mongodb://localhost:27017/')
db = client.digital_magazine
users_collection = db.users
articles_collection = db.articles
approval_collection = db.approval

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user_data = {
        'username': data['username'],
        'mail_id': data['mail_id'],
        'password': hashed_password,
        'role': 'user'
    }
    users_collection.insert_one(user_data)
    return jsonify(message="User registered successfully"), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('usernameOrEmail')
    password = data.get('password')
    user = users_collection.find_one({
        '$or': [{'username': username_or_email}, {'mail_id': username_or_email}]
    })
    if user:
        if user.get('role') == 'admin':
            print(user.get('role'))
            if user['password'] == password:
                return jsonify(message="Login successful", role=user['role']), 200
            else:
                return jsonify(message="Invalid credentials"), 401
        else:
            if bcrypt.check_password_hash(user['password'], password):
                return jsonify(message="Login successful", role=user['role']), 200
            else:
                return jsonify(message="Invalid credentials"), 401
    else:
        return jsonify(message="Invalid credentials"), 401

@app.route('/articles', methods=['POST'])
def create_article():
    data = request.form
    file = request.files.get('image')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        image_url = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    else:
        return jsonify(error="Invalid file format"), 400
    article = {
        'title': data['title'],
        'author': data['author'],
        'content': data['content'],
        'tags': data.getlist('tags'),
        'image_url': image_url,
    }
    articles_collection.insert_one(article)
    return jsonify(message='Article created successfully'), 201

@app.route('/articles', methods=['GET'])
def get_articles():
    category = request.args.get('category')
    query = {'categories': category} if category else {}
    articles = articles_collection.find(query)
    return dumps(articles), 200

@app.route('/user-content', methods=['POST'])
def submit_user_content():
    data = request.form
    image = request.files.get('image')
    approval_collection.insert_one({
        'title': data['title'],
        'author': data['author'],
        'content': data['content'],
        'image': image.filename,
        'status': 'pending'
    })
    return jsonify(message="Content submitted for admin approval"), 201

@app.route('/pending-articles', methods=['GET'])
def get_pending_articles():
    pending_articles = approval_collection.find()
    articles_list = []
    for article in pending_articles:
        article['_id'] = str(article['_id'])
        articles_list.append(article)
    return jsonify(articles=articles_list), 200

@app.route('/approve-article/<article_id>', methods=['POST'])
def approve_article(article_id):
    article = approval_collection.find_one({'_id': ObjectId(article_id)})
    if not article:
        return jsonify(error="Article not found"), 404
    articles_collection.insert_one(article)
    approval_collection.delete_one({'_id': ObjectId(article_id)})
    return jsonify(message="Article approved successfully"), 200

if __name__ == '__main__':
    app.run(debug=True)
