import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix for ES Module issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../database.env") });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

export default sequelize;
