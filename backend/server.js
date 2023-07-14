const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const questionRoutes = require("./routes/question");
const solutionRoutes = require("./routes/solution");
const authenticateUser = require("./authentication/authentication");
const authenticateAdmin = require("./authentication/authenticateAdmin");



// Create Express app
const app = express();

// Body parser middleware
app.use(bodyParser.json());

// MongoDB configuration
const mongoURI = process.env.MONGO_URI; // Replace with your MongoDB URI
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", authenticateAdmin, adminRoutes);
app.use("/api/question", authenticateUser, questionRoutes);
app.use("/api/solution", authenticateUser, solutionRoutes);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
