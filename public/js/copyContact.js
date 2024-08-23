document.addEventListener("DOMContentLoaded", function () {
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Texto copiado al portapapeles:", text);
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
      });
  };

  const showCopySuccess = (element) => {
    element.classList.remove("border-gray-800");
    element.classList.add("border-green-400"); 
    setTimeout(() => {
      element.classList.remove("border-green-400");
      element.classList.add("border-gray-800"); 
    }, 2000);
  };

  document.getElementById("copyEmail").addEventListener("click", (event) => {
    event.preventDefault();
    copyToClipboard("alex@alexdevuwu.com");
    showCopySuccess(event.currentTarget);
  });

  document.getElementById("copyDiscord").addEventListener("click", (event) => {
    event.preventDefault();
    copyToClipboard("@alexdevuwu");
    showCopySuccess(event.currentTarget);
  });
});
