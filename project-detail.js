// Project Detail Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Particle Background
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            particles.forEach((particle, index) => {
                for (let j = index + 1; j < particles.length; j++) {
                    const dx = particles[j].x - particle.x;
                    const dy = particles[j].y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Hero Particles
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
        function createHeroParticle() {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.background = `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.2})`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            const duration = Math.random() * 10 + 10;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(0)',
                    opacity: 0
                },
                {
                    transform: `translate(${Math.random() * 200 - 100}px, ${-Math.random() * 200}px) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(${Math.random() * 400 - 200}px, ${-Math.random() * 400}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration * 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();

            heroParticles.appendChild(particle);
        }

        // Create particles periodically
        setInterval(createHeroParticle, 500);
    }

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate stats when visible
                if (entry.target.classList.contains('stat-card')) {
                    animateStatNumber(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.tech-card, .achievement-item, .gallery-item, .stat-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Animate stat numbers
    function animateStatNumber(card) {
        const numberElement = card.querySelector('.stat-number');
        if (numberElement) {
            const text = numberElement.textContent;
            const number = parseInt(text);
            const suffix = text.replace(number.toString(), '');
            let current = 0;
            const increment = number / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                numberElement.textContent = Math.floor(current) + suffix;
            }, 30);
        }
    }

    // Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            overlay.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <div class="lightbox-close">
                        <i class="fas fa-times"></i>
                    </div>
                    <div class="lightbox-caption">
                        <h3>${this.querySelector('h4').textContent}</h3>
                        <p>${this.querySelector('p').textContent}</p>
                    </div>
                </div>
            `;
            
            // Add lightbox styles
            const style = document.createElement('style');
            style.textContent = `
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    animation: fadeIn 0.3s ease forwards;
                }
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .lightbox-content img {
                    width: 100%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                .lightbox-close:hover {
                    transform: scale(1.1);
                }
                .lightbox-caption {
                    position: absolute;
                    bottom: -60px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    color: white;
                }
                .lightbox-caption h3 {
                    color: var(--primary-color);
                    margin-bottom: 5px;
                }
                @keyframes fadeIn {
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(overlay);
            
            // Close lightbox
            overlay.addEventListener('click', function() {
                overlay.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    document.head.removeChild(style);
                }, 300);
            });
            
            // Prevent image click from closing
            overlay.querySelector('img').addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.backdropFilter = 'blur(25px)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });

    // Add hover effect to tech cards
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });

    // Parallax effect for hero image
    const heroImage = document.querySelector('.project-hero-image');
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }

    console.log('Project detail page initialized successfully!');
});