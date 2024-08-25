document.addEventListener("DOMContentLoaded", function () {
  function fetchDiscordStatus() {
    fetch("https://api.lanyard.rest/v1/users/419176939497193472")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const status = data.data.discord_status;
          const borderColor = getBorderColor(status);

          document.getElementById("profileImage").style.borderColor = borderColor;
        }
      })
      .catch((error) => console.error("Error fetching Discord status:", error));
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

  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 60000);
});
