import React from "react";
import type { ThemeId, SkyPresetId } from "../types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y, COLOR_PALETTE } from "../constants";

/**
 * LAYER 0: SKY, MOON / ECLIPSE, CLOUDS, THUNDER
 */
export const SkyLayer: React.FC<{
  skyPreset: SkyPresetId;
  thunderFlash?: boolean;
  theme?: ThemeId;
}> = ({ skyPreset, thunderFlash = false, theme }) => {
  const isBloodMoon = skyPreset === "blood_moon";
  const isStormy = skyPreset === "stormy_dark";
  const isEclipse = skyPreset === "eclipse_abyss";
  const isVehicle = theme === "vehicle_interior";
  const isIndoor =
    theme === "modern_indoor" ||
    (!theme && (skyPreset === "flickering_fluorescent" || skyPreset === "dim_indoor_night"));
  const isFluorescent = skyPreset === "flickering_fluorescent";

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

      {/* Vehicle Ceiling vs. Indoor Hallway Ceiling vs. Outdoor Celestial Moon */}
      {isVehicle ? (
        <VehicleCabinCeilingLayer isFluorescent={isFluorescent} />
      ) : isIndoor ? (
        <IndoorCeilingLayer isFluorescent={isFluorescent} />
      ) : (
        <>
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
        </>
      )}
    </g>
  );
};

/**
 * VEHICLE INTERIOR CEILING LAYER (Trần xe uốn cong, khoang thoát hiểm, quai nắm tay vịn đu đưa, đèn trần cabin)
 */
const VehicleCabinCeilingLayer: React.FC<{ isFluorescent: boolean }> = ({ isFluorescent }) => {
  const lightColor = isFluorescent ? "#A5F3FC" : "#FDE68A";
  const lightGlow = isFluorescent ? "rgba(56, 189, 248, 0.28)" : "rgba(251, 191, 36, 0.24)";

  return (
    <g className="vehicle-ceiling-group">
      {/* 1. Curved Outer Bus Bulkhead / Roof Arch */}
      <path
        d="M 0 0 L 1920 0 L 1920 180 Q 1550 120 960 120 Q 370 120 0 180 Z"
        fill="#07090F"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* 2. Inner Recessed Ceiling Panels with Seams */}
      <path
        d="M 30 0 L 1890 0 L 1890 150 Q 1520 100 960 100 Q 400 100 30 150 Z"
        fill="#0B0E17"
      />
      <line x1="40" y1="80" x2="1880" y2="80" stroke="#161F2E" strokeWidth="1.5" strokeDasharray="30,14" />
      <line x1="60" y1="40" x2="1860" y2="40" stroke="#101724" strokeWidth="1" strokeDasharray="20,10" />

      {/* 3. Roof Emergency Escape Hatch in Center */}
      <g transform="translate(960, 52)">
        <rect x="-95" y="-32" width="190" height="64" rx="5" fill="#05070C" stroke="#DC2626" strokeWidth="2" />
        <rect x="-88" y="-25" width="176" height="50" rx="3" fill="#180707" opacity="0.75" />
        <text
          x="0"
          y="2"
          textAnchor="middle"
          fill="#EF4444"
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          THOÁT HIỂM / EMERGENCY EXIT
        </text>
        {/* Release latch handles */}
        <rect x="-72" y="-18" width="9" height="36" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
        <rect x="63" y="-18" width="9" height="36" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
      </g>

      {/* 4. Overhead Fluorescent Strip Fixtures with Flickering Downlight */}
      {/* Left Light */}
      <g transform="translate(420, 108)">
        <rect x="-140" y="-8" width="280" height="16" rx="3" fill="#05070B" stroke="#1E293B" strokeWidth="1" />
        <rect x="-132" y="-4" width="264" height="8" rx="2" fill={lightGlow} className="anim-flicker-ember" />
        <rect x="-125" y="-2" width="250" height="4" rx="1.5" fill={lightColor} className="anim-flicker-ember" />
        <ellipse cx="0" cy="18" rx="180" ry="32" fill="url(#bus-cabin-light)" pointerEvents="none" />
      </g>
      {/* Right Light */}
      <g transform="translate(1500, 108)">
        <rect x="-140" y="-8" width="280" height="16" rx="3" fill="#05070B" stroke="#1E293B" strokeWidth="1" />
        <rect x="-132" y="-4" width="264" height="8" rx="2" fill={lightGlow} className="anim-flicker-fast" />
        <rect x="-125" y="-2" width="250" height="4" rx="1.5" fill={lightColor} className="anim-flicker-fast" />
        <ellipse cx="0" cy="18" rx="180" ry="32" fill="url(#bus-cabin-light)" pointerEvents="none" />
      </g>

      {/* 5. Overhead Continuous Stainless Steel Handrail Pipe (Y = 175) */}
      <line x1="40" y1="175" x2="1880" y2="175" stroke="#475569" strokeWidth="4.5" />
      <line x1="40" y1="172" x2="1880" y2="172" stroke="#94A3B8" strokeWidth="1.2" />

      {/* 6. Swaying Hanging Hand Straps */}
      {[220, 460, 700, 960, 1220, 1460, 1700].map((strapX, idx) => (
        <g
          key={idx}
          transform={`translate(${strapX}, 175)`}
          className="anim-pendulum-sway"
          style={{ transformOrigin: "0px 0px", animationDelay: `${(idx * 0.45) % 2.7}s` }}
        >
          {/* Black leather strap */}
          <line x1="0" y1="0" x2="0" y2="52" stroke="#0F172A" strokeWidth="4" />
          <circle cx="0" cy="0" r="3.5" fill="#64748B" />
          {/* Triangular yellow/amber grip loop */}
          <polygon
            points="-13,52 13,52 0,76"
            fill="none"
            stroke="#EAB308"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="0" cy="52" r="3" fill="#EAB308" />
        </g>
      ))}
    </g>
  );
};

