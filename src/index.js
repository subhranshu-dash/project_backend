import app from "./app.js";
import dotenv from "dotenv";
import connectdb from "./db/db.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
    });
  })
  .catch((err) => {
    console.log("DB error", err);
  });