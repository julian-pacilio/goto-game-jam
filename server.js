import express from "express";
import Router from "./routes/router.js"
import cors from 'cors'

const PORT = 8083;
const app = express();

app.use(cors()) //TODO: Limitar a que endpoints acceder
app.use(express.json());

app.use(Router);

app.listen(PORT, () => {
  console.log(`Server Listening on http://localhost:${PORT}`);
});