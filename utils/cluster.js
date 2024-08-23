// El script de clustering no se usa en producciín por motivos de que por el momento, no lo veo necesario ya que la carga de la web no es suficiente como para necesitarlo. Pero si se llegara a necesitar, se puede usar el siguiente script:

import cluster from "cluster";
import os from "os";

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one.`);
    cluster.fork();
  });
} else {
  // Importar y ejecutar el servidor en cada worker
  await import("../index.js");
}
