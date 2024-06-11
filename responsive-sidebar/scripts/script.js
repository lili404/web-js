const toggleSidebarExpansion = () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("expanded");
};

const toggleSidebar = document.getElementById("toggle-sidebar");
toggleSidebar.addEventListener("click", toggleSidebarExpansion);
