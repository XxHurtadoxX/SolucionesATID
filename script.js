// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryModal = document.getElementById('gallery-modal');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const modalClose = document.querySelector('.modal-close');
const filterBtns = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');
const statNumbers = document.querySelectorAll('.stat-number');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// Navigation Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active navigation link
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            // Solo aplicar lógica de navegación activa a enlaces internos (que empiecen con #)
            if (link.getAttribute('href').startsWith('#')) {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Solo aplicar smooth scrolling a enlaces internos (que empiecen con #)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // Para enlaces externos como catalogo.html, dejar el comportamiento normal
        });
    });

    // Initialize animations
    initializeAnimations();
    
    // Initialize counter animation
    initializeCounters();
    
    // Initialize gallery
    initializeGallery();
    
    // Initialize contact form
    initializeContactForm();
    
    // Back to top button
    initializeBackToTop();
});

// Animation on Scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .feature, .contact-item');
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Specific animations for different sections
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    
    if (aboutText) {
        aboutText.classList.add('slide-in-left');
        observer.observe(aboutText);
    }
    
    if (aboutImage) {
        aboutImage.classList.add('slide-in-right');
        observer.observe(aboutImage);
    }
}

// Counter Animation
function initializeCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 16);
}

// Gallery Functionality
function initializeGallery() {
    // Gallery filter
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Gallery modal
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4').textContent;
            const description = item.querySelector('p').textContent;
            
            modalImage.src = img.src;
            modalCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
            galleryModal.style.display = 'block';
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeModal);
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && galleryModal.style.display === 'block') {
            closeModal();
        }
    });
}

function closeModal() {
    galleryModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Contact Form
function initializeContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (validateForm(data)) {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Envío por Formspree (email)
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showNotification('¡Mensaje enviado correctamente! Te responderemos por email pronto.', 'success');
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwnProperty.call(data, 'errors')) {
                            showNotification('Error al enviar: ' + data["errors"].map(error => error["message"]).join(", "), 'error');
                        } else {
                            showNotification('¡Mensaje enviado correctamente! Te responderemos por email pronto.', 'success');
                            contactForm.reset();
                        }
                    });
                }
            }).catch(error => {
                showNotification('Error de conexión. Por favor intenta nuevamente.', 'error');
            }).finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        }
    });
}

function validateForm(data) {
    const errors = [];
    
    if (!data.nombre.trim()) {
        errors.push('El nombre es requerido');
    }
    
    if (!data.email.trim()) {
        errors.push('El email es requerido');
    } else if (!isValidEmail(data.email)) {
        errors.push('El email no es válido');
    }
    
    if (!data.servicio) {
        errors.push('Debe seleccionar un servicio');
    }
    
    if (!data.mensaje.trim()) {
        errors.push('El mensaje es requerido');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        max-width: 400px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: flex-start;
        gap: 15px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Back to Top Button
function initializeBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    const heroBackground = document.querySelector('.hero-background img');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Preload Critical Images
function preloadCriticalImages() {
    const criticalImages = [
        'https://i.imgur.com/jh6sUj1.jpeg',
        'https://i.imgur.com/e9N9a29.png',
        'https://i.imgur.com/stMXgIu.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadCriticalImages();

// Service Card Interactions
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.service-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.service-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Smooth reveal animations for better UX
function initializeRevealAnimations() {
    const revealElements = document.querySelectorAll('.about-text, .service-card, .contact-info, .contact-form');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
}

// Initialize reveal animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeRevealAnimations, 100);
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(() => {
            // Execute scroll handlers
        });
    });
    
    // Optimize animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
    }
});

// Error handling for failed resource loads
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Failed to load image:', e.target.src);
        e.target.style.display = 'none';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Gallery navigation with arrow keys
    if (galleryModal.style.display === 'block') {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            // Implementation for gallery navigation
            e.preventDefault();
        }
    }
});

// Initialize tooltips for interactive elements
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(11, 13, 17, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}