/**
 * INDOOR CEILING LAYER (Ceiling tiles, hanging ducts, tube lights, exit sign)
 */
const IndoorCeilingLayer: React.FC<{ isFluorescent: boolean }> = ({ isFluorescent }) => {
  const tubeLightColor = isFluorescent ? "#A7F3D0" : "#FDE68A";
  const tubeGlow = isFluorescent ? "rgba(52, 211, 153, 0.28)" : "rgba(251, 191, 36, 0.24)";
  const exitGlow = isFluorescent ? "#10B981" : "#F59E0B";

  return (
    <g className="indoor-ceiling-group">
      {/* Ceiling Drop-Tile Grid Lines receding to vanishing point */}
      <g stroke="#1E293B" strokeWidth="1" opacity="0.35">
        <line x1="0" y1="120" x2="1920" y2="120" />
        <line x1="0" y1="240" x2="1920" y2="240" />
        <line x1="0" y1="360" x2="1920" y2="360" />
        <line x1="0" y1="0" x2="720" y2="440" />
        <line x1="480" y1="0" x2="840" y2="440" />
        <line x1="960" y1="0" x2="960" y2="440" />
        <line x1="1440" y1="0" x2="1080" y2="440" />
        <line x1="1920" y1="0" x2="1200" y2="440" />
      </g>

      {/* Industrial Air Ducts & Overhead Pipes */}
      <g opacity="0.6">
        <rect x="0" y="35" width="1920" height="26" fill="#0A0C10" stroke="#1E293B" strokeWidth="1.5" />
        <path d="M 120 61 L 120 140 Q 120 160 140 160 L 320 160" fill="none" stroke="#161B26" strokeWidth="6" />
        <path d="M 1800 61 L 1800 130 Q 1800 150 1780 150 L 1600 150" fill="none" stroke="#161B26" strokeWidth="6" />
        {/* Dangling loose power wires */}
        <path d="M 680 61 Q 710 170 725 210" fill="none" stroke="#0E121A" strokeWidth="2" />
        <path d="M 1240 61 Q 1220 180 1205 230" fill="none" stroke="#0E121A" strokeWidth="2" />
      </g>

      {/* Recessed Overhead Tube Light Fixtures */}
      {/* Left Tube Fixture */}
      <g transform="translate(420, 150)">
        <rect x="-140" y="-12" width="280" height="24" rx="3" fill="#080A0F" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="-130" y="-8" width="260" height="16" rx="4" fill={tubeGlow} className="anim-flicker-ember" />
        <rect x="-120" y="-4" width="240" height="8" rx="3" fill={tubeLightColor} className="anim-flicker-ember" />
      </g>

      {/* Right Tube Fixture */}
      <g transform="translate(1500, 150)">
        <rect x="-140" y="-12" width="280" height="24" rx="3" fill="#080A0F" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="-130" y="-8" width="260" height="16" rx="4" fill={tubeGlow} className="anim-flicker-fast" />
        <rect x="-120" y="-4" width="240" height="8" rx="3" fill={tubeLightColor} className="anim-flicker-fast" />
      </g>

      {/* Mid-distance Center Tube Fixture */}
      <g transform="translate(960, 270) scale(0.65)">
        <rect x="-110" y="-10" width="220" height="20" rx="2" fill="#080A0F" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="-100" y="-6" width="200" height="12" rx="3" fill={tubeGlow} className="anim-flicker-ember" />
        <rect x="-90" y="-3" width="180" height="6" rx="2" fill={tubeLightColor} className="anim-flicker-ember" />
      </g>

      {/* Distant Glowing EXIT Emergency Sign */}
      <g transform="translate(960, 395)" className="anim-pulse-eerie">
        <rect x="-26" y="-12" width="52" height="24" rx="2" fill="#040608" stroke={exitGlow} strokeWidth="1.5" />
        <rect x="-24" y="-10" width="48" height="20" fill={exitGlow} opacity="0.22" />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill={exitGlow}
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="1"
        >
          EXIT
        </text>
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
      {/* THEME 4 & 5: MODERN INDOOR CORRIDOR vs. VEHICLE INTERIOR */}
      {theme === "modern_indoor" ? (
        <IndoorCorridorBackground skyPreset={skyPreset} />
      ) : theme === "vehicle_interior" ? (
        <VehicleInteriorBackground skyPreset={skyPreset} />
      ) : (
        <>
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
        </>
      )}

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
 * INDOOR CORRIDOR PERSPECTIVE BACKGROUND
 */
const IndoorCorridorBackground: React.FC<{ skyPreset: SkyPresetId }> = ({ skyPreset }) => {
  const isFluorescent = skyPreset === "flickering_fluorescent";
  const wallTone = isFluorescent ? "#091214" : "#140F0A";
  const trimTone = isFluorescent ? "#0E1E20" : "#221A12";

  return (
    <g className="indoor-corridor-perspective">
      {/* End Hallway Wall Silhouette (Receding center corridor) */}
      <rect x="760" y="440" width="400" height="360" fill={wallTone} />
      <rect x="760" y="440" width="400" height="360" fill="#05070A" opacity="0.4" />
      {/* Distant double fire door at the end of hallway */}
      <rect x="880" y="560" width="160" height="240" fill="#030406" stroke={trimTone} strokeWidth="2" />
      <line x1="960" y1="560" x2="960" y2="800" stroke={trimTone} strokeWidth="2" />
      {/* Wire glass window slits on distant doors */}
      <rect x="905" y="600" width="22" height="60" rx="2" fill={isFluorescent ? "#082B24" : "#2D1D09"} stroke={trimTone} strokeWidth="1" />
      <rect x="985" y="600" width="22" height="60" rx="2" fill={isFluorescent ? "#082B24" : "#2D1D09"} stroke={trimTone} strokeWidth="1" />
      <line x1="880" y1="710" x2="955" y2="710" stroke="#475569" strokeWidth="2.5" />
      <line x1="965" y1="710" x2="1040" y2="710" stroke="#475569" strokeWidth="2.5" />

      {/* Receding Left Hallway Wall & Door Frames */}
      <polygon points="0,0 760,440 760,800 0,800" fill={wallTone} />
      <line x1="0" y1="785" x2="760" y2="795" stroke={trimTone} strokeWidth="6" />
      <line x1="0" y1="670" x2="760" y2="720" stroke={trimTone} strokeWidth="3" />
      {/* Left Doorway 1 */}
      <polygon points="120,70 290,170 290,800 120,800" fill="#020305" stroke={trimTone} strokeWidth="3" />
      <polygon points="135,100 275,185 275,795 135,795" fill="#000000" />
      {/* Left Doorway 2 */}
      <polygon points="440,255 560,325 560,800 440,800" fill="#020305" stroke={trimTone} strokeWidth="2" />
      <polygon points="450,275 550,335 550,795 450,795" fill="#000000" />

      {/* Receding Right Hallway Wall & Door Frames */}
      <polygon points="1920,0 1160,440 1160,800 1920,800" fill={wallTone} />
      <line x1="1920" y1="785" x2="1160" y2="795" stroke={trimTone} strokeWidth="6" />
      <line x1="1920" y1="670" x2="1160" y2="720" stroke={trimTone} strokeWidth="3" />
      {/* Right Doorway 1 */}
      <polygon points="1800,70 1630,170 1630,800 1800,800" fill="#020305" stroke={trimTone} strokeWidth="3" />
      <polygon points="1785,100 1645,185 1645,795 1785,795" fill="#000000" />
      {/* Right Doorway 2 */}
      <polygon points="1480,255 1360,325 1360,800 1480,800" fill="#020305" stroke={trimTone} strokeWidth="2" />
      <polygon points="1470,275 1370,335 1370,795 1470,795" fill="#000000" />

      {/* Receding Floor Perspective Grid Lines */}
      <g stroke={trimTone} strokeWidth="1" opacity="0.45">
        <line x1="180" y1="800" x2="800" y2="800" />
        <line x1="380" y1="800" x2="860" y2="800" />
        <line x1="1540" y1="800" x2="1120" y2="800" />
        <line x1="1740" y1="800" x2="1060" y2="800" />
      </g>
    </g>
  );
};

/**
 * VEHICLE INTERIOR PERSPECTIVE & PANORAMIC WINDOWS BACKGROUND
 * 5 panoramic vehicle window bays looking out into midnight misty road,
 * structural steel pillars with emergency hammer & notices, and rows of passenger seats.
 */
const VehicleInteriorBackground: React.FC<{ skyPreset: SkyPresetId }> = ({ skyPreset }) => {
  const isFluorescent = skyPreset === "flickering_fluorescent";
  const glassTint = isFluorescent ? "#061014" : "#0A0D14";

  return (
    <g className="vehicle-interior-panoramic-background">
      {/* 1. Outside Desolate Night Road Horizon visible through glass openings */}
      <rect x="0" y="190" width={CANVAS_WIDTH} height="480" fill="#04060A" />

      {/* Passing Dark Roadside Tree Silhouettes & Telephone Wires */}
      <g className="anim-cloud-drift-fast" opacity="0.6">
        <path
          d="M -100 520 Q 150 480 350 510 Q 550 470 750 515 Q 1000 480 1250 520 Q 1500 475 1750 510 Q 2000 485 2200 520 L 2200 670 L -100 670 Z"
          fill="#020306"
        />
        {/* Telephone poles & wires */}
        <line x1="280" y1="360" x2="280" y2="670" stroke="#010204" strokeWidth="3" />
        <line x1="260" y1="390" x2="300" y2="390" stroke="#010204" strokeWidth="2" />
        <line x1="1100" y1="350" x2="1100" y2="670" stroke="#010204" strokeWidth="3" />
        <line x1="1080" y1="380" x2="1120" y2="380" stroke="#010204" strokeWidth="2" />
        <path d="M 0 400 Q 280 430 600 410 Q 1100 440 1920 405" fill="none" stroke="#020305" strokeWidth="1" opacity="0.7" />
      </g>

      {/* 2. FIVE LARGE PANORAMIC BUS WINDOW BAYS */}
      {/* Window Bay 1 (Far Left: 50 to 370) */}
      <g className="window-bay-1">
        <rect x="50" y="200" width="320" height="460" rx="10" fill={glassTint} stroke="#1E293B" strokeWidth="3.5" />
        <rect x="54" y="204" width="312" height="452" rx="8" fill="url(#bus-window-fog)" opacity="0.85" />
        {/* Twisted tree silhouettes outside */}
        <path
          d="M 60 520 Q 110 460 140 430 Q 180 390 220 370 M 140 430 Q 170 410 190 390 M 120 450 Q 80 420 70 380"
          fill="none"
          stroke="#030508"
          strokeWidth="3"
          opacity="0.8"
        />
      </g>

      {/* Window Bay 2 (Mid Left: 420 to 740) */}
      <g className="window-bay-2">
        <rect x="420" y="200" width="320" height="460" rx="10" fill={glassTint} stroke="#1E293B" strokeWidth="3.5" />
        <rect x="424" y="204" width="312" height="452" rx="8" fill="url(#bus-window-fog)" opacity="0.85" />
        {/* Bloody palm smear on glass */}
        <g transform="translate(580, 420)" opacity="0.7">
          <ellipse cx="0" cy="0" rx="10" ry="14" fill="#7F1D1D" />
          <circle cx="-9" cy="-15" r="2.5" fill="#7F1D1D" />
          <circle cx="-3" cy="-21" r="2.8" fill="#7F1D1D" />
          <circle cx="4" cy="-20" r="2.7" fill="#7F1D1D" />
          <circle cx="10" cy="-14" r="2.4" fill="#7F1D1D" />
          {/* Blood drips down */}
          <path d="M -4 14 Q -3 36 -4 55 M 3 14 Q 4 45 3 70" stroke="#7F1D1D" strokeWidth="1.5" fill="none" />
        </g>
      </g>

      {/* Window Bay 3 (Center Bay / Double Exit Doors: 790 to 1130) */}
      <g className="window-bay-3-center-doors">
        <rect x="790" y="200" width="340" height="460" rx="10" fill={glassTint} stroke="#1E293B" strokeWidth="3.5" />
        <rect x="794" y="204" width="332" height="452" rx="8" fill="url(#bus-window-fog)" opacity="0.85" />
        {/* Door split seam */}
        <line x1="960" y1="200" x2="960" y2="660" stroke="#0F172A" strokeWidth="4" />
        <line x1="960" y1="200" x2="960" y2="660" stroke="#EAB308" strokeWidth="1" strokeDasharray="18,18" />
        {/* Door safety glass dividing frames */}
        <line x1="790" y1="460" x2="1130" y2="460" stroke="#1E293B" strokeWidth="2.5" />
        {/* Internal yellow grab handles on doors */}
        <line x1="945" y1="360" x2="945" y2="520" stroke="#EAB308" strokeWidth="3" />
        <line x1="975" y1="360" x2="975" y2="520" stroke="#EAB308" strokeWidth="3" />
      </g>

      {/* Window Bay 4 (Mid Right: 1180 to 1500) */}
      <g className="window-bay-4">
        <rect x="1180" y="200" width="320" height="460" rx="10" fill={glassTint} stroke="#1E293B" strokeWidth="3.5" />
        <rect x="1184" y="204" width="312" height="452" rx="8" fill="url(#bus-window-fog)" opacity="0.85" />
        {/* Spiderweb fractured glass */}
        <g transform="translate(1340, 360)" opacity="0.8">
          <path
            d="M 0 0 L -40 -35 L -70 -25 M 0 0 L 35 -40 L 65 -30 M 0 0 L 45 40 L 80 50 M 0 0 L -30 45 L -55 75 M 0 0 L 10 -60 M 0 0 L -10 65"
            stroke="#94A3B8"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M -25 -20 Q 0 -30 25 -25 Q 30 0 28 25 Q 0 35 -20 28 Q -30 0 -25 -20"
            stroke="#64748B"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </g>

      {/* Window Bay 5 (Far Right: 1550 to 1870) */}
      <g className="window-bay-5">
        <rect x="1550" y="200" width="320" height="460" rx="10" fill={glassTint} stroke="#1E293B" strokeWidth="3.5" />
        <rect x="1554" y="204" width="312" height="452" rx="8" fill="url(#bus-window-fog)" opacity="0.85" />
      </g>

      {/* 3. VERTICAL BULKHEAD PILLARS BETWEEN WINDOWS */}
      {/* Pillar 1 (370 to 420) with Red Emergency Hammer */}
      <rect x="370" y="190" width="50" height="470" fill="#090D16" stroke="#1E293B" strokeWidth="1.5" />
      <g transform="translate(395, 380)">
        <rect x="-8" y="-22" width="16" height="44" rx="2" fill="#04060A" stroke="#475569" strokeWidth="1" />
        {/* Red Hammer */}
        <line x1="0" y1="-14" x2="0" y2="15" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        <rect x="-6" y="-18" width="12" height="7" rx="1.5" fill="#DC2626" />
        <polygon points="-6,-15 -9,-15 -6,-12" fill="#F87171" />
      </g>

      {/* Pillar 2 (740 to 790) */}
      <rect x="740" y="190" width="50" height="470" fill="#090D16" stroke="#1E293B" strokeWidth="1.5" />

      {/* Pillar 3 (1130 to 1180) with CCTV & Warning Decal */}
      <rect x="1130" y="190" width="50" height="470" fill="#090D16" stroke="#1E293B" strokeWidth="1.5" />
      <g transform="translate(1155, 360)">
        <rect x="-14" y="-18" width="28" height="36" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        <rect x="-10" y="-14" width="20" height="8" fill="#DC2626" />
        <text x="0" y="-8" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">CCTV</text>
        <line x1="-10" y1="2" x2="10" y2="2" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="-8" y1="7" x2="8" y2="7" stroke="#64748B" strokeWidth="1" />
      </g>

      {/* Pillar 4 (1500 to 1550) */}
      <rect x="1500" y="190" width="50" height="470" fill="#090D16" stroke="#1E293B" strokeWidth="1.5" />

      {/* 4. LOWER INTERIOR SIDE-WALL PANELS (Y = 660 to 800) */}
      <rect x="0" y="660" width={CANVAS_WIDTH} height="140" fill="#080B12" />
      <line x1="0" y1="660" x2={CANVAS_WIDTH} y2="660" stroke="#1E293B" strokeWidth="3" />
      <line x1="0" y1="720" x2={CANVAS_WIDTH} y2="720" stroke="#111827" strokeWidth="1.5" />
      <line x1="0" y1="780" x2={CANVAS_WIDTH} y2="780" stroke="#0E131F" strokeWidth="2" />

      {/* 5. ROWS OF PASSENGER HIGH-BACK SEAT SILHOUETTES */}
      {[
        { x: 140 },
        { x: 280 },
        { x: 500 },
        { x: 640 },
        { x: 1260 },
        { x: 1400 },
        { x: 1640 },
        { x: 1780 },
      ].map((seat, i) => (
        <g key={i} transform={`translate(${seat.x}, 800)`} className="passenger-seat-silhouette">
          {/* Seat base bracket */}
          <line x1="-12" y1="0" x2="-12" y2="-80" stroke="#020306" strokeWidth="5" />
          <line x1="12" y1="0" x2="12" y2="-80" stroke="#020306" strokeWidth="5" />
          {/* Seat cushion */}
          <rect x="-32" y="-100" width="64" height="25" rx="5" fill="#05070D" stroke="#0F172A" strokeWidth="1.5" />
          {/* High backrest */}
          <path
            d="M -26 -100 L -22 -220 C -22 -235, 22 -235, 22 -220 L 26 -100 Z"
            fill="#060912"
            stroke="#151E2E"
            strokeWidth="2"
          />
          {/* Headrest */}
          <rect x="-18" y="-235" width="36" height="24" rx="4" fill="#04060A" stroke="#1E293B" strokeWidth="1" />
          {/* Top corner stainless steel grab handle */}
          <path
            d="M -18 -225 Q -18 -245 0 -245 Q 18 -245 18 -225"
            fill="none"
            stroke="#475569"
            strokeWidth="2.5"
          />
        </g>
      ))}
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
 * VEHICLE INTERIOR FLOOR LAYER (Sàn xe buýt cao su chống trượt, vạch vàng an toàn, nắp khoang động cơ)
 */
const VehicleFloorLayer: React.FC = () => {
  return (
    <g className="environment-layer-2-ground-vehicle">
      {/* 1. Solid Heavy-Duty Transit Floor */}
      <rect
        x="0"
        y={GROUND_Y}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT - GROUND_Y}
        fill="#06080F"
      />

      {/* 2. Ribbed Anti-Slip Rubber Floor Grooves */}
      <g stroke="#0E131E" strokeWidth="2" opacity="0.8">
        <line x1="0" y1={GROUND_Y + 25} x2={CANVAS_WIDTH} y2={GROUND_Y + 25} />
        <line x1="0" y1={GROUND_Y + 50} x2={CANVAS_WIDTH} y2={GROUND_Y + 50} />
        <line x1="0" y1={GROUND_Y + 75} x2={CANVAS_WIDTH} y2={GROUND_Y + 75} />
        <line x1="0" y1={GROUND_Y + 100} x2={CANVAS_WIDTH} y2={GROUND_Y + 100} />
        <line x1="0" y1={GROUND_Y + 130} x2={CANVAS_WIDTH} y2={GROUND_Y + 130} />
        <line x1="0" y1={GROUND_Y + 165} x2={CANVAS_WIDTH} y2={GROUND_Y + 165} />
        <line x1="0" y1={GROUND_Y + 205} x2={CANVAS_WIDTH} y2={GROUND_Y + 205} />
        <line x1="0" y1={GROUND_Y + 245} x2={CANVAS_WIDTH} y2={GROUND_Y + 245} />
      </g>

      {/* 3. Vivid Yellow Safety Caution Boundary Lines along Ground Line Y = 800 */}
      <line x1="0" y1={GROUND_Y} x2={CANVAS_WIDTH} y2={GROUND_Y} stroke="#CA8A04" strokeWidth="3" />
      <line
        x1="0"
        y1={GROUND_Y + 8}
        x2={CANVAS_WIDTH}
        y2={GROUND_Y + 8}
        stroke="#EAB308"
        strokeWidth="2.5"
        strokeDasharray="26,14"
      />

      {/* 4. Recessed Center Aisle Engine Access Hatch */}
      <g transform={`translate(960, ${GROUND_Y + 70})`}>
        <rect x="-120" y="-30" width="240" height="120" rx="4" fill="#080C14" stroke="#1E293B" strokeWidth="2" />
        <line x1="-120" y1="30" x2="120" y2="30" stroke="#151E2E" strokeWidth="1.5" />
        {/* Recessed lift rings */}
        <circle cx="-70" cy="30" r="8" fill="none" stroke="#64748B" strokeWidth="2.5" />
        <circle cx="70" cy="30" r="8" fill="none" stroke="#64748B" strokeWidth="2.5" />
      </g>

      {/* 5. Subtle wheel well arches on far left & far right */}
      <path d={`M 0 ${GROUND_Y} Q 90 ${GROUND_Y - 24} 180 ${GROUND_Y} L 0 ${GROUND_Y} Z`} fill="#05070D" />
      <path d={`M 1740 ${GROUND_Y} Q 1830 ${GROUND_Y - 24} 1920 ${GROUND_Y} L 1920 ${GROUND_Y} Z`} fill="#05070D" />
    </g>
  );
};

/**
 * LAYER 2: MAIN GROUND (Y = 800px)
 */
export const MainGroundLayer: React.FC<{ theme?: ThemeId }> = ({ theme }) => {
  if (theme === "vehicle_interior") {
    return <VehicleFloorLayer />;
  }

  if (theme === "modern_indoor") {
    return (
      <g className="environment-layer-2-ground-indoor">
        {/* Solid Indoor Floor */}
        <rect
          x="0"
          y={GROUND_Y}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT - GROUND_Y}
          fill={COLOR_PALETTE.silhouette_primary}
        />
        {/* Floor Sheen Line & Base Trim */}
        <line x1="0" y1={GROUND_Y} x2={CANVAS_WIDTH} y2={GROUND_Y} stroke="#1E293B" strokeWidth="2" />
        <line x1="0" y1={GROUND_Y + 12} x2={CANVAS_WIDTH} y2={GROUND_Y + 12} stroke="#0B0F17" strokeWidth="2" />
        {/* Polished Floor Tile Seams */}
        <g stroke="#141A24" strokeWidth="1.5" opacity="0.6">
          <line x1="160" y1={GROUND_Y} x2="80" y2={CANVAS_HEIGHT} />
          <line x1="420" y1={GROUND_Y} x2="340" y2={CANVAS_HEIGHT} />
          <line x1="720" y1={GROUND_Y} x2="680" y2={CANVAS_HEIGHT} />
          <line x1="960" y1={GROUND_Y} x2="960" y2={CANVAS_HEIGHT} />
          <line x1="1200" y1={GROUND_Y} x2="1240" y2={CANVAS_HEIGHT} />
          <line x1="1500" y1={GROUND_Y} x2="1580" y2={CANVAS_HEIGHT} />
          <line x1="1760" y1={GROUND_Y} x2="1840" y2={CANVAS_HEIGHT} />
          <line x1="0" y1={GROUND_Y + 60} x2={CANVAS_WIDTH} y2={GROUND_Y + 60} />
          <line x1="0" y1={GROUND_Y + 140} x2={CANVAS_WIDTH} y2={GROUND_Y + 140} />
          <line x1="0" y1={GROUND_Y + 220} x2={CANVAS_WIDTH} y2={GROUND_Y + 220} />
        </g>
      </g>
    );
  }

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
export const ForegroundLayer: React.FC<{
  fogDensity: number;
  skyPreset: SkyPresetId;
  theme?: ThemeId;
}> = ({ fogDensity, theme }) => {
  const isVehicle = theme === "vehicle_interior";
  const isIndoor = theme === "modern_indoor";

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

      {/* Foreground Framing Elements */}
      {isVehicle ? (
        <g className="vehicle-foreground-framing">
          {/* Vertical Yellow Stanchion Poles with red STOP buttons spanning from ceiling rail (175) to floor (800) */}
          {[280, 720, 1200, 1640].map((poleX, idx) => (
            <g key={idx}>
              {/* Main heavy-duty yellow pole tube */}
              <line x1={poleX} y1="175" x2={poleX} y2={GROUND_Y} stroke="#CA8A04" strokeWidth="8" />
              <line x1={poleX - 1.5} y1="175" x2={poleX - 1.5} y2={GROUND_Y} stroke="#EAB308" strokeWidth="4" />
              <line x1={poleX - 2.5} y1="175" x2={poleX - 2.5} y2={GROUND_Y} stroke="#FEF08A" strokeWidth="1" opacity="0.6" />

              {/* Floor mounting flange collar */}
              <rect x={poleX - 10} y={GROUND_Y - 8} width="20" height="8" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
              <line x1={poleX - 12} y1={GROUND_Y} x2={poleX + 12} y2={GROUND_Y} stroke="#EAB308" strokeWidth="2" />

              {/* Red STOP Bell Button Module mounted at chest height (Y = 560) */}
              <g transform={`translate(${poleX}, 560)`}>
                <rect x="-8" y="-18" width="16" height="36" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                <rect x="-5" y="-12" width="10" height="24" rx="2" fill="#EF4444" />
                <circle cx="0" cy="0" r="3" fill="#FEE2E2" className="anim-pulse-eerie" />
              </g>
            </g>
          ))}

          {/* Claustrophobic Darkness Edge Vignettes */}
          <rect x="0" y="0" width="120" height={CANVAS_HEIGHT} fill="url(#left-shadow-vignette)" opacity="0.85" />
          <rect x={CANVAS_WIDTH - 120} y="0" width="120" height={CANVAS_HEIGHT} fill="url(#right-shadow-vignette)" opacity="0.85" />
        </g>
      ) : isIndoor ? (
        <g className="indoor-foreground-framing">
          {/* Left Doorway Jamb Frame */}
          <path d="M 0 0 L 70 0 L 50 1080 L 0 1080 Z" fill={COLOR_PALETTE.silhouette_primary} />
          {/* Right Doorway Jamb Frame */}
          <path d="M 1920 0 L 1850 0 L 1870 1080 L 1920 1080 Z" fill={COLOR_PALETTE.silhouette_primary} />
          {/* Top Hanging Ceiling Duct Silhouette */}
          <path d="M 0 0 L 320 0 L 260 70 L 0 50 Z" fill={COLOR_PALETTE.silhouette_primary} />
          <path d="M 1920 0 L 1600 0 L 1660 70 L 1920 50 Z" fill={COLOR_PALETTE.silhouette_primary} />
        </g>
      ) : (
        <>
          {/* Overhanging Branches */}
          <path
            d="M 0 0 C 80 40, 150 90, 210 160 C 230 185, 270 210, 310 230 C 270 220, 230 190, 190 145 C 130 85, 60 30, 0 15 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
          <path
            d="M 1920 0 C 1820 50, 1720 110, 1630 185 C 1600 210, 1540 235, 1490 255 C 1545 240, 1605 210, 1655 165 C 1740 95, 1830 35, 1920 18 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
        </>
      )}

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
