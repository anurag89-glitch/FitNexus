import React, { useEffect } from 'react';
import { sounds } from '../../utils/audio';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    sounds.beep();
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="splash-screen"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 999,
        background: 'radial-gradient(circle at 50% 40%, #081a38 0%, #040812 75%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        textAlign: 'center',
        animation: 'fadeIn 0.4s ease-out'
      }}
    >
      {/* Glow effect behind logo */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{
          position: 'absolute',
          inset: '-20px',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.45) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(16px)',
          animation: 'pulseGlow 2s infinite alternate ease-in-out'
        }} />

        <img 
          src="/fitnexus-logo.png" 
          alt="FitNexus Logo" 
          style={{
            width: '138px',
            height: '138px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--accent-cyan)',
            boxShadow: '0 0 35px rgba(0, 210, 255, 0.5), inset 0 0 20px rgba(0, 210, 255, 0.3)',
            position: 'relative',
            zIndex: 2
          }}
        />
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '36px',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        background: 'linear-gradient(135deg, #ffffff 40%, #00d2ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '8px'
      }}>
        FitNexus
      </h1>

      <p style={{
        fontSize: '15px',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        letterSpacing: '0.04em',
        marginBottom: '40px'
      }}>
        Train Smarter. Move Better.
      </p>

      {/* Modern Loader Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="splash-dot" style={{ animationDelay: '0s' }} />
        <div className="splash-dot" style={{ animationDelay: '0.2s' }} />
        <div className="splash-dot" style={{ animationDelay: '0.4s' }} />
      </div>

      <span style={{
        fontSize: '11px',
        color: 'var(--accent-cyan)',
        marginTop: '20px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase'
      }}>
        Initializing AI Engine...
      </span>

      <style>{`
        .splash-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan);
          animation: dotBounce 1.2s infinite ease-in-out;
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.9); opacity: 0.3; }
          100% { transform: scale(1.15); opacity: 0.65; }
        }
      `}</style>
    </div>
  );
}
