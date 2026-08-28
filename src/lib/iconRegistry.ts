import type { IconType } from "react-icons";
import {
  SiAngular,
  SiCss,
  SiDart,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFirebase,
  SiFlask,
  SiGit,
  SiHtml5,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiSqlite,
  SiStrapi,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  // Technologies that arrived from the old project tags (migration 0006).
  SiGooglegemini,
  SiDrizzle,
  SiExpo,
  SiRedis,
  SiMinio,
  SiPostman,
  SiWebcomponentsdotorg,
  SiPrisma,
  SiTrpc,
  SiVuedotjs,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { FaPhp, FaReact } from "react-icons/fa";
import { RiFlutterFill } from "react-icons/ri";
import { IoLogoJavascript } from "react-icons/io5";

/**
 * String → component map for skill icons.
 *
 * These imports are explicit on purpose. The tempting alternative —
 * `import * as Si from "react-icons/si"` and then `Si[key]` — defeats
 * tree-shaking, because Rollup cannot statically resolve the member access.
 * The ESM index for react-icons/si alone is 4.9 MB across 3,364 icons, against
 * a ~1.5 MB app bundle. This map costs only what it lists.
 *
 * A skill whose `icon_key` isn't here falls back to its uploaded `icon_url`,
 * so the admin panel never needs a deploy to add something new. To promote an
 * uploaded icon to the fast path, add its import here — the database row is
 * already correct and the registry takes precedence automatically.
 */
export const iconRegistry: Readonly<Record<string, IconType>> = {
  // Languages & markup
  IoLogoJavascript,
  SiTypescript,
  SiPython,
  FaPhp,
  SiDart,
  SiHtml5,
  SiCss,
  SiVite,
  // Frameworks & mobile
  FaReact,
  SiAngular,
  SiNextdotjs,
  RiFlutterFill,
  TbBrandReactNative,
  SiNestjs,
  SiExpress,
  SiFastapi,
  SiStrapi,
  SiFlask,
  // Tools & databases
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiMongodb,
  SiFirebase,
  SiDocker,
  SiGit,
  SiTailwindcss,
  // From the old project tags
  SiGooglegemini,
  SiDrizzle,
  SiExpo,
  SiRedis,
  SiMinio,
  SiPostman,
  SiWebcomponentsdotorg,
  SiPrisma,
  SiTrpc,
  SiVuedotjs,
};

/** Sorted keys, for the admin panel's icon-key datalist. */
export const iconRegistryKeys = Object.keys(iconRegistry).sort();

export function resolveIcon(iconKey: string | null | undefined): IconType | null {
  if (!iconKey) return null;
  return iconRegistry[iconKey] ?? null;
}
