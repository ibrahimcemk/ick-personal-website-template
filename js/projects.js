let allProjects = [];
let currentFilter = "all";
let isLoading = false;

// Performance utilities
const debounce = (func, wait) => {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

const throttle = (func, limit) => {
	let inThrottle;
	return function(...args) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
		}
	};
};

// Intersection Observer for lazy loading
const setupIntersectionObserver = () => {
	const observerOptions = {
		root: null,
		rootMargin: '50px',
		threshold: 0.1
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('fade-in');
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observe project cards
	document.querySelectorAll('.card').forEach(card => {
		observer.observe(card);
	});

	return observer;
};

// Load projects data with error handling and loading state
async function loadProjects() {
	const featuredGrid = document.getElementById("featuredGrid");
	if (featuredGrid) {
		featuredGrid.innerHTML = '<div class="loading-spinner" aria-live="polite">Projeler yükleniyor...</div>';
	}

	try {
		isLoading = true;
		const response = await fetch("data/projects.json");
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		allProjects = data;
		
		displayProjects("all");
		setupFilters();
		setupFeaturedProjects();
		
		// Setup intersection observer after projects are loaded
		setupIntersectionObserver();
		
	} catch (error) {
		console.error("Error loading projects:", error);
		
		// Show error message to user
		if (featuredGrid) {
			featuredGrid.innerHTML = `
				<div class="error-message" role="alert">
					<p>Projeler yüklenirken bir hata oluştu.</p>
					<button onclick="loadProjects()" class="btn btn-dark" aria-label="Projeleri yeniden yükle">Tekrar Dene</button>
				</div>
			`;
		}
	} finally {
		isLoading = false;
	}
}

// Image lazy loading with error handling
const setupLazyLoading = () => {
	const imageOptions = {
		root: null,
		rootMargin: '50px',
		threshold: 0.1
	};

	const imageObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				
				// Load image
				if (img.dataset.src) {
					img.src = img.dataset.src;
					img.removeAttribute('data-src');
				}
				
				// Add fade-in effect
				img.style.opacity = '0';
				img.onload = () => {
					img.style.transition = 'opacity 0.3s ease';
					img.style.opacity = '1';
				};
				
				imageObserver.unobserve(img);
			}
		});
	}, imageOptions);

	// Observe all images with data-src
	document.querySelectorAll('img[data-src]').forEach(img => {
		imageObserver.observe(img);
	});

	return imageObserver;
};

// Enhanced image error handling with debugging
const handleImageError = (img, projectName) => {
	console.log(`Image failed to load for project: ${projectName}, src: ${img.src}`);
	
	if (!img.src.includes('placeholder')) {
		img.src = 'assets/images/placeholder.jpg';
		img.alt = `${projectName} projesinin görseli mevcut değil`;
		img.onerror = null; // Prevent infinite loop
		
		// Add error class for styling
		img.classList.add('image-error');
	}
};

// Setup image error handling for all images
const setupImageErrorHandling = () => {
	document.querySelectorAll('img').forEach(img => {
		if (!img.dataset.errorHandled) {
			img.onerror = () => {
				const projectName = img.alt || 'Proje';
				handleImageError(img, projectName);
			};
			img.dataset.errorHandled = 'true';
		}
	});
};

// Initialize image optimizations
document.addEventListener('DOMContentLoaded', () => {
	setupLazyLoading();
	setupImageErrorHandling();
	loadProjects(); // Load projects after image setup
});

// Display projects based on filter
function displayProjects(filter) {
	const grid = document.getElementById("projectsGrid");
	if (!grid) return; // Return if not on projects page

	currentFilter = filter;
	grid.innerHTML = "";

	const filtered = filter === "all" ? allProjects : allProjects.filter(p => p.category === filter);

	filtered.forEach((project, index) => {
		const div = document.createElement("div");
		div.className = "project-item card show";
		div.innerHTML = `
			<div class="card-body">
				<img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;">
				<h3>${project.title}</h3>
				<p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 12px;">
					<strong>Kategorisi:</strong> ${project.category}
				</p>
				<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
					${project.tech.map(t => `<span class="tech-badge">${t}</span>`).join("")}
				</div>
				<p style="margin-bottom: 16px;">${project.description}</p>
				<button class="btn btn-dark" onclick="openModal(${index})">Detayları Gör</button>
			</div>
		`;
		grid.appendChild(div);
	});
}

