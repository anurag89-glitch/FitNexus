import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Sparkles, Activity, ShieldCheck, Dumbbell } from 'lucide-react';
import { sounds } from '../../utils/audio';

const ONBOARDING_SLIDES = [
  {
    step: 1,
    title: "Your Fitness. Your Way.",
    subtitle: "Personalized workouts designed around your goals.",
    badge: "ADAPTIVE TRAINING",
    icon: Dumbbell,
    visualTag: "Full Body • Strength • Cardio"
  },
  {
    step: 2,
    title: "Train With AI",
    subtitle: "Get intelligent workout guidance and exercise feedback.",
    badge: "VISION POSE ANALYSIS",
    icon: Sparkles,
    visualTag: "Real-time Angle & Depth Correction"
  },
  {
    step: 3,
    title: "Track Your Progress",
    subtitle: "Monitor your workouts, activity, goals and achievements in one place.",
    badge: "IOT WEARABLE SYNC",
    icon: Activity,
    visualTag: "Smartwatch Telemetry • Streaks • Milestones"
  }
];

export default function OnboardingScreen({ onFinish }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    sounds.click();
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      sounds.repSuccess();
      onFinish();
    }
  };

  const handleSkip = () => {
    sounds.click();
    onFinish();
  };

  const slide = ONBOARDING_SLIDES[currentSlide];
  const isLast = currentSlide === ONBOARDING_SLIDES.length - 1;
  const SlideIcon = slide.icon;

  return (
    <div 
      className="onboarding-screen"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 500,
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px 32px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {/* Top Header with Brand and Skip Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src="/fitnexus-logo.png" 
            alt="FitNexus" 
            style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-cyan)' }} 
          />
          <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff', letterSpacing: '-0.02em' }}>
            FitNexus
          </span>
        </div>

        {!isLast && (
          <button 
            className="btn-ghost" 
            id="btn-onboarding-skip"
            onClick={handleSkip}
          >
            Skip
          </button>
        )}
      </div>

      {/* Center Interactive Artwork / Feature Card */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '36px',
          background: 'radial-gradient(circle at 50% 30%, rgba(0, 210, 255, 0.22) 0%, rgba(7, 14, 28, 0.9) 70%)',
          border: '1.5px solid var(--border-cyan)',
          boxShadow: '0 0 45px rgba(0, 210, 255, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '28px'
        }}>
          {/* Logo badge in center */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--accent-cyan)',
            boxShadow: '0 0 20px rgba(0, 210, 255, 0.5)',
            marginBottom: '10px'
          }}>
            <img src="/fitnexus-logo.png" alt="FitNexus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 210, 255, 0.15)',
            border: '1px solid var(--border-cyan)',
            padding: '4px 10px',
            borderRadius: '99px',
            fontSize: '10.5px',
            fontWeight: 700,
            color: 'var(--accent-cyan)'
          }}>
            <SlideIcon size={12} />
            {slide.badge}
          </div>
        </div>

        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--accent-cyan)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          Step {slide.step} of 3
        </span>

        <h2 style={{
          fontSize: '26px',
          fontWeight: 800,
          color: '#fff',
          lineHeight: '1.25',
          marginBottom: '10px'
        }}>
          {slide.title}
        </h2>

        <p style={{
          fontSize: '14.5px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          maxWidth: '300px'
        }}>
          {slide.subtitle}
        </p>

        <div style={{
          marginTop: '16px',
          padding: '6px 14px',
          borderRadius: '99px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          fontSize: '11.5px',
          color: 'var(--text-muted)'
        }}>
          {slide.visualTag}
        </div>
      </div>

      {/* Bottom Controls: Indicators + CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          {ONBOARDING_SLIDES.map((s, idx) => (
            <div
              key={s.step}
              onClick={() => {
                sounds.click();
                setCurrentSlide(idx);
              }}
              style={{
                width: idx === currentSlide ? '28px' : '8px',
                height: '8px',
                borderRadius: '99px',
                backgroundColor: idx === currentSlide ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.15)',
                boxShadow: idx === currentSlide ? '0 0 10px var(--accent-cyan)' : 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>

        {/* Action Button */}
        <button 
          className="btn-primary" 
          id="btn-onboarding-next"
          onClick={handleNext}
        >
          {isLast ? (
            <>
              Get Started
              <ArrowRight size={18} />
            </>
          ) : (
            <>
              Next
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
