// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, posX = 0, posY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instant cursor
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Smooth follower using requestAnimationFrame
function updateFollower() {
    posX += (mouseX - posX) * 0.1;
    posY += (mouseY - posY) * 0.1;
    
    follower.style.left = posX + 'px';
    follower.style.top = posY + 'px';
    
    requestAnimationFrame(updateFollower);
}
updateFollower();

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
    follower.style.transform = 'translate(-50%, -50%) scale(0.8)';
    follower.style.background = 'rgba(212, 175, 55, 0.2)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.background = 'transparent';
});
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
gsap.from('.hero-content h1', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power4.out'
});

gsap.from('.hero-tagline', {
    duration: 1.2,
    y: 30,
    opacity: 0,
    delay: 0.5,
    ease: 'power3.out'
});

gsap.from('.hero-btns', {
    duration: 1,
    y: 20,
    opacity: 0,
    delay: 0.8,
    ease: 'power2.out'
});

// Section Titles Animation
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
});

// Services Animation
gsap.from('.service-box', {
    scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power2.out'
});



// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Change icon between bars and times
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// --- CMS Data Loading ---
async function initCMS() {
    try {
        // Load Portfolio
        const portfolioRes = await fetch('content/portfolio.json');
        const portfolioData = await portfolioRes.json();
        renderPortfolio(portfolioData.items);

        // Load Testimonials
        const testimonialsRes = await fetch('content/testimonials.json');
        const testimonialsData = await testimonialsRes.json();
        renderTestimonials(testimonialsData.items);

        // Load Team
        const teamRes = await fetch('content/team.json');
        const teamData = await teamRes.json();
        renderTeam(teamData.items);

        // Re-initialize animations and logic that depend on dynamic content
        initReappliedLogic();
    } catch (error) {
        console.error('Error loading CMS data:', error);
    }
}

function renderPortfolio(items) {
    const container = document.querySelector('.portfolio-grid');
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="port-item has-video" 
             data-video="${item.video}"
             style="background-image: url('${item.image}');">
             <div class="port-overlay">
                <span>${item.title}</span>
             </div>
        </div>
    `).join('');
}

function renderTestimonials(items) {
    const container = document.querySelector('.video-testi-grid');
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="testimonial-card">
            <div class="testi-user-info">
                <div class="testi-user-img">
                    <img src="${item.userImage || 'assets/icon-gold.png'}" alt="${item.name}">
                </div>
                <div class="testi-user-details">
                    <h4>${item.name}</h4>
                    <p>${item.title}</p>
                </div>
            </div>
            <div class="testi-video has-video" 
                 data-video="${item.video}"
                 style="background-image: url('${item.image}'); background-size: cover; background-position: center;">
                 <div class="play-btn-overlay"><i class="fas fa-play"></i></div>
            </div>
        </div>
    `).join('');
}

function renderTeam(items) {
    const track = document.querySelector('.team-scroll-track');
    if (!track) return;
    track.innerHTML = items.map(item => `
        <div class="pro-team-card">
            <div class="pro-team-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="pro-team-info">
                <h3>${item.name}</h3>
                <p>${item.position}</p>
            </div>
        </div>
    `).join('');
}

function initReappliedLogic() {
    // Optimized Scroll for Team
    createAutoScroll('.team-scroll-container', '.team-scroll-track', 1.0);
    
    // Optimized Scroll for Testimonials
    createAutoScroll('.testi-scroll-container', '.testi-scroll-track', 0.8);
}

// Global Video Modal Logic (using Delegation)
const modal = document.getElementById("videoModal");
const iframe = document.getElementById("videoIframe");
const closeBtn = document.querySelector(".close-modal");

document.addEventListener('click', (e) => {
    const videoItem = e.target.closest('.has-video');
    if (videoItem && modal && iframe) {
        const videoSrc = videoItem.getAttribute('data-video');
        if (videoSrc) {
            iframe.src = videoSrc;
            modal.style.display = "flex";
            gsap.fromTo(".modal-content", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
        }
    }
});

if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
        iframe.src = "";
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            iframe.src = "";
        }
    });
}

// --- Reusable & Optimized Scroll Logic ---
function createAutoScroll(containerSelector, trackSelector, baseSpeed = 1.0) {
    const container = document.querySelector(containerSelector);
    const track = document.querySelector(trackSelector);
    if (!container || !track || track.children.length === 0) return;

    // Clean up existing clones first
    [...track.querySelectorAll('.clone')].forEach(el => el.remove());

    // Reset any static styles just in case
    track.style.justifyContent = '';
    track.style.margin = '';

    // Check if scrolling is actually needed based on content width
    if (track.scrollWidth <= container.clientWidth + 10) {
        // If content fits within the container, center it and keep it static
        track.style.justifyContent = 'center';
        track.style.margin = '0 auto';
        return;
    }

    // Only clone if there are enough items to actually scroll
    const originalItems = [...track.children];
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        track.appendChild(clone);
    });

    let isDown = false;
    let startX, scrollLeft, isHovering = false, currentScroll = 0;
    let requestId;

    function step() {
        if (!isDown && !isHovering) {
            currentScroll += baseSpeed;
            // Seamless loop point
            if (currentScroll >= track.scrollWidth / 2) {
                currentScroll = 0;
            }
            container.scrollLeft = currentScroll;
        } else {
            currentScroll = container.scrollLeft;
        }
        requestId = requestAnimationFrame(step);
    }
    
    // Start loop
    step();

    // Event Listeners for Interaction
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => { 
        isDown = false; 
        isHovering = false; 
        container.style.cursor = 'grab';
    });
    
    container.addEventListener('mouseenter', () => { isHovering = true; });
    container.addEventListener('mouseup', () => { 
        isDown = false; 
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
        
        // Boundaries for manual drag loop
        if (container.scrollLeft <= 0) {
            container.scrollLeft = track.scrollWidth / 2;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        } else if (container.scrollLeft >= track.scrollWidth / 2) {
            container.scrollLeft = 0;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        }
    });

    // Mobile optimization
    container.addEventListener('touchstart', () => { isHovering = true; }, {passive: true});
    container.addEventListener('touchend', () => {
        setTimeout(() => { 
            isHovering = false; 
            currentScroll = container.scrollLeft;
        }, 1500);
    }, {passive: true});
}


// Initialize on Load
window.addEventListener('DOMContentLoaded', initCMS);

