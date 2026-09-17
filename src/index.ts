import express, { type Request, type Response } from "express";


//import router
import usersRoutes from "./routes/usersRoutes.js";
import itemsRoutes from "./routes/itemsRoutes.js";


// import middlewares
import morgan from "morgan";

const app = express();
const port = 3000;

// body parser middleware
app.use(express.json());

// logger middleware
app.use(morgan("dev"));
// app.use(morgan("combined"));

//use 
app.use("/api/v708/auth/", usersRoutes); // login)
///api/vXXX/items/:userId
app.use("/api/v708/basket/", itemsRoutes); // buy items



// Endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Quiz #2 - API service");
});

app.get("/me", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Quiz #2 - API service",
  });
});


// #1
// GET /student
app.get("/student", (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      message: "Student Information",
      data: {
        studentId: "680610708",
        firstName: "Methas",
        lastName: "Naisoo",
        section: "001",
      },
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "Not found data",
      error: err,
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// Export app for vercel deployment
export default app;
