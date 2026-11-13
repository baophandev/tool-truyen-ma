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
      {id === "hospital_operating_bed" && <HospitalOperatingBed />}
      {id === "hotel_reception_desk" && <HotelReceptionDesk />}
      {id === "supermarket_shelf_aisle" && <SupermarketShelfAisle />}
      {id === "creepy_elevator_doors" && <CreepyElevatorDoors />}
      {id === "dining_table_chairs" && <DiningTableChairs />}

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

/**
 * 9. HOSPITAL OPERATING BED (Giường Mổ Bệnh Viện Rỉ Sét)
 */
const HospitalOperatingBed: React.FC = () => {
  return (
    <g className="hospital-operating-bed">
      {/* 4 Castor Wheels on Ground Y=0 */}
      <circle cx="-110" cy="-6" r="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      <circle cx="-45" cy="-6" r="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      <circle cx="45" cy="-6" r="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      <circle cx="110" cy="-6" r="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      <line x1="-120" y1="-12" x2="120" y2="-12" stroke="#0F172A" strokeWidth="4" />

      {/* Hydraulic Scissor Lift Base */}
      <line x1="-80" y1="-12" x2="30" y2="-60" stroke="#1E293B" strokeWidth="4.5" />
      <line x1="80" y1="-12" x2="-30" y2="-60" stroke="#1E293B" strokeWidth="4.5" />
      <circle cx="0" cy="-36" r="4.5" fill="#334155" />

      {/* Bed Platform Frame */}
      <rect x="-130" y="-68" width="260" height="10" rx="2" fill="#0A0D14" stroke="#334155" strokeWidth="1.5" />

      {/* Raised Headrest (Left) */}
      <polygon points="-130,-68 -70,-68 -90,-96 -140,-86" fill="#0A0D14" stroke="#334155" strokeWidth="1.5" />

      {/* Stained Mattress with Drooping Ripped Sheet */}
      <path
        d="M -138 -86 L -90 -96 L -65 -72 L 128 -72 L 128 -68 L -65 -68 Z"
        fill="#CBD5E1"
        opacity="0.85"
      />
      {/* Drooping soiled bedsheet */}
      <path
        d="M -40 -60 C -30 -35, -20 -18, -5 -15 L 15 -15 C 25 -32, 40 -48, 55 -60 Z"
        fill="#94A3B8"
        opacity="0.75"
      />
      {/* Ominous Blood Stain on Mattress */}
      <ellipse cx="-20" cy="-70" rx="18" ry="4" fill={COLOR_PALETTE.accent_blood_red} opacity="0.8" />
      <circle cx="20" cy="-69" r="3" fill={COLOR_PALETTE.accent_blood_red} opacity="0.7" />

      {/* Restraint Straps Dangling */}
      <path d="M -50 -60 Q -55 -30 -52 -10" stroke="#475569" strokeWidth="2" fill="none" />
      <path d="M 60 -60 Q 64 -35 60 -8" stroke="#475569" strokeWidth="2" fill="none" />

      {/* Attached Tall Surgical Arch & Overhead Lamp */}
      <path
        d="M -125 -68 L -125 -190 Q -125 -220 -95 -220 L 0 -220"
        fill="none"
        stroke="#1E293B"
        strokeWidth="3.5"
      />
      {/* Surgical Lamp Bell */}
      <ellipse cx="0" cy="-220" rx="24" ry="8" fill="#334155" stroke="#0F172A" strokeWidth="1.5" />
      <ellipse cx="0" cy="-219" rx="18" ry="4" fill="#A7F3D0" opacity="0.6" className="anim-flicker-fast" />
    </g>
  );
};

/**
 * 10. HOTEL RECEPTION DESK (Quầy Lễ Tân Khách Sạn U Ám)
 */
