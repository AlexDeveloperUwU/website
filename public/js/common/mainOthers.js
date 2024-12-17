function showMainContent() {
  const mainContent = document.querySelector("main");
  const backButton = document.getElementById("back-button");

  if (mainContent) {
    mainContent.classList.remove("hidden");
    mainContent.classList.add("fade-in");
  }

  if (backButton) {
    backButton.classList.remove("hidden");
    backButton.classList.add("fade-in");
  }
}

window.addEventListener("load", function () {
  setTimeout(function () {
    showMainContent();
  }, 500);
});

function fadeOutMainContent(callback) {
  const mainContent = document.querySelector("main");
  const backButton = document.getElementById("back-button");

  if (mainContent) {
    mainContent.classList.remove("fade-in");
    mainContent.classList.add("fade-out");
  }

  if (backButton) {
    backButton.classList.remove("fade-in");
    backButton.classList.add("fade-out");
  }

  setTimeout(function () {
    if (mainContent) {
      mainContent.classList.add("hidden");
      mainContent.classList.remove("fade-out");
    }
    if (backButton) {
      backButton.classList.add("hidden");
      backButton.classList.remove("fade-out");
    }

    callback();
  }, 400);
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const link = event.target.closest('a[href*="?view="], a[href^="/"]');

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
