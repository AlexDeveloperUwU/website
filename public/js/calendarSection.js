document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("calendar");
  const toggleCalendarCard = document.getElementById("toggleCalendarCard");
  const calendarCard = document.getElementById("calendarCard");
  const toggleText = document.getElementById("toggleText");
  const currentDate = new Date();
  const events = [
    { date: "2024-07-21", time: "14:30" },
    { date: "2024-07-22", time: "09:00" },
    { date: "2024-07-25", time: "17:45" }
  ];

  function renderCalendar(date) {
    const month = date.getMonth();
    const year = date.getFullYear();

    date.setDate(1);
    const firstDayIndex = date.getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
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
          .map(
            (i) => `<div class="text-gray-500 py-2">${prevLastDay - firstDayIndex + 1 + i}</div>`
          )
          .join("")}
        ${[...Array(lastDay).keys()]
          .map((i) => {
            const day = i + 1;
            const dateString = `${year}-${month + 1 < 10 ? '0' : ''}${month + 1}-${day < 10 ? '0' : ''}${day}`;
            const isToday =
              dateString ===
              `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? '0' : ''}${currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? '0' : ''}${currentDate.getDate()}`;
            const hasEvent = events.some((event) => event.date === dateString);
            return `
              <div class="${
                isToday ? "bg-blue-500 text-white" : hasEvent ? "bg-green-500 text-white" : "bg-gray-800 text-white"
              } py-2 rounded ${hasEvent ? "border-2 border-yellow-500" : ""}">
                ${day}
              </div>
            `;
          })
          .join("")}
        ${[...Array(nextDays).keys()]
          .map((i) => `<div class="text-gray-500 py-2">${i + 1}</div>`)
          .join("")}
      </div>
    `;

    document.getElementById("prevMonth").addEventListener("click", () => {
      date.setMonth(date.getMonth() - 1);
      renderCalendar(new Date(date));
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      date.setMonth(date.getMonth() + 1);
      renderCalendar(new Date(date));
    });
  }

  toggleCalendarCard.addEventListener("click", () => {
    const isHidden = calendarCard.classList.toggle("hidden");
    if (isHidden) {
      toggleCalendarCard.classList.remove("bg-blue-800");
      toggleCalendarCard.classList.add("bg-gray-800");
      toggleText.textContent = "Mostrar Calendario";
    } else {
      toggleCalendarCard.classList.remove("bg-gray-800");
      toggleCalendarCard.classList.add("bg-blue-800");
      toggleText.textContent = "Ocultar Calendario";
    }
  });

  renderCalendar(new Date(currentDate));
});