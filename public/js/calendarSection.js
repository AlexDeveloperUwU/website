document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("calendar");
  const toggleCalendarCard = document.getElementById("toggleCalendarCard");
  const calendarCard = document.getElementById("calendarCard");
  const currentDate = new Date();

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
        <button id="prevMonth" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">Prev</button>
        <h2 class="text-2xl font-bold">${months[month]} ${year}</h2>
        <button id="nextMonth" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">Next</button>
      </div>
      <div class="grid grid-cols-7 gap-2 text-center text-gray-300">
        <div>Dom</div>
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
      </div>
      <div class="grid grid-cols-7 gap-2 text-center">
        ${[...Array(firstDayIndex).keys()]
          .map((i) => `<div class="text-gray-500 py-2">${prevLastDay - firstDayIndex + 1 + i}</div>`)
          .join("")}
        ${[...Array(lastDay).keys()]
          .map((i) => `<div class="bg-gray-800 text-white py-2 rounded">${i + 1}</div>`)
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
    calendarCard.classList.toggle("hidden");
  });

  renderCalendar(new Date(currentDate));
});
