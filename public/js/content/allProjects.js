document.addEventListener("DOMContentLoaded", function () {
  fetch("/json/projects.json")
    .then((response) => response.json())
    .then((data) => {
      const mainElement = document.querySelector("main");

      const projectsByOrg = data.reduce((acc, project) => {
        if (!acc[project.org]) acc[project.org] = [];
        acc[project.org].push(project);
        return acc;
      }, {});

      const sortedOrgs = Object.keys(projectsByOrg).sort((a, b) => {
        if (a === "AlexDevUwU") return -1;
        if (b === "AlexDevUwU") return 1;
        return a.localeCompare(b);
      });

      sortedOrgs.forEach((org) => {
        const orgSection = document.createElement("section");
        orgSection.className = "mx-auto mt-10 max-w-6xl text-left space-y-4";

        const orgHeader = document.createElement("h3");
        orgHeader.className = "mb-4 text-2xl font-bold text-gray-100 flex items-center";
        orgHeader.innerHTML = `<i class="fab fa-github mr-3"></i>${org}`;

        orgSection.appendChild(orgHeader);

        projectsByOrg[org].forEach((project) => {
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
          orgSection.appendChild(projectCard);
        });

        mainElement.appendChild(orgSection);
      });
    })
    .catch((error) => console.error("Error loading projects:", error));
});
