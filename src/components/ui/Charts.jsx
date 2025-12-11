import { useMemo } from "react";
import clsx from "clsx";

/**
 * DonutChart - SVG-based donut/pie chart
 */
export const DonutChart = ({
  data = [],
  size = 200,
  strokeWidth = 40,
  showLegend = true,
  showCenter = true,
  centerLabel = "",
  centerValue = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate segments
  const segments = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return [];

    let currentAngle = -90; // Start from top

    return data.map((item) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const dashArray = (percentage / 100) * circumference;
      const dashOffset = circumference - dashArray;
      const rotation = currentAngle;

      currentAngle += angle;

      return {
        ...item,
        percentage,
        dashArray,
        dashOffset,
        rotation,
        total,
      };
    });
  }, [data, circumference]);

  // Default colors if not provided
  const colors = [
    "#FF6B6B", // red
    "#4ECDC4", // teal
    "#45B7D1", // blue
    "#96CEB4", // green
    "#FFD93D", // yellow
    "#6C5CE7", // purple
    "#A8E6CF", // mint
    "#DDA0DD", // plum
  ];

  if (segments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <svg width={size} height={size}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
        </svg>
        <p className="font-mono text-xs text-(--text-muted) mt-2">
          Belum ada data
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      {/* Chart */}
      <div className="relative shrink-0">
        <svg width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
            opacity={0.2}
          />

          {/* Segments */}
          {segments.map((segment, index) => (
            <circle
              key={segment.id || index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color || colors[index % colors.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segment.dashArray} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="butt"
              style={{
                transform: `rotate(${segment.rotation}deg)`,
                transformOrigin: "center",
              }}
              className="transition-all duration-500"
            />
          ))}
        </svg>

        {/* Center content */}
        {showCenter && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              top: strokeWidth,
              bottom: strokeWidth,
              left: strokeWidth,
              right: strokeWidth,
            }}
          >
            {centerValue && (
              <span className="font-mono text-lg md:text-xl font-bold text-(--text-main)">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="font-mono text-[10px] text-(--text-muted) uppercase">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap lg:flex-col gap-2 justify-center">
          {segments.map((segment, index) => (
            <div key={segment.id || index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 shrink-0"
                style={{
                  backgroundColor:
                    segment.color || colors[index % colors.length],
                }}
              />
              <span className="font-mono text-xs text-(--text-main) truncate max-w-24">
                {segment.emoji && <span className="mr-1">{segment.emoji}</span>}
                {segment.name}
              </span>
              <span className="font-mono text-xs text-(--text-muted)">
                {segment.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * BudgetProgressCard - Individual budget progress with visual indicators
 */
export const BudgetProgressCard = ({
  emoji,
  name,
  spent,
  budget,
  formatCurrency,
}) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage >= 80 && percentage <= 100;
  const isSafe = percentage < 80;

  // Determine color based on status
  const getStatusColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (isNearLimit) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (isOverBudget) return "Melebihi budget!";
    if (isNearLimit) return "Hampir limit";
    return "Aman";
  };

  const getStatusEmoji = () => {
    if (isOverBudget) return "🚨";
    if (isNearLimit) return "⚠️";
    return "✅";
  };

  return (
    <div
      className={clsx(
        "p-4 border transition-all",
        isOverBudget
          ? "border-red-500/50 bg-red-500/5"
          : isNearLimit
          ? "border-yellow-500/50 bg-yellow-500/5"
          : "border-(--border-color)"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <span className="font-mono text-sm text-(--text-main)">{name}</span>
        </div>
        <span className="text-sm" title={getStatusText()}>
          {getStatusEmoji()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-(--bg-color) border border-(--border-color) mb-2 overflow-hidden">
        <div
          className={clsx(
            "h-full transition-all duration-500",
            getStatusColor()
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Overflow indicator */}
        {isOverBudget && (
          <div
            className="absolute top-0 right-0 h-full bg-red-500/40 animate-pulse"
            style={{ width: `${Math.min(percentage - 100, 50)}%` }}
          />
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-between items-end">
        <div>
          <p
            className={clsx(
              "font-mono text-sm",
              isOverBudget ? "text-red-500" : "text-(--text-main)"
            )}
          >
            {formatCurrency(spent)}
          </p>
          <p className="font-mono text-[10px] text-(--text-muted)">
            dari {formatCurrency(budget)}
          </p>
        </div>
        <div className="text-right">
          <p
            className={clsx(
              "font-mono text-sm",
              isOverBudget
                ? "text-red-500"
                : isSafe
                ? "text-green-500"
                : "text-yellow-500"
            )}
          >
            {isOverBudget
              ? `-${formatCurrency(Math.abs(remaining))}`
              : formatCurrency(remaining)}
          </p>
          <p className="font-mono text-[10px] text-(--text-muted)">
            {isOverBudget ? "over budget" : "tersisa"}
          </p>
        </div>
      </div>

      {/* Percentage label */}
      <div className="mt-2 text-center">
        <span
          className={clsx(
            "font-mono text-xs px-2 py-0.5",
            isOverBudget
              ? "bg-red-500/20 text-red-500"
              : isNearLimit
              ? "bg-yellow-500/20 text-yellow-500"
              : "bg-green-500/20 text-green-500"
          )}
        >
          {percentage.toFixed(0)}% terpakai
        </span>
      </div>
    </div>
  );
};

/**
 * MiniBarChart - Simple horizontal bar chart
 */
export const MiniBarChart = ({ data = [], maxValue, formatValue }) => {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={item.id || index} className="flex items-center gap-2">
          {item.emoji && <span className="text-sm shrink-0">{item.emoji}</span>}
          <span className="font-mono text-xs text-(--text-muted) w-16 truncate shrink-0">
            {item.name}
          </span>
          <div className="flex-1 h-2 bg-(--border-color)">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color || "var(--accent)",
              }}
            />
          </div>
          <span className="font-mono text-xs text-(--text-main) shrink-0">
            {formatValue ? formatValue(item.value) : item.value}
          </span>
        </div>
      ))}
    </div>
  );
};
