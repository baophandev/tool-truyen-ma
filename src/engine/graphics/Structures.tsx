import React from "react";
import type { StructureId, FacingDirection } from "../types";
import { COLOR_PALETTE } from "../constants";

interface StructureProps {
  id: StructureId;
  scale?: number;
  facing?: FacingDirection;
  showAnchor?: boolean;
}

export const StructureRenderer: React.FC<StructureProps> = ({
  id,
  scale = 1,
  facing = "right",
  showAnchor = false,
}) => {
  const flip = facing === "left" ? -1 : 1;
  return (
    <g
      className={`structure-${id}`}
      transform={`scale(${flip * scale}, ${scale})`}
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
      {id === "bus_interior" && <BusInterior />}
      {id === "creepy_bathtub" && <CreepyBathtub />}
      {id === "market_stall_tent" && <MarketStallTent />}
      {id === "abandoned_subway_station" && <AbandonedSubwayStation />}
      {id === "rusty_train_tracks_tunnel" && <RustyTrainTracksTunnel />}
      {id === "structure_old_apartment_gate" && <OldApartmentGate />}
      {id === "structure_wooden_sampan" && <WoodenSampan />}
      {id === "structure_monkey_bridge" && <MonkeyBridge />}
      {id === "structure_wooden_coffin" && <WoodenCoffin />}
      {id === "structure_bamboo_bed_net" && <BambooBedNet />}
      {id === "structure_wooden_latch_door" && <WoodenLatchDoor />}
      {id === "structure_rural_passenger_bus" && <RuralPassengerBus />}
      {id === "structure_coconut_banana_grove" && <CoconutBananaGrove />}
      {id === "structure_wooden_chair" && <WoodenChair />}
      {id === "structure_wooden_bed" && <WoodenBed />}
      {id === "structure_small_wooden_table" && <SmallWoodenTable />}
      {id === "structure_wooden_window" && <WoodenCountryWindow />}
      {id === "structure_ancestor_altar" && <AncestorAltar />}
      {id === "structure_hammock" && <Hammock />}

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

/**
 * 14. BUS INTERIOR / DRIVER STATION (Buồng Lái Tài Xế & Hộp Thu Vé Xe Bus)
 * Detailed front cockpit of a midnight bus anchored at [bottom-center] (0, 0) on Ground Line Y=800.
 * Features driver console, large steering wheel on angled column, glowing red instrument gauges,
 * high-back driver seat, coin fare collection box / card validator, passenger entrance handrail,
 * and convex rearview mirror bracket. Seamlessly integrates with vehicle_interior theme.
 */
const BusInterior: React.FC = () => {
  return (
    <g className="bus-interior-driver-station">
      {/* 1. RAISED DRIVER FLOOR PLATFORM & TREAD */}
      <rect x="-165" y="-16" width="220" height="16" fill="#0A0D15" stroke="#1E293B" strokeWidth="1.2" />
      <line x1="-165" y1="-16" x2="55" y2="-16" stroke="#CA8A04" strokeWidth="2" />
      <g stroke="#1E293B" strokeWidth="1.2">
        <line x1="-145" y1="-16" x2="-140" y2="0" />
        <line x1="-115" y1="-16" x2="-110" y2="0" />
        <line x1="-85" y1="-16" x2="-80" y2="0" />
        <line x1="-55" y1="-16" x2="-50" y2="0" />
        <line x1="-25" y1="-16" x2="-20" y2="0" />
        <line x1="5" y1="-16" x2="10" y2="0" />
        <line x1="35" y1="-16" x2="40" y2="0" />
      </g>

      {/* 2. DRIVER HIGH-BACK HYDRAULIC SEAT */}
      <g className="driver-seat" transform="translate(-105, -16)">
        {/* Heavy central hydraulic shock cylinder */}
        <rect x="-10" y="-70" width="20" height="70" fill="#04060A" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="-6" y1="-50" x2="6" y2="-50" stroke="#475569" strokeWidth="2" />
        <line x1="-6" y1="-30" x2="6" y2="-30" stroke="#475569" strokeWidth="2" />
        {/* Seat base cushion */}
        <rect x="-34" y="-95" width="68" height="25" rx="5" fill="#090E18" stroke="#1E293B" strokeWidth="2" />
        {/* Contoured high-back rest */}
        <path
          d="M -30 -95 L -26 -210 C -26 -225, 26 -225, 26 -210 L 30 -95 Z"
          fill="#060912"
          stroke="#151E2E"
          strokeWidth="2.5"
        />
        {/* Adjustable headrest */}
        <rect x="-20" y="-235" width="40" height="26" rx="4" fill="#04060A" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="-8" y1="-210" x2="-8" y2="-195" stroke="#475569" strokeWidth="3" />
        <line x1="8" y1="-210" x2="8" y2="-195" stroke="#475569" strokeWidth="3" />
        {/* Left armrest */}
        <path d="M -30 -140 L -45 -140 L -45 -110" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* 3. FRONT A-PILLAR & LARGE CONVEX REARVIEW MIRROR */}
      <g className="driver-mirror-pillar">
        {/* Windshield corner A-pillar */}
        <path d="M -165 -16 L -155 -310 L -140 -310 L -145 -16 Z" fill="#070A10" stroke="#1E293B" strokeWidth="1.5" />
        {/* Mirror tubular bracket arm */}
        <path d="M -145 -260 L -185 -270 L -185 -230 L -145 -225" fill="none" stroke="#475569" strokeWidth="3" />
        {/* Convex wide-angle rearview mirror casing */}
        <rect x="-202" y="-285" width="22" height="65" rx="4" fill="#05070C" stroke="#334155" strokeWidth="1.8" />
        {/* Mirror glass reflection with cold teal haze */}
        <rect x="-198" y="-281" width="14" height="57" rx="2" fill="#0B1C22" opacity="0.8" />
        <line x1="-195" y1="-275" x2="-187" y2="-240" stroke="#38BDF8" strokeWidth="1" opacity="0.4" />
      </g>

      {/* 4. DRIVER DASHBOARD CONSOLE & INSTRUMENT CLUSTERS */}
      <g className="driver-dashboard" transform="translate(0, -16)">
        {/* Slanted dashboard housing */}
        <path
          d="M -75 0 L -70 -95 L 35 -105 L 45 0 Z"
          fill="#080C14"
          stroke="#1E293B"
          strokeWidth="2"
        />
        {/* Raised instrument binnacle */}
        <path d="M -60 -95 L -55 -125 L 5 -128 L 10 -102 Z" fill="#04060A" stroke="#1E293B" strokeWidth="1.5" />

        {/* Speedometer & Tachometer Gauges with eerie red LED glow */}
        <g transform="translate(-38, -112)">
          <circle cx="0" cy="0" r="10" fill="#020305" stroke="#334155" strokeWidth="1" />
          <circle cx="0" cy="0" r="8" fill="none" stroke="#DC2626" strokeWidth="1" strokeDasharray="30,8" opacity="0.75" />
          <line x1="0" y1="0" x2="5" y2="-5" stroke="#EF4444" strokeWidth="1.2" />
        </g>
        <g transform="translate(-14, -114)">
          <circle cx="0" cy="0" r="9" fill="#020305" stroke="#334155" strokeWidth="1" />
          <circle cx="0" cy="0" r="7" fill="none" stroke="#EAB308" strokeWidth="1" strokeDasharray="24,6" opacity="0.75" />
          <line x1="0" y1="0" x2="-4" y2="-4" stroke="#FDE047" strokeWidth="1.2" />
        </g>
        {/* Warning Indicator Lights (Hazard, Door Open, Oil) */}
        <circle cx="4" cy="-115" r="2.2" fill="#EF4444" className="anim-pulse-eerie" />
        <circle cx="4" cy="-108" r="2.2" fill="#EAB308" />

        {/* 5. LARGE BUS STEERING WHEEL ON ANGLED COLUMN */}
        <g transform="translate(-25, -100)">
          {/* Thick steel steering column */}
          <line x1="0" y1="0" x2="-10" y2="-38" stroke="#1E293B" strokeWidth="7" />
          <line x1="-1" y1="0" x2="-11" y2="-38" stroke="#475569" strokeWidth="2" />
          {/* Steering wheel rim tilted at driving angle */}
          <ellipse
            cx="-12"
            cy="-42"
            rx="32"
            ry="16"
            fill="none"
            stroke="#05070B"
            strokeWidth="5"
            transform="rotate(-15, -12, -42)"
          />
          <ellipse
            cx="-12"
            cy="-42"
            rx="30"
            ry="14"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.8"
            transform="rotate(-15, -12, -42)"
          />
          {/* Center horn boss & 3 spokes */}
          <circle cx="-12" cy="-42" r="6" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          <line x1="-12" y1="-42" x2="-38" y2="-36" stroke="#1E293B" strokeWidth="3" />
          <line x1="-12" y1="-42" x2="14" y2="-48" stroke="#1E293B" strokeWidth="3" />
          <line x1="-12" y1="-42" x2="-14" y2="-18" stroke="#1E293B" strokeWidth="3" />
        </g>

        {/* Transmission Gear Shifter Lever */}
        <line x1="22" y1="-45" x2="26" y2="-80" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="-80" r="5" fill="#020305" stroke="#1E293B" strokeWidth="1" />
      </g>

      {/* 6. AUTOMATIC COIN FARE COLLECTION BOX & CARD VALIDATOR */}
      <g className="bus-fare-box" transform="translate(75, 0)">
        {/* Sturdy steel pedestal anchored to floor */}
        <rect x="-24" y="-125" width="48" height="125" rx="3" fill="#090E18" stroke="#1E293B" strokeWidth="2" />
        {/* Upper coin hopper collector funnel */}
        <path d="M -28 -125 L 28 -125 L 22 -145 L -22 -145 Z" fill="#05070D" stroke="#1E293B" strokeWidth="1.5" />
        <ellipse cx="0" cy="-145" rx="18" ry="4" fill="#020305" stroke="#334155" strokeWidth="1" />
        {/* Coin drop slot */}
        <line x1="-8" y1="-145" x2="8" y2="-145" stroke="#EAB308" strokeWidth="1.5" />

        {/* Digital Fare Display Screen */}
        <rect x="-18" y="-115" width="36" height="18" rx="2" fill="#020305" stroke="#334155" strokeWidth="1" />
        <text
          x="0"
          y="-102"
          textAnchor="middle"
          fill="#EF4444"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="bold"
        >
          $ --.--
        </text>

        {/* Smart Card Tap Reader Pad */}
        <rect x="-16" y="-88" width="32" height="22" rx="3" fill="#0B1320" stroke="#1E293B" strokeWidth="1" />
        <circle cx="0" cy="-77" r="5" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6,4" />
        <circle cx="0" cy="-77" r="2" fill="#10B981" className="anim-pulse-eerie" />

        {/* Locked coin vault door */}
        <rect x="-18" y="-55" width="36" height="42" rx="2" fill="#05070C" stroke="#1E293B" strokeWidth="1" />
        <circle cx="10" cy="-34" r="3" fill="#334155" />
      </g>

      {/* 7. PASSENGER ENTRANCE STANCHION HANDRAIL */}
      <g className="bus-entrance-handrail" transform="translate(115, 0)">
        {/* Vertical yellow pole */}
        <line x1="0" y1="0" x2="0" y2="-280" stroke="#CA8A04" strokeWidth="6" />
        <line x1="-1" y1="0" x2="-1" y2="-280" stroke="#EAB308" strokeWidth="3" />
        {/* Floor base flange */}
        <rect x="-8" y="-6" width="16" height="6" rx="1.5" fill="#1E293B" />
        {/* Curved boarding assist bar curving towards the door */}
        <path
          d="M 0 -160 C 25 -160, 42 -140, 42 -100 L 42 0"
          fill="none"
          stroke="#EAB308"
          strokeWidth="4"
        />
        {/* Red passenger STOP button box */}
        <rect x="-5" y="-185" width="10" height="22" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        <circle cx="0" cy="-174" r="3" fill="#DC2626" className="anim-pulse-eerie" />
      </g>
    </g>
  );
};

/**
 * 15. CREEPY BATHTUB (Bồn Tắm Rỉ Sét Cổ Quái)
 * Vintage clawfoot porcelain bathtub with rusted stains, blood-tinted murky water,
 * and a tarnished brass gooseneck faucet dripping blood. Anchored at [bottom-center] (0, 0).
 */
const CreepyBathtub: React.FC = () => {
  return (
    <g className="creepy-bathtub">
      {/* 1. Drain pipe underneath */}
      <path d="M 0 -22 L 0 -8 L 12 -8 L 12 0" fill="none" stroke="#475569" strokeWidth="3" />

      {/* 2. Four Ornate Clawfoot Legs resting on Ground Y=0 */}
      {/* Back Legs (darker silhouette) */}
      <path d="M -125 -25 L -120 0 L -132 0 Z" fill="#0B0E14" />
      <path d="M 125 -25 L 132 0 L 120 0 Z" fill="#0B0E14" />

      {/* Front Left Clawfoot Leg */}
      <g transform="translate(-112, 0)">
        <path d="M 0 -26 C -4 -16, -14 -8, -12 0 L 8 0 C 6 -8, 2 -16, 0 -26 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <circle cx="-5" cy="-2" r="3" fill="#D97706" opacity="0.7" />
        <circle cx="3" cy="-2" r="3" fill="#D97706" opacity="0.7" />
      </g>

      {/* Front Right Clawfoot Leg */}
      <g transform="translate(112, 0)">
        <path d="M 0 -26 C -2 -16, -6 -8, -8 0 L 12 0 C 14 -8, 4 -16, 0 -26 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <circle cx="-3" cy="-2" r="3" fill="#D97706" opacity="0.7" />
        <circle cx="5" cy="-2" r="3" fill="#D97706" opacity="0.7" />
      </g>

      {/* 3. Cast Iron Tub Outer Belly Silhouette */}
      <path
        d="M -145 -125 C -150 -60, -110 -25, -70 -22 L 70 -22 C 110 -25, 145 -55, 142 -115 Z"
        fill="#0D111A"
        stroke="#1E293B"
        strokeWidth="2"
      />

      {/* Weathered Enamel Body with Mold & Rust Gradients */}
      <path
        d="M -142 -122 C -147 -65, -108 -30, -68 -26 L 68 -26 C 108 -30, 140 -60, 138 -112 Z"
        fill="#141A24"
      />
      {/* Dripping blood / rust streaks down the tub belly */}
      <path d="M -90 -115 C -90 -85, -86 -60, -84 -30" stroke="#7F1D1D" strokeWidth="2.5" fill="none" opacity="0.8" />
      <path d="M -40 -115 C -38 -80, -42 -55, -40 -26" stroke="#991B1B" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M 35 -110 C 37 -80, 34 -55, 36 -28" stroke="#7F1D1D" strokeWidth="2" fill="none" opacity="0.75" />
      <path d="M 85 -110 C 88 -85, 92 -65, 90 -35" stroke="#991B1B" strokeWidth="2.5" fill="none" opacity="0.8" />

      {/* 4. Flared Rolled Rim & Slipper Headrest */}
      {/* High-back sloped left headrest */}
      <path
        d="M -155 -142 C -155 -125, -135 -118, -120 -118 L 138 -118 C 148 -118, 154 -122, 148 -130 C 142 -136, 120 -134, 110 -134 L -110 -134 C -135 -134, -155 -152, -155 -142 Z"
        fill="#334155"
        stroke="#0F172A"
        strokeWidth="1.5"
      />
      {/* Rim top highlight */}
      <line x1="-120" y1="-120" x2="135" y2="-120" stroke="#64748B" strokeWidth="2" />

      {/* 5. Tub Basin Cavity & Murky Blood Water */}
      <ellipse cx="0" cy="-115" rx="125" ry="16" fill="#04060A" />
      {/* Murky Water Surface */}
      <ellipse cx="0" cy="-112" rx="120" ry="13" fill="url(#bathtub-water-grad)" opacity="0.9" />

      {/* Floating wet hair strands on the water surface */}
      <path
        d="M -45 -112 Q -25 -109 -10 -112 Q 10 -115 30 -112 Q 50 -109 70 -113"
        stroke="#020305"
        strokeWidth="2.2"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M -30 -110 Q -10 -107 10 -110 Q 30 -113 45 -110"
        stroke="#020305"
        strokeWidth="1.5"
        fill="none"
        opacity="0.85"
      />

      {/* Eerie Mist / Vapour wafting off the water */}
      <g opacity="0.5" className="anim-smoke-rise">
        <ellipse cx="-40" cy="-122" rx="30" ry="6" fill="#E2E8F0" opacity="0.25" />
        <ellipse cx="30" cy="-122" rx="35" ry="7" fill="#E2E8F0" opacity="0.2" />
      </g>

      {/* 6. Vintage Brass Gooseneck Faucet & Taps on Right Wall */}
      <g transform="translate(118, -120)">
        {/* Faucet Base Escutcheon Plate */}
        <rect x="-8" y="-5" width="16" height="6" rx="1" fill="#78350F" />
        {/* Curved Gooseneck Spout Pipe */}
        <path
          d="M 0 -5 L 0 -55 C 0 -68, -25 -68, -25 -52 L -25 -45"
          fill="none"
          stroke="#D97706"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 0 -5 L 0 -55 C 0 -68, -25 -68, -25 -52 L -25 -45"
          fill="none"
          stroke="#92400E"
          strokeWidth="2"
        />
        {/* Hot / Cold Cross Handles */}
        <g transform="translate(10, -28)">
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#CBD5E1" strokeWidth="2.5" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="1.5" fill="#DC2626" />
        </g>
        <g transform="translate(-10, -28)">
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#CBD5E1" strokeWidth="2.5" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="1.5" fill="#2563EB" />
        </g>

        {/* Dripping Blood Drops from Spout */}
        <circle cx="-25" cy="-42" r="2.2" fill="#DC2626" className="anim-pulse-eerie" />
        <line x1="-25" y1="-40" x2="-25" y2="-25" stroke="#991B1B" strokeWidth="1" strokeDasharray="3,3" />
        <circle cx="-25" cy="-22" r="1.8" fill="#DC2626" />
      </g>
    </g>
  );
};

/**
 * 16. MARKET STALL & ANTIQUE TENT (Quầy hàng / Lều bạt chợ đêm)
 * Ground anchor: [0, 0] at bottom-center (Y=800px)
 */
const MarketStallTent: React.FC = () => {
  return (
    <g className="structure-market-stall-tent">
      {/* 1. Heavy Metal Frame Leg Uprights anchored on ground */}
      <line x1="-140" y1="0" x2="-125" y2="-180" stroke="#1E293B" strokeWidth="4" />
      <line x1="140" y1="0" x2="125" y2="-180" stroke="#1E293B" strokeWidth="4" />
      <line x1="-95" y1="0" x2="-85" y2="-180" stroke="#0F172A" strokeWidth="3" />
      <line x1="95" y1="0" x2="85" y2="-180" stroke="#0F172A" strokeWidth="3" />

      {/* Frame Diagonal Cross Braces */}
      <line x1="-140" y1="0" x2="-85" y2="-180" stroke="#111827" strokeWidth="1.8" />
      <line x1="140" y1="0" x2="85" y2="-180" stroke="#111827" strokeWidth="1.8" />
      <line x1="-125" y1="-180" x2="125" y2="-180" stroke="#1E293B" strokeWidth="3" />

      {/* 2. Roof Canopy Structure (A-Frame Tent Peak at Y = -275) */}
      {/* Back interior canopy shadow */}
      <polygon points="0,-275 -155,-175 155,-175" fill="#05070B" />

      {/* Hanging Warm Overhead Bulb & Wire underneath canopy */}
      <line x1="0" y1="-275" x2="0" y2="-205" stroke="#0A0E17" strokeWidth="2" />
      <rect x="-3" y="-205" width="6" height="6" rx="1" fill="#1E293B" />
      {/* Warm Ambient Glow Cone */}
      <circle cx="0" cy="-195" r="65" fill="url(#tent-warm-lantern)" opacity="0.8" />
      <circle cx="0" cy="-195" r="7" fill="#FEF08A" className="anim-flicker-ember" />
      {/* Wire protective cage around bulb */}
      <path d="M -7 -200 L 0 -185 L 7 -200" fill="none" stroke="#475569" strokeWidth="1.2" />

      {/* Front Outer Canopy Fabric Panels */}
      <polygon points="0,-275 -160,-175 -75,-175" fill="#0A0F1D" stroke="#1E293B" strokeWidth="1.5" />
      <polygon points="0,-275 -75,-175 0,-175" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
      <polygon points="0,-275 0,-175 75,-175" fill="#0B1322" stroke="#1E293B" strokeWidth="1.5" />
      <polygon points="0,-275 75,-175 160,-175" fill="#090E1A" stroke="#1E293B" strokeWidth="1.5" />
      {/* Center Ridge Seam Pipe */}
      <line x1="0" y1="-275" x2="0" y2="-175" stroke="#334155" strokeWidth="2.5" />

      {/* Wavy Torn Scalloped Valance / Fringe (Rèm bạt rách mép tua rua) */}
      <path
        d="M -160 -175 Q -145 -160 -130 -175 Q -115 -158 -100 -175 Q -85 -162 -70 -175 Q -55 -159 -40 -175 Q -25 -163 -10 -175 Q 5 -160 20 -175 Q 35 -162 50 -175 Q 65 -160 80 -175 Q 95 -164 110 -175 Q 125 -158 140 -175 Q 150 -162 160 -175 L 160 -178 L -160 -178 Z"
        fill="#080C16"
        stroke="#1E293B"
        strokeWidth="1.2"
      />

      {/* 3. Antique Counter Table (Mặt bàn gỗ bày đồ cổ) */}
      {/* Wooden X-Trestle Table Legs touching Ground Y = 0 */}
      <line x1="-115" y1="0" x2="-80" y2="-90" stroke="#1C1917" strokeWidth="6" />
      <line x1="-80" y1="0" x2="-115" y2="-90" stroke="#1C1917" strokeWidth="6" />
      <line x1="115" y1="0" x2="80" y2="-90" stroke="#1C1917" strokeWidth="6" />
      <line x1="80" y1="0" x2="115" y2="-90" stroke="#1C1917" strokeWidth="6" />
      <line x1="-120" y1="0" x2="120" y2="0" stroke="#0C0A09" strokeWidth="3" />

      {/* Deep Red Torn Felt Runner Cloth hanging off counter */}
      <polygon
        points="-120,-85 120,-85 110,-42 90,-48 70,-40 40,-52 0,-44 -40,-50 -70,-42 -100,-48 -115,-40"
        fill="#450A0A"
        stroke="#7F1D1D"
        strokeWidth="1"
      />
      {/* Stained streaks on cloth */}
      <line x1="-30" y1="-85" x2="-28" y2="-45" stroke="#1F0404" strokeWidth="4" />
      <line x1="45" y1="-85" x2="47" y2="-42" stroke="#1F0404" strokeWidth="3" />

      {/* Solid Wooden Tabletop Plank */}
      <rect x="-132" y="-95" width="264" height="12" rx="2" fill="#1C1917" stroke="#292524" strokeWidth="2" />
      <line x1="-130" y1="-92" x2="130" y2="-92" stroke="#44403C" strokeWidth="1.5" />

      {/* 4. Antiques, Relics & Curious Objects on Table */}
      {/* Antique 1: Ancient Cracked Ceramic Urn (Left) */}
      <g transform="translate(-85, -95)">
        <path d="M -12 0 L -16 -24 Q -22 -38 0 -42 Q 22 -38 16 -24 L 12 0 Z" fill="#0A0E17" stroke="#1E293B" strokeWidth="1.5" />
        <ellipse cx="0" cy="-42" rx="10" ry="3" fill="#05070B" stroke="#334155" strokeWidth="1" />
        {/* Crack zig-zag */}
        <path d="M -4 -38 L 2 -26 L -3 -15 L 4 0" fill="none" stroke="#DC2626" strokeWidth="1" />
      </g>

      {/* Antique 2: Stack of Old Manuscripts & Occult Scrolls (Center-Left) */}
      <g transform="translate(-35, -95)">
        <rect x="-18" y="-8" width="36" height="8" rx="1" fill="#78350F" stroke="#451A03" strokeWidth="1" />
        <rect x="-16" y="-15" width="32" height="7" rx="1" fill="#92400E" stroke="#78350F" strokeWidth="1" />
        <rect x="-15" y="-22" width="30" height="7" rx="1" fill="#B45309" stroke="#92400E" strokeWidth="1" />
        {/* Tied hemp string */}
        <line x1="0" y1="-23" x2="0" y2="0" stroke="#FDE68A" strokeWidth="1.5" />
      </g>

      {/* Antique 3: Cursed Ornate Wooden Relic Box ajar with Eerie Glow (Center-Right) */}
      <g transform="translate(35, -95)">
        {/* Box Base */}
        <rect x="-18" y="-22" width="36" height="22" rx="2" fill="#0A0A0C" stroke="#78350F" strokeWidth="1.5" />
        {/* Eerie internal red glow escaping ajar lid */}
        <ellipse cx="0" cy="-22" rx="14" ry="5" fill="#DC2626" className="anim-pulse-eerie" />
        {/* Tilted Open Lid */}
        <polygon points="-19,-22 19,-28 17,-33 -21,-27" fill="#1C1917" stroke="#92400E" strokeWidth="1.5" />
        {/* Metal lock hasp */}
        <rect x="-2" y="-18" width="4" height="8" fill="#D4AF37" />
      </g>

      {/* Antique 4: Calling Bell / Ritual Tam Thanh Bell (Right) */}
      <g transform="translate(85, -95)">
        <path d="M -8 0 Q -10 -15 0 -22 Q 10 -15 8 0 Z" fill="#78350F" stroke="#B45309" strokeWidth="1.5" />
        <circle cx="0" cy="-24" r="3.5" fill="#D4AF37" />
        <circle cx="0" cy="0" r="2" fill="#FACC15" />
      </g>

      {/* 5. Hanging Wooden Placard Sign: "ĐỒ CỔ / 古玩" */}
      <g transform="translate(0, -145)">
        {/* Hanging ropes from canopy frame */}
        <line x1="-28" y1="-30" x2="-28" y2="0" stroke="#78350F" strokeWidth="1.5" />
        <line x1="28" y1="-30" x2="28" y2="0" stroke="#78350F" strokeWidth="1.5" />
        {/* Wooden board */}
        <rect x="-35" y="0" width="70" height="25" rx="3" fill="#0B0908" stroke="#44403C" strokeWidth="1.5" />
        <text
          x="0"
          y="16"
          textAnchor="middle"
          fill="#D4AF37"
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          TIỆM ĐỒ CỔ
        </text>
      </g>

      {/* 6. Ground Storage Crates & Burlap Sacks at foot */}
      {/* Heavy Weathered Wooden Crate on Left */}
      <g transform="translate(-135, 0)">
        <rect x="-22" y="-34" width="44" height="34" fill="#14110E" stroke="#292524" strokeWidth="1.5" />
        <line x1="-22" y1="-34" x2="22" y2="0" stroke="#292524" strokeWidth="1.5" />
        <line x1="-22" y1="0" x2="22" y2="-34" stroke="#292524" strokeWidth="1.5" />
        <rect x="-20" y="-32" width="40" height="4" fill="#292524" opacity="0.6" />
      </g>

      {/* Slumped Burlap Sack on Right */}
      <g transform="translate(130, 0)">
        <ellipse cx="0" cy="-15" rx="20" ry="15" fill="#1C140E" stroke="#451A03" strokeWidth="1.5" />
        <polygon points="-8,-28 8,-28 0,-34" fill="#2E1B0F" />
        <circle cx="0" cy="-27" r="2.5" fill="#78350F" />
      </g>
    </g>
  );
};

/**
 * 17. ABANDONED SUBWAY STATION ENTRANCE (Cổng vào & Ga tàu điện ngầm bỏ hoang)
 * Ground anchor: [0, 0] at bottom-center (Y=800px)
 */
const AbandonedSubwayStation: React.FC = () => {
  return (
    <g className="structure-abandoned-subway-station">
      {/* 1. Deep Subterranean Chasm / Pitch Darkness Stair Void */}
      <rect x="-140" y="-220" width="280" height="220" fill="url(#subway-tunnel-depth)" />

      {/* 2. Concrete Stairwell Receding into Abyss (7 Perspective Steps) */}
      {[
        { y: 0, w: 240, h: 12 },
        { y: -16, w: 224, h: 11 },
        { y: -32, w: 208, h: 10 },
        { y: -48, w: 192, h: 9 },
        { y: -64, w: 176, h: 8 },
        { y: -80, w: 160, h: 8 },
        { y: -96, w: 144, h: 7 },
      ].map((step, idx) => (
        <g key={idx}>
          {/* Step Riser (Vertical face) */}
          <rect
            x={-step.w / 2}
            y={step.y - step.h}
            width={step.w}
            height={step.h}
            fill="#090E17"
            stroke="#1E293B"
            strokeWidth="1"
          />
          {/* Step Tread Highlight (Horizontal top tread) */}
          <line
            x1={-step.w / 2}
            y1={step.y - step.h}
            x2={step.w / 2}
            y2={step.y - step.h}
            stroke="#334155"
            strokeWidth="1.5"
          />
        </g>
      ))}

      {/* Slime & Blood Runoff dripping down the center of steps */}
      <path
        d="M -15 -110 Q 5 -80 -8 -50 Q 12 -20 -4 0"
        fill="none"
        stroke="#7F1D1D"
        strokeWidth="4"
        opacity="0.8"
      />
      <circle cx="-4" cy="0" r="3" fill="#DC2626" />

      {/* 3. Tiled Subway Flank Walls (Left and Right retaining walls) */}
      {/* Left Wall */}
      <polygon points="-190,0 -130,-120 -130,-240 -190,-240" fill="#070A12" stroke="#1E293B" strokeWidth="2" />
      {/* Right Wall */}
      <polygon points="190,0 130,-120 130,-240 190,-240" fill="#070A12" stroke="#1E293B" strokeWidth="2" />
      {/* Subway Tile Grooves on Walls */}
      <line x1="-180" y1="-60" x2="-140" y2="-60" stroke="#151E2E" strokeWidth="1" />
      <line x1="-180" y1="-120" x2="-130" y2="-120" stroke="#151E2E" strokeWidth="1" />
      <line x1="-180" y1="-180" x2="-130" y2="-180" stroke="#151E2E" strokeWidth="1" />
      <line x1="180" y1="-60" x2="140" y2="-60" stroke="#151E2E" strokeWidth="1" />
      <line x1="180" y1="-120" x2="130" y2="-120" stroke="#151E2E" strokeWidth="1" />
      <line x1="180" y1="-180" x2="130" y2="-180" stroke="#151E2E" strokeWidth="1" />

      {/* Cryptic Bloody Graffiti on Left Wall */}
      <text
        x="-165"
        y="-140"
        fill="#991B1B"
        fontSize="12"
        fontWeight="bold"
        fontFamily="sans-serif"
        transform="rotate(-25, -165, -140)"
        opacity="0.85"
      >
        CẤM VÀO
      </text>

      {/* 4. Heavy Industrial Iron Railing (Lan can sắt rỉ sét hai bên) */}
      {/* Left Railing */}
      <g className="subway-railing-left">
        <line x1="-155" y1="0" x2="-155" y2="-210" stroke="#0F172A" strokeWidth="5" />
        <line x1="-135" y1="0" x2="-135" y2="-120" stroke="#0F172A" strokeWidth="4" />
        <line x1="-170" y1="0" x2="-170" y2="-160" stroke="#0F172A" strokeWidth="4" />
        <line x1="-175" y1="-160" x2="-135" y2="-120" stroke="#334155" strokeWidth="4" />
        {/* Baluster vertical bars */}
        {[-165, -155, -145].map((bx, i) => (
          <line key={i} x1={bx} y1="-10" x2={bx} y2="-135" stroke="#1E293B" strokeWidth="2" />
        ))}
      </g>

      {/* Right Railing */}
      <g className="subway-railing-right">
        <line x1="155" y1="0" x2="155" y2="-210" stroke="#0F172A" strokeWidth="5" />
        <line x1="135" y1="0" x2="135" y2="-120" stroke="#0F172A" strokeWidth="4" />
        <line x1="170" y1="0" x2="170" y2="-160" stroke="#0F172A" strokeWidth="4" />
        <line x1="175" y1="-160" x2="135" y2="-120" stroke="#334155" strokeWidth="4" />
        {[145, 155, 165].map((bx, i) => (
          <line key={i} x1={bx} y1="-10" x2={bx} y2="-135" stroke="#1E293B" strokeWidth="2" />
        ))}
      </g>

      {/* 5. Wrought-Iron Entrance Pylons with Glowing Globe Lanterns */}
      {/* Left Pylon & Globe */}
      <g transform="translate(-155, -210)">
        <rect x="-8" y="0" width="16" height="28" rx="2" fill="#0A0E17" stroke="#1E293B" strokeWidth="1.5" />
        {/* Brass collar */}
        <circle cx="0" cy="-4" r="7" fill="#1E293B" />
        {/* Glowing Spherical Glass Globe */}
        <circle cx="0" cy="-22" r="18" fill="url(#urban-neon-cyan)" opacity="0.8" />
        <circle cx="0" cy="-22" r="16" fill="#A5F3FC" opacity="0.9" className="anim-pulse-eerie" />
        {/* Cracked glass fissure */}
        <path d="M -6 -28 L 2 -20 L -3 -12 L 4 -7" fill="none" stroke="#083344" strokeWidth="1.5" />
        {/* Metal finial cap */}
        <polygon points="-6,-38 6,-38 0,-46" fill="#0F172A" stroke="#334155" strokeWidth="1" />
      </g>

      {/* Right Pylon & Globe (Flickering / Damaged) */}
      <g transform="translate(155, -210)">
        <rect x="-8" y="0" width="16" height="28" rx="2" fill="#0A0E17" stroke="#1E293B" strokeWidth="1.5" />
        <circle cx="0" cy="-4" r="7" fill="#1E293B" />
        <circle cx="0" cy="-22" r="18" fill="url(#urban-neon-cyan)" opacity="0.4" className="anim-flicker-fast" />
        <circle cx="0" cy="-22" r="16" fill="#67E8F9" opacity="0.5" className="anim-flicker-fast" />
        <polygon points="-6,-38 6,-38 0,-46" fill="#0F172A" stroke="#334155" strokeWidth="1" />
      </g>

      {/* 6. Grand Overhead Entrance Arch & Illuminated Signboard */}
      {/* Arch Bridge Beam between pylons */}
      <path
        d="M -155 -230 C -155 -320, 155 -320, 155 -230"
        fill="none"
        stroke="#0B0F19"
        strokeWidth="10"
      />
      <path
        d="M -155 -230 C -155 -320, 155 -320, 155 -230"
        fill="none"
        stroke="#334155"
        strokeWidth="3"
      />

      {/* Illuminated Station Signboard (Y = -310 to -260) */}
      <g transform="translate(0, -290)">
        {/* Sign Metal Box */}
        <rect x="-115" y="-22" width="230" height="44" rx="4" fill="#05070B" stroke="#334155" strokeWidth="2.5" />
        {/* Background Acrylic Glow */}
        <rect x="-108" y="-16" width="216" height="32" rx="2" fill="url(#urban-neon-cyan)" opacity="0.25" />
        <rect x="-108" y="-16" width="216" height="32" rx="2" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.7" />
        {/* Metro Roundel Symbol */}
        <circle cx="-85" cy="0" r="11" fill="#DC2626" />
        <text x="-85" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">M</text>
        {/* Station Name Typography */}
        <text
          x="12"
          y="5"
          textAnchor="middle"
          fill="#E2E8F0"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="2"
          className="anim-flicker-ember"
        >
          SUBWAY / GA NGẦM
        </text>
        {/* Shattered acrylic fracture on right of sign */}
        <path d="M 75 -16 L 85 4 L 98 -6 L 108 16" fill="none" stroke="#083344" strokeWidth="1.8" />
      </g>

      {/* 7. Torn Yellow Hazard / Police Caution Tape fluttering across entrance */}
      <g className="subway-caution-tape">
        {/* Left piece */}
        <path
          d="M -155 -150 Q -90 -125 -30 -130"
          fill="none"
          stroke="#EAB308"
          strokeWidth="6"
        />
        <path
          d="M -155 -150 Q -90 -125 -30 -130"
          fill="none"
          stroke="#000000"
          strokeWidth="6"
          strokeDasharray="14,12"
        />
        {/* Right piece hanging down */}
        <path
          d="M 155 -150 Q 80 -120 20 -70"
          fill="none"
          stroke="#EAB308"
          strokeWidth="6"
        />
        <path
          d="M 155 -150 Q 80 -120 20 -70"
          fill="none"
          stroke="#000000"
          strokeWidth="6"
          strokeDasharray="14,12"
        />
      </g>

      {/* 8. Dangling Padlock & Broken Iron Chain on Railing */}
      <g transform="translate(-135, -120)">
        <circle cx="0" cy="8" r="4" fill="none" stroke="#64748B" strokeWidth="2" />
        <circle cx="0" cy="16" r="4" fill="none" stroke="#64748B" strokeWidth="2" />
        <rect x="-5" y="20" width="10" height="12" rx="1.5" fill="#78350F" stroke="#451A03" strokeWidth="1" />
      </g>
    </g>
  );
};

/**
 * 18. RUSTY TRAIN TRACKS & TUNNEL VAULT (Đường ray tàu & Đường hầm rỉ sét ẩm mốc)
 * Ground anchor: [0, 0] at bottom-center (Y=800px)
 */
const RustyTrainTracksTunnel: React.FC = () => {
  return (
    <g className="structure-rusty-train-tracks-tunnel">
      {/* 1. Deep Vanishing-Point Pitch Blackness Tunnel Interior */}
      <path
        d="M -190 0 L -190 -220 C -190 -370, 190 -370, 190 -220 L 190 0 Z"
        fill="url(#subway-tunnel-depth)"
      />

      {/* Concentric Receding Inner Arch Rings (Perspective Tunnel Depth) */}
      {/* Ring 2 (Mid-distance) */}
      <path
        d="M -140 0 L -140 -170 C -140 -280, 140 -280, 140 -170 L 140 0 Z"
        fill="#04060A"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      {/* Ring 3 (Deep-distance) */}
      <path
        d="M -90 0 L -90 -120 C -90 -200, 90 -200, 90 -120 L 90 0 Z"
        fill="#010204"
        stroke="#151E2E"
        strokeWidth="2"
      />
      {/* Deepest Abyss Tunnel Center */}
      <ellipse cx="0" cy="-100" rx="45" ry="55" fill="#000000" />

      {/* 2. Massive Concrete Outer Tunnel Vault (Front Arch Ring) */}
      <path
        d="M -210 0 L -210 -230 C -210 -385, 210 -385, 210 -230 L 210 0 L 180 0 L 180 -225 C 180 -355, -180 -355, -180 -225 L -180 0 Z"
        fill="#080C14"
        stroke="#1E293B"
        strokeWidth="3"
      />

      {/* Concrete Arch Keystone & Radial Segment Seams */}
      <g stroke="#1E293B" strokeWidth="2" opacity="0.65">
        <line x1="0" y1="-385" x2="0" y2="-355" />
        <line x1="-80" y1="-375" x2="-68" y2="-348" />
        <line x1="80" y1="-375" x2="68" y2="-348" />
        <line x1="-155" y1="-340" x2="-135" y2="-320" />
        <line x1="155" y1="-340" x2="135" y2="-320" />
        <line x1="-200" y1="-280" x2="-175" y2="-270" />
        <line x1="200" y1="-280" x2="175" y2="-270" />
      </g>

      {/* 3. Ballast Crushed Rock Bed along the floor */}
      <g fill="#0B101D" opacity="0.8">
        {[-160, -130, -100, -70, -40, -10, 20, 50, 80, 110, 140, 160].map((rx, idx) => (
          <ellipse key={idx} cx={rx} cy={-2} rx={14} ry={6} />
        ))}
      </g>

      {/* 4. Wooden Railway Ties (Thanh tà vẹt gỗ mục nát) */}
      {[
        { y: 0, w: 220, h: 10 },
        { y: -22, w: 180, h: 9 },
        { y: -48, w: 145, h: 8 },
        { y: -76, w: 115, h: 7 },
        { y: -106, w: 88, h: 6 },
        { y: -138, w: 66, h: 5 },
        { y: -170, w: 48, h: 4 },
      ].map((tie, idx) => (
        <g key={idx}>
          {/* Wooden Tie Beam */}
          <rect
            x={-tie.w / 2}
            y={tie.y - tie.h}
            width={tie.w}
            height={tie.h}
            rx={1}
            fill="#1C140E"
            stroke="#29180C"
            strokeWidth="1.5"
          />
          {/* Metal Tie Tie-Plates */}
          <rect x={-tie.w / 2 + 15} y={tie.y - tie.h - 1} width={8} height={tie.h + 2} fill="#451A03" />
          <rect x={tie.w / 2 - 23} y={tie.y - tie.h - 1} width={8} height={tie.h + 2} fill="#451A03" />
        </g>
      ))}

      {/* 5. Two Heavy Rusty Steel Rails (Hai thanh ray rỉ sét) */}
      {/* Left Steel Rail: Converging into distance */}
      {/* Rail Shadow Base */}
      <path d="M -98 0 L -20 -185 L -16 -185 L -92 0 Z" fill="#2E1005" />
      {/* Rail Steel Crown with Rusty Orange-Amber Metallic Glint */}
      <path
        d="M -94 0 L -18 -185"
        stroke="#B45309"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M -94 0 L -18 -185"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Right Steel Rail: Converging into distance */}
      {/* Rail Shadow Base */}
      <path d="M 92 0 L 16 -185 L 20 -185 L 98 0 Z" fill="#2E1005" />
      {/* Rail Steel Crown */}
      <path
        d="M 94 0 L 18 -185"
        stroke="#B45309"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 94 0 L 18 -185"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Stagnant Murky Water Puddle between rails */}
      <ellipse cx="0" cy="-35" rx="38" ry="10" fill="#0A0605" stroke="#78350F" strokeWidth="1" opacity="0.8" />
      {/* Red reflection on puddle from signal light */}
      <ellipse cx="8" cy="-35" rx="14" ry="4" fill="#DC2626" opacity="0.45" />

      {/* 6. High-Voltage Overhead Tunnel Cables & Wires */}
      <path
        d="M -180 -250 Q -100 -310 0 -315 Q 100 -310 180 -250"
        fill="none"
        stroke="#060910"
        strokeWidth="5"
      />
      <path
        d="M -180 -220 Q -90 -280 0 -285 Q 90 -280 180 -220"
        fill="none"
        stroke="#0B101D"
        strokeWidth="3.5"
      />
      {/* Severed dangling loose cable on ceiling */}
      <path
        d="M -40 -312 Q -25 -270 -35 -240 Q -45 -215 -38 -195"
        fill="none"
        stroke="#0F172A"
        strokeWidth="2.5"
      />
      <circle cx="-38" cy="-195" r="2" fill="#38BDF8" className="anim-flicker-fast" />

      {/* 7. Drainage Pipe on Left Wall with Dripping Water Droplets */}
      <g transform="translate(-178, -120)">
        <rect x="-8" y="-120" width="16" height="180" fill="#0E1626" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="-11" y="-80" width="22" height="8" rx="1" fill="#334155" />
        <rect x="-11" y="-20" width="22" height="8" rx="1" fill="#334155" />
        <path d="M 0 60 Q 15 70 25 75" fill="none" stroke="#0E1626" strokeWidth="6" />
        {/* Dripping Water droplets */}
        <circle cx="25" cy="85" r="2.2" fill="#38BDF8" className="anim-pulse-eerie" />
        <circle cx="25" cy="105" r="1.8" fill="#38BDF8" opacity="0.6" />
      </g>

      {/* 8. Railway Signal Lantern on Right Tunnel Wall (Red Warning Eye) */}
      <g transform="translate(160, -220)">
        {/* Wall Mounting Bracket */}
        <line x1="-15" y1="0" x2="0" y2="0" stroke="#334155" strokeWidth="3" />
        <line x1="-15" y1="20" x2="0" y2="0" stroke="#334155" strokeWidth="2" />
        {/* Signal Steel Casing */}
        <rect x="0" y="-22" width="24" height="44" rx="4" fill="#060910" stroke="#1E293B" strokeWidth="2" />
        {/* Protective Sun Hood over top lens */}
        <path d="M 0 -10 Q 12 -22 24 -10" fill="none" stroke="#334155" strokeWidth="3" />
        {/* Red Glowing Bullseye Signal Lens */}
        <circle cx="12" cy="-5" r="8" fill="#DC2626" className="anim-pulse-eerie" />
        <circle cx="12" cy="-5" r="22" fill="url(#blood-moon-glow-radial)" opacity="0.65" />
        {/* Lower Unlit Amber Lens */}
        <circle cx="12" cy="12" r="5" fill="#451A03" stroke="#78350F" strokeWidth="1" />
      </g>
    </g>
  );
};

/**
 * 19. OLD APARTMENT GATE (Cổng Sắt Chung Cư Cũ)
 * Architecture: Rusty folding iron gate of a decaying Soviet-era / vintage apartment block
 * Features:
 * - Looming multi-story apartment block silhouette with "chuồng cọp" rebar cages, water tank & antenna
 * - Faint flickering yellow window with dark shadowy onlooker
 * - Weathered cracked concrete pillars with pyramid caps and broken-glass boundary wall
 * - Heavy decorative wrought-iron arch with swinging rusted sign: "CHUNG CƯ CŨ"
 * - Massive rusty iron gate bars with sharp spearheads, diagonal braces, heavy padlock & iron chains
 * - Vintage round wall lamp with flickering amber glow on concrete post
 * - Cracked ground apron, mud puddles and creeping weeds
 */
const OldApartmentGate: React.FC = () => {
  return (
    <g className="old-apartment-gate">
      {/* 1. Background Apartment Block Silhouette (Khối nhà tập thể/chung cư cũ phía sau) */}
      <g className="apartment-background" opacity="0.95">
        {/* Main block building shape */}
        <polygon
          points="-210,-100 -210,-430 -170,-430 -170,-450 -30,-450 -30,-440 60,-440 60,-465 160,-465 160,-420 210,-420 210,-100"
          fill="#080B10"
        />
        {/* Rooftop Water Tank (Bồn nước inox/bê tông trên nóc) */}
        <g transform="translate(85, -485)">
          <rect x="-16" y="0" width="32" height="20" rx="3" fill="#141B26" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="-12" y1="20" x2="-14" y2="28" stroke="#1E293B" strokeWidth="2" />
          <line x1="12" y1="20" x2="14" y2="28" stroke="#1E293B" strokeWidth="2" />
          <line x1="-16" y1="6" x2="16" y2="6" stroke="#0B0F17" strokeWidth="1.5" />
          <line x1="-16" y1="13" x2="16" y2="13" stroke="#0B0F17" strokeWidth="1.5" />
        </g>
        {/* Rooftop TV Antenna Rods & Guy Wires */}
        <line x1="-120" y1="-450" x2="-120" y2="-495" stroke="#1E293B" strokeWidth="2" />
        <line x1="-132" y1="-485" x2="-108" y2="-485" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="-128" y1="-475" x2="-112" y2="-475" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="-120" y1="-495" x2="-150" y2="-450" stroke="#0F172A" strokeWidth="1" strokeDasharray="2,2" />

        {/* Windows & Balconies Grid on Upper Floors */}
        {/* Top Floor Windows */}
        <rect x="-145" y="-420" width="22" height="26" fill="#040608" stroke="#141B26" strokeWidth="1" />
        <rect x="-85" y="-420" width="22" height="26" fill="#040608" stroke="#141B26" strokeWidth="1" />
        {/* One mysterious lit window on 3rd floor */}
        <rect x="0" y="-415" width="24" height="28" fill="#FEF08A" opacity="0.35" className="anim-flicker-ember" />
        <rect x="0" y="-415" width="24" height="28" fill="none" stroke="#78350F" strokeWidth="1.5" />
        {/* Shadowy silhouette of person peering down inside window */}
        <ellipse cx="12" cy="-400" rx="4" ry="5.5" fill="#080B10" />
        <path d="M 6 -390 Q 12 -395 18 -390 L 20 -387 L 4 -387 Z" fill="#080B10" />

        <rect x="85" y="-410" width="22" height="26" fill="#040608" stroke="#141B26" strokeWidth="1" />

        {/* 2nd Tier Balcony "Chuồng cọp" (Rebar Cage Balcony Extension) */}
        <g transform="translate(-130, -370)">
          {/* Protruding cage concrete base */}
          <rect x="-24" y="0" width="48" height="6" fill="#141B26" />
          {/* Iron cage frame */}
          <rect x="-22" y="-32" width="44" height="32" fill="#06090E" stroke="#1E293B" strokeWidth="1.5" />
          {/* Vertical rebar grilles */}
          <line x1="-14" y1="-32" x2="-14" y2="0" stroke="#1E293B" strokeWidth="1" />
          <line x1="-6" y1="-32" x2="-6" y2="0" stroke="#1E293B" strokeWidth="1" />
          <line x1="2" y1="-32" x2="2" y2="0" stroke="#1E293B" strokeWidth="1" />
          <line x1="10" y1="-32" x2="10" y2="0" stroke="#1E293B" strokeWidth="1" />
          <line x1="18" y1="-32" x2="18" y2="0" stroke="#1E293B" strokeWidth="1" />
          {/* Diagonal corrugated roof sheet */}
          <line x1="-24" y1="-33" x2="24" y2="-36" stroke="#334155" strokeWidth="2" />
          {/* Tattered hanging cloth on cage */}
          <path d="M -8 -8 Q -5 4 -3 -8" stroke="#475569" strokeWidth="1.5" fill="none" />
        </g>

        {/* Another Chuồng cọp on right side */}
        <g transform="translate(110, -355)">
          <rect x="-20" y="0" width="40" height="5" fill="#141B26" />
          <rect x="-18" y="-30" width="36" height="30" fill="#06090E" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="-10" y1="-30" x2="-10" y2="0" stroke="#1E293B" strokeWidth="1" />
          <line x1="-2" y1="-30" x2="-2" y2="0" stroke="#1E293B" strokeWidth="1" />
          <line x1="6" y1="-30" x2="6" y2="0" stroke="#1E293B" strokeWidth="1" />
          <line x1="14" y1="-30" x2="14" y2="0" stroke="#1E293B" strokeWidth="1" />
          {/* Slanted awning */}
          <line x1="-20" y1="-31" x2="20" y2="-34" stroke="#334155" strokeWidth="2" />
        </g>

        {/* Tangled overhead electrical bundle (Búi dây điện chằng chịt đặc trưng khu tập thể) */}
        <path d="M -230 -370 Q -80 -325 0 -330 Q 100 -325 230 -375" fill="none" stroke="#05080E" strokeWidth="3" />
        <path d="M -230 -360 Q -100 -315 -20 -318 Q 80 -315 230 -362" fill="none" stroke="#090E17" strokeWidth="2" />
        <path d="M -150 -325 Q -100 -270 -60 -265 Q -20 -270 20 -320" fill="none" stroke="#06090F" strokeWidth="1.5" />
        {/* Power meter box on building wall */}
        <rect x="-182" y="-335" width="22" height="32" rx="2" fill="#0C121C" stroke="#1E293B" strokeWidth="1.5" />
        <circle cx="-171" cy="-325" r="4" fill="#05080E" stroke="#334155" strokeWidth="1" />
        <circle cx="-171" cy="-325" r="1.5" fill="#EF4444" className="anim-pulse-eerie" />
      </g>

      {/* 2. Decaying Concrete Pillars & Perimeter Brick Walls (Hai cột trụ & tường bao rêu phong) */}
      <g className="concrete-pillars-walls">
        {/* Left Perimeter Wall */}
        <path
          d="M -230 0 L -230 -210 L -155 -210 L -155 0 Z"
          fill="#0D1117"
          stroke="#161F2E"
          strokeWidth="1.5"
        />
        {/* Broken glass shards & jagged top on left wall */}
        <path
          d="M -230 -210 L -225 -218 L -220 -210 L -212 -222 L -205 -210 L -195 -219 L -188 -210 L -180 -223 L -170 -210 L -162 -220 L -155 -210"
          stroke="#334155"
          strokeWidth="2"
          fill="#1E293B"
        />
        {/* Wall cracks and peeled plaster */}
        <path d="M -210 -180 L -195 -150 L -202 -120 L -185 -90" stroke="#06090E" strokeWidth="1.5" fill="none" />
        <path d="M -175 -160 L -165 -130 L -170 -100" stroke="#06090E" strokeWidth="1" fill="none" />

        {/* Right Perimeter Wall */}
        <path
          d="M 155 0 L 155 -210 L 230 -210 L 230 0 Z"
          fill="#0D1117"
          stroke="#161F2E"
          strokeWidth="1.5"
        />
        {/* Broken glass shards & rusted barbwire on right wall */}
        <path
          d="M 155 -210 L 163 -220 L 170 -210 L 180 -224 L 190 -210 L 198 -219 L 208 -210 L 216 -222 L 225 -210 L 230 -217"
          stroke="#334155"
          strokeWidth="2"
          fill="#1E293B"
        />
        <path d="M 185 -190 L 175 -160 L 182 -130 L 170 -85" stroke="#06090E" strokeWidth="1.5" fill="none" />

        {/* Left Massive Concrete Pillar (Trụ cổng bên trái) */}
        {/* Main Pillar Shaft */}
        <rect x="-155" y="-310" width="50" height="310" fill="#111722" stroke="#1E293B" strokeWidth="2" />
        {/* Stepped Pillar Cap (Chóp đỉnh trụ) */}
        <polygon points="-160,-310 -100,-310 -105,-325 -155,-325" fill="#182232" stroke="#253346" strokeWidth="1.5" />
        <polygon points="-155,-325 -105,-325 -130,-340" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
        {/* Pillar base plinth */}
        <rect x="-160" y="-25" width="60" height="25" fill="#0C1017" stroke="#1A2332" strokeWidth="1.5" />
        {/* Dark moss / moisture stains on pillar base */}
        <path d="M -155 0 C -150 -45 -145 -70 -148 -90 L -120 -90 C -122 -60 -115 -30 -110 0 Z" fill="#080E0B" opacity="0.8" />
        {/* Deep crack on pillar */}
        <path d="M -135 -290 L -125 -250 L -132 -210 L -122 -160 L -130 -110" stroke="#05070B" strokeWidth="2" fill="none" />

        {/* Right Massive Concrete Pillar (Trụ cổng bên phải) */}
        {/* Main Pillar Shaft */}
        <rect x="105" y="-310" width="50" height="310" fill="#111722" stroke="#1E293B" strokeWidth="2" />
        {/* Stepped Pillar Cap */}
        <polygon points="100,-310 160,-310 155,-325 105,-325" fill="#182232" stroke="#253346" strokeWidth="1.5" />
        <polygon points="105,-325 155,-325 130,-340" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
        {/* Pillar base plinth */}
        <rect x="100" y="-25" width="60" height="25" fill="#0C1017" stroke="#1A2332" strokeWidth="1.5" />
        <path d="M 110 0 C 115 -45 120 -65 118 -85 L 148 -85 C 145 -55 152 -30 155 0 Z" fill="#080E0B" opacity="0.8" />
        <path d="M 130 -280 L 140 -240 L 132 -200 L 142 -150 L 135 -110" stroke="#05070B" strokeWidth="2" fill="none" />

        {/* Vintage Bulkhead Wall Lamp on Left Pillar (Bóng đèn chụp sắt tròn cổ quái) */}
        <g transform="translate(-130, -255)">
          {/* Wall bracket pipe */}
          <path d="M 25 0 L 10 0 L 0 -10" fill="none" stroke="#334155" strokeWidth="3" />
          {/* Lamp shade / metal hood */}
          <path d="M -12 -10 Q 0 -16 12 -10 L 10 -4 L -10 -4 Z" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          {/* Glass bulb cage */}
          <rect x="-8" y="-4" width="16" height="18" rx="8" fill="#FEF08A" opacity="0.85" className="anim-flicker-ember" />
          {/* Protective wire cage ribs */}
          <line x1="0" y1="-4" x2="0" y2="14" stroke="#475569" strokeWidth="1" />
          <line x1="-8" y1="4" x2="8" y2="4" stroke="#475569" strokeWidth="1" />
          {/* Warm Amber Glowing Aura */}
          <circle cx="0" cy="5" r="35" fill="url(#lantern-warm-glow)" opacity="0.6" className="anim-flicker-fast" />
          <circle cx="0" cy="5" r="70" fill="url(#urban-neon-amber)" opacity="0.25" />
        </g>

        {/* Rusty Metal Address Plate on Right Pillar (Biển số cư xá cũ gỉ sét) */}
        <g transform="translate(130, -230) rotate(-4)">
          <rect x="-22" y="-14" width="44" height="28" rx="2" fill="#3B1C0B" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="-18" cy="-10" r="1.5" fill="#1E293B" />
          <circle cx="18" cy="-10" r="1.5" fill="#1E293B" />
          <circle cx="-18" cy="10" r="1.5" fill="#1E293B" />
          <circle cx="18" cy="10" r="1.5" fill="#1E293B" />
          {/* Weathered text */}
          <text
            x="0"
            y="-1"
            fill="#FDE047"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
            textAnchor="middle"
            letterSpacing="1"
          >
            CƯ XÁ
          </text>
          <text
            x="0"
            y="9"
            fill="#FEF08A"
            fontSize="10"
            fontWeight="black"
            fontFamily="monospace"
            textAnchor="middle"
          >
            47
          </text>
          {/* Blood/rust streak dripping from plate */}
          <path d="M 8 14 Q 9 26 8 36" stroke="#5C1D06" strokeWidth="1.5" fill="none" />
        </g>
      </g>

      {/* 3. Wrought-Iron Arch & Suspended Header Plate (Vòm sắt uốn & Biển chữ chung cư) */}
      <g className="gate-iron-arch">
        {/* Main Upper Arch Beam */}
        <path
          d="M -130 -325 Q 0 -380 130 -325"
          fill="none"
          stroke="#0F172A"
          strokeWidth="6"
        />
        {/* Secondary Lower Arch Beam */}
        <path
          d="M -125 -315 Q 0 -365 125 -315"
          fill="none"
          stroke="#1E293B"
          strokeWidth="3.5"
        />
        {/* Decorative Spiral Scrolls & Curlicues inside arch */}
        <path
          d="M -90 -325 Q -75 -350 -55 -342 Q -45 -335 -50 -322"
          fill="none"
          stroke="#334155"
          strokeWidth="2"
        />
        <path
          d="M 90 -325 Q 75 -350 55 -342 Q 45 -335 50 -322"
          fill="none"
          stroke="#334155"
          strokeWidth="2"
        />
        <path
          d="M -30 -340 Q 0 -365 30 -340"
          fill="none"
          stroke="#334155"
          strokeWidth="2"
        />
        {/* Top Spire on Center of Arch */}
        <polygon points="0,-380 -5,-368 5,-368" fill="#334155" />
        <circle cx="0" cy="-382" r="3" fill="#475569" />

        {/* Suspended Heavy Metal Header Sign (Biển sắt rỉ treo xích) */}
        <g transform="translate(0, -345)">
          {/* Left hanging chain */}
          <line x1="-50" y1="-8" x2="-50" y2="2" stroke="#475569" strokeWidth="2" strokeDasharray="2,2" />
          {/* Right hanging chain */}
          <line x1="50" y1="-8" x2="50" y2="2" stroke="#475569" strokeWidth="2" strokeDasharray="2,2" />
          {/* Sign board plate (slightly crooked by 1 deg) */}
          <g transform="rotate(1)">
            <rect x="-65" y="2" width="130" height="24" rx="3" fill="#1C140E" stroke="#5C2607" strokeWidth="2" />
            <rect x="-62" y="5" width="124" height="18" fill="none" stroke="#78350F" strokeWidth="1" strokeDasharray="6,2" />
            {/* Rivets in corners */}
            <circle cx="-60" cy="7" r="1.5" fill="#A16207" />
            <circle cx="60" cy="7" r="1.5" fill="#A16207" />
            <circle cx="-60" cy="21" r="1.5" fill="#A16207" />
            <circle cx="60" cy="21" r="1.5" fill="#A16207" />
            {/* Stencil Text: CHUNG CƯ CŨ */}
            <text
              x="0"
              y="18"
              fill="#D97706"
              fontSize="10"
              fontWeight="900"
              fontFamily="sans-serif"
              textAnchor="middle"
              letterSpacing="2.5"
            >
              CHUNG CƯ CŨ
            </text>
            {/* Rust dripping down sign */}
            <path d="M -20 26 Q -19 32 -21 38" stroke="#78350F" strokeWidth="1.2" fill="none" />
            <path d="M 32 26 Q 33 34 31 40" stroke="#78350F" strokeWidth="1.2" fill="none" />
          </g>
        </g>
      </g>

      {/* 4. The Massive Rusty Iron Folding Gate (Cánh cổng sắt xếp / chấn song hoen gỉ) */}
      <g className="rusty-iron-gate">
        {/* Background dark void between gate bars */}
        <rect x="-105" y="-270" width="210" height="270" fill="#05070B" opacity="0.6" />

        {/* LEFT GATE LEAF (Cánh cổng trái, từ X = -105 đến X = -5) */}
        <g className="gate-leaf-left">
          {/* Main Outer Perimeter Frame */}
          <rect x="-105" y="-270" width="100" height="270" fill="none" stroke="#0F172A" strokeWidth="6" />
          <rect x="-104" y="-269" width="98" height="268" fill="none" stroke="#332014" strokeWidth="2" />

          {/* Horizontal cross rails (Thanh dằn ngang) */}
          <line x1="-105" y1="-268" x2="-5" y2="-268" stroke="#1E293B" strokeWidth="5" />
          <line x1="-105" y1="-180" x2="-5" y2="-180" stroke="#1E293B" strokeWidth="5" />
          <line x1="-105" y1="-90" x2="-5" y2="-90" stroke="#1E293B" strokeWidth="5" />
          <line x1="-105" y1="-4" x2="-5" y2="-4" stroke="#1E293B" strokeWidth="6" />

          {/* Diagonal X-Braces (Hệ thanh giằng chéo chữ X tăng độ u uất) */}
          {/* Lower section X-brace */}
          <line x1="-105" y1="-4" x2="-5" y2="-90" stroke="#182234" strokeWidth="3" />
          <line x1="-5" y1="-4" x2="-105" y2="-90" stroke="#182234" strokeWidth="3" />
          <circle cx="-55" cy="-47" r="4" fill="#3B1C0B" stroke="#1E293B" strokeWidth="1" />

          {/* Middle section X-brace */}
          <line x1="-105" y1="-90" x2="-5" y2="-180" stroke="#182234" strokeWidth="3" />
          <line x1="-5" y1="-90" x2="-105" y2="-180" stroke="#182234" strokeWidth="3" />
          <circle cx="-55" cy="-135" r="4" fill="#3B1C0B" stroke="#1E293B" strokeWidth="1" />

          {/* Vertical Iron Bars with Spearhead Spikes (Các chấn song đứng) */}
          {[-93, -80, -67, -55, -42, -29, -16].map((barX) => (
            <g key={barX}>
              {/* Vertical Bar */}
              <line x1={barX} y1="-270" x2={barX} y2="0" stroke="#0F172A" strokeWidth="4" />
              <line x1={barX} y1="-270" x2={barX} y2="0" stroke="#5C2607" strokeWidth="1.5" />
              {/* Spearhead Top Tip */}
              <polygon
                points={`${barX},-292 ${barX - 5},-270 ${barX + 5},-270`}
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="1"
              />
              <circle cx={barX} cy="-270" r="2.5" fill="#78350F" />
            </g>
          ))}

          {/* Hinges connecting to Left Pillar */}
          <rect x="-108" y="-240" width="8" height="18" rx="2" fill="#1C140E" stroke="#78350F" strokeWidth="1" />
          <rect x="-108" y="-120" width="8" height="18" rx="2" fill="#1C140E" stroke="#78350F" strokeWidth="1" />
          <rect x="-108" y="-20" width="8" height="18" rx="2" fill="#1C140E" stroke="#78350F" strokeWidth="1" />
        </g>

        {/* RIGHT GATE LEAF (Cánh cổng phải, từ X = 5 đến X = 105) */}
        <g className="gate-leaf-right">
          {/* Main Outer Perimeter Frame */}
          <rect x="5" y="-270" width="100" height="270" fill="none" stroke="#0F172A" strokeWidth="6" />
          <rect x="6" y="-269" width="98" height="268" fill="none" stroke="#322014" strokeWidth="2" />

          {/* Horizontal cross rails */}
          <line x1="5" y1="-268" x2="105" y2="-268" stroke="#1E293B" strokeWidth="5" />
          <line x1="5" y1="-180" x2="105" y2="-180" stroke="#1E293B" strokeWidth="5" />
          <line x1="5" y1="-90" x2="105" y2="-90" stroke="#1E293B" strokeWidth="5" />
          <line x1="5" y1="-4" x2="105" y2="-4" stroke="#1E293B" strokeWidth="6" />

          {/* Diagonal X-Braces */}
          {/* Lower section X-brace */}
          <line x1="5" y1="-4" x2="105" y2="-90" stroke="#182234" strokeWidth="3" />
          <line x1="105" y1="-4" x2="5" y2="-90" stroke="#182234" strokeWidth="3" />
          <circle cx="55" cy="-47" r="4" fill="#3B1C0B" stroke="#1E293B" strokeWidth="1" />

          {/* Middle section X-brace */}
          <line x1="5" y1="-90" x2="105" y2="-180" stroke="#182234" strokeWidth="3" />
          <line x1="105" y1="-90" x2="5" y2="-180" stroke="#182234" strokeWidth="3" />
          <circle cx="55" cy="-135" r="4" fill="#3B1C0B" stroke="#1E293B" strokeWidth="1" />

          {/* Vertical Iron Bars with Spearhead Spikes */}
          {[16, 29, 42, 55, 67, 80, 93].map((barX) => (
            <g key={barX}>
              <line x1={barX} y1="-270" x2={barX} y2="0" stroke="#0F172A" strokeWidth="4" />
              <line x1={barX} y1="-270" x2={barX} y2="0" stroke="#5C2607" strokeWidth="1.5" />
              <polygon
                points={`${barX},-292 ${barX - 5},-270 ${barX + 5},-270`}
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="1"
              />
              <circle cx={barX} cy="-270" r="2.5" fill="#78350F" />
            </g>
          ))}

          {/* Hinges connecting to Right Pillar */}
          <rect x="100" y="-240" width="8" height="18" rx="2" fill="#1C140E" stroke="#78350F" strokeWidth="1" />
          <rect x="100" y="-120" width="8" height="18" rx="2" fill="#1C140E" stroke="#78350F" strokeWidth="1" />
          <rect x="100" y="-20" width="8" height="18" rx="2" fill="#1C140E" stroke="#78350F" strokeWidth="1" />
        </g>

        {/* Central Gap & Heavy Chain Lock (Xích sắt to bản & Ổ khóa gỉ ở trung tâm Y = -135) */}
        <g className="gate-chain-lock" transform="translate(0, -135)">
          {/* Iron locking latch bars */}
          <rect x="-18" y="-6" width="36" height="12" rx="2" fill="#0C121C" stroke="#334155" strokeWidth="1.5" />
          {/* Looped Heavy Iron Chain wrapped around bars */}
          <ellipse cx="-4" cy="-2" rx="10" ry="14" fill="none" stroke="#64748B" strokeWidth="4" />
          <ellipse cx="4" cy="4" rx="10" ry="14" fill="none" stroke="#475569" strokeWidth="3.5" />
          <ellipse cx="0" cy="8" rx="8" ry="12" fill="none" stroke="#78350F" strokeWidth="3" />
          {/* Hanging Rusted Brass Padlock (Ổ khóa đồng hoen rỉ) */}
          <g transform="translate(0, 16)">
            {/* Shackle */}
            <path d="M -6 0 L -6 -8 Q 0 -14 6 -8 L 6 0" fill="none" stroke="#64748B" strokeWidth="3" />
            {/* Lock body */}
            <rect x="-10" y="0" width="20" height="16" rx="3" fill="#3B1C0B" stroke="#B45309" strokeWidth="1.5" />
            {/* Keyhole */}
            <circle cx="0" cy="6" r="2" fill="#000000" />
            <polygon points="-1,6 1,6 1.5,11 -1.5,11" fill="#000000" />
          </g>
        </g>
      </g>

      {/* 5. Ground Level, Cracked Apron, Murky Puddle & Weeds (Chân cổng tiếp đất tại Y = 0) */}
      <g className="ground-elements">
        {/* Concrete ground threshold apron */}
        <polygon points="-160,0 160,0 150,-10 -150,-10" fill="#080C14" stroke="#161F2E" strokeWidth="1" />
        {/* Steel roller track rail flush with ground */}
        <line x1="-110" y1="-2" x2="110" y2="-2" stroke="#475569" strokeWidth="3" />
        <line x1="-110" y1="-1" x2="110" y2="-1" stroke="#94A3B8" strokeWidth="1" opacity="0.6" />

        {/* Murky Rainwater Puddle on Ground (Vũng nước đọng phản chiếu) */}
        <ellipse cx="-30" cy="-3" rx="48" ry="8" fill="#04060A" stroke="#1E293B" strokeWidth="1" opacity="0.9" />
        {/* Reflection of amber lamp in puddle */}
        <ellipse cx="-45" cy="-3" rx="14" ry="3.5" fill="#F59E0B" opacity="0.28" className="anim-flicker-ember" />
        {/* Reflection of gate bars */}
        <line x1="-30" y1="-8" x2="-30" y2="2" stroke="#0F172A" strokeWidth="2" opacity="0.7" />
        <line x1="-18" y1="-7" x2="-18" y2="3" stroke="#0F172A" strokeWidth="2" opacity="0.7" />

        {/* Clumps of Thorny Weeds / Wild Grass sprouting at base of pillars */}
        {/* Left weeds */}
        <path
          d="M -165 0 C -168 -15 -178 -25 -182 -32 C -178 -20 -170 -10 -160 0 Z"
          fill="#0A120D"
        />
        <path
          d="M -152 0 C -150 -18 -144 -30 -138 -38 C -144 -22 -148 -10 -148 0 Z"
          fill="#060C08"
        />
        <path
          d="M -115 0 C -112 -12 -106 -20 -100 -24 C -107 -15 -110 -8 -112 0 Z"
          fill="#0A120D"
        />
        {/* Right weeds */}
        <path
          d="M 112 0 C 115 -14 122 -22 128 -28 C 122 -16 118 -8 115 0 Z"
          fill="#0A120D"
        />
        <path
          d="M 152 0 C 156 -18 165 -28 174 -35 C 166 -20 158 -10 154 0 Z"
          fill="#060C08"
        />

        {/* Fallen dry leaves / windblown debris near gate base */}
        <ellipse cx="-15" cy="-2" rx="4" ry="1.5" fill="#3B1C0B" transform="rotate(-15 -15 -2)" />
        <ellipse cx="25" cy="-3" rx="5" ry="1.8" fill="#2E1005" transform="rotate(20 25 -3)" />
        <ellipse cx="70" cy="-2" rx="4" ry="1.4" fill="#3B1C0B" transform="rotate(-30 70 -2)" />
      </g>
    </g>
  );
};

/**
 * 20. MEKONG DELTA WOODEN SAMPAN (Xuồng ba lá / Ghe nước miền Tây)
 * Ground / Waterline anchor: [0, 0] at bottom-center (Y=800px)
 * Semantic Role: Ký ức về người mẹ Hai Lụa bơi xuồng hái bông súng, bông điên điển trên con kênh nước nổi.
 */
const WoodenSampan: React.FC = () => {
  return (
    <g className="structure-wooden-sampan">
      {/* 1. Dark Haunted Canal Water Surface & Ripples along Ground Y = 0 */}
      <g className="canal-water-base">
        <ellipse cx="0" cy="2" rx="228" ry="14" fill="#061017" opacity="0.88" />
        <ellipse cx="0" cy="0" rx="200" ry="9" fill="#0A1B24" opacity="0.82" />
        {/* Moonlit eerie water ripple streaks */}
        <path d="M -215 2 Q -140 -3 -70 2 Q 0 7 80 1 Q 150 -4 218 2" fill="none" stroke="#1E3A4C" strokeWidth="2" opacity="0.7" />
        <path d="M -185 8 Q -100 4 -20 9 Q 70 13 175 7" fill="none" stroke="#334155" strokeWidth="1.3" opacity="0.55" />
        <path d="M -150 -5 Q -60 -9 35 -5 Q 110 -2 175 -6" fill="none" stroke="#164E63" strokeWidth="1.2" opacity="0.5" />
        {/* Dark hull water reflection */}
        <path
          d="M -155 1 C -110 12, 110 12, 155 1 Z"
          fill="#02060A"
          opacity="0.72"
        />
      </g>

      {/* 2. Wooden Mooring Bamboo Stake on Left Bank (Cọc tre cắm mé kênh buộc dây mũi xuồng) */}
      <g transform="translate(-195, 0)">
        <path d="M -6 2 L -4 -108 L 4 -108 L 6 2 Z" fill="#18120D" stroke="#292018" strokeWidth="1.2" />
        <line x1="-5" y1="-34" x2="5" y2="-34" stroke="#3F2E21" strokeWidth="2" />
        <line x1="-4.5" y1="-70" x2="4.5" y2="-70" stroke="#3F2E21" strokeWidth="2" />
        {/* Mooring rope tied from stake to upturned sampan bow */}
        <path
          d="M 3 -64 Q 16 -46 30 -52"
          fill="none"
          stroke="#785332"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <ellipse cx="0" cy="-64" rx="6" ry="2.5" fill="none" stroke="#785332" strokeWidth="2" />
      </g>

      {/* 3. Tall Canal Reeds & Wild Water Grass behind stern/bow (Lau sậy & cỏ lác mé kênh) */}
      <g className="canal-reeds" opacity="0.88">
        <path d="M -180 0 Q -195 -45 -212 -85" fill="none" stroke="#0C1712" strokeWidth="3" />
        <path d="M -172 0 Q -180 -55 -170 -102" fill="none" stroke="#112119" strokeWidth="2.6" />
        <path d="M 182 0 Q 198 -48 214 -92" fill="none" stroke="#0C1712" strokeWidth="3" />
        <path d="M 172 0 Q 186 -60 180 -108" fill="none" stroke="#112119" strokeWidth="2.5" />
        {/* Reed cattail tufts */}
        <ellipse cx="-170" cy="-98" rx="3" ry="10" fill="#1C1917" />
        <ellipse cx="180" cy="-104" rx="3" ry="10" fill="#1C1917" />
      </g>

      {/* 4. Main Wooden Sampan Hull (Thân xuồng ba lá gỗ miền Tây, nhẹ nhàng dập dềnh) */}
      <g className="sampan-hull anim-sway-subtle">
        {/* Interior Hollow Back Wall & Wooden Thwarts (Khoang trong & ván ngồi ngang) */}
        <path
          d="M -165 -54 C -130 -44, 130 -44, 165 -54 L 145 -28 L -145 -28 Z"
          fill="#0C0907"
          stroke="#261C15"
          strokeWidth="1.2"
        />
        {/* Wooden Cross-Benches (Băng ngồi xuồng) */}
        <rect x="-112" y="-48" width="24" height="6" rx="1" fill="#2A1E15" stroke="#140E0A" strokeWidth="1" />
        <rect x="-14" y="-46" width="28" height="6" rx="1" fill="#2A1E15" stroke="#140E0A" strokeWidth="1" />
        <rect x="88" y="-48" width="24" height="6" rx="1" fill="#2A1E15" stroke="#140E0A" strokeWidth="1" />

        {/* Harvested Bông Súng (Water Lilies) & Bông Điên Điển piled inside the sampan */}
        <g className="harvested-flowers">
          {/* Bông súng stalks & crimson-pink/pale buds on left-center */}
          <path d="M -92 -42 Q -70 -64 -48 -56" fill="none" stroke="#1E3A24" strokeWidth="2.4" />
          <path d="M -86 -40 Q -62 -72 -35 -60" fill="none" stroke="#2D4F33" strokeWidth="2.2" />
          <path d="M -78 -38 Q -52 -68 -24 -52" fill="none" stroke="#1E3A24" strokeWidth="2" />
          {/* Water lily blossoms (Bông súng tím hồng / đỏ trầm ma mị) */}
          <g transform="translate(-48, -58) rotate(18)">
            <path d="M 0 0 C -5 -8, -2 -15, 0 -18 C 2 -15, 5 -8, 0 0 Z" fill="#BE123C" stroke="#4C0519" strokeWidth="0.8" />
            <path d="M 0 0 C -8 -5, -7 -12, -3 -15 C -2 -10, -1 -4, 0 0 Z" fill="#9F1239" />
            <path d="M 0 0 C 8 -5, 7 -12, 3 -15 C 2 -10, 1 -4, 0 0 Z" fill="#E11D48" opacity="0.85" />
          </g>
          <g transform="translate(-34, -62) rotate(-14)">
            <path d="M 0 0 C -4 -7, -2 -13, 0 -16 C 2 -13, 4 -7, 0 0 Z" fill="#E2E8F0" stroke="#475569" strokeWidth="0.7" opacity="0.9" />
            <path d="M 0 0 C -7 -4, -6 -10, -2 -13 C -1 -8, 0 -3, 0 0 Z" fill="#BE123C" opacity="0.8" />
          </g>
          <g transform="translate(-62, -55) rotate(-32)">
            <path d="M 0 0 C -4 -7, -1 -12, 0 -14 C 1 -12, 4 -7, 0 0 Z" fill="#9F1239" />
          </g>

          {/* Bông điên điển (Golden-yellow Mekong sesbania blossom clusters) piled in woven basket / mid-hull */}
          <g transform="translate(26, -45)">
            {/* Shallow bamboo basket rim */}
            <path d="M -26 6 Q 0 14 26 6 L 22 -4 Q 0 2 -22 -4 Z" fill="#4A321F" stroke="#1C120A" strokeWidth="1.2" />
            {/* Clusters of golden-yellow bông điên điển */}
            <g fill="#CA8A04" stroke="#713F12" strokeWidth="0.6">
              <circle cx="-14" cy="-6" r="4.5" />
              <circle cx="-7" cy="-10" r="5" fill="#EAB308" />
              <circle cx="2" cy="-12" r="5.2" fill="#FACC15" />
              <circle cx="11" cy="-9" r="4.8" fill="#EAB308" />
              <circle cx="17" cy="-5" r="4" />
              <circle cx="-2" cy="-6" r="4.2" fill="#FDE047" />
              <circle cx="8" cy="-5" r="4" fill="#CA8A04" />
            </g>
            {/* Delicate dark green sesbania leaves */}
            <path d="M -20 -4 Q -28 -12 -32 -10" fill="none" stroke="#1E3A1E" strokeWidth="2" />
            <path d="M 20 -4 Q 28 -13 33 -10" fill="none" stroke="#1E3A1E" strokeWidth="2" />
          </g>
        </g>

        {/* Outer Curved 3-Plank Wooden Hull (Mạn xuồng ba lá mũi nhọn cong vút) */}
        <path
          d="M -182 -60 C -152 -24, -124 -4, -95 0 L 95 0 C 124 -4, 152 -24, 182 -60 C 145 -44, 100 -38, 0 -38 C -100 -38, -145 -44, -182 -60 Z"
          fill="#15100D"
          stroke="#2E221A"
          strokeWidth="1.8"
        />
        {/* Upper gunwale highlight plank */}
        <path
          d="M -182 -60 C -145 -44, -100 -38, 0 -38 C 100 -38, 145 -44, 182 -60 L 175 -51 C 140 -36, 98 -31, 0 -31 C -98 -31, -140 -36, -175 -51 Z"
          fill="#261C15"
        />
        {/* Characteristic Three-Plank Horizontal Seam Lines (Đường ghép 3 lá ván) */}
        <path
          d="M -166 -43 C -128 -28, -90 -22, 0 -22 C 90 -22, 128 -28, 166 -43"
          fill="none"
          stroke="#3D2D22"
          strokeWidth="1.4"
          opacity="0.85"
        />
        <path
          d="M -140 -24 C -105 -13, -70 -10, 0 -10 C 70 -10, 105 -13, 140 -24"
          fill="none"
          stroke="#0A0705"
          strokeWidth="1.6"
        />
        {/* Vertical wooden rib bolts / weathered plank joints */}
        {[-105, -55, 0, 55, 105].map((rx) => (
          <line key={rx} x1={rx} y1="-37" x2={rx * 0.88} y2="-3" stroke="#0B0806" strokeWidth="1.2" opacity="0.7" />
        ))}
        {/* Pointed Bow & Stern End-Caps (Mũi xuồng & lái xuồng) */}
        <polygon points="-182,-60 -190,-65 -174,-52" fill="#3B2B1F" />
        <polygon points="182,-60 190,-65 174,-52" fill="#3B2B1F" />

        {/* Wooden Oar / Paddle (Mái dầm / Cây chèo gác xiên qua mạn xuồng) */}
        <g className="sampan-oar">
          <line x1="65" y1="-64" x2="148" y2="-10" stroke="#3D2B1F" strokeWidth="4.2" strokeLinecap="round" />
          <line x1="65" y1="-64" x2="148" y2="-10" stroke="#5C4026" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          {/* Flat paddle blade dipping into canal water */}
          <path
            d="M 142 -15 L 176 4 C 180 7, 174 14, 166 11 L 136 -8 Z"
            fill="#261A12"
            stroke="#4A3525"
            strokeWidth="1.1"
          />
          {/* Tiny water splash ring around paddle blade */}
          <ellipse cx="164" cy="7" rx="18" ry="3.5" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.35" />
        </g>
      </g>

      {/* 5. Floating Lily Pads & Wild Water Lily on Foreground Canal Water */}
      <g className="canal-lily-pads">
        <ellipse cx="-115" cy="7" rx="16" ry="4" fill="#14291A" stroke="#09150C" strokeWidth="1" />
        <ellipse cx="105" cy="9" rx="18" ry="4.5" fill="#14291A" stroke="#09150C" strokeWidth="1" />
        <ellipse cx="128" cy="4" rx="11" ry="3" fill="#1A3321" />
        {/* Single eerie wild water lily blooming on the water */}
        <g transform="translate(-115, 5)">
          <path d="M 0 0 C -3 -6, -1 -10, 0 -12 C 1 -10, 3 -6, 0 0 Z" fill="#E11D48" opacity="0.85" />
          <path d="M 0 0 C -6 -3, -5 -7, -2 -9 Z" fill="#9F1239" />
          <path d="M 0 0 C 6 -3, 5 -7, 2 -9 Z" fill="#9F1239" />
        </g>
      </g>

      {/* 6. Faint Drifting River Mist over Sampan */}
      <g opacity="0.38" className="anim-smoke-rise" pointerEvents="none">
        <ellipse cx="-55" cy="-16" rx="52" ry="8" fill="#CBD5E1" opacity="0.22" />
        <ellipse cx="60" cy="-12" rx="58" ry="9" fill="#CBD5E1" opacity="0.18" />
      </g>
    </g>
  );
};

/**
 * 21. MEKONG DELTA BAMBOO MONKEY BRIDGE (Cầu khỉ miền Tây)
 * Ground / Canal anchor: [0, 0] at bottom-center (Y=800px)
 * Semantic Role: Cây cầu khỉ tre chênh vênh đặc trưng sông nước Nam Bộ bắc qua con kênh tối giữa bụi dừa nước và lục bình.
 */
const MonkeyBridge: React.FC = () => {
  const xStilts = [
    { x: -150, crossY: -66, topY: -144, leftFoot: -176, rightFoot: -124 },
    { x: -55, crossY: -108, topY: -188, leftFoot: -82, rightFoot: -28 },
    { x: 55, crossY: -108, topY: -188, leftFoot: 28, rightFoot: 82 },
    { x: 150, crossY: -66, topY: -144, leftFoot: 124, rightFoot: 176 },
  ];

  return (
    <g className="structure-monkey-bridge">
      {/* 1. Dark Haunted Canal Water Surface & Muddy Banks along Y = 0 */}
      <g className="monkey-bridge-canal">
        {/* Canal water bed */}
        <ellipse cx="0" cy="1" rx="235" ry="13" fill="#061017" opacity="0.9" />
        <ellipse cx="0" cy="0" rx="185" ry="8" fill="#0A1B24" opacity="0.85" />
        {/* Moonlit eerie ripples under bridge arch */}
        <path d="M -165 2 Q -95 -3 -25 2 Q 45 7 155 1" fill="none" stroke="#1E3A4C" strokeWidth="1.8" opacity="0.7" />
        <path d="M -135 8 Q -55 4 20 9 Q 95 12 145 7" fill="none" stroke="#334155" strokeWidth="1.2" opacity="0.55" />
        <path d="M -110 -4 Q -30 -8 45 -4 Q 100 -1 135 -5" fill="none" stroke="#164E63" strokeWidth="1.1" opacity="0.5" />

        {/* Left & Right Muddy Canal Banks (Bờ đất sình hai đầu cầu) */}
        <path
          d="M -245 4 C -225 -18, -195 -24, -158 -12 C -144 -7, -138 0, -135 4 Z"
          fill={COLOR_PALETTE.silhouette_primary}
        />
        <path
          d="M 245 4 C 225 -18, 195 -24, 158 -12 C 144 -7, 138 0, 135 4 Z"
          fill={COLOR_PALETTE.silhouette_primary}
        />
      </g>

      {/* 2. Silhouetted Nipa Palm Fronds & Canal Reeds at Both Banks (Bụi dừa nước & lau sậy mé kênh) */}
      <g className="canal-nipa-palms" opacity="0.92">
        {/* Left nipa palm fronds */}
        <path d="M -218 -10 Q -238 -58 -252 -96" fill="none" stroke="#0B1510" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M -214 -12 Q -218 -64 -202 -106" fill="none" stroke="#112119" strokeWidth="3" strokeLinecap="round" />
        <path d="M -210 -10 Q -194 -52 -176 -84" fill="none" stroke="#0D1912" strokeWidth="2.4" strokeLinecap="round" />
        {/* Frond leaflets on left */}
        <path d="M -234 -48 L -246 -56 M -242 -70 L -256 -76 M -214 -56 L -226 -64 M -210 -78 L -196 -86" stroke="#0F1F16" strokeWidth="2" />

        {/* Right nipa palm fronds */}
        <path d="M 218 -10 Q 238 -58 252 -96" fill="none" stroke="#0B1510" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 214 -12 Q 218 -64 202 -106" fill="none" stroke="#112119" strokeWidth="3" strokeLinecap="round" />
        <path d="M 210 -10 Q 194 -52 176 -84" fill="none" stroke="#0D1912" strokeWidth="2.4" strokeLinecap="round" />
        {/* Frond leaflets on right */}
        <path d="M 234 -48 L 246 -56 M 242 -70 L 256 -76 M 214 -56 L 226 -64 M 210 -78 L 196 -86" stroke="#0F1F16" strokeWidth="2" />
      </g>

      {/* 3. Back Handrail Upright Bamboo Posts & Curved Single-Side Bamboo Handrail (Tay vịn tre một bên) */}
      <g className="monkey-bridge-handrail">
        {/* Upright bamboo handrail posts anchored down into the canal bed */}
        <line x1="-208" y1="-12" x2="-208" y2="-98" stroke="#1B1610" strokeWidth="4.2" strokeLinecap="round" />
        <line x1="208" y1="-12" x2="208" y2="-98" stroke="#1B1610" strokeWidth="4.2" strokeLinecap="round" />

        {xStilts.map((st, idx) => (
          <g key={`post-${idx}`}>
            {/* Tall upright rear bamboo handrail post */}
            <line
              x1={st.x}
              y1="2"
              x2={st.x}
              y2={st.topY - 8}
              stroke="#1C1711"
              strokeWidth="4.6"
              strokeLinecap="round"
            />
            <line
              x1={st.x}
              y1="2"
              x2={st.x}
              y2={st.topY - 8}
              stroke="#3B2E20"
              strokeWidth="1.4"
              opacity="0.7"
            />
            {/* Bamboo node joints on upright post */}
            <line x1={st.x - 3} y1={st.crossY - 26} x2={st.x + 3} y2={st.crossY - 26} stroke="#5C442B" strokeWidth="1.5" />
            <line x1={st.x - 3} y1={st.topY + 12} x2={st.x + 3} y2={st.topY + 12} stroke="#5C442B" strokeWidth="1.5" />
          </g>
        ))}

        {/* Curved slender bamboo handrail pole (Tay vịn tre uốn cong chênh vênh) */}
        <path
          d="M -216 -92 C -152 -148, -68 -190, 0 -195 C 68 -190, 152 -148, 216 -92"
          fill="none"
          stroke="#1D1710"
          strokeWidth="6.2"
          strokeLinecap="round"
        />
        <path
          d="M -216 -92 C -152 -148, -68 -190, 0 -195 C 68 -190, 152 -148, 216 -92"
          fill="none"
          stroke="#4A3928"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Rattan lashing knots binding handrail to upright posts */}
        {xStilts.map((st, idx) => (
          <g key={`rail-knot-${idx}`} transform={`translate(${st.x}, ${st.topY})`}>
            <path d="M -4 -3 L 4 3 M -4 3 L 4 -3" stroke="#785332" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        ))}
        {/* Weathered fluttering cloth tie / dried leaf tuft on center handrail post */}
        <g transform="translate(-55, -186)" className="anim-sway-subtle">
          <path d="M 0 0 Q -6 12 -3 24 Q 2 14 3 0 Z" fill="#7F1D1D" opacity="0.78" />
        </g>
      </g>

      {/* 4. Iconic Crossed Bamboo X-Stilts (Chân cầu tre cắm chữ X chéo) */}
      <g className="monkey-bridge-x-stilts">
        {xStilts.map((st, idx) => (
          <g key={`stilt-${idx}`}>
            {/* Subtle dark water reflection below waterline */}
            <line x1={st.leftFoot} y1="0" x2={st.leftFoot - 4} y2="10" stroke="#04090D" strokeWidth="4" opacity="0.65" />
            <line x1={st.rightFoot} y1="0" x2={st.rightFoot + 4} y2="10" stroke="#04090D" strokeWidth="4" opacity="0.65" />

            {/* Diagonal bamboo leg 1 (bottom-left to upper-right) */}
            <line
              x1={st.leftFoot}
              y1="2"
              x2={st.x + 14}
              y2={st.crossY - 14}
              stroke="#14110D"
              strokeWidth="5.8"
              strokeLinecap="round"
            />
            <line
              x1={st.leftFoot}
              y1="2"
              x2={st.x + 14}
              y2={st.crossY - 14}
              stroke="#382B1E"
              strokeWidth="1.6"
              opacity="0.75"
            />

            {/* Diagonal bamboo leg 2 (bottom-right to upper-left) */}
            <line
              x1={st.rightFoot}
              y1="2"
              x2={st.x - 14}
              y2={st.crossY - 14}
              stroke="#1A1510"
              strokeWidth="5.8"
              strokeLinecap="round"
            />
            <line
              x1={st.rightFoot}
              y1="2"
              x2={st.x - 14}
              y2={st.crossY - 14}
              stroke="#463626"
              strokeWidth="1.6"
              opacity="0.78"
            />

            {/* Horizontal underwater/low cross brace for realism */}
            <line
              x1={st.leftFoot + 8}
              y1={st.crossY * 0.35}
              x2={st.rightFoot - 8}
              y2={st.crossY * 0.35}
              stroke="#241B13"
              strokeWidth="2.8"
            />

            {/* Rattan rope lashing at X intersection (Dây lạt buộc chéo chân cầu) */}
            <g transform={`translate(${st.x}, ${st.crossY})`}>
              <ellipse cx="0" cy="0" rx="6.5" ry="5" fill="#4A321F" stroke="#1C120A" strokeWidth="1" />
              <path d="M -5 -4 L 5 4 M -5 4 L 5 -4" stroke="#8C6239" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </g>
        ))}
      </g>

      {/* 5. Slender Arched Bamboo Walkway Beams (Thân cầu tre / cau ghép đôi uốn cong qua kênh) */}
      <g className="monkey-bridge-walkway">
        {/* Lower shadow bamboo trunk */}
        <path
          d="M -230 -14 C -152 -74, -68 -108, 0 -112 C 68 -108, 152 -74, 230 -14"
          fill="none"
          stroke="#120E0A"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Upper main bamboo / areca walkway trunk */}
        <path
          d="M -232 -18 C -154 -80, -68 -114, 0 -118 C 68 -114, 154 -80, 232 -18"
          fill="none"
          stroke="#2E2318"
          strokeWidth="8.5"
          strokeLinecap="round"
        />
        {/* Weathered bamboo top edge highlight */}
        <path
          d="M -230 -20 C -152 -82, -68 -116, 0 -120 C 68 -116, 152 -82, 230 -20"
          fill="none"
          stroke="#5C452F"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Bamboo ring nodes & rattan bindings along the walkway arch */}
        {[
          { x: -185, y: -50, rot: -32 },
          { x: -120, y: -88, rot: -24 },
          { x: -55, y: -112, rot: -12 },
          { x: 0, y: -118, rot: 0 },
          { x: 55, y: -112, rot: 12 },
          { x: 120, y: -88, rot: 24 },
          { x: 185, y: -50, rot: 32 },
        ].map((node, idx) => (
          <line
            key={`node-${idx}`}
            x1={node.x}
            y1={node.y - 5}
            x2={node.x}
            y2={node.y + 5}
            stroke="#785332"
            strokeWidth="2"
            transform={`rotate(${node.rot}, ${node.x}, ${node.y})`}
          />
        ))}

        {/* Small wooden ramp cleats at both ends */}
        <rect x="-228" y="-20" width="16" height="5" rx="1" fill="#2A1E14" transform="rotate(-28, -220, -18)" />
        <rect x="212" y="-20" width="16" height="5" rx="1" fill="#2A1E14" transform="rotate(28, 220, -18)" />
      </g>

      {/* 6. Floating Water Hyacinth Clusters (Bèo lục bình trôi lững lờ dưới chân cầu) */}
      <g className="canal-water-hyacinth">
        <g transform="translate(-85, 5)">
          <ellipse cx="0" cy="0" rx="16" ry="4" fill="#132919" stroke="#08140B" strokeWidth="0.9" />
          <ellipse cx="-8" cy="-3" rx="6" ry="3.5" fill="#1D3D24" />
          <ellipse cx="6" cy="-2.5" rx="7" ry="3" fill="#1A3620" />
          {/* Tiny muted purple hyacinth blossom */}
          <ellipse cx="0" cy="-7" rx="2.4" ry="4" fill="#7E22CE" opacity="0.75" />
        </g>
        <g transform="translate(75, 6)">
          <ellipse cx="0" cy="0" rx="18" ry="4.5" fill="#132919" stroke="#08140B" strokeWidth="0.9" />
          <ellipse cx="-6" cy="-3" rx="7" ry="3.5" fill="#1D3D24" />
          <ellipse cx="8" cy="-2" rx="6" ry="3" fill="#1A3620" />
          <ellipse cx="-4" cy="-7.5" rx="2.2" ry="3.8" fill="#9333EA" opacity="0.7" />
        </g>
      </g>

      {/* 7. Eerie Drifting Canal Mist under Bridge */}
      <g opacity="0.36" className="anim-smoke-rise" pointerEvents="none">
        <ellipse cx="-45" cy="-18" rx="62" ry="9" fill="#CBD5E1" opacity="0.2" />
        <ellipse cx="55" cy="-14" rx="58" ry="8" fill="#CBD5E1" opacity="0.18" />
      </g>
    </g>
  );
};

