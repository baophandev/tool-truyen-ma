import React from "react";
import { COLOR_PALETTE } from "../constants";

export const SvgDefs: React.FC = () => {
  return (
    <defs>
      {/* 1. SKY GRADIENTS */}
      {/* Blood Moon Sky */}
      <linearGradient id="sky-grad-blood_moon" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={COLOR_PALETTE.skies.blood_moon.gradient_top} />
        <stop offset="65%" stopColor="#190404" />
        <stop offset="100%" stopColor={COLOR_PALETTE.skies.blood_moon.gradient_bottom} />
      </linearGradient>

      {/* Foggy Night Sky */}
      <linearGradient id="sky-grad-foggy_night" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={COLOR_PALETTE.skies.foggy_night.gradient_top} />
        <stop offset="70%" stopColor="#0B0D15" />
        <stop offset="100%" stopColor={COLOR_PALETTE.skies.foggy_night.gradient_bottom} />
      </linearGradient>

      {/* Stormy Dark Sky */}
      <linearGradient id="sky-grad-stormy_dark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={COLOR_PALETTE.skies.stormy_dark.gradient_top} />
        <stop offset="75%" stopColor="#07090F" />
        <stop offset="100%" stopColor={COLOR_PALETTE.skies.stormy_dark.gradient_bottom} />
      </linearGradient>

      {/* Eclipse Abyss Sky */}
      <linearGradient id="sky-grad-eclipse_abyss" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={COLOR_PALETTE.skies.eclipse_abyss.gradient_top} />
        <stop offset="60%" stopColor="#05120E" />
        <stop offset="100%" stopColor={COLOR_PALETTE.skies.eclipse_abyss.gradient_bottom} />
      </linearGradient>

      {/* 2. MOON GLOW RADIAL GRADIENTS */}
      <radialGradient id="blood-moon-glow-radial" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(220, 38, 38, 0.7)" />
        <stop offset="45%" stopColor="rgba(185, 28, 28, 0.35)" />
        <stop offset="80%" stopColor="rgba(153, 27, 27, 0.1)" />
        <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
      </radialGradient>

      <radialGradient id="pale-moon-glow-radial" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(226, 232, 240, 0.55)" />
        <stop offset="50%" stopColor="rgba(148, 163, 184, 0.25)" />
        <stop offset="85%" stopColor="rgba(71, 85, 105, 0.08)" />
        <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
      </radialGradient>

      <radialGradient id="eclipse-glow-radial" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.65)" />
        <stop offset="40%" stopColor="rgba(6, 182, 212, 0.35)" />
        <stop offset="75%" stopColor="rgba(5, 150, 105, 0.12)" />
        <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
      </radialGradient>

      {/* 2b. HANDHELD LIGHT GLOWS (Đèn bão, đèn lồng, nến cầu hồn) */}
      <radialGradient id="lantern-warm-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(253, 224, 71, 0.85)" />
        <stop offset="35%" stopColor="rgba(245, 158, 11, 0.45)" />
        <stop offset="70%" stopColor="rgba(217, 119, 6, 0.15)" />
        <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
      </radialGradient>

      <radialGradient id="candle-eerie-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(254, 240, 138, 0.8)" />
        <stop offset="45%" stopColor="rgba(16, 185, 129, 0.32)" />
        <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
      </radialGradient>

      {/* 3. MIDGROUND MIST GRADIENTS */}
      <linearGradient id="mid-mist-grad-blood_moon" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(153, 27, 27, 0)" />
        <stop offset="60%" stopColor="rgba(153, 27, 27, 0.28)" />
        <stop offset="100%" stopColor="rgba(13, 2, 2, 0.6)" />
      </linearGradient>

      <linearGradient id="mid-mist-grad-foggy_night" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(226, 232, 240, 0)" />
        <stop offset="60%" stopColor="rgba(226, 232, 240, 0.25)" />
        <stop offset="100%" stopColor="rgba(20, 23, 36, 0.55)" />
      </linearGradient>

      <linearGradient id="mid-mist-grad-stormy_dark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(30, 41, 59, 0)" />
        <stop offset="60%" stopColor="rgba(30, 41, 59, 0.3)" />
        <stop offset="100%" stopColor="rgba(11, 14, 23, 0.65)" />
      </linearGradient>

      <linearGradient id="mid-mist-grad-eclipse_abyss" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
        <stop offset="60%" stopColor="rgba(16, 185, 129, 0.25)" />
        <stop offset="100%" stopColor="rgba(4, 9, 14, 0.65)" />
      </linearGradient>

      {/* 4. FOREGROUND GROUND FOG GRADIENT */}
      <linearGradient id="ground-fog-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(226, 232, 240, 0)" />
        <stop offset="40%" stopColor="rgba(226, 232, 240, 0.22)" />
        <stop offset="80%" stopColor="rgba(203, 213, 225, 0.32)" />
        <stop offset="100%" stopColor="rgba(10, 10, 12, 0.85)" />
      </linearGradient>

      {/* 5. GHOST AURA & BLUR */}
      <radialGradient id="ghost-aura-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(186, 230, 253, 0.5)" />
        <stop offset="60%" stopColor="rgba(125, 211, 252, 0.18)" />
        <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
      </radialGradient>

      <filter id="ghost-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result=    "blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* 6. CINEMATIC VIGNETTE (Tối góc điện ảnh kinh dị) */}
      <radialGradient id="vignette-grad" cx="50%" cy="50%" r="70%">
        <stop offset="35%" stopColor="rgba(0, 0, 0, 0)" />
        <stop offset="70%" stopColor="rgba(0, 0, 0, 0.45)" />
        <stop offset="90%" stopColor="rgba(0, 0, 0, 0.82)" />
        <stop offset="100%" stopColor="rgba(0, 0, 0, 0.98)" />
      </radialGradient>

      {/* 7. PROCEDURAL FILM GRAIN FILTER */}
      <filter id="horror-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
      </filter>
    </defs>
  );
};
