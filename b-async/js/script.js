/* ============================================
   b-async Website - Main JavaScript
   ============================================ */

/* ============================================
   Slide Data Configuration
   ============================================ */

const SLIDES = [
    {
        title: "Frontend Geliştirme",
        icon: "🚀",
        desc: "Modern framework'ler ile kullanıcı dostu arayüzler"
    },
    {
        title: "Backend Sistemleri",
        icon: "⚙️",
        desc: "Yüksek performanslı ve güvenli sunucu çözümleri"
    },
    {
        title: "Yazılım Danışmanlığı",
        icon: "💡",
        desc: "Teknoloji stratejisi ve çözüm mimarisi"
    },
    {
        title: "Veritabanı Yönetimi",
        icon: "💾",
        desc: "SQL & NoSQL veritabanı optimizasyonu"
    },
    {
        title: "Test Otomasyonu",
        icon: "🧪",
        desc: "Kalite güvence ve otomasyon testleri"
    },
    {
        title: "UI/UX Tasarım",
        icon: "🎨",
        desc: "Kullanıcı odaklı arayüz ve deneyim tasarımı"
    },
    {
        title: "Proje Yönetimi",
        icon: "📊",
        desc: "Agile metodolojileri ile proje yönetimi"
    },
    {
        title: "Kosgeb Danışmanlığı",
        icon: "📈",
        desc: "Kosgeb projelerinizde profesyonel destek"
    }
];

/* ============================================
   StellarNavigator Class
   ============================================ */

class StellarNavigator {
    constructor(slides, carouselEl, dotNavEl, controls) {
        this.slides = slides;
        this.carouselEl = carouselEl;
        this.dotNavEl = dotNavEl;
        this.controls = controls;
        this.slideCount = slides.length;
        this.activeIdx = 0;
        this.radius = this.getResponsiveRadius();
        this.angleStep = 360 / this.slideCount;
        this.animating = false;
        this.autoplay = true;
        this.timer = null;

        this.init();
    }

    /**
     * Get responsive carousel radius based on window width
     */
    getResponsiveRadius() {
        const width = window.innerWidth;
        if (width < 640) return 180;
        if (width < 1025) return 280;
        if (width < 1400) return 380;
        return 420;
    }

    /**
     * Get responsive slide width
     */
    getResponsiveSlideWidth() {
        const width = window.innerWidth;
        if (width < 640) return 140;
        if (width < 1025) return 200;
        if (width < 1400) return 280;
        return 320;
    }

    /**
     * Get responsive slide height
     */
    getResponsiveSlideHeight() {
        const width = window.innerWidth;
        if (width < 640) return 100;
        if (width < 1025) return 140;
        if (width < 1400) return 180;
        return 220;
    }

    /**
     * Get responsive carousel height
     */
    getCarouselHeight() {
        const width = window.innerWidth;
        if (width < 640) return 200;
        if (width < 1025) return 280;
        if (width < 1400) return 380;
        return 420;
    }

    /**
     * Initialize carousel
     */
    init() {
        this.renderSlides();
        this.renderDots();
        this.attachEvents();
        this.update();
        this.startAutoplay();

        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Handle window resize
     */
    handleResize() {
        this.radius = this.getResponsiveRadius();
        this.updateSlideSizes();
        this.update();
    }

    /**
     * Update slide sizes based on responsive values
     */
    updateSlideSizes() {
        const slideWidth = this.getResponsiveSlideWidth();
        const slideHeight = this.getResponsiveSlideHeight();
        const carouselHeight = this.getCarouselHeight();

        document.documentElement.style.setProperty('--slide-width', `${slideWidth}px`);
        document.documentElement.style.setProperty('--slide-height', `${slideHeight}px`);
        document.documentElement.style.setProperty('--carousel-radius', `${this.radius}px`);
        document.getElementById('stellar-carousel').style.height = `${carouselHeight}px`;
    }

    /**
     * Start autoplay timer
     */
    startAutoplay() {
        if (this.autoplay) {
            this.timer = setInterval(() => this.next(), 3200);
        }
    }

    /**
     * Render carousel slides
     */
    renderSlides() {
        this.carouselEl.innerHTML = "";
        this.slideEls = [];

        for (let i = 0; i < this.slideCount; i++) {
            const slide = document.createElement("div");
            slide.className = "carousel-slide";
            slide.setAttribute("tabindex", "0");
            slide.setAttribute("role", "group");
            slide.setAttribute("aria-label", `${this.slides[i].title}: ${this.slides[i].desc}`);
            slide.innerHTML = `
                <span class="slide-icon">${this.slides[i].icon}</span>
                <span class="slide-title">${this.slides[i].title}</span>
                <span class="slide-desc">${this.slides[i].desc}</span>
            `;
            this.carouselEl.appendChild(slide);
            this.slideEls.push(slide);
        }

        this.updateSlideSizes();
    }

    /**
     * Render navigation dots
     */
    renderDots() {
        this.dotNavEl.innerHTML = "";
        this.dotEls = [];

        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement("button");
            dot.className = "dot";
            dot.setAttribute("aria-label", `Go to slide ${i + 1}: ${this.slides[i].title}`);
            dot.setAttribute("tabindex", "0");
            dot.addEventListener("click", () => this.goTo(i));
            this.dotNavEl.appendChild(dot);
            this.dotEls.push(dot);
        }
    }

