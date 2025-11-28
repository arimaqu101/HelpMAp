// ====================================
// HelpMap API Configuration
// ====================================

// API Base URL - используйте 'http://localhost:5000' для локальной разработки
const API_BASE_URL = 'http://localhost:5000';

// ====================================
// AUTHENTICATION API
// ====================================

class AuthAPI {
    static async register(username, password, role) {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
        return await response.json();
    }

    static async login(username, password) {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    }
}

// ====================================
// HELP REQUESTS API
// ====================================

class HelpRequestAPI {
    static async getRequests(status = 'open') {
        const response = await fetch(`${API_BASE_URL}/api/help-requests?status=${status}`);
        return await response.json();
    }

    static async getRequest(requestId) {
        const response = await fetch(`${API_BASE_URL}/api/help-requests/${requestId}`);
        return await response.json();
    }

    static async createRequest(creatorId, title, description, category, latitude, longitude) {
        const response = await fetch(`${API_BASE_URL}/api/help-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                creator_id: creatorId,
                title, 
                description, 
                category,
                latitude,
                longitude
            })
        });
        return await response.json();
    }

    static async updateRequest(requestId, status, description) {
        const response = await fetch(`${API_BASE_URL}/api/help-requests/${requestId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, description })
        });
        return await response.json();
    }

    static async deleteRequest(requestId) {
        const response = await fetch(`${API_BASE_URL}/api/help-requests/${requestId}`, {
            method: 'DELETE'
        });
        return await response.json();
    }
}

// ====================================
// CHAT / MESSAGES API
// ====================================

class MessageAPI {
    static async getMessages(userId) {
        const response = await fetch(`${API_BASE_URL}/api/messages?user_id=${userId}`);
        return await response.json();
    }

    static async sendMessage(senderId, receiverId, content) {
        const response = await fetch(`${API_BASE_URL}/api/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender_id: senderId,
                receiver_id: receiverId,
                content
            })
        });
        return await response.json();
    }

    static async markAsRead(messageId) {
        const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}/read`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    }
}

// ====================================
// REVIEWS API
// ====================================

class ReviewAPI {
    static async getReviews(volunteerId = null) {
        let url = `${API_BASE_URL}/api/reviews`;
        if (volunteerId) {
            url += `?volunteer_id=${volunteerId}`;
        }
        const response = await fetch(url);
        return await response.json();
    }

    static async createReview(reviewerId, volunteerId, rating, comment) {
        const response = await fetch(`${API_BASE_URL}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reviewer_id: reviewerId,
                volunteer_id: volunteerId,
                rating,
                comment
            })
        });
        return await response.json();
    }
}

// ====================================
// FORUM API
// ====================================

class ForumAPI {
    static async getTopics(category = null) {
        let url = `${API_BASE_URL}/api/forum/topics`;
        if (category) {
            url += `?category=${category}`;
        }
        const response = await fetch(url);
        return await response.json();
    }

    static async getTopic(topicId) {
        const response = await fetch(`${API_BASE_URL}/api/forum/topics/${topicId}`);
        return await response.json();
    }

    static async createTopic(creatorId, title, content, category) {
        const response = await fetch(`${API_BASE_URL}/api/forum/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creator_id: creatorId,
                title,
                content,
                category
            })
        });
        return await response.json();
    }

    static async createComment(authorId, topicId, content) {
        const response = await fetch(`${API_BASE_URL}/api/forum/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author_id: authorId,
                topic_id: topicId,
                content
            })
        });
        return await response.json();
    }
}

// ====================================
// STATUS API
// ====================================

class StatusAPI {
    static async checkStatus() {
        const response = await fetch(`${API_BASE_URL}/api/status`);
        return await response.json();
    }

    static async initDatabase() {
        const response = await fetch(`${API_BASE_URL}/api/init-db`, {
            method: 'POST'
        });
        return await response.json();
    }
}
