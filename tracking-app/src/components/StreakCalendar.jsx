import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function StreakCalendar({ last7DaysData }) {
  // last7DaysData is an array of 7 items: { date: "YYYY-MM-DD", score: number, allCompleted: boolean }
  
  const getColor = (score) => {
    if (score === 100) return "bg-green-500";
    if (score > 0) return "bg-amber-400";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="neobrutalism-card mt-12 p-6 md:p-8"
    >
      <h3 className="text-2xl font-black uppercase mb-6">7-Day Streak</h3>
      <div className="flex justify-between md:justify-start md:gap-4 items-end">
        {last7DaysData.map((day, i) => {
          const dateObj = parseISO(day.date);
          const dayName = format(dateObj, "EEE");
          
          return (
            <div key={day.date} className="flex flex-col items-center gap-3 relative group">
              <div 
                className={cn(
                  "w-10 h-10 md:w-16 md:h-16 border-4 border-black transition-transform cursor-pointer",
                  "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1",
                  getColor(day.score)
                )}
                title={`Score: ${Math.round(day.score)}%`}
              />
              <span className="font-bold text-sm uppercase">{dayName}</span>
              
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 text-xs font-bold rounded pointer-events-none whitespace-nowrap z-50">
                Score: {Math.round(day.score)}%
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t-[4px] border-black">
        <div className="flex items-center gap-2 font-bold text-sm uppercase">
          <div className="w-4 h-4 bg-green-500 border-2 border-black" /> Perfect
        </div>
        <div className="flex items-center gap-2 font-bold text-sm uppercase">
          <div className="w-4 h-4 bg-amber-400 border-2 border-black" /> Partial
        </div>
        <div className="flex items-center gap-2 font-bold text-sm uppercase">
          <div className="w-4 h-4 bg-red-500 border-2 border-black" /> Missed
        </div>
      </div>
    </motion.div>
  );
}
