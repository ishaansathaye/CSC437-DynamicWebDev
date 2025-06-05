import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import cards from "./routes/cards";
import auth, {authenticateUser} from "./routes/auth";
import fs from "node:fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/api/cards", authenticateUser, cards);
app.use("/auth", auth);

app.use(express.static(staticDir));

connect("strength");

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});