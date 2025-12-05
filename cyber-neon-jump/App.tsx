import React, { useState, useRef, useEffect, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle High Score
  useEffect(() => {
    const saved = localStorage.getItem('cyberjump_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('cyberjump_highscore', score.toString());
    }
  }, [score, highScore]);

  // Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        
        // If resizing during start, re-draw background (optional, simple trigger)
        if (gameState === GameState.START) {
            // Force re-render of canvas logic could be done here, 
            // but for simplicity we rely on the game loop or next state change
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener('resize', handleResize);
  }, [gameState]);

  const handleStart = useCallback(() => {
    setGameState(GameState.PLAYING);
    setScore(0);
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(GameState.START); // Go to start first to reset logic cleanly in useEffects
    setTimeout(() => setGameState(GameState.PLAYING), 10);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <GameCanvas 
        gameState={gameState} 
        setGameState={setGameState} 
        setScore={setScore}
        canvasRef={canvasRef}
      />
      <UIOverlay 
        gameState={gameState}
        score={score}
        highScore={highScore}
        onStart={handleStart}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default App;