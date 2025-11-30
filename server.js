import fs from "fs";

let clicks = 0;

// Load existing JSON
if (fs.existsSync("data.json")) {
  clicks = JSON.parse(fs.readFileSync("data.json")).clicks || 0;
}

import express from "express";
const app = express();

app.post("/count", (req, res) => {
  clicks++;

  fs.writeFileSync("data.json", JSON.stringify({ clicks }, null, 2));

  res.json({ message: "saved", clicks });
});

app.listen(3000, () => console.log("Server running on port 3000"));
