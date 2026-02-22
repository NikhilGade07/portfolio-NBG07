document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header & Active Nav Highlight ---
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Active Nav Highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 2. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // --- 3. Typing Effect in Hero Section ---
    const typingText = document.querySelector('.typing-text');
    const phrase = "Building Skills in Java, Python & Web Development (HTML, CSS, JS)";
    let charIndex = 0;
    let isTyping = true;

    function typeEffect() {
        if (charIndex < phrase.length) {
            typingText.textContent += phrase.charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, 100); // Speed of typing
        }
    }

    // Start typing effect after a short delay
    setTimeout(typeEffect, 500);

    // --- 4. Scroll Reveal Animations & Progress Bars ---
    const revealElements = document.querySelectorAll('.reveal');
    const progressBars = document.querySelectorAll('.progress-bar');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade in section
                entry.target.classList.add('active');

                // If it's the skills section, animate progress bars
                if (entry.target.id === 'skills') {
                    progressBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width;
                    });
                }

                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of element is visible
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Form Validation & Local Storage System ---
    const form = document.getElementById('feedbackForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const successMessage = document.getElementById('successMessage');
    const feedbackList = document.getElementById('feedbackList');

    // Load existing feedback from local storage on page load
    loadFeedback();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Reset errors
        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

        // Basic Validation
        let isValid = true;

        if (nameInput.value.trim() === '') {
            showError(nameInput, 'nameError');
            isValid = false;
        }

        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'emailError');
            isValid = false;
        }

        if (messageInput.value.trim() === '') {
            showError(messageInput, 'messageError');
            isValid = false;
        }

        if (isValid) {
            // Save to LocalStorage
            saveFeedback(nameInput.value.trim(), messageInput.value.trim());

            // Show Success Message
            successMessage.classList.remove('hidden');
            form.reset();

            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 3000);
        }
    });

    // Helper functions for form
    function showError(inputElement, errorId) {
        inputElement.classList.add('invalid');
        document.getElementById(errorId).style.display = 'block';
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Local Storage Functions
    function saveFeedback(name, message) {
        // Retrieve existing feedback array or start empty
        let feedbacks = JSON.parse(localStorage.getItem('studentFeedback')) || [];

        const newFeedback = {
            id: Date.now(),
            name: name,
            message: message,
            date: new Date().toLocaleDateString()
        };

        // Add to array
        feedbacks.unshift(newFeedback); // Add to beginning

        // Save back to local storage
        localStorage.setItem('studentFeedback', JSON.stringify(feedbacks));

        // Update DOM
        renderFeedback(feedbacks);
    }

    function loadFeedback() {
        let feedbacks = JSON.parse(localStorage.getItem('studentFeedback')) || [];
        if (feedbacks.length > 0) {
            renderFeedback(feedbacks);
        }
    }

    function renderFeedback(feedbacks) {
        feedbackList.innerHTML = ''; // Clear current list

        feedbacks.forEach(item => {
            const card = document.createElement('div');
            card.className = 'feedback-card';
            card.innerHTML = `
                <h4>${item.name}</h4>
                <p>${item.message}</p>
                <span class="date">${item.date}</span>
            `;
            feedbackList.appendChild(card);
        });
    }
});
