import { io, Socket } from 'socket.io-client';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private connectionTimeoutId: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(token: string) {
    if (!token) {
      return null;
    }

    // Clear any existing connection timeout
    if (this.connectionTimeoutId) {
      clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = null;
    }

    // Only create a new socket if one doesn't exist or the existing one is disconnected
    if (!this.socket || !this.socket.connected) {
      // Extract the base URL without the API path
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
      const baseUrl = apiUrl.split('/api')[0];
      
      // Clean up any existing socket before creating a new one
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
      
      try {
        // Connect to the default namespace
        this.socket = io(baseUrl, {
          auth: {
            token: `Bearer ${token}`,
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          transports: ['websocket', 'polling'],
        });

        this.socket.on('connect_error', () => {
          // Set up a retry after 5 seconds
          this.connectionTimeoutId = setTimeout(() => {
            this.connectionTimeoutId = null;
            if (this.socket) {
              this.socket.connect();
            }
          }, 5000);
        });
      } catch {
        return null;
      }
    }
    return this.socket;
  }

  disconnect() {
    if (this.connectionTimeoutId) {
      clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

export const socketService = SocketService.getInstance(); 