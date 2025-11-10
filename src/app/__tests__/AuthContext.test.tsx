import { render, screen, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AuthContext', () => {
  let mockPush: jest.Mock;
  let mockRouter: any;

  beforeEach(() => {
    mockPush = jest.fn();
    mockRouter = {
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('AuthProvider', () => {
    it('should render children', () => {
      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      );
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should initialize with no user when localStorage is empty', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should restore user from localStorage on mount', async () => {
      const mockUser = { email: 'test@example.com', name: 'test' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', 'test-token');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle corrupted localStorage data gracefully', async () => {
      localStorage.setItem('user', 'invalid-json');
      localStorage.setItem('authToken', 'test-token');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('login function', () => {
    it('should successfully login with valid credentials', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let loginResult: boolean = false;

      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123');
      });

      expect(loginResult).toBe(true);
      expect(result.current.user).toEqual({
        email: 'test@example.com',
        name: 'test',
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ email: 'test@example.com', name: 'test' })
      );
      expect(mockPush).toHaveBeenCalledWith('/tiles');
    });

    it('should fail login with invalid email', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let loginResult: boolean = false;

      await act(async () => {
        loginResult = await result.current.login('invalid-email', 'password123');
      });

      expect(loginResult).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should fail login with empty credentials', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let loginResult: boolean = false;

      await act(async () => {
        loginResult = await result.current.login('', '');
      });

      expect(loginResult).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should set loading state during login', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const loginPromise = act(async () => {
        return result.current.login('test@example.com', 'password123');
      });

      // isLoading should be true during login
      expect(result.current.isLoading).toBe(true);

      await loginPromise;

      // isLoading should be false after login completes
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('logout function', () => {
    it('should successfully logout', async () => {
      const mockUser = { email: 'test@example.com', name: 'test' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', 'test-token');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});
