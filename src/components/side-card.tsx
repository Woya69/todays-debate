interface SideCardProps {
  side: "pro" | "con";
  title: string;
  argument: string;
}

export function SideCard({ side, title, argument }: SideCardProps) {
  const isPro = side === "pro";

  return (
    <article className="paper-card relative overflow-hidden">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          isPro ? "bg-pro" : "bg-con"
        }`}
      />
      <div className="px-6 py-6 sm:px-8">
        <div className="mb-3 flex items-baseline justify-between border-b border-border pb-3">
          <span
            className={`label ${isPro ? "text-pro" : "text-con"}`}
          >
            {isPro ? "The case for" : "The case against"}
          </span>
          <span className="label text-muted">
            {isPro ? "Affirmative" : "Opposition"}
          </span>
        </div>
        <h3 className="font-display text-2xl font-semibold leading-snug text-foreground">
          {title}
        </h3>
        <p className="dropcap mt-4 text-[1.05rem] leading-8 text-foreground/90">
          {argument}
        </p>
      </div>
    </article>
  );
}
