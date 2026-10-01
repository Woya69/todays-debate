type Props = {
  placement: string;
  className?: string;
};

/** Placeholder ad rail — swap for AdSense/network once traffic qualifies. */
export function AdSlot({ placement, className = "" }: Props) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") {
    return null;
  }

  return (
    <aside
      data-ad-placement={placement}
      className={`flex min-h-[90px] items-center justify-center border border-dashed border-border bg-background/50 px-4 py-6 text-center ${className}`}
      aria-label="Advertisement"
    >
      <p className="label text-muted">Ad · {placement}</p>
    </aside>
  );
}
