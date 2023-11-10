import express from "express";
import Router from "./routes/router.js"

const PORT = 8083;
const app = express();

app.use(express.json());

app.use(Router);

app.listen(PORT, () => {
  console.log(`Server Listening on http://localhost:${PORT}`);
});