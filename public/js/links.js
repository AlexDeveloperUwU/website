$(document).ready(function () {
  // Mostrar el formulario de crear enlace
  $("#showCreateLinkForm").on("click", function () {
    $("#createLinkFormContainer").removeClass("hidden");
    $("#editLinkFormContainer").addClass("hidden");
    $("#deleteLinkFormContainer").addClass("hidden");
    $("#allLinksContainer").addClass("hidden");
  });

  // Mostrar el formulario de editar enlace
  $("#showEditLinkForm").on("click", function () {
    $("#createLinkFormContainer").addClass("hidden");
    $("#editLinkFormContainer").removeClass("hidden");
    $("#deleteLinkFormContainer").addClass("hidden");
    $("#allLinksContainer").addClass("hidden");
  });

  // Mostrar el formulario de eliminar enlace
  $("#showDeleteLinkForm").on("click", function () {
    $("#createLinkFormContainer").addClass("hidden");
    $("#editLinkFormContainer").addClass("hidden");
    $("#deleteLinkFormContainer").removeClass("hidden");
    $("#allLinksContainer").addClass("hidden");
  });

  // Mostrar todos los enlaces
  $("#showAllLinks").on("click", function () {
    $("#createLinkFormContainer").addClass("hidden");
    $("#editLinkFormContainer").addClass("hidden");
    $("#deleteLinkFormContainer").addClass("hidden");
    $("#allLinksContainer").removeClass("hidden");
    fetchAllLinks();
  });

  // Enviar el formulario de crear enlace
  $("#submitCreateLinkForm").on("click", function () {
    var username = $("#userCreateLink").val();
    var password = $("#passwordCreateLink").val();
    var formData = $("#createLinkForm").serialize();

    $.ajax({
      url: "/addLink",
      type: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
      success: function (response) {
        console.log("Enlace creado exitosamente:", response.message);
        alert(response.message);
        $("#createLinkForm")[0].reset(); // Limpia el formulario
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al crear el enlace:", textStatus, errorThrown);
        alert("Error al crear el enlace: " + jqXHR.responseJSON.message);
      },
    });
  });

  // Enviar el formulario de editar enlace
  $("#submitEditLinkForm").on("click", function () {
    var username = $("#userEditLink").val();
    var password = $("#passwordEditLink").val();
    var formData = $("#editLinkForm").serialize();

    $.ajax({
      url: "/editLink",
      type: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
      success: function (response) {
        console.log("Enlace editado exitosamente:", response.message);
        alert(response.message);
        $("#editLinkForm")[0].reset(); // Limpia el formulario
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al editar el enlace:", textStatus, errorThrown);
        alert("Error al editar el enlace: " + jqXHR.responseJSON.message);
      },
    });
  });

  // Enviar el formulario de eliminar enlace
  $("#submitDeleteLinkForm").on("click", function () {
    var username = $("#userDeleteLink").val();
    var password = $("#passwordDeleteLink").val();
    var formData = $("#deleteLinkForm").serialize();

    $.ajax({
      url: "/removeLink",
      type: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
      success: function (response) {
        console.log("Enlace eliminado exitosamente:", response.message);
        alert(response.message);
        $("#deleteLinkForm")[0].reset(); // Limpia el formulario
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al eliminar el enlace:", textStatus, errorThrown);
        alert("Error al eliminar el enlace: " + jqXHR.responseJSON.message);
      },
    });
  });

  // Función para obtener y mostrar todos los enlaces
  function fetchAllLinks() {
    $.ajax({
      url: "/allLinks",
      type: "GET",
      success: function (links) {
        console.log(links);
        var linksGrid = $("#linksGrid");
        linksGrid.empty();

        // Comprobar si links tiene datos
        if (Array.isArray(links) && links.length > 0) {
          links.forEach(function (link) {
            // link es un array: [id, url]
            var id = link[0];
            var url = link[1];
            var card = createLinkCard(id, url);
            linksGrid.append(card);
          });
        } else {
          linksGrid.html("<p class='text-gray-400'>No hay enlaces disponibles.</p>");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al obtener los enlaces:", textStatus, errorThrown);
      },
    });
  }

  // Función para crear una tarjeta de enlace
  function createLinkCard(id, url) {
    return `
      <div class="link-card bg-gray-700 rounded-lg p-4 mb-4 shadow">
        <h4 class="text-xl font-semibold text-gray-300 content-selectable">ID: ${id}</h4>
        <p class="text-gray-400"><a href="${url}" target="_blank" class="content-selectable text-blue-400 hover:underline" title="${url}">${url}</a></p>
      </div>
    `;
  }
});
