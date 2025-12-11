import { useBadgeStore } from "../../store/useBadgeStore";
import { BADGES, BADGE_TYPES } from "../../config/badges";
import { BadgeCard } from "./BadgeCard";
import { CollapsibleSection } from "../ui/CollapsibleSection";
import { Award } from "lucide-react";

/**
 * BadgeCollection - Widget displaying user's badge collection
 */
export const BadgeCollection = () => {
  const unlockedCount = useBadgeStore((state) => state.getUnlockedCount());

  return (
    <CollapsibleSection
      title="koleksi pencapaian"
      icon={<Award size={18} />}
      defaultExpanded={false}
      rightContent={`${unlockedCount}/${BADGES.length}`}
    >
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {BADGES.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} compact={true} />
          ))}
        </div>
      </div>
    </CollapsibleSection>
  );
};
