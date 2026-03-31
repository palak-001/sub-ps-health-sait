import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function HabitCard({ habit, target, currentValue, onComplete, onToggle }) {
  const isNumber = habit.type === "number";
  const isComplete = isNumber ? currentValue >= target : currentValue === true;

  const handleCardClick = () => {
    if (isNumber) {
      if (!isComplete) {
        onComplete();
      } else {
        onToggle(0); // reset if they tap again? Or maybe just do nothing if complete, or reset.
      }
    } else {
      onToggle(!currentValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: 2, x: 2, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
      whileTap={{ y: 4, x: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
      onClick={handleCardClick}
      className={cn(
        "cursor-pointer neobrutalism-card p-5 flex flex-col justify-between h-full select-none gap-4 sm:gap-0",
        isComplete ? habit.color : "bg-white"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="bg-black text-white p-3 rounded-md border-2 border-black">
          <habit.icon size={28} />
        </div>
        <div className={cn("p-2 rounded-full border-4 border-black", isComplete ? "bg-black text-white" : "bg-white text-black")}>
          {isComplete ? <Check size={24} strokeWidth={3} /> : <X size={24} strokeWidth={3} />}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-black text-2xl uppercase tracking-tight">{habit.name}</h3>
        <p className="font-bold text-gray-800 text-lg mt-1">
          {isNumber ? (
            isComplete ? `Goal Met: ${target} ${habit.unit}` : `0 / ${target} ${habit.unit}`
          ) : (
             `Target: Daily`
          )}
        </p>
      </div>
    </motion.div>
  );
}
