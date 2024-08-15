$(document).ready(function () {
  // Mostrar el formulario de crear enlace
  $("#showCreateLinkForm").on("click", function () {
    $("#createLinkFormContainer").removeClass("hidden");
    $("#editLinkFormContainer").addClass("hidden");
    $("#deleteLinkFormContainer").addClass("hidden");
    $("#allLinksContainer").addClass("hidden");
    $("#linksGrid").empty();
  });

  // Mostrar el formulario de editar enlace
  $("#showEditLinkForm").on("click", function () {
    $("#createLinkFormContainer").addClass("hidden");
    $("#editLinkFormContainer").removeClass("hidden");
    $("#deleteLinkFormContainer").addClass("hidden");
    $("#allLinksContainer").addClass("hidden");
    $("#linksGrid").empty();
  });

  // Mostrar el formulario de eliminar enlace
  $("#showDeleteLinkForm").on("click", function () {
    $("#createLinkFormContainer").addClass("hidden");
    $("#editLinkFormContainer").addClass("hidden");
    $("#deleteLinkFormContainer").removeClass("hidden");
    $("#allLinksContainer").addClass("hidden");
    $("#linksGrid").empty();
  });

  // Mostrar todos los enlaces
  $("#showAllLinks").on("click", function () {
    $("#createLinkFormContainer").addClass("hidden");
    $("#editLinkFormContainer").addClass("hidden");
    $("#deleteLinkFormContainer").addClass("hidden");
    $("#allLinksContainer").removeClass("hidden");
    $("#linksGrid").empty();
    fetchAllLinks();
  });

  // Enviar el formulario de crear enlace
  $("#submitCreateLinkForm").on("click", function () {
    var username = $("#userCreateLink").val();
    var password = $("#passwordCreateLink").val();
    var formData = $("#createLinkForm").serialize();

    $.ajax({
      url: "/createLink",
      type: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
      success: function (response) {
        console.log("Enlace creado exitosamente:", response);
        // Puedes actualizar la lista de enlaces si es necesario
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al crear el enlace:", textStatus, errorThrown);
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
        console.log("Enlace editado exitosamente:", response);
        // Puedes actualizar la lista de enlaces si es necesario
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al editar el enlace:", textStatus, errorThrown);
      },
    });
  });

  // Enviar el formulario de eliminar enlace
  $("#submitDeleteLinkForm").on("click", function () {
    var username = $("#userDeleteLink").val();
    var password = $("#passwordDeleteLink").val();
    var formData = $("#deleteLinkForm").serialize();

    $.ajax({
      url: "/deleteLink",
      type: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
      success: function (response) {
        console.log("Enlace eliminado exitosamente:", response);
        // Puedes actualizar la lista de enlaces si es necesario
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al eliminar el enlace:", textStatus, errorThrown);
      },
    });
  });

  // Función para obtener y mostrar todos los enlaces
  function fetchAllLinks() {
    $.ajax({
      url: "/manageAllLinks",
      type: "GET",
      success: function (links) {
        console.log(links);
        var linksGrid = $("#linksGrid");
        linksGrid.empty();

        links.forEach(function (link) {
          var card = createLinkCard(link);
          linksGrid.append(card);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al obtener los enlaces:", textStatus, errorThrown);
      },
    });
  }

  // Función para crear una tarjeta de enlace
  function createLinkCard(link) {
    return `
          <a class="block rounded-lg bg-gray-800 p-6 hover:bg-blue-700">
            <div class="flex items-center">
              <div>
                <p class="font-bold text-gray-100">ID: ${link.id}</p>
                <p class="text-gray-400">Descripción: ${link.description || "N/A"}</p>
                <p class="text-gray-400">URL: <a href="${
                  link.url
                }" target="_blank" class="text-blue-400">${link.url}</a></p>
              </div>
            </div>
          </a>
        `;
  }
});
