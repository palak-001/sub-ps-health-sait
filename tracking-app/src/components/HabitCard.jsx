import { Check, Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function HabitCard({ habit, target, currentValue, onIncrement, onDecrement }) {
  const isNumber = habit.type === "number";
  const goalValue = isNumber ? Number(target) || 0 : target ? 1 : 0;
  const progressValue = isNumber ? Number(currentValue) || 0 : currentValue ? 1 : 0;
  const isComplete = goalValue > 0 && progressValue >= goalValue;

  const handleCardClick = () => {
    onIncrement();
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
          {isComplete ? `Goal Met: ${goalValue} ${habit.unit}` : `${progressValue} / ${goalValue} ${habit.unit}`}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDecrement();
          }}
          className="h-10 w-10 flex items-center justify-center border-4 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
          aria-label={`Decrease ${habit.name}`}
        >
          <Minus size={18} strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIncrement();
          }}
          className="h-10 w-10 flex items-center justify-center border-4 border-black bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
          aria-label={`Increase ${habit.name}`}
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
}
