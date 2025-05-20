import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import cards from "./routes/cards";
import auth, {authenticateUser} from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/api/cards", authenticateUser, cards);
app.use("/auth", auth);

app.use(express.static(staticDir));

connect("strength");

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});