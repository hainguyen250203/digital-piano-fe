import { io, Socket } from 'socket.io-client';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private connectionTimeoutId: NodeJS.Timeout | null = null;

  private constructor() { }

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

      // Properly parse and construct the WebSocket URL
      let baseUrl;
      try {
        const url = new URL(apiUrl);
        // Only use the host for WebSocket connection
        baseUrl = `${url.protocol === 'https:' ? 'wss' : 'ws'}://${url.host}`;
      } catch (error) {
        console.error('Error parsing API URL:', error);
        baseUrl = 'ws://localhost:3002';
      }

      console.log('Socket connection details:', {
        originalApiUrl: apiUrl,
        parsedBaseUrl: baseUrl,
        NODE_ENV: process.env.NODE_ENV,
        NODE_ENV_type: typeof process.env.NODE_ENV,
        NODE_ENV_exact: `"${process.env.NODE_ENV}"`,
        isProduction: process.env.NODE_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'development'
      });

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

        // Log connection lifecycle events
        this.socket.on('connect', () => {
          console.log('Socket connected successfully:', {
            id: this.socket?.id,
            baseUrl,
            transport: this.socket?.io.engine.transport.name
          });
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', {
            reason,
            baseUrl,
            wasConnected: this.socket?.connected
          });
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', {
            error,
            baseUrl,
            token: token ? 'present' : 'missing',
            transport: this.socket?.io.engine.transport.name,
            readyState: this.socket?.io.engine.readyState
          });
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
          console.log('Socket reconnection attempt:', {
            attemptNumber,
            baseUrl,
            transport: this.socket?.io.engine.transport.name
          });
        });

        this.socket.on('reconnect', (attemptNumber) => {
          console.log('Socket reconnected successfully:', {
            attemptNumber,
            baseUrl,
            transport: this.socket?.io.engine.transport.name
          });
        });

        this.socket.on('reconnect_error', (error) => {
          console.error('Socket reconnection error:', {
            error,
            baseUrl,
            transport: this.socket?.io.engine.transport.name
          });
        });

        this.socket.on('reconnect_failed', () => {
          console.error('Socket reconnection failed after all attempts:', {
            baseUrl,
            transport: this.socket?.io.engine.transport.name
          });
        });

        // Set up a retry after 5 seconds
        this.connectionTimeoutId = setTimeout(() => {
          this.connectionTimeoutId = null;
          if (this.socket) {
            this.socket.connect();
          }
        }, 5000);
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