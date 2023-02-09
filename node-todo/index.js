const express = require("express");
var bodyParser = require("body-parser");
const TodoTask = require("./models/TodoTask");

const app = express();
// Concept: middleware
// Middleware is an in-between function that has access to the request and response objects.
app.use(bodyParser.urlencoded({ extended: false }));

const mongoose = require("mongoose");
// Concept: database
// Connect to local mongoDB database
mongoose.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
});

// Concept: config
// Set the view engine to ejs
app.set("view engine", "ejs");

// Reads and returns all the current todos in the database
app.get("/", async (req, res) => {
  // Concept: query
  // Find all todos in the TodoTask collection
  const todoTasks = await TodoTask.find({});
  // Concept: template
  // Render the template and send to the user
  res.render("todo.ejs", { todoTasks });
});

// Create a new todo in the database
app.post("/", async (req, res) => {
  // Concept: database model
  // Create a new TodoTask object
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    // Concept: asynchronous calls
    // save the new todo to the database
    await todoTask.save();
    // Concept: redirect
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

// Updates a specific todo in the database
app
  .route("/edit/:id")
  .get(async (req, res) => {
    // Concept: request
    // Get the id from the request
    const id = req.params.id;
    // Concept: query
    // Find the todo with the id to be editted
    const tasks = await TodoTask.find({});
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
  })
  .post(async (req, res) => {
    const id = req.params.id;
    // Concept: query
    // Find the todo with the id to be editted and update the content
    await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
    // Concept: redirect
    // Redirect to the home page
    res.redirect("/");
  });

// Deletes a specific todo in the database
app.route("/remove/:id").get(async (req, res) => {
  const id = req.params.id;
  // Concept: query
  // Find the todo with the id to be deleted and delete it
  await TodoTask.findByIdAndRemove(id);
  res.redirect("/");
});

// Concept: Port forwarding
// Start a server and listen on port 3000 for connections.
app.listen(3000, () => console.log("Server up and running"));
