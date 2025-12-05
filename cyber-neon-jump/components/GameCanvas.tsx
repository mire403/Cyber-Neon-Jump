import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, Player, Platform, Particle } from '../types';
import { GAME_CONSTANTS, COLORS } from '../constants';
import { randomRange, checkAABB } from '../utils/math';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setScore: (score: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  setGameState,
  setScore,
  canvasRef
}) => {
  // Game Logic State (Refs to avoid re-renders)
  const requestRef = useRef<number>();
  const scoreRef = useRef<number>(0);
  const speedRef = useRef<number>(GAME_CONSTANTS.INITIAL_SPEED);
  
  const playerRef = useRef<Player>({
    pos: { x: 100, y: 300 },
    vel: { x: 0, y: 0 },
    width: GAME_CONSTANTS.PLAYER_SIZE,
    height: GAME_CONSTANTS.PLAYER_SIZE,
    color: COLORS.player,
    isGrounded: false,
    canDoubleJump: true,
    jumpCount: 0
  });

  const platformsRef = useRef<Platform[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef<number>(0);

  // Initialize Game
  const initGame = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    scoreRef.current = 0;
    speedRef.current = GAME_CONSTANTS.INITIAL_SPEED;
    setScore(0);

    // Reset Player
    playerRef.current = {
      pos: { x: 100, y: canvas.height - 150 },
      vel: { x: 0, y: 0 },
      width: GAME_CONSTANTS.PLAYER_SIZE,
      height: GAME_CONSTANTS.PLAYER_SIZE,
      color: COLORS.player,
      isGrounded: true,
      canDoubleJump: true,
      jumpCount: 0
    };

    // Initial Platform (Ground)
    platformsRef.current = [
      {
        x: 0,
        y: canvas.height - 50,
        width: canvas.width,
        height: 50,
        type: 'NORMAL',
        passed: false
      }
    ];

    particlesRef.current = [];
  }, [canvasRef, setScore]);

  // Create Explosion Particles
  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < GAME_CONSTANTS.PARTICLE_COUNT; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: randomRange(-5, 5),
        vy: randomRange(-5, 5),
        life: 1.0,
        maxLife: 1.0,
        color: color,
        size: randomRange(2, 5)
      });
    }
  };

  // Create Trail Particles
  const createTrail = (x: number, y: number) => {
    particlesRef.current.push({
      x,
      y,
      vx: -speedRef.current * 0.5, // Move slightly left relative to player
      vy: randomRange(-1, 1),
      life: 0.5,
      maxLife: 0.5,
      color: COLORS.playerTrail,
      size: randomRange(2, 4)
    });
  };

  // Main Game Loop
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (gameState !== GameState.PLAYING) {
      // Just render the background/idle state if needed
      // But usually we just stop the loop or render a static frame
      // We will continue rendering for "feel" even if paused, 
      // but logic updates stop.
      if (gameState === GameState.GAME_OVER) return; // Stop rendering on game over to freeze frame
    }

    frameCountRef.current++;

    // --- UPDATE LOGIC ---
    
    // Increase Speed
    if (speedRef.current < GAME_CONSTANTS.MAX_SPEED) {
      speedRef.current += GAME_CONSTANTS.SPEED_INCREMENT;
    }

    const player = playerRef.current;

    // Apply Gravity
    player.vel.y += GAME_CONSTANTS.GRAVITY;
    player.pos.y += player.vel.y;

    // Trail Effect
    if (frameCountRef.current % 3 === 0) {
      createTrail(player.pos.x + player.width / 2, player.pos.y + player.height / 2);
    }

    // Platform Logic
    let onGround = false;
    
    // Move platforms & Collision
    for (let i = platformsRef.current.length - 1; i >= 0; i--) {
      const p = platformsRef.current[i];
      p.x -= speedRef.current;

      // Collision Detection
      // Only collide if falling downwards and player bottom is near platform top
      if (
        player.vel.y > 0 &&
        player.pos.x + player.width > p.x &&
        player.pos.x < p.x + p.width &&
        player.pos.y + player.height >= p.y &&
        player.pos.y + player.height <= p.y + player.vel.y + 10 // tolerance
      ) {
        player.pos.y = p.y - player.height;
        player.vel.y = 0;
        onGround = true;
        player.jumpCount = 0; // Reset jumps on land
      }

      // Score counting
      if (!p.passed && p.x + p.width < player.pos.x) {
        p.passed = true;
        scoreRef.current += 10;
        setScore(Math.floor(scoreRef.current));
      }

      // Remove off-screen
      if (p.x + p.width < -100) {
        platformsRef.current.splice(i, 1);
      }
    }

    player.isGrounded = onGround;

    // Generate new platforms
    const lastPlatform = platformsRef.current[platformsRef.current.length - 1];
    if (lastPlatform && canvas.width - (lastPlatform.x + lastPlatform.width) > 0) {
        // Need a new platform?
        // Wait until there is a gap
        const currentGap = canvas.width - (lastPlatform.x + lastPlatform.width);
        // We want a gap between MIN and MAX
        // But since we are scrolling, we check if the *screen edge* is far enough from last platform?
        // Actually, easier: check distance from right edge.
    }
    
    // Correct generation logic: ensure we always have platforms ahead
    if (lastPlatform.x + lastPlatform.width < canvas.width + 100) {
       const gap = randomRange(GAME_CONSTANTS.PLATFORM_GAP_MIN, GAME_CONSTANTS.PLATFORM_GAP_MAX);
       const yVariation = randomRange(-100, 100);
       let newY = lastPlatform.y + yVariation;
       
       // Clamp Y
       if (newY < 150) newY = 150;
       if (newY > canvas.height - 50) newY = canvas.height - 50;

       const newW = randomRange(GAME_CONSTANTS.PLATFORM_MIN_WIDTH, GAME_CONSTANTS.PLATFORM_MAX_WIDTH);
       
       platformsRef.current.push({
         x: lastPlatform.x + lastPlatform.width + gap,
         y: newY,
         width: newW,
         height: GAME_CONSTANTS.PLATFORM_HEIGHT,
         type: Math.random() > 0.9 ? 'BOOST' : 'NORMAL',
         passed: false
       });
    }

    // Check Death (Fall off screen)
    if (player.pos.y > canvas.height) {
      createExplosion(player.pos.x, player.pos.y, COLORS.platformTrap);
      setGameState(GameState.GAME_OVER);
    }

    // Update Particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      p.size *= 0.95;
      if (p.life <= 0) particlesRef.current.splice(i, 1);
    }


    // --- RENDER ---
    // Clear
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Parallax Grid (Floor perception)
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    const gridOffset = (frameCountRef.current * speedRef.current) % 50;
    
    ctx.beginPath();
    // Vertical lines moving left
    for (let x = -gridOffset; x < canvas.width; x += 50) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    // Horizontal lines (Static perspective)
    for (let y = canvas.height; y > canvas.height / 2; y -= 40) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();


    // Draw Particles
    particlesRef.current.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw Platforms
    platformsRef.current.forEach(p => {
      ctx.shadowBlur = 15;
      ctx.shadowColor = p.type === 'BOOST' ? COLORS.platformBoost : COLORS.platformNormal;
      ctx.fillStyle = p.type === 'BOOST' ? COLORS.platformBoost : COLORS.platformNormal;
      ctx.fillRect(p.x, p.y, p.width, p.height);
      
      // Top line detail
      ctx.fillStyle = '#fff';
      ctx.fillRect(p.x, p.y, p.width, 2);
    });

    // Draw Player
    ctx.shadowBlur = 20;
    ctx.shadowColor = player.color;
    ctx.fillStyle = player.color;
    // Rotation effect based on jump
    ctx.save();
    ctx.translate(player.pos.x + player.width/2, player.pos.y + player.height/2);
    // Rotate based on vertical velocity to give dynamic feel
    const rotation = player.vel.y * 0.05;
    ctx.rotate(rotation);
    ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
    
    // Internal glow detail
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-player.width/4, -player.height/4, player.width/2, player.height/2);
    ctx.restore();

    // Reset Shadow
    ctx.shadowBlur = 0;


    requestRef.current = requestAnimationFrame(loop);
  }, [gameState, setGameState, setScore]);


  // Input Handling
  const handleJump = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;
    
    const player = playerRef.current;
    
    if (player.isGrounded) {
      player.vel.y = GAME_CONSTANTS.JUMP_FORCE;
      player.isGrounded = false;
      player.jumpCount = 1;
      createTrail(player.pos.x, player.pos.y + player.height);
    } else if (player.canDoubleJump && player.jumpCount < 2) {
      player.vel.y = GAME_CONSTANTS.JUMP_FORCE * 0.8; // Slightly weaker double jump
      player.jumpCount = 2;
      createExplosion(player.pos.x + player.width/2, player.pos.y + player.height, '#fff');
    }
  }, [gameState]);

  // Handle Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (gameState === GameState.START || gameState === GameState.GAME_OVER) {
          // Restart logic handled by UI overlay usually, but space can trigger start
          if (gameState === GameState.START) setGameState(GameState.PLAYING);
        } else {
          handleJump();
        }
      }
    };
    
    const handleTouch = () => {
        if (gameState === GameState.PLAYING) handleJump();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [gameState, handleJump, setGameState]);


  // Loop Management
  useEffect(() => {
    if (gameState === GameState.START) {
      initGame();
      // Draw initial frame
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (gameState === GameState.PLAYING) {
      requestRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, initGame, loop]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full"
    />
  );
};

export default GameCanvas;