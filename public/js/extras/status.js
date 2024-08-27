document.addEventListener("DOMContentLoaded", function () {
  const maxRetries = 3;
  const refreshInterval = 60000;

  let websiteStatusInterval;
  let serverStatusInterval;

  async function loadWebsiteStatuses() {
    try {
      const response = await fetch("/json/sites.json");
      const websites = await response.json();
      const statusContainer = document.getElementById("status-container");

      websites.forEach((site) => {
        let statusElement = document.getElementById(site.statusElement);

        if (!statusElement) {
          const card = document.createElement("div");
          card.className = "block rounded-lg bg-gray-800 p-6";
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
          statusElement = document.getElementById(site.statusElement);
        }

        checkWebsiteStatus(site, maxRetries);
      });
    } catch (error) {
      console.error("Error loading the sites:", error);
      window.location.href = "/error?code=500";
    }
  }

  async function checkWebsiteStatus(site, retries) {
    while (retries > 0) {
      try {
        const startTime = Date.now();
        await fetch(site.url, {
          mode: "no-cors",
        });

        const endTime = Date.now();
        const ping = endTime - startTime;
        const statusElement = document.getElementById(site.statusElement);
        statusElement.innerHTML = `Estado: Operativo. Ping: ${ping} ms.`;
        statusElement.classList.add("text-green-500");
        statusElement.classList.remove("text-red-500");
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
    statusElement.classList.remove("text-green-500");
  }

  async function loadServerStatuses() {
    try {
      const response = await fetch("/serverStats");
      const servers = await response.json();
      const serverContainer = document.getElementById("server-status-container");

      for (const [serverName, stats] of Object.entries(servers)) {
        let serverElement = document.getElementById(serverName);

        const serverInfo = `
            <span class="text-green-500">CPU: ${stats.CPU}%</span> |
            <span class="text-green-500">RAM: ${stats.RAM}%</span> |
            <span class="text-green-500">Disco: ${stats.Disk}%</span>
          `;

        if (!serverElement) {
          const card = document.createElement("div");
          card.className = "block rounded-lg bg-gray-800 p-6";
          card.innerHTML = `
              <div class="flex items-center">
                <i class="fas fa-server mr-3 text-gray-300"></i>
                <div>
                  <p class="font-bold text-gray-100">${serverName}</p>
                  <p id="${serverName}" class="font-agrandir">
                    ${serverInfo}
                  </p>
                </div>
              </div>
            `;
          serverContainer.appendChild(card);
        } else {
          serverElement.innerHTML = serverInfo;
        }
      }
    } catch (error) {
      console.error("Error loading server stats:", error);
    }
  }

  function startIntervals() {
    websiteStatusInterval = setInterval(loadWebsiteStatuses, refreshInterval);
    serverStatusInterval = setInterval(loadServerStatuses, refreshInterval);
  }

  function stopIntervals() {
    clearInterval(websiteStatusInterval);
    clearInterval(serverStatusInterval);
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      stopIntervals();
    } else {
      startIntervals();
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", stopIntervals);
  window.addEventListener("pageshow", startIntervals);

  loadServerStatuses();
  loadWebsiteStatuses();

  startIntervals();
});
