$(document).ready(function () {
  // Mostrar el formulario de agregar evento
  $("#showAddEventForm").on("click", function () {
    $("#addEventFormContainer").removeClass("hidden");
    $("#deleteEventFormContainer").addClass("hidden");
    $("#allEventsContainer").addClass("hidden");
  });

  // Mostrar el formulario de eliminar evento
  $("#showDeleteEventForm").on("click", function () {
    $("#deleteEventFormContainer").removeClass("hidden");
    $("#addEventFormContainer").addClass("hidden");
    $("#allEventsContainer").addClass("hidden");
  });

  // Mostrar todos los eventos
  $("#showAllEvents").on("click", function () {
    $("#addEventFormContainer").addClass("hidden");
    $("#deleteEventFormContainer").addClass("hidden");
    $("#allEventsContainer").removeClass("hidden");
    fetchAllEvents();
  });

  // Enviar el formulario de añadir evento
  $("#submitAddEventForm").on("click", function () {
    var username = $("#userAddEvent").val();
    var password = $("#passwordAddEvent").val();
    var formData = $("#addEventForm").serialize();

    $.ajax({
      url: "/addEvent",
      type: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
      success: function (response) {
        console.log("Evento añadido exitosamente:", response);
        // Puedes actualizar la lista de eventos si es necesario
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al añadir el evento:", textStatus, errorThrown);
      },
    });
  });

  // Enviar el formulario de eliminar evento
  $("#submitDeleteEventForm").on("click", function () {
    var username = $("#userDeleteEvent").val();
    var password = $("#passwordDeleteEvent").val();
    var formData = $("#deleteEventForm").serialize();

    $.ajax({
      url: "/removeEvent",
      type: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
      success: function (response) {
        console.log("Evento eliminado exitosamente:", response);
        // Puedes actualizar la lista de eventos si es necesario
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al eliminar el evento:", textStatus, errorThrown);
      },
    });
  });

  // Función para obtener y mostrar todos los eventos
  function fetchAllEvents() {
    $.ajax({
      url: "/manageAllEvents",
      type: "GET",
      success: function (events) {
        var eventsGrid = $("#eventsGrid");
        eventsGrid.empty(); 

        events.forEach(function (event) {
          var card = createEventCard(event);
          eventsGrid.append(card);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error al obtener los eventos:", textStatus, errorThrown);
      },
    });
  }

  // Función para crear una tarjeta de evento
  function createEventCard(event) {
    var iconClass = getEventIconClass(event.type);
    return `
      <a href="#" class="block rounded-lg bg-gray-800 p-6 hover:bg-blue-700">
        <div class="flex items-center">
          <i class="${iconClass} mr-3 text-gray-300"></i>
          <div>
            <p class="font-bold text-gray-100">${event.type}</p>
            <p class="text-gray-400">${event.description}</p>
            <p class="text-gray-500 text-sm">${event.date} - ${event.time} - ID: ${event.id}</p>
          </div>
        </div>
      </a>
    `;
  }

  // Función para obtener la clase del ícono según el tipo de evento
  function getEventIconClass(eventType) {
    switch (eventType) {
      case "Twitch":
        return "fab fa-twitch";
      case "YouTube":
        return "fab fa-youtube";
      case "Multistream":
        return "fas fa-video";
      default:
        return "fas fa-calendar-alt";
    }
  }
});
