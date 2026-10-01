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
      <div className="px-4 py-5 sm:px-8 sm:py-6">
        <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-border pb-3">
          <span
            className={`label ${isPro ? "text-pro" : "text-con"}`}
          >
            {isPro ? "The case for" : "The case against"}
          </span>
          <span className="label hidden text-muted sm:inline">
            {isPro ? "Affirmative" : "Opposition"}
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="dropcap mt-4 text-base leading-7 text-foreground/90 sm:text-[1.05rem] sm:leading-8">
          {argument}
        </p>
      </div>
    </article>
  );
}
