/**
 * Portfolio — Andrzej Dobry
 * GSAP Animations & Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGSAPAnimations();
    initWorkflowAnimations();
});

/* ========================================
   1. Mobile Navigation
   ======================================== */

function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    const navAnchors = document.querySelectorAll('.nav-links a');

    if (!toggle || !links) return;

    const openMenu = () => {
        links.classList.add('is-open');
        overlay?.classList.add('is-visible');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        links.classList.remove('is-open');
        overlay?.classList.remove('is-visible');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
    });

    overlay?.addEventListener('click', closeMenu);

    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && links.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

/* ========================================
   2. GSAP ScrollTrigger Animations
   ======================================== */

function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroElements = document.querySelectorAll('.hero-eyebrow, .hero h1, .hero-sub, .hero-cta');
    gsap.fromTo(heroElements,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        }
    );

    // Scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll');
    if (scrollIndicator) {
        gsap.fromTo(scrollIndicator,
            { opacity: 0 },
            { opacity: 1, duration: 1, delay: 1.2, ease: 'power2.out' }
        );
    }

    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Portfolio cards
    gsap.utils.toArray('.portfolio-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Service cards
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Stats
    gsap.utils.toArray('.stat').forEach((stat, i) => {
        gsap.fromTo(stat,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                delay: i * 0.1,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // CTA box
    const ctaBox = document.querySelector('.cta-box');
    if (ctaBox) {
        gsap.fromTo(ctaBox,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: ctaBox,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
}

/* ========================================
   3. Workflow Animations (Canvas)
   ======================================== */

function initWorkflowAnimations() {
    const containers = document.querySelectorAll('.card-animation');

    containers.forEach((container, index) => {
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };

        resize();
        window.addEventListener('resize', resize);

        // Different animation types per card
        const animationType = index % 4;
        let animFrame;

        const animate = () => {
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            ctx.clearRect(0, 0, w, h);

            const time = Date.now() * 0.001;

            switch (animationType) {
                case 0:
                    drawNodeFlow(ctx, w, h, time);
                    break;
                case 1:
                    drawDataPipeline(ctx, w, h, time);
                    break;
                case 2:
                    drawProcessDiagram(ctx, w, h, time);
                    break;
                case 3:
                    drawNetworkGraph(ctx, w, h, time);
                    break;
            }

            animFrame = requestAnimationFrame(animate);
        };

        // Start animation when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                } else {
                    cancelAnimationFrame(animFrame);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(container);
    });
}

/* Animation: Node Flow (data flowing between nodes) */
function drawNodeFlow(ctx, w, h, time) {
    const nodes = [
        { x: w * 0.15, y: h * 0.5, r: 16, label: 'API' },
        { x: w * 0.4, y: h * 0.3, r: 20, label: 'n8n' },
        { x: w * 0.4, y: h * 0.7, r: 14, label: 'AI' },
        { x: w * 0.65, y: h * 0.5, r: 18, label: 'Data' },
        { x: w * 0.85, y: h * 0.5, r: 16, label: 'Out' },
    ];

    const connections = [
        [0, 1], [0, 2], [1, 3], [2, 3], [3, 4]
    ];

    // Draw connections
    connections.forEach(([from, to]) => {
        const a = nodes[from];
        const b = nodes[to];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `oklch(72% 0.01 262 / 0.2)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Animated particle
        const progress = ((time * 0.5 + from * 0.3) % 1);
        const px = a.x + (b.x - a.x) * progress;
        const py = a.y + (b.y - a.y) * progress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(76% 0.17 50 / ${0.6 + Math.sin(time * 3) * 0.3})`;
        ctx.fill();
    });

    // Draw nodes
    nodes.forEach((node, i) => {
        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 2);
        gradient.addColorStop(0, 'oklch(76% 0.17 50 / 0.15)');
        gradient.addColorStop(1, 'oklch(76% 0.17 50 / 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(node.x - node.r * 2, node.y - node.r * 2, node.r * 4, node.r * 4);

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = 'oklch(19% 0.014 265)';
        ctx.fill();
        ctx.strokeStyle = `oklch(76% 0.17 50 / ${0.5 + Math.sin(time * 2 + i) * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.font = '10px "Geist Mono", monospace';
        ctx.fillStyle = 'oklch(76% 0.17 50)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
    });
}

/* Animation: Data Pipeline */
function drawDataPipeline(ctx, w, h, time) {
    const stages = 5;
    const stageW = w / (stages + 1);

    for (let i = 0; i < stages; i++) {
        const x = stageW * (i + 1);
        const y = h * 0.5;
        const boxW = 48;
        const boxH = 28;

        // Box
        const pulse = Math.sin(time * 2 + i * 0.8) * 0.5 + 0.5;
        ctx.fillStyle = `oklch(19% 0.014 265)`;
        ctx.strokeStyle = `oklch(76% 0.17 50 / ${0.3 + pulse * 0.4})`;
        ctx.lineWidth = 1.5;
        roundRect(ctx, x - boxW / 2, y - boxH / 2, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        // Stage label
        const labels = ['Input', 'Parse', 'AI', 'Format', 'Output'];
        ctx.font = '9px "Geist Mono", monospace';
        ctx.fillStyle = `oklch(96% 0.006 262 / ${0.5 + pulse * 0.5})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[i], x, y);

        // Connection line
        if (i < stages - 1) {
            const nextX = stageW * (i + 2);
            ctx.beginPath();
            ctx.moveTo(x + boxW / 2, y);
            ctx.lineTo(nextX - boxW / 2, y);
            ctx.strokeStyle = 'oklch(72% 0.01 262 / 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Moving dot
            const dotProgress = ((time * 0.8 + i * 0.2) % 1);
            const dotX = (x + boxW / 2) + ((nextX - boxW / 2) - (x + boxW / 2)) * dotProgress;
            ctx.beginPath();
            ctx.arc(dotX, y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `oklch(76% 0.17 50 / ${0.8 - dotProgress * 0.5})`;
            ctx.fill();
        }
    }
}

/* Animation: Process Diagram */
function drawProcessDiagram(ctx, w, h, time) {
    const centerX = w * 0.5;
    const centerY = h * 0.5;
    const radius = Math.min(w, h) * 0.3;

    // Orbiting elements
    const orbitCount = 6;
    for (let i = 0; i < orbitCount; i++) {
        const angle = (time * 0.4) + (i / orbitCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.6;
        const size = 8 + Math.sin(time * 2 + i) * 3;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(76% 0.17 50 / ${0.2 + Math.sin(time + i) * 0.15})`;
        ctx.fill();
        ctx.strokeStyle = `oklch(76% 0.17 50 / ${0.4 + Math.sin(time * 1.5 + i) * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Connection to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `oklch(76% 0.17 50 / ${0.1 + Math.sin(time + i) * 0.05})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    // Center node
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'oklch(19% 0.014 265)';
    ctx.fill();
    ctx.strokeStyle = `oklch(76% 0.17 50 / ${0.6 + Math.sin(time * 2) * 0.3})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 9px "Geist Mono", monospace';
    ctx.fillStyle = 'oklch(76% 0.17 50)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CORE', centerX, centerY);
}

/* Animation: Network Graph */
function drawNetworkGraph(ctx, w, h, time) {
    const points = [];
    const count = 12;

    // Generate points in a loose grid
    for (let i = 0; i < count; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        points.push({
            x: w * 0.15 + (col / 3) * w * 0.7 + Math.sin(time + i) * 8,
            y: h * 0.2 + (row / 2) * h * 0.6 + Math.cos(time * 0.8 + i) * 6,
            active: Math.sin(time * 1.5 + i * 0.5) > 0.3
        });
    }

    // Draw edges
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < w * 0.35) {
                const alpha = (1 - dist / (w * 0.35)) * 0.15;
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.strokeStyle = `oklch(76% 0.17 50 / ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    // Draw nodes
    points.forEach((p, i) => {
        const r = p.active ? 5 : 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.active ? 'oklch(76% 0.17 50)' : 'oklch(72% 0.01 262 / 0.5)';
        ctx.fill();

        if (p.active) {
            // Pulse ring
            const pulseR = r + Math.sin(time * 3 + i) * 4 + 4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
            ctx.strokeStyle = `oklch(76% 0.17 50 / ${0.3 - Math.sin(time * 3 + i) * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });
}

/* Utility: Rounded Rectangle */
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
