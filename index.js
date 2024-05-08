const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const app = express();
app.use(express.json());
const userRouter = require("./route/user");
const blogRouter = require("./route/blog");
const likeRouter = require("./route/like");
const commentRouter = require("./route/comment");
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

const env = require("dotenv");
env.config();
console.log(process.env.CLOUDINARY_API_KEY);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
connectDB();

app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/blog", likeRouter);
app.use("/api/v1/blog", commentRouter);





// app.post('/profilePicture', upload.single('profilePicture'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded.' });
//     }
    
//     // Create a buffer from the uploaded file
//     const fileBuffer = req.file.buffer;

//     const result = await cloudinary.uploader.upload_stream({
//       resource_type: 'image',
//       folder: 'profilePicture'
//     }, (error, result) => {
//       if (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal Server Error", error: error });
//       } else {
//         res.json(result);
//       }
//     });

//     // Converting buffer to stream
//     const stream = require('stream');
//     const readableInstanceStream = new stream.Readable({
//       read() {
//         this.push(fileBuffer);
//         this.push(null);
//       }
//     });

//     readableInstanceStream.pipe(result);

//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ message: "Internal Server Error", error: err });
//   }
// });


app.use("*", (req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
