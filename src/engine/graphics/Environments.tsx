import React from "react";
import type { ThemeId, SkyPresetId } from "../types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y, COLOR_PALETTE } from "../constants";

/**
 * LAYER 0: SKY, MOON / ECLIPSE, CLOUDS, THUNDER
 */
export const SkyLayer: React.FC<{ skyPreset: SkyPresetId; thunderFlash?: boolean }> = ({
  skyPreset,
  thunderFlash = false,
}) => {
  const isBloodMoon = skyPreset === "blood_moon";
  const isStormy = skyPreset === "stormy_dark";
  const isEclipse = skyPreset === "eclipse_abyss";

  return (
    <g className="environment-layer-0-sky">
      {/* Dynamic Sky Background Gradient */}
      <rect
        x="0"
        y="0"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill={`url(#sky-grad-${skyPreset})`}
      />

      {/* Lightning Flash Overlay */}
      <rect
        x="0"
        y="0"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill="#FFFFFF"
        opacity={thunderFlash ? 0.65 : 0}
        className={isStormy ? "anim-lightning-flash" : ""}
        style={{ mixBlendMode: "screen", pointerEvents: "none" }}
      />

      {/* Distant Stars / Embers */}
      <g className="distant-embers" opacity="0.45">
        <circle cx="210" cy="120" r="1.5" fill={isEclipse ? "#34D399" : "#E2E8F0"} />
        <circle cx="340" cy="80" r="1.2" fill={isEclipse ? "#34D399" : "#E2E8F0"} />
        <circle cx="580" cy="150" r="1.8" fill={isEclipse ? "#34D399" : "#E2E8F0"} />
        <circle cx="720" cy="95" r="1" fill={isEclipse ? "#34D399" : "#E2E8F0"} />
        <circle cx="1120" cy="130" r="1.5" fill={isEclipse ? "#34D399" : "#E2E8F0"} />
        <circle cx="1280" cy="70" r="1.2" fill={isEclipse ? "#34D399" : "#E2E8F0"} />
        <circle cx="1450" cy="110" r="1.8" fill={isEclipse ? "#34D399" : "#E2E8F0"} />
        <circle cx="1780" cy="160" r="1.3" fill={isEclipse ? "#34D399" : "#E2E8F0"} />
      </g>

      {/* Massive Celestial Body: Blood Moon / Pale Moon / Solar Eclipse */}
      <g className="horror-moon-group" transform="translate(1380, 240)">
        {/* Halo Glow */}
        <circle
          cx="0"
          cy="0"
          r="165"
          fill={
            isBloodMoon
              ? "url(#blood-moon-glow-radial)"
              : isEclipse
              ? "url(#eclipse-glow-radial)"
              : "url(#pale-moon-glow-radial)"
          }
          opacity="0.85"
        />

        {/* Eclipse Corona Flare Ring */}
        {isEclipse && (
          <circle
            cx="0"
            cy="0"
            r="102"
            fill="none"
            stroke="#10B981"
            strokeWidth="5"
            opacity="0.9"
            className="anim-moon-pulse"
          />
        )}

        {/* Main Moon / Black Sun Disc */}
        <circle
          cx="0"
          cy="0"
          r="95"
          fill={
            isBloodMoon
              ? COLOR_PALETTE.accent_bright_red
              : isEclipse
              ? "#06070A"
              : isStormy
              ? "#64748B"
              : COLOR_PALETTE.accent_fog_white
          }
          className="anim-moon-pulse"
        />

        {/* Craters / Occult Texture (when not eclipse) */}
        {!isEclipse && (
          <g>
            <ellipse cx="-25" cy="-20" rx="18" ry="14" fill={isBloodMoon ? "#991B1B" : "#475569"} opacity="0.5" />
            <ellipse cx="20" cy="25" rx="24" ry="16" fill={isBloodMoon ? "#7F1D1D" : "#334155"} opacity="0.45" />
            <circle cx="-10" cy="35" r="10" fill={isBloodMoon ? "#7F1D1D" : "#334155"} opacity="0.4" />
          </g>
        )}
      </g>

      {/* Drifting Clouds */}
      <g className="drifting-clouds-back anim-cloud-drift-slow" opacity="0.55">
        <path
          d="M -200 180 C 100 140, 300 190, 600 160 C 900 130, 1200 180, 1600 150 C 1900 120, 2100 160, 2400 140 L 2400 320 L -200 320 Z"
          fill={isBloodMoon ? "#1A0606" : isEclipse ? "#04140F" : "#0D111A"}
        />
      </g>
      <g className="drifting-clouds-front anim-cloud-drift-fast" opacity="0.75">
        <path
          d="M -100 240 C 250 200, 500 260, 850 220 C 1200 190, 1450 250, 1800 210 C 2050 180, 2250 220, 2500 200 L 2500 380 L -100 380 Z"
          fill={isBloodMoon ? "#120303" : isEclipse ? "#030E0B" : "#080B12"}
        />
      </g>
    </g>
  );
};

