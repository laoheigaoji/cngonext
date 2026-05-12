import React, { useEffect, useState } from 'react';

interface WeatherAnimationProps {
  weatherCode: number;
}

// Rain drop component
function RainEffect() {
  const [drops] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
      height: 10 + Math.random() * 15,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-[1px] rounded-full bg-blue-300/60"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animation: `rainfall ${drop.duration}s linear ${drop.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Snow flake component
function SnowEffect() {
  const [flakes] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 4,
      opacity: 0.4 + Math.random() * 0.5,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Sun rays component
function SunEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-300/20 blur-2xl animate-pulse" />
      <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-amber-400/15 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}

// Cloud drift component
function CloudEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-2 left-[10%] w-20 h-8 bg-white/10 rounded-full blur-md" style={{ animation: 'cloudDrift 15s linear infinite' }} />
      <div className="absolute top-6 left-[50%] w-16 h-6 bg-white/8 rounded-full blur-md" style={{ animation: 'cloudDrift 20s linear 5s infinite' }} />
      <div className="absolute top-1 left-[70%] w-24 h-10 bg-white/6 rounded-full blur-lg" style={{ animation: 'cloudDrift 25s linear 10s infinite' }} />
    </div>
  );
}

// Thunder flash component
function ThunderEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-white/0" style={{ animation: 'thunderFlash 4s ease-in-out infinite' }} />
    </div>
  );
}

export default function WeatherAnimation({ weatherCode }: WeatherAnimationProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isRain = (code: number) => code >= 51 && code <= 67 || code >= 80 && code <= 82;
  const isSnow = (code: number) => code >= 71 && code <= 77;
  const isSunny = (code: number) => code <= 2;
  const isCloudy = (code: number) => code >= 3 && code <= 48;
  const isThunder = (code: number) => code >= 95;

  return (
    <>
      {/* Inject keyframe animations */}
      <style jsx global>{`
        @keyframes rainfall {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(200px); opacity: 0; }
        }
        @keyframes snowfall {
          0% { transform: translateY(-10px) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(200px) translateX(20px); opacity: 0; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes thunderFlash {
          0%, 89%, 91%, 93%, 100% { background: transparent; }
          90% { background: rgba(255,255,255,0.3); }
          92% { background: transparent; }
        }
      `}</style>
      {isRain(weatherCode) && <RainEffect />}
      {isSnow(weatherCode) && <SnowEffect />}
      {isSunny(weatherCode) && <SunEffect />}
      {isCloudy(weatherCode) && <CloudEffect />}
      {isThunder(weatherCode) && <ThunderEffect />}
      {isThunder(weatherCode) && <RainEffect />}
    </>
  );
}
