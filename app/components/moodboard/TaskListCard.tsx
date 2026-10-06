"use client";

import React, { useState } from "react";
import { TaskList, type Task } from "@/components/ui/task-list";
import { RotateCcw } from "lucide-react";

const INITIAL_TASKS: Task[] = [
  { id: "1", label: "01 · Refactor design token scales", done: false },
  { id: "2", label: "02 · Audit spring curves & friction", done: true },
  { id: "3", label: "03 · Ship interactive micro-interactions", done: false },
  { id: "4", label: "04 · Polish dark aesthetic moodboard", done: false },
];

export const TaskListCard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [key, setKey] = useState(0);

  const handleReset = () => {
    setTasks(INITIAL_TASKS);
    setKey((prev) => prev + 1);
  };

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">interactive task list</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
            reorder motion
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-neutral-400">
            {completedCount}/{tasks.length} done
          </span>
          <button
            onClick={handleReset}
            title="Reset tasks"
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-6 min-h-[320px] flex flex-col items-center justify-center relative">
        <div className="w-full max-w-sm flex justify-center">
          <TaskList
            key={key}
            tasks={tasks}
            onTasksChange={setTasks}
            accent="#10B981"
            size="sm"
          />
        </div>
        <span className="text-[11px] font-mono text-neutral-500 mt-6 select-none pointer-events-none text-center">
          Click checkbox to strike · Auto-sorts settled items to bottom
        </span>
      </div>
    </div>
  );
};
