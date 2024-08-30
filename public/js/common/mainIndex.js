function showMainContent() {
  const mainContent = document.querySelector("main");
  mainContent.classList.remove("hidden");
  mainContent.classList.add("fade-in");
}

window.addEventListener("load", function () {
  setTimeout(function () {
    showMainContent();
  }, 600);
});

function fadeOutMainContent(callback) {
  const mainContent = document.querySelector("main");
  mainContent.classList.remove("fade-in");
  mainContent.classList.add("fade-out");

  setTimeout(function () {
    mainContent.classList.add("hidden");
    mainContent.classList.remove("fade-out");
    callback();
  }, 605);
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const link = event.target.closest('a[href*="?view="]');

    if (link) {
      event.preventDefault();
      const url = link.href;
      fadeOutMainContent(function () {
        window.location.href = url;
      });
    }
  });
});

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    console.log("pageshow event: La página se ha cargado desde la caché.");
    showMainContent();
  } else {
    console.log("pageshow event: La página se ha cargado normalmente.");
  }
});
