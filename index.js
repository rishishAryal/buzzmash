const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const app = express();
app.use(express.json());
const userRouter = require("./route/user");
const blogRouter = require("./route/blog");
const likeRouter = require("./route/like");
const commentRouter = require("./route/comment");

connectDB();

app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/blog", likeRouter);
app.use("/api/v1/blog", commentRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
