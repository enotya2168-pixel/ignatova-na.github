// ===== ОСНОВНОЙ JAVASCRIPT =====

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initNavigation();
    initAudienceTabs();
    initContactForm();
    initBackToTop();
    initStatsCounter();
    initSmoothScroll();
    initMobileMenu();
    initLoader();
    
    // Добавляем год в футер
    updateCopyrightYear();
});

// ===== НАВИГАЦИЯ =====
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const header = document.getElementById('home');
    
    if (!nav || !header) return;
    
    function updateNavOnScroll() {
        const scrollY = window.scrollY;
        const headerHeight = header.offsetHeight;
        
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Подсветка активного раздела
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateNavOnScroll);
    updateNavOnScroll(); // Инициализация при загрузке
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!menuBtn || !navLinks) return;
    
    menuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
            document.body.style.overflow = '';
        });
    });
}

// ===== ВКЛАДКИ ОБРАЗОВАТЕЛЬНОГО ХАБА =====
function initAudienceTabs() {
    const tabButtons = document.querySelectorAll('.audience-tab-btn');
    const tabContents = document.querySelectorAll('.audience-content');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const audience = this.getAttribute('data-audience');
            
            // Убираем активный класс у всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все вкладки
            tabContents.forEach(content => content.classList.remove('active'));
            // Показываем нужную вкладку
            document.getElementById(`${audience}-content`).classList.add('active');
        });
    });
}

// ===== ФОРМА ОБРАТНОЙ СВЯЗИ =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').value,
            message: document.getElementById('message').value
        };
        
        // Валидация
        if (!formData.name || !formData.email || !formData.role || !formData.message) {
            showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }
        
        // Здесь обычно отправка на сервер
        // Для демо просто показываем уведомление
        showNotification('Сообщение отправлено! Я свяжусь с вами в ближайшее время.', 'success');
        
        // Очищаем форму
        contactForm.reset();
        
        // Записываем в localStorage для демо
        saveFormData(formData);
    });
}

// Сохранение данных формы (для демо)
function saveFormData(data) {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push({
        ...data,
        date: new Date().toISOString()
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}

// ===== КНОПКА "НАВЕРХ" =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Инициализация
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== СЧЁТЧИК СТАТИСТИКИ =====
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    // Проверяем, есть ли атрибут data-count
    statNumbers.forEach(stat => {
        if (!stat.hasAttribute('data-count')) return;
        
        const target = parseInt(stat.getAttribute('data-count'));
        const suffix = stat.textContent.includes('%') ? '%' : '';
        const duration = 2000; // 2 секунды
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        stat.textContent = Math.floor(current) + suffix;
                    }, 16);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ЗАГРУЗЧИК =====
function initLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
    
    // Скрываем загрузчик после загрузки страницы
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
            }, 300);
        }, 500);
    });
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'info') {
    // Удаляем старое уведомление, если есть
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) oldNotification.remove();
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Стили для уведомления
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }
        
        .notification-success {
            border-left: 4px solid #2ecc71;
        }
        
        .notification-error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification-info {
            border-left: 4px solid #3498db;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-success .notification-content i {
            color: #2ecc71;
        }
        
        .notification-error .notification-content i {
            color: #e74c3c;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 1rem;
            padding: 5px;
        }
        
        .notification-close:hover {
            color: #666;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Закрытие по кнопке
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Добавляем анимацию исчезновения
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideOutStyle);

// ===== ОБНОВЛЕНИЕ ГОДА В ФУТЕРЕ =====
function updateCopyrightYear() {
    const yearElement = document.querySelector('.footer-copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2026', currentYear);
    }
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Анимация при наведении на карточки
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.principle-card, .resource-card, .project-card, .winner-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Инициализация после полной загрузки
window.addEventListener('load', function() {
    initCardHoverEffects();
    
    // Добавляем класс загруженности для анимаций
    document.body.classList.add('loaded');
    
    // Инициализация счетчика посещений (для демо)
    initVisitCounter();
});

// Счетчик посещений (localStorage)
function initVisitCounter() {
    if (typeof localStorage !== 'undefined') {
        let visits = parseInt(localStorage.getItem('siteVisits') || '0');
        visits++;
        localStorage.setItem('siteVisits', visits.toString());
        
        // Можно отображать где-нибудь, если нужно
        // console.log(`Посещений: ${visits}`);
    }
}

// Ресайз обработчик
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Переинициализация при изменении размера окна
        initStatsCounter();
    }, 250);
});

// Предотвращение context menu на изображениях (опционально)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Добавление класса для touch devices
if ('ontouchstart' in window || navigator.maxTouchPoints) {
    document.body.classList.add('touch-device');
}

// Service Worker для PWA (опционально)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
            function(registration) {
                console.log('ServiceWorker registration successful');
            },
            function(err) {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}