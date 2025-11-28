from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime
import hashlib

app = Flask(__name__)
CORS(app)

# Простое хранилище в JSON файлах
DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def load_data(filename):
    filepath = os.path.join(DATA_DIR, f'{filename}.json')
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_data(filename, data):
    filepath = os.path.join(DATA_DIR, f'{filename}.json')
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    return hash_password(password) == hashed

# ============================================
# РЕГИСТРАЦИЯ И ВХОД
# ============================================

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'help')

    if not username or not password:
        return jsonify({'success': False, 'error': 'Заполните все поля'}), 400

    users = load_data('users')
    
    # Проверка, существует ли пользователь
    if any(u['username'] == username for u in users):
        return jsonify({'success': False, 'error': 'Пользователь уже существует'}), 409

    # Создаём нового пользователя
    new_user = {
        'id': len(users) + 1,
        'username': username,
        'password': hash_password(password),
        'role': role,
        'created_at': datetime.now().isoformat()
    }
    
    users.append(new_user)
    save_data('users', users)

    # Возвращаем данные БЕЗ пароля
    user_data = {k: v for k, v in new_user.items() if k != 'password'}
    token = f"token_{new_user['id']}"

    return jsonify({
        'success': True,
        'message': 'Регистрация успешна!',
        'user': user_data,
        'token': token
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'success': False, 'error': 'Заполните все поля'}), 400

    users = load_data('users')
    user = next((u for u in users if u['username'] == username), None)

    if not user or not verify_password(password, user['password']):
        return jsonify({'success': False, 'error': 'Неверные учётные данные'}), 401

    user_data = {k: v for k, v in user.items() if k != 'password'}
    token = f"token_{user['id']}"

    return jsonify({
        'success': True,
        'message': 'Вход успешен!',
        'user': user_data,
        'token': token
    }), 200

# ============================================
# ЗАПРОСЫ ПОМОЩИ
# ============================================

@app.route('/api/help-requests', methods=['GET'])
def get_help_requests():
    requests_data = load_data('help_requests')
    return jsonify(requests_data), 200

@app.route('/api/help-requests', methods=['POST'])
def create_help_request():
    data = request.get_json()
    requests_data = load_data('help_requests')
    
    new_request = {
        'id': len(requests_data) + 1,
        'creator_id': data.get('creator_id'),
        'creator': data.get('creator', 'Unknown'),
        'title': data.get('title'),
        'description': data.get('description'),
        'category': data.get('category', 'other'),
        'status': 'open',
        'created_at': datetime.now().isoformat()
    }
    
    requests_data.append(new_request)
    save_data('help_requests', requests_data)
    
    return jsonify({'success': True, 'request': new_request}), 201

# ============================================
# ЧАТ
# ============================================

@app.route('/api/messages', methods=['GET'])
def get_messages():
    messages = load_data('messages')
    return jsonify(messages), 200

@app.route('/api/messages', methods=['POST'])
def send_message():
    data = request.get_json()
    messages = load_data('messages')
    
    new_message = {
        'id': len(messages) + 1,
        'sender_id': data.get('sender_id'),
        'sender': data.get('sender', 'Unknown'),
        'receiver_id': data.get('receiver_id'),
        'receiver': data.get('receiver', 'Unknown'),
        'content': data.get('content'),
        'created_at': datetime.now().isoformat()
    }
    
    messages.append(new_message)
    save_data('messages', messages)
    
    return jsonify({'success': True, 'message': new_message}), 201

# ============================================
# ФОРУМ
# ============================================

@app.route('/api/forum/topics', methods=['GET'])
def get_topics():
    topics = load_data('forum_topics')
    return jsonify(topics), 200

@app.route('/api/forum/topics', methods=['POST'])
def create_topic():
    data = request.get_json()
    topics = load_data('forum_topics')
    
    new_topic = {
        'id': len(topics) + 1,
        'creator_id': data.get('creator_id'),
        'creator': data.get('creator', 'Unknown'),
        'title': data.get('title'),
        'content': data.get('content'),
        'category': data.get('category', 'general'),
        'comments_count': 0,
        'created_at': datetime.now().isoformat()
    }
    
    topics.append(new_topic)
    save_data('forum_topics', topics)
    
    return jsonify({'success': True, 'topic': new_topic}), 201

# ============================================
# ОТЗЫВЫ
# ============================================

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    reviews = load_data('reviews')
    return jsonify(reviews), 200

@app.route('/api/reviews', methods=['POST'])
def create_review():
    data = request.get_json()
    reviews = load_data('reviews')
    
    new_review = {
        'id': len(reviews) + 1,
        'reviewer_id': data.get('reviewer_id'),
        'reviewer': data.get('reviewer', 'Unknown'),
        'volunteer_id': data.get('volunteer_id'),
        'volunteer': data.get('volunteer', 'Unknown'),
        'rating': data.get('rating'),
        'comment': data.get('comment', ''),
        'created_at': datetime.now().isoformat()
    }
    
    reviews.append(new_review)
    save_data('reviews', reviews)
    
    return jsonify({'success': True, 'review': new_review}), 201

# ============================================
# СТАТУС
# ============================================

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'ok',
        'message': 'API is working',
        'service': 'HelpMap',
        'features': ['auth', 'help_requests', 'chat', 'forum', 'reviews']
    }), 200

@app.route('/', methods=['GET'])
def home():
    return 'HelpMap Backend - OK ✅', 200

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
