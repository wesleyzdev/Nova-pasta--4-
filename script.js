/**
 * ==========================================================================
 * BARBER PRIME - JAVASCRIPT PRINCIPAL
 * Funcionalidades: Menu Mobile, Scroll Reveal, Header Dinâmico,
 * Filtros de Galeria, Lightbox, Máscara de Telefone e Validação de Agendamento.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. MENU MOBILE & NAVEGAÇÃO
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');
  const navDropdown = document.getElementById('nav-dropdown');
  const dropdownToggle = document.getElementById('dropdown-toggle');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  // Alterna o menu mobile
  const toggleMobileMenu = () => {
    const isActive = navMenu.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', String(isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  // Fecha o menu mobile
  const closeMobileMenu = () => {
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    if (navDropdown && navDropdown.classList.contains('open')) {
      navDropdown.classList.remove('open');
      dropdownToggle?.setAttribute('aria-expanded', 'false');
    }
  };

  // Controle de Dropdown (Mobile accordion e Desktop)
  if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = navDropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha dropdown ao clicar em qualquer item do submenu
    dropdownItems.forEach((item) => {
      item.addEventListener('click', () => {
        navDropdown.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        closeMobileMenu();
      });
    });
  }

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Fecha ao clicar em qualquer link direto do menu (exceto o botão dropdown)
    navLinks.forEach((link) => {
      if (link !== dropdownToggle) {
        link.addEventListener('click', closeMobileMenu);
      }
    });

    // Fecha ao clicar fora do menu ou dropdown
    document.addEventListener('click', (event) => {
      const isClickInsideMenu = navMenu.contains(event.target) || hamburgerBtn.contains(event.target);
      if (!isClickInsideMenu && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }

      if (navDropdown && !navDropdown.contains(event.target) && navDropdown.classList.contains('open')) {
        navDropdown.classList.remove('open');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
      }
    });

    // Fecha com a tecla ESC
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (navDropdown && navDropdown.classList.contains('open')) {
          navDropdown.classList.remove('open');
          dropdownToggle?.setAttribute('aria-expanded', 'false');
        }
        if (navMenu.classList.contains('active')) {
          closeMobileMenu();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. HEADER COMPACTO & SOMBRA AO ROLAR
  // --------------------------------------------------------------------------
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --------------------------------------------------------------------------
  // 3. HIGHLIGHT DE LINK ATIVO NO MENU BASEADO NA SEÇÃO ATUAL
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset + 130;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((link) => link.classList.remove('active'));
          dropdownItems.forEach((item) => item.classList.remove('active'));

          if (targetLink.classList.contains('dropdown-item')) {
            dropdownToggle?.classList.add('active');
            targetLink.classList.add('active');
          } else {
            dropdownToggle?.classList.remove('active');
            targetLink.classList.add('active');
          }
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --------------------------------------------------------------------------
  // 4. ANIMAÇÕES SUAVES AO ROLAR (SCROLL REVEAL OBSERVER)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback caso navegador antigo não suporte IntersectionObserver
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 5. ATALHO: SELECIONAR SERVIÇO DIRETO PARA O FORMULÁRIO
  // --------------------------------------------------------------------------
  const selectServiceButtons = document.querySelectorAll('.select-service-btn');
  const serviceSelectInput = document.getElementById('client-service');

  selectServiceButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');

      if (serviceSelectInput && serviceName) {
        // Encontra opção correspondente no select
        for (let i = 0; i < serviceSelectInput.options.length; i++) {
          if (serviceSelectInput.options[i].text.includes(serviceName)) {
            serviceSelectInput.selectedIndex = i;
            break;
          }
        }

        // Rola até o formulário com suavidade
        const bookingSection = document.getElementById('agendamento');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
          // Destaque visual no campo
          setTimeout(() => {
            serviceSelectInput.focus();
            serviceSelectInput.style.borderColor = 'var(--gold)';
            setTimeout(() => {
              serviceSelectInput.style.borderColor = '';
            }, 1500);
          }, 600);
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. FILTROS DA GALERIA
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const category = item.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === category) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. MODAL LIGHTBOX DA GALERIA
  // --------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title');

      if (lightboxModal && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = title ? title.textContent : '';
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. MÁSCARA AUTOMÁTICA DE TELEFONE (XX) XXXXX-XXXX
  // --------------------------------------------------------------------------
  const phoneInput = document.getElementById('client-phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // Remove não números

      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      if (value.length > 10) {
        // Formato Celular: (XX) 9XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 6) {
        // Formato Fixo ou Celular incompleto: (XX) XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        // Apenas DDD
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d*)$/, '($1');
      }

      e.target.value = value;
    });
  }

  // --------------------------------------------------------------------------
  // 9. CONFIGURAR DATA MÍNIMA (NÃO PERMITIR DATAS PASSADAS)
  // --------------------------------------------------------------------------
  const dateInput = document.getElementById('client-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // --------------------------------------------------------------------------
  // 10. VALIDAÇÃO DO FORMULÁRIO DE AGENDAMENTO
  // --------------------------------------------------------------------------
  const bookingForm = document.getElementById('booking-form');
  const nameInput = document.getElementById('client-name');
  const serviceInput = document.getElementById('client-service');
  const barberInput = document.getElementById('client-barber');
  const timeInput = document.getElementById('client-time');

  // Elementos de mensagem de erro
  const nameError = document.getElementById('name-error');
  const phoneError = document.getElementById('phone-error');
  const serviceError = document.getElementById('service-error');
  const dateError = document.getElementById('date-error');
  const timeError = document.getElementById('time-error');

  // Modal de sucesso
  const successModal = document.getElementById('booking-success-modal');
  const modalSummaryText = document.getElementById('modal-summary-text');
  const modalWhatsappAction = document.getElementById('modal-whatsapp-action');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Limpa mensagens de erro ao digitar
  const clearError = (input, errorElement) => {
    input.classList.remove('invalid');
    if (errorElement) errorElement.textContent = '';
  };

  const setError = (input, errorElement, message) => {
    input.classList.add('invalid');
    if (errorElement) errorElement.textContent = message;
  };

  if (nameInput) nameInput.addEventListener('input', () => clearError(nameInput, nameError));
  if (phoneInput) phoneInput.addEventListener('input', () => clearError(phoneInput, phoneError));
  if (serviceInput) serviceInput.addEventListener('change', () => clearError(serviceInput, serviceError));
  if (dateInput) dateInput.addEventListener('change', () => clearError(dateInput, dateError));
  if (timeInput) timeInput.addEventListener('change', () => clearError(timeInput, timeError));

  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;

      // Validação do Nome
      const nameVal = nameInput.value.trim();
      if (nameVal.length < 3) {
        setError(nameInput, nameError, 'Por favor, insira seu nome completo.');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Validação do Telefone
      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        setError(phoneInput, phoneError, 'Informe um WhatsApp válido com DDD (10 ou 11 dígitos).');
        isValid = false;
      } else {
        clearError(phoneInput, phoneError);
      }

      // Validação do Serviço
      if (!serviceInput.value) {
        setError(serviceInput, serviceError, 'Selecione um serviço para continuar.');
        isValid = false;
      } else {
        clearError(serviceInput, serviceError);
      }

      // Validação da Data
      if (!dateInput.value) {
        setError(dateInput, dateError, 'Escolha a data do seu agendamento.');
        isValid = false;
      } else {
        clearError(dateInput, dateError);
      }

      // Validação do Horário
      if (!timeInput.value) {
        setError(timeInput, timeError, 'Escolha um horário disponível.');
        isValid = false;
      } else {
        clearError(timeInput, timeError);
      }

      if (!isValid) return;

      // Formatação da Data para exibição amigável (DD/MM/AAAA)
      const dateParts = dateInput.value.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

      // Monta texto de confirmacao
      const barberChoice = barberInput.value || 'Qualquer profissional disponivel';
      const summaryMessage =
        `Ola, ${nameVal}!\n` +
        `Recebemos seu pedido de agendamento na Barber Prime:\n\n` +
        `- Servico: ${serviceInput.value}\n` +
        `- Barbeiro: ${barberChoice}\n` +
        `- Data: ${formattedDate} as ${timeInput.value}\n` +
        `- Contato: ${phoneInput.value}\n\n` +
        `Clique no botao abaixo para confirmar diretamente com nossa equipe no WhatsApp!`;

      modalSummaryText.textContent = summaryMessage;

      // Cria URL do WhatsApp codificada (sem emojis para evitar caracteres invalidos)
      const whatsappText = encodeURIComponent(
        `*Agendamento Barber Prime*\n\n` +
        `Ola! Gostaria de confirmar meu agendamento:\n\n` +
        `*Nome:* ${nameVal}\n` +
        `*Servico:* ${serviceInput.value}\n` +
        `*Barbeiro:* ${barberChoice}\n` +
        `*Data:* ${formattedDate} as ${timeInput.value}\n` +
        `*WhatsApp:* ${phoneInput.value}`
      );

      const targetWhatsappNumber = '5519998866956';
      modalWhatsappAction.href = `https://wa.me/${targetWhatsappNumber}?text=${whatsappText}`;

      // Exibe modal de confirmação
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Reseta formulário
      bookingForm.reset();
    });
  }

  // Fechamento do Modal de Confirmação
  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. BOTÃO VOLTAR AO TOPO
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  const handleBackToTopVisibility = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
});
