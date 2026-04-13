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

// Team Auto-Drift & Manual Drag Scroll
const teamScroll = document.querySelector('.team-scroll-container');
const teamTrack = document.querySelector('.team-scroll-track');

if (teamScroll && teamTrack) {
    // Clone items once for seamless looping
    const items = [...teamTrack.children];
    items.forEach(item => {
        const clone = item.cloneNode(true);
        teamTrack.appendChild(clone);
    });

    let isDown = false;
    let startX;
    let scrollLeft;
    let scrollSpeed = 1.5; // Smooth drift speed
    let isHovering = false;
    let currentScroll = 0;

    // Auto-drift function
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
    autoScroll();

    teamScroll.addEventListener('mousedown', (e) => {
        isDown = true;
        teamScroll.style.cursor = 'grabbing';
        startX = e.pageX - teamScroll.offsetLeft;
        scrollLeft = teamScroll.scrollLeft;
        currentScroll = scrollLeft;
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

    // Handle mobile touch effectively to fix jitter and lag
    teamScroll.addEventListener('touchstart', () => {
        isHovering = true; // Act as hover to pause auto-scroll
    }, {passive: true});

    let touchTimeout;
    teamScroll.addEventListener('touchend', () => {
        // Wait for native momentum scroll to finish before resuming auto scroll
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            isHovering = false;
            currentScroll = teamScroll.scrollLeft;
        }, 1500);
    });

    teamScroll.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - teamScroll.offsetLeft;
        const walk = (x - startX) * 2; 

        teamScroll.scrollLeft = scrollLeft - walk;
        
        // Loop boundary checks
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

// Video Modal Logic for Portfolio
const modal = document.getElementById("videoModal");
const iframe = document.getElementById("videoIframe");
const closeBtn = document.querySelector(".close-modal");

if (modal && iframe && closeBtn) {
    document.querySelectorAll('.has-video').forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-video');
            if (videoSrc) {
                iframe.src = videoSrc;
                modal.style.display = "flex";
                // Add a small animation effect
                gsap.fromTo(".modal-content", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
        iframe.src = ""; // Stop the video
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            iframe.src = ""; // Stop the video
        }
    });
}
