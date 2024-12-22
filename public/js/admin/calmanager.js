document.addEventListener("DOMContentLoaded", function () {
  // Mostrar el formulario de agregar evento
  document.getElementById("showAddEventForm").addEventListener("click", function () {
    document.getElementById("addEventFormContainer").classList.remove("hidden");
    document.getElementById("deleteEventFormContainer").classList.add("hidden");
    document.getElementById("allEventsContainer").classList.add("hidden");
    var eventsGrid = document.getElementById("eventsGrid");
    eventsGrid.innerHTML = "";
  });

  // Mostrar el formulario de eliminar evento
  document.getElementById("showDeleteEventForm").addEventListener("click", function () {
    document.getElementById("deleteEventFormContainer").classList.remove("hidden");
    document.getElementById("addEventFormContainer").classList.add("hidden");
    document.getElementById("allEventsContainer").classList.add("hidden");
    var eventsGrid = document.getElementById("eventsGrid");
    eventsGrid.innerHTML = "";
  });

  // Mostrar todos los eventos
  document.getElementById("showAllEvents").addEventListener("click", function () {
    document.getElementById("addEventFormContainer").classList.add("hidden");
    document.getElementById("deleteEventFormContainer").classList.add("hidden");
    document.getElementById("allEventsContainer").classList.remove("hidden");
    var eventsGrid = document.getElementById("eventsGrid");
    eventsGrid.innerHTML = "";
    fetchAllEvents();
  });

  // Enviar el formulario de añadir evento
  document.getElementById("submitAddEventForm").addEventListener("click", function () {
    var formData = new URLSearchParams(new FormData(document.getElementById("addEventForm"))).toString();

    fetch("/addEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Evento añadido exitosamente:", data);
        alert("Evento añadido exitosamente");
        // Puedes actualizar la lista de eventos si es necesario
      })
      .catch((error) => {
        console.error("Error al añadir el evento:", error);
        alert("Error al añadir el evento");
      });
  });

  // Enviar el formulario de eliminar evento
  document.getElementById("submitDeleteEventForm").addEventListener("click", function () {
    var formData = new URLSearchParams(new FormData(document.getElementById("deleteEventForm"))).toString();

    fetch("/removeEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Evento eliminado exitosamente:", data);
        alert("Evento eliminado exitosamente");
        // Puedes actualizar la lista de eventos si es necesario
      })
      .catch((error) => {
        console.error("Error al eliminar el evento:", error);
        alert("Error al eliminar el evento");
      });
  });

  // Función para obtener y mostrar todos los eventos
  function fetchAllEvents() {
    fetch("/manageAllEvents", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((events) => {
        var eventsGrid = document.getElementById("eventsGrid");
        eventsGrid.innerHTML = "";

        events.forEach(function (event) {
          var card = createEventCard(event);
          eventsGrid.insertAdjacentHTML("beforeend", card);
        });
      })
      .catch((error) => {
        console.error("Error al obtener los eventos:", error);
      });
  }

  // Función para crear una tarjeta de evento
  function createEventCard(event) {
    var iconClass = getEventIconClass(event.type);
    return `
      <a class="block rounded-lg bg-gray-800 p-6 hover:bg-blue-700">
        <div class="flex items-center">
          <i class="${iconClass} mr-3 text-gray-300"></i>
          <div>
            <p class="font-bold text-gray-100">${event.type}</p>
            <p class="text-gray-300">${event.description}</p>
            <p class="text-gray-300 text-sm">${event.date} - ${event.time} - ID: ${event.id}</p>
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