/**
 * 22. TRADITIONAL WOODEN COFFIN (Cỗ Quan Tài Gỗ Truyền Thống)
 * Vietnamese traditional "Áo quan" with beveled lid and hexagonal profile raised on two wooden pedestals.
 * Features carved Longevity ("Thọ") crest, candlelight amber sheen, and hanging mourning ribbon.
 * Anchored at [bottom-center] (0, 0) at Ground Y = 800px.
 */
const WoodenCoffin: React.FC = () => {
  return (
    <g className="structure-wooden-coffin">
      {/* 1. Deep Ground Shadow */}
      <ellipse cx="0" cy="-2" rx="195" ry="11" fill="#000000" opacity="0.75" />
      <ellipse cx="0" cy="-2" rx="140" ry="7" fill="#000000" opacity="0.5" />

      {/* 2. Two Carved Wooden Pedestals / Trestles (Đôn gỗ kê hòm) */}
      {/* Left Pedestal */}
      <g className="pedestal-left">
        <rect x="-132" y="-36" width="34" height="36" rx="2" fill="#0A0B0E" stroke="#1F212A" strokeWidth="1.5" />
        <rect x="-140" y="-8" width="50" height="8" rx="1" fill="#07080B" />
        <rect x="-138" y="-36" width="46" height="6" rx="1" fill="#14161F" />
        {/* Carved cutout motif */}
        <path d="M -124 -24 L -115 -12 L -106 -24 Z" fill="#050507" />
      </g>
      {/* Right Pedestal */}
      <g className="pedestal-right">
        <rect x="98" y="-36" width="34" height="36" rx="2" fill="#0A0B0E" stroke="#1F212A" strokeWidth="1.5" />
        <rect x="90" y="-8" width="50" height="8" rx="1" fill="#07080B" />
        <rect x="92" y="-36" width="46" height="6" rx="1" fill="#14161F" />
        {/* Carved cutout motif */}
        <path d="M 106 -24 L 115 -12 L 124 -24 Z" fill="#050507" />
      </g>

      {/* 3. Lower Coffin Body (Thân quan tài gỗ vát đáy) */}
      {/* Main trapezoid body: Head at left (wider, taller), Foot at right */}
      <polygon
        points="-172,-108 162,-108 148,-36 -158,-36"
        fill="#0D0D12"
        stroke="#1E1E26"
        strokeWidth="2.5"
      />
      {/* Recessed carved side panel */}
      <polygon
        points="-162,-100 152,-100 140,-44 -150,-44"
        fill="#09090D"
        stroke="#16161F"
        strokeWidth="1.2"
      />
      {/* Horizontal decorative gold/bronze trim lines */}
      <line x1="-155" y1="-86" x2="145" y2="-86" stroke="#2A2A38" strokeWidth="1.5" />
      <line x1="-151" y1="-58" x2="141" y2="-58" stroke="#1E1E28" strokeWidth="1.2" />

      {/* 4. Carved Stylized "Thọ" (Longevity) Medallion on Front Head Board */}
      <g transform="translate(-110, -72)">
        {/* Outer Circular Rim */}
        <circle cx="0" cy="0" r="16" fill="#07070A" stroke="#B45309" strokeWidth="1.4" opacity="0.85" />
        <circle cx="0" cy="0" r="13" fill="none" stroke="#CA8A04" strokeWidth="0.8" opacity="0.6" strokeDasharray="3,2" />
        {/* Geometric "Thọ" Character Strokes */}
        <g stroke="#FACC15" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" fill="none">
          <line x1="-8" y1="-7" x2="8" y2="-7" />
          <line x1="0" y1="-10" x2="0" y2="10" />
          <line x1="-6" y1="-2" x2="6" y2="-2" />
          <line x1="-8" y1="3" x2="8" y2="3" />
          <rect x="-5" y="3" width="10" height="5" />
        </g>
      </g>

      {/* 5. Coffin Lid (Nắp hòm vát cạnh truyền thống) */}
      {/* Beveled Upper Lid: High curved crown with faceted slopes */}
      <path
        d="M -184 -108 C -182 -146, -110 -165, 0 -165 C 110 -165, 172 -146, 174 -108 Z"
        fill="#14141B"
        stroke="#272734"
        strokeWidth="2.5"
      />
      {/* Facet bevel highlight ridge */}
      <path
        d="M -170 -148 C -70 -162, 70 -162, 160 -148"
        fill="none"
        stroke="#3F3F50"
        strokeWidth="2"
      />
      {/* Candlelight warm yellow amber sheen washing over top lid */}
      <path
        d="M -140 -156 C -40 -166, 40 -166, 130 -156 C 80 -150, -80 -150, -140 -156 Z"
        fill="#FACC15"
        opacity="0.22"
      />

      {/* 6. White Mourning Ribbon / Cloth Drape (Dải băng tang trắng rủ mép quan tài) */}
      <g className="mourning-ribbon">
        {/* Rosette knot at head corner */}
        <circle cx="-168" cy="-110" r="6" fill="#F1F5F9" opacity="0.85" />
        <circle cx="-168" cy="-110" r="3" fill="#94A3B8" />
        {/* Trailing white cloth streamers falling down */}
        <path
          d="M -170 -106 C -178 -80, -165 -60, -172 -38 C -170 -38, -164 -40, -166 -62 C -162 -82, -165 -104, -167 -106 Z"
          fill="#E2E8F0"
          opacity="0.85"
        />
        <path
          d="M -166 -106 C -160 -85, -155 -65, -158 -46 C -156 -46, -152 -48, -154 -68 C -152 -86, -162 -104, -164 -106 Z"
          fill="#CBD5E1"
          opacity="0.65"
        />
      </g>

      {/* 7. Subtle Eerie Altar Incense Smoke rising from Coffin */}
      <g className="anim-smoke-rise" opacity="0.32" pointerEvents="none">
        <ellipse cx="-110" cy="-172" rx="35" ry="7" fill="#E2E8F0" opacity="0.18" />
        <ellipse cx="60" cy="-168" rx="42" ry="8" fill="#CBD5E1" opacity="0.14" />
      </g>
    </g>
  );
};

