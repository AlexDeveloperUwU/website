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
    // Asegurarse de que el directorio de salida exista
    await fs.mkdir(outputDir, { recursive: true });

    // Leer los archivos del directorio de entrada
    const files = await fs.readdir(inputDir);

    // Procesar cada archivo JavaScript
    for (const file of files) {
      if (path.extname(file) === ".js") {
        const filePath = path.join(inputDir, file);
        const outputFilePath = path.join(outputDir, file);

        try {
          // Leer el contenido del archivo
          const data = await fs.readFile(filePath, "utf8");

          // Minificar el contenido
          const result = await minify(data);

          if (result.error) {
            console.error(`Error minifying ${file}:`, result.error);
            continue;
          }

          // Verificar si result.code es undefined y usar el contenido original si es necesario
          const minifiedCode = result.code || data;

          // Escribir el archivo minificado
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
