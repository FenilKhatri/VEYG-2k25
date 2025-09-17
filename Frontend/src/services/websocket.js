import { io } from 'socket.io-client';
import cookieAuth from '../utils/cookieAuth';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.listeners = new Map();
    }

    connect() {
        const authData = cookieAuth.getAuthData();
        
        if (!authData || !authData.token) {
            return;
        }

        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
        const socketUrl = API_BASE_URL;

        this.socket = io(socketUrl, {
            auth: {
                token: authData.token
            },
            transports: ['websocket', 'polling'],
            timeout: 20000,
            forceNew: true
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.emit('connectionStatus', { connected: true });
        });

        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
            this.emit('connectionStatus', { connected: false, reason });
            
            // Auto-reconnect for certain disconnect reasons
            if (reason === 'io server disconnect') {
                // Server initiated disconnect, don't reconnect automatically
                return;
            }
            
            this.handleReconnect();
        });

        this.socket.on('connect_error', (error) => {
            this.isConnected = false;
            this.emit('connectionError', { error: error.message });
            this.handleReconnect();
        });

        // Payment status updates
        this.socket.on('paymentStatusUpdate', (data) => {
            this.emit('paymentStatusUpdate', data);
        });

        // New registration notifications (for admins)
        this.socket.on('newRegistration', (data) => {
            this.emit('newRegistration', data);
        });

        // Registration updates (for admins)
        this.socket.on('registrationUpdate', (data) => {
            this.emit('registrationUpdate', data);
        });

        // Global notifications
        this.socket.on('globalNotification', (data) => {
            this.emit('globalNotification', data);
        });

        // Pong response for connection health
        this.socket.on('pong', () => {
            this.emit('pong');
        });
    }

    handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.emit('maxReconnectAttemptsReached');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s
        
        
        setTimeout(() => {
            if (!this.isConnected) {
                this.connect();
            }
        }, delay);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Event listener management
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                }
            });
        }
    }

    // Send ping to check connection health
    ping() {
        if (this.socket && this.isConnected) {
            this.socket.emit('ping');
        }
    }

    // Get connection status
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts
        };
    }
}

// Export singleton instance
export default new WebSocketService();