/**
 * 23. BAMBOO BED WITH MOSQUITO NET (Giường Tre Giăng Mùng)
 * Traditional rural bamboo bed with 4 corner posts and sheer translucent mosquito netting.
 * Bed surface positioned at Y = -80px to seamlessly accommodate pose_lying_down (offsetY: -80).
 * Anchored at [bottom-center] (0, 0) at Ground Y = 800px.
 */
const BambooBedNet: React.FC = () => {
  return (
    <g className="structure-bamboo-bed-net">
      {/* 1. Ground Shadow */}
      <ellipse cx="0" cy="-2" rx="205" ry="11" fill="#000000" opacity="0.65" />
      <ellipse cx="0" cy="-2" rx="150" ry="6" fill="#000000" opacity="0.4" />

      {/* 2. Rear Mosquito Net Backdrop (Layer behind bed & character) */}
      <polygon
        points="-180,-285 170,-285 160,-82 -170,-82"
        fill="#E2E8F0"
        fillOpacity="0.08"
      />
      {/* Vertical sheer curtain folds on rear wall */}
      <line x1="-100" y1="-285" x2="-95" y2="-82" stroke="#CBD5E1" strokeWidth="0.8" strokeOpacity="0.15" />
      <line x1="0" y1="-285" x2="0" y2="-82" stroke="#CBD5E1" strokeWidth="0.8" strokeOpacity="0.15" />
      <line x1="90" y1="-285" x2="85" y2="-82" stroke="#CBD5E1" strokeWidth="0.8" strokeOpacity="0.15" />

      {/* 3. Rear Bamboo Posts (Cọc mùng tre phía sau) */}
      {/* Rear Left Post */}
      <g opacity="0.8">
        <line x1="-165" y1="0" x2="-165" y2="-285" stroke="#16120E" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="-165" y1="0" x2="-165" y2="-285" stroke="#3D2B1C" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* Rear Right Post */}
      <g opacity="0.8">
        <line x1="155" y1="0" x2="155" y2="-285" stroke="#16120E" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="155" y1="0" x2="155" y2="-285" stroke="#3D2B1C" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* 4. Bed Platform & Mattress Frame (Khung & Giát giường tre Y = -80px) */}
      {/* Main horizontal bamboo beam supporting mat */}
      <rect x="-182" y="-85" width="364" height="15" rx="3" fill="#130F0B" stroke="#2B1E13" strokeWidth="1.5" />
      <line x1="-180" y1="-78" x2="180" y2="-78" stroke="#4A3421" strokeWidth="2" />
      {/* Bamboo nodes along horizontal beam */}
      {[-140, -90, -40, 10, 60, 110, 150].map((nx) => (
        <line key={`node-${nx}`} x1={nx} y1="-85" x2={nx} y2="-70" stroke="#6B4B30" strokeWidth="1.8" />
      ))}

      {/* Woven Reed Straw Mat on Bed Surface (Chiếu cói rải mặt giường Y = -82px) */}
      <polygon
        points="-178,-85 174,-85 168,-77 -172,-77"
        fill="#26231B"
        stroke="#453B2B"
        strokeWidth="1"
      />
      {/* Chiếu cói red fabric border binding at edges */}
      <rect x="-178" y="-84" width="8" height="8" fill="#7F1D1D" opacity="0.85" />
      <rect x="166" y="-84" width="8" height="8" fill="#7F1D1D" opacity="0.85" />

      {/* Bamboo Rolled Bolster Pillow (Gối tre / gối mây kê đầu bên trái) */}
      <ellipse cx="-135" cy="-92" rx="20" ry="10" fill="#1E1913" stroke="#4A3927" strokeWidth="1.5" />
      <ellipse cx="-135" cy="-92" rx="8" ry="4" fill="#0D0A07" />

      {/* 5. Front Bamboo Bed Legs touching ground Y = 0 */}
      {/* Front Left Leg */}
      <g>
        <rect x="-180" y="-80" width="12" height="80" rx="2" fill="#15110D" stroke="#2D1F14" strokeWidth="1.5" />
        <line x1="-180" y1="-45" x2="-168" y2="-45" stroke="#523924" strokeWidth="1.8" />
        <line x1="-180" y1="-18" x2="-168" y2="-18" stroke="#523924" strokeWidth="1.8" />
      </g>
      {/* Front Right Leg */}
      <g>
        <rect x="168" y="-80" width="12" height="80" rx="2" fill="#15110D" stroke="#2D1F14" strokeWidth="1.5" />
        <line x1="168" y1="-45" x2="180" y2="-45" stroke="#523924" strokeWidth="1.8" />
        <line x1="168" y1="-18" x2="180" y2="-18" stroke="#523924" strokeWidth="1.8" />
      </g>
      {/* Center Bed Leg for heavy stability */}
      <rect x="-6" y="-76" width="12" height="76" rx="2" fill="#0D0A08" stroke="#22170E" strokeWidth="1.2" />

      {/* 6. Front Tall Bamboo Net Poles (Cọc mùng tre phía trước) */}
      {/* Front Left Pole */}
      <g>
        <line x1="-174" y1="-80" x2="-174" y2="-288" stroke="#16120E" strokeWidth="6" strokeLinecap="round" />
        <line x1="-174" y1="-80" x2="-174" y2="-288" stroke="#453120" strokeWidth="3" strokeLinecap="round" />
        {/* Bamboo nodes */}
        {[-130, -180, -230, -280].map((ny) => (
          <ellipse key={`poleL-${ny}`} cx="-174" cy={ny} rx="4" ry="1.5" fill="#694C33" />
        ))}
      </g>
      {/* Front Right Pole */}
      <g>
        <line x1="174" y1="-80" x2="174" y2="-288" stroke="#16120E" strokeWidth="6" strokeLinecap="round" />
        <line x1="174" y1="-80" x2="174" y2="-288" stroke="#453120" strokeWidth="3" strokeLinecap="round" />
        {/* Bamboo nodes */}
        {[-130, -180, -230, -280].map((ny) => (
          <ellipse key={`poleR-${ny}`} cx="174" cy={ny} rx="4" ry="1.5" fill="#694C33" />
        ))}
      </g>

      {/* Top Horizontal Bamboo Frame (Thanh giằng nóc mùng Y = -288px) */}
      <rect x="-184" y="-293" width="368" height="7" rx="2" fill="#1A130D" stroke="#3D2918" strokeWidth="1.2" />

      {/* 7. Sheer Translucent Mosquito Net (Mùng vải mỏng rủ phủ quanh giường) */}
      {/* Top Roof Netting */}
      <polygon
        points="-186,-293 184,-293 176,-278 -178,-278"
        fill="#E2E8F0"
        fillOpacity="0.22"
        stroke="#CBD5E1"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      {/* Left Net Drape */}
      <path
        d="M -184 -288 C -192 -180, -186 -130, -188 -76 L -168 -76 C -166 -130, -172 -180, -172 -288 Z"
        fill="#E2E8F0"
        fillOpacity="0.18"
        stroke="#CBD5E1"
        strokeWidth="0.8"
        strokeOpacity="0.3"
      />
      {/* Right Net Drape */}
      <path
        d="M 184 -288 C 192 -180, 186 -130, 188 -76 L 168 -76 C 166 -130, 172 -180, 172 -288 Z"
        fill="#E2E8F0"
        fillOpacity="0.18"
        stroke="#CBD5E1"
        strokeWidth="0.8"
        strokeOpacity="0.3"
      />
      {/* Front Sheer Draping Curtain (Vải mùng trước - trong suốt nhìn thấu nhân vật bên trong) */}
      <polygon
        points="-174,-285 174,-285 180,-74 -180,-74"
        fill="#E2E8F0"
        fillOpacity="0.12"
      />
      {/* Organic folds & gathered loops on mosquito net */}
      <g stroke="#CBD5E1" strokeWidth="0.9" strokeOpacity="0.28" fill="none">
        <path d="M -174 -285 C -150 -180, -165 -130, -160 -74" />
        <path d="M -90 -285 C -75 -180, -85 -130, -80 -74" />
        <path d="M 0 -285 C 10 -180, -5 -130, 5 -74" />
        <path d="M 90 -285 C 80 -180, 95 -130, 85 -74" />
        <path d="M 174 -285 C 155 -180, 168 -130, 162 -74" />
      </g>
      {/* Corner Tied Ropes (Dây buộc mùng vào cọc) */}
      <circle cx="-174" cy="-285" r="4" fill="#E2E8F0" opacity="0.8" />
      <path d="M -174 -285 L -168 -270 M -174 -285 L -178 -268" stroke="#CBD5E1" strokeWidth="1.2" />
      <circle cx="174" cy="-285" r="4" fill="#E2E8F0" opacity="0.8" />
      <path d="M 174 -285 L 168 -270 M 174 -285 L 178 -268" stroke="#CBD5E1" strokeWidth="1.2" />

      {/* 8. Cold Night Fog hovering beneath bed */}
      <ellipse cx="0" cy="-35" rx="130" ry="12" fill="#CBD5E1" opacity="0.08" pointerEvents="none" />
    </g>
  );
};

