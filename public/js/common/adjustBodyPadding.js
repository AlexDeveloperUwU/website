function adjustBodyPadding() {
  const header = document.getElementById("main-header");
  const headerHeight = header.offsetHeight;
  document.body.style.paddingTop = headerHeight - 50 + "px";
}

window.addEventListener("load", adjustBodyPadding);
window.addEventListener("resize", adjustBodyPadding);
