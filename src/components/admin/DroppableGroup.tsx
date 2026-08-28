import type { CSSProperties, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/react";

type Props = {
  id: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * CollisionPriority.Low (1). A skill card overlapping this column and another
 * skill should resolve to the card — otherwise empty rows steal the drop and
 * the item jumps to index 0 instead of the hovered neighbour.
 */
const LOW_COLLISION_PRIORITY = 1;

/**
 * Drop target for a carousel row (or the ungrouped bucket). Empty rows still
 * need a surface, which is why the group stays mounted even with no skills.
 */
export default function DroppableGroup({ id, className, style, children }: Props) {
  const { ref, isDropTarget } = useDroppable({
    id,
    type: "group",
    accept: "skill",
    collisionPriority: LOW_COLLISION_PRIORITY,
  });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        outline: isDropTarget ? "2px solid var(--color-primary)" : undefined,
        outlineOffset: 6,
        borderRadius: 10,
      }}
    >
      {children}
    </div>
  );
}
