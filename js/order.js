// Package data with pricing
const packages = {
	starter: {
		name: "Başlangıç Paketi",
		price: 2999,
	},
	professional: {
		name: "Profesyonel Paketi",
		price: 7999,
	},
	enterprise: {
		name: "Kurumsal Paketi",
		price: 15999,
	},
};

const addOns = {
	// Design
	ui: 3500,
	logo: 2500,
	illustration: 2000,
	// Development
	api: 2500,
	database: 2000,
	payment: 3000,
	// SEO & Marketing
	seo: 1500,
	analytics: 1000,
	social: 1500,
	// Support
	maintenance: 3000,
	hosting: 2500,
	training: 1500,
};

document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("orderForm");
	const packageBtns = document.querySelectorAll(".btn-select-package");
	const selectedPackageInput = document.getElementById("selectedPackage");
	const budgetInput = document.getElementById("budget");
	const extraOptions = document.querySelectorAll('input[name^="extra"]');

	let selectedPackage = null;

	// Package selection
	packageBtns.forEach(btn => {
		btn.addEventListener("click", function (e) {
			e.preventDefault();
			const packageType = this.dataset.package;
			selectedPackage = packageType;
			selectedPackageInput.value = packages[packageType].name;

			// Update active state
			packageBtns.forEach(b => b.classList.remove("active"));
			this.classList.add("active");

			// Recalculate budget
			calculateBudget();

			// Smooth scroll to form
			form.scrollIntoView({ behavior: "smooth", block: "start" });
		});
	});

	// Calculate budget on add-on changes
	extraOptions.forEach(option => {
		option.addEventListener("change", calculateBudget);
	});

	function calculateBudget() {
		if (!selectedPackage) {
			budgetInput.value = "₺0";
			return;
		}

		let total = packages[selectedPackage].price;
		extraOptions.forEach(option => {
			if (option.checked) {
				const key = option.value;
				if (addOns[key]) total += addOns[key];
			}
		});

		budgetInput.value = `₺${total.toLocaleString("tr-TR")}`;
	}

	// Form validation and submission
	if (form) {
		form.addEventListener("submit", function (e) {
			e.preventDefault();

			// Validation
			if (!selectedPackage) {
				showMessage("Lütfen bir paket seçiniz", "error");
				return;
			}

			const name = document.getElementById("orderName").value.trim();
			const email = document.getElementById("orderEmail").value.trim();
			const phone = document.getElementById("orderPhone").value.trim();
			const projectTitle = document.getElementById("projectTitle").value.trim();
			const projectDesc = document.getElementById("projectDesc").value.trim();
			const agreeTerms = document.getElementById("agreeTerms").checked;

			if (!name || name.length < 3) {
				showMessage("Adınız en az 3 karakter olmalıdır", "error");
				return;
			}

			if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
				showMessage("Geçerli bir email adresi giriniz", "error");
				return;
			}

			if (!projectTitle || projectTitle.length < 3) {
				showMessage("Proje adı en az 3 karakter olmalıdır", "error");
				return;
			}

			if (!projectDesc || projectDesc.length < 20) {
				showMessage("Proje açıklaması en az 20 karakter olmalıdır", "error");
				return;
			}

			if (!agreeTerms) {
				showMessage("Şartları kabul etmelisiniz", "error");
				return;
			}

			// Submit logic (simulate backend call)
			const submitBtn = form.querySelector('button[type="submit"]');
			const originalText = submitBtn.innerHTML;
			submitBtn.disabled = true;
			submitBtn.innerHTML = '<span class="btn-text">Gönderiliyor...</span>';

			setTimeout(() => {
				// Success
				showMessage("✓ Siparişiniz başarıyla kaydedildi! En kısa sürede sizinle iletişime geçeceğiz.", "success");
				form.reset();
				selectedPackageInput.value = "";
				selectedPackage = null;
				budgetInput.value = "₺0";
				packageBtns.forEach(b => b.classList.remove("active"));

				submitBtn.disabled = false;
				submitBtn.innerHTML = originalText;

				// Scroll to message
				document.getElementById("orderFormMessage").scrollIntoView({ behavior: "smooth" });
			}, 1200);
		});
	}

	function showMessage(text, type) {
		const msgEl = document.getElementById("orderFormMessage");
		msgEl.textContent = text;
		msgEl.className = `form-message ${type}`;
		msgEl.style.display = "block";

		// Auto-hide error after 5 seconds
		if (type === "error") {
			setTimeout(() => {
				msgEl.style.display = "none";
			}, 5000);
		}
	}

	// Animate form visibility on scroll (using existing animations.js)
	const formInputs = document.querySelectorAll(".order-form .form-group");
	formInputs.forEach((inp, i) => {
		inp.style.animationDelay = `${i * 50}ms`;
	});

	// Update progress steps dynamically
	function updateProgressSteps() {
		const selectedPackage = document.getElementById("selectedPackage").value;
		const name = document.getElementById("orderName").value.trim();
		const email = document.getElementById("orderEmail").value.trim();
		const projectTitle = document.getElementById("projectTitle").value.trim();
		const projectDesc = document.getElementById("projectDesc").value.trim();
		const steps = document.querySelectorAll(".progress-step");

		// Step 1: Contact info (active if package and name/email filled)
		if (selectedPackage && name && email) {
			steps[0].classList.add("active");
		} else {
			steps[0].classList.remove("active");
		}

		// Step 2: Project info (active if step 1 complete + project filled)
		if (projectTitle && projectDesc && steps[0].classList.contains("active")) {
			steps[1].classList.add("active");
		} else {
			steps[1].classList.remove("active");
		}

		// Step 3: Services (active if step 2 complete)
		if (steps[1].classList.contains("active")) {
			steps[2].classList.add("active");
		} else {
			steps[2].classList.remove("active");
		}

		// Step 4: Final (active if all previous + terms agreement)
		const agreeTerms = document.getElementById("agreeTerms").checked;
		if (steps[2].classList.contains("active") && agreeTerms) {
			steps[3].classList.add("active");
		} else {
			steps[3].classList.remove("active");
		}
	}

	// Monitor form field changes for progress
	const trackingInputs = ["selectedPackage", "orderName", "orderEmail", "projectTitle", "projectDesc", "agreeTerms"];

	trackingInputs.forEach(id => {
		const el = document.getElementById(id);
		if (el) {
			if (el.type === "checkbox") {
				el.addEventListener("change", updateProgressSteps);
			} else {
				el.addEventListener("input", updateProgressSteps);
			}
		}
	});

	// Initial progress update
	updateProgressSteps();
});
