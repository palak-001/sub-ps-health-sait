import { motion } from "framer-motion";

export function ScoreDisplay({ score }) {
  // Score is 0-100
  let emoji = "😎";
  let message = "CRUSHING IT!";
  if (score < 30) { emoji = "😴"; message = "NEEDS WORK"; }
  else if (score < 60) { emoji = "🤔"; message = "GETTING THERE"; }
  else if (score < 90) { emoji = "💪"; message = "GREAT WORK"; }

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="neobrutalism-card bg-amber-400 p-8 flex flex-col md:flex-row items-center justify-between mb-12 relative overflow-hidden"
    >
      <div className="z-10 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">Wellness<br/>Score</h2>
        <p className="text-xl font-bold mt-4 bg-white inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] tracking-widest uppercase">{message}</p>
      </div>
      
      <div className="z-10 flex items-center justify-center mt-8 md:mt-0 relative pr-4">
        <div className="text-[90px] leading-none absolute -left-20 -top-4 rotate-[-15deg] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] z-30">{emoji}</div>
        <div className="h-40 w-40 bg-white rounded-full border-[6px] border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative z-20">
           <span className="text-6xl font-black">{Math.round(score)}</span>
        </div>
      </div>
    </motion.div>
  );
}
