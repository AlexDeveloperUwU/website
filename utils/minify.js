import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";
import chokidar from "chokidar";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, "../public/js");
const outputDir = path.resolve(__dirname, "../public/js/minified");

async function minifyFiles(filePath) {
  try {
    const relativePath = path.relative(inputDir, filePath);
    const outputFilePath = path.join(outputDir, relativePath);

    if (relativePath.startsWith("minified")) {
      return;
    }

    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });

    const data = await fs.readFile(filePath, "utf8");
    const result = await minify(data);

    if (result.error) {
      console.error(`Error minifying ${filePath}:`, result.error);
      return;
    }

    const minifiedCode = result.code || data;
    await fs.writeFile(outputFilePath, minifiedCode);
    console.log(`Minified ${filePath} -> ${outputFilePath}`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

async function minifyAllFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "minified") {
      await minifyAllFiles(fullPath);
    } else if (entry.isFile()) {
      await minifyFiles(fullPath);
    }
  }
}

(async () => {
  await minifyAllFiles(inputDir);

  const watcher = chokidar.watch(inputDir, {
    persistent: true,
    ignoreInitial: true,
    ignored: /minified/,
    depth: 99,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
  });

  watcher.on("add", minifyFiles);
  watcher.on("change", minifyFiles);

  console.log(`All files minified. Now watching for changes in ${inputDir}...`);
  console.log(`Watching for changes in ${inputDir}...`);
})();
