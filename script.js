document.addEventListener('DOMContentLoaded', function() {

    // Элементтерді анықтау
    const body = document.body;
    const modeToggle = document.getElementById('modeToggle');
    const showDetailsBtn = document.getElementById('showDetailsBtn');
    const fullDetails = document.getElementById('fullDetails');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const aiDemoForm = document.getElementById('aiDemoForm');
    const formMessage = document.getElementById('formMessage');
    const counters = document.querySelectorAll('.counter');
    const statItems = document.querySelectorAll('.stat-item'); 
    
    // Авторизация үшін элементтерді анықтау
    const userLoginTrigger = document.getElementById('userLoginTrigger'); 
    const profileLink = document.getElementById('profileLink');
    const registerBtnHero = document.getElementById('registerBtn'); 

    // Scroll анимациясы үшін элементтерді анықтау
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');


    /* =========================================
     * 0. Қолданушыны Жүктеу (Dynamic User Load)
     * ========================================= */
    const loggedInUser = localStorage.getItem('username');
    const loggedInRole = localStorage.getItem('userRole'); 
    
    if (loggedInUser) {
        // Егер қолданушы жүйеге кірсе:
        userLoginTrigger.style.display = 'none'; // Кіру/Тіркелуді жасыру
        profileLink.style.display = 'inline'; // Профиль сілтемесін көрсету
        
        let roleText = '';
        if (loggedInRole === 'volunteer') {
            roleText = 'Ерікті';
        } else if (loggedInRole === 'help') {
            roleText = 'Мұқтаж';
        }

        profileLink.innerHTML = `<i class="fas fa-user-circle"></i> ${loggedInUser} (${roleText})`;
        profileLink.href = 'profile.html';
        
        if (registerBtnHero) {
            registerBtnHero.textContent = "Жеке Кабинетке Өту";
            registerBtnHero.href = "profile.html";
        }

    } else {
        // Егер қолданушы жүйеге кірмесе:
        userLoginTrigger.style.display = 'inline'; // Кіру/Тіркелуді көрсету
        profileLink.style.display = 'none'; // Профиль сілтемесін жасыру
        
        if (registerBtnHero) {
            registerBtnHero.textContent = "Ерікті болып тіркелу";
            registerBtnHero.href = "register.html";
        }
    }


    /* =========================================
     * 1. Dark Mode Логикасы
     * ========================================= */
    
    // Жүктеу кезінде режимді тексеру
    const currentMode = localStorage.getItem('mode') || 'light';
    if (currentMode === 'dark') {
        body.classList.add('dark-mode');
        modeToggle.innerHTML = '<i class="fas fa-sun"></i> Жарық Режим';
    } else {
        modeToggle.innerHTML = '<i class="fas fa-moon"></i> Қараңғы Режим';
    }

    // Режимді ауыстыру
    if (modeToggle) {
        modeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            
            let mode = 'light';
            if (body.classList.contains('dark-mode')) {
                mode = 'dark';
                modeToggle.innerHTML = '<i class="fas fa-sun"></i> Жарық Режим';
            } else {
                modeToggle.innerHTML = '<i class="fas fa-moon"></i> Қараңғы Режим';
            }
            localStorage.setItem('mode', mode);
        });
    }

    
    /* =========================================
     * 2. Scroll арқылы пайда болу анимациясы (Intersection Observer)
     * ========================================= */
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Элемент көрініс аймағында
                    entry.target.classList.add('in-view');
                    // Анимацияланғаннан кейін бақылауды тоқтату (бір рет жұмыс істеу үшін)
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            // Көрініс аймағынан 10% төмен орналасқан элементтерді анықтау үшін margin
            rootMargin: '0px 0px -10% 0px' 
        });

        // Әр элементті бақылауға қосу
        animateOnScrollElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Ескі браузерлер үшін: анимациясыз бірден көрсету
        animateOnScrollElements.forEach(element => {
            element.classList.add('in-view');
        });
    }


    /* =========================================
     * 3. Қосымша мәліметтерді көрсету/жасыру (Тек index.html үшін)
     * ========================================= */
    if (showDetailsBtn) {
        showDetailsBtn.addEventListener('click', function() {
            if (fullDetails.style.display === 'block') {
                fullDetails.style.display = 'none';
                showDetailsBtn.textContent = 'Толығырақ...';
            } else {
                fullDetails.style.display = 'block';
                showDetailsBtn.textContent = 'Жасыру';
            }
        });
    }
    
    /* =========================================
     * 4. Scroll To Top батырмасы
     * ========================================= */
    window.onscroll = function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };
    
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            document.body.scrollTop = 0; // Safari
            document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
        });
    }


    /* =========================================
     * 5. Счетчик Анимациясы (Intersection Observer)
     * ========================================= */
     if ('IntersectionObserver' in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Элемент көрініс аймағында болғанда санды санауды бастау
                    const counterElement = entry.target.querySelector('.counter');
                    const target = parseInt(counterElement.getAttribute('data-target'));
                    let count = 0;
                    const duration = 2000; // 2 секунд
                    const increment = target / (duration / 10);
                    
                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            counterElement.textContent = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            counterElement.textContent = target; // Дәл мәнді орнату
                        }
                    };
                    updateCount();
                    observer.unobserve(entry.target); // Бір рет іске қосу
                }
            });
        }, {
            rootMargin: '0px 0px -10% 0px' 
        });

        statItems.forEach(item => {
            counterObserver.observe(item);
        });
    } else {
        // Ескі браузерлер үшін бірден target мәнін орнату
        counters.forEach(counter => {
            counter.textContent = counter.getAttribute('data-target');
        });
    }

    /* =========================================
     * 6. Жаңалықтар Каруселінің Логикасы (Тек index.html үшін)
     * ========================================= */

    const track = document.getElementById('newsCarouselTrack');
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const indicatorsContainer = document.getElementById('carouselIndicators');
        
        let currentSlideIndex = 0;
        const slideCount = slides.length;
        let autoSlideInterval;

        // Карусельді жаңарту
        function updateCarousel() {
            // Бір уақытта 3 слайд көрсету үшін 33.33% жылжу
            const offset = -currentSlideIndex * 33.33; 
            track.style.transform = `translateX(${offset}%)`;
            updateIndicators();
        }

        // Индикаторларды құру
        function createIndicators() {
            slides.forEach((slide, index) => {
                const indicator = document.createElement('span');
                indicator.classList.add('indicator');
                if (index === 0) {
                    indicator.classList.add('active');
                }
                indicator.addEventListener('click', () => {
                    currentSlideIndex = index;
                    updateCarousel();
                    resetAutoSlide();
                });
                indicatorsContainer.appendChild(indicator);
            });
        }
        
        // Индикаторларды жаңарту
        function updateIndicators() {
            const indicators = indicatorsContainer.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.remove('active');
                if (index === currentSlideIndex) {
                    indicator.classList.add('active');
                }
            });
        }

        // Келесі слайдқа ауысу
        function nextSlide() {
            // Егер соңғы 3-тік топ болса, басына оралу
            if (currentSlideIndex >= slideCount - 3) {
                currentSlideIndex = 0;
            } else {
                currentSlideIndex++;
            }
            updateCarousel();
        }
        
        // Алдыңғы слайдқа ауысу
        function prevSlide() {
            if (currentSlideIndex === 0) {
                 // Басынан соңғы топқа ауысу
                currentSlideIndex = slideCount - 3;
            } else {
                currentSlideIndex--;
            }
            updateCarousel();
        }

        
        // 10 секунд сайын автоматты түрде жылжуды бастау
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 10000); 
        }

        // Автоматты жылжуды тоқтату және қайта бастау
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Батырмаларға оқиға тыңдаушыларды қосу
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetAutoSlide(); 
        });

        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetAutoSlide(); 
        });

        // Карусельді іске қосу
        createIndicators(); 
        updateCarousel();   
        startAutoSlide();   
        
        // Қолданушы тышқанды карусель үстінде ұстаса, жылжуды тоқтату
        const carouselContainer = track.closest('.carousel-container');
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    /* =========================================
     * 7. Байланыс Формасы (Тек index.html үшін)
     * ========================================= */
    if (aiDemoForm) {
        aiDemoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Демо-режимдегі деректерді жинау (Нақты жіберу логикасы жоқ)
            const name = document.getElementById('name').value;
            const requestType = document.getElementById('requestType').value;

            if (name && requestType) {
                formMessage.style.color = '#ffc107'; 
                formMessage.textContent = `Рахмет, ${name}! Сіздің '${requestType}' сұранысыңыз қабылданды. Біз сізбен жақын арада байланысамыз. (Бұл демо-режим)`;
                aiDemoForm.reset();
            } else {
                formMessage.style.color = 'red';
                formMessage.textContent = 'Барлық өрістерді толтырыңыз!';
            }
        });
    }

}); // DOMContentLoaded аяқталуы