/**
 * 24. CLOSE-UP WOODEN LATCH DOOR (Cánh Cửa Gỗ Cũ Cài Then Ngang)
 * Rustic vertical plank door with horizontal sliding bar latch and 15px threshold clearance gap.
 * Allows exterior night cold blue light & mud to seep through.
 * Anchored at [bottom-center] (0, 0) at Ground Y = 800px.
 */
const WoodenLatchDoor: React.FC = () => {
  return (
    <g className="structure-wooden-latch-door anim-door-shake">
      {/* 1. Heavy Outer Timber Door Jambs & Lintel (Khung bao cửa gỗ mít cổ) */}
      {/* Left Jamb */}
      <rect x="-132" y="-395" width="26" height="395" rx="2" fill="#090A0D" stroke="#1C1E26" strokeWidth="2" />
      {/* Right Jamb */}
      <rect x="106" y="-395" width="26" height="395" rx="2" fill="#090A0D" stroke="#1C1E26" strokeWidth="2" />
      {/* Top Lintel Beam */}
      <rect x="-144" y="-415" width="288" height="26" rx="3" fill="#0E1015" stroke="#252933" strokeWidth="2" />
      {/* Wooden Tenon Joints & Wall Brackets */}
      <rect x="-136" y="-350" width="6" height="18" fill="#374151" />
      <rect x="130" y="-350" width="6" height="18" fill="#374151" />
      <rect x="-136" y="-120" width="6" height="18" fill="#374151" />
      <rect x="130" y="-120" width="6" height="18" fill="#374151" />

      {/* 2. Cold Exterior Night Light Leaking Through Gap Behind Door */}
      <rect x="-106" y="-388" width="212" height="388" fill="#04060A" />

      {/* 3. 6 Vertical Rough Wooden Door Planks (Ván cửa ghép) */}
      {[
        { x: -106, w: 34, id: "p1" },
        { x: -70, w: 34, id: "p2" },
        { x: -34, w: 34, id: "p3" },
        { x: 2, w: 33, id: "p4" },
        { x: 37, w: 34, id: "p5" },
        { x: 73, w: 33, id: "p6" },
      ].map((p, idx) => (
        <g key={p.id}>
          {/* Plank Board (Stops at Y = -16px, leaving 16px bottom clearance gap!) */}
          <rect
            x={p.x}
            y="-388"
            width={p.w}
            height="372"
            fill={idx % 2 === 0 ? "#0C0D12" : "#111319"}
            stroke="#1B1D26"
            strokeWidth="1.2"
          />
          {/* Weathered wood grains & fissures */}
          <line
            x1={p.x + p.w * 0.35}
            y1="-370"
            x2={p.x + p.w * 0.4}
            y2="-30"
            stroke="#08080C"
            strokeWidth="0.8"
          />
          {/* Rusty square nail studs */}
          <rect x={p.x + p.w / 2 - 2} y="-360" width="4" height="4" fill="#3B2A1E" />
          <rect x={p.x + p.w / 2 - 2} y="-60" width="4" height="4" fill="#3B2A1E" />
        </g>
      ))}

      {/* Vertical Gap Slits between planks leaking cold night blue fog/light */}
      {[-71, -35, 1, 36, 72].map((gx, idx) => (
        <line
          key={`gap-${idx}`}
          x1={gx}
          y1="-385"
          x2={gx}
          y2="-18"
          stroke="#38BDF8"
          strokeWidth="1"
          opacity="0.38"
        />
      ))}

      {/* 4. Bottom Clearance Gap (Khe hở chân cửa 15px sát đất Y = 0) */}
      {/* Light leakage through bottom clearance */}
      <rect x="-106" y="-16" width="212" height="16" fill="#1E293B" opacity="0.6" />
      <line x1="-106" y1="-16" x2="106" y2="-16" stroke="#475569" strokeWidth="1.5" />
      {/* Cold white/blue fog drifting under the door threshold */}
      <ellipse cx="0" cy="-4" rx="90" ry="6" fill="#93C5FD" opacity="0.25" />

      {/* 5. Horizontal Slide Wooden Latch Bar (Then cài gỗ ngang tại Y = -220px) */}
      {/* Relative Y = -220px corresponds to Y = 580px when Ground is Y = 800px (800 - 220 = 580) */}
      <g className="wooden-latch">
        {/* Latch Mounting Retaining Brackets (Cối then trái & phải bắt vít vào khung) */}
        {/* Left bracket on door */}
        <rect x="-85" y="-238" width="18" height="36" rx="2" fill="#08090C" stroke="#252933" strokeWidth="1.5" />
        <circle cx="-76" cy="-230" r="2.5" fill="#4B5563" />
        <circle cx="-76" cy="-210" r="2.5" fill="#4B5563" />
        {/* Center bracket on door */}
        <rect x="-8" y="-238" width="18" height="36" rx="2" fill="#08090C" stroke="#252933" strokeWidth="1.5" />
        <circle cx="1" cy="-230" r="2.5" fill="#4B5563" />
        <circle cx="1" cy="-210" r="2.5" fill="#4B5563" />
        {/* Right bracket on door jamb */}
        <rect x="68" y="-238" width="18" height="36" rx="2" fill="#08090C" stroke="#252933" strokeWidth="1.5" />
        <circle cx="77" cy="-230" r="2.5" fill="#4B5563" />
        <circle cx="77" cy="-210" r="2.5" fill="#4B5563" />

        {/* Heavy Carved Horizontal Wooden Slide Bar (Thanh then cài ngang) */}
        <rect
          x="-126"
          y="-232"
          width="248"
          height="24"
          rx="3"
          fill="#1C150E"
          stroke="#3D2E20"
          strokeWidth="2"
        />
        {/* Wood grain highlight along top edge of latch */}
        <line x1="-124" y1="-230" x2="120" y2="-230" stroke="#5E4733" strokeWidth="1.8" />
        {/* Safety Wedge Pin (Chốt nêm then) */}
        <polygon points="-58,-244 -52,-244 -54,-208 -56,-208" fill="#451A03" stroke="#78350F" strokeWidth="1" />
        {/* Hanging security hemp cord */}
        <path d="M -55 -208 C -58 -185, -48 -175, -52 -155" fill="none" stroke="#78350F" strokeWidth="1.2" strokeDasharray="3,2" />
      </g>

      {/* 6. Old Cast Iron Door Pull Ring (Khuyên sắt kéo cửa cổ) */}
      <g transform="translate(68, -165)">
        <circle cx="0" cy="0" r="8" fill="#111319" stroke="#374151" strokeWidth="2" />
        <circle cx="0" cy="14" r="14" fill="none" stroke="#475569" strokeWidth="3.5" />
        <ellipse cx="0" cy="22" rx="3" ry="1.5" fill="#94A3B8" />
      </g>
    </g>
  );
};

