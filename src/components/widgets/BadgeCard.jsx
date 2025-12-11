import clsx from "clsx";
import { getTierBg, getTierColor } from "../../config/badges";
import { useBadgeStore } from "../../store/useBadgeStore";

/**
 * BadgeCard - Display a single badge with progress
 *
 * @param {Object} props
 * @param {Object} props.badge - Badge definition object
 * @param {boolean} props.compact - Use compact layout
 */
export const BadgeCard = ({ badge, compact = false }) => {
  const isBadgeUnlocked = useBadgeStore((state) => state.isBadgeUnlocked);
  const getBadgeProgress = useBadgeStore((state) => state.getBadgeProgress);

  const isUnlocked = isBadgeUnlocked(badge.id);
  const progress = getBadgeProgress(badge.id);

  if (compact) {
    return (
      <div
        className={clsx(
          "flex flex-col items-center text-center p-2 transition-all",
          isUnlocked ? "opacity-100" : "opacity-40 grayscale"
        )}
        title={
          isUnlocked ? badge.description : `${progress}% - ${badge.description}`
        }
      >
        <span
          className={clsx("text-2xl", isUnlocked && "animate-bounce-subtle")}
        >
          {badge.emoji}
        </span>
        <span className="font-mono text-[8px] mt-1 text-(--text-muted) line-clamp-1">
          {badge.title}
        </span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "relative p-3 border transition-all duration-300",
        isUnlocked
          ? getTierBg(badge.tier)
          : "bg-(--bg-color) border-(--border-color) border-dashed opacity-60"
      )}
    >
      {/* Badge Icon */}
      <div className="flex items-start gap-3">
        <span
          className={clsx(
            "text-3xl shrink-0 transition-transform",
            isUnlocked && "scale-110"
          )}
        >
          {badge.emoji}
        </span>

        <div className="flex-1 min-w-0">
          <h4
            className={clsx(
              "font-mono text-xs uppercase tracking-wide",
              isUnlocked ? getTierColor(badge.tier) : "text-(--text-muted)"
            )}
          >
            {badge.title}
          </h4>
          <p className="font-mono text-[10px] text-(--text-muted) mt-0.5 line-clamp-2">
            {badge.description}
          </p>

          {/* Progress bar (only for locked badges) */}
          {!isUnlocked && (
            <div className="mt-2">
              <div className="h-1 bg-(--border-color) overflow-hidden">
                <div
                  className="h-full bg-(--accent) transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-[8px] text-(--text-muted) mt-0.5">
                {progress}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Unlocked indicator */}
      {isUnlocked && (
        <div className="absolute top-1 right-1">
          <span className="text-[10px]">✓</span>
        </div>
      )}
    </div>
  );
};
