import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ✅ CORS config
app.use(cors({
  origin: "*",   // production me specific domain use karna
  credentials: true
}));

// ✅ Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ✅ Static folder
app.use(express.static("public"));

// ✅ Cookie parser
app.use(cookieParser());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Routes
import router from "./routes/user.router.js";
app.use("/api/v1/users", router);

// ❌ Route not found handler (optional but best practice)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// 🔥 ✅ GLOBAL ERROR HANDLER (MOST IMPORTANT FIX)
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export default app;