export function Atmosphere({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute left-1/2 top-[18%] h-[28rem] w-[28rem] -translate-x-1/2">
        <span className="animate-ripple absolute inset-8 rounded-full border border-copper/25" />
        <span className="animate-ripple absolute inset-0 rounded-full border border-terracotta/20 [animation-delay:2s]" />
        <span className="animate-breathe absolute inset-[4.5rem] rounded-full bg-gradient-to-br from-terracotta/15 to-copper/5 blur-sm" />
      </div>
      <svg className="absolute -left-12 bottom-10 h-64 w-64 text-copper/10" viewBox="0 0 200 200" fill="none">
        <path
          d="M20 140c30-10 40-50 80-50s55 45 90 35"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M10 160c40-8 55-40 95-38 38 2 55 30 85 22"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
