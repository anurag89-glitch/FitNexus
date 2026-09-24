import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Flame, 
  Droplets, 
  Plus, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  Utensils, 
  Apple, 
  ShieldAlert, 
  Check, 
  X,
  Clock,
  Target
} from 'lucide-react';
import { 
  GOAL_NUTRITION_CONFIG, 
  DEFAULT_MEALS, 
  FOOD_LIBRARY 
} from '../../data/mockData';
import { CircularProgress, ProgressBar } from '../common/ProgressBar';
import { sounds } from '../../utils/audio';

export default function NutritionScreen({ 
  nutritionData, 
  onUpdateNutrition, 
  onClose,
  recentWorkoutCompleted = false 
}) {
  const [selectedGoal, setSelectedGoal] = useState(nutritionData.goal || "Build Muscle");
  const [meals, setMeals] = useState(DEFAULT_MEALS);
  const [waterLiters, setWaterLiters] = useState(nutritionData.waterLiters || 1.8);
  const [consumed, setConsumed] = useState(nutritionData.consumed || { calories: 1420, protein: 82, carbs: 165, fats: 48 });
  
  // Food Search & Library
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals
  const [selectedMealDetail, setSelectedMealDetail] = useState(null);
  const [addFoodModalItem, setAddFoodModalItem] = useState(null);
  const [selectedMealSlot, setSelectedMealSlot] = useState("LUNCH");

  const goalConfig = GOAL_NUTRITION_CONFIG[selectedGoal] || GOAL_NUTRITION_CONFIG["Build Muscle"];
  const targetCalories = goalConfig.calories;
  const targetProtein = goalConfig.protein;
  const targetCarbs = goalConfig.carbs;
  const targetFats = goalConfig.fats;

  const calPercent = Math.min(100, Math.round((consumed.calories / targetCalories) * 100));
  const remainingCalories = Math.max(0, targetCalories - consumed.calories);

  // Switch Goal handler
  const handleGoalChange = (newGoal) => {
    sounds.click();
    setSelectedGoal(newGoal);
    if (onUpdateNutrition) {
      onUpdateNutrition({
        ...nutritionData,
        goal: newGoal,
        targets: GOAL_NUTRITION_CONFIG[newGoal]
      });
    }
  };

  // Add Water
  const handleAddWater = (amountMl) => {
    sounds.beep();
    const updated = Math.min(4.0, Math.round((waterLiters + amountMl / 1000) * 10) / 10);
    setWaterLiters(updated);
    if (onUpdateNutrition) {
      onUpdateNutrition({
        ...nutritionData,
        waterLiters: updated
      });
    }
  };

  // Add Food to Meal Slot
  const handleLogFood = (food, slot) => {
    sounds.repSuccess();
    const newConsumed = {
      calories: consumed.calories + food.calories,
      protein: consumed.protein + food.protein,
      carbs: consumed.carbs + (food.carbs || 0),
      fats: consumed.fats + (food.fats || 0)
    };
    setConsumed(newConsumed);

    // Also update meals list
    setMeals(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        slot: slot,
        title: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs || 0,
        fats: food.fats || 0,
        time: "Just now",
        description: `Added from Food Library to ${slot}`,
        ingredients: [`1 serving ${food.name}`],
        logged: true
      }
    ]);

    setAddFoodModalItem(null);

    if (onUpdateNutrition) {
      onUpdateNutrition({
        ...nutritionData,
        consumed: newConsumed
      });
    }
  };

  // Filtered foods
  const filteredFoods = useMemo(() => {
    return FOOD_LIBRARY.filter(food => {
      const matchSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = selectedCategory === "All" || food.tags.includes(selectedCategory) || food.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ["All", "High Protein", "Breakfast", "Lunch", "Dinner", "Snacks", "Fruits", "Vegetables", "Indian Food"];

  return (
    <div className="screen-content" id="screen-nutrition" style={{ paddingBottom: '90px' }}>
      {/* 1. Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="icon-btn" 
            onClick={() => {
              sounds.click();
              onClose();
            }}
            title="Back to Previous Screen"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Nutrition Guide
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Fuel your body. Support your goals.
            </p>
          </div>
        </div>

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
          background: 'rgba(0, 210, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-cyan)'
        }}>
          <Utensils size={18} color="var(--accent-cyan)" />
        </div>
      </div>

      {/* 2. Fitness-Goal Based Guidance Selector */}
      <div className="nexus-card glow-border" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={15} color="var(--accent-cyan)" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Fitness Goal
            </span>
          </div>

          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tap to customize</span>
        </div>

        {/* Goal Selector Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
          {["Build Muscle", "Lose Weight", "Improve Fitness", "Maintain Weight", "Improve Endurance"].map(g => (
            <button
              key={g}
              onClick={() => handleGoalChange(g)}
              style={{
                background: selectedGoal === g ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' : 'rgba(255, 255, 255, 0.05)',
                color: selectedGoal === g ? '#030816' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '11.5px',
                padding: '6px 12px',
                borderRadius: '99px',
                border: selectedGoal === g ? 'none' : '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Dynamic Goal Guidance Text */}
        <div style={{
          marginTop: '10px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '10px 12px',
          borderLeft: '3px solid var(--accent-cyan)'
        }}>
          <p style={{ fontSize: '12.5px', color: '#e2e8f0', lineHeight: '1.45' }}>
            “{goalConfig.guidance}”
          </p>
          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
            ✦ Strategy: {goalConfig.mealHighlight}
          </span>
        </div>
      </div>

      {/* 3. TODAY'S NUTRITION (Calories & Macro Gauges) */}
      <div className="nexus-card" style={{ padding: '18px' }}>
        <div className="section-header" style={{ marginBottom: '14px' }}>
          <span className="section-title">TODAY'S NUTRITION</span>
          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            {remainingCalories} kcal left
          </span>
        </div>

        {/* Center Calorie Circle + Macros Breakdown */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: '18px' }}>
          {/* Main Calorie Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress 
              percentage={calPercent} 
              size={90} 
              strokeWidth={8} 
              color="var(--accent-cyan)"
            >
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)', display: 'block', lineHeight: '1' }}>
                  {consumed.calories}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  / {targetCalories}
                </span>
              </div>
            </CircularProgress>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginTop: '8px' }}>
              Calories
            </span>
          </div>

          {/* Macro Bars 3-Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, paddingLeft: '20px' }}>
            {/* Protein */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>Protein</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>
                  {consumed.protein} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>/ {targetProtein} g</span>
                </span>
              </div>
              <ProgressBar value={consumed.protein} max={targetProtein} height={6} color="linear-gradient(90deg, #00d2ff, #0a84ff)" />
            </div>

            {/* Carbs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>Carbohydrates</span>
                <span style={{ color: 'var(--accent-neon)', fontWeight: 800 }}>
                  {consumed.carbs} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>/ {targetCarbs} g</span>
                </span>
              </div>
              <ProgressBar value={consumed.carbs} max={targetCarbs} height={6} color="linear-gradient(90deg, #38bdf8, #0ea5e9)" />
            </div>

            {/* Fats */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>Fats</span>
                <span style={{ color: 'var(--accent-orange)', fontWeight: 800 }}>
                  {consumed.fats} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>/ {targetFats} g</span>
                </span>
              </div>
              <ProgressBar value={consumed.fats} max={targetFats} height={6} color="linear-gradient(90deg, #f59e0b, #d97706)" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI Nutrition Assistant 🤖 */}
      <div 
        className="nexus-card"
        style={{
          background: 'linear-gradient(135deg, rgba(8, 24, 52, 0.95) 0%, rgba(4, 14, 32, 0.9) 100%)',
          border: '1px solid var(--border-cyan)',
          boxShadow: '0 0 25px rgba(0, 210, 255, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI Nutrition Guide 🤖
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentWorkoutCompleted && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle2 size={15} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '12.5px', color: '#e2e8f0', lineHeight: '1.4' }}>
                “Great workout session! Consider adding a protein-rich snack (like Greek yogurt or a scoop of whey) within 45 minutes to optimize muscle protein synthesis.”
              </p>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '14px', flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: '12.5px', color: '#e2e8f0', lineHeight: '1.4' }}>
              “You have approximately <strong>{remainingCalories} kcal</strong> and <strong>{Math.max(0, targetProtein - consumed.protein)}g protein</strong> remaining for today's {selectedGoal} target.”
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '14px', flexShrink: 0 }}>💧</span>
            <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
              {waterLiters < 2.0 
                ? "Your hydration is at " + waterLiters + "L. Try adding 250ml water now to maintain optimal muscle cellular hydration."
                : "Hydration tracking is on point (" + waterLiters + "L / 2.5L logged). Great job!"}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Hydration Tracker */}
      <div className="nexus-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Droplets size={18} color="var(--accent-neon)" />
            </div>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Water Intake</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Daily hydration target</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
              {waterLiters} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ 2.5 L</span>
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <ProgressBar value={waterLiters} max={2.5} height={8} color="linear-gradient(90deg, #38bdf8, #00d2ff)" />

        {/* Quick Log Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={() => handleAddWater(250)}
            className="btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
          >
            <Plus size={14} /> +250 ml
          </button>
          <button
            onClick={() => handleAddWater(500)}
            className="btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
          >
            <Plus size={14} /> +500 ml
          </button>
        </div>
      </div>

      {/* 6. Personalized Daily Meal Plan */}
      <div>
        <div className="section-header">
          <span className="section-title">Today's Meal Plan</span>
          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600 }}>5 Meals Scheduled</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="nexus-card"
              style={{
                padding: '14px 16px',
                border: meal.logged ? '1px solid rgba(0, 210, 255, 0.2)' : '1px solid var(--border-subtle)',
                background: 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: 'rgba(0, 210, 255, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  {meal.slot}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {meal.time}
                  </span>
                  {meal.logged && (
                    <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 700 }}>
                      ✓ Logged
                    </span>
                  )}
                </div>
              </div>

              <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 800, marginBottom: '4px' }}>
                {meal.title}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Flame size={13} color="var(--accent-orange)" />
                    ~{meal.calories} kcal
                  </span>
                  <span>•</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    Protein: {meal.protein}g
                  </span>
                </div>

                <button
                  onClick={() => {
                    sounds.click();
                    setSelectedMealDetail(meal);
                  }}
                  className="btn-ghost"
                  style={{ fontSize: '12px', color: 'var(--accent-cyan)', padding: '4px 8px' }}
                >
                  View Meal →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Searchable Food Library */}
      <div>
        <div className="section-header" style={{ marginTop: '6px' }}>
          <span className="section-title">Food Library</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{filteredFoods.length} foods</span>
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-card)',
          borderRadius: '14px',
          padding: '10px 14px',
          border: '1px solid var(--border-subtle)',
          gap: '8px',
          marginBottom: '10px'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text"
            placeholder="Search food (e.g. Paneer, Eggs, Oats)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              width: '100%',
              fontFamily: 'var(--font-body)'
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                sounds.click();
                setSelectedCategory(cat);
              }}
              style={{
                background: selectedCategory === cat ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: selectedCategory === cat ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '6px' }}>
          {filteredFoods.map(food => (
            <div
              key={food.id}
              className="nexus-card"
              style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div>
                <h4 style={{ fontSize: '13.5px', color: '#fff', fontWeight: 700, lineHeight: '1.2' }}>
                  {food.name}
                </h4>
                <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Protein: {food.protein}g</span>
                  <span style={{ display: 'block', color: 'var(--text-muted)' }}>Calories: {food.calories} kcal</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.click();
                  setAddFoodModalItem(food);
                }}
                className="btn-secondary"
                style={{ padding: '6px 8px', fontSize: '11px', width: '100%', justifyContent: 'center' }}
              >
                <Plus size={12} /> + Add to Meal
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Safety & Product Limitation Disclaimer */}
      <div style={{
        marginTop: '16px',
        padding: '12px 14px',
        borderRadius: '14px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px'
      }}>
        <ShieldAlert size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
          <strong>General Wellness Notice:</strong> FitNexus Nutrition Guide is designed for general fitness and informational guidance only. It does not provide medical advice or clinical dietetics. Individuals with medical conditions, allergies, or specific requirements should consult a qualified healthcare professional.
        </p>
      </div>

      {/* Meal Detail Modal */}
      {selectedMealDetail && (
        <div className="modal-overlay" onClick={() => setSelectedMealDetail(null)}>
          <div className="modal-content-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-grabber" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--accent-cyan)',
                background: 'rgba(0, 210, 255, 0.15)',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {selectedMealDetail.slot}
              </span>

              <button className="icon-btn" onClick={() => setSelectedMealDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {selectedMealDetail.title}
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              {selectedMealDetail.description}
            </p>

            {/* Macro Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Calories</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{selectedMealDetail.calories}</div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Protein</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-cyan)' }}>{selectedMealDetail.protein}g</div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Carbs</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-neon)' }}>{selectedMealDetail.carbs}g</div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Fats</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-orange)' }}>{selectedMealDetail.fats}g</div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '6px' }}>
                Key Ingredients
              </span>
              <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {selectedMealDetail.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            <button className="btn-primary" onClick={() => setSelectedMealDetail(null)}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add Food to Meal Modal */}
      {addFoodModalItem && (
        <div className="modal-overlay" onClick={() => setAddFoodModalItem(null)}>
          <div className="modal-content-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-grabber" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                Log Food to Today's Meals
              </h3>
              <button className="icon-btn" onClick={() => setAddFoodModalItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(0, 210, 255, 0.08)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border-cyan)' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{addFoodModalItem.name}</h4>
              <span style={{ fontSize: '12px', color: 'var(--accent-cyan)' }}>
                {addFoodModalItem.calories} kcal • {addFoodModalItem.protein}g Protein
              </span>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '8px' }}>
                Select Meal Slot:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {["BREAKFAST", "LUNCH", "EVENING SNACK", "DINNER"].map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedMealSlot(slot)}
                    style={{
                      background: selectedMealSlot === slot ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                      color: selectedMealSlot === slot ? '#030816' : '#fff',
                      fontWeight: 700,
                      fontSize: '12px',
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => handleLogFood(addFoodModalItem, selectedMealSlot)}
            >
              <Check size={16} /> Confirm & Log Food
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
