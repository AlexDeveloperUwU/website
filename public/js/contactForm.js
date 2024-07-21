document.getElementById("sendContactForm").addEventListener("click", function (event) {
  event.preventDefault();

  var form = document.getElementById("contactForm");
  var formData = new FormData(form);

  $.ajax({
    url: "/contactFormSend",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      document.getElementById("formContainerDiv").style.display = "none";
      var successHtml = `
        <div class="space-y-6" id="alertContainer">
          <div class="block rounded-lg bg-green-800 p-6">
            <div class="flex items-center mb-4">
              <i class="fa-solid fa-check mr-3 text-gray-300"></i>
              <h2 class="font-bold text-gray-100">Formulario enviado correctamente</h2>
              <button id="closeAlertSuccess" class="ml-auto text-gray-300">&times;</button>
            </div>
            <p class="text-green-200">
              Tu formulario se ha enviado con éxito. Nos pondremos en contacto contigo pronto.
            </p>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", successHtml);

      document.getElementById("closeAlertSuccess").addEventListener("click", function () {
        document.getElementById("alertContainer").remove();
        form.reset();
        document.getElementById("formContainerDiv").style.display = "block";
      });
    },
    error: function (xhr, status, error) {
      document.getElementById("formContainerDiv").style.display = "none";

      var errorHtml = `
        <div class="space-y-6" id="alertContainer">
          <div class="block rounded-lg bg-red-800 p-6">
            <div class="flex items-center mb-4">
              <i class="fa-solid fa-exclamation-circle mr-3 text-gray-300"></i>
              <h2 class="font-bold text-gray-100">Ha ocurrido un error</h2>
              <button id="closeAlertError" class="ml-auto text-gray-300">&times;</button>
            </div>
            <p class="text-red-200">
              El formulario no se ha podido enviar correctamente, por favor, inténtalo de nuevo más tarde.
            </p>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", errorHtml);

      document.getElementById("closeAlertError").addEventListener("click", function () {
        document.getElementById("alertContainer").remove();
        form.reset();
        document.getElementById("formContainerDiv").style.display = "block";
      });
    },
  });
});