/**
 * LAYER 1: DISTANT BACKGROUND SILHOUETTES
 */
export const BackgroundLayer: React.FC<{ theme: ThemeId; skyPreset: SkyPresetId }> = ({
  theme,
  skyPreset,
}) => {
  const isBlood = skyPreset === "blood_moon";
  const isEclipse = skyPreset === "eclipse_abyss";
  const mountainColor = isBlood ? "#1F0808" : isEclipse ? "#071712" : "#0B0E17";
  const groveColor = isBlood ? "#140505" : isEclipse ? "#05100C" : "#080A10";

  return (
    <g className="environment-layer-1-background">
      {/* Distant Misty Mountain Ridges */}
      <path
        d="M 0 580 C 250 480, 500 560, 750 510 C 1000 460, 1250 540, 1500 490 C 1700 450, 1850 500, 1920 480 L 1920 800 L 0 800 Z"
        fill={mountainColor}
        opacity="0.8"
      />

      {/* Mid-distance Mist */}
      <rect
        x="0"
        y="500"
        width={CANVAS_WIDTH}
        height="300"
        fill={`url(#mid-mist-grad-${skyPreset})`}
        opacity="0.6"
      />

      {/* THEME 1: RURAL GRAVEYARD */}
      {theme === "rural_graveyard" && (
        <g className="graveyard-distant-elements">
          <BambooGrove x={80} y={720} height={260} scale={0.7} color={groveColor} />
          <BambooGrove x={320} y={730} height={230} scale={0.65} color={groveColor} />
          <BambooGrove x={1480} y={710} height={280} scale={0.75} color={groveColor} />
          <BambooGrove x={1700} y={725} height={240} scale={0.68} color={groveColor} />
          <g opacity="0.65" fill={groveColor}>
            <polygon points="520,680 528,680 527,650 521,650" />
            <polygon points="516,660 532,660 532,664 516,664" />
            <polygon points="760,700 766,700 765,675 761,675" />
            <polygon points="1180,690 1188,690 1187,660 1181,660" />
          </g>
        </g>
      )}

      {/* THEME 2: ABANDONED VILLAGE */}
      {theme === "abandoned_village" && (
        <g className="village-distant-elements">
          <BambooGrove x={50} y={700} height={290} scale={0.8} color={groveColor} />
          <BambooGrove x={220} y={720} height={240} scale={0.65} color={groveColor} />
          <BambooGrove x={1600} y={690} height={310} scale={0.85} color={groveColor} />
          <g opacity="0.75" fill={groveColor}>
            <path d="M 680 680 C 720 660, 780 660, 820 680 L 805 695 L 695 695 Z" />
            <rect x="715" y="695" width="70" height="40" />
            <rect x="740" y="705" width="20" height="30" fill="#030406" />
            <path d="M 1240 685 C 1270 670, 1310 670, 1340 685 L 1330 695 L 1250 695 Z" />
          </g>
        </g>
      )}

      {/* THEME 3: CURSED SWAMP (Đầm Lầy U Minh) */}
      {theme === "cursed_swamp" && (
        <g className="swamp-distant-elements">
          {/* Dense Bog Reeds / Cattails Silhouettes */}
          <SwampReeds x={100} y={750} scale={0.8} color={groveColor} />
          <SwampReeds x={300} y={740} scale={0.75} color={groveColor} />
          <SwampReeds x={700} y={745} scale={0.85} color={groveColor} />
          <SwampReeds x={1250} y={740} scale={0.8} color={groveColor} />
          <SwampReeds x={1650} y={750} scale={0.9} color={groveColor} />

          {/* Floating Will-o'-the-Wisps (Đốm Ma Trơi Lân Tinh Bay Lượn) */}
          <g className="anim-pulse-eerie">
            <circle cx="420" cy="670" r="4" fill={COLOR_PALETTE.accent_swamp_green} opacity="0.75" />
            <circle cx="890" cy="650" r="3.5" fill={COLOR_PALETTE.accent_phantom_teal} opacity="0.8" />
            <circle cx="1380" cy="660" r="4.5" fill={COLOR_PALETTE.accent_swamp_green} opacity="0.7" />
          </g>
        </g>
      )}
    </g>
  );
};

