const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

class WebSocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // userId -> socketId
    }

    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: [
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "https://veyg-2k25-frontend.onrender.com"
                ],
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        this.io.use(this.authenticateSocket.bind(this));
        this.io.on('connection', this.handleConnection.bind(this));

        return this.io;
    }

    authenticateSocket(socket, next) {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
            
            if (!token) {
                return next(new Error('Authentication token required'));
            }

            // Use fallback secret if JWT_SECRET is not set
            const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
            if (!process.env.JWT_SECRET) {
            }

            const decoded = jwt.verify(token, jwtSecret);
            socket.userId = decoded.id;
            socket.userRole = decoded.role;
            socket.isAdmin = decoded.isAdmin;
            
            next();
        } catch (error) {
            next(new Error('Invalid authentication token'));
        }
    }

    handleConnection(socket) {
        
        // Store user connection
        this.connectedUsers.set(socket.userId, socket.id);
        
        // Join user to their personal room
        socket.join(`user_${socket.userId}`);
        
        // Join admin to admin room
        if (socket.isAdmin) {
            socket.join('admin_room');
        }

        socket.on('disconnect', () => {
            this.connectedUsers.delete(socket.userId);
        });

        // Handle ping for connection health
        socket.on('ping', () => {
            socket.emit('pong');
        });
    }

    // Emit payment status update to specific user
    emitPaymentStatusUpdate(userId, registrationData) {
        if (this.io) {
            const updateData = {
                type: 'PAYMENT_STATUS_UPDATE',
                registrationId: registrationData.registrationId || registrationData._id,
                paymentStatus: registrationData.paymentStatus,
                approvalStatus: registrationData.approvalStatus,
                gameName: registrationData.gameName,
                timestamp: new Date().toISOString()
            };

            // Send to specific user
            this.io.to(`user_${userId}`).emit('paymentStatusUpdate', updateData);
            
            // Also send to admin room for real-time admin dashboard updates
            this.io.to('admin_room').emit('registrationUpdate', {
                ...updateData,
                userId: userId,
                type: 'REGISTRATION_STATUS_UPDATE'
            });

        }
    }

    // Emit new registration to admins
    emitNewRegistration(registrationData) {
        if (this.io) {
            const updateData = {
                type: 'NEW_REGISTRATION',
                registration: registrationData,
                timestamp: new Date().toISOString()
            };

            this.io.to('admin_room').emit('newRegistration', updateData);
        }
    }

    // Emit general notification to all users
    emitGlobalNotification(notification) {
        if (this.io) {
            this.io.emit('globalNotification', {
                ...notification,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Get connected users count
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }

    // Check if user is connected
    isUserConnected(userId) {
        return this.connectedUsers.has(userId);
    }
}

// Export singleton instance
module.exports = new WebSocketService();