/**
 * 25. RURAL PASSENGER BUS (Xe Đò Quê Miền Tây)
 * Vintage 1990s rural passenger bus exterior side profile.
 * Features rounded retro bodywork, roof luggage rack piled with cargo, and warm headlights.
 * Anchored at [bottom-center] (0, 0) at Ground Y = 800px.
 */
const RuralPassengerBus: React.FC = () => {
  return (
    <g className="structure-rural-passenger-bus">
      {/* 1. Ground Contact Shadow */}
      <ellipse cx="10" cy="-2" rx="275" ry="12" fill="#000000" opacity="0.75" />
      <ellipse cx="10" cy="-2" rx="220" ry="7" fill="#000000" opacity="0.5" />

      {/* 2. Headlight Beam (Luồng ánh sáng vàng mờ chiếu sáng mặt đường phía trước) */}
      <polygon
        points="268,-92 530,-155 560,0 268,-65"
        fill="#FDE047"
        opacity="0.22"
      />
      {/* Secondary softer outer light scatter */}
      <polygon
        points="268,-92 545,-180 580,0 268,-50"
        fill="#FEF08A"
        opacity="0.1"
      />

      {/* 3. Main Retro Bus Chassis & Body Silhouette */}
      {/* Main Hull Shape (Length: 520px, Height: 230px, facing Right) */}
      <path
        d="M -250 -45 
           L -250 -185 
           C -250 -215, -230 -228, -190 -230 
           L 180 -230 
           C 220 -228, 255 -205, 265 -160 
           L 272 -105 
           C 274 -90, 270 -60, 265 -45 
           L 260 -45 
           C 255 -45, 230 -45, 222 -45 
           C 222 -75, 150 -75, 150 -45 
           L -125 -45 
           C -125 -75, -200 -75, -200 -45 
           Z"
        fill="#0D0F14"
        stroke="#1F2430"
        strokeWidth="2.5"
      />

      {/* Retro Lower Body Trim Band / Two-Tone Stripe */}
      <path
        d="M -248 -80 L 268 -80 L 265 -52 C 255 -52, 230 -52, 222 -52 C 222 -75, 150 -75, 150 -52 L -125 -52 C -125 -75, -200 -75, -200 -52 L -248 -52 Z"
        fill="#1A202C"
        stroke="#2D3748"
        strokeWidth="1"
      />
      {/* Vintage decorative red accent pinstripe */}
      <line x1="-248" y1="-80" x2="268" y2="-80" stroke="#7F1D1D" strokeWidth="2.5" />

      {/* 4. Roof Luggage Rack (Giá để hàng trên nóc xe chở đầy thùng bọc bạt) */}
      {/* Steel pipe rack frame */}
      <rect x="-225" y="-242" width="405" height="12" fill="none" stroke="#374151" strokeWidth="2.5" rx="2" />
      <line x1="-220" y1="-230" x2="-220" y2="-242" stroke="#374151" strokeWidth="2" />
      <line x1="-120" y1="-230" x2="-120" y2="-242" stroke="#374151" strokeWidth="2" />
      <line x1="-20" y1="-230" x2="-20" y2="-242" stroke="#374151" strokeWidth="2" />
      <line x1="80" y1="-230" x2="80" y2="-242" stroke="#374151" strokeWidth="2" />
      <line x1="180" y1="-230" x2="180" y2="-242" stroke="#374151" strokeWidth="2" />
      {/* Bulging luggage cargo & tarpaulin bundles on roof */}
      <path
        d="M -215 -242 
           C -210 -265, -170 -270, -150 -255 
           C -130 -272, -80 -275, -60 -250 
           C -40 -270, 20 -272, 45 -252 
           C 65 -268, 120 -265, 140 -248 
           C 155 -258, 175 -252, 175 -242 Z"
        fill="#07080B"
        stroke="#1F2937"
        strokeWidth="2"
      />
      {/* Cargo tie-down ropes (Dây thừng chằng hàng) */}
      <g stroke="#D97706" strokeWidth="1.2" opacity="0.6">
        <line x1="-190" y1="-242" x2="-155" y2="-265" />
        <line x1="-140" y1="-242" x2="-100" y2="-270" />
        <line x1="-50" y1="-242" x2="-10" y2="-268" />
        <line x1="50" y1="-242" x2="90" y2="-262" />
        <line x1="130" y1="-242" x2="165" y2="-252" />
      </g>

      {/* 5. Passenger Windows & Doors */}
      {/* Front Curved Windshield Glass */}
      <path
        d="M 215 -215 C 238 -208, 252 -185, 258 -150 L 222 -150 L 208 -215 Z"
        fill="#0B1320"
        stroke="#334155"
        strokeWidth="1.8"
      />
      {/* Windshield wiper */}
      <line x1="225" y1="-150" x2="242" y2="-180" stroke="#475569" strokeWidth="2" />

      {/* Row of 4 Side Passenger Windows */}
      {[
        { x: -115, w: 50, id: "w1" },
        { x: -50, w: 50, id: "w2" },
        { x: 15, w: 50, id: "w3" },
        { x: 80, w: 50, id: "w4" },
      ].map((w) => (
        <g key={w.id}>
          {/* Window Frame */}
          <rect
            x={w.x}
            y="-210"
            width={w.w}
            height="70"
            rx="5"
            fill="#09101C"
            stroke="#1F2937"
            strokeWidth="2"
          />
          {/* Subtle Seat Headrest silhouette inside bus */}
          <ellipse cx={w.x + 18} cy="-165" rx="9" ry="12" fill="#05070A" />
          <ellipse cx={w.x + 36} cy="-165" rx="9" ry="12" fill="#05070A" />
          {/* Cold night window glass reflection diagonal slash */}
          <path
            d={`M ${w.x + 8} -145 L ${w.x + 32} -205`}
            stroke="#475569"
            strokeWidth="1"
            opacity="0.45"
          />
        </g>
      ))}

      {/* Rear Passenger Window */}
      <rect x="-238" y="-208" width="55" height="68" rx="5" fill="#09101C" stroke="#1F2937" strokeWidth="2" />
      <path d="M -230 -145 L -205 -202" stroke="#475569" strokeWidth="1" opacity="0.45" />

      {/* Passenger Boarding Door (Cửa lên xuống dạng gấp) at Front */}
      <g transform="translate(142, -210)">
        <rect x="0" y="0" width="55" height="158" rx="2" fill="#0A0D13" stroke="#252D3D" strokeWidth="2" />
        <line x1="27" y1="0" x2="27" y2="158" stroke="#1F2937" strokeWidth="2" />
        {/* Door Glass Panes */}
        <rect x="4" y="8" width="19" height="65" rx="2" fill="#0B1320" stroke="#334155" strokeWidth="1" />
        <rect x="31" y="8" width="19" height="65" rx="2" fill="#0B1320" stroke="#334155" strokeWidth="1" />
        <rect x="4" y="85" width="19" height="55" rx="2" fill="#0B1320" stroke="#334155" strokeWidth="1" />
        <rect x="31" y="85" width="19" height="55" rx="2" fill="#0B1320" stroke="#334155" strokeWidth="1" />
        <circle cx="23" cy="80" r="2.5" fill="#E2E8F0" />
      </g>

      {/* Destination Sign Box above Windshield */}
      <rect x="185" y="-228" width="52" height="14" rx="2" fill="#05070A" stroke="#475569" strokeWidth="1" />
      <text x="211" y="-218" fill="#FACC15" fontSize="6.5" fontFamily="monospace" textAnchor="middle" opacity="0.8">
        XE ĐÒ
      </text>

      {/* 6. Heavy Rubber Bus Wheels (Bánh xe đôi sau và bánh trước) */}
      {/* Front Wheel at (186, -36) */}
      <g className="wheel-front">
        <circle cx="186" cy="-36" r="36" fill="#060709" stroke="#1F2937" strokeWidth="2" />
        <circle cx="186" cy="-36" r="22" fill="#1A202C" stroke="#2D3748" strokeWidth="2" />
        <circle cx="186" cy="-36" r="10" fill="#0F172A" />
        {/* Lug nuts */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <circle
            key={`nutF-${deg}`}
            cx={186 + 15 * Math.cos((deg * Math.PI) / 180)}
            cy={-36 + 15 * Math.sin((deg * Math.PI) / 180)}
            r="2"
            fill="#64748B"
          />
        ))}
      </g>
      {/* Rear Dual Wheels at (-162, -36) */}
      <g className="wheel-rear">
        <circle cx="-162" cy="-36" r="36" fill="#060709" stroke="#1F2937" strokeWidth="2" />
        <circle cx="-162" cy="-36" r="22" fill="#1A202C" stroke="#2D3748" strokeWidth="2" />
        <circle cx="-162" cy="-36" r="10" fill="#0F172A" />
        {/* Lug nuts */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <circle
            key={`nutR-${deg}`}
            cx={-162 + 15 * Math.cos((deg * Math.PI) / 180)}
            cy={-36 + 15 * Math.sin((deg * Math.PI) / 180)}
            r="2"
            fill="#64748B"
          />
        ))}
      </g>

      {/* 7. Front Headlights & Bumpers */}
      {/* Chrome Bumper */}
      <rect x="258" y="-62" width="18" height="15" rx="3" fill="#334155" stroke="#64748B" strokeWidth="1" />
      <rect x="-256" y="-62" width="14" height="14" rx="2" fill="#1E293B" />
      {/* Round Front Headlight */}
      <g>
        <circle cx="268" cy="-88" r="9" fill="#FACC15" stroke="#FDE047" strokeWidth="1.5" />
        <circle cx="268" cy="-88" r="5" fill="#FEF08A" />
        <ellipse cx="270" cy="-90" rx="2" ry="1.2" fill="#FFFFFF" />
      </g>
      {/* Orange Turn Signal */}
      <circle cx="267" cy="-105" r="4.5" fill="#EA580C" stroke="#F97316" strokeWidth="1" />

      {/* Rear Tail Light */}
      <rect x="-252" y="-95" width="4" height="18" rx="1" fill="#DC2626" opacity="0.9" />

      {/* Side Exhaust Pipe puffing faint road smoke */}
      <ellipse cx="-230" cy="-32" rx="4" ry="2.5" fill="#374151" />
      <g className="anim-smoke-rise" opacity="0.25" pointerEvents="none">
        <circle cx="-252" cy="-30" r="10" fill="#4B5563" />
        <circle cx="-275" cy="-28" r="16" fill="#374151" />
      </g>
    </g>
  );
};

