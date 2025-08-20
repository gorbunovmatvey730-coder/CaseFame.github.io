// Дополнительные утилиты и функции
const Utils = {
    // Форматирование даты
    formatDate(date) {
        return new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Валидация email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Локальное хранилище с обработкой ошибок
    safeLocalStorage: {
        setItem(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.error('LocalStorage error:', e);
                return false;
            }
        },

        getItem(key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.error('LocalStorage error:', e);
                return null;
            }
        }
    },

    // Анимация элемента
    animateElement(element, animation) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = animation;
        }, 10);
    }
};

// Обработчики для Telegram WebApp
const TelegramHandlers = {
    // Показать уведомление
    showNotification(message, type = 'info') {
        const tg = window.Telegram.WebApp;
        switch (type) {
            case 'success':
                tg.HapticFeedback.notificationOccurred('success');
                break;
            case 'error':
                tg.HapticFeedback.notificationOccurred('error');
                break;
            default:
                tg.HapticFeedback.impactOccurred('light');
        }

        tg.showAlert(message);
    },

    // Виброотклик
    vibrate(type = 'light') {
        const tg = window.Telegram.WebApp;
        tg.HapticFeedback.impactOccurred(type);
    }
};

// Глобальный экспорт утилит
window.Utils = Utils;
window.TelegramHandlers = TelegramHandlers;