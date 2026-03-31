import { Droplets, Moon, Dumbbell, Utensils, MonitorOff, SmilePlus } from "lucide-react";

export const HABIT_DEFINITIONS = [
  { id: "hydration", name: "Hydration", icon: Droplets, color: "bg-blue-300", unit: "glasses", type: "number" },
  { id: "sleep", name: "Sleep", icon: Moon, color: "bg-purple-300", unit: "hours", type: "number" },
  { id: "activity", name: "Physical Activity", icon: Dumbbell, color: "bg-red-300", unit: "mins", type: "number" },
  { id: "meals", name: "Healthy Meals", icon: Utensils, color: "bg-green-300", unit: "meals", type: "number" },
  { id: "screen_break", name: "Screen Breaks", icon: MonitorOff, color: "bg-amber-300", unit: "taken", type: "boolean" },
  { id: "stress_relief", name: "Stress Relief", icon: SmilePlus, color: "bg-pink-300", unit: "practiced", type: "boolean" }
];

export const DEFAULT_TARGETS = {
  hydration: 8,
  sleep: 8,
  activity: 30,
  meals: 3,
  screen_break: true, // boolean target
  stress_relief: true  // boolean target
};
