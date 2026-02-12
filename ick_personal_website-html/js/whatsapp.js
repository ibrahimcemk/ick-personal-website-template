document.addEventListener("DOMContentLoaded", function () {
	const fab = document.getElementById("whatsappFab");
	if (!fab) return;

	// Phone from contact page
	const phoneRaw = "+905358557133";
	const phone = phoneRaw.replace(/\D/g, "");
	const defaultText = encodeURIComponent("Merhaba, web siteniz üzerinden iletişime geçiyorum.");
	const waUrl = `https://wa.me/${phone}?text=${defaultText}`;

	fab.addEventListener("click", function (e) {
		e.preventDefault();
		// small calling animation then open
		fab.classList.add("calling");
		setTimeout(() => {
			window.open(waUrl, "_blank");
		}, 650);
		setTimeout(() => fab.classList.remove("calling"), 1900);
	});

	// Accessibility: keyboard activation
	fab.addEventListener("keydown", function (e) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			fab.click();
		}
	});
});
