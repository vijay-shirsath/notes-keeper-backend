import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from "./routes/users.js"
import notesRoute from "./routes/notes.js";

const app = express();

app.use(cors())
app.use(express.json());
app.use('/user',userRoutes);
app.use("/notes",notesRoute);

dotenv.config();

const connectionString = process.env.DB_URI;
mongoose.connect(connectionString,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("database connected Successfully"))
.catch((err) => console.log(err));

app.get("/",(req,res) => {
    res.send("Welcome to notes keeper application");
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`the server is running on port ${port}`))

