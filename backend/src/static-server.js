import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5174;

// Serve static files from frontend-static at project root
const staticDir = join(__dirname, "../../frontend-static");
app.use(express.static(staticDir));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(join(staticDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Frontend running on port " + PORT);
});
