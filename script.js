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

// --- Dynamic Content Loader ---
async function loadDynamicContent() {
    try {
        const [portfolioRes, testimonialsRes, teamRes] = await Promise.all([
            fetch('content/portfolio.json').then(r => r.json()),
            fetch('content/testimonials.json').then(r => r.json()),
            fetch('content/team.json').then(r => r.json())
        ]);

        renderPortfolio(portfolioRes.items);
        renderTestimonials(testimonialsRes.items);
        renderTeam(teamRes.items);

        // Re-initialize logic that depends on dynamic elements
        initVideoModalListeners();
        initTeamScroll();
        
    } catch (err) {
        console.error('Error loading dynamic content:', err);
    }
}

function renderPortfolio(items) {
    const container = document.getElementById('portfolio-list');
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="port-item has-video" 
             data-video="${item.video}"
             style="background-image: url('${item.image}');"></div>
    `).join('');
}

function renderTestimonials(items) {
    const container = document.getElementById('testimonials-list');
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="testimonial-card glass-card">
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
                 style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${item.image}'); background-size: cover; background-position: center;"></div>
        </div>
    `).join('');
}

function renderTeam(items) {
    const container = document.getElementById('team-list');
    if (!container) return;
    container.innerHTML = items.map(member => `
        <div class="pro-team-card">
            <div class="pro-team-img">
                <img src="${member.image}" alt="${member.name}">
            </div>
            <div class="pro-team-info">
                <h3>${member.name}</h3>
                <p>${member.position}</p>
            </div>
        </div>
    `).join('');
}

function initVideoModalListeners() {
    const modal = document.getElementById("videoModal");
    const iframe = document.getElementById("videoIframe");
    
    document.querySelectorAll('.has-video').forEach(item => {
        // Remove existing listener to avoid clones
        item.removeEventListener('click', openVideoModal);
        item.addEventListener('click', openVideoModal);
    });
}

function openVideoModal() {
    const modal = document.getElementById("videoModal");
    const iframe = document.getElementById("videoIframe");
    const videoSrc = this.getAttribute('data-video');
    if (videoSrc) {
        iframe.src = videoSrc;
        modal.style.display = "flex";
        gsap.fromTo(".modal-content", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    }
}

// --- Original Logic Wrappers ---

function initTeamScroll() {
    const teamScroll = document.querySelector('.team-scroll-container');
    const teamTrack = document.querySelector('.team-scroll-track');

    if (teamScroll && teamTrack) {
        // Clear previous clones if any
        const originalItems = Array.from(teamTrack.querySelectorAll('.pro-team-card:not(.clone)'));
        teamTrack.innerHTML = '';
        originalItems.forEach(item => teamTrack.appendChild(item));

        // Clone items for seamless looping
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('clone');
            teamTrack.appendChild(clone);
        });

        // --- Re-attach scroll logic ---
        let isDown = false;
        let startX;
        let scrollLeft;
        let scrollSpeed = 1.2; // Adjusted for smoothness
        let isHovering = false;
        let currentScroll = 0;

        function autoScroll() {
            if (!isDown && !isHovering) {
                currentScroll += scrollSpeed;
                if (currentScroll >= teamTrack.scrollWidth / 2) {
                    currentScroll = 0;
                }
                teamScroll.scrollLeft = currentScroll;
            } else {
                currentScroll = teamScroll.scrollLeft;
            }
            requestAnimationFrame(autoScroll);
        }
        
        // Start auto scroll only once
        if (!window.autoScrollInitialized) {
            autoScroll();
            window.autoScrollInitialized = true;
        }

        teamScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            teamScroll.style.cursor = 'grabbing';
            startX = e.pageX - teamScroll.offsetLeft;
            scrollLeft = teamScroll.scrollLeft;
        });

        teamScroll.addEventListener('mouseleave', () => {
            isDown = false;
            isHovering = false;
            teamScroll.style.cursor = 'grab';
        });

        teamScroll.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        teamScroll.addEventListener('mouseup', () => {
            isDown = false;
            teamScroll.style.cursor = 'grab';
        });

        teamScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - teamScroll.offsetLeft;
            const walk = (x - startX) * 2; 
            teamScroll.scrollLeft = scrollLeft - walk;
        });

        teamScroll.addEventListener('touchstart', () => {
            isHovering = true;
        }, {passive: true});

        let touchTimeout;
        teamScroll.addEventListener('touchend', () => {
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                isHovering = false;
                currentScroll = teamScroll.scrollLeft;
            }, 1500);
        });
    }
}

// Start everything
loadDynamicContent();

// Modal close logic (Static elements)
const closeModalBtn = document.querySelector(".close-modal");
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        document.getElementById("videoModal").style.display = "none";
        document.getElementById("videoIframe").src = "";
    });
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById("videoModal");
    if (e.target === modal) {
        modal.style.display = "none";
        document.getElementById("videoIframe").src = "";
    }
});
