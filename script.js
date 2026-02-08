// ========================================
// VARIABLES GLOBALES
// ========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
let secretClickCount = 0;
let secretClickTimer = null;

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeProgressBar();
    initializeKonamiCode();
    initializeFilters();
    initializeAnimations();
    initializeSecretEasterEggs();
});

// ========================================
// NAVIGATION
// ========================================
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animation du burger
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translateY(8px)' : '';
            spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translateY(-8px)' : '';
        });
    }
    
    // Fermer le menu au clic sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });
}

// ========================================
// READING PROGRESS BAR
// ========================================
function initializeProgressBar() {
    const progressBar = document.getElementById('reading-progress');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.pageYOffset;
            const progress = (scrolled / documentHeight) * 100;
            
            progressBar.style.width = progress + '%';
        });
    }
}

// ========================================
// KONAMI CODE EASTER EGG
// ========================================
function initializeKonamiCode() {
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activateKonamiEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateKonamiEasterEgg() {
    const easterEgg = document.getElementById('konami-easter-egg');
    
    if (easterEgg) {
        easterEgg.classList.remove('hidden');
        
        // Effet visuel sur toute la page
        document.body.style.animation = 'hueRotate 3s ease-in-out';
        
        // Créer des confettis (optionnel)
        createConfetti();
        
        // Cacher après 4 secondes
        setTimeout(() => {
            easterEgg.classList.add('hidden');
            document.body.style.animation = '';
        }, 4000);
    }
}

// ========================================
// CONFETTI EFFECT
// ========================================
function createConfetti() {
    const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                opacity: ${Math.random() * 0.8 + 0.2};
                transform: rotate(${Math.random() * 360}deg);
                pointer-events: none;
                z-index: 10001;
            `;
            
            document.body.appendChild(confetti);
            
            animateConfetti(confetti);
        }, i * 30);
    }
}

function animateConfetti(element) {
    const duration = Math.random() * 2000 + 2000;
    const startY = -10;
    const endY = window.innerHeight + 10;
    const startX = parseFloat(element.style.left);
    const endX = startX + (Math.random() * 200 - 100);
    
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            const y = startY + (endY - startY) * progress;
            const x = startX + (endX - startX) * progress;
            const rotation = progress * 720;
            
            element.style.top = y + 'px';
            element.style.left = x + 'px';
            element.style.transform = `rotate(${rotation}deg)`;
            
            requestAnimationFrame(animate);
        } else {
            element.remove();
        }
    }
    
    animate();
}

// ========================================
// FILTERS (Projects page)
// ========================================
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects with animation
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll(`
        .project-card,
        .theme-card,
        .article-card,
        .stage-card,
        .skill-card,
        .source-card,
        .method-step
    `);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Skill bars animation
    animateSkillBars();
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.style.getPropertyValue('--progress');
                bar.style.width = progress;
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        bar.style.width = '0';
        observer.observe(bar);
    });
}

// ========================================
// SECRET EASTER EGGS
// ========================================
function initializeSecretEasterEggs() {
    // Triple-click sur le logo
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.addEventListener('click', handleLogoClick);
    });
    
    // Secret developer mode
    initializeDeveloperMode();
    
    // Random particle effects
    initializeParticleEffects();
}

function handleLogoClick() {
    secretClickCount++;
    
    if (secretClickTimer) {
        clearTimeout(secretClickTimer);
    }
    
    secretClickTimer = setTimeout(() => {
        secretClickCount = 0;
    }, 1000);
    
    if (secretClickCount === 3) {
        activateLogoEasterEgg();
        secretClickCount = 0;
    }
}

function activateLogoEasterEgg() {
    const messages = [
        { text: "Code is poetry 💻", color: '#6366f1' },
        { text: "Stay curious 🚀", color: '#8b5cf6' },
        { text: "Level up! ⬆️", color: '#f59e0b' },
        { text: "Keep coding! ⚡", color: '#10b981' },
        { text: "Debug mode: ON 🐛", color: '#ef4444' }
    ];
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: ${randomMsg.color};
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        font-weight: 600;
        font-size: 1rem;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.2);
        z-index: 10000;
        animation: slideDown 0.5s ease-out;
        pointer-events: none;
    `;
    notification.textContent = randomMsg.text;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 2500);
}

// ========================================
// DEVELOPER MODE
// ========================================
function initializeDeveloperMode() {
    // Console messages
    console.log('%c🎮 Portfolio Gaming Edition 🎮', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cBravo d\'avoir ouvert la console !', 'color: #8b5cf6; font-size: 14px;');
    console.log('%cEssaye le Konami Code : ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #f59e0b; font-size: 12px;');
    console.log('%cOu triple-clique sur le logo 😉', 'color: #10b981; font-size: 12px;');
    
    // Expose debug functions
    window.portfolioDebug = {
        activateKonami: activateKonamiEasterEgg,
        createConfetti: createConfetti,
        logoEasterEgg: activateLogoEasterEgg
    };
}

// ========================================
// PARTICLE EFFECTS
// ========================================
function initializeParticleEffects() {
    let lastParticleTime = 0;
    const particleCooldown = 200; // ms
    
    document.addEventListener('click', (e) => {
        const now = Date.now();
        
        if (now - lastParticleTime < particleCooldown) {
            return;
        }
        
        // 20% chance de créer des particules
        if (Math.random() > 0.8) {
            createClickParticles(e.clientX, e.clientY);
            lastParticleTime = now;
        }
    });
}

function createClickParticles(x, y) {
    const particleCount = 6;
    const colors = ['#6366f1', '#8b5cf6', '#f59e0b'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 10px currentColor;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        animateParticle(particle, vx, vy);
    }
}

function animateParticle(particle, vx, vy) {
    let posX = 0;
    let posY = 0;
    let opacity = 1;
    let frame = 0;
    const maxFrames = 30;
    
    function animate() {
        frame++;
        posX += vx;
        posY += vy;
        opacity = 1 - (frame / maxFrames);
        
        particle.style.transform = `translate(${posX}px, ${posY}px)`;
        particle.style.opacity = opacity;
        
        if (frame < maxFrames) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }
    
    animate();
}

// ========================================
// SMOOTH SCROLLING
// ========================================
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

// ========================================
// CSS ANIMATIONS
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes hueRotate {
        0%, 100% {
            filter: hue-rotate(0deg);
        }
        50% {
            filter: hue-rotate(360deg);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// RESIZE HANDLER
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Réinitialiser les animations si nécessaire
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        }
    }, 250);
});

// ========================================
// LAZY LOADING (Performance)
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// CONSOLE ART
// ========================================
console.log(`
    ╔═══════════════════════════════════╗
    ║   🎮 PORTFOLIO GAMING EDITION 🎮 ║
    ╚═══════════════════════════════════╝
    
    Easter Eggs disponibles:
    • Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    • Triple-clic sur le logo
    • Clique aléatoire pour des particules
    
    Debug functions:
    • portfolioDebug.activateKonami()
    • portfolioDebug.createConfetti()
    • portfolioDebug.logoEasterEgg()
`);
