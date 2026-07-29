/* ==========================================================================
   Interactive Script (High-End Machining Factory B2B Version)
   Project: Hojo Metal Works Corporate Site
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Header Scroll Effect ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');
  
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');

  const toggleMobileMenu = (open) => {
    if (open) {
      mobileNav.classList.remove('translate-x-full');
      mobileOverlay.classList.remove('hidden');
      setTimeout(() => mobileOverlay.classList.add('opacity-100'), 10);
      
      // Transform hamburger to X
      bar1.classList.add('rotate-45', 'translate-y-2');
      bar2.classList.add('opacity-0');
      bar3.classList.add('-rotate-45', '-translate-y-2');
    } else {
      mobileNav.classList.add('translate-x-full');
      mobileOverlay.classList.remove('opacity-100');
      setTimeout(() => mobileOverlay.classList.add('hidden'), 300);
      
      // Transform X back to hamburger
      bar1.classList.remove('rotate-45', 'translate-y-2');
      bar2.classList.remove('opacity-0');
      bar3.classList.remove('-rotate-45', '-translate-y-2');
    }
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = !mobileNav.classList.contains('translate-x-full');
    toggleMobileMenu(!isOpen);
  });

  mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-link, #mobile-menu-cta');
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // --- Active Nav Link on Scroll (Intersection Observer) ---
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const desktopLinks = document.querySelectorAll('nav .nav-link');
  const mobileLinks = document.querySelectorAll('#mobile-nav .nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const updateLinks = (links) => {
          links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-sec') === id) {
              link.classList.add('active');
            }
          });
        };
        updateLinks(desktopLinks);
        updateLinks(mobileLinks);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.getAttribute('id')) {
      observer.observe(section);
    }
  });

  // --- Portfolio Filter ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active', 'bg-laser', 'text-white');
        b.classList.add('bg-card', 'text-mutedText');
      });
      btn.classList.add('active', 'bg-laser', 'text-white');
      btn.classList.remove('bg-card', 'text-mutedText');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Interactive Price & Lead Time Calculator ---
  const calcMaterial = document.getElementById('calc-material');
  const calcPrecision = document.getElementById('calc-precision');
  const calcDelivery = document.getElementById('calc-delivery');
  const qtyButtons = document.querySelectorAll('.qty-btn');
  const resultPrice = document.getElementById('calc-result-price');
  const resultDelivery = document.getElementById('calc-result-delivery');

  let activeQtyFactor = 1.0;
  let activeQtyType = '1'; // '1', '10', '100'

  qtyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      qtyButtons.forEach(b => {
        b.classList.remove('active', 'border-laser', 'bg-laser/10', 'text-white');
        b.classList.add('border-borderMetal', 'bg-steel', 'text-mutedText');
      });
      btn.classList.add('active', 'border-laser', 'bg-laser/10', 'text-white');
      btn.classList.remove('border-borderMetal', 'bg-steel', 'text-mutedText');

      activeQtyFactor = parseFloat(btn.getAttribute('data-factor'));
      activeQtyType = btn.getAttribute('data-qty');
      calculateSpecs();
    });
  });

  const calculateSpecs = () => {
    if (!calcMaterial || !calcPrecision || !calcDelivery) return;

    const basePrice = 15000; // Base reference price for machining
    const matFactor = parseFloat(calcMaterial.options[calcMaterial.selectedIndex].getAttribute('data-factor'));
    const precFactor = parseFloat(calcPrecision.options[calcPrecision.selectedIndex].getAttribute('data-factor'));
    const delFactor = parseFloat(calcDelivery.options[calcDelivery.selectedIndex].getAttribute('data-factor'));

    // Compute price per unit
    let unitPrice = basePrice * matFactor * precFactor * delFactor * activeQtyFactor;
    
    // Scale output text based on qty selection
    let priceText = "";
    if (activeQtyType === '1') {
      priceText = `¥${Math.round(unitPrice).toLocaleString()}〜`;
    } else if (activeQtyType === '10') {
      const minTot = unitPrice * 10;
      priceText = `¥${Math.round(unitPrice).toLocaleString()}〜 /個\n<span class="text-xs text-mutedText block mt-1">(参考総額: ¥${Math.round(minTot).toLocaleString()}〜)</span>`;
    } else {
      const minTot = unitPrice * 50;
      priceText = `¥${Math.round(unitPrice * 0.9).toLocaleString()}〜 /個\n<span class="text-xs text-mutedText block mt-1">(参考総額: ¥${Math.round(minTot * 0.9).toLocaleString()}〜)</span>`;
    }

    resultPrice.innerHTML = priceText;

    // Delivery text
    const delVal = calcDelivery.value;
    if (delVal === 'normal') {
      resultDelivery.textContent = "約7〜10営業日";
    } else if (delVal === 'express') {
      resultDelivery.textContent = "約3〜4営業日 (特急対応)";
    } else {
      resultDelivery.textContent = "約12〜15営業日 (ゆったり割引)";
    }
  };

  if (calcMaterial) {
    calcMaterial.addEventListener('change', calculateSpecs);
    calcPrecision.addEventListener('change', calculateSpecs);
    calcDelivery.addEventListener('change', calculateSpecs);
    calculateSpecs(); // initial run
  }

  // --- CAD File Upload Drag & Drop UI ---
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const fileList = document.getElementById('file-list');
  let selectedFiles = [];

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'));
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleFiles(fileInput.files);
      }
    });
  }

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      // Check size limit (50MB)
      if (files[i].size > 50 * 1024 * 1024) {
        alert(`ファイル "${files[i].name}" は50MBを超えているためアップロードできません。`);
        continue;
      }
      selectedFiles.push(files[i]);
    }
    updateFileList();
  };

  const updateFileList = () => {
    if (!fileList) return;
    fileList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const fileItem = document.createElement('div');
      fileItem.className = 'flex items-center justify-between p-3 bg-steel/60 border border-borderMetal/50 rounded-lg text-xs';
      fileItem.innerHTML = `
        <div class="flex items-center gap-2 overflow-hidden mr-2">
          <i data-lucide="scale" class="w-4 h-4 text-laser flex-shrink-0"></i>
          <span class="font-bold text-white truncate">${file.name}</span>
          <span class="text-mutedText text-[10px] flex-shrink-0">(${sizeMB} MB)</span>
        </div>
        <button type="button" class="text-orangeAccent hover:text-red-500 font-bold ml-2 remove-file-btn" data-index="${index}">
          削除
        </button>
      `;
      fileList.appendChild(fileItem);
    });

    // Re-trigger Lucide for the new list items
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Attach remove event
    const removeButtons = document.querySelectorAll('.remove-file-btn');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        selectedFiles.splice(index, 1);
        updateFileList();
      });
    });
  };

  // --- FAQ Accordion ---
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('i');
      
      const isOpen = parent.classList.contains('active');
      
      // Close all FAQs first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-content').classList.add('hidden');
        const itemIcon = item.querySelector('.faq-trigger i');
        if (itemIcon) itemIcon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        parent.classList.add('active');
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // --- RFQ Form Submission (Mock) ---
  const quoteForm = document.getElementById('quote-form');
  const quoteSubmitBtn = document.getElementById('quote-submit-btn');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message-body').value;

      if (!name || !email || !message) {
        alert('必須項目をすべてご入力ください。');
        return;
      }

      // Visual feedback for sending status
      quoteSubmitBtn.disabled = true;
      quoteSubmitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>図面データ送信中...</span>
      `;

      setTimeout(() => {
        // Mock successful submission UI
        quoteForm.parentElement.innerHTML = `
          <div class="text-center py-12 flex flex-col items-center justify-center">
            <div class="w-16 h-16 bg-laser/10 border border-laser/20 rounded-full flex items-center justify-center text-laser mb-6">
              <i data-lucide="shield-check" class="w-10 h-10"></i>
            </div>
            <h3 class="text-2xl font-black text-white mb-4">お見積り・技術相談の受付完了</h3>
            <p class="text-sm text-mutedText max-w-xl mx-auto leading-relaxed mb-8">
              お問い合わせいただき、誠にありがとうございます。送信いただいた図面データおよびご相談内容は、暗号化の上、当社のセキュアな設計室PCへ安全に受信されました。<br><br>
              代表の豊穣（一級機械加工技能士）が直接図面を確認し、通常**24時間以内（原則翌営業日中）**にメールまたはお電話にて、加工可否・お見積り・概算納期をご返信いたします。
            </p>
            <button onclick="window.location.reload();" class="bg-white/5 border border-borderMetal hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2">
              <i data-lucide="file-up" class="w-4 h-4"></i>
              <span>別の図面を見積もる</span>
            </button>
          </div>
        `;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 1500);
    });
  }

  // --- GSAP ScrollTrigger Animations ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Initial fade in for spec Highlights
    gsap.from('#hero .grid > div', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top 80%',
      }
    });

    // Reveal Bento Grid Cards
    gsap.from('#capabilities .grid > div', {
      opacity: 0,
      y: 50,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#capabilities',
        start: 'top 70%',
      }
    });

    // Reveal Equipment Bento Cards
    gsap.from('#equipment .grid > div', {
      opacity: 0,
      y: 50,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#equipment',
        start: 'top 70%',
      }
    });

    // Reveal Case Studies
    gsap.from('#portfolio-grid > div', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#portfolio',
        start: 'top 70%',
      }
    });
  }
});