const HotelReceptionDesk: React.FC = () => {
  return (
    <g className="hotel-reception-desk">
      {/* Background Room Key / Mail Slot Wall Rack (Behind desk) */}
      <g transform="translate(0, -95)">
        <rect x="-115" y="-120" width="230" height="120" fill="#0C0F17" stroke="#1E293B" strokeWidth="2" />
        {/* Grid Slots */}
        {[-90, -45, 0, 45, 90].map((x) => (
          <React.Fragment key={x}>
            <line x1={x} y1="-120" x2={x} y2="0" stroke="#1E293B" strokeWidth="1.5" />
            {/* Hanging brass keys */}
            <circle cx={x - 22} cy="-85" r="2.5" fill="#F59E0B" opacity="0.85" />
            <line x1={x - 22} y1="-85" x2={x - 22} y2="-72" stroke="#D97706" strokeWidth="1.2" />
            <circle cx={x - 22} cy="-45" r="2.5" fill="#F59E0B" opacity="0.85" />
            <line x1={x - 22} y1="-45" x2={x - 22} y2="-32" stroke="#D97706" strokeWidth="1.2" />
          </React.Fragment>
        ))}
        <line x1="-115" y1="-80" x2="115" y2="-80" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="-115" y1="-40" x2="115" y2="-40" stroke="#1E293B" strokeWidth="1.5" />
      </g>

      {/* Main Wooden Counter Body */}
      <rect x="-140" y="-95" width="280" height="95" fill={COLOR_PALETTE.silhouette_primary} />
      {/* Wood Paneling Decorative Insets */}
      <rect x="-125" y="-82" width="70" height="70" fill="#06080D" stroke="#1E293B" strokeWidth="2" />
      <rect x="-35" y="-82" width="70" height="70" fill="#06080D" stroke="#1E293B" strokeWidth="2" />
      <rect x="55" y="-82" width="70" height="70" fill="#06080D" stroke="#1E293B" strokeWidth="2" />
      {/* Heavy Countertop Slab */}
      <rect x="-150" y="-103" width="300" height="10" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />

      {/* Brass Service Bell */}
      <g transform="translate(-50, -103)">
        <ellipse cx="0" cy="0" rx="10" ry="3" fill="#D97706" />
        <path d="M -8 0 C -8 -8, 8 -8, 8 0 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
        <circle cx="0" cy="-9" r="2" fill="#FDE68A" />
      </g>

      {/* Guest Check-in Ledger Book */}
      <g transform="translate(15, -103)">
        <polygon points="-24,0 -20,-8 18,-8 22,0" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
        <line x1="-2" y1="-8" x2="-2" y2="0" stroke="#0F172A" strokeWidth="1" />
      </g>

      {/* Vintage Green Banker's Desk Lamp */}
      <g transform="translate(90, -103)">
        <ellipse cx="0" cy="0" rx="8" ry="2.5" fill="#D97706" />
        <path d="M 0 0 L 0 -24 Q 0 -34 -12 -34" fill="none" stroke="#D97706" strokeWidth="2.5" />
        {/* Emerald glass shade */}
        <path d="M -24 -32 C -24 -44, 0 -44, 0 -32 Z" fill="#047857" stroke="#065F46" strokeWidth="1" />
        <ellipse cx="-12" cy="-32" rx="12" ry="3" fill="#A7F3D0" opacity="0.65" className="anim-flicker-ember" />
      </g>
    </g>
  );
};

/**
 * 11. SUPERMARKET SHELF AISLE (Dãy Kệ Hàng Siêu Thị Hoang Tàn)
 */
