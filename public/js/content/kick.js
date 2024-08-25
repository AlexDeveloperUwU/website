window.addEventListener("load", function () {
  const kickContainer = document.querySelector(".kick");
  const kickVideo = kickContainer.querySelector(".kick-video iframe");
  const kickChat = kickContainer.querySelector(".kick-chat iframe");

  kickVideo.src = `https://player.kick.com/alexdevuwu`;
  kickChat.src = `https://kick.com/alexdevuwu/chatroom`;
  kickContainer.style.display = "block";
});
