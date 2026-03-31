import { useState } from "react";
import { X } from "lucide-react";
import { HABIT_DEFINITIONS } from "../constants";

export function SettingsModal({ initialTargets, onSave, onClose }) {
  const [targets, setTargets] = useState(initialTargets);

  const handleChange = (id, value, type) => {
    let parsedValue = value;
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    }
    setTargets({ ...targets, [id]: parsedValue });
  };

  const handleSave = () => {
    // ensure no empty numbers
    const finalTargets = { ...targets };
    Object.keys(finalTargets).forEach(key => {
      const def = HABIT_DEFINITIONS.find(h => h.id === key);
      if (def?.type === "number" && (finalTargets[key] === "" || finalTargets[key] <= 0)) {
        finalTargets[key] = 1;
      }
    });
    onSave(finalTargets);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="neobrutalism-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-4 border-black p-4 md:p-6 bg-blue-300">
          <h2 className="text-2xl font-black uppercase">Goal Configuration</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white border-2 border-transparent hover:border-black rounded-full transition-colors"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        
        <div className="p-4 md:p-6 flex flex-col gap-6">
          {HABIT_DEFINITIONS.map(habit => (
            <div key={habit.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded border-2 border-black ${habit.color}`}>
                  <habit.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-none">{habit.name}</h4>
                  <span className="text-sm font-bold text-gray-600 uppercase">Target ({habit.unit})</span>
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                {habit.type === "number" ? (
                  <input 
                    type="number" 
                    min="1"
                    className="w-24 p-2 text-center text-xl font-bold border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-y-[2px] focus:translate-x-[2px] focus:shadow-none"
                    value={targets[habit.id]}
                    onChange={(e) => handleChange(habit.id, e.target.value, "number")}
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl">YES</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <button 
            onClick={handleSave}
            className="neobrutalism-button bg-green-400 mt-4 py-4 w-full text-xl"
          >
            Save Targets
          </button>
        </div>
      </div>
    </div>
  );
}
