import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { HABIT_DEFINITIONS } from "../constants";

export function TipEngine({ last7DaysData }) {
  if (!last7DaysData || last7DaysData.length === 0) return null;

  const habitAverages = {};
  HABIT_DEFINITIONS.forEach(habit => {
    habitAverages[habit.id] = { totalPercentage: 0, count: 0 };
  });

  last7DaysData.forEach(day => {
    if (day.details) {
      Object.keys(day.details).forEach(key => {
        const { target, actual } = day.details[key];
        let percentage = 0;
        const habitDef = HABIT_DEFINITIONS.find(h => h.id === key);
        if (habitDef?.type === "number") {
           percentage = Math.min((Number(actual) / Number(target)) * 100, 100) || 0;
        } else {
           percentage = actual ? 100 : 0;
        }
        
        if (habitAverages[key]) {
          habitAverages[key].totalPercentage += percentage;
          habitAverages[key].count += 1;
        }
      });
    }
  });

  let lowestHabitId = null;
  let lowestAvg = 101;

  Object.keys(habitAverages).forEach(key => {
    const data = habitAverages[key];
    if (data.count > 0) {
      const avg = data.totalPercentage / data.count;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowestHabitId = key;
      }
    }
  });

  if (!lowestHabitId || lowestAvg === 100) {
    return (
      <TipCard 
        color="bg-green-400" 
        title="Perfect Record!" 
        text="You're totally crushing it. All your habits are solidly on track this week." 
      />
    );
  }

  const tips = {
    hydration: "Your hydration is trailing this week. Try keeping a full colorful bottle visible on your desk!",
    sleep: "Your sleep average is under target. Try winding down 30 mins earlier tonight with a book.",
    activity: "Physical activity is a bit low. Can you squeeze in a brisk 15-minute walk today?",
    meals: "Healthy meals are dropping. Consider prepping some snacks today or choosing a fresher option!",
    screen_break: "You're missing screen breaks! Set a loud, funky alarm to step away every hour.",
    stress_relief: "Stress relief activities are taking a back seat. Even 5 minutes of deep breathing helps immensely!"
  };

  const habitDef = HABIT_DEFINITIONS.find(h => h.id === lowestHabitId);

  return (
    <TipCard 
      color="bg-purple-300" 
      title={`Focus Area: ${habitDef?.name}`} 
      text={tips[lowestHabitId] || "Keep pushing forward!"} 
    />
  );
}

function TipCard({ color, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`neobrutalism-card mt-12 mb-20 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 ${color}`}
    >
      <div className="bg-white p-4 rounded-full border-4 border-black shrink-0">
        <Lightbulb size={40} className="text-amber-400 fill-amber-300" strokeWidth={2} />
      </div>
      <div className="text-center sm:text-left">
        <h3 className="text-2xl font-black uppercase tracking-wide">{title}</h3>
        <p className="text-lg font-bold mt-2 leading-snug">{text}</p>
      </div>
    </motion.div>
  );
}
