from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from models import User, db, UserEvent
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy.exc import IntegrityError
from flask import session

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'secret_key'

jwt_manager = JWTManager(app)
db.init_app(app)
bcrypt = Bcrypt(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    username = data.get('username')
    password = data.get('password')
    try:
        existing_user = User.query.filter_by(username=username).first()
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 409
    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    return jsonify({'message': 'User registered successfully'}), 201
    # response = jsonify({'message': 'User registered successfully'}), 201
    

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid username or password'}), 401
    # access_token = create_access_token(identity=user.id)
    session.permanent = True
    session['user_id'] = user.id
    session['username'] = username
    session.modified = True
    expires_delta = timedelta(seconds=31536000)
    access_token = create_access_token(identity=user.id, expires_delta=expires_delta)
    # return jsonify({'access_token': access_token}), 200
    print(f"{username = }")
    return jsonify({'message': 'User logged in successfully', 'username': data.get('username'), 'access_token': access_token}), 200

@app.route("/get_users", methods=['GET'])
def get_user():
    try:
        users = User.query.all()
        user_list = [{'id': user.id, 'username': user.username, 'password': user.password} for user in users]
        return jsonify({'users': user_list}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    

# @app.route('/add_item', methods=['POST'])
# def add_event():
#     data = request.get_json()
#     if not data or not data.get('username') or not data.get('name') or not data.get('date'):
#         return jsonify({'message': 'Missing data'}), 400
#     username = data.get('username')
#     name = data.get('name')
#     date_str = data.get('date')
#     date = datetime.strptime(date_str, '%d/%m/%y')
#     user = User.query.filter_by(username=username).first()
#     if not user:
#         return jsonify({'message': 'User not found'}), 404
#     try:
#         new_event = UserEvent(user_id=user.id, name=name, date=date)
#         db.session.add(new_event)
#         db.session.commit()
#     except IntegrityError:
#         return jsonify({'message': 'Event already exists'}), 409
#     return jsonify({'message': 'Event added successfully'}), 201


@app.route('/add_event', methods=['POST'])
@jwt_required()
def add_event():
    # print(session)
    # if 'user_id' not in session:
    #     return jsonify({'message': 'User not logged in'}), 401
    user_id = get_jwt_identity()
    print(f"{user_id = }")
    data = request.get_json()
    if not data or not data.get('name') or not data.get('date'):
        return jsonify({'message': 'Missing data'}), 400
    name = data.get('name')
    date_str = data.get('date')
    date = datetime.strptime(date_str, '%d/%m/%Y')
    print()
    # user = User.query.get(session['user_id'])
    # if not user:
    #     return jsonify({'message': 'User not found'}), 404
    new_event = UserEvent(user_id=user_id, name=name, date=date)
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'message': 'Event added successfully'}), 201

# @app.route('/get_items', methods=['GET'])
# def get_events():
#     try:
#         events = UserEvent.query.all()
#         event_list = [{'id': event.id, 'user_id': event.user_id, 'name': event.name, 'date': event.date} for event in events]
#         return jsonify({'events': event_list}), 200
#     except Exception as e:
#         return jsonify({'message': str(e)}), 500

@app.route('/get_items', methods=['GET'])
@jwt_required()
def get_items():
    # if 'user_id' not in session:
    #     return jsonify({'message': 'User not logged in'}), 401
    # user = User.query.filter_by(username=session['username']).first()
    # user = User.query.get(session['user_id'])
    # if not user:
    #     return jsonify({'message': 'User not found'}), 404
    user_id = get_jwt_identity();
    events = UserEvent.query.filter_by(user_id=user_id).all()
    # output = []
    # for event in events:
    #     output.append({
    #         'id': event.id,
    #         'name': event.name,
    #         'date': event.date.strftime('%d/%m/%y')
    #     })
    # return jsonify(output)
    return jsonify([{'id': event.id, 'name': event.name, 'date': event.date.strftime('%d/%m/%Y')} for event in events]), 200

# @app.route('/delete_item', methods=['DELETE'])
# def delete_event():
#     data = request.get_json()
#     if not data or not data.get('name') or not data.get('username'):
#         return jsonify({'message': 'Missing data'}), 400
#     name = data.get('name')
#     username = data.get('username')
#     user = User.query.filter_by(username=username).first()
#     if not user:
#         return jsonify({'message': 'User not found'}), 404
#     event = UserEvent.query.filter_by(name=name, user_id=user.id).first()
#     if not event:
#         return jsonify({'message': 'Item not found'}), 404
#     db.session.delete(event)
#     db.session.commit()
#     return jsonify({'message': 'Item deleted successfully'}), 200

@app.route('/delete_event', methods=['DELETE'])
@jwt_required()
def delete_event():
    # if 'user_id' not in session:
    #     return jsonify({'message': 'User not logged in'}), 401
    # name = request.form.get('name')
    # if not name:
    #     return jsonify({'message': 'Missing event name'}), 400
    # # user = User.query.filter_by(username=session['username']).first()
    # user = User.query.get(session['user_id'])
    # if not user:
    #     return jsonify({'message': 'User not found'}), 404
    # event = UserEvent.query.filter_by(name=name, user_id=user.id).first()
    # if not event:
    #     return jsonify({'message': 'Event not found'}), 404
    # db.session.delete(event)
    # db.session.commit()
    # return jsonify({'message': 'Event deleted successfully'}), 200
    user_id = get_jwt_identity()
    print(user_id)
    data = request.get_json()
    # if not data or not data.get('name'):
    #     return jsonify({'message': 'Missing data'}), 400
    if not data or not data.get('id'):
        return jsonify({'message': 'Missing data'}), 400
    event_id = data.get('id')
    # user = User.query.get(session['user_id'])
    # if not user:
    #     return jsonify({'message': 'User not found'}), 404
    event = UserEvent.query.filter_by(user_id=user_id, id=event_id).first()
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)