/**
 * PROCEDURAL BAMBOO GROVE
 */
const BambooGrove: React.FC<{
  x: number;
  y: number;
  height: number;
  scale: number;
  color: string;
}> = ({ x, y, height, scale, color }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="anim-bamboo-sway">
      <BambooCulm xOffset={-30} height={height * 0.9} tilt={-8} color={color} />
      <BambooCulm xOffset={-10} height={height} tilt={-4} color={color} />
      <BambooCulm xOffset={12} height={height * 1.05} tilt={5} color={color} />
      <BambooCulm xOffset={32} height={height * 0.85} tilt={9} color={color} />
      <BambooCulm xOffset={50} height={height * 0.75} tilt={14} color={color} />
    </g>
  );
};

const BambooCulm: React.FC<{
  xOffset: number;
  height: number;
  tilt: number;
  color: string;
}> = ({ xOffset, height, tilt, color }) => {
  return (
    <g transform={`translate(${xOffset}, 0) rotate(${tilt})`}>
      <path
        d={`M -4 0 L -3 ${-height * 0.3} L -2 ${-height * 0.6} L 0 ${-height} L 4 ${-height} L 3 ${-height * 0.6} L 4 ${-height * 0.3} L 5 0 Z`}
        fill={color}
      />
      <ellipse cx="0" cy={-height * 0.25} rx="6" ry="1.5" fill="#000000" />
      <ellipse cx="0" cy={-height * 0.5} rx="5" ry="1.4" fill="#000000" />
      <ellipse cx="0" cy={-height * 0.75} rx="4" ry="1.2" fill="#000000" />
      <path
        d={`M 0 ${-height * 0.5} C 15 ${-height * 0.52}, 30 ${-height * 0.48}, 42 ${-height * 0.44} C 25 ${-height * 0.47}, 10 ${-height * 0.49}, 0 ${-height * 0.5} Z`}
        fill={color}
      />
      <path
        d={`M 0 ${-height * 0.75} C -18 ${-height * 0.77}, -35 ${-height * 0.72}, -48 ${-height * 0.68} C -30 ${-height * 0.72}, -12 ${-height * 0.74}, 0 ${-height * 0.75} Z`}
        fill={color}
      />
    </g>
  );
};

/**
 * PROCEDURAL SWAMP REEDS (Bụi lau sậy đầm lầy)
 */
const SwampReeds: React.FC<{ x: number; y: number; scale: number; color: string }> = ({
  x,
  y,
  scale,
  color,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className="anim-bamboo-sway">
      <path d="M 0 0 Q -10 -80 -25 -160 L -22 -160 Q -8 -80 2 0 Z" fill={color} />
      <path d="M 5 0 Q 8 -90 18 -180 L 21 -180 Q 11 -90 7 0 Z" fill={color} />
      <path d="M -8 0 Q -18 -60 -35 -130 L -33 -130 Q -15 -60 -5 0 Z" fill={color} />
      <path d="M 12 0 Q 25 -70 42 -140 L 45 -140 Q 28 -70 15 0 Z" fill={color} />
      {/* Cattail head cylinders */}
      <ellipse cx="-24" cy="-140" rx="3.5" ry="18" fill="#000" transform="rotate(-10, -24, -140)" />
      <ellipse cx="19" cy="-160" rx="3.5" ry="20" fill="#000" transform="rotate(7, 19, -160)" />
    </g>
  );
};

/**
 * LAYER 2: MAIN GROUND (Y = 800px)
 */
