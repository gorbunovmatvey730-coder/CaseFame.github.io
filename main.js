// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;

// Основной объект приложения
const App = {
    init() {
        this.expandApp();
        this.setupEventListeners();
        this.loadUserData();
        this.applyTheme();
    },

    // Расширяем приложение на весь экран
    expandApp() {
        tg.expand();
        tg.enableClosingConfirmation();
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Кнопка кликов
        document.getElementById('clickBtn').addEventListener('click', () => {
            this.handleClick();
        });

        // Кнопка смены темы
        document.getElementById('themeBtn').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Кнопка отправки данных
        document.getElementById('sendDataBtn').addEventListener('click', () => {
            this.sendDataToBot();
        });

        // Обработка формы
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Обработка изменения темы Telegram
        tg.onEvent('themeChanged', this.applyTheme.bind(this));
    },

    // Обработчик кликов
    handleClick() {
        let clicks = parseInt(localStorage.getItem('clicks') || 0);
        clicks++;
        localStorage.setItem('clicks', clicks);
        document.getElementById('clicks').textContent = clicks;

        tg.HapticFeedback.impactOccurred('light');
    },

    // Переключение темы
    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.body.classList.remove(currentTheme);
        document.body.classList.add(newTheme);

        localStorage.setItem('theme', newTheme);
        tg.HapticFeedback.impactOccurred('medium');
    },

    // Применение темы
    applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        const tgTheme = tg.colorScheme;

        if (savedTheme) {
            document.body.classList.remove('light', 'dark');
            document.body.classList.add(savedTheme);
        } else if (tgTheme === 'dark') {
            document.body.classList.add('dark');
        }
    },

    // Загрузка данных пользователя
    loadUserData() {
        const user = tg.initDataUnsafe.user;
        const userInfoDiv = document.getElementById('userInfo');

        if (user) {
            userInfoDiv.innerHTML = `
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Имя:</strong> ${user.first_name} ${user.last_name || ''}</p>
                <p><strong>Username:</strong> @${user.username || 'не указан'}</p>
                <p><strong>Язык:</strong> ${user.language_code || 'не указан'}</p>
            `;
        } else {
            userInfoDiv.innerHTML = '<p>Данные пользователя недоступны</p>';
        }

        // Загрузка сохраненных кликов
        const clicks = localStorage.getItem('clicks') || 0;
        document.getElementById('clicks').textContent = clicks;
    },

    // Обработка отправки формы
    handleFormSubmit() {
        const name = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;

        if (!name || !email) {
            tg.showPopup({
                title: 'Ошибка',
                message: 'Заполните все поля',
                buttons: [{ type: 'ok' }]
            });
            return;
        }

        // Сохраняем данные
        const userData = {
            name: name,
            email: email,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('userData', JSON.stringify(userData));

        tg.showAlert('Данные успешно сохранены!');
        tg.HapticFeedback.notificationOccurred('success');
    },

    // Отправка данных боту
    sendDataToBot() {
        const userData = localStorage.getItem('userData');
        const clicks = localStorage.getItem('clicks') || 0;

        const data = {
            clicks: clicks,
            userData: userData ? JSON.parse(userData) : null,
            initData: tg.initData
        };

        tg.sendData(JSON.stringify(data));
        tg.close();
    }
};

// Инициализация приложения при загрузке
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Экспорт для глобального доступа
window.App = App;