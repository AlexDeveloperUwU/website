$(document).ready(function () {
  function loadTechStack(type) {
    let content = "";

    if (type === "noUI") {
      content = `
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-cogs mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Motor</h4>
              <p class="text-gray-400 font-agrandir">NodeJS</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-desktop mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Entorno de Desarrollo</h4>
              <p class="text-gray-400 font-agrandir">Visual Studio Code</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-database mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Bases de Datos</h4>
              <p class="text-gray-400 font-agrandir">SQLite (Enmap)</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-box mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Herramientas de Containerización</h4>
              <p class="text-gray-400 font-agrandir">Docker</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-laptop mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Sistemas Operativos</h4>
              <p class="text-gray-400 font-agrandir">Windows / Linux</p>
            </div>
          </div>`;
    } else if (type === "webUI") {
      content = `
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-cogs mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Motor</h4>
              <p class="text-gray-400 font-agrandir">NodeJS</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-desktop mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Entorno de Desarrollo</h4>
              <p class="text-gray-400 font-agrandir">Visual Studio Code</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-code mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Frontend</h4>
              <p class="text-gray-400 font-agrandir">HTML, CSS, JavaScript</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-cogs mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Frameworks</h4>
              <p class="text-gray-400 font-agrandir">TailwindCSS, Express, EJS</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-database mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Bases de Datos</h4>
              <p class="text-gray-400 font-agrandir">SQLite (Enmap)</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-box mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Herramientas de Containerización</h4>
              <p class="text-gray-400 font-agrandir">Docker</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-laptop mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Sistemas Operativos</h4>
              <p class="text-gray-400 font-agrandir">Windows / Linux</p>
            </div>
          </div>`;
    } else if (type === "java") {
      content = `
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-cogs mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Motor</h4>
              <p class="text-gray-400 font-agrandir">Java (Versión 21)</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-desktop mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Entorno de Desarrollo</h4>
              <p class="text-gray-400 font-agrandir">JetBrains IntelliJ</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-database mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Bases de Datos</h4>
              <p class="text-gray-400 font-agrandir">MySQL (si necesita)</p>
            </div>
          </div>
          <div class="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center">
            <i class="fas fa-laptop mr-4 text-gray-300 text-xl"></i>
            <div>
              <h4 class="font-bold text-gray-100">Sistemas Operativos</h4>
              <p class="text-gray-400 font-agrandir">Windows / Linux</p>
            </div>
          </div>`;
    }

    $("#stackInfo").html(content);
  }

  $("#projectType").change(function () {
    const selectedType = $(this).val();
    loadTechStack(selectedType);
  });

  loadTechStack($("#projectType").val());
});
