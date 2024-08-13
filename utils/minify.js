import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, "../public/js");
const outputDir = path.resolve(__dirname, "../public/js/minified");

async function minifyFiles() {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(inputDir);

    for (const file of files) {
      if (path.extname(file) === ".js") {
        const filePath = path.join(inputDir, file);
        const outputFilePath = path.join(outputDir, file);

        try {
          const data = await fs.readFile(filePath, "utf8");

          const result = await minify(data);

          if (result.error) {
            console.error(`Error minifying ${file}:`, result.error);
            continue;
          }

          const minifiedCode = result.code || data;

          await fs.writeFile(outputFilePath, minifiedCode);
          console.log(`Minified ${file} -> ${outputFilePath}`);
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
        }
      }
    }
  } catch (err) {
    console.error("Error during minification process:", err);
  }
}

minifyFiles();
