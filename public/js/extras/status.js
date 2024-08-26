document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("/json/sites.json");
    const websites = await response.json();
    const statusContainer = document.getElementById("status-container");
    const maxRetries = 3;
    let failedWebsitesCount = 0;
    const statusPromises = websites.map((site) => {
      const card = document.createElement("div");
      card.className = "block rounded-lg bg-gray-800 p-6 hover:bg-blue-700";
      card.innerHTML = `
              <div class="flex items-center">
                <i class="fas fa-globe mr-3 text-gray-300"></i>
                <div>
                  <p class="font-bold text-gray-100">${site.name}</p>
                  <p id="${site.statusElement}" class="text-gray-300 font-agrandir">Verificando estado...</p>
                </div>
              </div>
            `;
      statusContainer.appendChild(card);

      return checkWebsiteStatus(site, maxRetries).catch(() => {
        failedWebsitesCount++;
      });
    });

    await Promise.all(statusPromises);

  } catch (error) {
    console.error("Error loading the sites:", error);
    window.location.href = "/error?code=500";
  }

  async function checkWebsiteStatus(site, retries) {
    while (retries > 0) {
      try {
        const startTime = Date.now();
        const response = await fetch(site.url, {
          mode: "no-cors",
        });

        const endTime = Date.now();
        const ping = endTime - startTime;
        const statusElement = document.getElementById(site.statusElement);
        statusElement.innerHTML = `Estado: Operativo. Ping: ${ping} ms.`;
        statusElement.classList.add("text-green-500");
        return;
      } catch {
        retries--;
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    const statusElement = document.getElementById(site.statusElement);
    statusElement.innerHTML = `Estado: Offline. No se pudo establecer conexión.`;
    statusElement.classList.add("text-red-500");
  }
});
