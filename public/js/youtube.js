const loadVideo = (liteYT) => {
  const cid = "UCxcD9py3y1df8CWzT5VsZMw";
  const channelURL = encodeURIComponent(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`
  );
  const reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`;

  fetch(reqURL)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      const videoNumber = liteYT.getAttribute("vnum");
      const link = result.items[videoNumber].link;
      const id = link.substr(link.indexOf("=") + 1);
      liteYT.setAttribute("videoid", id);

      const fallbackLink = liteYT.querySelector(".lite-youtube-fallback");
      if (fallbackLink) {
        fallbackLink.setAttribute("href", `https://www.youtube.com/watch?v=${id}`);
      }
    })
    .catch((error) => console.log("error", error));
};

const liteYTs = document.getElementsByTagName("lite-youtube");
for (let i = 0, len = liteYTs.length; i < len; i++) {
  loadVideo(liteYTs[i]);
}