export const MainGroundLayer: React.FC = () => {
  return (
    <g className="environment-layer-2-ground">
      <rect
        x="0"
        y={GROUND_Y}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT - GROUND_Y}
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <path
        d={`M 0 ${GROUND_Y} 
           Q 250 ${GROUND_Y} 400 ${GROUND_Y - 8}
           Q 600 ${GROUND_Y} 780 ${GROUND_Y + 6}
           Q 960 ${GROUND_Y} 1150 ${GROUND_Y - 10}
           Q 1320 ${GROUND_Y} 1500 ${GROUND_Y + 8}
           Q 1670 ${GROUND_Y} 1920 ${GROUND_Y}
           L 1920 ${CANVAS_HEIGHT} L 0 ${CANVAS_HEIGHT} Z`}
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <g fill={COLOR_PALETTE.silhouette_secondary}>
        <path d={`M 150 ${GROUND_Y} L 155 ${GROUND_Y - 22} L 158 ${GROUND_Y} L 164 ${GROUND_Y - 28} L 168 ${GROUND_Y} L 174 ${GROUND_Y - 18} L 178 ${GROUND_Y} Z`} />
        <path d={`M 450 ${GROUND_Y - 6} L 454 ${GROUND_Y - 28} L 458 ${GROUND_Y - 6} L 465 ${GROUND_Y - 35} L 470 ${GROUND_Y - 6} L 476 ${GROUND_Y - 20} L 480 ${GROUND_Y - 6} Z`} />
        <path d={`M 820 ${GROUND_Y + 4} L 826 ${GROUND_Y - 20} L 830 ${GROUND_Y + 4} L 838 ${GROUND_Y - 30} L 843 ${GROUND_Y + 4} Z`} />
        <path d={`M 1180 ${GROUND_Y - 7} L 1185 ${GROUND_Y - 28} L 1190 ${GROUND_Y - 7} L 1198 ${GROUND_Y - 34} L 1204 ${GROUND_Y - 7} L 1210 ${GROUND_Y - 22} L 1215 ${GROUND_Y - 7} Z`} />
        <path d={`M 1540 ${GROUND_Y + 6} L 1545 ${GROUND_Y - 20} L 1550 ${GROUND_Y + 6} L 1558 ${GROUND_Y - 32} L 1563 ${GROUND_Y + 6} Z`} />
        <path d={`M 1820 ${GROUND_Y} L 1826 ${GROUND_Y - 26} L 1832 ${GROUND_Y} L 1840 ${GROUND_Y - 36} L 1846 ${GROUND_Y} L 1852 ${GROUND_Y - 22} L 1858 ${GROUND_Y} Z`} />
      </g>
    </g>
  );
};

/**
 * LAYER 3: FOREGROUND
 */
export const ForegroundLayer: React.FC<{ fogDensity: number; skyPreset: SkyPresetId }> = ({
  fogDensity,
}) => {
  return (
    <g className="environment-layer-3-foreground" pointerEvents="none">
      <g className="anim-fog-wave-slow" opacity={fogDensity * 0.85}>
        <path
          d={`M -200 ${GROUND_Y - 140} 
             C 150 ${GROUND_Y - 220}, 450 ${GROUND_Y - 60}, 850 ${GROUND_Y - 180} 
             C 1250 ${GROUND_Y - 240}, 1650 ${GROUND_Y - 90}, 2100 ${GROUND_Y - 190} 
             L 2100 ${CANVAS_HEIGHT} L -200 ${CANVAS_HEIGHT} Z`}
          fill="url(#ground-fog-grad)"
        />
      </g>
      <g className="anim-fog-wave-fast" opacity={fogDensity * 0.75}>
        <path
          d={`M -150 ${GROUND_Y - 80} 
             C 200 ${GROUND_Y - 170}, 600 ${GROUND_Y - 40}, 1050 ${GROUND_Y - 150} 
             C 1450 ${GROUND_Y - 200}, 1800 ${GROUND_Y - 70}, 2200 ${GROUND_Y - 140} 
             L 2200 ${CANVAS_HEIGHT} L -150 ${CANVAS_HEIGHT} Z`}
          fill="url(#ground-fog-grad)"
        />
      </g>

      {/* Overhanging Branches */}
      <path
        d="M 0 0 C 80 40, 150 90, 210 160 C 230 185, 270 210, 310 230 C 270 220, 230 190, 190 145 C 130 85, 60 30, 0 15 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <path
        d="M 1920 0 C 1820 50, 1720 110, 1630 185 C 1600 210, 1540 235, 1490 255 C 1545 240, 1605 210, 1655 165 C 1740 95, 1830 35, 1920 18 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />

      {/* Cinematic Vignette */}
      <rect
        x="0"
        y="0"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill="url(#vignette-grad)"
        style={{ mixBlendMode: "multiply" }}
      />
    </g>
  );
};
