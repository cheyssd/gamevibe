import { useEffect, useState } from "react";

/**
 * Anime un nombre de 0 jusqu'à `target` en `duration` ms.
 * @param {number} target   - valeur finale
 * @param {number} duration - durée en ms (défaut 2000)
 * @param {number} delay    - délai avant démarrage en ms (défaut 0)
 */
export default function useCountUp(target, duration = 2000, delay = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let frameId;

    const timeout = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // easeOutQuart pour un ralentissement naturel en fin d'animation
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(eased * target));
        if (progress < 1) frameId = requestAnimationFrame(step);
      };
      frameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameId);
    };
  }, [target, duration, delay]);

  return count;
}