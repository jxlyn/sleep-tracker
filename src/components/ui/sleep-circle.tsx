import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Clock, Percent } from "lucide-react";
import { useInView } from "react-intersection-observer";

interface SleepCircleProps {
  hours: number;
  quality: number;
}

export const SleepCircle: React.FC<SleepCircleProps> = ({ hours, quality }) => {
  const qualityControls = useAnimation();
  const sleepControls = useAnimation();

  const qualityPercent = quality;
  const sleepPercent = Math.min((hours / 12) * 100, 100);

  useEffect(() => {
    qualityControls.start({ strokeDashoffset: 100 - qualityPercent });
    sleepControls.start({ strokeDashoffset: 100 - sleepPercent });
  }, [qualityPercent, sleepPercent]);

  const polarToCartesian = (radius: number, percent: number) => {
    const angle = -90;
    const radians = (angle * Math.PI) / 180;
    const cx = 18;
    const cy = 18;
    return {
      x: cx + radius * Math.cos(radians),
      y: cy + radius * Math.sin(radians),
    };
  };

  const qualityIcon = polarToCartesian(16, qualityPercent);
  const sleepIcon = polarToCartesian(12, sleepPercent);

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-slate-700 rounded-lg w-full">
      <div className="relative w-48 h-48 mb-6">
        <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
          {/* Static background rings */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeDasharray="100"
            strokeDashoffset="0"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="3.5"
            strokeDasharray="100"
            strokeDashoffset="100"
            strokeLinecap="round"
            animate={qualityControls}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <circle
            cx="18"
            cy="18"
            r="12"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeDasharray="100"
            strokeDashoffset="0"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="12"
            fill="none"
            stroke="#84BAFD"
            strokeWidth="3.5"
            strokeDasharray="100"
            strokeDashoffset="100"
            strokeLinecap="round"
            animate={sleepControls}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Icon at arc heads */}
        <Clock
          className="absolute w-4 h-4 text-indigo-400"
          style={{
            left: `${(sleepIcon.x / 36) * 100}%`,
            top: `${(sleepIcon.y / 36) * 100}%`,
            transform: "translate(-50%, -50%)",
            color: "#000000",
          }}
        />
        <Percent
          className="absolute w-4 h-4 text-purple-400"
          style={{
            left: `${(qualityIcon.x / 36) * 100}%`,
            top: `${(qualityIcon.y / 36) * 100}%`,
            transform: "translate(-50%, -50%)",
            color: "#FFFFFF",
          }}
        />
      </div>

      {/* Label section */}
      <div className="flex justify-between w-full px-4">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Sleep</span>
          </div>
          <span className="text-2xl font-bold">{hours}h</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm text-muted-foreground">Sleep Quality</span>
            <Percent className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-2xl font-bold">{quality}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
