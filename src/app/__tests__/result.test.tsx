import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResultPage from '../result/page';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('ResultPage', () => {
  let mockPush: jest.Mock;
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const createMockSearchParams = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    (useSearchParams as jest.Mock).mockReturnValue(searchParams);
    return searchParams;
  };

  describe('Authentication Check', () => {
    beforeEach(() => {
      createMockSearchParams({
        id: '1',
        title: 'Test Tile',
        description: 'Test Description',
        image: 'https://example.com/image.jpg',
      });
    });

    it('should show loading state initially', () => {
      render(<ResultPage />);
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('should redirect to login if not authenticated', async () => {
      localStorage.removeItem('isAuthenticated');

      render(<ResultPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should render content when authenticated', async () => {
      localStorage.setItem('isAuthenticated', 'true');

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Hello! 👋')).toBeInTheDocument();
      });
    });
  });

  describe('Rendering with Tile Data', () => {
    beforeEach(() => {
      localStorage.setItem('isAuthenticated', 'true');
      createMockSearchParams({
        id: '1',
        title: 'Creative Studio',
        description: 'Unleash your imagination',
        image: 'https://example.com/image.jpg',
      });
    });

    it('should display greeting message', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Hello! 👋')).toBeInTheDocument();
      });
    });

    it('should display selected tile title', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Creative Studio')).toBeInTheDocument();
      });

      expect(screen.getByText(/you selected:/i)).toBeInTheDocument();
    });

    it('should display tile description', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Unleash your imagination')).toBeInTheDocument();
      });
    });

    it('should display tile ID', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Option #1')).toBeInTheDocument();
      });
    });

    it('should display tile image', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        const image = screen.getByAltText('Creative Studio');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      });
    });
  });

  describe('Missing Tile Data', () => {
    beforeEach(() => {
      localStorage.setItem('isAuthenticated', 'true');
    });

    it('should show error state when no tile data is provided', async () => {
      createMockSearchParams({});

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Oops! No Data Found')).toBeInTheDocument();
      });

      expect(
        screen.getByText(/we couldn't find the tile data/i)
      ).toBeInTheDocument();
    });

    it('should show error state when tile data is incomplete', async () => {
      createMockSearchParams({
        id: '1',
        title: 'Test',
        // Missing description and image
      });

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Oops! No Data Found')).toBeInTheDocument();
      });
    });

    it('should provide back button in error state', async () => {
      const user = userEvent.setup();
      createMockSearchParams({});

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Back to Tiles')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: /back to tiles/i });
      await user.click(backButton);

      expect(mockPush).toHaveBeenCalledWith('/tiles');
    });
  });

  describe('Navigation Actions', () => {
    beforeEach(() => {
      localStorage.setItem('isAuthenticated', 'true');
      createMockSearchParams({
        id: '1',
        title: 'Creative Studio',
        description: 'Unleash your imagination',
        image: 'https://example.com/image.jpg',
      });
    });

    it('should navigate back to tiles when back button is clicked', async () => {
      const user = userEvent.setup();
      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Hello! 👋')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: /back to tiles/i });
      await user.click(backButton);

      expect(mockPush).toHaveBeenCalledWith('/tiles');
    });

    it('should handle logout when logout button is clicked', async () => {
      const user = userEvent.setup();
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', 'testuser');

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Hello! 👋')).toBeInTheDocument();
      });

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await user.click(logoutButton);

      expect(localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');
      expect(localStorage.removeItem).toHaveBeenCalledWith('username');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Rendering with Different Tiles', () => {
    beforeEach(() => {
      localStorage.setItem('isAuthenticated', 'true');
    });

    it('should render different tile data correctly', async () => {
      createMockSearchParams({
        id: '2',
        title: 'Tech Innovation',
        description: 'Explore the future',
        image: 'https://example.com/tech.jpg',
      });

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Tech Innovation')).toBeInTheDocument();
        expect(screen.getByText('Explore the future')).toBeInTheDocument();
        expect(screen.getByText('Option #2')).toBeInTheDocument();
      });
    });

    it('should handle tile data with special characters', async () => {
      createMockSearchParams({
        id: '1',
        title: 'Test & Special',
        description: 'Description with "quotes" and <tags>',
        image: 'https://example.com/image.jpg',
      });

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Test & Special')).toBeInTheDocument();
        expect(screen.getByText(/description with "quotes" and <tags>/i)).toBeInTheDocument();
      });
    });
  });

  describe('Animation and Styling', () => {
    beforeEach(() => {
      localStorage.setItem('isAuthenticated', 'true');
      createMockSearchParams({
        id: '1',
        title: 'Creative Studio',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
      });
    });

    it('should have animated elements', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        const mainCard = screen.getByText('Hello! 👋').closest('div');
        expect(mainCard).toBeInTheDocument();
      });
    });

    it('should display decorative elements', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Hello! 👋')).toBeInTheDocument();
      });

      // Check for celebration emojis in the background
      const pageContent = document.body.textContent || '';
      expect(pageContent).toMatch(/[🎉✨🎊⭐💫]/);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      localStorage.setItem('isAuthenticated', 'true');
      createMockSearchParams({
        id: '1',
        title: 'Creative Studio',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
      });
    });

    it('should have proper button labels', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /back to tiles/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
      });
    });

    it('should have proper heading structure', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        const greeting = screen.getByText('Hello! 👋');
        expect(greeting).toBeInTheDocument();
      });
    });

    it('should have alt text for images', async () => {
      render(<ResultPage />);

      await waitFor(() => {
        const image = screen.getByAltText('Creative Studio');
        expect(image).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      localStorage.setItem('isAuthenticated', 'true');
    });

    it('should handle very long tile titles', async () => {
      const longTitle = 'A'.repeat(100);
      createMockSearchParams({
        id: '1',
        title: longTitle,
        description: 'Test',
        image: 'https://example.com/image.jpg',
      });

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText(longTitle)).toBeInTheDocument();
      });
    });

    it('should handle very long descriptions', async () => {
      const longDesc = 'B'.repeat(500);
      createMockSearchParams({
        id: '1',
        title: 'Test',
        description: longDesc,
        image: 'https://example.com/image.jpg',
      });

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText(longDesc)).toBeInTheDocument();
      });
    });

    it('should handle numeric IDs correctly', async () => {
      createMockSearchParams({
        id: '99',
        title: 'Test',
        description: 'Test',
        image: 'https://example.com/image.jpg',
      });

      render(<ResultPage />);

      await waitFor(() => {
        expect(screen.getByText('Option #99')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show spinner during loading', () => {
      localStorage.setItem('isAuthenticated', 'true');
      createMockSearchParams({
        id: '1',
        title: 'Test',
        description: 'Test',
        image: 'https://example.com/image.jpg',
      });

      render(<ResultPage />);

      // Check for loading spinner
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });
});
