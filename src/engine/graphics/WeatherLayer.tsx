import React from "react";
import type { WeatherEffectId } from "../types";
import { GROUND_Y } from "../constants";

interface WeatherLayerProps {
  weather?: WeatherEffectId;
  currentTime?: number;
  thunderFlash?: boolean;
}

// Fixed pseudo-random seeds for 60 rain streaks to ensure 100% deterministic frame rendering
const RAIN_SEEDS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: (i * 32.5 + (i % 7) * 11) % 2000 - 50,
  baseY: ((i * 47) % 850) - 50,
  len: 38 + (i % 5) * 12,
  width: i % 3 === 0 ? 2 : 1.3,
  speed: 950 + (i % 4) * 180,
  opacity: 0.35 + (i % 5) * 0.12,
  isFore: i % 2 === 0,
}));

// Fixed seeds for 36 floating embers
const EMBER_SEEDS = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: 100 + (i * 49 + (i % 5) * 31) % 1720,
  baseY: 400 + (i * 37) % 400,
  r: 1.8 + (i % 4) * 1.2,
  speedY: 45 + (i % 4) * 22,
  swayAmp: 25 + (i % 3) * 15,
  swayFreq: 1.2 + (i % 3) * 0.6,
  phase: (i * 1.1) % (Math.PI * 2),
  opacity: 0.45 + (i % 4) * 0.15,
}));

// Fixed seeds for 40 cold drifting ash particles
const ASH_SEEDS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: 80 + (i * 46 + (i % 7) * 17) % 1760,
  baseY: (i * 29) % 780,
  rx: 2.2 + (i % 3) * 1.2,
  ry: 1.2 + (i % 2) * 0.6,
  rot: (i * 27) % 360,
  speedY: 35 + (i % 3) * 18,
  swayAmp: 30 + (i % 4) * 12,
  swayFreq: 0.9 + (i % 3) * 0.4,
  phase: (i * 1.3) % (Math.PI * 2),
  opacity: 0.35 + (i % 4) * 0.12,
}));

// Fixed ground splash locations across Ground Y = 800px
const SPLASH_LOCATIONS = [
  { x: 160, delay: 0 },
  { x: 320, delay: 0.4 },
  { x: 510, delay: 0.8 },
  { x: 740, delay: 0.2 },
  { x: 960, delay: 0.6 },
  { x: 1180, delay: 0.1 },
  { x: 1390, delay: 0.7 },
  { x: 1580, delay: 0.3 },
  { x: 1760, delay: 0.5 },
];

