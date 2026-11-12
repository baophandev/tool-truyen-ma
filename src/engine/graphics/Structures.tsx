import React from "react";
import type { StructureId } from "../types";
import { COLOR_PALETTE } from "../constants";

interface StructureProps {
  id: StructureId;
  scale?: number;
  showAnchor?: boolean;
}

export const StructureRenderer: React.FC<StructureProps> = ({
  id,
  scale = 1,
  showAnchor = false,
}) => {
  return (
    <g
      className={`structure-${id}`}
      transform={`scale(${scale})`}
    >
      {id === "creepy_banyan_tree" && <CreepyBanyanTree />}
      {id === "ancient_tomb" && <AncientTomb />}
      {id === "dilapidated_hut" && <DilapidatedHut />}
      {id === "abandoned_shrine" && <AbandonedShrine />}
      {id === "broken_wooden_bridge" && <BrokenWoodenBridge />}
      {id === "scarecrow_of_the_damned" && <ScarecrowOfTheDamned />}
      {id === "creepy_well" && <CreepyWell />}
      {id === "haunted_gallows_tree" && <HauntedGallowsTree />}

      {/* Debug anchor visualization */}
      {showAnchor && (
        <g className="structure-debug-anchor" pointerEvents="none">
          <circle cx="0" cy="0" r="5" fill="#3B82F6" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="8" y="-8" fill="#3B82F6" fontSize="11" fontFamily="monospace">
            {id} [0,0]
          </text>
        </g>
      )}
    </g>
  );
};

/**
 * 1. CREEPY BANYAN TREE (Cây Đa Cổ Thụ Cành Trơ Trụi)
 */
const CreepyBanyanTree: React.FC = () => {
  return (
    <g className="banyan-tree">
      {/* Deep Ground Roots spreading out */}
      <path
        d="M -160 0 C -120 -15, -90 -40, -50 -70 L 50 -70 C 90 -40, 130 -15, 170 0 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <path
        d="M -210 0 C -180 -10, -140 -25, -90 -45 L -100 -52 C -150 -35, -190 -15, -220 0 Z"
        fill={COLOR_PALETTE.silhouette_secondary}
      />
      <path
        d="M 100 -45 C 145 -28, 185 -10, 220 0 L 210 0 C 175 -12, 135 -32, 90 -52 Z"
        fill={COLOR_PALETTE.silhouette_secondary}
      />

      {/* Main Massive Gnarled Trunk (Height ~450px up to -450px) */}
      <path
        d="M -55 -70 C -70 -160, -90 -260, -60 -360 C -40 -410, -10 -430, 0 -450 C 15 -425, 45 -405, 65 -350 C 95 -250, 70 -160, 55 -70 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />

      {/* Hollow Tree Trunk Cavity */}
      <path
        d="M -16 -180 C -22 -220, -18 -270, 0 -290 C 18 -270, 22 -220, 16 -180 C 10 -150, -10 -150, -16 -180 Z"
        fill="#040406"
      />
      <g className="anim-pulse-eerie">
        <circle cx="-6" cy="-240" r="2.5" fill={COLOR_PALETTE.accent_blood_red} />
        <circle cx="6" cy="-240" r="2.5" fill={COLOR_PALETTE.accent_blood_red} />
      </g>

      {/* Twisted Main Branches */}
      <path
        d="M -60 -360 C -120 -390, -180 -420, -220 -480 C -240 -510, -260 -530, -270 -560 C -265 -550, -250 -520, -230 -500 C -180 -445, -110 -415, -45 -390 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <path
        d="M -170 -440 C -200 -480, -220 -530, -210 -570 C -202 -540, -185 -500, -155 -460 Z"
        fill={COLOR_PALETTE.silhouette_secondary}
      />
      <path
        d="M 60 -355 C 120 -385, 185 -415, 225 -475 C 245 -505, 270 -530, 285 -565 C 275 -550, 255 -520, 235 -500 C 180 -440, 110 -410, 45 -385 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <path
        d="M 165 -435 C 195 -475, 215 -525, 205 -565 C 198 -535, 180 -495, 150 -455 Z"
        fill={COLOR_PALETTE.silhouette_secondary}
      />

      {/* Hanging Aerial Roots */}
      <path
        d="M -130 -420 C -135 -300, -115 -180, -120 -60 L -123 0 L -126 0 C -122 -60, -140 -180, -135 -420 Z"
        fill={COLOR_PALETTE.silhouette_primary}
        className="anim-sway-subtle"
      />
      <path
        d="M 125 -415 C 130 -300, 110 -175, 115 -55 L 118 0 L 121 0 C 117 -55, 135 -175, 130 -415 Z"
        fill={COLOR_PALETTE.silhouette_primary}
        className="anim-sway-subtle"
      />

      {/* Perched Black Crow on Branch */}
      <g transform="translate(-155, -455) scale(0.7)">
        <ellipse cx="0" cy="0" rx="14" ry="9" fill="#000" transform="rotate(-15)" />
        <circle cx="12" cy="-6" r="6" fill="#000" />
        <polygon points="17,-6 26,-4 17,-2" fill="#000" />
        <polygon points="-10,2 -24,8 -12,6" fill="#000" />
        <circle cx="13" cy="-7" r="1.5" fill={COLOR_PALETTE.accent_fog_white} />
      </g>
    </g>
  );
};

