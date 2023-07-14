const express = require("express");
const axios = require("axios");
require("dotenv").config();
const Question = require("../models/Question");

const router = express.Router();

// Add a question
router.post("/questions", async (req, res) => {
  const { name, masterjudgeId } = req.body;

  try {
    // Prepare the request payload for Sphere Engine API
    const requestData = {
      name,
      masterjudgeId,
    };
    console.log(requestData);

    const responseData = await fetch(
      "https://0f1b9d22.problems.sphere-engine.com/api/v4/problems?access_token=b7e65d1e26418e6072b81c63a06ef356",
      {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const sphereEngineId = await responseData.json();
    const newQuestion = new Question({
      name,
      masterjudgeId,
      sphereEngineId: sphereEngineId.id,
    });

    newQuestion.save();

    // console.log(await responseData.json());

    res.status(200).json({ message: "Success & Saved" });
  } catch (error) {
    // res.status(500).json({ message: "Internal server error" });
    res.json(error);
  }
});

// Edit a question
router.put("/questions/:id", async (req, res) => {
  const { id } = req.params;
  const { name, masterjudgeId } = req.body;

  try {
    const question = await Question.findOne({ sphereEngineId: id });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const sphereEngineId = id;

    // Prepare the request payload for Sphere Engine API
    const requestData = {
      name,
      masterjudgeId,
      sphereEngineId,
    };

    // Make the request to the Sphere Engine API to edit the question
    const responseData = await fetch(
      `https://0f1b9d22.problems.sphere-engine.com/api/v4/problems/${sphereEngineId}?access_token=b7e65d1e26418e6072b81c63a06ef356`,
      {
        method: "PUT",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    question.name = name;
    question.masterjudgeId = masterjudgeId;
    question.sphereEngineId = sphereEngineId;

    await question.save();

    res.json({ message: "Question updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a question
router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  

  try {
    const question = await Question.findOneAndDelete({ sphereEngineId: id });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Make the request to the Sphere Engine API to delete the question
    const responseData = await fetch(
      `https://0f1b9d22.problems.sphere-engine.com/api/v4/problems/${id}?access_token=b7e65d1e26418e6072b81c63a06ef356`,
      {
        method: "DELETE",
      }
    );

    console.log(await responseData.json());

  

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
