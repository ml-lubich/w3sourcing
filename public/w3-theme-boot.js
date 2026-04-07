(function () {
  try {
    var k = "w3-theme";
    var s = localStorage.getItem(k);
    var d =
      s === "dark" || (s !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", d);
  } catch {
    /* ignore */
  }
})();
