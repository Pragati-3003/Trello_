import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
import boardRoutes from './routes/boardRoutes.js'
import listRoutes from './routes/listRoutes.js'
import cardRoutes from './routes/cardRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { protect } from './middleware/authMiddleware.js'

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

//Routes


app.get('/', (req, res) => {
    res.send("hello from backend home /");
})
app.use('/api', userRoutes)
app.use('/api',protect,  boardRoutes);
app.use('/api',  protect,listRoutes);
app.use('/api', protect, cardRoutes);

//mongo connection
mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
    console.log("connected to the MongoDb Atlas");

})
    .catch((err) => {
        console.error("Error connecting to the MongoDb Atlas", err);
    })

    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            console.error('Bad JSON');
            return res.status(400).json({ message: 'Bad JSON format' });
        }
        next(err);
    });
    
    // Global error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: "Internal Server Error" });
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})