function navToggle() {
  const navLinks = document.getElementById("navbar-links");
  const overlay = document.getElementById("navbar-overlay");
  const menuIcon = document.getElementById("menuIcon");

  const isClosed = navLinks.getAttribute("data-state") === "closed";
  const newState = isClosed ? "open" : "closed";

  navLinks.setAttribute("data-state", newState);
  overlay.setAttribute("data-state", newState);

  // Change the icon
  menuIcon.src = isClosed ? "images/close.svg" : "images/menu.svg";
  menuIcon.alt = isClosed ? "close icon" : "menu icon";
}
document.getElementById("navbar-overlay").addEventListener("click", () => {
  const navLinks = document.getElementById("navbar-links");
  const overlay = document.getElementById("navbar-overlay");
    const isClosed = navLinks.getAttribute("data-state") === "closed";
  const newState = isClosed ? "open" : "closed";

  navLinks.setAttribute("data-state", "closed");
  overlay.setAttribute("data-state", "closed");

    menuIcon.src = isClosed ? "images/close.svg" : "images/menu.svg";
  menuIcon.alt = isClosed ? "close icon" : "menu icon";
});