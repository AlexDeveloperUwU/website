document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData.entries());
    const formQueryString = new URLSearchParams(formObject).toString();

    fetch("/contactForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formQueryString,
    })
      .then((response) => {
        if (response.ok) {
          alert("Mensaje enviado con éxito!");
          contactForm.reset();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        alert("Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.");
        console.error("Error al enviar el mensaje:", error);
      });
  });
});