const SupermarketShelfAisle: React.FC = () => {
  return (
    <g className="supermarket-shelf-aisle">
      {/* Industrial Upright Steel Frame (Height 360px) */}
      <rect x="-120" y="-350" width="8" height="350" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
      <rect x="112" y="-350" width="8" height="350" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
      <rect x="-4" y="-350" width="8" height="350" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
      {/* Base feet */}
      <rect x="-135" y="-12" width="270" height="12" rx="2" fill="#0A0D14" stroke="#1E293B" strokeWidth="1.5" />

      {/* 4 Shelves with Price Tag Rails */}
      {[-75, -145, -215, -285].map((y) => (
        <React.Fragment key={y}>
          {/* Shelf platform */}
          <rect x="-120" y={y} width="240" height="8" fill="#141B26" stroke="#334155" strokeWidth="1" />
          {/* Neon price strip */}
          <line x1="-120" y1={y + 8} x2="120" y2={y + 8} stroke="#0284C7" strokeWidth="1.5" opacity="0.5" />
        </React.Fragment>
      ))}

      {/* Top Shelf Clutter (Canned goods & detergent boxes) */}
      <g fill="#334155" opacity="0.85">
        {/* Tier 4 (y=-285) */}
        <rect x="-105" y="-325" width="20" height="38" fill="#475569" />
        <rect x="-82" y="-320" width="18" height="33" fill="#334155" />
        <rect x="-60" y="-310" width="16" height="23" fill="#64748B" />
        {/* Cans */}
        <rect x="20" y="-315" width="14" height="28" rx="2" fill="#94A3B8" />
        <rect x="37" y="-315" width="14" height="28" rx="2" fill="#94A3B8" />
        <rect x="54" y="-315" width="14" height="28" rx="2" fill="#94A3B8" />
        <rect x="80" y="-325" width="24" height="38" fill="#475569" />

        {/* Tier 3 (y=-215) */}
        <rect x="-110" y="-245" width="15" height="28" rx="2" fill="#94A3B8" />
        <rect x="-92" y="-245" width="15" height="28" rx="2" fill="#94A3B8" />
        {/* Overturned can with dripping stain */}
        <polygon points="-70,-225 -42,-230 -40,-218 -68,-215" fill="#CBD5E1" />
        <path d="M -55 -215 Q -55 -190 -50 -180" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2" fill="none" />
        <rect x="10" y="-255" width="30" height="38" fill="#475569" />
        <rect x="45" y="-250" width="26" height="33" fill="#334155" />
        <rect x="75" y="-258" width="32" height="41" fill="#475569" />

        {/* Tier 2 (y=-145) */}
        <rect x="-105" y="-180" width="35" height="33" fill="#334155" />
        <rect x="-65" y="-175" width="28" height="28" fill="#475569" />
        <rect x="15" y="-170" width="16" height="23" rx="2" fill="#94A3B8" />
        <rect x="35" y="-170" width="16" height="23" rx="2" fill="#94A3B8" />
        <rect x="65" y="-185" width="40" height="38" fill="#334155" />

        {/* Tier 1 (y=-75) - Empty & ransacked */}
        <rect x="-90" y="-105" width="18" height="28" rx="2" fill="#64748B" />
        <rect x="40" y="-115" width="32" height="38" fill="#334155" />
      </g>

      {/* Dangling loose cable */}
      <path d="M 112 -285 Q 125 -200 115 -140 Q 110 -100 120 -60" fill="none" stroke="#0F172A" strokeWidth="2.5" />

      {/* Overhead Hanging Aisle Category Marker */}
      <g transform="translate(0, -350)">
        <line x1="0" y1="0" x2="0" y2="-35" stroke="#475569" strokeWidth="2" />
        <rect x="-28" y="-62" width="56" height="28" rx="3" fill="#0C121E" stroke="#38BDF8" strokeWidth="1.5" />
        <text x="0" y="-43" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" fontFamily="monospace">
          04
        </text>
      </g>
    </g>
  );
};

/**
 * 12. CREEPY ELEVATOR DOORS (Cửa Thang Máy Rùng Rợn Hé Mở)
 */
const CreepyElevatorDoors: React.FC = () => {
  return (
    <g className="creepy-elevator-doors">
      {/* Outer Heavy Steel Doorway Frame */}
      <rect x="-130" y="-350" width="260" height="350" fill="#0B0F17" stroke="#1E293B" strokeWidth="4" />

      {/* Left Stainless Door Panel */}
      <rect x="-116" y="-325" width="108" height="325" fill="#141C2B" stroke="#0F172A" strokeWidth="1.5" />
      <line x1="-110" y1="-320" x2="-110" y2="0" stroke="#1E293B" strokeWidth="1.5" opacity="0.6" />
      <line x1="-12" y1="-320" x2="-12" y2="0" stroke="#334155" strokeWidth="2" />

      {/* Right Stainless Door Panel */}
      <rect x="8" y="-325" width="108" height="325" fill="#141C2B" stroke="#0F172A" strokeWidth="1.5" />
      <line x1="110" y1="-320" x2="110" y2="0" stroke="#1E293B" strokeWidth="1.5" opacity="0.6" />
      <line x1="14" y1="-320" x2="14" y2="0" stroke="#334155" strokeWidth="2" />

      {/* Pitch-Black Center Crevice (Abyss slit) */}
      <rect x="-8" y="-325" width="16" height="325" fill="#000000" />
      {/* Dangling steel hoist cable inside slit */}
      <line x1="0" y1="-325" x2="0" y2="0" stroke="#1E293B" strokeWidth="2" opacity="0.8" />
      {/* Glowing ominous pair of eyes inside elevator gap */}
      <g className="anim-pulse-eerie">
        <circle cx="-3" cy="-170" r="1.8" fill={COLOR_PALETTE.accent_blood_red} />
        <circle cx="3" cy="-170" r="1.8" fill={COLOR_PALETTE.accent_blood_red} />
      </g>

      {/* Overhead Digital Floor Indicator Panel */}
      <g transform="translate(0, -336)">
        <rect x="-35" y="-12" width="70" height="22" rx="3" fill="#030407" stroke="#475569" strokeWidth="1.5" />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill="#DC2626"
          fontSize="13"
          fontWeight="bold"
          fontFamily="monospace"
          className="anim-flicker-ember"
        >
          -4
        </text>
      </g>

      {/* Call Button Box on Right Wall Jamb */}
      <g transform="translate(142, -160)">
        <rect x="-8" y="-22" width="16" height="44" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        {/* Up button */}
        <circle cx="0" cy="-10" r="4" fill="#1E293B" />
        {/* Down button glowing red */}
        <circle cx="0" cy="10" r="4" fill="#DC2626" className="anim-pulse-eerie" />
        <polygon points="-2.5,9 2.5,9 0,12" fill="#FFF" />
      </g>
    </g>
  );
};