export const WeatherLayer: React.FC<WeatherLayerProps> = ({
  weather = "none",
  currentTime,
  thunderFlash = false,
}) => {
  if (!weather || weather === "none") return null;

  const isRain = weather === "heavy_rain" || weather === "storm_thunder";
  const isStorm = weather === "storm_thunder";
  const isBlood = weather === "blood_rain";
  const isEmbers = weather === "floating_embers";
  const isAsh = weather === "drifting_ash";
  const isMist = weather === "haunted_mist";

  const slantAngle = isStorm ? -24 : isBlood ? -14 : -18;
  const slantDx = Math.tan((slantAngle * Math.PI) / 180) * 100;

  return (
    <g className="environment-layer-weather" pointerEvents="none">
      {/* 1. RAIN & STORM WEATHER (Mưa Rào Bão Tối & Cuồng Phong Sấm Sét) */}
      {(isRain || isBlood) && (
        <g className="weather-rain-group">
          {isStorm && thunderFlash && (
            <rect x="0" y="0" width="1920" height="1080" fill="#E0F2FE" opacity="0.2" />
          )}
          {/* Background Rain Layer */}
          <g opacity={isBlood ? 0.85 : 0.65} className={currentTime === undefined ? "anim-rain-fall-back" : undefined}>
            {RAIN_SEEDS.filter((s) => !s.isFore).map((drop) => {
              let curY = drop.baseY;
              let curX = drop.x;
              if (currentTime !== undefined) {
                const totalFallDist = GROUND_Y + 120;
                curY = ((drop.baseY + currentTime * drop.speed) % totalFallDist) - 60;
                curX = drop.x + ((curY / totalFallDist) * slantDx * 4);
              }
              const len = isStorm ? drop.len * 1.3 : drop.len;
              const x2 = curX + (slantDx * (len / 100));
              const y2 = curY + len;

              return (
                <line
                  key={`bg_${drop.id}`}
                  x1={curX}
                  y1={curY}
                  x2={x2}
                  y2={y2}
                  stroke={isBlood ? "url(#rain-streak-blood)" : "url(#rain-streak-blue)"}
                  strokeWidth={drop.width}
                  opacity={drop.opacity}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Foreground Rain Layer (Closer to lens, faster, thicker) */}
          <g opacity={isBlood ? 0.95 : 0.85} className={currentTime === undefined ? "anim-rain-fall-front" : undefined}>
            {RAIN_SEEDS.filter((s) => s.isFore).map((drop) => {
              let curY = drop.baseY;
              let curX = drop.x;
              if (currentTime !== undefined) {
                const totalFallDist = GROUND_Y + 120;
                curY = ((drop.baseY + currentTime * (drop.speed * 1.25)) % totalFallDist) - 60;
                curX = drop.x + ((curY / totalFallDist) * slantDx * 4.2);
              }
              const len = (isStorm ? drop.len * 1.4 : drop.len) * 1.2;
              const x2 = curX + (slantDx * (len / 100));
              const y2 = curY + len;

              return (
                <line
                  key={`fg_${drop.id}`}
                  x1={curX}
                  y1={curY}
                  x2={x2}
                  y2={y2}
                  stroke={isBlood ? "url(#rain-streak-blood)" : "url(#rain-streak-blue)"}
                  strokeWidth={drop.width * 1.3}
                  opacity={drop.opacity}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Ground Splashes on Y = 800px (Giọt nước bắn tung tóe tiếp đất) */}
          <g className="weather-ground-splashes">
            {SPLASH_LOCATIONS.map((loc, idx) => {
              const splashTime = currentTime !== undefined ? (currentTime + loc.delay) % 0.5 : 0.25;
              const splashScale = Math.sin((splashTime / 0.5) * Math.PI);
              const splashRadiusX = isBlood ? 16 * splashScale : 14 * splashScale;
              const splashOpacity = Math.max(0, 1 - (splashTime / 0.5));

              return (
                <g
                  key={`splash_${idx}`}
                  transform={`translate(${loc.x}, ${GROUND_Y})`}
                  className={currentTime === undefined ? "anim-rain-splash" : undefined}
                  style={
                    currentTime === undefined
                      ? { animationDelay: `${loc.delay}s` }
                      : undefined
                  }
                  opacity={currentTime !== undefined ? splashOpacity : 0.75}
                >
                  {/* Expanding ground ripple ring */}
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={currentTime !== undefined ? splashRadiusX : 12}
                    ry={currentTime !== undefined ? splashRadiusX * 0.35 : 4}
                    fill="none"
                    stroke={isBlood ? "#DC2626" : "#BAE6FD"}
                    strokeWidth={isBlood ? "1.8" : "1.4"}
                  />
                  {/* Upward rebounding water beads */}
                  <line
                    x1="0"
                    y1="0"
                    x2={-6}
                    y2={-10}
                    stroke={isBlood ? "#EF4444" : "#E0F2FE"}
                    strokeWidth="1.2"
                  />
                  <line
                    x1="0"
                    y1="0"
                    x2={7}
                    y2={-12}
                    stroke={isBlood ? "#EF4444" : "#E0F2FE"}
                    strokeWidth="1.2"
                  />
                  {/* Blood Puddle Base Underlay */}
                  {isBlood && (
                    <ellipse
                      cx="0"
                      cy="2"
                      rx={24}
                      ry={6}
                      fill="url(#blood-puddle-radial)"
                      opacity="0.8"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </g>
      )}

      {/* 2. FLOATING EMBERS (Tàn Tro Lửa Âm Ty Bốc Lên Từ Đáy Mộ) */}
      {isEmbers && (
        <g className="weather-embers-group">
          {EMBER_SEEDS.map((ember) => {
            let curY = ember.baseY;
            let curX = ember.x;
            let pulseScale = 1;

            if (currentTime !== undefined) {
              const heightSpan = 550;
              const upwardDist = currentTime * ember.speedY;
              curY = GROUND_Y + 20 - ((ember.baseY + upwardDist) % heightSpan);
              curX = ember.x + Math.sin(currentTime * ember.swayFreq + ember.phase) * ember.swayAmp;
              pulseScale = 0.8 + 0.3 * Math.sin(currentTime * 3 + ember.phase);
            }

            return (
              <g
                key={`ember_${ember.id}`}
                transform={`translate(${curX}, ${curY}) scale(${pulseScale})`}
                className={currentTime === undefined ? "anim-ember-float" : undefined}
                style={
                  currentTime === undefined
                    ? { animationDelay: `${(ember.id * 0.2) % 3}s` }
                    : undefined
                }
              >
                {/* Ember outer soft glow aura */}
                <circle cx="0" cy="0" r={ember.r * 2.8} fill="url(#ember-glow-radial)" opacity="0.65" />
                {/* Intense ember hot core */}
                <circle cx="0" cy="0" r={ember.r} fill="#FEF08A" opacity={ember.opacity} />
              </g>
            );
          })}
        </g>
      )}

      {/* 3. DRIFTING ASH (Tro Tàn Oan Khuất - Silent Hill Dark Fallout) */}
      {isAsh && (
        <g className="weather-ash-group">
          {ASH_SEEDS.map((ash) => {
            let curY = ash.baseY;
            let curX = ash.x;
            let curRot = ash.rot;

            if (currentTime !== undefined) {
              const heightSpan = GROUND_Y + 50;
              curY = ((ash.baseY + currentTime * ash.speedY) % heightSpan);
              curX = ash.x + Math.sin(currentTime * ash.swayFreq + ash.phase) * ash.swayAmp;
              curRot = ash.rot + currentTime * 25;
            }

            return (
              <g
                key={`ash_${ash.id}`}
                transform={`translate(${curX}, ${curY}) rotate(${curRot})`}
                className={currentTime === undefined ? "anim-ash-drift" : undefined}
                style={
                  currentTime === undefined
                    ? { animationDelay: `${(ash.id * 0.15) % 4}s` }
                    : undefined
                }
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx={ash.rx}
                  ry={ash.ry}
                  fill="#CBD5E1"
                  opacity={ash.opacity}
                />
              </g>
            );
          })}
        </g>
      )}

      {/* 4. HAUNTED MIST (Sương Mù Cuộn Xoáy Đa Tầng) */}
      {isMist && (
        <g className="weather-haunted-mist-group">
          {/* Dynamic Swirling Ground Mist Wave 1 */}
          <path
            d={`M -200 ${GROUND_Y - 120} 
               C 200 ${GROUND_Y - 200}, 500 ${GROUND_Y - 80}, 900 ${GROUND_Y - 170} 
               C 1300 ${GROUND_Y - 240}, 1650 ${GROUND_Y - 90}, 2150 ${GROUND_Y - 160} 
               L 2150 ${GROUND_Y + 60} L -200 ${GROUND_Y + 60} Z`}
            fill="url(#swirling-mist-grad)"
            className="anim-fog-wave-slow"
            opacity="0.75"
          />
          {/* Dynamic Swirling Ground Mist Wave 2 (Reversed & Lower) */}
          <path
            d={`M -150 ${GROUND_Y - 60} 
               C 250 ${GROUND_Y - 130}, 650 ${GROUND_Y - 30}, 1050 ${GROUND_Y - 120} 
               C 1450 ${GROUND_Y - 180}, 1800 ${GROUND_Y - 50}, 2200 ${GROUND_Y - 90} 
               L 2200 ${GROUND_Y + 80} L -150 ${GROUND_Y + 80} Z`}
            fill="url(#swirling-mist-grad)"
            className="anim-fog-wave-fast"
            opacity="0.85"
          />
          {/* Floating Mid-air Phantom Vapor */}
          <g className="anim-pulse-eerie" opacity="0.45">
            <ellipse cx="650" cy={GROUND_Y - 220} rx="320" ry="60" fill="url(#ground-fog-grad)" />
            <ellipse cx="1400" cy={GROUND_Y - 260} rx="380" ry="75" fill="url(#ground-fog-grad)" />
          </g>
        </g>
      )}
    </g>
  );
};
