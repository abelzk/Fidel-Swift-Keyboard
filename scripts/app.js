document.addEventListener("DOMContentLoaded", () => {
    // Handle internal navigation clicks
    document.querySelectorAll("a[data-link]").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const url = this.getAttribute("href");
            history.pushState(null, null, url);
            loadPage(url);
        });
    });

    // Load page content into #content div
    function loadPage(url) {
        fetch(url)
            .then(res => res.text())
            .then(html => {
                document.getElementById("content").innerHTML = html;
            })
            .catch(err => {
                document.getElementById("content").innerHTML = "<p>Error loading page.</p>";
            });
    }

    // Handle browser back/forward
    window.addEventListener("popstate", () => {
        loadPage(location.pathname);
    });

    // Load initial page if not homepage
    if (location.pathname !== "/" && location.pathname !== "/index.html") {
        loadPage(location.pathname);
    }
});
