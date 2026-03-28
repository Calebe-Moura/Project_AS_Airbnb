// server.js
import express from "express";
import router from "./router.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});