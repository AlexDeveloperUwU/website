$(document).ready(function () {
  $("#contactForm").on("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    var formData = $(this).serialize(); // Serializa los datos del formulario

    $.ajax({
      url: "/contactForm",
      type: "POST",
      data: formData,
      success: function (response) {
        // Manejar la respuesta exitosa aquí
        alert("Mensaje enviado con éxito!");
        $("#contactForm")[0].reset(); // Opcional: Limpiar el formulario después del envío
      },
      error: function (xhr, status, error) {
        // Manejar errores aquí
        alert("Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.");
      },
    });
  });
});
