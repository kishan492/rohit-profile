import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import { counterItems } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = () => {
  const counterRef = useRef(null);
  const countersRef = useRef([]);
  const numberRefs = useRef([]);

  useGSAP(() => {
    const animations = [];
    
    countersRef.current.forEach((counter, index) => {
      const numberElement = numberRefs.current[index];
      const item = counterItems[index];

      if (!numberElement || !item) return;

      // Set initial value to 0
      gsap.set(numberElement, { textContent: "0" });

      // Create the counting animation
      const animation = gsap.to(numberElement, {
        innerText: item.value,
        duration: 2.5,
        ease: "power2.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: counterRef.current,
          start: "top center",
        },
        onComplete: () => {
          if (numberElement) {
            numberElement.textContent = `${item.value}${item.suffix}`;
          }
        },
      });
      animations.push(animation);
    });

    return () => {
      animations.forEach(anim => anim.kill());
    };
  }, []);

  return (
    <div id="counter" ref={counterRef} className="padding-x-lg xl:mt-0 mt-32">
      <div className="mx-auto grid-4-cols">
        {counterItems.map((item, index) => (
          <div
            key={index}
            ref={(el) => el && (countersRef.current[index] = el)}
            className="bg-zinc-900 rounded-lg p-10 flex flex-col justify-center"
          >
            <div 
              ref={(el) => el && (numberRefs.current[index] = el)}
              className="counter-number text-white-50 text-5xl font-bold mb-2"
            >
              0{item.suffix}
            </div>
            <div className="text-white-50 text-lg">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedCounter;