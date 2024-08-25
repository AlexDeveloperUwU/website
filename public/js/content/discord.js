document.addEventListener("DOMContentLoaded", function () {
  function fetchDiscordStatus() {
    return fetch("https://api.lanyard.rest/v1/users/419176939497193472")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          return data.data.discord_status;
        } else {
          throw new Error("Failed to fetch Discord status");
        }
      })
      .catch((error) => {
        console.error("Error fetching Discord status:", error);
        throw error;
      });
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

  function updateProfileBorderColor() {
    fetchDiscordStatus()
      .then((status) => {
        const borderColor = getBorderColor(status);
        document.getElementById("profileImage").style.borderColor = borderColor;
      })
      .catch((error) => console.error("Error updating profile border color:", error));
  }

  function updateDiscordStatusCard() {
    fetchDiscordStatus()
      .then((status) => {
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
      })
      .catch((error) => console.error("Error updating Discord status card:", error));
  }

  updateProfileBorderColor();
  updateDiscordStatusCard();
  setInterval(updateProfileBorderColor, 30000);
  setInterval(updateDiscordStatusCard, 30000);
});
