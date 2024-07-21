document.addEventListener("DOMContentLoaded", function () {
  const contentContainer = document.getElementById("content");
  const toggleCalendarCard = document.getElementById("toggleCalendarCard");
  const currentDate = new Date();
  const entradas = [
    {
      plataforma: "Twitch",
      fecha: "2024-06-18T20:00:00",
    },
    {
      plataforma: "Twitch",
      fecha: "2024-07-18T20:00:00",
    },
    {
      plataforma: "YouTube",
      fecha: "2024-07-19T18:00:00",
    },
    {
      plataforma: "Kick",
      fecha: "2024-07-22T15:00:00",
    },
    {
      plataforma: "Twitch",
      fecha: "2024-07-25T19:00:00",
    },
    {
      plataforma: "YouTube",
      fecha: "2024-08-04T21:00:00",
    },
  ];

  function isMobileOrTablet() {
    return window.innerWidth <= 768;
  }

  function renderCalendar(date) {
    const month = date.getMonth();
    const year = date.getFullYear();

    date.setDate(1);
    const firstDayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = lastDayIndex === 6 ? 0 : 7 - lastDayIndex - 1;

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

    let calendarHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
          <button id="prevMonth" class="bg-gray-700 text-white px-4 py-2 rounded mb-2 sm:mb-0 sm:mr-2 hover:bg-gray-600">Anterior</button>
          <h2 class="text-2xl font-bold mb-2 sm:mb-0">${months[month]} ${year}</h2>
          <button id="nextMonth" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">Siguiente</button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-gray-300">
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
          <div>Dom</div>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center">
      `;

    calendarHTML += [...Array(firstDayIndex).keys()]
      .map(
        (i) => `
        <div class="p-2 relative">
          <div class="text-gray-500">${prevLastDay - firstDayIndex + 2 + i}</div>
        </div>
      `
      )
      .join("");

    calendarHTML += [...Array(lastDay).keys()]
      .map((i) => {
        const day = i + 1;
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
          2,
          "0"
        )}`;
        const events = entradas.filter(
          (d) =>
            new Date(d.fecha).toLocaleDateString("es-ES") ===
            new Date(dateStr).toLocaleDateString("es-ES")
        );
        const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

        let eventHtml = "";
        events.forEach((event) => {
          let bgColorClass = "";
          if (event.plataforma === "Twitch") {
            bgColorClass = "bg-purple-600";
            platformUrl = "https://www.twitch.tv/alexdevuwu";
          } else if (event.plataforma === "YouTube") {
            bgColorClass = "bg-red-600";
            platformUrl = "https://www.youtube.com/alexdevuwu";
          } else if (event.plataforma === "Kick") {
            bgColorClass = "bg-green-600";
            platformUrl = "https://kick.com/alexdevuwu";
          }

          eventHtml += `
            <div class="mt-1 ${bgColorClass} text-xs p-1 rounded">
              <a href="${platformUrl}">${new Date(event.fecha).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}</a>
            </div>
          `;
        });

        if (events.length > 0) {
          return `
            <div class="p-2 relative bg-gray-900 text-white rounded">
              <div class="font-bold ${isToday ? "text-blue-500" : ""}">${day}</div>
              ${eventHtml}
            </div>
          `;
        } else {
          return `
            <div class="p-2 relative">
              <div class="font-bold ${isToday ? "text-blue-500" : ""}">${day}</div>
            </div>
          `;
        }
      })
      .join("");

    calendarHTML += [...Array(nextDays).keys()]
      .map(
        (i) => `
        <div class="p-2 relative">
          <div class="text-gray-500">${i + 1}</div>
        </div>
      `
      )
      .join("");

    calendarHTML += `
        </div>
      `;

    contentContainer.innerHTML = calendarHTML;

    document.getElementById("prevMonth").addEventListener("click", () => {
      date.setMonth(date.getMonth() - 1);
      renderCalendar(new Date(date));
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      date.setMonth(date.getMonth() + 1);
      renderCalendar(new Date(date));
    });
  }

  function renderEventCards(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const now = new Date();

    const events = entradas.filter((event) => {
      const eventDate = new Date(event.fecha);
      return eventDate >= now && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

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

    let cardsHTML = `
        <div class="flex justify-center items-center mb-4">
          <h2 class="text-2xl font-bold">${months[month]} ${year}</h2>
        </div>
        <div class="space-y-4">
      `;

    if (events.length === 0) {
      cardsHTML += `
          <div class="text-center py-4">No hay eventos programados para este mes.</div>
        `;
    } else {
      events.forEach((event) => {
        const eventDate = new Date(event.fecha);
        const dateStr = eventDate
          .toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
          .toUpperCase();
        const timeStr = eventDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let bgColorClass = "";
        let platformIcon = "";
        let platformUrl = "";

        if (event.plataforma === "Twitch") {
          bgColorClass = "bg-purple-500";
          bgColor = "purple";
          platformIcon = "fa-twitch";
          contentType = "Directo";
          platformUrl = "https://www.twitch.tv/alexdevuwu";
        } else if (event.plataforma === "YouTube") {
          bgColorClass = "bg-red-500";
          bgColor = "red";
          platformIcon = "fa-youtube";
          contentType = "Vídeo";
          platformUrl = "https://www.youtube.com/alexdevuwu";
        } else if (event.plataforma === "Kick") {
          bgColorClass = "bg-green-500";
          bgColor = "green";
          platformIcon = "fa-kickstarter-k";
          contentType = "Directo";
          platformUrl = "https://kick.com/alexdevuwu";
        }

        cardsHTML += `
            <a href="${platformUrl}" class="block rounded-lg ${bgColorClass} p-6 hover:bg-blue-700">
              <div class="flex items-center">
                <i class="fa-brands ${platformIcon} mr-3 text-gray-300"></i>
                <div>
                  <p class="font-bold text-gray-100">${contentType} en ${event.plataforma}</p>
                  <p class="text-gray-100">${dateStr} a las ${timeStr}</p>
                </div>
              </div>
            </a>
          `;
      });
    }

    cardsHTML += `
        </div>
      `;

    contentContainer.innerHTML = cardsHTML;
  }

  function renderContent() {
    const contentCalendar = document.getElementById("calendar");
    if (isMobileOrTablet()) {
      renderEventCards(new Date(currentDate));
      contentCalendar.classList.remove("fade-in");
      contentCalendar.classList.add("fade-out");
    } else {
      renderCalendar(new Date(currentDate));
      contentCalendar.classList.remove("hidden");
      contentCalendar.classList.remove("fade-out");
      contentCalendar.classList.add("fade-in");
      document.getElementById("calendarNotice").style.display = "block";
    }
  }

  function toggleCalendar() {
    const contentCalendar = document.getElementById("calendar");
    if (contentCalendar.style.display === "none") {
      contentCalendar.style.display = "block";
      contentCalendar.classList.remove("hidden");
      contentCalendar.classList.remove("fade-out");
      contentCalendar.classList.add("fade-in");
      toggleCalendarCard.classList.add("bg-blue-700");
      toggleCalendarCard.classList.remove("bg-gray-800");
      renderContent();
    } else {
      contentCalendar.classList.remove("fade-in");
      contentCalendar.classList.add("fade-out");
      setTimeout(() => {
        contentCalendar.style.display = "none";
        contentCalendar.classList.add("hidden");
      }, 500);
      toggleCalendarCard.classList.add("bg-gray-800");
      toggleCalendarCard.classList.remove("bg-blue-700");
    }
  }

  toggleCalendarCard.addEventListener("click", toggleCalendar);

  window.addEventListener("resize", renderContent);
});
