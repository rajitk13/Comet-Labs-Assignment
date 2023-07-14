const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  masterjudgeId: {
    type: Number,
    required: true,
  },
  sphereEngineId: {
    type: Number,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
