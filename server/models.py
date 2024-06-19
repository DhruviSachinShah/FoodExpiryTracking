# from sqlalchemy import Table, Column, Integer, String
# from sqlalchemy.ext.declarative import declarative_base
# from flask_sqlalchemy import SQLAlchemy
# # from app import db        #not commented

# Base = declarative_base()
# db = SQLAlchemy()         #not commented


# class User(db.Model):           # before: User(db.model)
#     __tablename__ = 'user'
#     id = Column(Integer, primary_key=True)
#     username = Column(String(50), unique=True, nullable=False)
#     password = Column(String(100), nullable=False)

#     def _repr_(self):
#         return f'<User {self.username}>'

# # User = Table('user', Base.metadata, extend_existing=True)






from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class UserEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    user = db.relationship('User', backref=db.backref('user_events', lazy=True))