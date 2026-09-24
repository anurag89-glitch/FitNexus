import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USER, 
  WORKOUTS, 
  NOTIFICATIONS as INITIAL_NOTIFICATIONS,
  INITIAL_NUTRITION
} from './data/mockData';

// Common Components
import StatusBar from './components/common/StatusBar';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import NotificationDrawer from './components/common/NotificationDrawer';
import WearableModal from './components/common/WearableModal';

// Screens
import SplashScreen from './components/screens/SplashScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import HomeScreen from './components/screens/HomeScreen';
import WorkoutsScreen from './components/screens/WorkoutsScreen';
import WorkoutDetailModal from './components/screens/WorkoutDetailModal';
import ActiveWorkoutScreen from './components/screens/ActiveWorkoutScreen';
import AICoachScreen from './components/screens/AICoachScreen';
import AICameraModal from './components/screens/AICameraModal';
import ProgressScreen from './components/screens/ProgressScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import NutritionScreen from './components/screens/NutritionScreen';

import { sounds } from './utils/audio';
import { Smartphone, Monitor, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function App() {
  // App Phase: 'splash' | 'onboarding' | 'main'
  const [appPhase, setAppPhase] = useState('splash');
  
  // Navigation Tab: 'home' | 'workouts' | 'ai-coach' | 'progress' | 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // App State
  const [user, setUser] = useState(INITIAL_USER);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [nutritionData, setNutritionData] = useState(INITIAL_NUTRITION);

  // Modals & Active Modes
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isWorkoutDetailOpen, setIsWorkoutDetailOpen] = useState(false);
  const [activeWorkoutSession, setActiveWorkoutSession] = useState(null);
  const [isAICameraOpen, setIsAICameraOpen] = useState(false);
  const [aiExerciseChoice, setAiExerciseChoice] = useState("Squats");
  const [isWearableOpen, setIsWearableOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);

  // Viewport Frame Mode (for desktop reviewers to preview mobile phone frame or expand)
  const [isFullView, setIsFullView] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Toggle sound
  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Open workout detail sheet
  const handleOpenWorkoutDetails = (workout) => {
    setSelectedWorkout(workout);
    setIsWorkoutDetailOpen(true);
  };

  // Launch active workout session
  const handleStartWorkout = (workout) => {
    setIsWorkoutDetailOpen(false);
    setActiveWorkoutSession(workout || WORKOUTS[0]);
  };

  // Workout completed callback
  const handleCompleteWorkout = ({ calories, minutes }) => {
    setActiveWorkoutSession(null);
    setUser(prev => ({
      ...prev,
      todayStats: {
        ...prev.todayStats,
        calories: prev.todayStats.calories + (calories || 220),
        workoutMinutes: prev.todayStats.workoutMinutes + (minutes || 25),
        activeMinutes: prev.todayStats.activeMinutes + (minutes || 25)
      },
      weeklyGoalCompleted: Math.min(prev.weeklyGoalTotal, prev.weeklyGoalCompleted + 1)
    }));
    setActiveTab('progress');
  };

  // Notification action handler
  const handleNotificationAction = (action) => {
    setIsNotificationsOpen(false);
    if (action === 'start_workout') {
      handleOpenWorkoutDetails(WORKOUTS[0]);
    } else if (action === 'view_progress') {
      setActiveTab('progress');
    } else if (action === 'open_wearable') {
      setIsWearableOpen(true);
    } else if (action === 'open_ai_coach') {
      setActiveTab('ai-coach');
    }
  };

  // Clear notifications
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Wearable synced
  const handleWearableSynced = () => {
    setUser(prev => ({
      ...prev,
      lastSynced: "Just now",
      todayStats: {
        ...prev.todayStats,
        steps: prev.todayStats.steps + Math.floor(Math.random() * 40)
      }
    }));
  };

  // Reset Demo to Splash
  const handleResetDemo = () => {
    setActiveWorkoutSession(null);
    setIsAICameraOpen(false);
    setIsWearableOpen(false);
    setIsWorkoutDetailOpen(false);
    setIsNotificationsOpen(false);
    setIsNutritionOpen(false);
    setUser(INITIAL_USER);
    setNutritionData(INITIAL_NUTRITION);
    setAppPhase('splash');
  };

  const unreadNotificationCount = notifications.filter(n => n.unread).length;

  return (
    <div className="app-viewport-wrapper">
      {/* Desktop Helper Bar for Previewers & Evaluators */}
      <div className="desktop-controls-bar">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontWeight: 600 }}>
          <img src="/fitnexus-logo.png" alt="logo" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />
          FitNexus Mobile Preview
        </span>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <button onClick={() => setIsFullView(!isFullView)} title="Toggle Mobile Phone Bezel / Full Screen">
          {isFullView ? <Smartphone size={14} /> : <Monitor size={14} />}
          {isFullView ? "Phone Frame" : "Full View"}
        </button>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <button onClick={handleToggleSound} title="Toggle Audio Feedback">
          {soundEnabled ? <Volume2 size={14} color="#00d2ff" /> : <VolumeX size={14} />}
          {soundEnabled ? "Audio On" : "Audio Muted"}
        </button>
      </div>

      {/* Main Mobile App Shell */}
      <div className={`phone-shell ${isFullView ? 'full-view' : ''}`} id="fitnexus-mobile-app">
        {/* Status Bar */}
        <StatusBar />

        {/* Phase 1: Splash Screen */}
        {appPhase === 'splash' && (
          <SplashScreen onComplete={() => setAppPhase('onboarding')} />
        )}

        {/* Phase 2: Onboarding Screen */}
        {appPhase === 'onboarding' && (
          <OnboardingScreen onFinish={() => setAppPhase('main')} />
        )}

        {/* Phase 3: Main Application */}
        {appPhase === 'main' && (
          <>
            {/* Main Header (except during active workout or camera mode) */}
            <Header 
              user={user}
              unreadCount={unreadNotificationCount}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenWearable={() => setIsWearableOpen(true)}
              onSelectTab={setActiveTab}
            />

            {/* Screen Viewport with Vertical Scroll */}
            <main className="app-screen-container">
              {activeTab === 'home' && (
                <HomeScreen 
                  user={user}
                  nutritionData={nutritionData}
                  featuredWorkout={WORKOUTS[0]}
                  onStartWorkout={handleStartWorkout}
                  onOpenWorkoutDetails={handleOpenWorkoutDetails}
                  onSelectTab={setActiveTab}
                  onOpenWearable={() => setIsWearableOpen(true)}
                  onOpenAICoach={() => setActiveTab('ai-coach')}
                  onOpenNutrition={() => setIsNutritionOpen(true)}
                />
              )}

              {activeTab === 'workouts' && (
                <WorkoutsScreen 
                  onSelectWorkout={handleOpenWorkoutDetails}
                  onStartDirectly={handleStartWorkout}
                />
              )}

              {activeTab === 'ai-coach' && (
                <AICoachScreen 
                  onStartAIAnalysis={(ex) => {
                    setAiExerciseChoice(ex || "Squats");
                    setIsAICameraOpen(true);
                  }}
                  onStartRecommendedWorkout={() => handleStartWorkout(WORKOUTS[0])}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressScreen user={user} />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen 
                  user={user}
                  onOpenWearable={() => setIsWearableOpen(true)}
                  onOpenNutrition={() => setIsNutritionOpen(true)}
                  onResetDemo={handleResetDemo}
                />
              )}
            </main>

            {/* Persistent Bottom Navigation */}
            <BottomNav 
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />

            {/* iOS Home Indicator Line */}
            <div className="home-indicator-bar" />
          </>
        )}

        {/* Workout Details Modal */}
        <WorkoutDetailModal 
          isOpen={isWorkoutDetailOpen}
          workout={selectedWorkout}
          onClose={() => setIsWorkoutDetailOpen(false)}
          onStartWorkout={handleStartWorkout}
        />

        {/* Active Workout Screen Modal */}
        {activeWorkoutSession && (
          <ActiveWorkoutScreen 
            workout={activeWorkoutSession}
            onClose={() => setActiveWorkoutSession(null)}
            onCompleteWorkout={handleCompleteWorkout}
            onLaunchAICamera={() => {
              setAiExerciseChoice("Squats");
              setIsAICameraOpen(true);
            }}
          />
        )}

        {/* AI Camera Vision Real-time Pose Detection Modal */}
        <AICameraModal 
          isOpen={isAICameraOpen}
          initialExercise={aiExerciseChoice}
          onClose={() => setIsAICameraOpen(false)}
        />

        {/* Nutrition / Diet Plan Full-Screen Modal */}
        {isNutritionOpen && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 60,
            background: 'var(--bg-primary)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <NutritionScreen
              nutritionData={nutritionData}
              onUpdateNutrition={(updated) => setNutritionData(prev => ({ ...prev, ...updated }))}
              onClose={() => setIsNutritionOpen(false)}
            />
          </div>
        )}

        {/* Smartwatch / IoT Telemetry Modal */}
        <WearableModal 
          isOpen={isWearableOpen}
          user={user}
          onClose={() => setIsWearableOpen(false)}
          onSyncComplete={handleWearableSynced}
        />

        {/* Notifications Drawer */}
        <NotificationDrawer 
          isOpen={isNotificationsOpen}
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onActionClick={handleNotificationAction}
          onClearAll={handleClearNotifications}
        />
      </div>
    </div>
  );
}
