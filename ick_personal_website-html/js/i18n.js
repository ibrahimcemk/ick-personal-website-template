const lang = localStorage.getItem("lang") || "tr";

fetch(`data/${lang}.json`)
	.then(res => res.json())
	.then(texts => {
		document.querySelectorAll("[data-i18n]").forEach(el => {
			const key = el.getAttribute("data-i18n");
			el.textContent = texts[key];
		});
	});

function setLang(l) {
	localStorage.setItem("lang", l);
	location.reload();
}
