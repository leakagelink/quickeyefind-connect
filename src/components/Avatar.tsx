export function Avatar({
  initials,
  size = 40,
  online,
  ring,
  src,
  alt = "",
}: {
  initials: string;
  size?: number;
  online?: boolean;
  ring?: boolean;
  src?: string;
  alt?: string;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`inline-flex items-center justify-center rounded-full bg-primary/12 font-semibold text-primary ${
          ring ? "ring-2 ring-primary" : "ring-2 ring-card"
        }`}
        style={{ width: size, height: size, fontSize: size * 0.36 }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            width={512}
            height={512}
            className="h-full w-full rounded-full object-cover"
          />
        ) : initials}
      </span>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-card ${
            online ? "bg-primary" : "bg-muted-foreground"
          }`}
          style={{ width: size * 0.28, height: size * 0.28 }}
        />
      )}
    </span>
  );
}
