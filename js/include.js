// COMPONENT LOAD
function loadComponent(id, file) {
	fetch(file)
		.then(res => res.text())
		.then(data => {
			document.getElementById(id).innerHTML = data;
			setActiveLink();
			setupHamburger();
			setupTheme();
			revealNavOnce();
		});
}

// LOAD HEADER & FOOTER
document.addEventListener("DOMContentLoaded", () => {
	loadComponent("header", "components/header.html");
	loadComponent("footer", "components/footer.html");
});

// HAMBURGER
function setupHamburger() {
	const hamburger = document.getElementById("hamburger");
	const navLinks = document.getElementById("navLinks");

	if (!hamburger || !navLinks) return;

	hamburger.addEventListener("click", () => {
		navLinks.classList.toggle("active");
		hamburger.classList.toggle("active");
		const expanded = hamburger.classList.contains("active");
		hamburger.setAttribute("aria-expanded", expanded ? "true" : "false");
		// when opening on mobile, reveal links with stagger
		if (navLinks.classList.contains("active")) {
			const items = Array.from(navLinks.querySelectorAll("li"));
			items.forEach((li, i) => {
				setTimeout(() => li.classList.add("show"), i * 40);
			});
		} else {
			navLinks.querySelectorAll("li").forEach(li => li.classList.remove("show"));
		}
	});

	// Close menu when a link is clicked
	const navLinksList = navLinks.querySelectorAll("a");
	navLinksList.forEach(link => {
		link.addEventListener("click", () => {
			navLinks.classList.remove("active");
			hamburger.classList.remove("active");
			hamburger.setAttribute("aria-expanded", "false");
			navLinks.querySelectorAll("li").forEach(li => li.classList.remove("show"));
		});
	});
}

// Reveal nav items once on initial load (desktop animation)
function revealNavOnce() {
	const navLinks = document.getElementById("navLinks");
	if (!navLinks || navLinks.dataset.revealed === "true") return;
	const items = Array.from(navLinks.querySelectorAll("li"));
	items.forEach((li, i) => {
		setTimeout(() => li.classList.add("show"), 120 + i * 40);
	});
	navLinks.dataset.revealed = "true";
}

// ACTIVE LINK
function setActiveLink() {
	const links = document.querySelectorAll(".nav-links a");
	links.forEach(link => {
		const href = link.getAttribute("href");
		const currentPage = window.location.pathname.split("/").pop() || "index.html";

		if (href.includes(currentPage) || (currentPage === "" && href === "index.html")) {
			link.classList.add("ansyf");
		} else {
			link.classList.remove("ansyf");
		}
	});
}

// SETUP THEME
function setupTheme() {
	const themeToggle = document.getElementById("themeToggle");
	if (themeToggle) {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "dark") {
			document.body.classList.add("dark");
			themeToggle.textContent = "☀️";
		} else if (savedTheme === "light") {
			document.body.classList.remove("dark");
			themeToggle.textContent = "🌙";
		} else {
			const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
			if (prefersDark) {
				document.body.classList.add("dark");
				themeToggle.textContent = "☀️";
			} else {
				themeToggle.textContent = "🌙";
			}
		}

		themeToggle.addEventListener("click", function () {
			const isDark = document.body.classList.toggle("dark");
			localStorage.setItem("theme", isDark ? "dark" : "light");
			this.textContent = isDark ? "☀️" : "🌙";
		});
	}
}

// CV DOWNLOAD ANIMATION
function setupCVDownload() {
	const cvBtn = document.getElementById("cvDownloadBtn");
	if (!cvBtn) return;

	cvBtn.addEventListener("click", function (e) {
		if (this.classList.contains("downloading")) {
			e.preventDefault();
			return;
		}

		this.classList.add("downloading");

		// Remove animation after download
		setTimeout(() => {
			this.classList.remove("downloading");
		}, 2000);
	});
}

// Initial CV download setup
document.addEventListener("DOMContentLoaded", () => {
	setupCVDownload();
});
