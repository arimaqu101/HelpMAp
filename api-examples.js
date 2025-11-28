// ====================================
// HelpMap API Usage Examples
// ====================================

/**
 * Примеры использования API в JavaScript
 * Убедитесь, что api-config.js подключен перед этим файлом
 */

// ====================================
// 1. ПРИМЕРЫ АУТЕНТИФИКАЦИИ
// ====================================

/**
 * Пример регистрации нового пользователя
 */
async function exampleRegister() {
    try {
        const result = await AuthAPI.register('john_doe', 'password123', 'volunteer');
        
        if (result.success) {
            console.log('Регистрация успешна!', result.user);
            // Сохраняем данные пользователя
            localStorage.setItem('userId', result.user.id);
            localStorage.setItem('username', result.user.username);
            localStorage.setItem('userRole', result.user.role);
        } else {
            console.error('Ошибка регистрации:', result.error);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
    }
}

/**
 * Пример входа в аккаунт
 */
async function exampleLogin() {
    try {
        const result = await AuthAPI.login('john_doe', 'password123');
        
        if (result.success) {
            console.log('Вход успешен!', result.user);
            localStorage.setItem('userId', result.user.id);
            localStorage.setItem('username', result.user.username);
            localStorage.setItem('userRole', result.user.role);
        } else {
            console.error('Ошибка входа:', result.error);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
    }
}

// ====================================
// 2. ПРИМЕРЫ РАБОТЫ С ЗАПРОСАМИ ПОМОЩИ
// ====================================

/**
 * Пример получения всех открытых запросов помощи
 */
async function exampleGetHelpRequests() {
    try {
        const requests = await HelpRequestAPI.getRequests('open');
        console.log('Открытые запросы:', requests);
        
        // Отобразить список запросов
        requests.forEach(req => {
            console.log(`${req.title} - ${req.status}`);
        });
    } catch (error) {
        console.error('Ошибка получения запросов:', error);
    }
}

/**
 * Пример создания нового запроса помощи
 */
async function exampleCreateHelpRequest() {
    try {
        const userId = localStorage.getItem('userId') || 1;
        
        const result = await HelpRequestAPI.createRequest(
            userId,
            'Нужна помощь с переездом',
            'Требуется помощь с переездом квартиры в Алматы',
            'relocation',
            43.2567,  // latitude
            76.9286   // longitude
        );
        
        if (result.success) {
            console.log('Запрос создан!', result.request);
            NotificationManager.showToast('Запрос успешно создан!', 'success');
        } else {
            console.error('Ошибка создания:', result.error);
            NotificationManager.showToast(result.error, 'error');
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
    }
}

/**
 * Пример обновления статуса запроса
 */
async function exampleUpdateHelpRequest(requestId) {
    try {
        const result = await HelpRequestAPI.updateRequest(
            requestId,
            'in_progress',
            'Помощь уже в процессе...'
        );
        
        if (result.success) {
            console.log('Запрос обновлен!', result.request);
            NotificationManager.showToast('Статус обновлен', 'success');
        } else {
            console.error('Ошибка обновления:', result.error);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
    }
}

/**
 * Пример удаления запроса
 */
async function exampleDeleteHelpRequest(requestId) {
    try {
        const result = await HelpRequestAPI.deleteRequest(requestId);
        
        if (result.success) {
            console.log('Запрос удален!');
            NotificationManager.showToast('Запрос удален', 'success');
        } else {
            console.error('Ошибка удаления:', result.error);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
    }
}

// ====================================
// 3. ПРИМЕРЫ РАБОТЫ С ЧАТОМ/СООБЩЕНИЯМИ
// ====================================

/**
 * Пример отправки сообщения
 */
async function exampleSendMessage() {
    try {
        const senderId = localStorage.getItem('userId') || 1;
        
        const result = await MessageAPI.sendMessage(
            senderId,
            2,  // receiverId
            'Привет! Мне нужна помощь с переездом'
        );
        
        if (result.success) {
            console.log('Сообщение отправлено!');
            NotificationManager.showToast('Сообщение отправлено', 'success');
        } else {
            console.error('Ошибка отправки:', result.error);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
    }
}

/**
 * Пример получения сообщений пользователя
 */
async function exampleGetMessages() {
    try {
        const userId = localStorage.getItem('userId') || 1;
        
        const messages = await MessageAPI.getMessages(userId);
        console.log('Сообщения:', messages);
        
        messages.forEach(msg => {
            console.log(`${msg.sender} -> ${msg.receiver}: ${msg.content}`);
        });
    } catch (error) {
        console.error('Ошибка получения сообщений:', error);
    }
}

// ====================================
// 4. ПРИМЕРЫ РАБОТЫ С ОТЗЫВАМИ
// ====================================

/**
 * Пример создания отзыва о волонтере
 */
async function exampleCreateReview() {
    try {
        const reviewerId = localStorage.getItem('userId') || 1;
        
        const result = await ReviewAPI.createReview(
            reviewerId,
            2,  // volunteerId
            5,  // rating 1-5
            'Отличная помощь! Очень благодарна за помощь с переездом.'
        );
        
        if (result.success) {
            console.log('Отзыв добавлен!');
            NotificationManager.showToast('Отзыв добавлен', 'success');
        } else {
            console.error('Ошибка добавления отзыва:', result.error);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
    }
}

/**
 * Пример получения отзывов волонтера
 */
async function exampleGetReviews(volunteerId) {
    try {
        const reviews = await ReviewAPI.getReviews(volunteerId);
        console.log('Отзывы:', reviews);
        
        // Вычислить среднюю оценку
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        
        console.log(`Средняя оценка: ${avgRating}/5`);
    } catch (error) {
        console.error('Ошибка получения отзывов:', error);
    }
}

// ====================================
// 5. ПРИМЕРЫ РАБОТЫ С ФОРУМОМ
// ====================================

/**
 * Пример получения тем форума
 */
async function exampleGetForumTopics() {
    try {
        const topics = await ForumAPI.getTopics();
        console.log('Темы форума:', topics);
        
        topics.forEach(topic => {
            console.log(`${topic.title} (${topic.comments_count} комментариев)`);
        });
    } catch (error) {
        console.error('Ошибка получения тем:', error);
    }
}

/**
 * Пример создания новой темы в форуме
 */
async function exampleCreateForumTopic() {
    try {
        const userId = localStorage.getItem('userId') || 1;
        
        const result = await ForumAPI.createTopic(
            userId,
            'Как найти надежного волонтера?',
            'У меня есть проблема с поиском надежного волонтера для помощи...',
            'advice'
        );
        
        if (result.success) {
            console.log('Тема создана!', result.topic);
            NotificationManager.showToast('Тема создана', 'success');
        } else {
            console.error('Ошибка создания темы:', result.error);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
    }
}

/**
 * Пример добавления комментария в тему форума
 */
async function exampleAddComment(topicId) {
    try {
        const userId = localStorage.getItem('userId') || 1;
        
        const result = await ForumAPI.createComment(
            userId,
            topicId,
            'Отличный вопрос! У меня был похожий опыт...'
        );
        
        if (result.success) {
            console.log('Комментарий добавлен!');
            NotificationManager.showToast('Комментарий добавлен', 'success');
        } else {
            console.error('Ошибка добавления комментария:', result.error);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
    }
}

/**
 * Пример получения полной темы с комментариями
 */
async function exampleGetForumTopic(topicId) {
    try {
        const topic = await ForumAPI.getTopic(topicId);
        console.log('Тема:', topic.title);
        console.log('Комментарии:', topic.comments);
        
        topic.comments.forEach(comment => {
            console.log(`${comment.author}: ${comment.content}`);
        });
    } catch (error) {
        console.error('Ошибка получения темы:', error);
    }
}

// ====================================
// 6. ПРИМЕРЫ РАБОТЫ С АНИМАЦИЯМИ
// ====================================

/**
 * Пример использования AnimationManager
 */
function exampleAnimations() {
    // Добавить анимацию fade-in к элементу с ID 'myElement'
    const element = document.getElementById('myElement');
    AnimationManager.addAnimation(element, 'fade-in', 0);
    
    // Добавить анимацию ко всем элементам с классом 'card'
    AnimationManager.addAnimationToAll('.card', 'slide-in-bottom', 100);
    
    // Добавить анимацию при наведении
    AnimationManager.onHoverAnimation('.button', 'btn-hover-lift');
    
    // Добавить анимацию при клике
    AnimationManager.onClickAnimation('.trigger', 'shake');
    
    // Показать тост-уведомление
    NotificationManager.showToast('Это тестовое уведомление!', 'success', 3000);
}

// ====================================
// 7. ИНИЦИАЛИЗАЦИЯ
// ====================================

/**
 * Инициализация всех примеров при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('API примеры загружены. Используйте в консоли:');
    console.log('- exampleRegister()');
    console.log('- exampleLogin()');
    console.log('- exampleGetHelpRequests()');
    console.log('- exampleCreateHelpRequest()');
    console.log('- exampleSendMessage()');
    console.log('- exampleGetMessages()');
    console.log('- exampleCreateReview(1)');
    console.log('- exampleGetReviews(1)');
    console.log('- exampleGetForumTopics()');
    console.log('- exampleCreateForumTopic()');
    console.log('- exampleAddComment(1)');
    console.log('- exampleGetForumTopic(1)');
    console.log('- exampleAnimations()');
});
