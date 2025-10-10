import {app} from "./app";
import dotenv from "dotenv";
import {db} from "./utils/drizzle";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
