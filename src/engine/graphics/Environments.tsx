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
  const isThatched = theme === "thatched_house_interior";
  const isIndoor =
    theme === "modern_indoor" ||
    (!theme && (skyPreset === "flickering_fluorescent" || skyPreset === "dim_indoor_night"));
  const isFluorescent = skyPreset === "flickering_fluorescent";

  return (
    <g className="environment-layer-0-sky">
      {/* Dynamic Sky Background Gradient with cinematic camera overscan margin */}
      <rect
        x="-400"
        y="-200"
        width={CANVAS_WIDTH + 800}
        height={CANVAS_HEIGHT + 400}
        fill={`url(#sky-grad-${skyPreset})`}
      />

      {/* Lightning Flash Overlay */}
      <rect
        x="-400"
        y="-200"
        width={CANVAS_WIDTH + 800}
        height={CANVAS_HEIGHT + 400}
        fill="#FFFFFF"
        opacity={thunderFlash ? 0.65 : 0}
        className={isStormy ? "anim-lightning-flash" : ""}
        style={{ mixBlendMode: "screen", pointerEvents: "none" }}
      />

      {/* Vehicle Ceiling vs. Thatched Roof Ceiling vs. Indoor Hallway Ceiling vs. Outdoor Celestial Moon */}
      {isVehicle ? (
        <VehicleCabinCeilingLayer isFluorescent={isFluorescent} />
      ) : isThatched ? (
        <ThatchedRoofCeilingLayer skyPreset={skyPreset} />
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

          {/* Urban Overhead Cables & Festoon Lights (when theme is urban_night_market) */}
          {theme === "urban_night_market" && <UrbanOverheadWiresAndLights />}
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
 * URBAN NIGHT MARKET OVERHEAD WIRES & FESTOON STRING LIGHTS
 */
const UrbanOverheadWiresAndLights: React.FC = () => {
  const festoonBulbs = [
    { x: 120, y: 155, color: "#F59E0B", glow: "url(#urban-neon-amber)", delay: "0s" },
    { x: 260, y: 178, color: "#EF4444", glow: "url(#blood-moon-glow-radial)", delay: "0.4s" },
    { x: 420, y: 198, color: "#06B6D4", glow: "url(#urban-neon-cyan)", delay: "0.8s" },
    { x: 580, y: 212, color: "#EC4899", glow: "url(#urban-neon-magenta)", delay: "1.2s" },
    { x: 740, y: 220, color: "#F59E0B", glow: "url(#urban-neon-amber)", delay: "0.2s" },
    { x: 900, y: 222, color: "#10B981", glow: "url(#eclipse-glow-radial)", delay: "0.6s" },
    { x: 1060, y: 218, color: "#EC4899", glow: "url(#urban-neon-magenta)", delay: "1.0s" },
    { x: 1220, y: 206, color: "#06B6D4", glow: "url(#urban-neon-cyan)", delay: "0.3s" },
    { x: 1380, y: 190, color: "#F59E0B", glow: "url(#urban-neon-amber)", delay: "0.7s" },
    { x: 1540, y: 172, color: "#EF4444", glow: "url(#blood-moon-glow-radial)", delay: "1.1s" },
    { x: 1700, y: 150, color: "#06B6D4", glow: "url(#urban-neon-cyan)", delay: "0.5s" },
    { x: 1840, y: 130, color: "#F59E0B", glow: "url(#urban-neon-amber)", delay: "0.9s" },
  ];

  return (
    <g className="urban-overhead-wires-and-lights" pointerEvents="none">
      {/* 1. Sagging high-voltage transmission cables */}
      <path
        d="M -200 70 Q 480 140 1020 150 Q 1520 145 2120 80"
        fill="none"
        stroke="#060910"
        strokeWidth="3"
        opacity="0.9"
      />
      <path
        d="M -200 110 Q 520 190 1060 200 Q 1560 185 2120 120"
        fill="none"
        stroke="#080C16"
        strokeWidth="2.5"
        opacity="0.85"
      />
      <path
        d="M -200 145 Q 600 235 1100 240 Q 1600 220 2120 155"
        fill="none"
        stroke="#05070B"
        strokeWidth="2"
        opacity="0.8"
      />

      {/* 2. Festoon string line supporting market party bulbs */}
      <path
        d="M -100 125 Q 960 255 2020 110"
        fill="none"
        stroke="#111827"
        strokeWidth="1.8"
      />

      {/* 3. Swaying bulb sockets and colorful luminous bulbs */}
      {festoonBulbs.map((bulb, idx) => (
        <g
          key={idx}
          transform={`translate(${bulb.x}, ${bulb.y})`}
          className="anim-pendulum-sway"
          style={{ transformOrigin: "0px -10px", animationDelay: bulb.delay }}
        >
          {/* Hanging cord & socket */}
          <line x1="0" y1="-8" x2="0" y2="4" stroke="#0F172A" strokeWidth="2" />
          <rect x="-3" y="2" width="6" height="5" rx="1" fill="#1E293B" />
          {/* Bulb glow halo */}
          <circle cx="0" cy="11" r="22" fill={bulb.glow} opacity="0.65" />
          {/* Luminous bulb teardrop */}
          <circle cx="0" cy="11" r="5" fill={bulb.color} className="anim-flicker-ember" />
          <circle cx="-1" cy="9" r="1.5" fill="#FFFFFF" opacity="0.8" />
        </g>
      ))}

      {/* 4. Small decorative tattered pennant triangular flags */}
      {[200, 360, 520, 680, 840, 1000, 1160, 1320, 1480, 1640, 1780].map((flagX, i) => {
        const flagY = 135 + Math.sin(i * 0.55) * 45;
        return (
          <polygon
            key={`flag-${i}`}
            points={`${flagX - 10},${flagY} ${flagX + 10},${flagY} ${flagX},${flagY + 22}`}
            fill={i % 2 === 0 ? "#1E1B4B" : "#3B0764"}
            opacity="0.5"
          />
        );
      })}
    </g>
  );
};

/**
 * THATCHED ROOF CEILING LAYER (Vì Kèo Tre, Đòn Dông & Mái Tranh Xơ Xác)
 * Traditional rural Vietnamese thatched hut ceiling with bamboo trusses, hanging straw,
 * and piercing shafts of faint moonlight / eerie night fog.
 */
const ThatchedRoofCeilingLayer: React.FC<{ skyPreset: SkyPresetId }> = ({ skyPreset }) => {
  const isBlood = skyPreset === "blood_moon";

  return (
    <g className="thatched-roof-ceiling-layer">
      {/* 1. Heavy Thatched Eaves Covering Upper Slopes (Mái lá dừa nước / mái rạ dốc hai bên) */}
      {/* Left Roof Thatch Eaves */}
      <path
        d="M -200 -50 L 1000 -50 L 960 110 Q 720 140 460 130 Q 220 160 -50 150 Q -120 170 -200 160 Z"
        fill="#07090D"
        stroke="#161B26"
        strokeWidth="2"
      />
      {/* Right Roof Thatch Eaves */}
      <path
        d="M 920 -50 L 2120 -50 L 2120 160 Q 1980 170 1760 145 Q 1500 165 1240 135 Q 1060 150 920 110 Z"
        fill="#07090D"
        stroke="#161B26"
        strokeWidth="2"
      />

      {/* 2. Ragged Straw Fringe (Lá tranh & ngọn rạ xơ rách rủ xuống lưa thưa) */}
      <path
        d="M -100 130 
           Q -60 180 -40 140 Q 0 195 30 145 Q 70 185 100 135 Q 140 190 180 140
           Q 220 185 260 142 Q 310 195 360 140 Q 420 190 470 138 Q 520 185 570 145
           Q 620 192 670 140 Q 730 188 780 142 Q 840 195 890 135 Q 940 180 980 130
           Q 1030 188 1080 140 Q 1140 192 1190 145 Q 1250 185 1300 138 Q 1360 195 1410 142
           Q 1470 186 1520 140 Q 1580 190 1630 145 Q 1690 185 1740 140 Q 1800 195 1850 142
           Q 1910 188 1960 140 Q 2020 190 2060 135 L 2060 110 L -100 110 Z"
        fill="#05060A"
        stroke="#131620"
        strokeWidth="1.2"
      />

      {/* 3. Main Central Ridge Pole / Bamboo Tie Beam (Đòn Dông Tre & Xà Gồ Ngang Y = 80px) */}
      {/* Upper Ridge Beam */}
      <line x1="-200" y1="45" x2="2120" y2="45" stroke="#090B10" strokeWidth="16" />
      <line x1="-200" y1="43" x2="2120" y2="43" stroke="#181D29" strokeWidth="4" />
      {/* Bamboo Nodes on Main Ridge Beam */}
      {[120, 360, 600, 840, 1080, 1320, 1560, 1800].map((nodeX) => (
        <g key={`ridge-node-${nodeX}`}>
          <rect x={nodeX - 4} y="36" width="8" height="18" rx="2" fill="#242B3B" />
          <line x1={nodeX} y1="36" x2={nodeX} y2="54" stroke="#06080C" strokeWidth="1" />
        </g>
      ))}

      {/* Secondary Lower Tie Beam (Thanh xà gồ ngang thứ hai Y = 120px) */}
      <line x1="-200" y1="120" x2="2120" y2="120" stroke="#080A0E" strokeWidth="12" />
      <line x1="-200" y1="118" x2="2120" y2="118" stroke="#161A24" strokeWidth="3" />

      {/* 4. Diagonal Bamboo Rafters & Trusses (Các thanh vì kèo xiên từ đòn dông xuống) */}
      {[
        { x1: 960, y1: 45, x2: 240, y2: 220 },
        { x1: 960, y1: 45, x2: 480, y2: 220 },
        { x1: 960, y1: 45, x2: 720, y2: 220 },
        { x1: 960, y1: 45, x2: 1200, y2: 220 },
        { x1: 960, y1: 45, x2: 1440, y2: 220 },
        { x1: 960, y1: 45, x2: 1680, y2: 220 },
        { x1: 480, y1: 45, x2: -60, y2: 220 },
        { x1: 1440, y1: 45, x2: 1980, y2: 220 },
      ].map((rafter, i) => (
        <g key={`rafter-${i}`}>
          <line x1={rafter.x1} y1={rafter.y1} x2={rafter.x2} y2={rafter.y2} stroke="#0B0E14" strokeWidth="8" />
          <line x1={rafter.x1 - 1} y1={rafter.y1} x2={rafter.x2 - 1} y2={rafter.y2} stroke="#1C2230" strokeWidth="2" />
        </g>
      ))}

      {/* Rattan Lashings / Knots (Dây lạt mây buộc rui mè tại các điểm giao cắt) */}
      {[
        [240, 120], [480, 120], [720, 120], [960, 45], [960, 120],
        [1200, 120], [1440, 120], [1680, 120]
      ].map(([kx, ky], idx) => (
        <g key={`knot-${idx}`} transform={`translate(${kx}, ${ky})`}>
          <ellipse cx="0" cy="0" rx="9" ry="8" fill="#1C1812" stroke="#524332" strokeWidth="1.2" />
          <line x1="-7" y1="-5" x2="7" y2="5" stroke="#786047" strokeWidth="1.4" />
          <line x1="-7" y1="5" x2="7" y2="-5" stroke="#786047" strokeWidth="1.4" />
        </g>
      ))}

      {/* 5. Light Shaft Piercing Through Thatched Tear (Tia sáng trăng le lói xuyên qua lỗ rách trên mái) */}
      <g opacity="0.65" pointerEvents="none">
        <polygon
          points="460,75 500,75 750,750 630,750"
          fill="url(#thatched-light-beam)"
          style={{ mixBlendMode: "screen" }}
        />
        {/* Glowing roof gap hole */}
        <ellipse cx="480" cy="75" rx="14" ry="4" fill={isBlood ? "#DC2626" : "#E2E8F0"} opacity="0.5" />
      </g>

      {/* 6. Hanging Bundles from Rafters (Bắp khô, dải tỏi xua quỷ, dải bùa vàng đung đưa) */}
      {/* Hanging Dried Corn Cob Bunch (Chùm bắp khô treo xà X = 320) */}
      <g transform="translate(320, 120)" className="anim-pendulum-sway" style={{ transformOrigin: "0px -10px" }}>
        <line x1="0" y1="0" x2="0" y2="28" stroke="#524332" strokeWidth="1.6" />
        {[-8, 0, 8].map((cx, i) => (
          <ellipse key={`corn-${i}`} cx={cx} cy={35 + i * 4} rx="5" ry="12" fill="#713F12" stroke="#A16207" strokeWidth="0.8" />
        ))}
      </g>

      {/* Hanging Garlic/Chili string (Dải tỏi / ớt khô treo trừ tà X = 1380) */}
      <g transform="translate(1380, 120)" className="anim-pendulum-sway" style={{ transformOrigin: "0px -10px", animationDelay: "0.8s" }}>
        <line x1="0" y1="0" x2="0" y2="40" stroke="#524332" strokeWidth="1.4" />
        {[10, 20, 30, 40].map((gy, i) => (
          <circle key={`garlic-${i}`} cx={i % 2 === 0 ? -3 : 3} cy={gy} r="4" fill="#52525B" stroke="#71717A" strokeWidth="0.8" />
        ))}
      </g>

      {/* Hanging Talisman from rafter (Bùa vàng trừ tà treo đỉnh rui X = 860) */}
      <g transform="translate(860, 120)" className="anim-pendulum-sway" style={{ transformOrigin: "0px -10px", animationDelay: "0.4s" }}>
        <line x1="0" y1="0" x2="0" y2="18" stroke="#524332" strokeWidth="1.2" />
        <rect x="-7" y="18" width="14" height="42" fill="#FACC15" opacity="0.85" rx="1" />
        <path d="M 0 22 L 0 54 M -4 30 L 4 30 M -4 42 L 4 42" stroke="#DC2626" strokeWidth="1" />
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
      {/* THEME: THATCHED HOUSE vs. MODERN INDOOR vs. VEHICLE INTERIOR vs. URBAN NIGHT MARKET */}
      {theme === "thatched_house_interior" ? (
        <ThatchedHouseInteriorBackground skyPreset={skyPreset} />
      ) : theme === "modern_indoor" ? (
        <IndoorCorridorBackground skyPreset={skyPreset} />
      ) : theme === "vehicle_interior" ? (
        <VehicleInteriorBackground skyPreset={skyPreset} />
      ) : theme === "urban_night_market" ? (
        <UrbanNightMarketBackground skyPreset={skyPreset} />
      ) : (
        <>
          {/* Distant Misty Mountain Ridges with overscan */}
          <path
            d="M -400 580 L 0 580 C 250 480, 500 560, 750 510 C 1000 460, 1250 540, 1500 490 C 1700 450, 1850 500, 1920 480 L 2320 480 L 2320 850 L -400 850 Z"
            fill={mountainColor}
            opacity="0.8"
          />

          {/* Mid-distance Mist with overscan */}
          <rect
            x="-400"
            y="500"
            width={CANVAS_WIDTH + 800}
            height="350"
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
 * THATCHED HOUSE INTERIOR BACKGROUND (Vách Nứa Đan Nan Tre, Cột Gỗ Mộc & Cửa Sổ Liếp Nứa)
 * Traditional Vietnamese rural hut interior wall with woven wicker/bamboo slat texture,
 * rustic wooden pillars dividing into 3 bays (ba gian), and bamboo window revealing moonlit banana palms.
 */
const ThatchedHouseInteriorBackground: React.FC<{ skyPreset: SkyPresetId }> = ({ skyPreset }) => {
  const isBlood = skyPreset === "blood_moon";
  const outsideSky = isBlood ? "#2B0808" : skyPreset === "eclipse_abyss" ? "#021A12" : "#0A0E17";

  return (
    <g className="thatched-house-interior-background">
      {/* 1. Base Wall Background Fill */}
      <rect
        x="-400"
        y="100"
        width={CANVAS_WIDTH + 800}
        height="710"
        fill="#080A0E"
      />
      <rect
        x="-400"
        y="100"
        width={CANVAS_WIDTH + 800}
        height="710"
        fill="url(#thatched-wall-shadow)"
      />

      {/* 2. Woven Bamboo / Thatched Palm Wall Weave Texture (Đan nan nứa ngang dọc) */}
      {/* Horizontal Bamboo Battens */}
      {[160, 220, 280, 340, 400, 460, 520, 580, 640, 700, 750].map((wy) => (
        <g key={`bamboo-rail-${wy}`}>
          <line x1="-400" y1={wy} x2={CANVAS_WIDTH + 400} y2={wy} stroke="#0E121A" strokeWidth="5" />
          <line x1="-400" y1={wy - 1} x2={CANVAS_WIDTH + 400} y2={wy - 1} stroke="#1B2230" strokeWidth="1.2" opacity="0.7" />
        </g>
      ))}

      {/* Vertical Woven Bamboo Strips Pattern (Lạt nứa đan xen) */}
      <g stroke="#0A0C12" strokeWidth="2" opacity="0.6">
        {[
          80, 140, 200, 260, 320, 420, 480, 540, 600, 660, 720, 780, 840,
          900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380, 1440, 1500,
          1600, 1660, 1720, 1780, 1840
        ].map((vx) => (
          <line key={`vert-slat-${vx}`} x1={vx} y1="130" x2={vx} y2="800" strokeDasharray="18,12,24,10" />
        ))}
      </g>

      {/* Soot / Smoke Stain Patches from Oil Lamps over decades (Vệt ố bồ hóng ám khói đen) */}
      <ellipse cx="960" cy="380" rx="220" ry="140" fill="#030406" opacity="0.55" />
      <ellipse cx="960" cy="460" rx="340" ry="180" fill="#040508" opacity="0.4" />

      {/* 3. Bamboo Window with Outside Moonlit Night View (Cửa sổ liếp nan tre mở hé ở gian trái X: 160..320) */}
      <g className="thatched-window-receding" transform="translate(160, 320)">
        {/* Outer Window Cutout Opening (Bên ngoài trời đêm) */}
        <rect x="0" y="0" width="160" height="210" fill={outsideSky} stroke="#1A202C" strokeWidth="4" />

        {/* Distant moonlit banana leaves swaying outside window */}
        <g opacity="0.75" className="anim-cloud-drift-slow">
          {/* Banana frond 1 */}
          <path
            d="M 160 80 C 110 50, 60 70, 20 120 C 50 115, 90 95, 160 110 Z"
            fill="#05080E"
          />
          {/* Banana frond 2 */}
          <path
            d="M 160 140 C 100 120, 40 160, 10 210 C 50 185, 95 170, 160 165 Z"
            fill="#030508"
          />
        </g>

        {/* Cold outside night fog filtering through window */}
        <rect x="0" y="0" width="160" height="210" fill="#64748B" opacity="0.12" pointerEvents="none" />

        {/* Vertical Bamboo Window Bars (Song cửa sổ bằng ống tre già) */}
        {[32, 64, 96, 128].map((bx) => (
          <g key={`win-bamboo-bar-${bx}`}>
            <line x1={bx} y1="0" x2={bx} y2="210" stroke="#0B0D14" strokeWidth="6" />
            <line x1={bx - 1} y1="0" x2={bx - 1} y2="210" stroke="#222B3D" strokeWidth="1.5" />
          </g>
        ))}

        {/* Bamboo Shutter Leaf Propped Open with Stick (Cánh liếp nứa chống gậy xiên) */}
        <polygon points="-8,-12 168,-12 185,45 -25,45" fill="#07090F" stroke="#1E2638" strokeWidth="2" />
        {/* Prop Stick (Gậy tre chống liếp) */}
        <line x1="140" y1="210" x2="165" y2="45" stroke="#2A241E" strokeWidth="3" />
        <line x1="20" y1="210" x2="-5" y2="45" stroke="#2A241E" strokeWidth="3" />
      </g>

      {/* 4. Heavy Rustic Wooden Columns (Các cột gỗ mộc phân chia 3 gian: X = 390, 720, 1200, 1530) */}
      {[
        { x: 390, name: "Cột gian trái" },
        { x: 720, name: "Cột hàng nhì trái" },
        { x: 1200, name: "Cột hàng nhì phải" },
        { x: 1530, name: "Cột gian phải" },
      ].map((col, idx) => (
        <g key={`pillar-${idx}`}>
          {/* Main Wooden Column Body */}
          <rect x={col.x - 16} y="110" width="32" height="690" fill="#0B0E14" stroke="#161C26" strokeWidth="1.5" />
          {/* Column longitudinal edge highlight */}
          <line x1={col.x - 11} y1="110" x2={col.x - 11} y2="800" stroke="#263147" strokeWidth="2" />
          <line x1={col.x + 10} y1="110" x2={col.x + 10} y2="800" stroke="#05070A" strokeWidth="3" />
          {/* Stone Plinth Footing (Chân tảng đá kê cột Y = 788..800px) */}
          <polygon
            points={`${col.x - 24},800 ${col.x + 24},800 ${col.x + 18},786 ${col.x - 18},786`}
            fill="#141820"
            stroke="#273142"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* 5. Horizontal Wooden Tie Beams Across Pillars (Thanh xà ngang liên kết các cột) */}
      <line x1="-200" y1="260" x2="2120" y2="260" stroke="#090C12" strokeWidth="12" />
      <line x1="-200" y1="258" x2="2120" y2="258" stroke="#1E2738" strokeWidth="2.5" />
      <line x1="-200" y1="560" x2="2120" y2="560" stroke="#080B10" strokeWidth="10" />
      <line x1="-200" y1="558" x2="2120" y2="558" stroke="#1A2230" strokeWidth="2" />

      {/* 6. Faded Red Couplets Pinned on Center Pillars (Đôi câu đối đỏ chữ Nho phai màu dán cột) */}
      {/* Left Couplet on Pillar X = 720 */}
      <g transform="translate(712, 340)">
        <rect x="0" y="0" width="16" height="180" rx="1" fill="#450A0A" stroke="#7F1D1D" strokeWidth="0.8" opacity="0.8" />
        {[20, 50, 80, 110, 140, 165].map((cy, i) => (
          <rect key={`chr-l-${i}`} x="3" y={cy} width="10" height="12" fill="#0A0303" opacity="0.75" />
        ))}
      </g>
      {/* Right Couplet on Pillar X = 1200 */}
      <g transform="translate(1192, 340)">
        <rect x="0" y="0" width="16" height="180" rx="1" fill="#450A0A" stroke="#7F1D1D" strokeWidth="0.8" opacity="0.8" />
        {[20, 50, 80, 110, 140, 165].map((cy, i) => (
          <rect key={`chr-r-${i}`} x="3" y={cy} width="10" height="12" fill="#0A0303" opacity="0.75" />
        ))}
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
 * URBAN NIGHT MARKET & CITY STREET BACKGROUND
 * Silhouetted layered skyscrapers, shophouses with fire escapes, air conditioners,
 * vibrant flickering neon signs ("夜市古玩", "HOTEL 24H", "BAR"), utility poles and street canopies.
 */
const UrbanNightMarketBackground: React.FC<{ skyPreset: SkyPresetId }> = ({ skyPreset }) => {
  const isBlood = skyPreset === "blood_moon";
  const neonPink = isBlood ? "#DC2626" : "#EC4899";
  const neonCyan = "#06B6D4";
  const neonAmber = "#F59E0B";

  return (
    <g className="urban-night-market-background">
      {/* 1. Distant Urban Light Pollution Glow at horizon */}
      <rect
        x="-400"
        y="420"
        width={CANVAS_WIDTH + 800}
        height="390"
        fill="url(#mid-mist-grad-foggy_night)"
        opacity="0.75"
      />

      {/* 2. Deep Skyline: Distant High-Rise Towers & Rooftop Antennas */}
      <g className="distant-skyscrapers" fill="#080C14">
        {/* Tower 1 (Far Left: 0 to 220) */}
        <rect x="-50" y="260" width="240" height="540" />
        <line x1="70" y1="180" x2="70" y2="260" stroke="#080C14" strokeWidth="4" />
        <circle cx="70" cy="180" r="3" fill="#EF4444" className="anim-pulse-eerie" />
        {/* Tower 2 (Mid Left: 220 to 450) */}
        <rect x="220" y="320" width="200" height="480" />
        <rect x="370" y="270" width="110" height="530" />
        <line x1="425" y1="210" x2="425" y2="270" stroke="#080C14" strokeWidth="3" />
        <circle cx="425" cy="210" r="2.5" fill="#EF4444" className="anim-pulse-eerie" />
        {/* Tower 3 (Center Towers: 550 to 980) */}
        <rect x="580" y="290" width="160" height="510" />
        <rect x="760" y="220" width="240" height="580" />
        <polygon points="850,220 880,140 910,220" fill="#060910" />
        <line x1="880" y1="90" x2="880" y2="140" stroke="#080C14" strokeWidth="3.5" />
        <circle cx="880" cy="90" r="3.5" fill="#EF4444" className="anim-pulse-eerie" />
        {/* Tower 4 (Mid Right: 1040 to 1420) */}
        <rect x="1050" y="310" width="220" height="490" />
        <rect x="1300" y="250" width="180" height="550" />
        <line x1="1390" y1="170" x2="1390" y2="250" stroke="#080C14" strokeWidth="3" />
        <circle cx="1390" cy="170" r="2.5" fill="#EF4444" className="anim-pulse-eerie" />
        {/* Tower 5 (Far Right: 1520 to 1980) */}
        <rect x="1520" y="280" width="230" height="520" />
        <rect x="1780" y="340" width="200" height="460" />
        <line x1="1635" y1="190" x2="1635" y2="280" stroke="#080C14" strokeWidth="3" />
        <circle cx="1635" cy="190" r="3" fill="#EF4444" className="anim-pulse-eerie" />
      </g>

      {/* Scattered Lit Windows in distant buildings */}
      <g className="skyscraper-windows" fill="#FEF08A" opacity="0.35">
        {[
          { x: 20, y: 340 }, { x: 50, y: 380 }, { x: 30, y: 440 }, { x: 80, y: 490 },
          { x: 250, y: 360 }, { x: 300, y: 420 }, { x: 280, y: 470 }, { x: 410, y: 310 },
          { x: 610, y: 350 }, { x: 670, y: 400 }, { x: 630, y: 480 }, { x: 800, y: 260 },
          { x: 850, y: 320 }, { x: 920, y: 280 }, { x: 810, y: 410 }, { x: 940, y: 460 },
          { x: 1080, y: 370 }, { x: 1150, y: 440 }, { x: 1210, y: 390 }, { x: 1330, y: 300 },
          { x: 1410, y: 360 }, { x: 1370, y: 450 }, { x: 1560, y: 330 }, { x: 1620, y: 410 },
          { x: 1690, y: 360 }, { x: 1820, y: 390 }, { x: 1880, y: 450 },
        ].map((w, idx) => (
          <rect key={idx} x={w.x} y={w.y} width={7} height={11} rx={1} />
        ))}
      </g>

      {/* 3. Mid-Ground Layer: Commercial Shophouses, Alleys & Rooftops (Y = 460 to 800) */}
      <g className="midground-shophouses" fill="#0A0E17">
        {/* Shophouse block 1: Left (0 to 360) */}
        <polygon points="-50,470 190,470 190,490 350,490 350,800 -50,800" />
        {/* Rooftop Water Tank on Shophouse 1 */}
        <ellipse cx="90" cy="450" rx="20" ry="8" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="70" y="450" width="40" height="20" fill="#0A0E17" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="75" y1="470" x2="75" y2="480" stroke="#1E293B" strokeWidth="2" />
        <line x1="105" y1="470" x2="105" y2="480" stroke="#1E293B" strokeWidth="2" />

        {/* Shophouse block 2: Mid-Left (370 to 760) */}
        <polygon points="370,510 520,510 520,530 760,530 760,800 370,800" />
        {/* Zig-Zag Fire Escape Staircase on Shophouse 2 */}
        <g stroke="#1E293B" strokeWidth="2" fill="none">
          <polyline points="480,550 515,580 480,610 515,640 480,670 515,700" />
          <line x1="475" y1="550" x2="520" y2="550" strokeWidth="3" />
          <line x1="475" y1="610" x2="520" y2="610" strokeWidth="3" />
          <line x1="475" y1="670" x2="520" y2="670" strokeWidth="3" />
        </g>

        {/* Shophouse block 3: Center-Right (1120 to 1540) */}
        <polygon points="1120,520 1340,520 1340,480 1540,480 1540,800 1120,800" />
        {/* AC outdoor condenser units */}
        <rect x="1150" y="560" width="28" height="20" rx="2" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
        <circle cx="1160" cy="570" r="6" fill="none" stroke="#334155" strokeWidth="1" />
        <rect x="1260" y="620" width="28" height="20" rx="2" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
        <circle cx="1270" cy="630" r="6" fill="none" stroke="#334155" strokeWidth="1" />

        {/* Shophouse block 4: Far-Right (1560 to 1980) */}
        <polygon points="1560,500 1780,500 1780,470 1980,470 1980,800 1560,800" />
      </g>

      {/* 4. Vivid Glowing Neon Signs on Shophouse Facades */}
      {/* Neon Sign 1: Vertical Cyan & Magenta Sign "NIGHT MARKET / 夜市" (Left Shophouse: X = 230) */}
      <g transform="translate(230, 520)">
        <line x1="-12" y1="10" x2="0" y2="10" stroke="#1E293B" strokeWidth="2.5" />
        <line x1="-12" y1="130" x2="0" y2="130" stroke="#1E293B" strokeWidth="2.5" />
        <rect x="0" y="0" width="46" height="150" rx="4" fill="#05070B" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="4" y="4" width="38" height="142" rx="3" fill="url(#urban-neon-cyan)" opacity="0.35" />
        <rect x="4" y="4" width="38" height="142" rx="3" fill="none" stroke={neonCyan} strokeWidth="2" className="anim-flicker-ember" />
        <g fill={neonPink} textAnchor="middle" fontSize="18" fontWeight="bold" fontFamily="monospace" className="anim-flicker-fast">
          <text x="23" y="34">夜</text>
          <text x="23" y="68">市</text>
          <text x="23" y="102">古</text>
          <text x="23" y="134">玩</text>
        </g>
      </g>

      {/* Neon Sign 2: Horizontal Amber Sign "HOTEL 24H" (X = 610) */}
      <g transform="translate(610, 560)">
        <rect x="-8" y="-18" width="126" height="38" rx="4" fill="#04060A" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="-5" y="-15" width="120" height="32" rx="3" fill="url(#urban-neon-amber)" opacity="0.3" />
        <rect x="-5" y="-15" width="120" height="32" rx="3" fill="none" stroke={neonAmber} strokeWidth="1.8" className="anim-flicker-ember" />
        <text
          x="55"
          y="6"
          textAnchor="middle"
          fill={neonAmber}
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="2"
          className="anim-flicker-ember"
        >
          HOTEL 24H
        </text>
      </g>

      {/* Neon Sign 3: Flashing Downward Arrow Neon Sign (Center Alley: X = 960) */}
      <g transform="translate(960, 580)" className="anim-pulse-eerie">
        <polygon points="-16,-20 16,-20 16,5 30,5 0,35 -30,5 -16,5" fill="#030508" stroke="#334155" strokeWidth="1.5" />
        <polygon
          points="-12,-16 12,-16 12,3 24,3 0,28 -24,3 -12,3"
          fill="none"
          stroke={neonPink}
          strokeWidth="2.5"
        />
        <circle cx="0" cy="0" r="18" fill="url(#urban-neon-magenta)" opacity="0.45" />
      </g>

      {/* Neon Sign 4: Vertical Glowing Sign "BAR" (Right Shophouse: X = 1460) */}
      <g transform="translate(1460, 510)">
        <rect x="0" y="0" width="42" height="135" rx="4" fill="#05070B" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="4" y="4" width="34" height="127" rx="3" fill="none" stroke={neonCyan} strokeWidth="1.8" className="anim-flicker-fast" />
        <g fill={neonAmber} textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="monospace" className="anim-flicker-ember">
          <text x="21" y="32">B</text>
          <text x="21" y="60">A</text>
          <text x="21" y="88">R</text>
          <text x="21" y="118">⚚</text>
        </g>
      </g>

      {/* 5. Utility Poles with Tangled Wire Bundles */}
      <g className="utility-pole-left">
        <rect x="325" y="380" width="10" height="420" fill="#060910" stroke="#1E293B" strokeWidth="1" />
        <line x1="290" y1="410" x2="370" y2="410" stroke="#060910" strokeWidth="5" />
        <line x1="295" y1="435" x2="365" y2="435" stroke="#060910" strokeWidth="4" />
        <rect x="340" y="420" width="22" height="40" rx="3" fill="#0B1220" stroke="#1E293B" strokeWidth="1.5" />
        <circle cx="295" cy="406" r="3" fill="#475569" />
        <circle cx="365" cy="406" r="3" fill="#475569" />
        <path d="M 330 435 Q 315 480 325 520" fill="none" stroke="#04060A" strokeWidth="2" />
        <path d="M 345 440 Q 365 490 335 540" fill="none" stroke="#04060A" strokeWidth="1.8" />
      </g>

      <g className="utility-pole-right">
        <rect x="1675" y="390" width="10" height="410" fill="#060910" stroke="#1E293B" strokeWidth="1" />
        <line x1="1640" y1="420" x2="1720" y2="420" stroke="#060910" strokeWidth="5" />
        <circle cx="1645" cy="416" r="3" fill="#475569" />
        <circle cx="1715" cy="416" r="3" fill="#475569" />
        <path d="M 1680 430 Q 1660 480 1675 530" fill="none" stroke="#04060A" strokeWidth="2" />
      </g>

      {/* 6. Distant Market Canopy Silhouettes */}
      <g className="distant-stalls" fill="#080C14" opacity="0.85">
        <polygon points="120,740 260,720 280,800 100,800" />
        <polygon points="680,735 840,715 860,800 660,800" />
        <polygon points="980,730 1140,710 1160,800 960,800" />
        <polygon points="1520,735 1680,720 1700,800 1500,800" />
      </g>
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
      {/* 1. Solid Heavy-Duty Transit Floor with overscan */}
      <rect
        x="-400"
        y={GROUND_Y}
        width={CANVAS_WIDTH + 800}
        height={CANVAS_HEIGHT - GROUND_Y + 400}
        fill="#06080F"
      />

      {/* 2. Ribbed Anti-Slip Rubber Floor Grooves */}
      <g stroke="#0E131E" strokeWidth="2" opacity="0.8">
        <line x1="-400" y1={GROUND_Y + 25} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 25} />
        <line x1="-400" y1={GROUND_Y + 50} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 50} />
        <line x1="-400" y1={GROUND_Y + 75} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 75} />
        <line x1="-400" y1={GROUND_Y + 100} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 100} />
        <line x1="-400" y1={GROUND_Y + 130} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 130} />
        <line x1="-400" y1={GROUND_Y + 165} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 165} />
        <line x1="-400" y1={GROUND_Y + 205} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 205} />
        <line x1="-400" y1={GROUND_Y + 245} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 245} />
      </g>

      {/* 3. Vivid Yellow Safety Caution Boundary Lines along Ground Line Y = 800 */}
      <line x1="-400" y1={GROUND_Y} x2={CANVAS_WIDTH + 400} y2={GROUND_Y} stroke="#CA8A04" strokeWidth="3" />
      <line
        x1="-400"
        y1={GROUND_Y + 8}
        x2={CANVAS_WIDTH + 400}
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
 * URBAN NIGHT MARKET GROUND LAYER (Sàn bê tông / mặt đường nhựa ẩm ướt, bóng loáng, vạch vàng, nắp cống bốc hơi)
 */
const UrbanNightMarketGroundLayer: React.FC = () => {
  return (
    <g className="environment-layer-2-ground-urban">
      {/* 1. Heavy Wet Asphalt Road Surface with Overscan */}
      <rect
        x="-400"
        y={GROUND_Y}
        width={CANVAS_WIDTH + 800}
        height={CANVAS_HEIGHT - GROUND_Y + 400}
        fill="#07090F"
      />

      {/* 2. Elevated Sidewalk Curb Line (Y = 800px) */}
      <rect x="-400" y={GROUND_Y} width={CANVAS_WIDTH + 800} height="12" fill="#131B2A" />
      <line x1="-400" y1={GROUND_Y} x2={CANVAS_WIDTH + 400} y2={GROUND_Y} stroke="#334155" strokeWidth="2.5" />
      <line x1="-400" y1={GROUND_Y + 12} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 12} stroke="#0A0E17" strokeWidth="2" />

      {/* Curb Stone Vertical Joints */}
      <g stroke="#090D14" strokeWidth="1.5" opacity="0.75">
        {[0, 140, 280, 420, 560, 700, 840, 980, 1120, 1260, 1400, 1540, 1680, 1820].map((jointX, idx) => (
          <line key={idx} x1={jointX} y1={GROUND_Y} x2={jointX} y2={GROUND_Y + 12} />
        ))}
      </g>

      {/* 3. Sidewalk Hazard Striping (Painted yellow-black caution curb) */}
      <line
        x1="-400"
        y1={GROUND_Y + 3}
        x2={CANVAS_WIDTH + 400}
        y2={GROUND_Y + 3}
        stroke="#EAB308"
        strokeWidth="2.5"
        strokeDasharray="36,24"
        opacity="0.85"
      />

      {/* 4. Wet Asphalt Pavement Specular Neon Reflections */}
      <ellipse cx="260" cy={GROUND_Y + 50} rx="160" ry="24" fill="url(#wet-street-reflection-grad)" opacity="0.8" />
      <ellipse cx="680" cy={GROUND_Y + 70} rx="210" ry="28" fill="url(#wet-street-reflection-grad)" opacity="0.7" />
      <ellipse cx="1460" cy={GROUND_Y + 55} rx="190" ry="26" fill="url(#wet-street-reflection-grad)" opacity="0.75" />

      {/* 5. Heavy Cast-Iron Storm Drain / Manhole Cover (X = 960, Y = GROUND_Y + 95) */}
      <g transform={`translate(960, ${GROUND_Y + 95})`}>
        <ellipse cx="0" cy="0" rx="68" ry="22" fill="#030508" stroke="#1E293B" strokeWidth="2.5" />
        <ellipse cx="0" cy="0" rx="60" ry="18" fill="#0B101D" stroke="#334155" strokeWidth="2" />
        <ellipse cx="0" cy="0" rx="42" ry="12" fill="#070A12" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="-28" y1="0" x2="28" y2="0" stroke="#020305" strokeWidth="3" />
        <line x1="-20" y1="-5" x2="20" y2="-5" stroke="#020305" strokeWidth="2.5" />
        <line x1="-20" y1="5" x2="20" y2="5" stroke="#020305" strokeWidth="2.5" />
        {/* Steam wisps rising up from sewer vents */}
        <path
          d="M -12 -5 Q -25 -40 -15 -80 Q -5 -120 -20 -150"
          fill="none"
          stroke="url(#swirling-mist-grad)"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.55"
          className="anim-fog-wave-slow"
        />
        <path
          d="M 10 -5 Q 25 -45 12 -85 Q 0 -125 18 -155"
          fill="none"
          stroke="url(#swirling-mist-grad)"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.45"
          className="anim-fog-wave-fast"
        />
      </g>

      {/* 6. Receding Asphalt Road Lane Dividers */}
      <g stroke="#E2E8F0" strokeWidth="2" strokeDasharray="50,45" opacity="0.3">
        <line x1="-400" y1={GROUND_Y + 160} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 160} />
      </g>
    </g>
  );
};

/**
 * THATCHED HOUSE GROUND LAYER (Nền Đất Nện Cổ Truyền Y = 800px)
 * Traditional compacted earthen dirt floor with natural unevenness,
 * earthen cracks, scattered straw/bamboo debris, and skirting threshold beam.
 */
const ThatchedHouseGroundLayer: React.FC = () => {
  return (
    <g className="environment-layer-2-ground-thatched">
      {/* 1. Solid Earthen Subsurface with overscan */}
      <rect
        x="-400"
        y={GROUND_Y}
        width={CANVAS_WIDTH + 800}
        height={CANVAS_HEIGHT - GROUND_Y + 400}
        fill={COLOR_PALETTE.silhouette_primary}
      />

      {/* 2. Top Skirting Threshold Beam (Thanh dầm gỗ nẹp chân vách nứa Y = 796px) */}
      <rect
        x="-400"
        y={GROUND_Y - 4}
        width={CANVAS_WIDTH + 800}
        height="8"
        fill="#0D1017"
        stroke="#1A212E"
        strokeWidth="1"
      />
      <line x1="-400" y1={GROUND_Y - 3} x2={CANVAS_WIDTH + 400} y2={GROUND_Y - 3} stroke="#2D3748" strokeWidth="1.2" />

      {/* 3. Compacted Dirt Surface with natural slight undulation (Đường viền đất nện mấp mô nhẹ) */}
      <path
        d={`M -400 ${GROUND_Y}
           L 0 ${GROUND_Y}
           Q 250 ${GROUND_Y - 2} 480 ${GROUND_Y + 2}
           Q 720 ${GROUND_Y - 3} 960 ${GROUND_Y}
           Q 1200 ${GROUND_Y + 3} 1440 ${GROUND_Y - 2}
           Q 1680 ${GROUND_Y + 1} 1920 ${GROUND_Y}
           L 2320 ${GROUND_Y}
           L 2320 ${CANVAS_HEIGHT + 400} L -400 ${CANVAS_HEIGHT + 400} Z`}
        fill="#0A0C10"
      />

      {/* 4. Natural Earthen Ground Cracks (Vết nứt đất tự nhiên khô nẻ) */}
      <g stroke="#050608" strokeWidth="1.4" opacity="0.8">
        <path d={`M 280 ${GROUND_Y + 10} L 310 ${GROUND_Y + 35} L 305 ${GROUND_Y + 55} L 330 ${GROUND_Y + 80}`} />
        <path d={`M 640 ${GROUND_Y + 15} L 665 ${GROUND_Y + 45} L 690 ${GROUND_Y + 60}`} />
        <path d={`M 1120 ${GROUND_Y + 8} L 1145 ${GROUND_Y + 30} L 1135 ${GROUND_Y + 65} L 1160 ${GROUND_Y + 95}`} />
        <path d={`M 1580 ${GROUND_Y + 12} L 1605 ${GROUND_Y + 40} L 1635 ${GROUND_Y + 70}`} />
      </g>

      {/* 5. Scattered Straw & Dried Bamboo Scraps (Vụn rơm rạ khô & mẩu tre vụn rải rác) */}
      <g stroke="#1F1D17" strokeWidth="1.6" strokeLinecap="round">
        <line x1="180" y1={GROUND_Y + 8} x2="205" y2={GROUND_Y + 14} />
        <line x1="195" y1={GROUND_Y + 10} x2="215" y2={GROUND_Y + 6} />
        <line x1="520" y1={GROUND_Y + 12} x2="545" y2={GROUND_Y + 7} />
        <line x1="840" y1={GROUND_Y + 6} x2="865" y2={GROUND_Y + 15} />
        <line x1="1350" y1={GROUND_Y + 10} x2="1375" y2={GROUND_Y + 16} />
        <line x1="1720" y1={GROUND_Y + 7} x2="1748" y2={GROUND_Y + 13} />
        <line x1="1735" y1={GROUND_Y + 12} x2="1755" y2={GROUND_Y + 6} />
      </g>

      {/* Worn Central Footpath Dirt Sheen (Vệt nhẵn mòn bóng nhẹ ở lối đi chính giữa) */}
      <ellipse cx="960" cy={GROUND_Y + 18} rx="260" ry="8" fill="#141822" opacity="0.35" />
    </g>
  );
};

/**
 * LAYER 2: MAIN GROUND (Y = 800px)
 */
export const MainGroundLayer: React.FC<{ theme?: ThemeId }> = ({ theme }) => {
  if (theme === "thatched_house_interior") {
    return <ThatchedHouseGroundLayer />;
  }

  if (theme === "vehicle_interior") {
    return <VehicleFloorLayer />;
  }

  if (theme === "urban_night_market") {
    return <UrbanNightMarketGroundLayer />;
  }

  if (theme === "modern_indoor") {
    return (
      <g className="environment-layer-2-ground-indoor">
        {/* Solid Indoor Floor with overscan */}
        <rect
          x="-400"
          y={GROUND_Y}
          width={CANVAS_WIDTH + 800}
          height={CANVAS_HEIGHT - GROUND_Y + 400}
          fill={COLOR_PALETTE.silhouette_primary}
        />
        {/* Floor Sheen Line & Base Trim */}
        <line x1="-400" y1={GROUND_Y} x2={CANVAS_WIDTH + 400} y2={GROUND_Y} stroke="#1E293B" strokeWidth="2" />
        <line x1="-400" y1={GROUND_Y + 12} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 12} stroke="#0B0F17" strokeWidth="2" />
        {/* Polished Floor Tile Seams */}
        <g stroke="#141A24" strokeWidth="1.5" opacity="0.6">
          <line x1="160" y1={GROUND_Y} x2="80" y2={CANVAS_HEIGHT} />
          <line x1="420" y1={GROUND_Y} x2="340" y2={CANVAS_HEIGHT} />
          <line x1="720" y1={GROUND_Y} x2="680" y2={CANVAS_HEIGHT} />
          <line x1="960" y1={GROUND_Y} x2="960" y2={CANVAS_HEIGHT} />
          <line x1="1200" y1={GROUND_Y} x2="1240" y2={CANVAS_HEIGHT} />
          <line x1="1500" y1={GROUND_Y} x2="1580" y2={CANVAS_HEIGHT} />
          <line x1="1760" y1={GROUND_Y} x2="1840" y2={CANVAS_HEIGHT} />
          <line x1="-400" y1={GROUND_Y + 60} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 60} />
          <line x1="-400" y1={GROUND_Y + 140} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 140} />
          <line x1="-400" y1={GROUND_Y + 220} x2={CANVAS_WIDTH + 400} y2={GROUND_Y + 220} />
        </g>
      </g>
    );
  }

  return (
    <g className="environment-layer-2-ground">
      <rect
        x="-400"
        y={GROUND_Y}
        width={CANVAS_WIDTH + 800}
        height={CANVAS_HEIGHT - GROUND_Y + 400}
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <path
        d={`M -400 ${GROUND_Y}
           L 0 ${GROUND_Y} 
           Q 250 ${GROUND_Y} 400 ${GROUND_Y - 8}
           Q 600 ${GROUND_Y} 780 ${GROUND_Y + 6}
           Q 960 ${GROUND_Y} 1150 ${GROUND_Y - 10}
           Q 1320 ${GROUND_Y} 1500 ${GROUND_Y + 8}
           Q 1670 ${GROUND_Y} 1920 ${GROUND_Y}
           L 2320 ${GROUND_Y}
           L 2320 ${CANVAS_HEIGHT + 400} L -400 ${CANVAS_HEIGHT + 400} Z`}
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
      {theme === "thatched_house_interior" ? (
        <ThatchedHouseForegroundFraming />
      ) : isVehicle ? (
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
      ) : theme === "urban_night_market" ? (
        <UrbanForegroundFraming />
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

/**
 * URBAN FOREGROUND FRAMING (Cột đèn đường cổ điển hắt sáng xuống, dây điện rủ góc máy)
 */
const UrbanForegroundFraming: React.FC = () => {
  return (
    <g className="urban-foreground-framing">
      {/* 1. Vintage Cast-Iron Streetlamp on Far-Left (X = 50) */}
      <g className="streetlamp-framing">
        <path d="M 35 1080 L 45 420 L 55 420 L 65 1080 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <polygon points="25,1080 75,1080 65,1020 35,1020" fill={COLOR_PALETTE.silhouette_secondary} />
        <path
          d="M 50 440 C 50 360, 110 330, 130 360 L 130 390"
          fill="none"
          stroke={COLOR_PALETTE.silhouette_primary}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 50 400 Q 80 400 100 420"
          fill="none"
          stroke={COLOR_PALETTE.silhouette_primary}
          strokeWidth="3.5"
        />
        {/* Hanging Lantern housing */}
        <g transform="translate(130, 390)">
          <polygon points="-16,0 16,0 0,-12" fill={COLOR_PALETTE.silhouette_primary} />
          <polygon points="-14,0 14,0 10,32 -10,32" fill="url(#tent-warm-lantern)" opacity="0.75" />
          <polygon points="-14,0 14,0 10,32 -10,32" fill="none" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="2.5" />
          <circle cx="0" cy="14" r="5" fill="#FEF08A" className="anim-flicker-ember" />
          <polygon
            points="0,20 -110,650 250,650"
            fill="url(#tent-warm-lantern)"
            opacity="0.18"
            style={{ mixBlendMode: "screen", pointerEvents: "none" }}
          />
        </g>
      </g>

      {/* 2. Top-Right Dangling Severed Cable */}
      <path
        d="M 1920 0 Q 1810 110 1830 180"
        fill="none"
        stroke={COLOR_PALETTE.silhouette_primary}
        strokeWidth="3.5"
      />
      <circle cx="1830" cy="180" r="2.5" fill="#EF4444" className="anim-flicker-fast" />

      {/* 3. Vignette shadows at extreme screen borders */}
      <rect x="0" y="0" width="100" height={CANVAS_HEIGHT} fill="url(#left-shadow-vignette)" opacity="0.75" />
      <rect x={CANVAS_WIDTH - 100} y="0" width="100" height={CANVAS_HEIGHT} fill="url(#right-shadow-vignette)" opacity="0.75" />
    </g>
  );
};

/**
 * THATCHED HOUSE FOREGROUND FRAMING (Cột Tiền Cảnh Đen Tuyền & Mái Tranh Rủ)
 * Creates extreme cinematic claustrophobic depth with massive silhouette wooden pillars
 * at extreme screen edges and straw fringes at the very top.
 */
const ThatchedHouseForegroundFraming: React.FC = () => {
  return (
    <g className="thatched-house-foreground-framing" pointerEvents="none">
      {/* 1. Extreme Left Foreground Wooden Pillar (Cột gỗ tiền cảnh sát mép trái X = 0..55) */}
      <path
        d="M 0 0 L 55 0 L 45 1080 L 0 1080 Z"
        fill="#040507"
      />
      <line x1="45" y1="0" x2="35" y2="1080" stroke="#0E121A" strokeWidth="2" opacity="0.7" />

      {/* 2. Extreme Right Foreground Wooden Pillar (Cột gỗ tiền cảnh sát mép phải X = 1865..1920) */}
      <path
        d="M 1920 0 L 1865 0 L 1875 1080 L 1920 1080 Z"
        fill="#040507"
      />
      <line x1="1875" y1="0" x2="1885" y2="1080" stroke="#0E121A" strokeWidth="2" opacity="0.7" />

      {/* 3. Top Hanging Thatch Eaves Fringe along upper frame edge (Y = 0..45px) */}
      <path
        d="M 0 0 L 1920 0 L 1920 30 
           Q 1800 55 1680 25 Q 1540 60 1420 30 Q 1280 55 1140 25 Q 1000 62 860 30
           Q 720 58 580 25 Q 440 60 300 30 Q 160 55 0 25 Z"
        fill="#040507"
      />

      {/* 4. Claustrophobic Vignette Shadows at lateral edges */}
      <rect x="0" y="0" width="100" height={CANVAS_HEIGHT} fill="url(#left-shadow-vignette)" opacity="0.8" />
      <rect x={CANVAS_WIDTH - 100} y="0" width="100" height={CANVAS_HEIGHT} fill="url(#right-shadow-vignette)" opacity="0.8" />
    </g>
  );
};
