interface SideCardProps {
  side: "pro" | "con";
  title: string;
  argument: string;
}

export function SideCard({ side, title, argument }: SideCardProps) {
  const isPro = side === "pro";

  return (
    <article
      className={`arena-card relative overflow-hidden ${
        isPro ? "corner-pro" : "corner-con"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${isPro ? "bg-pro" : "bg-con"}`}
      />
      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <span className={`label ${isPro ? "text-pro" : "text-con"}`}>
            {isPro ? "FOR" : "AGAINST"}
          </span>
          <span className="label text-muted">{isPro ? "Corner A" : "Corner B"}</span>
        </div>
        <h3 className="font-display text-xl font-extrabold leading-snug text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="mt-4 text-base leading-7 text-foreground/90 sm:text-[1.05rem] sm:leading-8">
          {argument}
        </p>
      </div>
    </article>
  );
}
