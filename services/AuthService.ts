import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  profilePicture?: string;
  monthlyBillLimit?: number;
  currentBillAmount?: number;
  electricityRate?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

type AuthStateListener = (state: AuthState) => void;

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false
  };
  private listeners: Set<AuthStateListener> = new Set();

  private constructor() {
    this.initialize();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initialize() {
    await this.checkStoredAuth();
  }

  async checkStoredAuth(): Promise<AuthState | null> {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const newState = {
          user,
          isAuthenticated: true
        };
        this.updateAuthState(newState);
        return newState;
      }
      return null;
    } catch (error) {
      console.error('Failed to check stored auth:', error);
      return null;
    }
  }

  async signIn(email: string, password: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const usersStr = await AsyncStorage.getItem('users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const { password, ...user } = found;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      this.updateAuthState({ user, isAuthenticated: true });
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async signUp(email: string, password: string, name: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get all users
    const usersStr = await AsyncStorage.getItem('users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    users.push({ ...user, password });
    await AsyncStorage.setItem('users', JSON.stringify(users));
    await AsyncStorage.setItem('user', JSON.stringify(user));
    this.updateAuthState({ user, isAuthenticated: true });
  }

  async signOut() {
    await AsyncStorage.removeItem('user');
    this.updateAuthState({
      user: null,
      isAuthenticated: false
    });
  }

  addListener(listener: AuthStateListener) {
    this.listeners.add(listener);
    // Immediately call listener with current state
    listener(this.authState);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  getUser(): User | null {
    return this.authState.user;
  }

  private updateAuthState(newState: AuthState) {
    this.authState = newState;
    this.listeners.forEach(listener => listener(newState));
  }
}

export const authService = AuthService.getInstance();