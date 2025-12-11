import clsx from "clsx";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

/**
 * Modern Switch Toggle Component
 * A beautiful, animated toggle switch with multiple variants
 */
export const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  variant = "default",
  label,
  description,
  className,
}) => {
  const sizeClasses = {
    sm: {
      track: "w-8 h-4",
      thumb: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      track: "w-11 h-6",
      thumb: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      track: "w-14 h-7",
      thumb: "w-6 h-6",
      translate: "translate-x-7",
    },
  };

  const variantClasses = {
    default: {
      trackActive: "bg-(--accent)",
      trackInactive: "bg-(--border-color)",
      thumbActive: "bg-white",
      thumbInactive: "bg-(--text-muted)",
    },
    success: {
      trackActive: "bg-green-500",
      trackInactive: "bg-(--border-color)",
      thumbActive: "bg-white",
      thumbInactive: "bg-(--text-muted)",
    },
    warning: {
      trackActive: "bg-yellow-500",
      trackInactive: "bg-(--border-color)",
      thumbActive: "bg-white",
      thumbInactive: "bg-(--text-muted)",
    },
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={clsx(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2",
        currentSize.track,
        checked ? currentVariant.trackActive : currentVariant.trackInactive,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={clsx(
          "pointer-events-none inline-block rounded-full shadow-lg ring-0 transition-colors duration-200",
          currentSize.thumb,
          checked ? currentVariant.thumbActive : currentVariant.thumbInactive,
          checked ? currentSize.translate : "translate-x-0"
        )}
      />
    </button>
  );

  // If no label, return just the switch
  if (!label) {
    return switchElement;
  }

  // With label and optional description
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs text-(--text-main) uppercase truncate">
          {label}
        </p>
        {description && (
          <p className="font-mono text-xs text-(--text-muted) mt-0.5">
            {description}
          </p>
        )}
      </div>
      {switchElement}
    </div>
  );
};

/**
 * SwitchGroup - Container for multiple switches with consistent styling
 */
export const SwitchGroup = ({ children, className }) => (
  <div className={clsx("space-y-4", className)}>{children}</div>
);

/**
 * SwitchCard - A switch wrapped in a card-like container
 */
export const SwitchCard = ({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
  disabled,
  variant,
}) => (
  <div
    className={clsx(
      "flex items-center gap-4 p-4 border border-dashed transition-colors",
      checked ? "border-(--accent) bg-(--accent)/5" : "border-(--border-color)",
      disabled && "opacity-50"
    )}
  >
    {Icon && (
      <div className="shrink-0">
        <Icon
          size={20}
          className={clsx(
            "transition-colors",
            checked ? "text-(--accent)" : "text-(--text-muted)"
          )}
        />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="font-mono text-sm text-(--text-main)">{label}</p>
      {description && (
        <p className="font-mono text-xs text-(--text-muted) mt-1">
          {description}
        </p>
      )}
    </div>
    <Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      variant={variant}
    />
  </div>
);
