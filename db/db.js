const mongoose = require("mongoose");
const uri = "mongodb+srv://risharyal5:7B5cRvUPp7L69tUj@cluster0.hmcdqci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
    }

module.exports = connectDB; 
