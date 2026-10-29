export default function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return <img src="/media/logo.png" alt="" aria-hidden="true" className={`shrink-0 object-contain select-none dark:invert ${className}`} />;
}
