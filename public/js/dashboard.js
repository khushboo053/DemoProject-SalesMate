document.getElementById("openBtn").addEventListener("click", function () {
  document.getElementById("sidebar").style.width = "250px";
  document.querySelector(".main-content").style.marginLeft = "250px";
});

document.getElementById("closeBtn").addEventListener("click", function () {
  document.getElementById("sidebar").style.width = "0";
  document.querySelector(".main-content").style.marginLeft = "0";
});

// Add toggle functionality to all dropdowns
const dropdowns = document.querySelectorAll(".dropdown .dropbtn");
dropdowns.forEach((dropBtn) => {
  dropBtn.addEventListener("click", function () {
    // Close any open dropdowns
    document.querySelectorAll(".dropdown .dropdown-content").forEach((dd) => {
      if (dd !== this.nextElementSibling) {
        dd.style.display = "none";
      }
    });

    // Toggle the current dropdown
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
});
