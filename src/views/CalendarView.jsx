import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  NotebookPen,
  ListChecks,
  CheckCircle2,
  Plus,
  PanelTopOpen,
  PanelTopClose,
  MapPin,
  CalendarSearch,
  X,
} from "lucide-react";
import { AnimatedPage } from "../components/ui/AnimatedPage";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useTaskStore } from "../store/useTaskStore";
import { useHabitStore } from "../store/useHabitStore";
import { useJournalStore } from "../store/useJournalStore";
import { useToastStore } from "../store/useToastStore";
import clsx from "clsx";
import { HOLIDAY_COUNTRIES } from "../constants/holidays";
import { useCalendarStore } from "../store/useCalendarStore";

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const formatDateKey = (date) => new Date(date).toDateString();

const buildMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const startIndex = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startIndex; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  return cells;
};

export const CalendarView = () => {
  const [cursor, setCursor] = useState(new Date());
  const { tasks, addTask } = useTaskStore();
  const { habits, checkIns, toggleCheckIn } = useHabitStore();
  const { entries } = useJournalStore();
  const { addToast } = useToastStore();
  const [quickTask, setQuickTask] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const {
    showAgenda,
    showHolidays,
    showIntlHolidays,
    holidayCountry,
    setPreference,
    ensureHolidays,
    getMonthHolidays,
  } = useCalendarStore();
  const quickInputRef = useRef(null);
  const [quickModal, setQuickModal] = useState({
    open: false,
    date: null,
    text: "",
  });

  const monthLabel = cursor.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const monthDays = useMemo(
    () => buildMonthDays(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  const selectedDateKey = formatDateKey(cursor);

  const monthHolidays = useMemo(() => {
    return getMonthHolidays(cursor.getFullYear(), cursor.getMonth(), [
      holidayCountry,
      "global",
    ]);
  }, [cursor, holidayCountry, getMonthHolidays]);

  useEffect(() => {
    ensureHolidays(holidayCountry, cursor.getFullYear());
    ensureHolidays("global", cursor.getFullYear());
  }, [holidayCountry, cursor, ensureHolidays]);

  const dayData = useMemo(() => {
    const map = new Map();

    tasks.forEach((task) => {
      const dateValue = task.dueDate || task.createdAt;
      if (!dateValue) return;
      const key = formatDateKey(dateValue);
      const entry = map.get(key) || { tasks: [], journals: [], habits: [] };
      entry.tasks.push(task);
      map.set(key, entry);
    });

    entries.forEach((entry) => {
      const key = formatDateKey(entry.createdAt);
      const existing = map.get(key) || { tasks: [], journals: [], habits: [] };
      existing.journals.push(entry);
      map.set(key, existing);
    });

    Object.keys(checkIns).forEach((habitId) => {
      const days = checkIns[habitId];
      Object.keys(days || {}).forEach((day) => {
        if (!days[day]) return;
        const existing = map.get(day) || {
          tasks: [],
          journals: [],
          habits: [],
        };
        const habit = habits.find((h) => h.id === habitId);
        existing.habits.push(
          habit
            ? { id: habitId, name: habit.name }
            : { id: habitId, name: "Habit" }
        );
        map.set(day, existing);
      });
    });

    return map;
  }, [tasks, entries, checkIns, habits]);

  const summary = dayData.get(selectedDateKey) || {
    tasks: [],
    journals: [],
    habits: [],
  };
  const filteredSummary = {
    tasks:
      activeFilter === "all" || activeFilter === "tasks" ? summary.tasks : [],
    journals:
      activeFilter === "all" || activeFilter === "journal"
        ? summary.journals
        : [],
    habits:
      activeFilter === "all" || activeFilter === "habits" ? summary.habits : [],
  };

  const handleQuickAdd = async () => {
    if (!quickTask.trim()) return;
    await addTask({
      text: quickTask.trim(),
      dueDate: cursor.toISOString().split("T")[0],
    });
    addToast("tugas ditambahkan ke tanggal ini", "success");
    setQuickTask("");
  };

  const handleQuickAddForDate = (dateObj) => {
    setQuickModal({
      open: true,
      date: dateObj,
      text: "",
    });
  };

  useEffect(() => {
    setPreference("lastCursor", cursor.toISOString());
  }, [cursor, setPreference]);

  const saveQuickModal = async () => {
    if (!quickModal.text.trim() || !quickModal.date) return;
    await addTask({
      text: quickModal.text.trim(),
      dueDate: quickModal.date.toISOString().split("T")[0],
    });
    addToast("ditambahkan ke tanggal ini", "success");
    setQuickModal({ open: false, date: null, text: "" });
  };

  const agendaList = useMemo(() => {
    const items = [];
    monthDays.forEach((d) => {
      if (!d) return;
      const key = formatDateKey(d);
      const info = dayData.get(key);
      if (!info) return;
      items.push({
        date: d,
        key,
        tasks: info.tasks,
        journals: info.journals,
        habits: info.habits,
      });
    });
    return items;
  }, [dayData, monthDays]);

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-(--accent)" size={24} />
            <div>
              <h2 className="text-3xl font-serif italic text-(--text-main)">
                kalender.
              </h2>
              <p className="font-mono text-xs text-(--text-muted)">
                sinkronkan tugas, jurnal, dan kebiasaan dalam satu tampilan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
                )
              }
              className="px-2"
            >
              <ChevronLeft size={16} />
            </Button>
            <Card className="px-4 py-2 font-mono text-sm text-(--text-main)">
              {monthLabel}
            </Card>
            <Button
              variant="ghost"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
                )
              }
              className="px-2"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </header>

        <Card>
          <div className="p-3 md:p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
              {["all", "tasks", "journal", "habits"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full font-mono text-[11px] border transition-colors whitespace-nowrap",
                    activeFilter === f
                      ? "bg-(--accent) text-(--bg-color) border-(--accent)"
                      : "border-(--border-color) text-(--text-muted) hover:text-(--text-main)"
                  )}
                >
                  {f === "all" ? "ALL" : f.toUpperCase()}
                </button>
              ))}
              <div className="flex gap-2 ml-auto shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreference("showAgenda", !showAgenda)}
                  className="hidden md:flex"
                >
                  {showAgenda ? (
                    <PanelTopOpen size={14} />
                  ) : (
                    <PanelTopClose size={14} />
                  )}
                  <span className="ml-1 text-xs">
                    {showAgenda ? "mode bulan" : "mode agenda"}
                  </span>
                </Button>
                <select
                  value={holidayCountry}
                  onChange={(e) =>
                    setPreference("holidayCountry", e.target.value)
                  }
                  className="border border-(--border-color) bg-transparent px-2 py-1 text-xs font-mono"
                >
                  {HOLIDAY_COUNTRIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant={showHolidays ? "accent" : "ghost"}
                  size="sm"
                  onClick={() => setPreference("showHolidays", !showHolidays)}
                  title="Tampilkan libur nasional"
                >
                  <MapPin size={14} />
                </Button>
                <Button
                  variant={showIntlHolidays ? "accent" : "ghost"}
                  size="sm"
                  onClick={() =>
                    setPreference("showIntlHolidays", !showIntlHolidays)
                  }
                  title="Tampilkan hari internasional"
                >
                  <CalendarSearch size={14} />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={quickInputRef}
                className="flex-1 px-3 py-2 font-mono text-xs bg-transparent border border-(--border-color) text-(--text-main) min-w-0"
                placeholder="tambah tugas cepat ke tanggal terpilih"
                value={quickTask}
                onChange={(e) => setQuickTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleQuickAdd();
                }}
              />
              <Button
                variant="accent"
                onClick={handleQuickAdd}
                disabled={!quickTask.trim()}
                className="shrink-0"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </Card>

        {!showAgenda ? (
          <Card>
            <div className="p-3 md:p-4 space-y-3">
              <div className="grid grid-cols-7 text-center font-mono text-[11px] uppercase text-(--text-muted) gap-2">
                {dayNames.map((name) => (
                  <div key={name} className="tracking-[0.08em]">
                    {name}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 md:gap-3">
                {monthDays.map((date, idx) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${cursor.getMonth()}-${idx}`}
                        className="h-20 md:h-24"
                      />
                    );
                  }
                  const key = formatDateKey(date);
                  const info = dayData.get(key);
                  const isToday =
                    formatDateKey(new Date()) === formatDateKey(date);
                  const isSelected = selectedDateKey === key;
                  const hasTasks = info?.tasks?.length > 0;
                  const hasJournals = info?.journals?.length > 0;
                  const hasHabits = info?.habits?.length > 0;
                  const holiday = monthHolidays.find(
                    (h) => new Date(h.date).toDateString() === key
                  );
                  const showHolidayDot =
                    holiday &&
                    ((holiday.type === "national" && showHolidays) ||
                      (holiday.type === "international" && showIntlHolidays));

                  const dimOthers =
                    activeFilter !== "all" &&
                    ((activeFilter === "tasks" && !hasTasks) ||
                      (activeFilter === "journal" && !hasJournals) ||
                      (activeFilter === "habits" && !hasHabits));

                  return (
                    <div key={key} className="relative group">
                      <button
                        onClick={() => setCursor(date)}
                        className={clsx(
                          "text-left p-2 md:p-3 rounded-sm transition-all w-full h-full focus:outline-none",
                          isSelected
                            ? "ring-2 ring-(--accent) ring-offset-1 bg-(--accent)/10"
                            : "border",
                          isSelected
                            ? "border-(--accent)"
                            : "border-(--border-color)",
                          isToday && !isSelected ? "bg-(--accent)/8" : "",
                          dimOthers ? "opacity-50" : ""
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={clsx(
                              "font-mono text-xs md:text-sm",
                              isToday
                                ? "text-(--accent) font-bold"
                                : "text-(--text-main)"
                            )}
                          >
                            {date.getDate()}
                          </span>
                          <div className="flex gap-1 items-center">
                            {hasTasks && (
                              <span className="w-2 h-2 rounded-full bg-(--accent) opacity-90" />
                            )}
                            {hasJournals && (
                              <span className="w-2 h-2 rounded-full bg-(--accent)/70 opacity-90" />
                            )}
                            {hasHabits && (
                              <span className="w-2 h-2 rounded-full bg-(--accent)/40 opacity-90" />
                            )}
                            {showHolidayDot && (
                              <span className="w-2 h-2 rounded-full bg-(--accent)/20 opacity-90" />
                            )}
                          </div>
                        </div>

                        <div className="mt-2 space-y-1">
                          {/* Holiday label - always show if active */}
                          {holiday &&
                            ((holiday.type === "national" && showHolidays) ||
                              (holiday.type === "international" &&
                                showIntlHolidays)) && (
                              <div className="bg-(--accent)/5 px-1.5 py-0.5 rounded-sm">
                                <p className="text-[9px] md:text-[10px] text-(--accent) truncate font-mono font-semibold">
                                  {holiday.label}
                                </p>
                              </div>
                            )}

                          {/* Desktop: Show activity details */}
                          <div className="hidden md:block space-y-1">
                            {info ? (
                              <>
                                {info.tasks.length > 0 && (
                                  <div className="flex items-center gap-1 text-[11px] text-(--text-main) truncate">
                                    <ListChecks
                                      size={12}
                                      className="text-(--accent) shrink-0"
                                    />
                                    <span className="truncate">
                                      {info.tasks.length} tugas
                                    </span>
                                  </div>
                                )}
                                {info.journals.length > 0 && (
                                  <div className="flex items-center gap-1 text-[11px] text-(--text-main) truncate">
                                    <NotebookPen
                                      size={12}
                                      className="text-(--accent)"
                                    />
                                    <span className="truncate">
                                      {info.journals.length} jurnal
                                    </span>
                                  </div>
                                )}
                                {info.habits.length > 0 && (
                                  <div className="flex items-center gap-1 text-[11px] text-(--text-main) truncate">
                                    <CheckCircle2
                                      size={12}
                                      className="text-(--accent)"
                                    />
                                    <span className="truncate">
                                      {info.habits.length} habit
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : (
                              !holiday && (
                                <p className="text-[11px] text-(--text-muted)">
                                  tenang.
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="opacity-0 group-hover:opacity-100 absolute bottom-1 right-1 bg-(--card-color)/90 border border-(--border-color) shadow-sm"
                        onClick={() => handleQuickAddForDate(date)}
                        title="Tambah cepat"
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CalendarSearch size={14} />
                <span className="type-label">Agenda bulan ini</span>
              </div>
              {agendaList.length === 0 ? (
                <p className="font-mono text-xs text-(--text-muted)">
                  belum ada aktivitas bulan ini.
                </p>
              ) : (
                <div className="space-y-2">
                  {agendaList.map((item) => (
                    <div
                      key={item.key}
                      className="border border-(--border-color) p-3 rounded-sm flex justify-between items-start"
                    >
                      <div>
                        <p className="font-mono text-xs text-(--text-muted)">
                          {item.date.toLocaleDateString("id-ID", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="font-mono text-[11px] text-(--text-main)">
                          {item.tasks.length} tugas • {item.habits.length} habit
                          • {item.journals.length} jurnal
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCursor(item.date)}
                      >
                        buka
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Holiday & Important Days Section */}
        {monthHolidays.length > 0 && (showHolidays || showIntlHolidays) && (
          <Card>
            <div className="p-3 md:p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-(--accent)" />
                <h3 className="font-serif text-lg text-(--text-main)">
                  Hari Penting Bulan Ini
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {monthHolidays
                  .filter(
                    (h) =>
                      (h.type === "national" && showHolidays) ||
                      (h.type === "international" && showIntlHolidays)
                  )
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((holiday, idx) => {
                    const holidayDate = new Date(holiday.date);
                    const isToday =
                      formatDateKey(new Date()) === formatDateKey(holidayDate);
                    const isPast = holidayDate < new Date() && !isToday;

                    return (
                      <button
                        key={`${holiday.date}-${idx}`}
                        onClick={() => setCursor(holidayDate)}
                        className={clsx(
                          "text-left p-3 border rounded-sm transition-all hover:border-(--accent)",
                          isPast
                            ? "opacity-60 border-(--border-color)"
                            : "border-(--accent)/30",
                          isToday && "bg-(--accent)/10 border-(--accent)"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-(--accent) font-semibold">
                                {holidayDate.toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                              {isToday && (
                                <span className="px-1.5 py-0.5 bg-(--accent) text-(--bg-color) font-mono text-[9px] rounded-sm">
                                  HARI INI
                                </span>
                              )}
                            </div>
                            <p className="font-serif text-sm text-(--text-main) mb-1">
                              {holiday.label}
                            </p>
                            <div className="flex items-center gap-1">
                              <span
                                className={clsx(
                                  "px-1.5 py-0.5 font-mono text-[9px] rounded-sm border",
                                  holiday.type === "national"
                                    ? "bg-(--accent)/10 text-(--accent) border-(--accent)/30"
                                    : "bg-(--text-muted)/10 text-(--text-muted) border-(--border-color)"
                                )}
                              >
                                {holiday.type === "national"
                                  ? "LIBUR NASIONAL"
                                  : "HARI INTERNASIONAL"}
                              </span>
                            </div>
                          </div>
                          <div className="text-(--text-muted)">
                            <CalendarDays size={16} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
              {monthHolidays.filter(
                (h) =>
                  (h.type === "national" && showHolidays) ||
                  (h.type === "international" && showIntlHolidays)
              ).length === 0 && (
                <p className="font-mono text-xs text-(--text-muted) text-center py-4">
                  Tidak ada hari libur/penting di bulan ini.
                </p>
              )}
            </div>
          </Card>
        )}

        <Card>
          <div className="p-3 md:p-4 space-y-3 md:space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] uppercase text-(--text-muted)">
                  ringkasan
                </p>
                <p className="font-serif text-base md:text-xl text-(--text-main)">
                  {new Date(selectedDateKey).toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                {(() => {
                  const selectedHoliday = monthHolidays.find(
                    (h) => new Date(h.date).toDateString() === selectedDateKey
                  );
                  return selectedHoliday &&
                    ((selectedHoliday.type === "national" && showHolidays) ||
                      (selectedHoliday.type === "international" &&
                        showIntlHolidays)) ? (
                    <div className="mt-1 flex items-center gap-1.5">
                      <MapPin size={12} className="text-(--accent)" />
                      <p className="font-mono text-xs text-(--accent)">
                        {selectedHoliday.label}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 border border-(--border-color) font-mono text-[10px] text-(--text-muted)">
                  {summary.tasks.length} tugas
                </span>
                <span className="px-2 py-0.5 border border-(--border-color) font-mono text-[10px] text-(--text-muted)">
                  {summary.habits.length} habit
                </span>
                <span className="px-2 py-0.5 border border-(--border-color) font-mono text-[10px] text-(--text-muted)">
                  {summary.journals.length} jurnal
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border border-(--border-color) p-3 space-y-2 rounded-sm">
                <div className="flex items-center gap-2">
                  <ListChecks size={16} className="text-(--accent)" />
                  <span className="font-mono text-xs text-(--text-main) uppercase">
                    tugas
                  </span>
                </div>
                {filteredSummary.tasks.length === 0 ? (
                  <div className="flex items-center justify-between bg-(--bg-color) border border-dashed border-(--border-color) p-2">
                    <p className="font-mono text-xs text-(--text-muted)">
                      tidak ada tugas hari ini.
                    </p>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => quickInputRef.current?.focus()}
                    >
                      tambah
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {filteredSummary.tasks.slice(0, 5).map((task) => (
                      <li
                        key={task.id}
                        className="font-mono text-xs text-(--text-main)"
                      >
                        {task.completed ? "✓ " : ""}
                        {task.text}
                      </li>
                    ))}
                    {filteredSummary.tasks.length > 5 && (
                      <p className="font-mono text-[11px] text-(--text-muted)">
                        +{filteredSummary.tasks.length - 5} lainnya
                      </p>
                    )}
                  </ul>
                )}
              </div>

              <div className="border border-(--border-color) p-3 space-y-2 rounded-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-(--accent)" />
                  <span className="font-mono text-xs text-(--text-main) uppercase">
                    kebiasaan
                  </span>
                </div>
                {filteredSummary.habits.length === 0 ? (
                  <p className="font-mono text-xs text-(--text-muted)">
                    belum ada check-in.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {filteredSummary.habits.map((habit) => (
                      <li
                        key={habit.id || habit}
                        className="font-mono text-xs text-(--text-main) flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked
                          onChange={() =>
                            toggleCheckIn(habit.id || habit, selectedDateKey)
                          }
                          className="w-4 h-4 cursor-pointer"
                          style={{ accentColor: "var(--accent)" }}
                        />
                        {habit.name || "Habit"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border border-(--border-color) p-3 space-y-2 rounded-sm">
                <div className="flex items-center gap-2">
                  <NotebookPen size={16} className="text-(--accent)" />
                  <span className="font-mono text-xs text-(--text-main) uppercase">
                    jurnal
                  </span>
                </div>
                {filteredSummary.journals.length === 0 ? (
                  <div className="flex items-center justify-between bg-(--bg-color) border border-dashed border-(--border-color) p-2">
                    <p className="font-mono text-xs text-(--text-muted)">
                      tidak ada entri.
                    </p>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        addToast("buka jurnal untuk menulis", "info")
                      }
                    >
                      tulis
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {filteredSummary.journals.slice(0, 5).map((entry) => (
                      <li
                        key={entry.id}
                        className="font-mono text-xs text-(--text-main) overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {entry.content}
                      </li>
                    ))}
                    {filteredSummary.journals.length > 5 && (
                      <p className="font-mono text-[11px] text-(--text-muted)">
                        +{filteredSummary.journals.length - 5} lainnya
                      </p>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Card>

        {quickModal.open && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="type-label">Tambah cepat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setQuickModal({ open: false, date: null, text: "" })
                  }
                >
                  <X size={14} />
                </Button>
              </div>
              <p className="font-mono text-xs text-(--text-muted)">
                {quickModal.date?.toLocaleDateString("id-ID", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <input
                className="w-full px-3 py-2 font-mono text-sm bg-transparent border border-(--border-color) text-(--text-main)"
                placeholder="judul tugas/jurnal/habit..."
                value={quickModal.text}
                onChange={(e) =>
                  setQuickModal((prev) => ({ ...prev, text: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveQuickModal();
                }}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={() =>
                    setQuickModal({ open: false, date: null, text: "" })
                  }
                >
                  batal
                </Button>
                <Button
                  variant="accent"
                  onClick={saveQuickModal}
                  disabled={!quickModal.text.trim()}
                >
                  simpan
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};
