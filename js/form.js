// Form handling
document.addEventListener("DOMContentLoaded", () => {
	const contactForm = document.getElementById("contactForm");
	if (!contactForm) return;

	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("email");
	const subjectInput = document.getElementById("subject");
	const messageInput = document.getElementById("message");
	const formMessage = document.getElementById("formMessage");

	contactForm.addEventListener("submit", e => {
		e.preventDefault();

		const name = nameInput.value.trim();
		const email = emailInput.value.trim();
		const subject = subjectInput.value.trim();
		const message = messageInput.value.trim();

		// Validation
		if (!name || !email || !subject || !message) {
			showMessage("Tüm alanları doldurun!", "error");
			return;
		}

		if (!validateEmail(email)) {
			showMessage("Geçerli bir email girin!", "error");
			return;
		}

		if (message.length < 10) {
			showMessage("Mesaj en az 10 karakter olmalıdır!", "error");
			return;
		}

		// Simulate sending
		contactForm.style.opacity = "0.5";
		contactForm.style.pointerEvents = "none";

		setTimeout(() => {
			showMessage("✓ Mesajınız başarıyla gönderildi! Sizinle kısa zamanda iletişime geçeceğim.", "success");
			contactForm.reset();
			contactForm.style.opacity = "1";
			contactForm.style.pointerEvents = "auto";

			// Clear message after 5 seconds
			setTimeout(() => {
				formMessage.classList.remove("success", "error");
				formMessage.textContent = "";
			}, 5000);
		}, 1500);
	});

	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function showMessage(text, type) {
		formMessage.textContent = text;
		formMessage.classList.remove("success", "error");
		formMessage.classList.add(type);
	}
});
