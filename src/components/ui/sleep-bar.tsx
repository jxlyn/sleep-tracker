import { motion } from "framer-motion";
import React from "react";

interface SleepBarProps {
  label: string;
  value: number; // hours
  total: number; // total hours
  color: string; // tailwind color
}

export const SleepBar: React.FC<SleepBarProps> = ({ label, value, total, color }) => {
  const percent = (value / total) * 100;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>{label}</span>
        <span className="text-right">{value}h</span>
      </div>
      <div className="w-full h-4 rounded-full bg-slate-800 relative overflow-hidden">
        <motion.div
          className={`absolute top-0 left-0 h-4 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
