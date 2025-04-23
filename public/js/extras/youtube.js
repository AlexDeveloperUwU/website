const loadVideo = (liteYT) => {
  const cid = "UCxcD9py3y1df8CWzT5VsZMw";
  const channelURL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`);
  const reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`;

  fetch(reqURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      const videoNumber = parseInt(liteYT.getAttribute("vnum"), 10);
      if (isNaN(videoNumber) || videoNumber < 0 || videoNumber >= result.items.length) {
        throw new Error("Invalid video number or out of range.");
      }

      const link = result.items[videoNumber].link;
      const urlParams = new URLSearchParams(link.split('?')[1]);
      const id = urlParams.get('v');
      liteYT.setAttribute("videoid", id);

      const fallbackLink = liteYT.querySelector(".lite-youtube-fallback");
      if (fallbackLink) {
        fallbackLink.setAttribute("href", `https://www.youtube.com/watch?v=${id}`);
      }
    })
    .catch((error) => console.error("Error loading video:", error));
};

const liteYTs = document.getElementsByTagName("lite-youtube");
for (let i = 0, len = liteYTs.length; i < len; i++) {
  loadVideo(liteYTs[i]);
}
