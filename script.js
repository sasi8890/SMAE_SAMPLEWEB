// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on clicking a link
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.remove('fa-times');
        hamburger.querySelector('i').classList.add('fa-bars');
    });
});

// Intersection Observer for Animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // For timeline content specifically
                if (entry.target.classList.contains('slide-in-left') || entry.target.classList.contains('slide-in-right')) {
                    entry.target.querySelector('.timeline-content').classList.add('in-view');
                } else {
                    entry.target.classList.add('in-view');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    // Elements to observe
    const animatedElements = document.querySelectorAll(
        '.fade-up, .fade-in, .fade-left, .fade-right, .slide-in-left, .slide-in-right'
    );

    animatedElements.forEach(el => observer.observe(el));
};

// Initial triggers
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    
    // Trigger hero animations immediately if visible
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-up').forEach(el => {
            el.classList.add('in-view');
        });
    }, 100);
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// CAPTCHA Implementation
let captchaResult = '';

function generateCaptcha() {
    const canvas = document.getElementById('captchaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Generate Math Equation
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    
    if (operator === '-' && num1 < num2) {
        // Avoid negative result by swapping
        let temp = num1;
        num1 = num2;
        num2 = temp;
    }
    
    let result = 0;
    if (operator === '+') result = num1 + num2;
    else if (operator === '-') result = num1 - num2;
    else if (operator === '*') result = num1 * num2;
    
    let captchaStr = `${num1}${operator}${num2}=?`;
    captchaResult = result.toString();
    
    // Add noise lines
    for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `rgba(${Math.random()*150},${Math.random()*150},${Math.random()*150},0.5)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
    
    // Add text
    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.textBaseline = 'middle';
    const spacing = canvas.width / (captchaStr.length + 1);
    for (let i = 0; i < captchaStr.length; i++) {
        ctx.fillStyle = `rgb(${Math.random()*100},${Math.random()*100},${Math.random()*100})`; // Dark text
        ctx.save();
        ctx.translate(spacing + (i * spacing) - 5, 25);
        const rotation = (Math.random() - 0.5) * 0.4; // Random rotation
        ctx.rotate(rotation);
        ctx.fillText(captchaStr[i], 0, 0);
        ctx.restore();
    }
    
    // Add noise dots
    for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(${Math.random()*200},${Math.random()*200},${Math.random()*200},0.4)`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateCaptcha();
    
    const canvas = document.getElementById('captchaCanvas');
    const refreshBtn = document.getElementById('refreshCaptcha');
    
    if (canvas) canvas.addEventListener('click', generateCaptcha);
    if (refreshBtn) refreshBtn.addEventListener('click', generateCaptcha);
    
    const form = document.getElementById('studentForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userAnswer = document.getElementById('captchaAnswer').value.trim();
            const errorElement = document.getElementById('captchaError');
            const successElement = document.getElementById('formSuccessMessage');
            
            if (userAnswer === captchaResult) {
                // CAPTCHA passed
                errorElement.style.display = 'none';
                successElement.style.display = 'block';
                form.reset();
                generateCaptcha(); // Generate new CAPTCHA after successful submission
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successElement.style.display = 'none';
                }, 5000);
            } else {
                // CAPTCHA failed
                errorElement.textContent = 'Incorrect verification text. Please try again.';
                errorElement.style.display = 'block';
                successElement.style.display = 'none';
                generateCaptcha(); // Generate new CAPTCHA on failure
                document.getElementById('captchaAnswer').value = '';
            }
        });
    }
});

/**
 * Chatbot Implementation
 */
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Toggle Chat Window
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    // Close Chat Window
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Simple FAQ Responses Logic
    const botResponses = [
        { keywords: ['hi', 'hello', 'hey'], reply: "Hello! How can I assist you with SMAE today?" },
        { keywords: ['training', 'course', 'learn'], reply: "For trainings, please check out our Trainings section. We offer E-Bike, Solar Car, and Formula Car (EV) manufacturing courses." },
        { keywords: ['event', 'competition', 'baja', 'formula'], reply: "We host multiple events like FFS India, FKDC, and SMAE BAJA. Check our Events timeline for more details!" },
        { keywords: ['contact', 'email', 'phone', 'reach'], reply: "You can reach us at info@smae.in or call +91-9560122939. Our office is in Bengaluru." },
        { keywords: ['apply', 'register', 'join'], reply: "You can apply via the Student Page Corner section right on this page." },
    ];

    function getBotResponse(userMsg) {
        userMsg = userMsg.toLowerCase();
        
        for (let item of botResponses) {
            for (let word of item.keywords) {
                if (userMsg.includes(word)) {
                    return item.reply;
                }
            }
        }
        
        return "I'm still learning! If you need specific help, please contact us at info@smae.in.";
    }

    function addMessage(content, type) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', `${type}-message`);
        
        const msgContent = document.createElement('div');
        msgContent.classList.add('message-content');
        msgContent.textContent = content;
        
        msgDiv.appendChild(msgContent);
        chatbotMessages.appendChild(msgDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatbotMessages.appendChild(indicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const message = chatbotInput.value.trim();
        if (!message) return;

        // User message
        addMessage(message, 'user');
        chatbotInput.value = '';
        chatbotInput.focus();

        // Simulate AI thinking
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const botReply = getBotResponse(message);
            addMessage(botReply, 'ai');
        }, 1000 + Math.random() * 1000); // Random delay between 1-2s
    });
});

