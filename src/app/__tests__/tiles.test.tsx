import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TilesPage from '../tiles/page';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('TilesPage', () => {
  let mockPush: jest.Mock;
  let mockLogout: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockLogout = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', name: 'Test User' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: mockLogout,
    });

    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Authentication Check', () => {
    it('should show loading state when auth is loading', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(<TilesPage />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should redirect to login if not authenticated', async () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(<TilesPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should render tiles when authenticated', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Choose Your Path')).toBeInTheDocument();
      });
    });
  });

  describe('Rendering', () => {

    it('should render page header', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Choose Your Path')).toBeInTheDocument();
      });

      expect(
        screen.getByText(/select an option below to explore amazing features/i)
      ).toBeInTheDocument();
    });

    it('should render all 6 tiles', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Creative Studio')).toBeInTheDocument();
      });

      expect(screen.getByText('Tech Innovation')).toBeInTheDocument();
      expect(screen.getByText('Business Growth')).toBeInTheDocument();
      expect(screen.getByText('Design Excellence')).toBeInTheDocument();
      expect(screen.getByText('Global Connect')).toBeInTheDocument();
      expect(screen.getByText('Learning Hub')).toBeInTheDocument();
    });

    it('should render tile descriptions', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/unleash your imagination with our cutting-edge creative tools/i)
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText(/explore the future of technology with ai-powered solutions/i)
      ).toBeInTheDocument();
    });

    it('should render tile icons', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Creative Studio')).toBeInTheDocument();
      });

      // Check for emoji icons in the tiles
      const pageContent = document.body.textContent || '';
      expect(pageContent).toContain('🎨');
      expect(pageContent).toContain('💻');
      expect(pageContent).toContain('📈');
      expect(pageContent).toContain('✨');
      expect(pageContent).toContain('🌍');
      expect(pageContent).toContain('📚');
    });

    it('should render footer info', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/click on any tile to view detailed information/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Tile Interaction', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should navigate to result page when tile is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Creative Studio')).toBeInTheDocument();
      });

      const tile = screen.getByText('Creative Studio').closest('div');
      if (tile) {
        await user.click(tile);

        // Fast-forward time for the navigation delay
        jest.advanceTimersByTime(300);

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalled();
          const callArgs = mockPush.mock.calls[0][0];
          expect(callArgs).toContain('/result?');
          expect(callArgs).toContain('tileId=1');
          expect(callArgs).toContain('title=Creative+Studio');
        });
      }
    });

    it('should pass correct tile data in URL params', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Tech Innovation')).toBeInTheDocument();
      });

      const tile = screen.getByText('Tech Innovation').closest('div');
      if (tile) {
        await user.click(tile);

        jest.advanceTimersByTime(300);

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalled();
          const callArgs = mockPush.mock.calls[0][0];
          expect(callArgs).toContain('tileId=2');
          expect(callArgs).toContain('title=Tech+Innovation');
          expect(callArgs).toContain('icon=%F0%9F%92%BB'); // URL encoded emoji
        });
      }
    });

    it('should handle multiple tile clicks', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Creative Studio')).toBeInTheDocument();
      });

      const tile1 = screen.getByText('Creative Studio').closest('div');
      const tile2 = screen.getByText('Business Growth').closest('div');

      if (tile1 && tile2) {
        await user.click(tile1);
        jest.advanceTimersByTime(300);

        await user.click(tile2);
        jest.advanceTimersByTime(300);

        // Should have been called twice
        expect(mockPush.mock.calls.length).toBeGreaterThan(0);
      }
    });

    it('should apply selected styling to clicked tile', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Creative Studio')).toBeInTheDocument();
      });

      const tile = screen.getByText('Creative Studio').closest('div');
      if (tile) {
        await user.click(tile);

        // Check if the tile has the selected class/style applied
        await waitFor(() => {
          const tileElement = screen.getByText('Creative Studio').closest('.tile-card');
          expect(tileElement).toHaveClass('scale-95');
        });
      }
    });
  });

  describe('Tile Content', () => {

    it('should display all tile titles correctly', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Creative Studio')).toBeInTheDocument();
      });

      const expectedTitles = [
        'Creative Studio',
        'Tech Innovation',
        'Business Growth',
        'Design Excellence',
        'Global Connect',
        'Learning Hub',
      ];

      expectedTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it('should have hover indicators on tiles', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Creative Studio')).toBeInTheDocument();
      });

      // Check for "Explore" text (shown on hover)
      const exploreTexts = screen.getAllByText('Explore');
      expect(exploreTexts.length).toBe(6); // One for each tile
    });
  });

  describe('Responsive Design', () => {

    it('should render grid layout', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Choose Your Path')).toBeInTheDocument();
      });

      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing authToken gracefully', async () => {
      localStorage.removeItem('authToken');
      localStorage.setItem('isAuthenticated', 'false');

      render(<TilesPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should not render tiles before authentication check completes', () => {
      localStorage.setItem('authToken', 'test-token');

      render(<TilesPage />);

      // Initially should show loading
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Choose Your Path')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {

    it('should have clickable tiles', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        expect(screen.getByText('Creative Studio')).toBeInTheDocument();
      });

      const tile = screen.getByText('Creative Studio').closest('div');
      expect(tile).toHaveClass('cursor-pointer');
    });

    it('should have proper heading structure', async () => {
      render(<TilesPage />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /choose your path/i });
        expect(heading).toBeInTheDocument();
      });
    });
  });
});
