from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configures the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Concept: database model
# Creates the Todo model
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    completed = db.Column(db.Boolean)

# Concept: routing
# Sets the root route to the todo app page
@app.route('/')
def todo_page():
    # Gets all the todos from the database
    todo_list = Todo.query.all()
    # Renders the todo app page
    # Concept: template
    return render_template("todo.html", todo_list=todo_list)

# Concept: routing
# Takes in a post request with the title to add a todo
@app.route("/add", methods=["POST"])
def add():
    # Concept: request
    title = request.form.get("title")
    new_todo = Todo(title=title, completed=False)
    # Add to database
    db.session.add(new_todo)
    db.session.commit()
    # Redirect to the todo app page
    return redirect(url_for("todo_page"))

# Concept: routing
# Takes in a post request and flips the completed flag of a todo task
@app.route("/update/<int:todo_id>")
def update(todo_id):
    # Find the specific todo
    todo = Todo.query.filter_by(id=todo_id).first()
    # Update todo
    todo.completed = not todo.completed
    # Add to database
    db.session.commit()
    # Redirect to the todo app page
    return redirect(url_for("todo_page"))

# Concept: routing
# Takes in a post request and deletes a todo task
@app.route("/delete/<int:todo_id>")
def delete(todo_id):
    # Find the specific todo
    todo = Todo.query.filter_by(id=todo_id).first()
    # Delete from database
    db.session.delete(todo)
    db.session.commit()
    # Redirect to the todo app page
    # Concept: routing
    return redirect(url_for("todo_page"))

# Concept: error handler
# Sets the 404 error page
@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)