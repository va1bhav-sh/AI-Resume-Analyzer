const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const cohereRoutes = require("./routes/cohereRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();

connectDB();

const app = express();
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/cohere", cohereRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer Backend is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});