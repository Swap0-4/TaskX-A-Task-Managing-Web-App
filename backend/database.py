from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
import json
from datetime import datetime

# MongoDB connection setup
app = Flask(__name__)
CORS(app)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/taskmanager"
mongo = PyMongo(app)

# Helper function to convert MongoDB ObjectId to string for JSON serialization
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

app.json_encoder = JSONEncoder

# Task Routes
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = list(mongo.db.tasks.find())
    return jsonify(tasks)

@app.route('/tasks/<id>', methods=['GET'])
def get_task(id):
    task = mongo.db.tasks.find_one({'_id': ObjectId(id)})
    if task:
        return jsonify(task)
    return jsonify({'error': 'Task not found'}), 404

@app.route('/tasks', methods=['POST'])
def add_task():
    task_data = request.json
    task_data['created_at'] = datetime.utcnow()
    task_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'title' not in task_data:
        return jsonify({'error': 'Title is required'}), 400
        
    result = mongo.db.tasks.insert_one(task_data)
    task_data['_id'] = str(result.inserted_id)
    
    return jsonify(task_data), 201

@app.route('/tasks/<id>', methods=['PUT'])
def update_task(id):
    task_data = request.json
    task_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'title' not in task_data:
        return jsonify({'error': 'Title is required'}), 400
        
    result = mongo.db.tasks.update_one(
        {'_id': ObjectId(id)},
        {'$set': task_data}
    )
    
    if result.matched_count:
        updated_task = mongo.db.tasks.find_one({'_id': ObjectId(id)})
        return jsonify(updated_task)
    return jsonify({'error': 'Task not found'}), 404

@app.route('/tasks/<id>', methods=['DELETE'])
def delete_task(id):
    result = mongo.db.tasks.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({'message': 'Task deleted successfully'})
    return jsonify({'error': 'Task not found'}), 404

# Goal Routes
@app.route('/goals', methods=['GET'])
def get_goals():
    goals = list(mongo.db.goals.find())
    return jsonify(goals)

@app.route('/goals/<id>', methods=['GET'])
def get_goal(id):
    goal = mongo.db.goals.find_one({'_id': ObjectId(id)})
    if goal:
        return jsonify(goal)
    return jsonify({'error': 'Goal not found'}), 404

@app.route('/goals', methods=['POST'])
def add_goal():
    goal_data = request.json
    goal_data['created_at'] = datetime.utcnow()
    goal_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'title' not in goal_data:
        return jsonify({'error': 'Title is required'}), 400
        
    result = mongo.db.goals.insert_one(goal_data)
    goal_data['_id'] = str(result.inserted_id)
    
    return jsonify(goal_data), 201

@app.route('/goals/<id>', methods=['PUT'])
def update_goal(id):
    goal_data = request.json
    goal_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'title' not in goal_data:
        return jsonify({'error': 'Title is required'}), 400
        
    result = mongo.db.goals.update_one(
        {'_id': ObjectId(id)},
        {'$set': goal_data}
    )
    
    if result.matched_count:
        updated_goal = mongo.db.goals.find_one({'_id': ObjectId(id)})
        return jsonify(updated_goal)
    return jsonify({'error': 'Goal not found'}), 404

@app.route('/goals/<id>', methods=['DELETE'])
def delete_goal(id):
    result = mongo.db.goals.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({'message': 'Goal deleted successfully'})
    return jsonify({'error': 'Goal not found'}), 404

# User Routes
@app.route('/users', methods=['GET'])
def get_users():
    users = list(mongo.db.users.find())
    return jsonify(users)

@app.route('/users/<id>', methods=['GET'])
def get_user(id):
    user = mongo.db.users.find_one({'_id': ObjectId(id)})
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/users', methods=['POST'])
def add_user():
    user_data = request.json
    user_data['created_at'] = datetime.utcnow()
    user_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'email' not in user_data or 'name' not in user_data:
        return jsonify({'error': 'Email and name are required'}), 400
        
    # Check if user already exists
    existing_user = mongo.db.users.find_one({'email': user_data['email']})
    if existing_user:
        return jsonify({'error': 'User with this email already exists'}), 400
        
    result = mongo.db.users.insert_one(user_data)
    user_data['_id'] = str(result.inserted_id)
    
    return jsonify(user_data), 201

@app.route('/users/<id>', methods=['PUT'])
def update_user(id):
    user_data = request.json
    user_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'email' not in user_data or 'name' not in user_data:
        return jsonify({'error': 'Email and name are required'}), 400
        
    result = mongo.db.users.update_one(
        {'_id': ObjectId(id)},
        {'$set': user_data}
    )
    
    if result.matched_count:
        updated_user = mongo.db.users.find_one({'_id': ObjectId(id)})
        return jsonify(updated_user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/users/<id>', methods=['DELETE'])
def delete_user(id):
    result = mongo.db.users.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({'message': 'User deleted successfully'})
    return jsonify({'error': 'User not found'}), 404

# Settings Routes
@app.route('/settings/<user_id>', methods=['GET'])
def get_settings(user_id):
    settings = mongo.db.settings.find_one({'user_id': user_id})
    if settings:
        return jsonify(settings)
    return jsonify({'error': 'Settings not found'}), 404

@app.route('/settings/<user_id>', methods=['PUT'])
def update_settings(user_id):
    settings_data = request.json
    settings_data['updated_at'] = datetime.utcnow()
    
    result = mongo.db.settings.update_one(
        {'user_id': user_id},
        {'$set': settings_data},
        upsert=True
    )
    
    updated_settings = mongo.db.settings.find_one({'user_id': user_id})
    return jsonify(updated_settings)

# Statistics Routes
@app.route('/statistics/<user_id>', methods=['GET'])
def get_statistics(user_id):
    # Get task statistics
    total_tasks = mongo.db.tasks.count_documents({'user_id': user_id})
    completed_tasks = mongo.db.tasks.count_documents({'user_id': user_id, 'completed': True})
    pending_tasks = total_tasks - completed_tasks
    
    # Get goal statistics
    total_goals = mongo.db.goals.count_documents({'user_id': user_id})
    completed_goals = mongo.db.goals.count_documents({'user_id': user_id, 'completed': True})
    in_progress_goals = total_goals - completed_goals
    
    # Get tasks by category
    pipeline = [
        {'$match': {'user_id': user_id}},
        {'$group': {'_id': '$category', 'count': {'$sum': 1}}}
    ]
    tasks_by_category = list(mongo.db.tasks.aggregate(pipeline))
    
    # Get tasks by priority
    pipeline = [
        {'$match': {'user_id': user_id}},
        {'$group': {'_id': '$priority', 'count': {'$sum': 1}}}
    ]
    tasks_by_priority = list(mongo.db.tasks.aggregate(pipeline))
    
    statistics = {
        'tasks': {
            'total': total_tasks,
            'completed': completed_tasks,
            'pending': pending_tasks,
            'by_category': tasks_by_category,
            'by_priority': tasks_by_priority
        },
        'goals': {
            'total': total_goals,
            'completed': completed_goals,
            'in_progress': in_progress_goals
        }
    }
    
    return jsonify(statistics)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