/**
 * 2. ANCIENT TOMB (Ngôi Mộ Cổ Nứt Nẻ và Bia Đá)
 */
const AncientTomb: React.FC = () => {
  return (
    <g className="ancient-tomb">
      <path
        d="M -150 0 C -120 -35, -80 -65, 0 -70 C 80 -65, 120 -35, 150 0 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <path
        d="M -110 -20 L -95 -75 L 95 -75 L 110 -20 Z"
        fill={COLOR_PALETTE.silhouette_secondary}
      />
      <path
        d="M -95 -75 L -85 -105 L 85 -105 L 95 -75 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />

      {/* Leaning Weathered Stele */}
      <g transform="translate(-15, -95) rotate(-6)">
        <path
          d="M -42 0 L -45 -140 C -45 -180, 45 -180, 45 -140 L 42 0 Z"
          fill={COLOR_PALETTE.silhouette_primary}
        />
        <path
          d="M -34 -10 L -37 -135 C -37 -168, 37 -168, 37 -135 L 34 -10 Z"
          fill={COLOR_PALETTE.silhouette_secondary}
        />
        <path
          d="M -37 -110 L -15 -85 L -22 -60 L 5 -30 L -8 0"
          stroke="#050507"
          strokeWidth="3"
          fill="none"
        />
        {/* Carved occult lines */}
        <line x1="-15" y1="-140" x2="15" y2="-140" stroke="#000" strokeWidth="2.5" />
        <line x1="-20" y1="-120" x2="20" y2="-120" stroke="#000" strokeWidth="2" />
        <line x1="-15" y1="-60" x2="15" y2="-60" stroke="#000" strokeWidth="2" />
      </g>

      {/* Incense Burner & Glowing Embers */}
      <path
        d="M -18 -20 L -14 -42 L 14 -42 L 18 -20 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <line x1="-6" y1="-42" x2="-8" y2="-72" stroke="#222" strokeWidth="1.5" />
      <circle cx="-8" cy="-73" r="1.8" fill={COLOR_PALETTE.accent_blood_red} className="anim-flicker-ember" />
      <line x1="0" y1="-42" x2="0" y2="-78" stroke="#222" strokeWidth="1.5" />
      <circle cx="0" cy="-79" r="1.8" fill={COLOR_PALETTE.accent_bright_red} className="anim-flicker-ember" />
      <line x1="6" y1="-42" x2="9" y2="-68" stroke="#222" strokeWidth="1.5" />
      <circle cx="9" cy="-69" r="1.8" fill={COLOR_PALETTE.accent_blood_red} className="anim-flicker-ember" />
    </g>
  );
};

/**
 * 3. DILAPIDATED HUT (Căn Lều Tranh Xiêu Vẹo)
 */
const DilapidatedHut: React.FC = () => {
  return (
    <g className="dilapidated-hut">
      <polygon points="-170,0 -185,-180 -165,-180 -150,0" fill={COLOR_PALETTE.silhouette_primary} />
      <polygon points="140,0 120,-175 140,-175 160,0" fill={COLOR_PALETTE.silhouette_primary} />
      <path d="M -155 0 L -175 -175 L 125 -170 L 145 0 Z" fill={COLOR_PALETTE.silhouette_secondary} />

      {/* Decaying Thatch Straw Roof */}
      <path
        d="M -240 -160 L -10 -340 L 220 -155 L 180 -185 L -10 -315 L -200 -185 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <path
        d="M -240 -160 L -230 -130 L -220 -155 L -205 -125 L -190 -158 L -170 -120 L -155 -155 L -130 -122 L -115 -155 L -90 -125 L -75 -158 L -50 -122 L -35 -160 L -15 -125 L 5 -162 L 30 -120 L 50 -158 L 75 -124 L 95 -160 L 120 -122 L 140 -158 L 165 -125 L 185 -160 L 210 -128 L 220 -155 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />

      {/* Dark Yawning Doorway */}
      <path d="M -50 0 L -45 -140 C -45 -160, 20 -160, 25 -140 L 35 0 Z" fill="#020204" />
      {/* Hollow Broken Window Frame with Eerie Yellow Eyes */}
      <polygon points="65,-60 62,-120 105,-115 108,-55" fill="#020204" />
      <g className="anim-pulse-eerie">
        <circle cx="80" cy="-95" r="2.2" fill={COLOR_PALETTE.accent_eerie_gold} />
        <circle cx="90" cy="-94" r="2.2" fill={COLOR_PALETTE.accent_eerie_gold} />
      </g>
    </g>
  );
};

