/* ==========================================================================
   Interactive Script (Factory / Manufacturing Version)
   Project: Hojo Metal Works Corporate Site
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navList.classList.remove('active');
    });
  });

  // --- Active Nav Link on Scroll (Intersection Observer) ---
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Active when section occupies middle area
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-sec') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // --- Portfolio Filter ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class for buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter cards
      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Fade in animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Contact Form Submission (Mock) ---
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;

      if (!name || !email) {
        alert('必須項目をご入力ください。');
        return;
      }

      // Visual feedback for sending status
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';

      setTimeout(() => {
        // Mock successful submission UI
        contactForm.innerHTML = `
          <div style="text-align: center; padding: 2rem 0; color: var(--primary-color);">
            <i class="fa-regular fa-circle-check" style="font-size: 3.5rem; color: var(--accent-color); margin-bottom: 1.5rem;"></i>
            <h3 style="margin-bottom: 1rem; font-size: 1.35rem; font-weight: 700;">見積り・加工依頼を受け付けました</h3>
            <p style="color: var(--text-main); font-size: 0.9rem; margin-bottom: 2rem; line-height: 1.6;">
              お問い合わせいただき誠にありがとうございます。図面の確認およびお見積りにつきましては、担当の豊穣（昭雄）より、通常1〜2営業日以内にご連絡差し上げます。お急ぎの場合はお電話（03-3741-XXXX）にてお気軽にご連絡ください。
            </p>
            <button onclick="window.location.reload();" class="btn btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1.25rem;">
              新しい問い合わせを送る
            </button>
          </div>
        `;
      }, 1200);
    });
  }
});
