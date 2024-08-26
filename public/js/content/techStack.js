$(document).ready(function () {
  function loadTechStack(type) {
    const stackInfo = $("#stackInfo");
    stackInfo.addClass("fade-out");

    setTimeout(() => {
      $.getJSON("/json/techStacks.json", function (data) {
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

        stackInfo.html(content);
        stackInfo.removeClass("fade-out");
        stackInfo.addClass("fade-in");

        setTimeout(() => {
          stackInfo.removeClass("fade-in");
        }, 600);
      });
    }, 600);
  }

  loadTechStack($("#projectType").val());

  $("#projectType").change(function () {
    const selectedType = $(this).val();
    loadTechStack(selectedType);
  });
});
