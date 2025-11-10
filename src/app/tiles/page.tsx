'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// TypeScript type definitions
interface TileData {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
  icon: string;
}

// Tile data with unique information
const tilesData: TileData[] = [
  {
    id: '1',
    title: 'Creative Studio',
    description: 'Unleash your imagination with our cutting-edge creative tools and collaborative workspace',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    color: 'from-purple-500 to-pink-500',
    icon: '🎨',
  },
  {
    id: '2',
    title: 'Tech Innovation',
    description: 'Explore the future of technology with AI-powered solutions and next-gen development',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    color: 'from-blue-500 to-cyan-500',
    icon: '💻',
  },
  {
    id: '3',
    title: 'Business Growth',
    description: 'Scale your business with strategic insights and data-driven decision making tools',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    color: 'from-green-500 to-emerald-500',
    icon: '📈',
  },
  {
    id: '4',
    title: 'Design Excellence',
    description: 'Craft beautiful experiences with modern design principles and user-centric approaches',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=300&fit=crop',
    color: 'from-orange-500 to-red-500',
    icon: '✨',
  },
  {
    id: '5',
    title: 'Global Connect',
    description: 'Build connections worldwide through seamless communication and networking platforms',
    image: 'https://images.unsplash.com/photo-1526925539332-aa3b66e35444?w=400&h=300&fit=crop',
    color: 'from-indigo-500 to-purple-500',
    icon: '🌍',
  },
  {
    id: '6',
    title: 'Learning Hub',
    description: 'Expand your knowledge with comprehensive courses and expert-led training programs',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    color: 'from-yellow-500 to-orange-500',
    icon: '📚',
  },
];

export default function TilesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Handle tile click with navigation to result page
  const handleTileClick = (tile: TileData) => {
    setSelectedTile(tile.id);

    // Create URL search params with tile data
    const searchParams = new URLSearchParams({
      tileId: tile.id,
      title: tile.title,
      description: tile.description,
      image: tile.image,
      icon: tile.icon,
    });

    // Navigate to result page with tile data
    setTimeout(() => {
      router.push(`/result?${searchParams.toString()}`);
    }, 300); // Small delay for animation effect
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <p className="mt-4 text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* User Info and Logout Button */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="text-white">
            <p className="text-sm text-gray-400">Welcome back,</p>
            <p className="text-lg font-semibold">{user?.name || user?.email || 'User'}</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium text-sm
                     hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                     focus:ring-red-500 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Choose Your Path
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select an option below to explore amazing features and possibilities
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {tilesData.map((tile, index) => (
            <div
              key={tile.id}
              className={`tile-card group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 ease-out hover:scale-105 ${
                selectedTile === tile.id ? 'scale-95 opacity-50' : ''
              }`}
              onClick={() => handleTileClick(tile)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Background Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tile.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              ></div>

              {/* Card Content */}
              <div className="relative bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden group-hover:border-gray-500 transition-all duration-300">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${tile.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  </div>

                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4 text-5xl transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-500">
                    {tile.icon}
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-6 relative">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                    {tile.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                    {tile.description}
                  </p>

                  {/* Hover Arrow Indicator */}
                  <div className="mt-4 flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                    <span className="text-sm font-semibold">Explore</span>
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>

              {/* Glow Effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${tile.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
              ></div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-gray-400">
          <p className="text-sm">
            Click on any tile to view detailed information and get started
          </p>
        </div>
      </div>
    </div>
  );
}
