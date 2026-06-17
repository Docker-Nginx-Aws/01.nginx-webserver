/* ============================================================
   main.js - Main JavaScript File
   TechBridge India - Nginx Web Server Demo
   ============================================================ */

'use strict';

// ── DOM READY ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // Initialize all modules
    initNavbar();
    initServerInfo();
    initCounterAnimation();
    initSmoothScroll();
    initScrollReveal();

    console.log('[TechBridge] All modules initialized successfully.');
});


// ── MODULE: NAVBAR HAMBURGER MENU ─────────────────────────
function initNavbar() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks     = document.querySelector('.nav-links');

    if (!hamburgerBtn || !navLinks) return;

    hamburgerBtn.addEventListener('click', function () {
        // Toggle the "open" class to show/hide nav
        navLinks.classList.toggle('open');

        // Accessibility: update aria-expanded
        const isOpen = navLinks.classList.contains('open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a nav link is clicked (mobile UX)
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside navbar
    document.addEventListener('click', function (event) {
        const isInsideNav = event.target.closest('.navbar');
        if (!isInsideNav) {
            navLinks.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    });
}


// ── MODULE: SERVER INFO DISPLAY ───────────────────────────
// Shows live browser/connection info (client-side only)
// In a real app, this data would come from the server
function initServerInfo() {
    const serverInfoDiv = document.getElementById('serverInfo');
    if (!serverInfoDiv) return;

    const info = {
        'Web Server'   : 'Nginx 1.25 (Alpine)',
        'Container'    : 'Docker',
        'Cloud'        : 'AWS EC2',
        'Protocol'     : window.location.protocol.replace(':', '').toUpperCase(),
        'Your Browser' : detectBrowser(),
        'Timestamp'    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    const rows = Object.entries(info)
        .map(function ([key, value]) {
            return '<div><strong>' + key + ':</strong> ' + value + '</div>';
        })
        .join('');

    serverInfoDiv.innerHTML =
        '<div style="margin-bottom: 6px; font-weight: bold; color: #2563eb;">🖥️ Server Info</div>'
        + rows;
}

function detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Google Chrome';
    if (ua.includes('Firefox'))  return 'Mozilla Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Apple Safari';
    if (ua.includes('Edg'))      return 'Microsoft Edge';
    return 'Unknown Browser';
}


// ── MODULE: ANIMATED COUNTER ──────────────────────────────
// Animates numbers in the stats section from 0 to target
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    // Use Intersection Observer to start animation when visible
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
        observer.observe(el);
    });
}

function animateCounter(element) {
    const target   = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const step     = 16;   // ~60fps
    const increment = target / (duration / step);
    let current    = 0;

    const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, step);
}


// ── MODULE: SMOOTH SCROLL ─────────────────────────────────
// CSS scroll-behavior: smooth handles this now,
// but we add JS fallback for older browsers
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                event.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


// ── MODULE: SCROLL REVEAL ─────────────────────────────────
// Fade-in elements as they scroll into view
function initScrollReveal() {
    // Add CSS for the reveal animation
    const style = document.createElement('style');
    style.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Add reveal class to cards
    const revealTargets = document.querySelectorAll(
        '.feature-card, .stat-card, .download-card'
    );
    revealTargets.forEach(function (el) {
        el.classList.add('reveal');
    });

    // Observe and reveal
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
        observer.observe(el);
    });
}


// ── UTILITY: Format Bytes ─────────────────────────────────
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}