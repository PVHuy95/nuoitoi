// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.feature-card, .commitment-item, .comparison-column, .budget-item, .message-content, .quote, .disclaimer'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Animate budget bars when visible
    const budgetBars = document.querySelectorAll('.budget-fill');
    const budgetObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger width animation by adding a class
                entry.target.style.animation = 'fillBar 1.5s ease forwards';
            }
        });
    }, { threshold: 0.3 });

    budgetBars.forEach(bar => {
        budgetObserver.observe(bar);
    });

    // Smooth scroll for anchor links
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

    // Add interactive effects to buttons (except btn-saoke which will run away)
    const donateButtons = document.querySelectorAll('.btn-donate');
    donateButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Make btn-saoke "run away" FOREVER - Ultimate Troll! 😂
    const saokeBtn = document.querySelector('.btn-saoke');
    if (saokeBtn) {
        // Disable click completely
        saokeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        // Track mouse position continuously
        let isRunning = false;

        document.addEventListener('mousemove', (e) => {
            if (!saokeBtn || isRunning) return;

            const btnRect = saokeBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            // Calculate distance between mouse and button center
            const deltaX = e.clientX - btnCenterX;
            const deltaY = e.clientY - btnCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // If mouse is within 150px of button, run away!
            const dangerZone = 150;

            if (distance < dangerZone) {
                isRunning = true;

                // Calculate direction away from mouse
                const angle = Math.atan2(deltaY, deltaX);
                const oppositeAngle = angle + Math.PI;

                // Move button in opposite direction
                const moveDistance = 250;
                const randomOffset = (Math.random() - 0.5) * 100;

                const newX = Math.cos(oppositeAngle) * moveDistance + randomOffset;
                const newY = Math.sin(oppositeAngle) * moveDistance + randomOffset;

                // Get current transform
                const currentTransform = window.getComputedStyle(saokeBtn).transform;
                let currentX = 0, currentY = 0;

                if (currentTransform !== 'none') {
                    const matrix = currentTransform.match(/matrix\((.+)\)/);
                    if (matrix) {
                        const values = matrix[1].split(', ');
                        currentX = parseFloat(values[4]) || 0;
                        currentY = parseFloat(values[5]) || 0;
                    }
                }

                // Apply new position
                saokeBtn.style.transition = 'transform 0.3s ease-out';
                saokeBtn.style.transform = `translate(${currentX + newX}px, ${currentY + newY}px)`;

                // Shake effect
                saokeBtn.style.animation = 'shake 0.3s';
                setTimeout(() => {
                    saokeBtn.style.animation = '';
                    isRunning = false;
                }, 300);

                // Change cursor
                saokeBtn.style.cursor = 'not-allowed';
            }
        });

        // Troll text when hovering
        saokeBtn.addEventListener('mouseenter', () => {
            const originalText = saokeBtn.innerHTML;
            const trollTexts = [
                '🏃 Đuổi không kịp đâu!',
                '😂 Haha không click được!',
                '🚀 Tốc độ ánh sáng!',
                '👻 Bắt tôi đi!',
                '⚡ Nhanh lắm nha!'
            ];
            const randomText = trollTexts[Math.floor(Math.random() * trollTexts.length)];
            saokeBtn.innerHTML = randomText;

            setTimeout(() => {
                saokeBtn.innerHTML = originalText;
            }, 1000);
        });
    }

    // Add hover sound effect (optional - visual feedback only)
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.feature-icon');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        });
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.feature-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Counter animation for percentages (if you want to animate from 0 to target)
    const animateCounter = (element, target, duration = 1500) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '%';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '%';
            }
        }, 16);
    };

    // Observe budget percentages for counter animation
    const percentages = document.querySelectorAll('.budget-percent');
    const percentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = parseInt(entry.target.textContent);
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target, target);
            }
        });
    }, { threshold: 0.5 });

    percentages.forEach(percent => {
        percentObserver.observe(percent);
    });

    // Add parallax effect to hero emoji
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroEmojis = document.querySelectorAll('.hero-emoji');
        heroEmojis.forEach((emoji, index) => {
            const speed = index === 0 ? 0.5 : 0.3;
            emoji.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Add tilt effect to QR code on mouse move
    const qrCode = document.getElementById('qrCode');
    if (qrCode) {
        qrCode.addEventListener('mousemove', (e) => {
            const rect = qrCode.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            qrCode.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        qrCode.addEventListener('mouseleave', () => {
            qrCode.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    // Console easter egg
    console.log('%c🌱 HÃY NUÔI TÔI! 🌱', 'font-size: 30px; color: #ff006e; font-weight: bold;');
    console.log('%cMinh bạch 300%! Sao kê realtime! 💎', 'font-size: 16px; color: #8338ec;');
    console.log('%cNếu bạn thấy cái này, bạn là người thông minh! Hãy donate đi! 😂', 'font-size: 14px; color: #06ffa5;');
});

// Add CSS animation for budget bars
const style = document.createElement('style');
style.textContent = `
    @keyframes fillBar {
        from { width: 0; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ===== SCROLL BUTTONS LOGIC =====
const scrollToTopBtn = document.getElementById('scrollToTop');
const scrollToBottomBtn = document.getElementById('scrollToBottom');

// Show/hide buttons based on scroll position
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    
    // Show scroll to top button after scrolling 300px
    if (scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
    
    // Show scroll to bottom button when not at bottom
    if (scrollY + windowHeight < documentHeight - 100) {
        scrollToBottomBtn.classList.add('show');
    } else {
        scrollToBottomBtn.classList.remove('show');
    }
});

// Scroll to top
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll to bottom
scrollToBottomBtn.addEventListener('click', () => {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
});
