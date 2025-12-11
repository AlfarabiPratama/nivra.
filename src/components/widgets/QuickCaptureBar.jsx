import { useState } from "react";
import { Plus, BookOpen, Feather, DollarSign, CheckSquare } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import { useJournalStore } from "../../store/useJournalStore";
import { useAppStore } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";
import { buildAchievementStats } from "../../utils/achievementStats";
import clsx from "clsx";

export const QuickCaptureBar = () => {
  const [mode, setMode] = useState("task");
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { addTask } = useTaskStore();
  const { addEntry } = useJournalStore();
  const { addXP, setCurrentView } = useAppStore();
  const { addToast } = useToastStore();

  const modes = [
    {
      id: "task",
      icon: CheckSquare,
      label: "tugas",
      placeholder: "tambah tugas baru...",
    },
    {
      id: "journal",
      icon: Feather,
      label: "jurnal",
      placeholder: "tulis pikiran hari ini...",
    },
  ];

  const currentMode = modes.find((m) => m.id === mode);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (mode === "task") {
      addTask({ text: text.trim(), priority: "medium" });
      addXP(5, useToastStore.getState(), {
        source: "tugas cepat",
        stats: buildAchievementStats(),
      });
      addToast("tugas ditambahkan", "success");
    } else if (mode === "journal") {
      addEntry(text.trim());
      addXP(10, useToastStore.getState(), {
        source: "jurnal cepat",
        stats: buildAchievementStats(),
      });
      addToast("catatan tersimpan", "success");
    }

    setText("");
  };

  const handleQuickNav = (view) => {
    setCurrentView(view);
  };

  return (
    <div
      className={clsx(
        "border border-(--border-color) bg-(--card-color) p-3 transition-all duration-300",
        isFocused && "border-(--accent) shadow-lg"
      )}
    >
      <div className="flex items-center gap-1 mb-3">
        <span className="font-mono text-[10px] uppercase text-(--text-muted) mr-2">
          Quick Add
        </span>
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={clsx(
              "flex items-center gap-1 px-2 py-1 text-xs font-mono transition-all",
              mode === m.id
                ? "bg-(--accent) text-white"
                : "text-(--text-muted) hover:text-(--text-main)"
            )}
          >
            <m.icon size={12} />
            {m.label}
          </button>
        ))}

        <div className="ml-auto flex gap-1">
          <button
            onClick={() => handleQuickNav("reading")}
            className="p-1.5 text-(--text-muted) hover:text-(--accent) transition-colors"
            title="Ke Reading"
          >
            <BookOpen size={14} />
          </button>
          <button
            onClick={() => handleQuickNav("finance")}
            className="p-1.5 text-(--text-muted) hover:text-(--accent) transition-colors"
            title="Ke Finance"
          >
            <DollarSign size={14} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={currentMode?.placeholder}
          className="flex-1 bg-transparent border-b border-(--border-color) focus:border-(--accent) outline-none font-mono text-sm py-2 px-1 text-(--text-main) placeholder:text-(--text-muted)"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className={clsx(
            "p-2 transition-all",
            text.trim()
              ? "bg-(--accent) text-white hover:opacity-80"
              : "bg-(--border-color) text-(--text-muted) cursor-not-allowed"
          )}
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
};
