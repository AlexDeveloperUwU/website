document.addEventListener("DOMContentLoaded", function () {
  fetch("/json/projects.json")
    .then((response) => response.json())
    .then((data) => {
      const projectsContainer = document.getElementById("projects-container");

      data
        .filter((project) => project.homepage)
        
        .forEach((project) => {
          const projectCard = document.createElement("a");
          projectCard.href = project.url;
          projectCard.className = "block rounded-lg bg-gray-800 p-6 hover:bg-blue-700";
          projectCard.innerHTML = `
            <div class="flex items-center">
              <i class="${project.icon} mr-3 text-gray-300"></i>
              <div>
                <p class="font-bold text-gray-100">${project.name}</p>
                <p class="text-gray-300 font-agrandir">${project.description}</p>
              </div>
            </div>
          `;
          projectsContainer.appendChild(projectCard);
        });

      const githubCard = document.createElement("a");
      githubCard.href = "/allProjects";
      githubCard.className = "block rounded-lg bg-gray-800 p-6 hover:bg-blue-700";
      githubCard.innerHTML = `
          <div class="flex items-center">
            <i class="fab fa-github mr-3 text-gray-300"></i>
            <div>
              <p class="font-bold text-gray-100">Otros proyectos</p>
              <p class="text-gray-300 font-agrandir">Quieres ver otros proyectos que tengo? Si es así, mira la lista completa! Tengo proyectos en varias ORGs de GitHub, con lo que los he agrupado en una sección para tu comodidad :D</p>
            </div>
          </div>
        `;
      projectsContainer.appendChild(githubCard);
    })
    .catch((error) => console.error("Error loading projects:", error));
});