window.addEventListener("load", function () {
  const twitchContainer = document.querySelector(".twitch");
  const twitchVideo = twitchContainer.querySelector(".twitch-video iframe");
  const twitchChat = twitchContainer.querySelector(".twitch-chat iframe");
  const parentUrl = window.location.hostname;

  twitchVideo.src = `https://player.twitch.tv/?channel=alexdevuwu&parent=${parentUrl}&autoplay=true`;
  twitchChat.src = `https://www.twitch.tv/embed/alexdevuwu/chat?parent=${parentUrl}`;
  twitchContainer.style.display = "block";
});