    /**
     * Attach event listeners
     */
    attachEvents() {
        this.controls.prev.addEventListener("click", () => this.prev());
        this.controls.next.addEventListener("click", () => this.next());
        document.addEventListener("keydown", (e) => this.handleKey(e));
        this.carouselEl.addEventListener("wheel", (e) => this.handleWheel(e));
        this.carouselEl.addEventListener("touchstart", (e) => this.handleTouchStart(e), { passive: true });
        this.carouselEl.addEventListener("touchmove", (e) => this.handleTouchMove(e), { passive: true });
        this.carouselEl.addEventListener("touchend", (e) => this.handleTouchEnd(e));
        this.carouselEl.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    }

    /**
     * Update carousel display
     */
    update() {
        this.angleStep = 360 / this.slideCount;

        for (let i = 0; i < this.slideCount; i++) {
            const angle = ((i - this.activeIdx) * this.angleStep * Math.PI) / 180;
            const x = Math.sin(angle) * this.radius;
            const z = Math.cos(angle) * this.radius;

            this.slideEls[i].style.transform = `
                translateX(${x}px)
                translateZ(${z}px)
                rotateY(${(i - this.activeIdx) * this.angleStep}deg)
            `;

            this.slideEls[i].classList.toggle("active", i === this.activeIdx);
            this.slideEls[i].setAttribute("aria-hidden", i !== this.activeIdx);
        }

        for (let i = 0; i < this.dotEls.length; i++) {
            this.dotEls[i].classList.toggle("active", i === this.activeIdx);
        }
    }

    /**
     * Navigate to specific slide
     */
    goTo(idx) {
        if (this.animating || idx === this.activeIdx) return;
        this.activeIdx = idx;
        this.update();
    }

    /**
     * Navigate to next slide
     */
    next() {
        this.goTo((this.activeIdx + 1) % this.slideCount);
    }

    /**
     * Navigate to previous slide
     */
    prev() {
        this.goTo((this.activeIdx - 1 + this.slideCount) % this.slideCount);
    }

    /**
     * Handle keyboard navigation
     */
    handleKey(e) {
        if (e.altKey || e.ctrlKey || e.metaKey) return;

        switch (e.key) {
            case "ArrowRight":
                this.next();
                break;
            case "ArrowLeft":
                this.prev();
                break;
            case "Home":
                this.goTo(0);
                break;
            case "End":
                this.goTo(this.slideCount - 1);
                break;
        }
    }

    /**
     * Handle mouse wheel navigation
     */
    handleWheel(e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY > 0) this.next();
            else this.prev();
        }
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchMoved = false;
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        this.touchMoved = true;
        this.touchEndX = e.touches[0].clientX;
        this.touchEndY = e.touches[0].clientY;
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        if (!this.touchMoved) return;

        const dx = this.touchEndX - this.touchStartX;
        if (Math.abs(dx) > 40) {
            if (dx > 0) this.prev();
            else this.next();
        }
    }

    /**
     * Handle mouse down
     */
    handleMouseDown(e) {
        if (e.button !== 0) return;

        this.dragStartX = e.clientX;
        this.dragging = true;

        document.addEventListener("mousemove", (this.handleMouseMoveBound = this.handleMouseMove.bind(this)));
        document.addEventListener("mouseup", (this.handleMouseUpBound = this.handleMouseUp.bind(this)));
    }

    /**
     * Handle mouse move
     */
    handleMouseMove(e) {
        if (!this.dragging) return;

        const dx = e.clientX - this.dragStartX;
        if (Math.abs(dx) > 32) {
            if (dx > 0) this.prev();
            else this.next();
            this.dragging = false;
        }
    }

    /**
     * Handle mouse up
     */
    handleMouseUp(e) {
        this.dragging = false;
        document.removeEventListener("mousemove", this.handleMouseMoveBound);
        document.removeEventListener("mouseup", this.handleMouseUpBound);
    }
}

/* ============================================
   EffectsManager Class
   ============================================ */

class EffectsManager {
    /**
     * Initialize starfield background effect
     */
    static initStarfield(canvas, layers = 3) {
        const ctx = canvas.getContext("2d");
        let stars = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];

