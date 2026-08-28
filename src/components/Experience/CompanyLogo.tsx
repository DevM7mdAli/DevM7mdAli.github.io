type Props = {
  name: string;
  logo_url: string | null;
  size?: number;
};

/** Company mark, falling back to initials when there's no logo or it 404s. */
export default function CompanyLogo({ name, logo_url, size = 48 }: Props) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const box = {
    width: size,
    height: size,
    borderRadius: size / 4,
    flexShrink: 0,
  } as const;

  if (logo_url) {
    return (
      <img
        src={logo_url}
        alt={name}
        className="object-contain"
        style={{ ...box, background: "var(--color-surface-2)", padding: size / 8 }}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.style.display = "none";
          const fallback = img.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = "flex";
        }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center font-bold"
      style={{
        ...box,
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        color: "var(--color-accent)",
        fontFamily: "var(--font-display)",
        fontSize: size * 0.3,
      }}
    >
      {initials}
    </div>
  );
}