/**
 * 4. ABANDONED SHRINE (Miếu Hoang Cô Hồn Cổ Kính)
 * Traditional Vietnamese ruined temple shrine with broken curved eaves and swaying lantern
 */
const AbandonedShrine: React.FC = () => {
  return (
    <g className="abandoned-shrine">
      {/* Stone steps platform */}
      <polygon points="-160,0 -150,-18 150,-18 160,0" fill={COLOR_PALETTE.silhouette_secondary} />
      <polygon points="-140,-18 -130,-35 130,-35 140,-18" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Stone Shrine Pillars (Cột đá rêu phong) */}
      <polygon points="-110,-35 -105,-200 -85,-200 -90,-35" fill={COLOR_PALETTE.silhouette_primary} />
      <polygon points="90,-35 85,-200 105,-200 110,-35" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Inner Shrine Altar (Ban thờ hoang phế) */}
      <rect x="-65" y="-120" width="130" height="85" fill={COLOR_PALETTE.silhouette_secondary} />
      <rect x="-70" y="-125" width="140" height="12" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Ancient Spirit Tablet (Bài vị thần linh mờ ảo) */}
      <polygon points="-15,-125 -15,-165 0,-175 15,-165 15,-125" fill="#020204" />
      <line x1="0" y1="-165" x2="0" y2="-130" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="1.5" />

      {/* Curved Ornate Chinese/Vietnamese Roof (Mái đao cong vút nứt vỡ) */}
      <path
        d="M -180 -195 C -130 -210, -50 -230, 0 -260 C 50 -230, 130 -210, 180 -195 C 150 -215, 70 -245, 0 -245 C -70 -245, -150 -215, -180 -195 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />
      {/* Upper Roof Crest with Dragon/Ghoul Finials */}
      <path
        d="M -140 -230 C -90 -260, -30 -290, 0 -310 C 30 -290, 90 -260, 140 -230 C 100 -270, 40 -295, 0 -295 C -40 -295, -100 -270, -140 -230 Z"
        fill={COLOR_PALETTE.silhouette_secondary}
      />

      {/* Swaying Tattered Red Lantern (Đèn lồng đỏ rách đung đưa) */}
      <g transform="translate(-130, -195)" className="anim-sway-subtle">
        <line x1="0" y1="0" x2="0" y2="35" stroke="#111" strokeWidth="1.5" />
        {/* Lantern body */}
        <ellipse cx="0" cy="52" rx="14" ry="18" fill={COLOR_PALETTE.accent_blood_red} opacity="0.8" />
        <ellipse cx="0" cy="52" rx="6" ry="10" fill="#EF4444" opacity="0.5" className="anim-flicker-ember" />
        {/* Ragged tassel */}
        <line x1="-3" y1="70" x2="-4" y2="85" stroke="#111" strokeWidth="1.2" />
        <line x1="0" y1="70" x2="0" y2="88" stroke="#111" strokeWidth="1.2" />
        <line x1="3" y1="70" x2="4" y2="84" stroke="#111" strokeWidth="1.2" />
      </g>
    </g>
  );
};

/**
 * 5. BROKEN WOODEN BRIDGE (Cầu Khỉ Gãy Nhịp Qua Đầm Lầy)
 * Crooked wooden pilings, snapped bridge planks, ghostly hands grasping from murky depths
 */
