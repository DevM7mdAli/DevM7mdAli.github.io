import { motion, AnimatePresence } from "framer-motion";
import InfoPart from "./InfoPart";
import type { Project } from "../../lib/supabase";

/** Shared card grid — used by the home section, the index and detail pages. */
export default function ProjectGrid({
  projects,
  staggerFrom,
}: {
  projects: Project[];
  staggerFrom?: number;
}) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-6">
      <AnimatePresence mode="popLayout">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="flex"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: 0.3,
              delay:
                staggerFrom != null && i >= staggerFrom ? (i - staggerFrom) * 0.08 : 0,
            }}
          >
            <InfoPart project={project} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
