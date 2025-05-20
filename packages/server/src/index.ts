import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Cards from "./services/card-svc";
import cards from "./routes/cards";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/api/cards", cards);

app.use(express.static(staticDir));

connect("strength");

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});