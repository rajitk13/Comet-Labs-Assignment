const express = require("express");
const axios = require("axios");
const Question = require("../models/Question");

const router = express.Router();

// Submit a solution for a question
router.post("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { solution } = req.body;

  try {
    // Fetch the question from the database
    // const question = await Question.findOne({sphereEngineId:questionId});

    // if (!question) {
    //   return res.status(404).json({ message: "Question not found" });
    // }

    // Prepare the request payload for Sphere Engine API
    const requestData = {
      source: solution,
      compilerId: 1,
      problemId: questionId,
    };

    // Make the request to Sphere Engine API
    const response = await fetch(
      "https://0f1b9d22.problems.sphere-engine.com/api/v4/submissions?access_token=b7e65d1e26418e6072b81c63a06ef356",
      {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    const result = await fetch(
      `https://0f1b9d22.problems.sphere-engine.com/api/v4/submissions/${data.id}?access_token=b7e65d1e26418e6072b81c63a06ef356`,
      {
        method: "GET",
      }
    );
    const resdata = await result.json();
    // const { status, result } = response.data;

    // // Check the result status
    // if (status.name === 'accepted') {
    //   // Solution is correct
    //   res.json({ message: 'Success', result });
    // } else {
    //   // Solution is incorrect or has errors
    //   res.json({ message: 'Error', result });
    // }

    res.status(200).json(resdata);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
