import { useState, useMemo } from "react";
import { format, subDays } from "date-fns";
import { Settings, RefreshCw, Hand } from "lucide-react";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { HABIT_DEFINITIONS, DEFAULT_TARGETS } from "./constants";
import { HabitCard } from "./components/HabitCard";
import { ScoreDisplay } from "./components/ScoreDisplay";
import { StreakCalendar } from "./components/StreakCalendar";
import { TrendChart } from "./components/TrendChart";
import { SettingsModal } from "./components/SettingsModal";
import { TipEngine } from "./components/TipEngine";
import { HabitBlocksMatter } from "./components/HabitBlocksMatter";

export default function App() {
  const [targets, setTargets] = useLocalStorage("habit-targets", DEFAULT_TARGETS);
  const [history, setHistory] = useLocalStorage("habit-history", {});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePage, setActivePage] = useState("home"); // "home" or "wellness"

  const todayStr = format(new Date(), "yyyy-MM-dd");

  // Get today's details or initialize
  const todayDetails = history[todayStr]?.details || {};

  const handleUpdateToday = (habitId, newActual) => {
    const updatedDetails = {
      ...todayDetails,
      [habitId]: { target: targets[habitId], actual: newActual }
    };
    
    // Calculate new overall score
    const newScore = calculateScore(updatedDetails, targets);

    setHistory((prev) => ({
      ...prev,
      [todayStr]: {
        date: todayStr,
        score: newScore,
        details: updatedDetails
      }
    }));
  };

  const calculateScore = (details, currentTargets) => {
    let totalPercentage = 0;
    
    HABIT_DEFINITIONS.forEach(habit => {
      const detail = details[habit.id];
      const target = currentTargets[habit.id];
      
      if (!detail) return; // 0%
      
      if (habit.type === "number") {
        totalPercentage += Math.min((detail.actual / target) * 100, 100) || 0;
      } else {
        totalPercentage += detail.actual ? 100 : 0;
      }
    });

    return totalPercentage / HABIT_DEFINITIONS.length;
  };

  const fillMockData = () => {
    const newHistory = { ...history };
    const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    // Generate past 14 days
    for (let i = 1; i <= 14; i++) {
        const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
        
        const details = {};
        HABIT_DEFINITIONS.forEach(h => {
          if (h.type === "number") {
            const target = targets[h.id];
            // 70% chance to hit target, else random partial
            details[h.id] = {
                target,
                actual: Math.random() > 0.3 ? target : randomBetween(0, target - 1)
            };
          } else {
            details[h.id] = {
                target: targets[h.id],
                actual: Math.random() > 0.2 // 80% chance to do it
            };
          }
        });

        newHistory[dateStr] = {
            date: dateStr,
            score: calculateScore(details, targets),
            details
        };
    }
    setHistory(newHistory);
  };

  // Compile last 7 days for the components
  const last7DaysData = useMemo(() => {
    return Array.from({ length: 7 })
      .map((_, i) => {
        const dStr = format(subDays(new Date(), 6 - i), "yyyy-MM-dd"); // Chronological order
        return history[dStr] || { date: dStr, score: 0, details: {} };
      });
  }, [history]);

  return (
    <div className="min-h-screen pb-20 selection:bg-black selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-red-500 p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3">
              <Hand size={40} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Habit Tracker</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setActivePage("home")}
              className={`neobrutalism-button py-2 px-4 flex items-center gap-2 text-sm ${activePage === "home" ? "bg-yellow-400" : "bg-white"}`}
            >
              Home
            </button>
            <button 
              onClick={() => setActivePage("wellness")}
              className={`neobrutalism-button py-2 px-4 flex items-center gap-2 text-sm ${activePage === "wellness" ? "bg-yellow-400" : "bg-white"}`}
            >
              Wellness Score
            </button>
            <button 
              onClick={fillMockData}
              className="neobrutalism-button bg-pink-400 py-2 px-4 flex items-center gap-2 text-sm"
              title="Add 14 days of realistic mock data"
            >
              <RefreshCw size={18} strokeWidth={3} /> Demo Data
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="neobrutalism-button bg-white py-2 px-4 flex items-center gap-2 text-sm"
            >
              <Settings size={18} strokeWidth={3} /> Settings
            </button>
          </div>
        </header>

        {activePage === "home" ? (
          <HabitBlocksMatter />
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScoreDisplay score={history[todayStr]?.score || 0} />
            
            {/* Daily Habits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {HABIT_DEFINITIONS.map(habit => {
                const actual = todayDetails[habit.id]?.actual;
                const target = targets[habit.id];
                const defaultValue = habit.type === "number" ? 0 : false;
                const currentValue = actual ?? defaultValue;

                const handleIncrement = () => {
                  if (habit.type === "number") {
                    const current = Number(currentValue) || 0;
                    const goal = Number(target) || 0;
                    handleUpdateToday(habit.id, Math.min(current + 1, goal));
                    return;
                  }

                  handleUpdateToday(habit.id, true);
                };

                const handleDecrement = () => {
                  if (habit.type === "number") {
                    const current = Number(currentValue) || 0;
                    handleUpdateToday(habit.id, Math.max(current - 1, 0));
                    return;
                  }

                  handleUpdateToday(habit.id, false);
                };
                
                return (
                  <HabitCard 
                    key={habit.id}
                    habit={habit}
                    target={target}
                    currentValue={currentValue}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                  />
                );
              })}
            </div>

            <StreakCalendar last7DaysData={last7DaysData} />
            <TrendChart last7DaysData={last7DaysData} />
            <TipEngine last7DaysData={last7DaysData} />
          </div>
        )}

      </div>



      {isSettingsOpen && (
        <SettingsModal 
          initialTargets={targets}
          onSave={(newTargets) => {
            setTargets(newTargets);
            // Re-calculate today's score if targets changed?
            // To keep simple, it will apply to next entries. But for today, maybe we should update.
            // But we can let it be, to preserve historical context.
            setIsSettingsOpen(false);
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