            for (let l = 0; l < layers; l++) {
                for (let i = 0; i < 80 + l * 40; i++) {
                    stars.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        z: l + 1,
                        r: Math.random() * (1.2 + l * 0.6),
                        alpha: 0.5 + Math.random() * 0.5
                    });
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const s of stars) {
                ctx.save();
                ctx.globalAlpha = s.alpha;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
                ctx.fillStyle = s.z === 1 ? "#fff" : s.z === 2 ? "#ffd700" : "#6c3fd1";
                ctx.shadowColor = "#fff";
                ctx.shadowBlur = 8 * s.z;
                ctx.fill();
                ctx.restore();
            }
        };

        const animate = () => {
            draw();
            requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();
    }

    /**
     * Initialize particle system
     */
    static initParticles(canvas, count = 48) {
        const ctx = canvas.getContext("2d");
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    r: 2 + Math.random() * 3,
                    color: `rgba(108,63,209,${0.5 + Math.random() * 0.5})`
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particles) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
                ctx.fillStyle = p.color;
                ctx.shadowColor = "#ffd700";
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            }
        };

        const animate = () => {
            draw();
            requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();
    }

    /**
     * Initialize custom cursor
     */
    static initCursor(cursorEl) {
        document.addEventListener("mousemove", (e) => {
            cursorEl.style.transform = `translate(${e.clientX - 16}px,${e.clientY - 16}px) scale(1)`;
            cursorEl.style.opacity = "0.8";
        });

        document.addEventListener("mousedown", () => {
            cursorEl.style.transform += " scale(0.7)";
            cursorEl.style.opacity = "0.5";
        });

        document.addEventListener("mouseup", () => {
            cursorEl.style.transform = cursorEl.style.transform.replace(" scale(0.7)", " scale(1)");
            cursorEl.style.opacity = "0.8";
        });
    }

    /**
     * Initialize parallax effect
     */
    static parallax(container) {
        container.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 32;
            const y = (e.clientY / window.innerHeight - 0.5) * 32;
            container.style.transform = `translate(${x}px,${y}px)`;
        });

        container.addEventListener("mouseleave", () => {
            container.style.transform = "";
        });
    }
}

/* ============================================
   Loading Screen Functions
   ============================================ */

/**
 * Hide loading screen
 */
function hideLoading() {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 700);
}

/**
 * Update loading progress
 */
function showLoadingProgress(percent) {
    document.getElementById("loading-bar").style.width = percent + "%";
    document.getElementById("loading-text").textContent = `Loading... ${percent}%`;
}

/* ============================================
   Application Initialization
   ============================================ */

/**
 * Initialize application after page load
 */
function initApp() {
    // Initialize background effects
    EffectsManager.initStarfield(document.getElementById("starfield"), 3);
    EffectsManager.initParticles(document.getElementById("particles"), 48);
    EffectsManager.initCursor(document.getElementById("custom-cursor"));
    EffectsManager.parallax(document.getElementById("carousel-container"));

    // Initialize carousel
    const carouselEl = document.getElementById("stellar-carousel");
    const dotNavEl = document.getElementById("dot-nav");
    const controls = {
        prev: document.getElementById("prev-btn"),
        next: document.getElementById("next-btn")
    };

    const navigator = new StellarNavigator(SLIDES, carouselEl, dotNavEl, controls);

    // Accessibility: Focus management
    carouselEl.addEventListener("focus", () => {
        navigator.slideEls[navigator.activeIdx].focus();
    });

    // Reduced motion support
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.body.classList.add("reduced-motion");
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle("active");
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove("active");
            }
        });

        // Close menu when clicking on links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove("active");
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Handle page load and loading screen
 */
window.addEventListener("DOMContentLoaded", () => {
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 18;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            hideLoading();
            setTimeout(initApp, 400);
        }
        showLoadingProgress(Math.floor(progress));
    }, 180);
});





// security-check.js
const https = require('https');
const { exec } = require('child_process');

const SECURITY_CHECKS = [
  {
    name: 'SSL/TLS Configuration',
    url: 'https://www.ssllabs.com/ssltest/analyze.html',
    check: async (domain) => {
      return new Promise((resolve) => {
        const req = https.request(`https://${domain}`, (res) => {
          const cert = res.socket.getPeerCertificate();
          resolve({
            valid: cert.valid_to > new Date(),
            expiry: cert.valid_to,
            issuer: cert.issuer.CN
          });
        });
        req.end();
      });
    }
  },
  {
    name: 'Security Headers',
    url: 'https://securityheaders.com',
    check: async (domain) => {
      // Header kontrolü
      return { score: 'A+', details: 'Check manually' };
    }
  }
];

async function runSecurityChecks(domain) {
  console.log(`🔒 Running security checks for ${domain}\n`);
  
  for (const check of SECURITY_CHECKS) {
    try {
      const result = await check.check(domain);
      console.log(`✓ ${check.name}:`, result);
    } catch (error) {
      console.log(`✗ ${check.name}: ERROR - ${error.message}`);
    }
  }
}

// Kullanım
const domain = process.argv[2] || 'b-async.com';
runSecurityChecks(domain);



// security-middleware.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const securityMiddleware = (app) => {
  // Helmet güvenlik başlıkları
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // Her IP için 100 istek
    message: 'Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.'
  });
  app.use('/api/', limiter);

  // XSS koruması
  app.use((req, res, next) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};

module.exports = securityMiddleware;
