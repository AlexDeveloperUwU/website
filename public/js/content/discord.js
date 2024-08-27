document.addEventListener("DOMContentLoaded", function () {
  async function fetchDiscordStatus() {
    try {
      const response = await fetch("https://api.lanyard.rest/v1/users/419176939497193472");
      const data = await response.json();
      if (data.success) {
        return data.data.discord_status;
      } else {
        throw new Error("Failed to fetch Discord status");
      }
    } catch (error) {
      console.error("Error fetching Discord status:", error);
      throw error;
    }
  }

  function getBorderColor(status) {
    switch (status) {
      case "online":
        return "green";
      case "idle":
        return "yellow";
      case "dnd":
        return "red";
      case "offline":
        return "gray";
      default:
        return "blue";
    }
  }

  function updateUI(status) {
    const borderColor = getBorderColor(status);
    document.getElementById("profileImage").style.borderColor = borderColor;

    let statusSpanish = "";
    switch (status) {
      case "online":
        statusSpanish = "conectado";
        break;
      case "idle":
        statusSpanish = "ausente";
        break;
      case "dnd":
        statusSpanish = "ocupado";
        break;
      case "offline":
        statusSpanish = "desconectado";
        break;
      default:
        statusSpanish = "Desconocido";
    }

    const statusElement = document.getElementById("myDiscordStatus");
    statusElement.textContent = statusSpanish;
  }

  function updateDiscordStatus() {
    fetchDiscordStatus()
      .then((status) => updateUI(status))
      .catch((error) => console.error("Error updating Discord status:", error));
  }

  updateDiscordStatus();
  setInterval(updateDiscordStatus, 30000);
});
