document.addEventListener("DOMContentLoaded", function () {
  // Mostrar el formulario de crear enlace
  document.getElementById("showCreateLinkForm").addEventListener("click", function () {
    document.getElementById("createLinkFormContainer").classList.remove("hidden");
    document.getElementById("editLinkFormContainer").classList.add("hidden");
    document.getElementById("deleteLinkFormContainer").classList.add("hidden");
    document.getElementById("allLinksContainer").classList.add("hidden");
  });

  // Mostrar el formulario de editar enlace
  document.getElementById("showEditLinkForm").addEventListener("click", function () {
    document.getElementById("createLinkFormContainer").classList.add("hidden");
    document.getElementById("editLinkFormContainer").classList.remove("hidden");
    document.getElementById("deleteLinkFormContainer").classList.add("hidden");
    document.getElementById("allLinksContainer").classList.add("hidden");
  });

  // Mostrar el formulario de eliminar enlace
  document.getElementById("showDeleteLinkForm").addEventListener("click", function () {
    document.getElementById("createLinkFormContainer").classList.add("hidden");
    document.getElementById("editLinkFormContainer").classList.add("hidden");
    document.getElementById("deleteLinkFormContainer").classList.remove("hidden");
    document.getElementById("allLinksContainer").classList.add("hidden");
  });

  // Mostrar todos los enlaces
  document.getElementById("showAllLinks").addEventListener("click", function () {
    document.getElementById("createLinkFormContainer").classList.add("hidden");
    document.getElementById("editLinkFormContainer").classList.add("hidden");
    document.getElementById("deleteLinkFormContainer").classList.add("hidden");
    document.getElementById("allLinksContainer").classList.remove("hidden");
    fetchAllLinks();
  });

  // Enviar el formulario de crear enlace
  document.getElementById("submitCreateLinkForm").addEventListener("click", function () {
    var formData = new URLSearchParams(
      new FormData(document.getElementById("createLinkForm"))
    ).toString();

    fetch("/addLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Enlace creado exitosamente:", data.message);
        alert(data.message);
        document.getElementById("createLinkForm").reset(); // Limpia el formulario
      })
      .catch((error) => {
        console.error("Error al crear el enlace:", error);
        alert("Error al crear el enlace: " + error.message);
      });
  });

  // Enviar el formulario de editar enlace
  document.getElementById("submitEditLinkForm").addEventListener("click", function () {
    var formData = new URLSearchParams(
      new FormData(document.getElementById("editLinkForm"))
    ).toString();

    fetch("/editLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Enlace editado exitosamente:", data.message);
        alert(data.message);
        document.getElementById("editLinkForm").reset(); // Limpia el formulario
      })
      .catch((error) => {
        console.error("Error al editar el enlace:", error);
        alert("Error al editar el enlace: " + error.message);
      });
  });

  // Enviar el formulario de eliminar enlace
  document.getElementById("submitDeleteLinkForm").addEventListener("click", function () {
    var formData = new URLSearchParams(
      new FormData(document.getElementById("deleteLinkForm"))
    ).toString();

    fetch("/removeLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Enlace eliminado exitosamente:", data.message);
        alert(data.message);
        document.getElementById("deleteLinkForm").reset(); // Limpia el formulario
      })
      .catch((error) => {
        console.error("Error al eliminar el enlace:", error);
        alert("Error al eliminar el enlace: " + error.message);
      });
  });

  // Función para obtener y mostrar todos los enlaces
  function fetchAllLinks() {
    fetch("/allLinks", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((links) => {
        var linksGrid = document.getElementById("linksGrid");
        linksGrid.innerHTML = "";

        if (Array.isArray(links) && links.length > 0) {
          links.forEach(function (link) {
            var id = link[0];
            var url = link[1];
            var card = createLinkCard(id, url);
            linksGrid.insertAdjacentHTML("beforeend", card);
          });
        } else {
          linksGrid.innerHTML = "<p class='text-gray-300'>No hay enlaces disponibles.</p>";
        }
      })
      .catch((error) => {
        console.error("Error al obtener los enlaces:", error);
      });
  }

  // Función para crear una tarjeta de enlace
  function createLinkCard(id, url) {
    return `
      <div class="link-card bg-gray-700 rounded-lg p-4 mb-4 shadow">
        <h4 class="text-xl font-semibold text-gray-300 content-selectable">ID: ${id}</h4>
        <p class="text-gray-300"><a href="${url}" target="_blank" class="content-selectable text-blue-400 hover:underline" title="${url}">${url}</a></p>
      </div>
    `;
  }
});
