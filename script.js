/* ============================================
   JasonExecutor — Interactive Scripts
   Stars, Counters, FAQ, Code Tabs, Scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Star Particles Background
    // ==========================================
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Star {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.3;
            this.opacity = Math.random() * 0.6 + 0.1;
            this.baseOpacity = this.opacity;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleOffset = Math.random() * Math.PI * 2;
        }
        update(time) {
            this.opacity = this.baseOpacity + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.15;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`;
            ctx.fill();
        }
    }

    // Create stars
    const starCount = Math.min(200, Math.floor((window.innerWidth * window.innerHeight) / 8000));
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    let time = 0;
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time++;
        stars.forEach(star => {
            star.update(time);
            star.draw();
        });
        requestAnimationFrame(animateStars);
    }
    animateStars();

    // Update canvas height on scroll (for long pages)
    let resizeTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newHeight = document.documentElement.scrollHeight;
            if (canvas.height !== newHeight) {
                canvas.height = newHeight;
                // Redistribute stars
                stars.forEach(star => {
                    if (star.y > canvas.height) star.y = Math.random() * canvas.height;
                });
            }
        }, 200);
    });

    // ==========================================
    // Navbar Scroll Effect
    // ==========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // Mobile Nav Toggle
    // ==========================================
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // ==========================================
    // Animated Counters
    // ==========================================
    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);

            if (target >= 1000) {
                el.textContent = current.toLocaleString();
            } else {
                el.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // ==========================================
    // Intersection Observer — Counters & Reveals
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    // Counter observer
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => {
                    if (!counter.dataset.animated) {
                        counter.dataset.animated = 'true';
                        animateCounter(counter, parseInt(counter.dataset.count));
                    }
                });
            }
        });
    }, observerOptions);

    const statsSection = document.getElementById('stats');
    if (statsSection) counterObserver.observe(statsSection);

    // Stat bars
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.stat-bar-fill');
                bars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 300);
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    if (statsSection) barObserver.observe(statsSection);

    // Reveal on scroll
    const revealElements = document.querySelectorAll('.feature-card, .faq-item, .stat-card, .showcase-item');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ==========================================
    // Code Tabs
    // ==========================================
    const codeTabs = document.querySelectorAll('.code-tab');
    const codeContents = document.querySelectorAll('.code-content');

    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            codeTabs.forEach(t => t.classList.remove('active'));
            codeContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = document.getElementById('tab-' + targetTab);
            if (target) target.classList.add('active');
        });
    });

    // ==========================================
    // FAQ Accordion
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => i.classList.remove('open'));
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // ==========================================
    // Smooth scroll
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ==========================================
    // Download button effect
    // ==========================================
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Ripple
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(0,0,0,0.2);
                border-radius: 50%;
                width: 100px;
                height: 100px;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            downloadBtn.style.position = 'relative';
            downloadBtn.style.overflow = 'hidden';

            const rect = downloadBtn.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            downloadBtn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            downloadBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Download Starting...
            `;
            setTimeout(() => {
                downloadBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download for Windows
                `;
            }, 2000);
        });
    }

    // Ripple keyframe
    const style = document.createElement('style');
    style.textContent = `@keyframes ripple { to { transform: translate(-50%, -50%) scale(4); opacity: 0; } }`;
    document.head.appendChild(style);

});