/**
 * 13. DINING TABLE & CHAIRS (Bàn Ăn Nhà Hàng Khăn Rách)
 */
const DiningTableChairs: React.FC = () => {
  return (
    <g className="dining-table-chairs">
      {/* Left High-backed Vintage Wooden Chair */}
      <g transform="translate(-105, 0)">
        {/* Chair Legs */}
        <line x1="-16" y1="0" x2="-14" y2="-70" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="4.5" />
        <line x1="14" y1="0" x2="12" y2="-70" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="4.5" />
        {/* Chair Seat */}
        <polygon points="-22,-70 20,-70 16,-62 -18,-62" fill={COLOR_PALETTE.silhouette_primary} />
        {/* High Spindled Backrest */}
        <line x1="-18" y1="-70" x2="-18" y2="-175" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="4" />
        <line x1="-10" y1="-70" x2="-10" y2="-165" stroke={COLOR_PALETTE.silhouette_secondary} strokeWidth="2.5" />
        <line x1="-2" y1="-70" x2="-2" y2="-165" stroke={COLOR_PALETTE.silhouette_secondary} strokeWidth="2.5" />
        <path d="M -22 -175 C -10 -185, 2 -185, 10 -175" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="4.5" fill="none" />
      </g>

      {/* Right High-backed Vintage Wooden Chair */}
      <g transform="translate(105, 0) scale(-1, 1)">
        {/* Chair Legs */}
        <line x1="-16" y1="0" x2="-14" y2="-70" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="4.5" />
        <line x1="14" y1="0" x2="12" y2="-70" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="4.5" />
        {/* Chair Seat */}
        <polygon points="-22,-70 20,-70 16,-62 -18,-62" fill={COLOR_PALETTE.silhouette_primary} />
        {/* High Spindled Backrest */}
        <line x1="-18" y1="-70" x2="-18" y2="-175" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="4" />
        <line x1="-10" y1="-70" x2="-10" y2="-165" stroke={COLOR_PALETTE.silhouette_secondary} strokeWidth="2.5" />
        <line x1="-2" y1="-70" x2="-2" y2="-165" stroke={COLOR_PALETTE.silhouette_secondary} strokeWidth="2.5" />
        <path d="M -22 -175 C -10 -185, 2 -185, 10 -175" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="4.5" fill="none" />
      </g>

      {/* Main Dining Table Pedestal & Legs */}
      <line x1="-65" y1="0" x2="-60" y2="-85" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="5" />
      <line x1="65" y1="0" x2="60" y2="-85" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="5" />
      <line x1="-75" y1="-85" x2="75" y2="-85" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="5" />

      {/* Draped Ragged Tablecloth */}
      <path
        d="M -75 -85 L 75 -85 L 72 -35 C 65 -45, 55 -30, 45 -48 C 30 -35, 15 -52, 0 -38 C -15 -50, -30 -36, -45 -46 C -55 -32, -65 -42, -72 -35 Z"
        fill="#CBD5E1"
        opacity="0.82"
        stroke="#94A3B8"
        strokeWidth="1"
      />

      {/* Centerpiece 1: Candelabra with Wax Drippings */}
      <g transform="translate(-15, -88)">
        <ellipse cx="0" cy="0" rx="9" ry="3" fill="#D97706" />
        <line x1="0" y1="0" x2="0" y2="-35" stroke="#D97706" strokeWidth="3" />
        {/* Left and Right Arms */}
        <path d="M -16 -24 Q -16 -14 0 -14 Q 16 -14 16 -24" fill="none" stroke="#D97706" strokeWidth="2.2" />
        {/* Mini Candle Flames */}
        <circle cx="-16" cy="-28" r="2.5" fill="#F59E0B" className="anim-flicker-ember" />
        <circle cx="0" cy="-39" r="3" fill="#F59E0B" className="anim-flicker-fast" />
        <circle cx="16" cy="-28" r="2.5" fill="#F59E0B" className="anim-flicker-ember" />
      </g>

      {/* Centerpiece 2: Dusty Wine Bottle */}
      <g transform="translate(30, -88)">
        <rect x="-5" y="-28" width="10" height="28" rx="2" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
        <rect x="-2" y="-38" width="4" height="10" fill="#0F172A" />
      </g>
    </g>
  );
};