/**
 * 26. COCONUT & BANANA GROVE (Rặng Dừa Nước & Bụi Chuối Rậm Rạp)
 * Authentic Mekong Delta waterway vegetation for framing rural scenes.
 * Features a leaning coconut palm with comb-serrated fronds and wild banana clump with large drooping ragged leaves.
 * Anchored at [bottom-center] (0, 0) at Ground Y = 800px.
 */
const CoconutBananaGrove: React.FC = () => {
  return (
    <g className="structure-coconut-banana-grove">
      {/* 1. Ground Shadow & Root Base */}
      <ellipse cx="0" cy="-2" rx="175" ry="10" fill="#000000" opacity="0.75" />
      <ellipse cx="-40" cy="-2" rx="120" ry="7" fill="#000000" opacity="0.5" />

      {/* 2. Leaning Coconut Palm Trunk (Thân cây dừa vươn nghiêng duyên dáng) */}
      {/* Sweeps from base (-45, 0) curving up to (35, -420) */}
      <path
        d="M -56 0 
           C -58 -90, -42 -180, -18 -260 
           C 2 -330, 22 -380, 28 -425 
           L 44 -425 
           C 36 -380, 18 -330, -2 -260 
           C -26 -180, -40 -90, -38 0 Z"
        fill="#0B0E12"
        stroke="#1E232B"
        strokeWidth="1.5"
      />
      {/* Ringed bark ridges along trunk */}
      {[-50, -110, -170, -230, -290, -345, -395].map((ry, idx) => (
        <line
          key={`bark-${idx}`}
          x1={-45 + idx * 11}
          y1={ry}
          x2={-32 + idx * 11}
          y2={ry - 2}
          stroke="#2A323D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}

      {/* 3. Coconut Crown & Fruits at (36, -425) */}
      <g transform="translate(36, -425)">
        {/* Cluster of coconuts under the frond base */}
        <circle cx="-12" cy="10" r="9" fill="#06080A" stroke="#171D24" strokeWidth="1.2" />
        <circle cx="2" cy="14" r="8.5" fill="#080B0E" stroke="#171D24" strokeWidth="1.2" />
        <circle cx="14" cy="9" r="8" fill="#06080A" stroke="#171D24" strokeWidth="1.2" />

        {/* 7 Arching Pinnate Fronds with Serrated Comb Leaflets */}
        {/* Frond 1: Arching Left-Down */}
        <g>
          <path d="M 0 0 C -60 -40, -140 -20, -180 40" fill="none" stroke="#0B0E12" strokeWidth="4" />
          <path
            d="M 0 0 
               C -40 -35, -110 -25, -175 35 
               C -155 15, -100 -40, -40 -45 Z"
            fill="#0E1217"
            stroke="#171D24"
            strokeWidth="1"
          />
          {/* Serrated comb leaflets */}
          {[-40, -80, -120, -155].map((lx, i) => (
            <line
              key={`f1-${i}`}
              x1={lx}
              y1={-30 + i * 14}
              x2={lx - 16}
              y2={-10 + i * 16}
              stroke="#090B0E"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Frond 2: High Arching Left */}
        <g>
          <path d="M 0 0 C -50 -70, -120 -80, -165 -30" fill="none" stroke="#0B0E12" strokeWidth="4" />
          <path
            d="M 0 0 
               C -45 -65, -110 -75, -160 -30 
               C -130 -85, -60 -80, 0 0 Z"
            fill="#090B0E"
          />
          {[-35, -75, -115, -145].map((lx, i) => (
            <line
              key={`f2-${i}`}
              x1={lx}
              y1={-60 + i * 7}
              x2={lx - 12}
              y2={-40 + i * 8}
              stroke="#131920"
              strokeWidth="1.8"
            />
          ))}
        </g>

        {/* Frond 3: Soaring Center Upright */}
        <g>
          <path d="M 0 0 C -15 -90, 0 -130, 25 -145" fill="none" stroke="#0B0E12" strokeWidth="3.5" />
          <path
            d="M 0 0 
               C -12 -80, 0 -125, 25 -145 
               C 10 -115, 12 -70, 0 0 Z"
            fill="#0E1318"
          />
        </g>

        {/* Frond 4: Arching High Right */}
        <g>
          <path d="M 0 0 C 45 -70, 115 -75, 160 -25" fill="none" stroke="#0B0E12" strokeWidth="4" />
          <path
            d="M 0 0 
               C 40 -65, 105 -70, 155 -25 
               C 125 -80, 55 -75, 0 0 Z"
            fill="#090B0E"
          />
          {[35, 75, 115, 145].map((rx, i) => (
            <line
              key={`f4-${i}`}
              x1={rx}
              y1={-60 + i * 7}
              x2={rx + 12}
              y2={-40 + i * 8}
              stroke="#131920"
              strokeWidth="1.8"
            />
          ))}
        </g>

        {/* Frond 5: Arching Right-Down */}
        <g>
          <path d="M 0 0 C 60 -40, 140 -20, 185 45" fill="none" stroke="#0B0E12" strokeWidth="4" />
          <path
            d="M 0 0 
               C 40 -35, 110 -25, 180 40 
               C 160 15, 105 -40, 45 -45 Z"
            fill="#0E1217"
            stroke="#171D24"
            strokeWidth="1"
          />
          {[40, 80, 120, 160].map((rx, i) => (
            <line
              key={`f5-${i}`}
              x1={rx}
              y1={-30 + i * 14}
              x2={rx + 16}
              y2={-10 + i * 16}
              stroke="#090B0E"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Frond 6: Drooping Low Left */}
        <path d="M 0 0 C -30 20, -75 40, -110 75" fill="none" stroke="#080A0D" strokeWidth="3" />
        {/* Frond 7: Drooping Low Right */}
        <path d="M 0 0 C 30 20, 75 40, 115 75" fill="none" stroke="#080A0D" strokeWidth="3" />
      </g>

      {/* 4. Wild Banana Grove at Base (Bụi chuối xiêm rậm rạp che chân dừa) */}
      {/* Left Banana Stem */}
      <path d="M -125 0 C -122 -60, -112 -120, -100 -160 L -86 -160 C -98 -120, -108 -60, -108 0 Z" fill="#0A0E0C" />
      {/* Center Large Banana Stem */}
      <path d="M -30 0 C -25 -70, -15 -140, 0 -190 L 16 -190 C 2 -140, -8 -70, -12 0 Z" fill="#080C0A" />
      {/* Right Banana Stem */}
      <path d="M 60 0 C 62 -55, 68 -110, 80 -150 L 92 -150 C 82 -110, 75 -55, 74 0 Z" fill="#0A0E0C" />

      {/* Massive Broad Drooping Ragged Banana Leaves (Tàu lá chuối to bản rách răng cưa) */}
      {/* Leaf 1: Arching Left with Wind Tears */}
      <path
        d="M -100 -160 
           C -140 -195, -195 -180, -225 -130 
           C -205 -125, -190 -140, -170 -135 
           C -155 -120, -145 -145, -125 -145 
           C -105 -150, -102 -155, -100 -160 Z"
        fill="#0A120E"
        stroke="#14211A"
        strokeWidth="1.2"
      />
      <line x1="-100" y1="-160" x2="-220" y2="-130" stroke="#192A21" strokeWidth="2" />

      {/* Leaf 2: High Arching Up-Right */}
      <path
        d="M 0 -190 
           C 30 -245, 90 -255, 145 -220 
           C 125 -210, 110 -225, 90 -215 
           C 70 -205, 55 -220, 35 -210 
           C 15 -200, 5 -195, 0 -190 Z"
        fill="#070D0A"
        stroke="#111B15"
        strokeWidth="1.2"
      />
      <line x1="0" y1="-190" x2="140" y2="-220" stroke="#17261E" strokeWidth="2.2" />

      {/* Leaf 3: Drooping Far Right */}
      <path
        d="M 80 -150 
           C 120 -185, 175 -170, 205 -115 
           C 185 -110, 170 -125, 150 -120 
           C 135 -105, 120 -130, 100 -130 
           Z"
        fill="#0A120E"
        stroke="#14211A"
        strokeWidth="1.2"
      />
      <line x1="80" y1="-150" x2="200" y2="-115" stroke="#192A21" strokeWidth="2" />

      {/* Leaf 4: Foreground Drooping Center Leaf */}
      <path
        d="M -10 -140 
           C -40 -120, -70 -70, -85 -10 
           C -75 -15, -60 -40, -45 -50 
           C -30 -60, -15 -100, -10 -140 Z"
        fill="#0D1712"
        stroke="#1B2E24"
        strokeWidth="1.2"
      />

      {/* Purple Banana Heart / Blossom (Bắp chuối đỏ tím treo lủng lẳng) */}
      <g transform="translate(18, -135)">
        {/* Curved stem */}
        <path d="M 0 0 C 5 25, 15 35, 18 55" fill="none" stroke="#14211A" strokeWidth="3" />
        {/* Pendant teardrop blossom */}
        <path
          d="M 18 55 
             C 10 65, 8 85, 18 100 
             C 28 85, 26 65, 18 55 Z"
          fill="#4A0404"
          stroke="#7F1D1D"
          strokeWidth="1.2"
        />
        <line x1="18" y1="58" x2="18" y2="95" stroke="#991B1B" strokeWidth="1" opacity="0.6" />
      </g>

      {/* 5. Young Banana Shoots (Cây chuối tơ) & Wild Swamp Grass at Base */}
      <path d="M -75 0 L -80 -45 L -72 -45 Z" fill="#0D1611" />
      <path d="M 45 0 L 52 -55 L 58 -55 Z" fill="#0D1611" />
      <g stroke="#09110D" strokeWidth="2" strokeLinecap="round">
        <line x1="-140" y1="0" x2="-148" y2="-25" />
        <line x1="-132" y1="0" x2="-135" y2="-32" />
        <line x1="110" y1="0" x2="116" y2="-30" />
        <line x1="125" y1="0" x2="135" y2="-22" />
      </g>
    </g>
  );
};

/**
 * 27. WOODEN CHAIR (Ghế Gỗ Tựa Gia Đình)
 * Classic home wooden armchair with elegant spindled backrest, curved crest rail, and turned legs.
 * Clean, rustic, everyday design without horror elements.
 * Seat surface positioned at Y = -72px, perfectly accommodating pose_sitting and pose_sitting_twisted_legs.
 * Anchored at [bottom-center] (0, 0) at Ground Line Y = 800px.
 */
const WoodenChair: React.FC = () => {
  return (
    <g className="structure-wooden-chair">
      {/* 1. Floor Shadow */}
      <ellipse cx="6" cy="-2" rx="42" ry="5.5" fill="#000000" opacity="0.5" />
      <ellipse cx="6" cy="-2" rx="58" ry="8" fill="#000000" opacity="0.2" />

      {/* 2. Rear Legs (Chân sau vươn từ sàn lên đỉnh tựa lưng) */}
      <g opacity="0.95">
        <line x1="-24" y1="-68" x2="-26" y2="0" stroke="#16120F" strokeWidth="6" strokeLinecap="round" />
        <line x1="-24" y1="-68" x2="-26" y2="0" stroke="#3D2E24" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      {/* Far Rear Leg */}
      <g opacity="0.75">
        <line x1="-15" y1="-68" x2="-16" y2="0" stroke="#0F0C0A" strokeWidth="5" strokeLinecap="round" />
        <line x1="-15" y1="-68" x2="-16" y2="0" stroke="#2B2018" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* 3. Lower Wooden Stretchers / Rungs (Thanh giằng chân ghế vững chãi) */}
      <line x1="-25" y1="-20" x2="33" y2="-20" stroke="#221A14" strokeWidth="3.5" />
      <line x1="-25" y1="-20" x2="33" y2="-20" stroke="#453326" strokeWidth="1.5" />
      <line x1="-24" y1="-10" x2="31" y2="-10" stroke="#1B140F" strokeWidth="2.8" />

      {/* 4. Front Legs (Chân trước) */}
      {/* Far Front Leg */}
      <g opacity="0.8">
        <line x1="22" y1="-68" x2="23" y2="0" stroke="#120E0B" strokeWidth="5" strokeLinecap="round" />
        <line x1="22" y1="-68" x2="23" y2="0" stroke="#36281E" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      {/* Near Front Leg - tiện tròn tinh tế */}
      <g>
        <line x1="33" y1="-68" x2="34" y2="0" stroke="#18130F" strokeWidth="6" strokeLinecap="round" />
        <line x1="33" y1="-68" x2="34" y2="0" stroke="#4A3729" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="33.5" cy="-48" rx="4.5" ry="2" fill="#5E4634" />
        <ellipse cx="33.8" cy="-14" rx="4.5" ry="2" fill="#5E4634" />
      </g>

      {/* 5. Chair Seat (Mặt ngồi ván gỗ Y = -72px vừa khít đùi nhân vật ngồi) */}
      <polygon
        points="-28,-73 38,-73 34,-63 -24,-63"
        fill="#211A14"
        stroke="#382B20"
        strokeWidth="1.4"
      />
      {/* Beveled wooden edge highlight */}
      <line x1="-27" y1="-73" x2="37" y2="-73" stroke="#5E4735" strokeWidth="2" />
      <line x1="-26" y1="-71" x2="36" y2="-71" stroke="#33251A" strokeWidth="1" />

      {/* 6. Spindled High Backrest (Tựa lưng nan gỗ cao từ Y = -72px lên Y = -198px) */}
      {/* Upright Back Post */}
      <g>
        <line x1="-24" y1="-72" x2="-25" y2="-198" stroke="#18130F" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="-24" y1="-72" x2="-25" y2="-198" stroke="#473426" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="-25" cy="-201" r="3.5" fill="#3D2B1E" stroke="#5A402D" strokeWidth="1" />
      </g>

      {/* Spindles (3 nan tựa lưng dọc) */}
      {[-18, -10, -2].map((spX, idx) => (
        <g key={`chair-spindle-${idx}`}>
          <line x1={spX} y1="-72" x2={spX - 0.8} y2="-192" stroke="#1C1510" strokeWidth="3.2" />
          <line x1={spX} y1="-72" x2={spX - 0.8} y2="-192" stroke="#4E3929" strokeWidth="1.2" />
          <ellipse cx={spX - 0.4} cy="-135" rx="2.4" ry="1.8" fill="#614733" />
        </g>
      ))}

      {/* Curved Crest Rail (Thanh đỉnh tựa lưng uốn cong nhã nhặn) */}
      <path
        d="M -29 -196 
           C -18 -206, 0 -206, 10 -196 
           L 8 -188 
           C -1 -197, -17 -197, -27 -188 
           Z"
        fill="#221A13"
        stroke="#453325"
        strokeWidth="1.5"
      />

      {/* 7. Curved Wooden Armrest (Tay vịn gỗ gia đình) */}
      <path
        d="M -24 -115 C -10 -120, 14 -118, 27 -105"
        fill="none"
        stroke="#1A140F"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M -24 -115 C -10 -120, 14 -118, 27 -105"
        fill="none"
        stroke="#523C2B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="27" cy="-105" r="3.8" fill="#332419" stroke="#5E4532" strokeWidth="1" />
      {/* Armrest vertical support post down to seat */}
      <line x1="25" y1="-103" x2="25" y2="-72" stroke="#1D1611" strokeWidth="3.5" />
      <line x1="25" y1="-103" x2="25" y2="-72" stroke="#4A3627" strokeWidth="1.6" />
    </g>
  );
};

/**
 * 28. WOODEN BED (Giường Ngủ Gỗ Gia Đình)
 * Traditional home wooden bed with clean sturdy headboard, neat sleeping mat,
 * comfortable bolster pillow, and warm folded quilt.
 * Standard domestic bedroom furniture without horror elements.
 * Bed sleeping surface positioned at Y = -80px to perfectly accommodate pose_lying_down (offsetY: -80)
 * and pose_sitting (seated at bed edge).
 * Anchored at [bottom-center] (0, 0) at Ground Line Y = 800px.
 */
const WoodenBed: React.FC = () => {
  return (
    <g className="structure-wooden-bed">
      {/* 1. Natural Ground Shadow */}
      <ellipse cx="0" cy="-2" rx="155" ry="9" fill="#000000" opacity="0.5" />
      <ellipse cx="0" cy="-2" rx="175" ry="14" fill="#000000" opacity="0.2" />

      {/* 2. Headboard Panel & Posts (Thành đầu giường bên trái X = -135px, cao Y = -195px) */}
      {/* Headboard Corner Post */}
      <g>
        <rect x="-142" y="-195" width="15" height="195" rx="2" fill="#17120D" stroke="#312419" strokeWidth="1.6" />
        <line x1="-134.5" y1="-193" x2="-134.5" y2="0" stroke="#4D3828" strokeWidth="2.2" />
        <circle cx="-134.5" cy="-201" r="5" fill="#2E2016" stroke="#523B2A" strokeWidth="1.2" />
        <circle cx="-134.5" cy="-206" r="2" fill="#694C35" />
      </g>

      {/* Headboard Solid Wood Paneling */}
      <polygon
        points="-138,-80 -82,-80 -82,-185 -138,-190"
        fill="#1C1611"
        stroke="#36281D"
        strokeWidth="1.5"
      />
      {/* Headboard Top Cap Rail */}
      <rect x="-140" y="-193" width="60" height="9" rx="2" fill="#281F17" stroke="#4A3728" strokeWidth="1.2" />
      {/* Vertical Wood Plank Lines */}
      <line x1="-122" y1="-188" x2="-122" y2="-80" stroke="#3D2D1F" strokeWidth="1.4" />
      <line x1="-106" y1="-186" x2="-106" y2="-80" stroke="#3D2D1F" strokeWidth="1.4" />
      <line x1="-92" y1="-184" x2="-92" y2="-80" stroke="#3D2D1F" strokeWidth="1.4" />

      {/* 3. Footboard Panel & Post (Thành đuôi giường bên phải X = +135px, cao Y = -125px) */}
      {/* Footboard Corner Post */}
      <g>
        <rect x="127" y="-125" width="14" height="125" rx="2" fill="#17120D" stroke="#312419" strokeWidth="1.6" />
        <line x1="134" y1="-123" x2="134" y2="0" stroke="#4D3828" strokeWidth="2.2" />
        <circle cx="134" cy="-130" r="4.5" fill="#2E2016" stroke="#523B2A" strokeWidth="1.2" />
      </g>
      {/* Footboard Wood Board */}
      <polygon
        points="86,-80 130,-80 130,-115 86,-115"
        fill="#1C1611"
        stroke="#36281D"
        strokeWidth="1.5"
      />
      <rect x="84" y="-118" width="48" height="7" rx="1.5" fill="#281F17" stroke="#4A3728" strokeWidth="1.2" />

      {/* 4. Heavy Horizontal Bed Frame Rail (Xà dầm đỡ mặt giường Y = -80px) */}
      <rect x="-140" y="-83" width="280" height="15" rx="2" fill="#1A140F" stroke="#36271C" strokeWidth="1.6" />
      <line x1="-138" y1="-76" x2="138" y2="-76" stroke="#523C2B" strokeWidth="2" />
      {/* Wooden joint pegs */}
      {[-100, -50, 0, 50, 100].map((px) => (
        <circle key={`bed-peg-${px}`} cx={px} cy="-76" r="2" fill="#6E4F39" />
      ))}

      {/* 5. Front Bed Legs touching ground Y = 0 */}
      {/* Left Front Leg */}
      <g>
        <rect x="-138" y="-76" width="14" height="76" rx="2" fill="#16110D" stroke="#2D2016" strokeWidth="1.5" />
        <line x1="-131" y1="-76" x2="-131" y2="0" stroke="#453222" strokeWidth="2" />
        <ellipse cx="-131" cy="-38" rx="5.5" ry="2" fill="#583F2B" />
      </g>
      {/* Right Front Leg */}
      <g>
        <rect x="124" y="-76" width="14" height="76" rx="2" fill="#16110D" stroke="#2D2016" strokeWidth="1.5" />
        <line x1="131" y1="-76" x2="131" y2="0" stroke="#453222" strokeWidth="2" />
        <ellipse cx="131" cy="-38" rx="5.5" ry="2" fill="#583F2B" />
      </g>
      {/* Center Stability Leg */}
      <rect x="-6" y="-72" width="12" height="72" rx="2" fill="#100C09" stroke="#261A12" strokeWidth="1.2" />

      {/* 6. Sleeping Surface & Woven Mat (Mặt nệm / chiếu nằm phẳng phiu Y = -80px) */}
      <polygon
        points="-134,-83 130,-83 126,-72 -130,-72"
        fill="#2A221A"
        stroke="#483B2D"
        strokeWidth="1.2"
      />
      <line x1="-132" y1="-83" x2="128" y2="-83" stroke="#69553E" strokeWidth="1.8" />
      {/* Neat fabric border at mat edges */}
      <rect x="-133" y="-83" width="8" height="8" fill="#5A3A28" opacity="0.8" />
      <rect x="120" y="-83" width="8" height="8" fill="#5A3A28" opacity="0.8" />

      {/* Comfortable Bolster Pillow (Gối kê đầu bên trái X = -65, Y = -88) */}
      <ellipse cx="-65" cy="-88" rx="23" ry="9.5" fill="#24201B" stroke="#4C4135" strokeWidth="1.5" />
      <ellipse cx="-65" cy="-88" rx="12" ry="4.5" fill="#14110E" />

      {/* 7. Folded Home Quilt / Blanket (Chăn đắp gia đình gấp gọn gàng phẳng phiu) */}
      <g>
        {/* Main folded quilt draped over lower portion */}
        <polygon
          points="20,-83 120,-83 118,-52 24,-52"
          fill="#2C3540"
          stroke="#424F5E"
          strokeWidth="1.4"
        />
        {/* Fold crease highlight */}
        <line x1="22" y1="-70" x2="119" y2="-70" stroke="#546578" strokeWidth="1.2" />
        <line x1="24" y1="-52" x2="118" y2="-52" stroke="#546578" strokeWidth="1.5" />
        {/* Quilt hem band */}
        <rect x="20" y="-83" width="8" height="31" fill="#3D4B5C" opacity="0.75" />
      </g>
    </g>
  );
};

/**
 * 28. SMALL WOODEN TABLE (Bàn Gỗ Nhỏ Nông Thôn)
 * Rustic rural wooden table where oil lamps and vintage radios rest.
 * Anchored at [bottom-center] [0, 0] at Ground Y = 800px.
 * Tabletop surface sits at Y = -75px (aligns with detail_oil_lamp / detail_vintage_radio offsetY: -75).
 */
const SmallWoodenTable: React.FC = () => {
  return (
    <g className="structure-small-wooden-table">
      {/* 1. Ground Contact Shadow */}
      <ellipse cx="0" cy="0" rx="72" ry="5.5" fill="#000000" opacity="0.65" />

      {/* 2. Rear Legs & Rear Crossbar (Chân bàn sau & thanh giằng sau tối màu tạo chiều sâu) */}
      {/* Rear Left Leg */}
      <polygon points="-52,-63 -46,-63 -51,0 -57,0" fill="#08080B" stroke="#16161D" strokeWidth="0.8" />
      {/* Rear Right Leg */}
      <polygon points="46,-63 52,-63 57,0 51,0" fill="#08080B" stroke="#16161D" strokeWidth="0.8" />
      {/* Rear Crossbar */}
      <rect x="-48" y="-36" width="96" height="5" fill="#060608" stroke="#14141A" strokeWidth="0.6" />

      {/* 3. Under-Table Apron Rail (Thành dầm đỡ mặt bàn trước) */}
      <rect x="-63" y="-63" width="126" height="10" rx="1" fill="#0B0B0E" stroke="#1F1F24" strokeWidth="0.8" />
      {/* Wooden joinery dowel pegs */}
      <circle cx="-56" cy="-58" r="1.5" fill="#3F3F46" />
      <circle cx="56" cy="-58" r="1.5" fill="#3F3F46" />
      <line x1="-60" y1="-54" x2="60" y2="-54" stroke="#1A1A22" strokeWidth="0.8" />

      {/* 4. Lower Front Stretcher (Thanh giằng ngang liên kết chân trước Y = -24px) */}
      <rect x="-60" y="-24" width="120" height="6" rx="1.5" fill="#0D0D11" stroke="#27272A" strokeWidth="0.8" />
      <line x1="-58" y1="-21" x2="58" y2="-21" stroke="#3F3F46" strokeWidth="0.8" />

      {/* 5. Front Legs (Hai chân trước choãi nhẹ, góc bo thanh mảnh) */}
      {/* Front Left Leg */}
      <g>
        <polygon points="-64,-63 -56,-63 -61,0 -69,0" fill="#0E0E12" stroke="#27272A" strokeWidth="1" />
        <line x1="-68" y1="0" x2="-63" y2="-63" stroke="#3F3F46" strokeWidth="1" />
      </g>
      {/* Front Right Leg */}
      <g>
        <polygon points="56,-63 64,-63 69,0 61,0" fill="#0E0E12" stroke="#27272A" strokeWidth="1" />
        <line x1="68" y1="0" x2="63" y2="-63" stroke="#3F3F46" strokeWidth="1" />
      </g>

      {/* 6. Solid Wooden Tabletop (Mặt bàn gỗ ngang dày 12px, y = -75px đến -63px) */}
      <rect x="-70" y="-75" width="140" height="12" rx="2" fill="#0E0E12" stroke="#1F1F24" strokeWidth="1" />
      {/* Upper surface highlight line catches dim room light */}
      <line x1="-69" y1="-74.5" x2="69" y2="-74.5" stroke="#27272A" strokeWidth="1.6" strokeLinecap="round" />
      {/* Subtle wood grain texture */}
      <line x1="-65" y1="-71" x2="65" y2="-71" stroke="#3F3F46" strokeWidth="0.7" opacity="0.6" strokeDasharray="18,10,32,8" />
      {/* End-grain chamfer bevels */}
      <line x1="-70" y1="-75" x2="-67" y2="-63" stroke="#33333D" strokeWidth="0.8" />
      <line x1="70" y1="-75" x2="67" y2="-63" stroke="#33333D" strokeWidth="0.8" />
    </g>
  );
};

/**
 * 29. WOODEN COUNTRY WINDOW (Cửa Sổ Gỗ Ván Lùa/Chống Nông Thôn)
 * Rustic rural wooden window ajar with cold mist / moonlight peering through the vertical slit.
 * Anchored at [bottom-center] at Ground Y = 800px; window frame suspended at Y = -260px to -120px
 * (directly at eye level of character lying down on bamboo bed).
 */
const WoodenCountryWindow: React.FC = () => {
  return (
    <g className="structure-wooden-window">
      {/* 1. Wall Stud Timber Posts & Siding extending down to floor */}
      <line x1="-60" y1="-120" x2="-60" y2="0" stroke="#09090C" strokeWidth="5" />
      <line x1="60" y1="-120" x2="60" y2="0" stroke="#09090C" strokeWidth="5" />
      {/* Horizontal wicker/wood wall slats below window */}
      {[-100, -75, -50, -25].map((wy) => (
        <line
          key={`wall-slat-${wy}`}
          x1="-62"
          y1={wy}
          x2="62"
          y2={wy}
          stroke="#07070A"
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}
      {/* Base contact shadow on floor */}
      <ellipse cx="0" cy="0" rx="68" ry="4" fill="#000000" opacity="0.5" />

      {/* 2. Main Window Framing (Width: 130px, Height: 140px, Y = -260px to -120px) */}
      {/* Window Opening Cavity Void */}
      <rect x="-53" y="-256" width="106" height="132" fill="#040406" />

      {/* Eerie Cold Moonlight / Sương Lạnh Peering Through Opening */}
      <rect x="-53" y="-256" width="106" height="132" fill="#64748B" opacity="0.22" />
      <ellipse cx="0" cy="-190" rx="46" ry="56" fill="#94A3B8" opacity="0.14" />

      {/* 3. Vertical Wooden Security Window Bars (Song cửa gỗ dọc nông thôn) */}
      {[-34, -17, 0, 17, 34].map((bx) => (
        <g key={`window-bar-${bx}`}>
          <line x1={bx} y1="-256" x2={bx} y2="-124" stroke="#0B0B0E" strokeWidth="3" />
          <line x1={bx - 0.7} y1="-256" x2={bx - 0.7} y2="-124" stroke="#1E1E26" strokeWidth="0.8" />
        </g>
      ))}

      {/* 4. Rustic Wooden Window Shutter Panels (Hai cánh cửa ván khép hờ chừa khe dọc ở giữa) */}
      {/* Left Shutter Leaf (Cánh ván bên trái) */}
      <g>
        <polygon points="-53,-255 -8,-255 -11,-125 -53,-125" fill="#0A0A0C" stroke="#1C1C24" strokeWidth="1.2" />
        {/* Vertical plank joints */}
        <line x1="-38" y1="-255" x2="-38" y2="-125" stroke="#181820" strokeWidth="1" />
        <line x1="-24" y1="-255" x2="-24" y2="-125" stroke="#181820" strokeWidth="1" />
        {/* Diagonal Z-brace structural batten */}
        <line x1="-50" y1="-245" x2="-14" y2="-135" stroke="#16161D" strokeWidth="2.6" />
        {/* Shutter inner rim moonlight edge highlight */}
        <line x1="-8" y1="-255" x2="-11" y2="-125" stroke="#334155" strokeWidth="1.2" />
      </g>

      {/* Right Shutter Leaf (Cánh ván bên phải, khép chừa khe hở 16px ở giữa) */}
      <g>
        <polygon points="8,-255 53,-255 53,-125 11,-125" fill="#0A0A0C" stroke="#1C1C24" strokeWidth="1.2" />
        {/* Vertical plank joints */}
        <line x1="24" y1="-255" x2="24" y2="-125" stroke="#181820" strokeWidth="1" />
        <line x1="38" y1="-255" x2="38" y2="-125" stroke="#181820" strokeWidth="1" />
        {/* Diagonal Z-brace structural batten */}
        <line x1="50" y1="-245" x2="14" y2="-135" stroke="#16161D" strokeWidth="2.6" />
        {/* Shutter inner rim moonlight edge highlight */}
        <line x1="8" y1="-255" x2="11" y2="-125" stroke="#334155" strokeWidth="1.2" />
      </g>

      {/* 5. Center Vertical Slit Moonlight Ray (Khe dọc hắt ánh sương lạnh & bóng ma lấp ló) */}
      <g>
        <rect x="-7" y="-255" width="14" height="130" fill="#64748B" opacity="0.32" />
        <rect x="-3" y="-255" width="6" height="130" fill="#94A3B8" opacity="0.25" />
      </g>

      {/* 6. Heavy Exterior Framing (Khung xà dầm gỗ bao quanh) */}
      {/* Top Lintel Beam (Xà ngang trên) */}
      <rect x="-75" y="-268" width="150" height="12" rx="2" fill="#0E0E12" stroke="#27272A" strokeWidth="1" />
      <line x1="-73" y1="-267" x2="73" y2="-267" stroke="#3F3F46" strokeWidth="1" />
      {/* Bottom Window Sill (Bậu cửa sổ dày dặn bắt sáng) */}
      <rect x="-76" y="-124" width="152" height="14" rx="2" fill="#0E0E12" stroke="#27272A" strokeWidth="1.2" />
      <line x1="-74" y1="-123" x2="74" y2="-123" stroke="#3F3F46" strokeWidth="1.2" />
      {/* Left & Right Jambs */}
      <rect x="-65" y="-260" width="12" height="140" fill="#0A0A0C" stroke="#1F1F24" strokeWidth="0.8" />
      <rect x="53" y="-260" width="12" height="140" fill="#0A0A0C" stroke="#1F1F24" strokeWidth="0.8" />

      {/* 7. Window Latch Bar / Wooden Lock Prop (Then gỗ cài ngang) */}
      <line x1="-42" y1="-185" x2="42" y2="-185" stroke="#060608" strokeWidth="4" />
      <rect x="-8" y="-190" width="16" height="10" rx="1" fill="#141419" stroke="#27272A" strokeWidth="0.8" />

      {/* 8. Soft Cold Mist hovering just under sill */}
      <ellipse cx="0" cy="-118" rx="38" ry="6" fill="#64748B" opacity="0.18" pointerEvents="none" />
    </g>
  );
};

/**
 * 30. ANCESTOR ALTAR (Bàn Thờ Tổ Tiên Vách Lá / Án Gian Cổ)
 * Traditional Vietnamese ancestral altar in rural thatched hut.
 * Features upturned altar table, embroidered red valance, ancestral tablet & framed photo,
 * ceramic incense burner with wafting incense smoke, brass candlesticks with warm eerie glow.
 * Ground anchor: [0, 0] at bottom-center (Ground Line Y = 800px).
 */
const AncestorAltar: React.FC = () => {
  return (
    <g className="structure-ancestor-altar">
      {/* 1. Floor Ground Contact Shadow */}
      <ellipse cx="0" cy="0" rx="120" ry="5" fill="#000000" opacity="0.6" />

      {/* 2. Curved Dragon-Claw / Cabriole Legs (Bốn chân quỳ dạ cá chạm khắc vững chãi) */}
      {/* Back Legs (Bóng chân sau) */}
      <path
        d="M -90 0 C -98 -40, -104 -90, -88 -140 L -72 -140 C -86 -90, -82 -40, -76 0 Z"
        fill="#07070A"
        stroke="#181820"
        strokeWidth="1"
      />
      <path
        d="M 90 0 C 98 -40, 104 -90, 88 -140 L 72 -140 C 86 -90, 82 -40, 76 0 Z"
        fill="#07070A"
        stroke="#181820"
        strokeWidth="1"
      />

      {/* Front Legs (Hai chân trước chạm gờ nổi) */}
      <path
        d="M -102 0 C -116 -45, -118 -95, -100 -142 L -84 -142 C -100 -95, -96 -45, -86 0 Z"
        fill="#0B0B0F"
        stroke="#27272A"
        strokeWidth="1.2"
      />
      <path
        d="M 102 0 C 116 -45, 118 -95, 100 -142 L 84 -142 C 100 -95, 96 -45, 86 0 Z"
        fill="#0B0B0F"
        stroke="#27272A"
        strokeWidth="1.2"
      />
      {/* Front leg gold/wood highlight lines */}
      <path d="M -99 -140 C -114 -95, -112 -45, -98 0" fill="none" stroke="#3F3F46" strokeWidth="1" />
      <path d="M 99 -140 C 114 -95, 112 -45, 98 0" fill="none" stroke="#3F3F46" strokeWidth="1" />

      {/* Lower Stretcher Bars (Thanh giằng ngang chạm then) */}
      <rect x="-92" y="-30" width="184" height="8" rx="2" fill="#0D0D12" stroke="#27272A" strokeWidth="1" />
      <line x1="-90" y1="-26" x2="90" y2="-26" stroke="#3F3F46" strokeWidth="0.8" />

      {/* 3. Under-Table Storage Apron & Carved Openwork (Yếm dạ cá chạm lộng hoa văn mây cổ) */}
      <path
        d="M -94 -140 L 94 -140 L 90 -95 Q 60 -115 0 -98 Q -60 -115 -90 -95 Z"
        fill="#07070A"
        stroke="#181820"
        strokeWidth="1"
      />
      {/* Cloud pattern relief slits on apron */}
      <path d="M -60 -125 Q -30 -110 0 -125 Q 30 -110 60 -125" fill="none" stroke="#2A241E" strokeWidth="1.8" />

      {/* 4. Deep Red Ancestral Altar Valance Cloth (Tấm yếm bàn thờ thêu đỏ rách mép tua rua) */}
      <polygon
        points="-88,-140 88,-140 84,-75 72,-85 60,-72 45,-86 30,-74 15,-88 0,-76 -15,-88 -30,-74 -45,-86 -60,-72 -72,-85 -84,-75"
        fill="#3F0A0A"
        stroke="#7F1D1D"
        strokeWidth="1"
      />
      {/* Faded Gold Embroidered Thread Trim & Talismanic Trigram Marks on cloth */}
      <path
        d="M -80 -132 L 80 -132 M -75 -126 L 75 -126"
        stroke="#B45309"
        strokeWidth="1"
        strokeDasharray="8,4,14,4"
        opacity="0.6"
      />
      {/* Fringed tassels dangling */}
      {[-65, -45, -25, 0, 25, 45, 65].map((tx) => (
        <line key={`tassel-${tx}`} x1={tx} y1="-75" x2={tx} y2="-62" stroke="#D97706" strokeWidth="1" opacity="0.65" />
      ))}

      {/* 5. Main Heavy Altar Tabletop with Upturned Winged Ends (Mặt bàn gỗ hương dày, hai đầu gờ cong vút) */}
      {/* Main Board Slab (Y = -142 to -156px) */}
      <rect x="-105" y="-154" width="210" height="14" rx="2" fill="#0D0D12" stroke="#27272A" strokeWidth="1.2" />
      {/* Top light reflection line */}
      <line x1="-103" y1="-153" x2="103" y2="-153" stroke="#52525B" strokeWidth="1.2" strokeLinecap="round" />
      {/* Left Wing Upturned Horn (Đầu gờ cánh én cong bên trái) */}
      <path d="M -105 -142 L -118 -164 L -103 -156 Z" fill="#0D0D12" stroke="#27272A" strokeWidth="1" />
      {/* Right Wing Upturned Horn (Đầu gờ cánh én cong bên phải) */}
      <path d="M 105 -142 L 118 -164 L 103 -156 Z" fill="#0D0D12" stroke="#27272A" strokeWidth="1" />

      {/* 6. Upper Stepped Pedestal (Bục tam cấp đặt di ảnh và bài vị, Y = -156 to -180px) */}
      <rect x="-65" y="-178" width="130" height="24" rx="2" fill="#0A0A0E" stroke="#27272A" strokeWidth="1" />
      <line x1="-63" y1="-177" x2="63" y2="-177" stroke="#3F3F46" strokeWidth="1" />
      <rect x="-45" y="-200" width="90" height="22" rx="1.5" fill="#08080C" stroke="#1F1F24" strokeWidth="1" />

      {/* 7. Center Ancestral Photo Frame & Wooden Tablet (Khung di ảnh tổ tiên & Bài vị chữ Nho) */}
      {/* Outer Carved Wood Shorter Side Tablets (Hai bài vị phụ hai bên) */}
      <g>
        <polygon points="-58,-245 -48,-255 -38,-245 -38,-195 -58,-195" fill="#140606" stroke="#991B1B" strokeWidth="1" />
        <rect x="-53" y="-238" width="10" height="38" fill="#FACC15" opacity="0.3" />
        <polygon points="38,-245 48,-255 58,-245 58,-195 38,-195" fill="#140606" stroke="#991B1B" strokeWidth="1" />
        <rect x="43" y="-238" width="10" height="38" fill="#FACC15" opacity="0.3" />
      </g>

      {/* Main Center Ancestral Portrait Frame (Khung di ảnh tổ tiên cổ kính) */}
      <g transform="translate(0, -200)">
        {/* Carved Pagoda Eaves Frame Crest (Đỉnh mái che di ảnh chạm trổ) */}
        <polygon points="0,-122 -38,-96 38,-96" fill="#0A0A0E" stroke="#D4AF37" strokeWidth="1.2" />
        <circle cx="0" cy="-114" r="3" fill="#D4AF37" />

        {/* Frame Outer Border (Kích thước 64x85px) */}
        <rect x="-32" y="-96" width="64" height="86" rx="2" fill="#050608" stroke="#D4AF37" strokeWidth="1.4" />
        {/* Inner Molding */}
        <rect x="-27" y="-91" width="54" height="76" fill="#020305" stroke="#713F12" strokeWidth="0.8" />

        {/* Dusty Glass with Spectral Faded Silhouette Face (Khuôn mặt tổ tiên mờ ảo chập chờn) */}
        <rect x="-25" y="-89" width="50" height="72" fill="#090D14" />
        <ellipse cx="0" cy="-56" rx="13" ry="17" fill="#64748B" opacity="0.25" className="anim-pulse-eerie" />
        <ellipse cx="0" cy="-34" rx="19" ry="15" fill="#475569" opacity="0.2" />
        {/* Empty white hollow eyes in old portrait */}
        <circle cx="-5" cy="-58" r="1.6" fill="#E2E8F0" opacity="0.4" />
        <circle cx="5" cy="-58" r="1.6" fill="#E2E8F0" opacity="0.4" />

        {/* Black Mourning Ribbons draped across corners (Dải băng tang đen vắt chéo góc khung ảnh) */}
        <polygon points="-32,-96 -18,-96 -32,-78" fill="#000000" stroke="#1E293B" strokeWidth="0.6" />
        <polygon points="32,-96 18,-96 32,-78" fill="#000000" stroke="#1E293B" strokeWidth="0.6" />

        {/* Yellow Talisman strip pinned to left frame edge (Bùa vàng niêm phong trừ tà) */}
        <g transform="translate(-32, -60)">
          <rect x="-5" y="0" width="10" height="34" fill="#FACC15" opacity="0.85" rx="1" />
          <line x1="-3" y1="4" x2="3" y2="4" stroke="#DC2626" strokeWidth="1" />
          <path d="M 0 6 L 0 28 M -2 12 L 2 12 M -2 20 L 2 20" stroke="#DC2626" strokeWidth="0.8" />
        </g>
      </g>

      {/* 8. Ceramic Incense Burner & Red Joss Sticks (Bát hương men rạn & Chân nhang đỏ) */}
      <g transform="translate(0, -154)">
        {/* Incense Burner Tripod Bowl (Bát hương đồng/gốm) */}
        <path d="M -18 0 C -22 -14, -22 -20, -18 -22 L 18 -22 C 22 -20, 22 -14, 18 0 Z" fill="#1C1917" stroke="#78350F" strokeWidth="1.2" />
        {/* Burner rim & handles */}
        <ellipse cx="0" cy="-22" rx="18" ry="4" fill="#292524" stroke="#D97706" strokeWidth="0.8" />
        <line x1="-21" y1="-16" x2="-18" y2="-12" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="-16" x2="18" y2="-12" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

        {/* Ash pile in burner */}
        <ellipse cx="0" cy="-22" rx="14" ry="2.5" fill="#44403C" />

        {/* Joss Sticks (3 que nhang cắm nghiêng) */}
        {/* Center stick */}
        <line x1="0" y1="-22" x2="0" y2="-52" stroke="#DC2626" strokeWidth="1.4" />
        <circle cx="0" cy="-52" r="1.8" fill="#FEF08A" className="anim-flicker-ember" />
        {/* Left tilted stick */}
        <line x1="-5" y1="-22" x2="-12" y2="-50" stroke="#DC2626" strokeWidth="1.4" />
        <circle cx="-12" cy="-50" r="1.6" fill="#F97316" className="anim-flicker-fast" />
        {/* Right tilted stick */}
        <line x1="5" y1="-22" x2="11" y2="-49" stroke="#DC2626" strokeWidth="1.4" />
        <circle cx="11" cy="-49" r="1.6" fill="#F97316" className="anim-flicker-ember" />

        {/* Wafting Incense Smoke Ribbons (Khói nhang bảng lảng uốn lượn bay lên) */}
        <path
          d="M 0 -54 Q 6 -72 -4 -90 Q -14 -108 2 -130 Q 16 -152 -2 -175"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
          className="anim-pulse-eerie"
        />
        <path
          d="M -12 -52 Q -20 -70 -10 -88 Q 2 -106 -8 -126"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M 11 -51 Q 20 -68 12 -86 Q 4 -104 16 -124"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.3"
        />
      </g>

      {/* 9. Pair of Flickering Brass Candle Holders (Đôi chân nến đồng hai bên le lói ánh vàng ấm) */}
      {/* Left Candlestick (X = -72) */}
      <g transform="translate(-72, -154)">
        {/* Brass Candle Stand Base */}
        <polygon points="-12,0 12,0 8,-6 -8,-6" fill="#78350F" stroke="#D97706" strokeWidth="0.8" />
        <line x1="0" y1="-6" x2="0" y2="-28" stroke="#B45309" strokeWidth="3" />
        <ellipse cx="0" cy="-28" rx="8" ry="2.5" fill="#78350F" stroke="#D97706" strokeWidth="0.8" />
        {/* Wax Candle Body */}
        <rect x="-3" y="-48" width="6" height="20" rx="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.6" />
        {/* Wax drippings */}
        <line x1="3" y1="-44" x2="3" y2="-34" stroke="#FDE68A" strokeWidth="1" />
        {/* Wick & Flame with Ambient Glow */}
        <line x1="0" y1="-48" x2="0" y2="-52" stroke="#451A03" strokeWidth="1" />
        <circle cx="0" cy="-56" r="35" fill="url(#altar-warm-glow)" opacity="0.85" pointerEvents="none" />
        <ellipse cx="0" cy="-56" rx="3.5" ry="6" fill="#FEF08A" className="anim-flicker-ember" />
        <circle cx="0" cy="-54" r="1.5" fill="#F97316" />
      </g>

      {/* Right Candlestick (X = 72) */}
      <g transform="translate(72, -154)">
        {/* Brass Candle Stand Base */}
        <polygon points="-12,0 12,0 8,-6 -8,-6" fill="#78350F" stroke="#D97706" strokeWidth="0.8" />
        <line x1="0" y1="-6" x2="0" y2="-28" stroke="#B45309" strokeWidth="3" />
        <ellipse cx="0" cy="-28" rx="8" ry="2.5" fill="#78350F" stroke="#D97706" strokeWidth="0.8" />
        {/* Wax Candle Body */}
        <rect x="-3" y="-48" width="6" height="20" rx="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.6" />
        {/* Wax drippings */}
        <line x1="-3" y1="-42" x2="-3" y2="-32" stroke="#FDE68A" strokeWidth="1" />
        {/* Wick & Flame with Ambient Glow */}
        <line x1="0" y1="-48" x2="0" y2="-52" stroke="#451A03" strokeWidth="1" />
        <circle cx="0" cy="-56" r="35" fill="url(#altar-warm-glow)" opacity="0.85" pointerEvents="none" />
        <ellipse cx="0" cy="-56" rx="3.5" ry="6" fill="#FEF08A" className="anim-flicker-ember" />
        <circle cx="0" cy="-54" r="1.5" fill="#F97316" />
      </g>

      {/* 10. Offering Vessels (Đĩa bồng chân cao bày hoa quả héo & 3 chung nước cúng) */}
      <g transform="translate(0, -154)">
        {/* Three Small Brass Offering Cups (3 chung nước cúng) */}
        {[-32, -40, -48].map((cx, i) => (
          <g key={`cup-${i}`}>
            <rect x={cx - 3} y="-8" width="6" height="8" rx="1" fill="#78350F" stroke="#D97706" strokeWidth="0.6" />
            <ellipse cx={cx} cy="-8" rx="3" ry="1.2" fill="#92400E" />
          </g>
        ))}
        {/* Offering Plate with Withered Fruits on Right */}
        <g transform="translate(38, 0)">
          <polygon points="-12,0 12,0 8,-4 -8,-4" fill="#57534E" />
          <ellipse cx="0" cy="-5" rx="16" ry="3" fill="#44403C" stroke="#78716C" strokeWidth="0.8" />
          {/* Three withered rounded fruits */}
          <circle cx="-5" cy="-9" r="4.5" fill="#450A0A" stroke="#7F1D1D" strokeWidth="0.6" />
          <circle cx="5" cy="-9" r="4.5" fill="#450A0A" stroke="#7F1D1D" strokeWidth="0.6" />
          <circle cx="0" cy="-13" r="4" fill="#3B0764" stroke="#581C87" strokeWidth="0.6" />
        </g>
      </g>
    </g>
  );
};

/**
 * 32. HAMMOCK (Võng Dù / Võng Lưới Miền Quê Treo Cột)
 * Traditional rural Vietnamese hammock strung between two wooden house pillars or veranda posts.
 * Suspended cradle at Y = -60px to -65px, with subtle hypnotic sway animation.
 * Perfectly integrates with pose_lying_hammock (offsetY: -60) and pose_sitting (seated sideways).
 */
const Hammock: React.FC = () => {
  return (
    <g className="structure-hammock">
      {/* 1. Floor Shadows Under Posts & Hammock Belly */}
      <ellipse cx="-138" cy="-2" rx="22" ry="5" fill="#000000" opacity="0.6" />
      <ellipse cx="138" cy="-2" rx="22" ry="5" fill="#000000" opacity="0.6" />
      <ellipse cx="0" cy="-2" rx="105" ry="7" fill="#000000" opacity="0.4" />
      <ellipse cx="0" cy="-2" rx="60" ry="4" fill="#000000" opacity="0.3" className="anim-pulse-slow" />

      {/* 2. Left Wooden / Bamboo Pillar (Cột nhà gỗ bên trái X = -138px) */}
      <g opacity="0.95">
        {/* Stone Pedestal base */}
        <polygon points="-152,0 -124,0 -128,-14 -148,-14" fill="#1C1917" stroke="#292524" strokeWidth="1" />
        <rect x="-144" y="-14" width="12" height="6" fill="#292524" />
        {/* Main Pillar Trunk */}
        <rect x="-144" y="-220" width="12" height="206" fill="#17120E" stroke="#332418" strokeWidth="1" />
        <line x1="-140" y1="-220" x2="-140" y2="-14" stroke="#453222" strokeWidth="1.2" opacity="0.8" />
        {/* Wood grain notches */}
        {[-45, -95, -145, -195].map((py, idx) => (
          <ellipse key={`lp-notch-${idx}`} cx="-138" cy={py} rx="5" ry="1.5" fill="#2B1D13" />
        ))}
      </g>

      {/* 3. Right Wooden / Bamboo Pillar (Cột nhà gỗ bên phải X = +138px) */}
      <g opacity="0.95">
        {/* Stone Pedestal base */}
        <polygon points="124,0 152,0 148,-14 128,-14" fill="#1C1917" stroke="#292524" strokeWidth="1" />
        <rect x="132" y="-14" width="12" height="6" fill="#292524" />
        {/* Main Pillar Trunk */}
        <rect x="132" y="-220" width="12" height="206" fill="#17120E" stroke="#332418" strokeWidth="1" />
        <line x1="136" y1="-220" x2="136" y2="-14" stroke="#453222" strokeWidth="1.2" opacity="0.8" />
        {/* Wood grain notches */}
        {[-45, -95, -145, -195].map((py, idx) => (
          <ellipse key={`rp-notch-${idx}`} cx="138" cy={py} rx="5" ry="1.5" fill="#2B1D13" />
        ))}
      </g>

      {/* 4. Anchor Ropes & Iron Suspension Hooks */}
      {/* Left Anchor Rope looped around pillar at Y = -135 */}
      <rect x="-146" y="-140" width="16" height="12" rx="2" fill="#2D2115" stroke="#523B26" strokeWidth="1" />
      <path d="M -138 -134 Q -128 -130 -120 -124" stroke="#634830" strokeWidth="3" fill="none" />
      <circle cx="-120" cy="-124" r="3.5" fill="#1F2937" stroke="#4B5563" strokeWidth="1" />

      {/* Right Anchor Rope looped around pillar at Y = -135 */}
      <rect x="130" y="-140" width="16" height="12" rx="2" fill="#2D2115" stroke="#523B26" strokeWidth="1" />
      <path d="M 138 -134 Q 128 -130 120 -124" stroke="#634830" strokeWidth="3" fill="none" />
      <circle cx="120" cy="-124" r="3.5" fill="#1F2937" stroke="#4B5563" strokeWidth="1" />

      {/* 5. GENTLY SWAYING HAMMOCK BODY */}
      <g className="anim-hammock-sway">
        {/* Fan-out suspension cords from iron ring to hammock ends */}
        {/* Left fan cords */}
        <g stroke="#4A3B2C" strokeWidth="1.2" opacity="0.9">
          <line x1="-120" y1="-124" x2="-98" y2="-106" />
          <line x1="-120" y1="-124" x2="-96" y2="-98" />
          <line x1="-120" y1="-124" x2="-94" y2="-90" />
          <line x1="-120" y1="-124" x2="-92" y2="-82" />
        </g>
        {/* Left Spreader Bar (Thanh gỗ giữ đầu võng) */}
        <line x1="-98" y1="-106" x2="-92" y2="-82" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="-98" y1="-106" x2="-92" y2="-82" stroke="#5C3F28" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right fan cords */}
        <g stroke="#4A3B2C" strokeWidth="1.2" opacity="0.9">
          <line x1="120" y1="-124" x2="98" y2="-106" />
          <line x1="120" y1="-124" x2="96" y2="-98" />
          <line x1="120" y1="-124" x2="94" y2="-90" />
          <line x1="120" y1="-124" x2="92" y2="-82" />
        </g>
        {/* Right Spreader Bar */}
        <line x1="98" y1="-106" x2="92" y2="-82" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="98" y1="-106" x2="92" y2="-82" stroke="#5C3F28" strokeWidth="1.5" strokeLinecap="round" />

        {/* REAR HAMMOCK MESH (Lưng võng phía sau) */}
        {/* Deep sagging catenary curve filled silhouette */}
        <path
          d="M -98 -106 Q 0 -45 98 -106 L 92 -82 Q 0 -22 -92 -82 Z"
          fill="#0D1612"
          stroke="#192A22"
          strokeWidth="1.2"
        />

        {/* Diagonal Woven Diamond Mesh Lines (Lưới mắt cáo) */}
        <g stroke="#1F362C" strokeWidth="0.8" opacity="0.75">
          {[-70, -50, -30, -10, 10, 30, 50, 70].map((mx) => (
            <path
              key={`mesh-diag-1-${mx}`}
              d={`M ${mx - 25} ${-70 + Math.abs(mx) * 0.4} Q ${mx} ${-42 + Math.abs(mx) * 0.25} ${mx + 25} ${-55 + Math.abs(mx) * 0.3}`}
              fill="none"
            />
          ))}
          {[-60, -40, -20, 0, 20, 40, 60].map((mx) => (
            <path
              key={`mesh-diag-2-${mx}`}
              d={`M ${mx + 25} ${-70 + Math.abs(mx) * 0.4} Q ${mx} ${-42 + Math.abs(mx) * 0.25} ${mx - 25} ${-55 + Math.abs(mx) * 0.3}`}
              fill="none"
            />
          ))}
        </g>

        {/* Lower Sagging Belly Hem & Frayed Fringes */}
        <path
          d="M -92 -82 Q 0 -22 92 -82"
          stroke="#2A4538"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M -85 -78 Q 0 -24 85 -78"
          stroke="#16241D"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Frayed small fringe tassels hanging down from lowest belly */}
        {[-36, -24, -12, 0, 12, 24, 36].map((tx) => (
          <line
            key={`fringe-${tx}`}
            x1={tx}
            y1={-25 + Math.abs(tx) * 0.15}
            x2={tx + (tx < 0 ? -1.5 : 1.5)}
            y2={-17 + Math.abs(tx) * 0.15}
            stroke="#1B2F25"
            strokeWidth="1.2"
          />
        ))}

        {/* Upper Rim Tension Cable (Mép trên võng uốn lượn khi đung đưa) */}
        <path
          d="M -98 -106 Q 0 -48 98 -106"
          stroke="#385C4B"
          strokeWidth="2.2"
          fill="none"
        />
        <path
          d="M -96 -104 Q 0 -50 96 -104"
          stroke="#172720"
          strokeWidth="1"
          fill="none"
        />

        {/* Small rustic bolster pillow tucked into head end (X = -65, Y = -78) */}
        <ellipse cx="-64" cy="-78" rx="14" ry="7" fill="#1C1814" stroke="#3D2E22" strokeWidth="1" transform="rotate(-18, -64, -78)" />
      </g>
    </g>
  );
};
