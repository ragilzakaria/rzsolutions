/* Main JavaScript for RZ Solutions Portfolio */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      
      // Animate mobile menu icon (hamburger to cross)
      const paths = mobileMenuBtn.querySelectorAll('svg path');
      if (paths.length >= 2) {
        if (!isExpanded) {
          // Change to close icon
          paths[0].setAttribute('d', 'M6 18L18 6');
          if (paths[1]) paths[1].setAttribute('d', 'M6 6l12 12');
        } else {
          // Revert to burger icon
          paths[0].setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
          if (paths[1]) paths[1].setAttribute('d', '');
        }
      }
    });
  }

  // Active Navigation Link Highlighting based on current pathname
  const navLinks = document.querySelectorAll('.nav-link');
  
  const normalizePath = (path) => {
    if (!path) return '';
    return path
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace('.html', '')
      ?.toLowerCase() || 'index';
  };

  const currentPath = window.location.pathname;
  let currentSegment = normalizePath(currentPath);
  if (currentSegment === '' || currentSegment === '/' || currentSegment === 'rzsolutions') {
    currentSegment = 'index';
  }

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    let linkSegment = normalizePath(linkHref);
    
    if (linkSegment === currentSegment) {
      link.classList.add('nav-link-active');
      link.classList.remove('text-zinc-400');
      link.classList.add('text-teal-400');
    } else {
      link.classList.remove('nav-link-active');
      link.classList.remove('text-teal-400');
      link.classList.add('text-zinc-400');
    }
  });

  // Mouse move radial glow effect for cards & container
  const handleMouseMove = (e) => {
    const glowContainers = document.querySelectorAll('.radial-glow-container');
    glowContainers.forEach(container => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty('--x', `${x}px`);
      container.style.setProperty('--y', `${y}px`);
    });
  };
  document.addEventListener('mousemove', handleMouseMove);

  // Fade-in sections on scroll using Intersection Observer
  const fadeInSections = document.querySelectorAll('.fade-in-section');
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Stop observing once visible
        }
      });
    }, observerOptions);

    fadeInSections.forEach(section => {
      observer.observe(section);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    fadeInSections.forEach(section => {
      section.classList.add('visible');
    });
  }

  // Contact Form Interactivity & Validation (on contact.html)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      let isValid = true;
      
      [nameInput, emailInput, messageInput].forEach(input => {
        if (input && !input.value.trim()) {
          input.classList.add('border-red-500');
          isValid = false;
        } else if (input) {
          input.classList.remove('border-red-500');
        }
      });

      if (!isValid) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      // Success mockup transition
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-950 inline" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Sending...
      `;

      // Build FormSubmit AJAX payload
      const formData = new FormData(contactForm);
      formData.append('_subject', `New Portfolio Inquiry from ${nameInput.value}`);
      formData.append('_captcha', 'false'); // Disable captcha for seamless AJAX flow

      fetch('https://formsubmit.co/ajax/ragil.zakaria@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(response => {
        if (response.ok) {
          showModal('Success!', 'Thank you for reaching out! Your message has been sent successfully. I will get back to you shortly.');
          contactForm.reset();
        } else {
          showToast('Oops! Something went wrong. Please try again.', 'error');
        }
      })
      .catch(error => {
        console.error('Submission error:', error);
        showToast('Connection error. Please check your network and try again.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
    });
  }

  // Toast and Modal helper functions for interactive feedback
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-2xl transition-all duration-300 transform translate-y-10 opacity-0 z-50 flex items-center gap-3 ${
      type === 'success' ? 'bg-teal-500 text-zinc-950' : 'bg-red-500 text-white'
    }`;
    
    const icon = type === 'success' 
      ? '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
      : '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

    toast.innerHTML = `${icon} <span class="font-medium">${message}</span>`;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    // Animate out and remove
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  function showModal(title, text) {
    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300';
    
    const dialog = document.createElement('div');
    dialog.className = 'bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl transform scale-95 opacity-0 transition-all duration-300';
    dialog.innerHTML = `
      <div class="w-16 h-16 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-white mb-2">${title}</h3>
      <p class="text-zinc-400 mb-6">${text}</p>
      <button class="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold rounded-lg transition-colors w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900">
        Dismiss
      </button>
    `;
    
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
    
    // Trigger entry animations
    setTimeout(() => {
      dialog.classList.remove('scale-95', 'opacity-0');
    }, 10);
    
    const closeBtn = dialog.querySelector('button');
    const closeModal = () => {
      dialog.classList.add('scale-95', 'opacity-0');
      backdrop.classList.add('opacity-0');
      setTimeout(() => {
        backdrop.remove();
      }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }
});