// Setup filter buttons
function setupFilters() {
	const filterBtns = document.querySelectorAll(".filter-btn");
	filterBtns.forEach(btn => {
		btn.addEventListener("click", function () {
			filterBtns.forEach(b => b.classList.remove("active"));
			this.classList.add("active");
			displayProjects(this.dataset.filter);
		});
	});
}

// Display featured projects on home page with lazy loading
function setupFeaturedProjects() {
	const featured = document.getElementById("featuredGrid");
	if (!featured) return; // Return if not on home page

	if (allProjects.length === 0) {
		featured.innerHTML = '<p class="text-muted">Henüz proje eklenmemiş.</p>';
		return;
	}

	const topProjects = allProjects.slice(0, 3);
	featured.innerHTML = ''; // Clear loading spinner

	topProjects.forEach((project, index) => {
		const div = document.createElement("div");
		div.className = "card";
		
		// Use placeholder image if project image doesn't exist
		const imageUrl = project.image || 'assets/images/placeholder.jpg';
		
		div.innerHTML = `
			<div class="project-image-container">
				<img src="${imageUrl}" alt="${project.title}" 
					 style="width: 100%; height: 200px; object-fit: cover;" 
					 loading="lazy" 
					 onerror="this.src='assets/images/placeholder.jpg'; this.alt='Proje görseli mevcut değil'">
			</div>
			<div class="card-body">
				<h3>${project.title}</h3>
				<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
					${project.tech.map(t => `<span class="tech-badge" style="font-size: 0.8rem;">${t}</span>`).join("")}
				</div>
				<p style="margin-bottom: 16px;">${project.description}</p>
				<div class="project-links">
					<a href="${project.live}" target="_blank" class="btn btn-dark" style="width: 48%; display: inline-block;">Canlı Demo</a>
					<a href="${project.code}" target="_blank" class="btn btn-outline-dark" style="width: 48%; display: inline-block; margin-left: 4%;">Kodu İncele</a>
				</div>
			</div>
		`;
		
		// Add animation delay for staggered effect
		div.style.animationDelay = `${index * 0.1}s`;
		div.classList.add('fade-in');
		
		featured.appendChild(div);
		
		// Setup image error handling for this specific image
		const img = div.querySelector('img');
		img.onerror = () => {
			handleImageError(img, project.title);
		};
	});
}

// Modal functions - Safe implementation
function openModal(index) {
	const project = allProjects[index];
	if (!project) {
		console.error('Project not found at index:', index);
		return;
	}

	// Check if modal elements exist
	const modalTitle = document.getElementById("modalTitle");
	const modalImage = document.getElementById("modalImage");
	const modalDesc = document.getElementById("modalDesc");
	const modalTech = document.getElementById("modalTech");
	const modalLink = document.getElementById("modalLink");
	const modalCode = document.getElementById("modalCode");
	const modal = document.getElementById("projectModal");

	if (!modal || !modalTitle || !modalImage || !modalDesc || !modalTech || !modalLink || !modalCode) {
		console.warn('Modal elements not found - redirecting to project page');
		// Fallback: redirect to project live URL
		if (project.live) {
			window.open(project.live, '_blank');
		}
		return;
	}

	// Set modal content
	modalTitle.textContent = project.title;
	modalImage.src = project.image;
	modalImage.alt = project.title;
	modalDesc.textContent = project.description;
	
	modalTech.innerHTML = project.tech.map(t => `<span class="tech-badge">${t}</span>`).join("");
	
	modalLink.href = project.live;
	modalCode.href = project.code;

	// Show modal with animation
	modal.classList.add("show");
	modal.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = "hidden";
	
	// Focus management
	modalTitle.focus();
}

function closeModal() {
	const modal = document.getElementById("projectModal");
	if (!modal) return;

	modal.classList.remove("show");
	modal.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = "auto";
}

// Keyboard navigation for modal
document.addEventListener('keydown', function(event) {
	const modal = document.getElementById("projectModal");
	if (modal && modal.classList.contains("show")) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
});

// Initialize modal event listeners safely
function initializeModal() {
	const closeBtn = document.querySelector(".close");
	const modal = document.getElementById("projectModal");

	if (closeBtn) {
		closeBtn.addEventListener("click", closeModal);
	}

	if (modal) {
		modal.addEventListener("click", function (event) {
			if (event.target === modal) {
				closeModal();
			}
		});
	}
}

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', initializeModal);
