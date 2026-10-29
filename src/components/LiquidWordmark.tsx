import { useEffect, useId, useRef, useState } from "react";

export default function LiquidWordmark() {
  const filterId = `liquid-${useId().replace(/:/g, "")}`;
  const animationRef = useRef<SVGAnimateElement>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (motion) animationRef.current?.beginElement();
  }, [motion]);

  const ripple = () => { if (motion) animationRef.current?.beginElement(); };

  return (
    <>
      <span className="sr-only">Lookinglass</span>
      <button type="button" aria-label="Replay Lookinglass logo ripple" onPointerEnter={ripple} onClick={ripple} className="liquid-wordmark block w-full rounded-lg">
        <svg viewBox="-12 -14 684 109" aria-hidden="true" className="block h-auto w-full overflow-visible opacity-[0.80] dark:invert">
          <defs>
            <filter id={filterId} x="-5%" y="-30%" width="110%" height="160%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.009 0.035" numOctaves="2" seed="8" result="water" />
              <feDisplacementMap in="SourceGraphic" in2="water" scale="0" xChannelSelector="R" yChannelSelector="G">
                {motion && <animate ref={animationRef} attributeName="scale" values="0;12;7;10;0" keyTimes="0;0.2;0.45;0.65;1" dur="3.6s" begin="indefinite" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1" />}
              </feDisplacementMap>
            </filter>
          </defs>
          <image href="/media/lookinglass-wordmark.png" width="660" height="81" filter={motion ? `url(#${filterId})` : undefined} />
        </svg>
      </button>
    </>
  );
}