const BrokenWoodenBridge: React.FC = () => {
  return (
    <g className="broken-bridge">
      {/* Water Surface / Boggy Silt Ground */}
      <path
        d="M -220 0 C -150 -10, -50 -5, 0 0 C 70 -8, 160 -4, 220 0 Z"
        fill={COLOR_PALETTE.silhouette_secondary}
      />

      {/* Left Bridge Section (Nhịp cầu bên trái) */}
      <polygon points="-200,0 -195,-90 -185,-90 -188,0" fill={COLOR_PALETTE.silhouette_primary} />
      <polygon points="-140,0 -136,-110 -126,-110 -128,0" fill={COLOR_PALETTE.silhouette_primary} />
      {/* Planks climbing up */}
      <polygon points="-220,-85 -110,-125 -105,-115 -215,-75" fill={COLOR_PALETTE.silhouette_primary} />
      {/* Broken Jagged Planks sticking out */}
      <polygon points="-110,-125 -60,-140 -70,-130 -105,-115" fill={COLOR_PALETTE.silhouette_secondary} />

      {/* Right Bridge Section (Nhịp cầu bên phải sụp gãy) */}
      <polygon points="120,0 124,-100 134,-100 132,0" fill={COLOR_PALETTE.silhouette_primary} />
      <polygon points="180,0 185,-85 195,-85 192,0" fill={COLOR_PALETTE.silhouette_primary} />
      <polygon points="105,-105 210,-75 205,-65 98,-95" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Snapped timber hanging down into the water */}
      <polygon points="105,-105 75,-30 83,-30 115,-98" fill={COLOR_PALETTE.silhouette_secondary} />

      {/* Ghostly Hands Reaching from the Murky Water (Bàn tay ma vươn lên) */}
      <g className="anim-pulse-eerie" transform="translate(10, 0)">
        {/* Pale skeletal hand */}
        <path
          d="M -15 0 L -12 -35 L -8 -45 L -6 -45 L -10 -30 L -5 -48 L -3 -48 L -7 -28 L 0 -44 L 2 -44 L -4 -25 L 3 -36 L 5 -36 L -1 -20 L 4 0 Z"
          fill={COLOR_PALETTE.accent_fog_white}
          opacity="0.8"
        />
      </g>
    </g>
  );
};

/**
 * 6. SCARECROW OF THE DAMNED (Bù Nhìn Rơm Bị Quỷ Ám)
 * Cross timber, torn sack head with manic stitched grin, straw burst out, crows
 */
const ScarecrowOfTheDamned: React.FC = () => {
  return (
    <g className="scarecrow-damned">
      {/* Central Vertical Post driven into ground */}
      <polygon points="-8,0 -6,-280 6,-280 8,0" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Horizontal Crossbeam for Arms */}
      <polygon points="-110,-190 110,-190 110,-178 -110,-178" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Tattered Decayed Coat hanging loosely */}
      <path
        d="M -45 -180 C -55 -120, -50 -70, -40 -30 L 40 -30 C 50 -70, 55 -120, 45 -180 Z"
        fill={COLOR_PALETTE.silhouette_secondary}
      />
      {/* Shredded rags hanging below */}
      <polygon points="-40,-30 -35,-8 -28,-30 -20,-5 -12,-30 0,-10 10,-30 20,-5 30,-30 35,-8 40,-30" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Spilling Straw from Sleeves (Bụi rơm rạ đâm tua tủa) */}
      <path d="M -110 -185 L -140 -195 L -130 -185 L -150 -180 L -125 -175 Z" fill={COLOR_PALETTE.accent_eerie_gold} />
      <path d="M 110 -185 L 140 -195 L 130 -185 L 150 -180 L 125 -175 Z" fill={COLOR_PALETTE.accent_eerie_gold} />

      {/* Crooked Burlap Sack Head (Đầu bao bố rách) */}
      <g transform="translate(0, -280) rotate(8)">
        <ellipse cx="0" cy="0" rx="26" ry="32" fill={COLOR_PALETTE.silhouette_primary} />
        {/* Stitched Sack Creepy Eyes */}
        <line x1="-12" y1="-8" x2="-4" y2="-4" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2.5" />
        <line x1="-8" y1="-12" x2="-8" y2="0" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2" />
        <line x1="4" y1="-4" x2="12" y2="-8" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2.5" />
        <line x1="8" y1="-12" x2="8" y2="0" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2" />

        {/* Stitched Ripped Jagged Grin */}
        <path d="M -16 12 Q 0 25 16 12" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2" fill="none" />
        <line x1="-12" y1="11" x2="-12" y2="17" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="1.5" />
        <line x1="-6" y1="14" x2="-6" y2="20" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="1.5" />
        <line x1="0" y1="16" x2="0" y2="22" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="1.5" />
        <line x1="6" y1="14" x2="6" y2="20" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="1.5" />
        <line x1="12" y1="11" x2="12" y2="17" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="1.5" />

        {/* Decayed Straw Hat */}
        <ellipse cx="0" cy="-28" rx="38" ry="8" fill={COLOR_PALETTE.silhouette_secondary} />
        <polygon points="-22,-28 -15,-55 15,-55 22,-28" fill={COLOR_PALETTE.silhouette_primary} />
      </g>
    </g>
  );
};

/**
 * 7. CREEPY WELL (Giếng Cạn Oan Hồn)
 * Circular stone well rim, mossy cracks, rope winch, drowned entity emerging
 */
const CreepyWell: React.FC = () => {
  return (
    <g className="creepy-well">
      {/* Earth mound surrounding well base */}
      <ellipse cx="0" cy="0" rx="110" ry="25" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Stone Well Outer Cylinder */}
      <path
        d="M -85 -10 L -85 -75 C -85 -95, 85 -95, 85 -75 L 85 -10 Z"
        fill={COLOR_PALETTE.silhouette_secondary}
      />
      <ellipse cx="0" cy="-10" rx="85" ry="18" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Well Top Opening / Dark Bottomless Pit (Miệng giếng đen ngòm) */}
      <ellipse cx="0" cy="-75" rx="85" ry="22" fill={COLOR_PALETTE.silhouette_primary} />
      <ellipse cx="0" cy="-75" rx="72" ry="17" fill="#010103" />

      {/* Timber Roof Supports */}
      <polygon points="-75,-70 -80,-190 -70,-190 -65,-70" fill={COLOR_PALETTE.silhouette_primary} />
      <polygon points="65,-70 70,-190 80,-190 75,-70" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Roof Crosstie & Spindle Beam */}
      <polygon points="-85,-190 85,-190 85,-178 -85,-178" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Hanging Well Rope dangling into dark pit */}
      <line x1="0" y1="-180" x2="0" y2="-65" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2.5" opacity="0.7" />

      {/* Long Wet Black Hair cascading over well rim */}
      <path
        d="M -30 -75 C -35 -40, -45 -10, -38 10 L -25 10 C -32 -10, -22 -40, -18 -75 Z"
        fill="#000000"
      />
      <path
        d="M -15 -75 C -18 -35, -20 5, -12 18 L -3 18 C -10 5, -8 -35, -5 -75 Z"
        fill="#000000"
      />

      {/* Pale Wet Hand gripping well stone rim */}
      <path
        d="M 25 -78 C 28 -88, 35 -90, 38 -80 C 40 -90, 48 -90, 50 -82 C 52 -90, 60 -88, 60 -80 L 58 -68 L 26 -68 Z"
        fill={COLOR_PALETTE.accent_fog_white}
      />
    </g>
  );
};

/**
 * 8. HAUNTED GALLOWS TREE (Cây Treo Cổ Rủ Cành Liễu)
 * Spreading weeping branches with an eerie swaying noose
 */
const HauntedGallowsTree: React.FC = () => {
  return (
    <g className="gallows-tree">
      {/* Roots */}
      <path d="M -120 0 C -80 -20, -50 -40, -30 -60 L 30 -60 C 50 -40, 80 -20, 120 0 Z" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Tall Gnarled Trunk bending heavily to the side */}
      <path
        d="M -35 -60 C -45 -180, -30 -300, 20 -400 C 60 -460, 140 -490, 220 -500 C 180 -470, 70 -440, 30 -360 C -5 -280, 5 -180, 35 -60 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />

      {/* Prominent High Gallows Branch extending horizontally */}
      <path
        d="M 120 -470 C 180 -490, 260 -500, 330 -490 C 270 -475, 200 -465, 140 -450 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />

      {/* Drooping Weeping Willow Tendrils (Cành liễu buông rủ) */}
      <path d="M 280 -490 Q 295 -320 285 -150 Q 280 -50 282 0" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="2" fill="none" className="anim-sway-subtle" />
      <path d="M 230 -480 Q 240 -300 232 -120 Q 225 -30 228 0" stroke={COLOR_PALETTE.silhouette_secondary} strokeWidth="2" fill="none" className="anim-sway-subtle" />
      <path d="M 170 -455 Q 185 -280 178 -100" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="2" fill="none" className="anim-sway-subtle" />

      {/* Swaying Hangman's Noose (Thòng lọng đung đưa) */}
      <g transform="translate(250, -485)" className="anim-sway-subtle">
        {/* Rope */}
        <line x1="0" y1="0" x2="0" y2="160" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2.5" opacity="0.75" />
        {/* Knot */}
        <circle cx="0" cy="162" r="4.5" fill={COLOR_PALETTE.silhouette_primary} />
        {/* Noose Loop */}
        <ellipse cx="0" cy="188" rx="14" ry="24" fill="none" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2.5" opacity="0.85" />
      </g>
    </g>
  );
};
