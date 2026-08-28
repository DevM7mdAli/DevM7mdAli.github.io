import type { CSSProperties, ReactNode } from "react";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
  id: string;
  index: number;
  /**
   * Container this item belongs to. Required when the same DragDropProvider
   * holds more than one list (skills across carousel rows); omit for a
   * single sortable list (projects).
   */
  group?: string | number;
  type?: string;
  accept?: string;
  /** When true the item renders normally but can't be picked up. */
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  children: (args: {
    handleRef: (element: Element | null) => void;
    isDragging: boolean;
  }) => ReactNode;
};

/**
 * One draggable cell in a sortable grid.
 *
 * The drag handle is passed back to the caller rather than rendered here: the
 * whole card is a click target for editing, so making the entire surface
 * draggable would mean every attempt to open a project started a drag. A
 * dedicated handle keeps the two gestures separate.
 */
export default function SortableCard({
  id,
  index,
  group,
  type,
  accept,
  disabled,
  className,
  style,
  children,
}: Props) {
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    group,
    type,
    accept,
    disabled,
  });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isDragging ? 0.4 : style?.opacity,
        // The library animates position; only the lifted card needs raising.
        zIndex: isDragging ? 1 : undefined,
      }}
    >
      {children({ handleRef, isDragging })}
    </div>
  );
}
