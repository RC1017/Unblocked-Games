/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Gamepad2, Search, X, Maximize2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setGames(gamesData);
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setSelectedGame(null)}
          >
            <div className="p-2 bg-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              UNBLOCKED<span className="text-emerald-500">HUB</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              New
            </button>
            <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              Popular
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  layoutId={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-semibold text-sm tracking-wide">{game.title}</h3>
                    <p className="text-xs text-white/40 mt-1">Play Now</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Games</span>
                </button>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{selectedGame.title}</h2>
                  <button
                    onClick={toggleFullScreen}
                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`relative bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ${isFullScreen ? 'fixed inset-0 z-[100] rounded-none' : 'aspect-video w-full'}`}>
                {isFullScreen && (
                  <button
                    onClick={toggleFullScreen}
                    className="absolute top-6 right-6 z-[101] p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {!isFullScreen && (
                <div className="mt-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                  <h3 className="text-lg font-semibold mb-2">About {selectedGame.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Enjoy {selectedGame.title} unblocked on our platform. High performance, no lag, and completely free to play. 
                    Use your keyboard or mouse to control the game.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tighter">UNBLOCKED HUB</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-white/20">© 2024 Unblocked Games Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
