// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
	const savedTheme = localStorage.getItem("theme");
	if (savedTheme === "dark") {
		document.body.classList.add("dark");
	} else if (savedTheme === "light") {
		document.body.classList.remove("dark");
	} else {
		// respect user's system preference when no explicit choice
		const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
		if (prefersDark) document.body.classList.add("dark");
	}
});

// Theme toggle button handler (set up in include.js after header loads)
// This file ensures theme persistence across page loads
