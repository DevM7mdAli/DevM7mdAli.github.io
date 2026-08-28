import { useEffect } from "react";

const SITE = "https://mohammed-alajmi.me";
const DEFAULT_TITLE = "Mohammed Alajmi | Senior Software & Full-Stack Engineer";

type Meta = {
  title?: string;
  description?: string;
  /** Path only, e.g. "/projects/investech". */
  canonicalPath?: string;
  image?: string | null;
};

function setTag(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    // The tag isn't in index.html — create it so detail pages still describe
    // themselves rather than silently inheriting the site-wide card.
    if (selector.startsWith("link")) {
      el = document.createElement("link");
      (el as HTMLLinkElement).rel = selector.match(/rel="([^"]+)"/)?.[1] ?? "";
    } else {
      el = document.createElement("meta");
      const prop = selector.match(/property="([^"]+)"/)?.[1];
      const name = selector.match(/name="([^"]+)"/)?.[1];
      if (prop) el.setAttribute("property", prop);
      if (name) el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/**
 * Per-route title, description, canonical and Open Graph tags.
 *
 * Caveat worth knowing: this runs on the client, so most link-preview
 * crawlers will still read the static tags in index.html. Making shared
 * project links preview correctly needs prerendering — a separate decision.
 * This still fixes the browser tab, bookmarks, history and the canonical URL.
 */
export function useDocumentMeta({ title, description, canonicalPath, image }: Meta) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Mohammed Alajmi` : DEFAULT_TITLE;
    document.title = fullTitle;
    setTag('meta[property="og:title"]', "content", fullTitle);
    setTag('meta[name="twitter:title"]', "content", fullTitle);

    if (description) {
      setTag('meta[name="description"]', "content", description);
      setTag('meta[property="og:description"]', "content", description);
      setTag('meta[name="twitter:description"]', "content", description);
    }

    if (canonicalPath) {
      const url = `${SITE}${canonicalPath}`;
      setTag('link[rel="canonical"]', "href", url);
      setTag('meta[property="og:url"]', "content", url);
    }

    if (image) {
      setTag('meta[property="og:image"]', "content", image);
      setTag('meta[name="twitter:image"]', "content", image);
    }

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, canonicalPath, image]);
}
