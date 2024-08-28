document.addEventListener("DOMContentLoaded", function () {
  const yearSelect = document.getElementById("yearSelect");
  const monthSelect = document.getElementById("monthSelect");
  const timelineContainer = document.getElementById("timeline");

  let timelineData;

  fetch("/json/timeline.json")
    .then((response) => response.json())
    .then((data) => {
      timelineData = data;
      populateYearSelect(data);
      showTimelineContainer(); 
    })
    .catch((error) => console.error("Error fetching timeline data:", error));

  function populateYearSelect(data) {
    for (const year in data) {
      if (data.hasOwnProperty(year)) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      }
    }
  }

  yearSelect.addEventListener("change", function () {
    const selectedYear = yearSelect.value;

    if (!selectedYear) {
      monthSelect.innerHTML = '<option value="">Selecciona el mes</option>';
      monthSelect.disabled = true;
      fadeOutTimelineContainer(function () {
        timelineContainer.innerHTML = "";
      });
      return;
    }

    populateMonthSelect(selectedYear);
    monthSelect.disabled = false;
  });

  function populateMonthSelect(year) {
    monthSelect.innerHTML = '<option value="">Selecciona el mes</option>';

    for (const month in timelineData[year]) {
      if (timelineData[year].hasOwnProperty(month)) {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
      }
    }
  }

  monthSelect.addEventListener("change", function () {
    const selectedYear = yearSelect.value;
    const selectedMonth = monthSelect.value;

    if (!selectedMonth) {
      fadeOutTimelineContainer(function () {
        timelineContainer.innerHTML = "";
      });
      return;
    }

    fadeOutTimelineContainer(function () {
      displayProjects(selectedYear, selectedMonth);
      fadeInTimelineContainer();
    });
  });

  function displayProjects(year, month) {
    timelineContainer.innerHTML = "";

    const projects = timelineData[year][month];

    projects.forEach((project) => {
      const projectDiv = document.createElement("div");
      projectDiv.classList.add("p-4", "bg-gray-800", "rounded-lg", "shadow-lg", "mb-4");

      const projectTitle = document.createElement("h5");
      projectTitle.classList.add("text-lg", "font-bold", "text-gray-200");
      projectTitle.textContent = project.title;
      projectDiv.appendChild(projectTitle);

      const projectDescription = document.createElement("p");
      projectDescription.classList.add("text-sm", "text-gray-300", "mt-2");
      projectDescription.textContent = project.description;
      projectDiv.appendChild(projectDescription);

      timelineContainer.appendChild(projectDiv);
    });
  }

  function showTimelineContainer() {
    timelineContainer.classList.remove("hidden");
    timelineContainer.classList.add("fade-in");
  }

  function fadeOutTimelineContainer(callback) {
    timelineContainer.classList.remove("fade-in");
    timelineContainer.classList.add("fade-out");

    setTimeout(function () {
      timelineContainer.classList.add("hidden");
      callback();
    }, 605);
  }

  function fadeInTimelineContainer() {
    timelineContainer.classList.remove("hidden");
    timelineContainer.classList.remove("fade-out");
    timelineContainer.classList.add("fade-in");
  }
});
