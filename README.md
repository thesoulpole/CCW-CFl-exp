# NextJS Login & Tiles - Modern Web Application

A beautiful, modern Next.js application featuring user authentication, interactive tile selection, and a responsive result page. Built with TypeScript, Tailwind CSS, and comprehensive testing.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)
![Test Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)

## Features

- 🔐 **Authentication System**: Secure login with email/password validation
- 🎨 **Modern UI**: Beautiful gradient designs with smooth animations
- 📱 **Responsive Design**: Fully responsive across all device sizes
- 🎯 **Interactive Tiles**: 6 unique, clickable tiles with hover effects
- ✨ **Result Page**: Dynamic result display with celebration animations
- 🧪 **Comprehensive Testing**: 90%+ code coverage with Jest & React Testing Library
- 🎭 **Error Boundaries**: Graceful error handling with custom error pages
- ⚡ **Loading States**: Smooth loading indicators for better UX
- 🔒 **Type Safety**: Full TypeScript implementation
- ♿ **Accessible**: WCAG compliant with ARIA labels

## Tech Stack

- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **Testing**: Jest, React Testing Library
- **State Management**: React Context API
- **Image Optimization**: Next.js Image component

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ccw-cfl-exp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Project Structure

```
src/
├── app/
│   ├── __tests__/           # Test files
│   │   ├── AuthContext.test.tsx
│   │   ├── page.test.tsx
│   │   ├── tiles.test.tsx
│   │   └── result.test.tsx
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx  # Authentication context
│   ├── tiles/               # Tiles page
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── result/              # Result page
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── page.tsx             # Login page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── loading.tsx          # Global loading state
│   ├── error.tsx            # Global error boundary
│   └── not-found.tsx        # 404 page
├── jest.config.js           # Jest configuration
└── jest.setup.js            # Jest setup file
```

## Usage

### Login Page

The application starts with a beautiful login page featuring:
- Email and password validation
- Password visibility toggle
- Animated loading states
- Error handling with user-friendly messages

**Demo Credentials**: Any valid email format with a password of at least 6 characters

### Tiles Page

After successful login, users are presented with 6 interactive tiles:
- 🎨 Creative Studio
- 💻 Tech Innovation
- 📈 Business Growth
- ✨ Design Excellence
- 🌍 Global Connect
- 📚 Learning Hub

Each tile features:
- Hover animations
- Image backgrounds
- Gradient overlays
- Smooth transitions

### Result Page

Upon selecting a tile, users see a celebration result page displaying:
- Selected tile information
- Animated elements
- Navigation options (Back to Tiles, Logout)

## Authentication

The application uses a Context-based authentication system:

- **Login**: Validates email format and password length
- **Logout**: Clears user session and redirects to login
- **Protected Routes**: Tiles and Result pages require authentication
- **Session Persistence**: Uses localStorage for session management

## Testing

The project includes comprehensive test coverage (90%+):

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **Statement Coverage**: 90.68%
- **Branch Coverage**: 87.5%
- **Function Coverage**: 93.33%
- **Line Coverage**: 91.19%

### Test Files

- `AuthContext.test.tsx`: Authentication logic tests
- `page.test.tsx`: Login page component tests
- `tiles.test.tsx`: Tiles page component tests
- `result.test.tsx`: Result page component tests

## Accessibility

The application follows WCAG 2.1 guidelines:

- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ Color contrast compliance

## Performance Optimizations

- Next.js Image component for optimized images
- CSS animations (GPU accelerated)
- Code splitting with Next.js App Router
- Loading states to prevent layout shift
- Optimized bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

Your Name

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Unsplash for the beautiful images
- React Testing Library for testing utilities

## Support

For support, email your-email@example.com or open an issue in the repository.

## Roadmap

- [ ] Add backend API integration
- [ ] Implement real authentication with JWT
- [ ] Add user profile page
- [ ] Implement tile customization
- [ ] Add dark mode toggle
- [ ] Implement internationalization (i18n)
- [ ] Add E2E tests with Playwright
- [ ] Implement analytics

---

Made with ❤️ using Next.js, TypeScript, and Tailwind CSS
