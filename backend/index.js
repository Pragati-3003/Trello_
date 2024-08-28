import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import boardRoutes from './routes/boardRoutes.js'
import listRoutes from './routes/listRoutes.js'
import cardRoutes from './routes/cardRoutes.js'
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

//Routes


app.get('/', (req, res) => {
    res.send("hello from backend home /");
})

app.use('/api',boardRoutes);
app.use('/api',listRoutes);
app.use('/api',cardRoutes);
//mongo connection
mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    console.log("connected to the MongoDb Atlas");

})
    .catch((err) => {
        console.error("Error connecting to the MongoDb Atlas", err);
    })


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})