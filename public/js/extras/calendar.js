document.addEventListener("DOMContentLoaded", async function () {
  const calendarContainer = document.getElementById("calendar");
  const toggleCalendarCard = document.getElementById("toggleCalendarCard");
  const calendarCard = document.getElementById("calendarCard");
  const toggleText = document.getElementById("toggleText");
  const eventDetails = document.getElementById("eventDetails");
  const platformIcon = document.getElementById("platformIcon");
  const platformName = document.getElementById("platformName");
  const eventDescription = document.getElementById("eventDescription");
  const currentDate = new Date();

  async function fetchEvents() {
    try {
      const response = await fetch("/allEvents");
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const events = await response.json();
      return events;
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      return [];
    }
  }

  function getEventColor(eventType) {
    switch (eventType) {
      case "Twitch":
        return "bg-purple-500";
      case "YouTube":
        return "bg-red-600";
      case "Multistream":
        return "bg-gradient-to-r from-purple-500 to-green-600";
      default:
        return "bg-gray-800";
    }
  }

  function getEventIcon(eventType) {
    switch (eventType) {
      case "Twitch":
        return "fab fa-twitch";
      case "YouTube":
        return "fab fa-youtube";
      case "Multistream":
        return "fa-solid fa-broadcast-tower";
      default:
        return "fa-solid fa-calendar";
    }
  }

  function renderCalendar(date, events) {
    const month = date.getMonth();
    const year = date.getFullYear();

    date.setDate(1);
    const firstDayIndex = date.getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    calendarContainer.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <button id="prevMonth" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">⬅</button>
        <h2 class="text-2xl font-bold">${months[month]} ${year}</h2>
        <button id="nextMonth" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">⮕</button>
      </div>
      <div class="grid grid-cols-7 gap-4 text-center text-gray-300">
        <div>Dom</div>
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
      </div>
      <div class="grid grid-cols-7 gap-4 text-center">
        ${[...Array(firstDayIndex).keys()]
          .map((i) => `<div class="text-gray-500 py-2">${prevLastDay - firstDayIndex + 1 + i}</div>`)
          .join("")}
        ${[...Array(lastDay).keys()]
          .map((i) => {
            const day = i + 1;
            const dateString = `${year}-${month + 1 < 10 ? "0" : ""}${month + 1}-${day < 10 ? "0" : ""}${day}`;
            const isToday =
              dateString ===
              `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? "0" : ""}${
                currentDate.getMonth() + 1
              }-${currentDate.getDate() < 10 ? "0" : ""}${currentDate.getDate()}`;
            const event = events.find((event) => event.date === dateString);
            const eventColor = event ? getEventColor(event.type) : "bg-gray-800 text-white";
            return `
              <div class="${isToday ? "bg-cyan-500 text-white" : eventColor} py-2 rounded ${
              event ? "border-2 cursor-pointer" : ""
            }" data-date="${dateString}">
                ${day}
              </div>
            `;
          })
          .join("")}
        ${[...Array(nextDays).keys()].map((i) => `<div class="text-gray-500 py-2">${i + 1}</div>`).join("")}
      </div>
    `;

    document.getElementById("prevMonth").addEventListener("click", () => {
      date.setMonth(date.getMonth() - 1);
      renderCalendar(new Date(date), events);
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      date.setMonth(date.getMonth() + 1);
      renderCalendar(new Date(date), events);
    });

    function formatDate(dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }

    document.querySelectorAll("[data-date]").forEach((day) => {
      day.addEventListener("click", () => {
        const selectedDate = day.getAttribute("data-date");
        const event = events.find((event) => event.date === selectedDate);
        if (event) {
          eventDetails.classList.remove("hidden");
          platformIcon.className = getEventIcon(event.type) + " mr-3 text-gray-300";
          platformName.textContent = event.type;
          eventDescription.textContent = `${event.description} el ${formatDate(event.date)} a las ${event.time}`;
        }
      });
    });
  }

  function hasEventsThisMonth(date, events) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return events.some((event) => {
      const [eventYear, eventMonth] = event.date.split("-").map(Number);
      return eventYear === year && eventMonth === month;
    });
  }

  const events = await fetchEvents();

  if (hasEventsThisMonth(currentDate, events)) {
    toggleCalendarCard.addEventListener("click", () => {
      const isHidden = calendarCard.classList.toggle("hidden");
      if (isHidden) {
        toggleCalendarCard.classList.remove("bg-blue-800");
        toggleCalendarCard.classList.add("bg-gray-800");
        toggleText.textContent = "Mostrar Calendario";
        eventDetails.classList.add("hidden");
      } else {
        toggleCalendarCard.classList.remove("bg-gray-800");
        toggleCalendarCard.classList.add("bg-blue-800");
        toggleText.textContent = "Ocultar Calendario";
      }
    });

    renderCalendar(new Date(currentDate), events);
  } else {
    const section = document.getElementById("calendarSectionId");
    section.style.display = "none";
  }
});
