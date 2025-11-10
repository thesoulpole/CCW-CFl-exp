"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// TypeScript interface for tile data
interface TileData {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tileData, setTileData] = useState<TileData | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  // Animation effect on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated (checking localStorage)
      const authStatus = localStorage.getItem("isAuthenticated");

      if (authStatus === "true") {
        setIsAuthenticated(true);
      } else {
        // Redirect to login if not authenticated
        router.push("/");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Parse tile data from URL params
  useEffect(() => {
    if (isAuthenticated) {
      const id = searchParams.get("id");
      const title = searchParams.get("title");
      const description = searchParams.get("description");
      const image = searchParams.get("image");

      if (id && title && description && image) {
        setTileData({
          id: parseInt(id),
          title,
          description,
          image,
        });
      }
    }
  }, [searchParams, isAuthenticated]);

  // Handle back to tiles navigation
  const handleBackToTiles = () => {
    router.push("/tiles");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    router.push("/");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  // Show error state if no tile data
  if (!tileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Oops! No Data Found
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn't find the tile data. Please select a tile from the tiles page.
            </p>
            <button
              onClick={handleBackToTiles}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Back to Tiles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main celebration card */}
        <div
          className={`bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Confetti decorative header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 h-3"></div>

          <div className="p-8 sm:p-12">
            {/* Hello greeting with animation */}
            <div className="text-center mb-8">
              <h1
                className={`text-6xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4 transform transition-all duration-1000 delay-200 ${
                  mounted ? "scale-100 rotate-0" : "scale-50 rotate-12"
                }`}
              >
                Hello! 👋
              </h1>
              <p
                className={`text-xl sm:text-2xl text-gray-600 font-medium transform transition-all duration-1000 delay-400 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                You selected:{" "}
                <span className="text-purple-600 font-bold">{tileData.title}</span>
              </p>
            </div>

            {/* Tile display section */}
            <div
              className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 mb-8 transform transition-all duration-1000 delay-600 ${
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {/* Tile image */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src={tileData.image}
                    alt={tileData.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Tile information */}
              <div className="text-center space-y-4">
                <div className="inline-block bg-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-sm text-gray-500 font-medium">
                    Option #{tileData.id}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                  {tileData.title}
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  {tileData.description}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-800 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              {/* Back to Tiles button */}
              <button
                onClick={handleBackToTiles}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Tiles
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="group relative px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>

          {/* Decorative footer */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 h-3"></div>
        </div>

        {/* Floating celebration elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-float-${i % 3}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1,
              }}
            >
              <div className="text-4xl">
                {["🎉", "✨", "🎊", "⭐", "💫"][i % 5]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float-0 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }
        @keyframes float-2 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(90deg);
          }
        }
        .animate-float-0 {
          animation: float-0 8s ease-in-out infinite;
        }
        .animate-float-1 {
          animation: float-1 10s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
