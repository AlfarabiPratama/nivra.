import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "./Card";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

/**
 * CollapsibleSection - Reusable collapsible card component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content inside the collapsible section
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {boolean} props.defaultExpanded - Whether to start expanded (default: true)
 * @param {string} props.rightContent - Optional content on the right side of header
 * @param {string} props.className - Additional CSS classes
 */
export const CollapsibleSection = ({
  children,
  title,
  icon = null,
  defaultExpanded = true,
  rightContent = null,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={className}>
      {/* Header - Always visible */}
      <div
        className="flex items-center justify-between p-4 md:p-6 cursor-pointer select-none hover:bg-(--bg-color)/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-(--accent) shrink-0">{icon}</span>}
          <h3 className="font-mono text-xs md:text-sm uppercase tracking-wider text-(--text-muted)">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {rightContent && (
            <span className="font-mono text-xs text-(--text-muted)">
              {rightContent}
            </span>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
            className="text-(--text-muted)"
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </div>

      {/* Content - Collapsible */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-dashed border-(--border-color)">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
