document.addEventListener("DOMContentLoaded", function () {
  function loadTechStack(type) {
    const stackInfo = document.getElementById("stackInfo");
    stackInfo.classList.add("fade-out");

    setTimeout(() => {
      fetch("/json/techStacks.json")
        .then((response) => response.json())
        .then((data) => {
          let content = "";

          if (data[type]) {
            data[type].forEach((item) => {
              content += `
                <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
                  <i class="${item.icon} mr-4 text-gray-300 text-xl"></i>
                  <div>
                    <h4 class="font-bold text-gray-100">${item.title}</h4>
                    <p class="text-gray-300 font-agrandir">${item.description}</p>
                  </div>
                </div>`;
            });
          }

          stackInfo.innerHTML = content;
          stackInfo.classList.remove("fade-out");
          stackInfo.classList.add("fade-in");

          setTimeout(() => {
            stackInfo.classList.remove("fade-in");
          }, 600);
        })
        .catch((error) => {
          console.error("Error loading tech stack:", error);
        });
    }, 600);
  }

  const projectType = document.getElementById("projectType");
  loadTechStack(projectType.value);

  projectType.addEventListener("change", function () {
    const selectedType = this.value;
    loadTechStack(selectedType);
  });
});
