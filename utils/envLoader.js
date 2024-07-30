import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "env", ".env");
dotenv.config({ path: envPath });

export function getVariable(key) {
  const envFileContent = readFileSync(".env", "utf8");
  const envConfig = parse(envFileContent);
  return envConfig[key];
}
