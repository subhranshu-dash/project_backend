import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS fix
app.use(cors({
    origin: "*",   // temporary (later restrict karna)
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ correct route
//import router from "./routes/user.routes.js";
import router from "./routes/user.router.js";
app.use("/api/v1/users", router);

export default app;