// ====================================
// HelpMap Animation Utilities
// ====================================

/**
 * Класс для управления анимациями
 */
class AnimationManager {
    /**
     * Добавляет класс анимации к элементу
     * @param {Element} element - Элемент для анимации
     * @param {string} animationClass - Класс анимации
     * @param {number} delay - Задержка перед анимацией (мс)
     */
    static addAnimation(element, animationClass, delay = 0) {
        if (delay > 0) {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, delay);
        } else {
            element.classList.add(animationClass);
        }
    }

    /**
     * Удаляет класс анимации с элемента
     * @param {Element} element - Элемент
     * @param {string} animationClass - Класс анимации
     */
    static removeAnimation(element, animationClass) {
        element.classList.remove(animationClass);
    }

    /**
     * Добавляет анимацию ко всем элементам с заданным селектором
     * @param {string} selector - CSS селектор
     * @param {string} animationClass - Класс анимации
     * @param {number} staggerDelay - Задержка между элементами (мс)
     */
    static addAnimationToAll(selector, animationClass, staggerDelay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            this.addAnimation(element, animationClass, index * staggerDelay);
        });
    }

    /**
     * Триггерит анимацию при наведении
     * @param {string} selector - CSS селектор
     * @param {string} animationClass - Класс анимации
     */
    static onHoverAnimation(selector, animationClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addAnimation(element, animationClass);
            });
            element.addEventListener('mouseleave', () => {
                this.removeAnimation(element, animationClass);
            });
        });
    }

    /**
     * Триггирует анимацию при клике
     * @param {string} selector - CSS селектор
     * @param {string} animationClass - Класс анимации
     */
    static onClickAnimation(selector, animationClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', () => {
                this.addAnimation(element, animationClass);
                // Удаляем класс после завершения анимации
                setTimeout(() => {
                    this.removeAnimation(element, animationClass);
                }, 1000);
            });
        });
    }

    /**
     * Запускает анимацию при появлении элемента на экране
     * @param {string} selector - CSS селектор
     * @param {string} animationClass - Класс анимации
     * @param {Object} options - Опции IntersectionObserver
     */
    static observeAnimation(selector, animationClass, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            ...options
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.addAnimation(entry.target, animationClass);
                    observer.unobserve(entry.target);
                }
            });
        }, defaultOptions);

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Класс для показа/скрытия элементов с анимацией
 */
class TransitionManager {
    /**
     * Показывает элемент с анимацией
     * @param {Element} element - Элемент для показа
     * @param {string} animationClass - Класс анимации (по умолчанию 'fade-in')
     * @param {number} duration - Длительность анимации (мс)
     */
    static show(element, animationClass = 'fade-in', duration = 300) {
        element.style.display = 'block';
        element.offsetHeight; // Trigger reflow
        AnimationManager.addAnimation(element, animationClass);
    }

    /**
     * Скрывает элемент с анимацией
     * @param {Element} element - Элемент для скрытия
     * @param {string} animationClass - Класс анимации (по умолчанию 'fade-in')
     * @param {number} duration - Длительность анимации (мс)
     */
    static hide(element, animationClass = 'fade-in', duration = 300) {
        AnimationManager.removeAnimation(element, animationClass);
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    /**
     * Переключает показ/скрытие с анимацией
     * @param {Element} element - Элемент
     * @param {string} animationClass - Класс анимации
     */
    static toggle(element, animationClass = 'fade-in') {
        if (element.style.display === 'none' || !element.style.display) {
            this.show(element, animationClass);
        } else {
            this.hide(element, animationClass);
        }
    }
}

/**
 * Класс для создания эффектов уведомлений и тостов
 */
class NotificationManager {
    /**
     * Показывает тост-уведомление
     * @param {string} message - Сообщение
     * @param {string} type - Тип ('success', 'error', 'info', 'warning')
     * @param {number} duration - Длительность показа (мс)
     */
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} slide-in-top`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Определяем цвета в зависимости от типа
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };

        toast.style.backgroundColor = colors[type] || colors.info;
        toast.style.color = type === 'warning' ? '#1a1a1a' : '#fff';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('slide-in-top');
            toast.classList.add('slide-in-top');
            setTimeout(() => {
                toast.remove();
            }, duration);
        }, duration);
    }
}

/**
 * Класс для управления параллаксом
 */
class ParallaxManager {
    /**
     * Инициализирует параллакс эффект
     * @param {string} selector - CSS селектор для элементов параллакса
     * @param {number} speed - Скорость параллакса (0-1)
     */
    static init(selector, speed = 0.5) {
        const elements = document.querySelectorAll(selector);

        window.addEventListener('scroll', () => {
            elements.forEach(element => {
                const elementPosition = element.offsetTop;
                const windowPosition = window.pageYOffset;
                const elementInView = elementPosition - window.innerHeight;

                if (windowPosition > elementInView) {
                    const offset = (windowPosition - elementInView) * speed;
                    element.style.transform = `translateY(${offset}px)`;
                }
            });
        });
    }
}

/**
 * Класс для создания плавного скролла с анимацией
 */
class ScrollAnimationManager {
    /**
     * Плавный скролл к элементу
     * @param {string} selector - CSS селектор целевого элемента
     * @param {number} duration - Длительность скролла (мс)
     */
    static smoothScroll(selector, duration = 500) {
        const element = document.querySelector(selector);
        if (!element) return;

        const elementPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = elementPosition - startPosition;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Используем easing function
            const easeProgress = this.easeInOutCubic(progress);
            window.scrollTo(0, startPosition + distance * easeProgress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    /**
     * Cubic ease-in-out функция
     * @param {number} t - Прогресс (0-1)
     * @returns {number} Сглаженный прогресс
     */
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

/**
 * Инициализация всех анимаций при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Анимация элементов при появлении на экране
    AnimationManager.observeAnimation('.fade-in', 'fade-in');
    AnimationManager.observeAnimation('.slide-in-left', 'slide-in-left');
    AnimationManager.observeAnimation('.slide-in-right', 'slide-in-right');
    AnimationManager.observeAnimation('.slide-in-top', 'slide-in-top');
    AnimationManager.observeAnimation('.slide-in-bottom', 'slide-in-bottom');
    AnimationManager.observeAnimation('.scale-in', 'scale-in');
    AnimationManager.observeAnimation('.flip-in-x', 'flip-in-x');
    
    // Анимации при наведении
    AnimationManager.onHoverAnimation('.btn-hover-glow', 'btn-hover-glow');
    AnimationManager.onHoverAnimation('.btn-hover-lift', 'btn-hover-lift');
    AnimationManager.onHoverAnimation('.btn-hover-scale', 'btn-hover-scale');
    AnimationManager.onHoverAnimation('.card-lift', 'card-lift');
    AnimationManager.onHoverAnimation('.card-scale', 'card-scale');
    
    // Параллакс эффект (опционально)
    // ParallaxManager.init('.parallax-element', 0.5);
});
