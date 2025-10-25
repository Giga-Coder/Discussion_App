const express = require("express");
const questions = require("./questions.json");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from "public"

// Serve `index.html` when accessing `/`
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const DATA_FILE = "questions.json";

const writeQuestions = (data) => {
  fs.writeFile(DATA_FILE, JSON.stringify(data), (err) => {
    if (err) {
      console.log(`Error occurred: ${err}`);
    } else {
      console.log("File written successfully");
    }
  });
};

// getting all question stored in json file
app.get("/getQuestions", (req, res) => {
  console.log("Sending questions to client...");
  res.json(questions);
});

app.post("/addQuestion", (req, res) => {
  console.log("Adding question to server...");
  const { subject, question } = req.body;

  if (!subject || !question) {
    return res.json({ error: "Subject and question are required" });
  }

  const newQuestion = {
    id: Date.now(),
    subject,
    question,
    createdDate: Date.now(),
    responses: [],
    favorite: false,
  };

  questions.push(newQuestion);
  writeQuestions(questions);

  res.json({ message: "Question added successfully", question: newQuestion });
});

app.delete("/delThis/:id", (req, res) => {
  console.log(`Deleting question with ID: ${req.params.id}`);
  const updatedQuestions = questions.filter(
    (question) => question.id != parseInt(req.params.id)
  );
  questions.length = 0;
  questions.push(...updatedQuestions);
  writeQuestions(updatedQuestions);
  res.json({ message: "Question deleted successfully" });
});

app.put("/addResponse/:id", (req, res) => {
  console.log("Adding response...");
  const { id } = req.params;
  const { name, comment } = req.body;

  const question = questions.find((q) => q.id === parseInt(id));

  const newResponse = {
    id: Date.now(),
    name,
    comment,
    createdDate: new Date().toLocaleString(),
    upVotes: 0,
    downVotes: 0,
  };

  question.responses.push(newResponse);
  writeQuestions(questions);

  res.json({ message: "Response added successfully", response: newResponse });
});

app.put("/toggleFav/:questionId", (req, res) => {
  const { questionId } = req.params; 
  const { favorite } = req.body; 

  const question = questions.find(q => q.id === parseInt(questionId)); 

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  question.favorite = favorite; 
  writeQuestions(questions); 

  res.json({ message: "Favorite status updated successfully", question });
});


app.put("/updateVote/:questionId/:responseId", (req, res) => {
  const { questionId, responseId } = req.params;
  const { upVotes, downVotes } = req.body;

  console.log(`Updating votes for Response ID: ${responseId} in Question ID: ${questionId}`);

  const question = questions.find(q => q.id === parseInt(questionId));

  const response = question.responses.find(r => r.id === parseInt(responseId));


  response.upVotes = upVotes;
  response.downVotes = downVotes;

  writeQuestions(questions);

  res.json({ message: "Votes updated successfully", response });
});


const PORT = 2800;
app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
