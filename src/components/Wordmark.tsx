// "Lookinglass": looking and glass share the g. The mark is always one word.
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-[-0.045em] ${className}`}>
      Lookinglass
    </span>
  );
}
