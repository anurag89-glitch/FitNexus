import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  Brain, 
  Activity, 
  Zap, 
  MessageSquare, 
  Send 
} from 'lucide-react';
import { AI_COACH_DATA } from '../../data/mockData';
import { sounds } from '../../utils/audio';

export default function AICoachScreen({
  onStartAIAnalysis,
  onStartRecommendedWorkout
}) {
  const [selectedExercise, setSelectedExercise] = useState('Squats');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: "Hello Ayush! I analyzed your last session. Your squat depth hit 92°—solid progress. How can I help you today?" }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const quickPrompts = [
    "How's my squat form?",
    "Should I rest tomorrow?",
    "What to eat post-workout?"
  ];

  const handleSendPrompt = (promptText) => {
    sounds.click();
    const userText = promptText || inputMsg;
    if (!userText.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');

    setTimeout(() => {
      let reply = "Based on your current telemetry and intermediate training load, keep your core brace engaged throughout sets.";
      if (userText.includes("squat")) {
        reply = "Your squat knee stability was 98%, but remember to keep your chest elevated to prevent the 34° forward spine tilt flagged during reps 4–8.";
      } else if (userText.includes("rest")) {
        reply = "Your smartwatch shows 78 BPM resting heart rate and 84% consistency. You are well-recovered for a moderate intensity session!";
      } else if (userText.includes("eat") || userText.includes("protein")) {
        reply = "Target 25-30g of fast-absorbing protein with complex carbs within 45 minutes to maximize myofibrillar protein synthesis.";
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      sounds.repSuccess();
    }, 650);
  };

  return (
    <div className="screen-content" id="screen-ai-coach">
      {/* 1. Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <Sparkles size={22} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            AI Fitness Coach
          </h2>
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          Your intelligent workout companion.
        </p>
      </div>

      {/* 2. Hero Feature Card: Start Camera-Guided Workout */}
      <div 
        className="nexus-card glow-border"
        style={{
          background: 'radial-gradient(circle at 85% 15%, rgba(0, 210, 255, 0.28) 0%, rgba(9, 20, 42, 0.95) 70%)',
          padding: '22px 20px',
          border: '1.5px solid var(--accent-cyan)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 9px',
            borderRadius: '99px',
            background: 'rgba(0, 210, 255, 0.2)',
            color: 'var(--accent-cyan)',
            border: '1px solid var(--border-cyan)'
          }}>
            COMPUTER VISION
          </span>
          <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 600 }}>
            Live Pose Ready
          </span>
        </div>

        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginBottom: '6px' }}>
          Start Camera-Guided Workout
        </h3>

        <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.45', marginBottom: '14px' }}>
          Real-time human pose estimation and movement tracking powered by on-device computer vision.
        </p>

        {/* Exercise Selection */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--accent-cyan)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}>
            Select Exercise
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {["Squats", "Push-ups", "Lunges", "Jumping Jacks"].map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  sounds.click();
                  setSelectedExercise(ex);
                }}
                style={{
                  background: selectedExercise === ex 
                    ? 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)' 
                    : 'rgba(255, 255, 255, 0.06)',
                  color: selectedExercise === ex ? '#030816' : '#fff',
                  border: selectedExercise === ex ? 'none' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '9px 8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedExercise === ex ? '0 0 12px rgba(0, 210, 255, 0.35)' : 'none'
                }}
              >
                {ex === "Squats" ? "Squat" : ex === "Push-ups" ? "Push Up" : ex === "Lunges" ? "Lunge" : "Jumping Jack"}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="btn-primary" 
          id="btn-start-ai-analysis"
          onClick={() => {
            sounds.click();
            onStartAIAnalysis(selectedExercise);
          }}
          style={{ fontSize: '15px' }}
        >
          <Camera size={19} color="#030816" />
          📷 Start AI Analysis
        </button>
      </div>

      {/* 3. Today's AI Recommendation */}
      <div className="nexus-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Brain size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Today's AI Recommendation
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Updated Today</span>
        </div>

        <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 700, lineHeight: '1.4', marginBottom: '6px' }}>
          “{AI_COACH_DATA.todayRecommendation}”
        </h4>

        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '12px' }}>
          {AI_COACH_DATA.recommendationDetails}
        </p>

        <button 
          className="btn-secondary" 
          onClick={() => {
            sounds.click();
            onStartRecommendedWorkout();
          }}
          style={{ width: '100%', fontSize: '13px' }}
        >
          <span>Start Recommended Full-Body Routine</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* 4. Recent AI Analysis (Squats 86%, Push Ups 91%, Lunges 84%) */}
      <div>
        <div className="section-header">
          <span className="section-title">Recent AI Analysis</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>Avg 87%</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {AI_COACH_DATA.recentAnalyses.map((item) => (
            <div
              key={item.exercise}
              className="nexus-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px'
              }}
            >
              <div>
                <h4 style={{ fontSize: '14.5px', color: '#fff', fontWeight: 700 }}>
                  {item.exercise}
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {item.feedback}
                </span>
              </div>

              <div style={{
                textAlign: 'right',
                background: 'rgba(0, 210, 255, 0.08)',
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid var(--border-cyan)'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
                  {item.score}%
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Form Score
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Weekly AI Insights */}
      <div 
        className="nexus-card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(10, 25, 45, 0.8) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <TrendingUp size={16} color="var(--accent-green)" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Weekly AI Insights
          </span>
        </div>

        <p style={{ fontSize: '14.5px', color: '#fff', fontWeight: 700, lineHeight: '1.4' }}>
          “{AI_COACH_DATA.weeklyInsight}”
        </p>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Spinal angle deviation decreased from 42° to 34° during knee flexion phases.
        </p>
      </div>

      {/* 6. Interactive AI Coach Chat Assistant */}
      <div className="nexus-card" style={{ background: 'var(--bg-card)', padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <MessageSquare size={15} color="var(--accent-cyan)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
            Ask Coach Nexus
          </span>
        </div>

        {/* Chat Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto', marginBottom: '10px' }}>
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' : 'rgba(255, 255, 255, 0.06)',
                color: msg.sender === 'user' ? '#030816' : '#fff',
                fontWeight: msg.sender === 'user' ? 600 : 400,
                padding: '8px 12px',
                borderRadius: '14px',
                maxWidth: '85%',
                fontSize: '12.5px',
                lineHeight: '1.4'
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Quick prompt pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '8px', scrollbarWidth: 'none' }}>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(p)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '99px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <input 
            type="text"
            placeholder="Ask about your workout or form..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendPrompt();
            }}
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '8px 12px',
              color: '#fff',
              fontSize: '12.5px',
              outline: 'none'
            }}
          />
          <button 
            className="icon-btn" 
            onClick={() => handleSendPrompt()}
            style={{ width: '36px', height: '36px', background: 'var(--accent-cyan)', color: '#030816' }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
