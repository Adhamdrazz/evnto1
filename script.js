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
    // Re-initialize Team Scroll
    initTeamScroll();
    
    // Re-initialize Video Modal (using event delegation on document)
    // No need to re-init if we use delegation, but let's ensure it's ready
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

// Updated Team Scroll Logic
function initTeamScroll() {
    const teamScroll = document.querySelector('.team-scroll-container');
    const teamTrack = document.querySelector('.team-scroll-track');
    if (!teamScroll || !teamTrack || teamTrack.children.length === 0) return;

    // Remove old clones if any
    const originalItems = [...teamTrack.querySelectorAll('.pro-team-card:not(.clone)')];
    teamTrack.innerHTML = '';
    originalItems.forEach(item => teamTrack.appendChild(item));

    // Clone items
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        teamTrack.appendChild(clone);
    });

    let isDown = false;
    let startX, scrollLeft, isHovering = false, currentScroll = 0;
    const scrollSpeed = 1.2;

    function autoScroll() {
        if (!isDown && !isHovering) {
            currentScroll += scrollSpeed;
            if (currentScroll >= teamTrack.scrollWidth / 2) currentScroll = 0;
            teamScroll.scrollLeft = currentScroll;
        } else {
            currentScroll = teamScroll.scrollLeft;
        }
        requestAnimationFrame(autoScroll);
    }
    autoScroll();

    teamScroll.addEventListener('mousedown', (e) => {
        isDown = true;
        teamScroll.style.cursor = 'grabbing';
        startX = e.pageX - teamScroll.offsetLeft;
        scrollLeft = teamScroll.scrollLeft;
    });

    teamScroll.addEventListener('mouseleave', () => { isDown = false; isHovering = false; });
    teamScroll.addEventListener('mouseenter', () => { isHovering = true; });
    teamScroll.addEventListener('mouseup', () => { isDown = false; });
    
    teamScroll.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - teamScroll.offsetLeft;
        const walk = (x - startX) * 2;
        teamScroll.scrollLeft = scrollLeft - walk;
        
        if (teamScroll.scrollLeft <= 0) {
            teamScroll.scrollLeft = teamTrack.scrollWidth / 2;
            startX = e.pageX - teamScroll.offsetLeft;
            scrollLeft = teamScroll.scrollLeft;
        } else if (teamScroll.scrollLeft >= teamTrack.scrollWidth / 2) {
            teamScroll.scrollLeft = 0;
            startX = e.pageX - teamScroll.offsetLeft;
            scrollLeft = teamScroll.scrollLeft;
        }
    });
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', initCMS);

