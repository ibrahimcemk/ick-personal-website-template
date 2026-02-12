// ===== MODERN PORTFOLIO ANIMATION SYSTEM =====

// Particle System
class ParticleSystem {
	constructor(container) {
		this.container = container;
		this.particles = [];
		this.maxParticles = 50;
		this.init();
	}

	init() {
		for (let i = 0; i < this.maxParticles; i++) {
			this.createParticle();
		}
	}

	createParticle() {
		const particle = document.createElement('div');
		particle.className = 'particle';
		
		// Random position and animation delay
		const startX = Math.random() * window.innerWidth;
		const delay = Math.random() * 5;
		const duration = 3 + Math.random() * 2;
		
		particle.style.left = startX + 'px';
		particle.style.animationDelay = delay + 's';
		particle.style.animationDuration = duration + 's';
		
		this.container.appendChild(particle);
		this.particles.push(particle);
	}
}

// Enhanced Typing Animation
class TypingAnimation {
	constructor() {
		this.typingElements = document.querySelectorAll('.typing-title');
		this.init();
	}

	init() {
		this.typingElements.forEach(element => {
			const textElement = element.querySelector('.typing-text');
			const cursorElement = element.querySelector('.typing-cursor');
			
			if (textElement && cursorElement) {
				// Optimized text with better flow
				const text = "Web Geliştirici & GrafikTasarımcısı";
				this.typeText(textElement, cursorElement, text, 0);
			}
		});
	}

	typeText(element, cursor, text, index) {
		if (index < text.length) {
			element.textContent += text.charAt(index);
			
			// Variable typing speed for natural effect
			const baseSpeed = 100;
			const speed = text.charAt(index) === ' ' ? baseSpeed * 2 : 
						  text.charAt(index) === '&' ? baseSpeed * 3 : baseSpeed;
			
			setTimeout(() => {
				this.typeText(element, cursor, text, index + 1);
			}, speed);
		} else {
			// Start deletion after a pause
			setTimeout(() => {
				this.deleteText(element, cursor, text);
			}, 3000);
		}
	}

	deleteText(element, cursor, text) {
		if (element.textContent.length > 0) {
			element.textContent = element.textContent.slice(0, -1);
			setTimeout(() => {
				this.deleteText(element, cursor, text);
			}, 50);
		} else {
			// Restart typing after a pause
			setTimeout(() => {
				this.typeText(element, cursor, text, 0);
			}, 1000);
		}
	}
}

// Scroll Animation System
class ScrollAnimationSystem {
	constructor() {
		this.animatedElements = [];
		this.init();
	}

	init() {
		this.setupIntersectionObserver();
		this.setupStaggerAnimations();
	}

	setupIntersectionObserver() {
		const options = {
			root: null,
			rootMargin: '0px 0px -50px 0px',
			threshold: 0.1
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry, index) => {
				if (entry.isIntersecting) {
					const element = entry.target;
					const delay = element.dataset.delay || 0;
					
					setTimeout(() => {
						element.classList.add('animate');
					}, delay);
					
					observer.unobserve(element);
				}
			});
		}, options);

		// Observe all elements with animation classes
		document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right, .animate-on-scroll-scale').forEach(element => {
			observer.observe(element);
		});
	}

	setupStaggerAnimations() {
		// Setup stagger delays for skill cards
		const skillCards = document.querySelectorAll('.skill-card');
		skillCards.forEach((card, index) => {
			card.dataset.delay = (index * 100) + 'ms';
		});

		// Setup stagger delays for project cards
		const projectCards = document.querySelectorAll('.card');
		projectCards.forEach((card, index) => {
			card.dataset.delay = (index * 150) + 'ms';
		});
	}
}

// Counter Animation System
class CounterAnimation {
	constructor() {
		this.counters = [];
		this.init();
	}

	init() {
		this.setupCounters();
	}

	setupCounters() {
		const counterElements = document.querySelectorAll('[data-target]');
		
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const counter = entry.target;
					this.animateCounter(counter);
					observer.unobserve(counter);
				}
			});
		}, { threshold: 0.5 });

		counterElements.forEach(counter => {
			observer.observe(counter);
		});
	}

	animateCounter(element) {
		const target = parseInt(element.dataset.target);
		const duration = 2000; // 2 seconds
		const step = target / (duration / 16); // 60fps
		let current = 0;

		const timer = setInterval(() => {
			current += step;
			if (current >= target) {
				current = target;
				clearInterval(timer);
			}
			
			// Add formatting for percentages
			if (element.dataset.target === '100') {
				element.textContent = Math.floor(current) + '%';
			} else if (element.dataset.target === '50') {
				element.textContent = Math.floor(current) + '+';
			} else {
				element.textContent = Math.floor(current) + '+';
			}
		}, 16);
	}
}

// Scroll to Top Button
class ScrollToTop {
	constructor() {
		this.button = document.getElementById('scrollToTop');
		this.init();
	}

	init() {
		if (!this.button) return;

		// Show/hide button based on scroll position
		window.addEventListener('scroll', () => {
			if (window.pageYOffset > 300) {
				this.button.classList.add('visible');
			} else {
				this.button.classList.remove('visible');
			}
		});

		// Smooth scroll to top
		this.button.addEventListener('click', () => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});

		// Keyboard accessibility
		this.button.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.button.click();
			}
		});
	}
}

// Magnetic Hover Effect
class MagneticHover {
	constructor() {
		this.init();
	}

	init() {
		const magneticElements = document.querySelectorAll('.magnetic-hover');
		
		magneticElements.forEach(element => {
			element.addEventListener('mousemove', (e) => {
				this.handleMouseMove(e, element);
			});

			element.addEventListener('mouseleave', () => {
				this.handleMouseLeave(element);
			});
		});
	}

	handleMouseMove(e, element) {
		const rect = element.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;
		
		const distance = Math.sqrt(x * x + y * y);
		const maxDistance = 100;
		const strength = Math.max(0, 1 - distance / maxDistance);
		
		const moveX = x * strength * 0.3;
		const moveY = y * strength * 0.3;
		
		element.style.transform = `translate(${moveX}px, ${moveY}px)`;
	}

	handleMouseLeave(element) {
		element.style.transform = 'translate(0, 0)';
	}
}

// Initialize all animation systems
document.addEventListener('DOMContentLoaded', () => {
	// Initialize particle system
	const particleContainer = document.getElementById('particleContainer');
	if (particleContainer) {
		new ParticleSystem(particleContainer);
	}

	// Initialize typing animation
	new TypingAnimation();

	// Initialize scroll animations
	new ScrollAnimationSystem();

	// Initialize counter animations
	new CounterAnimation();

	// Initialize magnetic hover effects
	new MagneticHover();

	// Initialize scroll to top button
	new ScrollToTop();

	// Add parallax effect to hero banner
	const heroBanner = document.querySelector('.hero-banner');
	if (heroBanner) {
		window.addEventListener('scroll', () => {
			const scrolled = window.pageYOffset;
			const parallax = scrolled * 0.5;
			heroBanner.style.transform = `translateY(${parallax}px)`;
		});
	}
});
