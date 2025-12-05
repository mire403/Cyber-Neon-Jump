import React from 'react';
import { GameState } from '../types';

interface UIOverlayProps {
  gameState: GameState;
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  gameState,
  score,
  highScore,
  onStart,
  onRestart
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center font-['Orbitron'] select-none">
      
      {/* HUD - Always visible when playing, or background in menu */}
      <div className="absolute top-4 right-6 text-right z-10">
        <div className="text-cyan-400 text-xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          SCORE: {score.toString().padStart(6, '0')}
        </div>
        <div className="text-purple-400 text-sm font-semibold tracking-wider">
          HIGH: {highScore.toString().padStart(6, '0')}
        </div>
      </div>

      {/* Start Screen */}
      {gameState === GameState.START && (
        <div className="bg-black/80 backdrop-blur-sm p-12 rounded-2xl border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center pointer-events-auto animate-pulse">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-6 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            CYBER<br/>NEON<br/>JUMP
          </h1>
          <p className="text-gray-300 text-lg mb-8 font-['Rajdhani'] tracking-wider">
            SPACE or TAP to Jump • Double Jump in Air
          </p>
          <button
            onClick={onStart}
            className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-md transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 w-full h-full bg-cyan-500/20 group-hover:bg-cyan-500/40 transition-all"></div>
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
            <span className="relative text-2xl font-bold text-cyan-100 group-hover:text-white tracking-[0.2em]">
              START SYSTEM
            </span>
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === GameState.GAME_OVER && (
        <div className="bg-black/90 backdrop-blur-md p-10 rounded-xl border border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.4)] text-center pointer-events-auto z-20">
          <h2 className="text-5xl font-black text-red-500 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
            SYSTEM FAILURE
          </h2>
          <div className="my-6 space-y-2">
            <p className="text-2xl text-white font-['Rajdhani']">
              FINAL SCORE
            </p>
            <p className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              {score}
            </p>
          </div>
          
          <button
            onClick={onRestart}
            className="mt-4 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all hover:scale-105 tracking-widest"
          >
            REBOOT
          </button>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;