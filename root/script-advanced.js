// Advanced Animations JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    const loaderPercentage = document.querySelector('.loader-percentage');
    let loadingProgress = 0;

    const loadingInterval = setInterval(() => {
        loadingProgress += Math.random() * 15;
        if (loadingProgress >= 100) {
            loadingProgress = 100;
            loaderPercentage.textContent = '100%';
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                initializeWebsite();
            }, 500);
            clearInterval(loadingInterval);
        } else {
            loaderPercentage.textContent = Math.floor(loadingProgress) + '%';
        }
    }, 100);

    function initializeWebsite() {
        // Show navbar with animation
        setTimeout(() => {
            document.getElementById('navbar').classList.add('visible');
        }, 300);

        // Initialize all animations
        initNavigation();
        initScrollAnimations();
        initSkillsTabs();
        initParticleEffects();
        init3DFloating();
        initProgressBars();
        initHoverEffects();
        initTypingEffect();
        initRippleEffects();
        initParallaxEffects();
        initTimelineAnimations();
    }
    

    // Navigation
    function initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        navToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Active link highlighting
        window.addEventListener('scroll', function () {
            const sections = document.querySelectorAll('section[id]');
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // Scroll Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated', 'visible');

                    // Trigger specific animations
                    if (entry.target.classList.contains('stat-card')) {
                        animateStatCard(entry.target);
                    }

                    if (entry.target.classList.contains('skill-card')) {
                        animateSkillCard(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        const animateElements = document.querySelectorAll('.animate-on-scroll, .timeline-item, .project-card, .education-card, .cert-card, .stat-card, .skill-card');
        animateElements.forEach(el => {
            observer.observe(el);
        });

        // Observe sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Skills Tabs
    function initSkillsTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                const targetTab = this.getAttribute('data-tab');

                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                // Add active class to clicked button and corresponding pane
                this.classList.add('active');
                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add('active');
                    // Animate skill bars in the active tab
                    setTimeout(() => {
                        const skillCards = targetPane.querySelectorAll('.skill-card');
                        skillCards.forEach(card => animateSkillCard(card));
                    }, 300);
                }
            });
        });
    }

    // Particle Effects
    function initParticleEffects() {
        // Hero particles
        const heroParticles = document.getElementById('heroParticles');
        if (heroParticles) {
            for (let i = 0; i < 50; i++) {
                createParticle(heroParticles);
            }
        }

        // Canvas particles
        const canvas = document.getElementById('particleCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];
            const particleCount = 100;

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 1;
                    this.speedX = Math.random() * 2 - 1;
                    this.speedY = Math.random() * 2 - 1;
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

        // Footer particles
        const footerParticles = document.querySelector('.footer-particles');
        if (footerParticles) {
            for (let i = 0; i < 20; i++) {
                createParticle(footerParticles, true);
            }
        }
    }

    function createParticle(container, small = false) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = small ? '2px' : '4px';
        particle.style.height = small ? '2px' : '4px';
        particle.style.background = `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.2})`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        const duration = small ? (Math.random() * 10 + 10) : (Math.random() * 15 + 15);
        const delay = Math.random() * 5;

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
            delay: delay * 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();

        container.appendChild(particle);
    }

    // 3D Floating Elements
    function init3DFloating() {
        const floatingElements = document.querySelectorAll('.float-3d');

        window.addEventListener('mousemove', function (e) {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

            floatingElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const x = mouseX * 30 * speed;
                const y = mouseY * 30 * speed;

                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Progress Bars Animation
    function initProgressBars() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const value = parseInt(card.dataset.value);
            const progressFill = card.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.setProperty('--progress', value + '%');
            }
        });
    }

    function animateStatCard(card) {
        const numberElement = card.querySelector('.stat-number');
        const target = parseInt(card.dataset.value);
        const progressFill = card.querySelector('.progress-fill');

        if (numberElement && target) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                numberElement.textContent = Math.floor(current);
            }, 30);
        }

        if (progressFill) {
            setTimeout(() => {
                progressFill.style.width = 'var(--progress, 100%)';
            }, 200);
        }
    }

    function animateSkillCard(card) {
        const skillLevel = parseInt(card.dataset.skill);
        const progressBar = card.querySelector('.skill-progress');

        if (progressBar && skillLevel) {
            setTimeout(() => {
                progressBar.style.width = skillLevel + '%';
            }, 200);
        }

        // Create skill particles
        const particlesContainer = card.querySelector('.skill-particles');
        if (particlesContainer) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createSkillParticle(particlesContainer);
                }, i * 100);
            }
        }
    }

    function createSkillParticle(container) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = '#a855f7';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';

        const startX = Math.random() * 100;
        const startY = 100;

        particle.style.left = startX + '%';
        particle.style.top = startY + '%';

        particle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${Math.random() * 100 - 50}px, ${-Math.random() * 100 + 50}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 2000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();

        container.appendChild(particle);
    }

    // Hover Effects
    function initHoverEffects() {
        // Project cards hover effect
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-15px) scale(1.03) rotateX(5deg)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1) rotateX(0)';
            });
        });

        // Contact items hover effect
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                const icon = this.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                }
            });

            item.addEventListener('mouseleave', function () {
                const icon = this.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0)';
                }
            });
        });
    }

    // Typing Effect
    function initTypingEffect() {
        const letterElements = document.querySelectorAll('.letter-animate');
        letterElements.forEach((letter, index) => {
            const delay = parseInt(letter.dataset.delay) || 0;
            setTimeout(() => {
                letter.style.animationDelay = delay + 'ms';
            }, 100);
        });
    }

    // Ripple Effects
    function initRippleEffects() {
        // Button ripples
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                const ripple = this.querySelector('.btn-ripple');
                if (ripple) {
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;

                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';

                    setTimeout(() => {
                        ripple.style.width = ripple.style.height = '0';
                    }, 600);
                }
            });
        });

        // Social link ripples
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const ripple = this.querySelector('.social-ripple');
                if (ripple) {
                    ripple.style.transform = 'translate(-50%, -50%) scale(2)';
                    setTimeout(() => {
                        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
                    }, 600);
                }
            });
        });
    }

    // Parallax Effects
    function initParallaxEffects() {
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.bg-layer');

            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });

            // Navbar background on scroll
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (scrolled > 50) {
                    navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                    navbar.style.backdropFilter = 'blur(25px)';
                } else {
                    navbar.style.background = 'rgba(15, 23, 42, 0.8)';
                    navbar.style.backdropFilter = 'blur(20px)';
                }
            }
        });
    }

    // Timeline Animations
    function initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        const timelineObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const content = entry.target.querySelector('.timeline-content');
                    const date = entry.target.querySelector('.timeline-date');

                    if (content) {
                        content.style.animation = 'slideInFromSide 0.8s ease forwards';
                    }

                    if (date) {
                        date.style.animation = 'scaleIn 0.6s ease forwards';
                    }
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromSide {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: translateX(-50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) scale(1);
            }
        }

        .timeline-item:nth-child(odd) .timeline-content {
            animation-name: slideInFromRight;
        }

        @keyframes slideInFromRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Smooth scroll behavior for anchor links
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

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function () {
            this.style.animation = 'fadeIn 0.5s ease';
        });
    });

    // Performance optimization - throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function () {
            // Scroll-based animations here
        });
    });


    

    // Initialize tooltips or other interactive elements
    console.log('Advanced portfolio animations initialized successfully!');
});