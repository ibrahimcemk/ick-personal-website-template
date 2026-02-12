// Load and display blog posts
fetch("data/blog.json")
	.then(res => res.json())
	.then(posts => {
		const blogList = document.getElementById("blogList");
		if (!blogList) return;

		if (posts.length === 0) {
			blogList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Blog yazıları yakında eklenecek...</p>';
			return;
		}

		posts.forEach(post => {
			const article = document.createElement("article");
			article.className = "blog-card";
			article.innerHTML = `
				<img src="${post.image || "assets/images/blog-default.jpg"}" alt="${post.title}" />
				<div class="blog-content">
					<span class="blog-date">${post.date}</span>
					<h3>${post.title}</h3>
					<p>${post.summary}</p>
					<a href="${post.link || "#"}" class="blog-read-more">
						Devamını Oku
						<span>→</span>
					</a>
				</div>
			`;
			blogList.appendChild(article);
		});
	})
	.catch(error => {
		console.error("Error loading blog posts:", error);
		const blogList = document.getElementById("blogList");
		if (blogList) {
			blogList.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-light);">Blog yazıları yüklenirken hata oluştu.</p>';
		}
	});
