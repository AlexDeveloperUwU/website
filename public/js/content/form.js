$(document).ready(function () {
  $("#contactForm").on("submit", function (event) {
    event.preventDefault();

    var formData = $(this).serialize();
    $.ajax({
      url: "/contactForm",
      type: "POST",
      data: formData,
      success: function (response) {
        alert("Mensaje enviado con éxito!");
        $("#contactForm")[0].reset();
      },
      error: function (xhr, status, error) {
        alert("Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.");
      },
    });
  });
});
