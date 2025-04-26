from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# File paths for our JSON data storage
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
TASKS_FILE = os.path.join(DATA_DIR, 'tasks.json')
GOALS_FILE = os.path.join(DATA_DIR, 'goals.json')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
SETTINGS_FILE = os.path.join(DATA_DIR, 'settings.json')

# Create data directory if it doesn't exist
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Helper function to convert datetime to string for JSON serialization
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

app.json_encoder = JSONEncoder

# Helper functions for file operations
def read_json_file(file_path):
    if not os.path.exists(file_path):
        return []
    with open(file_path, 'r') as f:
        return json.load(f)

def write_json_file(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, cls=JSONEncoder, indent=2)

# Initialize database with sample data if empty
def init_db():
    # Check if tasks file is empty
    if not os.path.exists(TASKS_FILE) or os.path.getsize(TASKS_FILE) == 0:
        sample_tasks = [
            {
                '_id': str(uuid.uuid4()),
                'title': 'Complete project proposal',
                'completed': False,
                'category': 'Work',
                'priority': 'high',
                'dueDate': '2025-04-20',
                'user_id': 'default_user',
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            },
            {
                '_id': str(uuid.uuid4()),
                'title': 'Buy groceries',
                'completed': True,
                'category': 'Personal',
                'priority': 'medium',
                'dueDate': '2025-04-15',
                'user_id': 'default_user',
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            },
            {
                '_id': str(uuid.uuid4()),
                'title': 'Gym workout',
                'completed': False,
                'category': 'Health',
                'priority': 'low',
                'dueDate': '2025-04-16',
                'user_id': 'default_user',
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
        ]
        write_json_file(TASKS_FILE, sample_tasks)
        print("Initialized database with sample tasks")
    
    # Check if users file is empty
    if not os.path.exists(USERS_FILE) or os.path.getsize(USERS_FILE) == 0:
        default_user = {
            '_id': 'default_user',
            'name': 'Swaraj Patil',
            'email': 'swarajpatil1@gmail.com',
            'phone': '+919226589060',
            'location': 'Mumbai, India',
            'occupation': 'Software Developer',
            'bio': 'Task management enthusiast and productivity expert.',
            'skills': ['Task Management', 'Project Planning', 'Team Coordination'],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        write_json_file(USERS_FILE, [default_user])
        print("Initialized database with default user")
    
    # Check if goals file is empty
    if not os.path.exists(GOALS_FILE) or os.path.getsize(GOALS_FILE) == 0:
        sample_goals = [
            {
                '_id': str(uuid.uuid4()),
                'title': 'Complete Project Milestone',
                'description': 'Finish the first phase of the project including all core features',
                'dueDate': '2025-04-30',
                'color': '#1976d2',
                'category': 'Career',
                'completed': False,
                'user_id': 'default_user',
                'milestones': [
                    {
                        'id': 101,
                        'title': 'Finish requirements gathering',
                        'completed': True,
                        'dueDate': '2025-04-18'
                    },
                    {
                        'id': 102,
                        'title': 'Complete UI design',
                        'completed': False,
                        'dueDate': '2025-04-23'
                    }
                ],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            },
            {
                '_id': str(uuid.uuid4()),
                'title': 'Improve Fitness',
                'description': 'Work on improving overall fitness and health',
                'dueDate': '2025-07-15',
                'color': '#4caf50',
                'category': 'Health',
                'completed': False,
                'user_id': 'default_user',
                'milestones': [
                    {
                        'id': 201,
                        'title': 'Start regular workout routine',
                        'completed': True,
                        'dueDate': '2025-04-23'
                    },
                    {
                        'id': 202,
                        'title': 'Run 5km without stopping',
                        'completed': False,
                        'dueDate': '2025-05-15'
                    }
                ],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
        ]
        write_json_file(GOALS_FILE, sample_goals)
        print("Initialized database with sample goals")
        
    # Check if settings file is empty
    if not os.path.exists(SETTINGS_FILE) or os.path.getsize(SETTINGS_FILE) == 0:
        default_settings = {
            '_id': str(uuid.uuid4()),
            'user_id': 'default_user',
            'theme': 'light',
            'notifications': True,
            'autoSave': True,
            'dataSync': False,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        write_json_file(SETTINGS_FILE, [default_settings])
        print("Initialized database with default settings")

# Task Routes
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = read_json_file(TASKS_FILE)
    return jsonify(tasks)

@app.route('/tasks/<id>', methods=['GET'])
def get_task(id):
    tasks = read_json_file(TASKS_FILE)
    task = next((t for t in tasks if t['_id'] == id), None)
    if task:
        return jsonify(task)
    return jsonify({'error': 'Task not found'}), 404

@app.route('/tasks', methods=['POST'])
def add_task():
    task_data = request.json
    task_data['_id'] = str(uuid.uuid4())  # Generate a unique ID
    task_data['created_at'] = datetime.utcnow()
    task_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'title' not in task_data:
        return jsonify({'error': 'Title is required'}), 400
    
    # Add to tasks list
    tasks = read_json_file(TASKS_FILE)
    tasks.append(task_data)
    write_json_file(TASKS_FILE, tasks)
    
    return jsonify(task_data), 201

@app.route('/tasks/<id>', methods=['PUT'])
def update_task(id):
    tasks = read_json_file(TASKS_FILE)
    task_index = next((i for i, t in enumerate(tasks) if t['_id'] == id), None)
    
    if task_index is None:
        return jsonify({'error': 'Task not found'}), 404
    
    task_data = request.json
    task_data['_id'] = id  # Ensure ID remains the same
    task_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'title' not in task_data:
        return jsonify({'error': 'Title is required'}), 400
    
    # Update task
    tasks[task_index] = task_data
    write_json_file(TASKS_FILE, tasks)
    
    return jsonify(task_data)

@app.route('/tasks/<id>', methods=['DELETE'])
def delete_task(id):
    tasks = read_json_file(TASKS_FILE)
    initial_count = len(tasks)
    tasks = [t for t in tasks if t['_id'] != id]
    
    if len(tasks) < initial_count:
        write_json_file(TASKS_FILE, tasks)
        return jsonify({'message': 'Task deleted successfully'})
    
    return jsonify({'error': 'Task not found'}), 404

# Goal Routes
@app.route('/goals', methods=['GET'])
def get_goals():
    goals = read_json_file(GOALS_FILE)
    return jsonify(goals)

@app.route('/goals/<id>', methods=['GET'])
def get_goal(id):
    goals = read_json_file(GOALS_FILE)
    goal = next((g for g in goals if g['_id'] == id), None)
    if goal:
        return jsonify(goal)
    return jsonify({'error': 'Goal not found'}), 404

@app.route('/goals', methods=['POST'])
def add_goal():
    goal_data = request.json
    goal_data['_id'] = str(uuid.uuid4())  # Generate a unique ID
    goal_data['created_at'] = datetime.utcnow()
    goal_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'title' not in goal_data:
        return jsonify({'error': 'Title is required'}), 400
    
    # Add to goals list
    goals = read_json_file(GOALS_FILE)
    goals.append(goal_data)
    write_json_file(GOALS_FILE, goals)
    
    return jsonify(goal_data), 201

@app.route('/goals/<id>', methods=['PUT'])
def update_goal(id):
    goals = read_json_file(GOALS_FILE)
    goal_index = next((i for i, g in enumerate(goals) if g['_id'] == id), None)
    
    if goal_index is None:
        return jsonify({'error': 'Goal not found'}), 404
    
    goal_data = request.json
    goal_data['_id'] = id  # Ensure ID remains the same
    goal_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'title' not in goal_data:
        return jsonify({'error': 'Title is required'}), 400
    
    # Update goal
    goals[goal_index] = goal_data
    write_json_file(GOALS_FILE, goals)
    
    return jsonify(goal_data)

@app.route('/goals/<id>', methods=['DELETE'])
def delete_goal(id):
    goals = read_json_file(GOALS_FILE)
    initial_count = len(goals)
    goals = [g for g in goals if g['_id'] != id]
    
    if len(goals) < initial_count:
        write_json_file(GOALS_FILE, goals)
        return jsonify({'message': 'Goal deleted successfully'})
    
    return jsonify({'error': 'Goal not found'}), 404

# User Routes
@app.route('/users', methods=['GET'])
def get_users():
    users = read_json_file(USERS_FILE)
    return jsonify(users)

@app.route('/users/<id>', methods=['GET'])
def get_user(id):
    users = read_json_file(USERS_FILE)
    user = next((u for u in users if u['_id'] == id), None)
    
    if not user:
        # Try finding by email
        user = next((u for u in users if u.get('email') == id), None)
        
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/users', methods=['POST'])
def add_user():
    user_data = request.json
    user_data['_id'] = str(uuid.uuid4())  # Generate a unique ID
    user_data['created_at'] = datetime.utcnow()
    user_data['updated_at'] = datetime.utcnow()
    
    # Validate required fields
    if 'email' not in user_data or 'name' not in user_data:
        return jsonify({'error': 'Email and name are required'}), 400
        
    # Check if user already exists
    users = read_json_file(USERS_FILE)
    existing_user = next((u for u in users if u.get('email') == user_data['email']), None)
    
    if existing_user:
        return jsonify({'error': 'User with this email already exists'}), 400
        
    users.append(user_data)
    write_json_file(USERS_FILE, users)
    
    return jsonify(user_data), 201

@app.route('/users/<id>', methods=['PUT'])
def update_user(id):
    users = read_json_file(USERS_FILE)
    user_index = next((i for i, u in enumerate(users) if u['_id'] == id), None)
    
    if user_index is None:
        return jsonify({'error': 'User not found'}), 404
    
    user_data = request.json
    user_data['_id'] = id  # Ensure ID remains the same
    user_data['updated_at'] = datetime.utcnow()
    
    # Update user
    users[user_index] = user_data
    write_json_file(USERS_FILE, users)
    
    return jsonify(user_data)

# Settings Routes
@app.route('/settings/<user_id>', methods=['GET'])
def get_settings(user_id):
    settings = read_json_file(SETTINGS_FILE)
    user_settings = next((s for s in settings if s.get('user_id') == user_id), None)
    
    if user_settings:
        return jsonify(user_settings)
    
    # If settings don't exist, create default settings
    default_settings = {
        '_id': str(uuid.uuid4()),
        'user_id': user_id,
        'theme': 'light',
        'notifications': True,
        'autoSave': True,
        'dataSync': False,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    
    settings.append(default_settings)
    write_json_file(SETTINGS_FILE, settings)
    
    return jsonify(default_settings)

@app.route('/settings/<user_id>', methods=['PUT'])
def update_settings(user_id):
    settings = read_json_file(SETTINGS_FILE)
    settings_index = next((i for i, s in enumerate(settings) if s.get('user_id') == user_id), None)
    
    settings_data = request.json
    settings_data['updated_at'] = datetime.utcnow()
    
    if settings_index is not None:
        # Update existing settings
        settings_data['_id'] = settings[settings_index]['_id']  # Keep the same ID
        settings[settings_index] = settings_data
    else:
        # Create new settings
        settings_data['_id'] = str(uuid.uuid4())
        settings_data['user_id'] = user_id
        settings_data['created_at'] = datetime.utcnow()
        settings.append(settings_data)
    
    write_json_file(SETTINGS_FILE, settings)
    return jsonify(settings_data)

# Statistics Routes
@app.route('/statistics/<user_id>', methods=['GET'])
def get_statistics(user_id):
    # Get tasks
    tasks = read_json_file(TASKS_FILE)
    user_tasks = [t for t in tasks if t.get('user_id') == user_id]
    
    # Get task statistics
    total_tasks = len(user_tasks)
    completed_tasks = len([t for t in user_tasks if t.get('completed')])
    pending_tasks = total_tasks - completed_tasks
    
    # Get goals
    goals = read_json_file(GOALS_FILE)
    user_goals = [g for g in goals if g.get('user_id') == user_id]
    
    # Get goal statistics
    total_goals = len(user_goals)
    completed_goals = len([g for g in user_goals if g.get('completed')])
    in_progress_goals = total_goals - completed_goals
    
    # Get tasks by category
    category_counts = {}
    for task in user_tasks:
        category = task.get('category', 'Uncategorized')
        category_counts[category] = category_counts.get(category, 0) + 1
    
    tasks_by_category = [{'_id': category, 'count': count} for category, count in category_counts.items()]
    
    # Get tasks by priority
    priority_counts = {}
    for task in user_tasks:
        priority = task.get('priority', 'medium')
        priority_counts[priority] = priority_counts.get(priority, 0) + 1
    
    tasks_by_priority = [{'_id': priority, 'count': count} for priority, count in priority_counts.items()]
    
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

# Initialize database before starting the app
if __name__ == '__main__':
    # Initialize the database
    init_db()
    
    # Run the Flask app
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000)
