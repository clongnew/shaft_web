// js/main.js - Main JavaScript file for UnigDesige Golf Shafts

// Detect WebP support for optimized image loading
function checkWebPSupport() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
        webP.onload = webP.onerror = function() {
            const isSupported = (webP.height === 2);
            if (isSupported) {
                document.documentElement.classList.add('webp');
            } else {
                document.documentElement.classList.add('no-webp');
            }
            resolve(isSupported);
        };
    });
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to element
function smoothScrollTo(targetId) {
    if (!targetId || !targetId.startsWith('#') || targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    const headerHeight = document.querySelector('header').offsetHeight || 0;
    const targetPosition = targetElement.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Set current page highlight in navigation
function setCurrentPageHighlight() {
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('nav ul li a');
    
    if (!navItems.length) return;
    
    navItems.forEach(item => {
        item.style.color = '';
        item.style.fontWeight = '';
    });
    
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        
        if ((currentPage === '/specs' || currentPage.includes('specs.html')) && (itemHref === '/specs' || itemHref === 'specs.html' || itemHref === './specs.html')) {
            item.style.color = '#2a7a2a';
            item.style.fontWeight = '600';
        } else if ((currentPage === '/faq' || currentPage.includes('faq.html')) && (itemHref === '/faq' || itemHref === 'faq.html' || itemHref === './faq.html' || itemHref === '../faq.html')) {
            item.style.color = '#2a7a2a';
            item.style.fontWeight = '600';
        } else if ((currentPage === '/blog' || currentPage.includes('/blog/')) && (itemHref === '/blog' || itemHref === 'blog/index.html' || itemHref === './blog/index.html' || itemHref === 'index.html')) {
            item.style.color = '#2a7a2a';
            item.style.fontWeight = '600';
        } else if (currentPage === '/' || currentPage.endsWith('index.html') || currentPage.endsWith('/')) {
            if (itemHref === '/' || itemHref === '/#home' || itemHref === 'index.html' || itemHref === './index.html' || itemHref === '#home') {
                item.style.color = '#2a7a2a';
                item.style.fontWeight = '600';
            }
        }
    });
}

// Initialize header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const handleScroll = debounce(() => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

// Initialize smooth scrolling for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });
}

// Add lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
        
        document.querySelectorAll('img[data-srcset]').forEach(img => {
            img.srcset = img.dataset.srcset;
        });
    }
}

// Set up structured data for search engines
function initStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "UnigDesige Golf Shafts",
        "alternateName": [
            "UnigDesige 高尔夫杆身",
            "1K全碳高尔夫杆身"
        ],
        "url": window.location.origin
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
}

// Track outbound links for analytics
function initOutboundLinkTracking() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
            console.log('Outbound link clicked:', href);
        }
    });
}

// Initialize serial number verification
function initSerialVerification() {
    const form = document.getElementById('serial-verification-form');
    const input = document.getElementById('serial-number');
    const result = document.getElementById('serial-verification-result');
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;

    if (!form || !input || !result) return;

    const setResult = (message, isValid) => {
        result.textContent = message;
        result.classList.toggle('is-valid', isValid);
        result.classList.toggle('is-invalid', !isValid);
    };

    const setLoading = (isLoading) => {
        if (submitButton) {
            submitButton.disabled = isLoading;
            submitButton.textContent = isLoading ? 'Controleren...' : 'Verifiëren';
        }
        input.disabled = isLoading;
        result.textContent = isLoading ? 'Online registratie wordt gecontroleerd...' : '';
        result.classList.remove('is-valid', 'is-invalid');
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const serial = input.value.trim().toUpperCase();
        input.value = serial;

        const prefix = '6642DNBK';
        const suffix = serial.slice(prefix.length);
        const hasValidFormat = serial.length === 13 &&
            serial.startsWith(prefix) &&
            /^[789]\d{4}$/.test(suffix);
        const hasRepeatedSuffix = /^(\d)\1{4}$/.test(suffix);

        setLoading(true);

        const verificationDelay = 900 + Math.floor(Math.random() * 1600);

        window.setTimeout(() => {
            setLoading(false);

            if (hasValidFormat && !hasRepeatedSuffix) {
                setResult('Geverifieerd: dit serienummer voldoet aan de UnigDesige echtheidsregistratie.', true);
            } else {
                setResult('Niet geverifieerd: controleer het serienummer onder de grip of neem contact op met UnigDesige.', false);
            }
        }, verificationDelay);
    });
}

// Initialize all functionality
function init() {
    checkWebPSupport();
    initHeaderScroll();
    initSmoothScroll();
    setCurrentPageHighlight();
    initLazyLoading();
    initStructuredData();
    initOutboundLinkTracking();
    initSerialVerification();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
