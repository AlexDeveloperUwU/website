function showMainContent() {
  const mainContent = document.querySelector("main");
  console.log("showMainContent: Mostrando el contenido principal.");
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
  console.log("fadeOutMainContent: Iniciando desvanecimiento del contenido principal.");
  mainContent.classList.remove("fade-in");
  mainContent.classList.add("fade-out");

  setTimeout(function () {
    console.log("setTimeout: El contenido principal se ocultará después de 605 ms.");
    mainContent.classList.add("hidden");
    mainContent.classList.remove("fade-out");
    callback();
  }, 605);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded: El contenido del documento está completamente cargado.");
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
  } else {
    console.log("pageshow event: La página se ha cargado normalmente.");
  }
  showMainContent();
});
