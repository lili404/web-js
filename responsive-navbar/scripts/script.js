const droplistToggle = document.getElementById("droplist-toggle");
const droplist = document.getElementById("nav");

const toggleDroplist = () => {
  const droplistDisplayValue = window.getComputedStyle(droplist);
  if (droplistDisplayValue.display === "none") {
    droplist.style.display = "block";
    droplistToggle.style.transform = "scaleY(-1)";
  } else {
    droplist.style.display = "none";
    droplistToggle.style.transform = "scaleY(1)";
  }
};

const resetDroplistDisplay = () => {
  const windowWidth = window.innerWidth;
  if (windowWidth > 768) {
    droplist.style.display = "";
    droplistToggle.style.transform = "scaleY(1)";
  }
};

window.addEventListener("resize", resetDroplistDisplay);
