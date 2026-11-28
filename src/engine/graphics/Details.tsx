import React from "react";
import type { DetailId } from "../types";
import { COLOR_PALETTE } from "../constants";

interface DetailRendererProps {
  id: DetailId;
  scale?: number;
  showAnchor?: boolean;
}

export const DetailRenderer: React.FC<DetailRendererProps> = ({
  id,
  scale = 1,
  showAnchor = false,
}) => {
  return (
    <g className={`detail-${id}`} transform={`scale(${scale})`}>
      {id === "detail_black_crow" && <BlackCrow />}
      {id === "detail_will_o_wisp" && <WillOWisp />}
      {id === "detail_blood_lantern" && <BloodLantern />}
      {id === "detail_incense_bowl" && <IncenseBowl />}
      {id === "detail_skull_pile" && <SkullPile />}
      {id === "detail_hanging_talisman" && <HangingTalisman />}
      {id === "detail_iv_drip_stand" && <IvDripStand />}
      {id === "detail_shopping_cart" && <ShoppingCart />}
      {id === "detail_surveillance_camera" && <SurveillanceCamera />}
      {id === "detail_flickering_ceiling_lamp" && <FlickeringCeilingLamp />}
      {id === "detail_broken_mirror" && <BrokenBathroomMirror />}
      {id === "detail_muddy_water_puddle" && <MuddyWaterPuddle />}
      {id === "detail_oil_lamp" && <OilLamp />}
      {id === "detail_vintage_radio" && <VintageRadio />}
      {id === "detail_water_hyacinth" && <WaterHyacinthClump />}
      {id === "detail_child_sandals" && <ChildSandals />}
      {id === "detail_offering_tray_toys" && <OfferingTrayToys />}
      {id === "detail_matchbox" && <Matchbox />}
      {id === "detail_water_droplets" && <WaterDroplets />}
      {id === "detail_porridge_bowl" && <PorridgeBowl />}
      {id === "detail_npc_silhouette_standing" && <NpcSilhouetteStanding />}
      {id === "detail_npc_silhouette_walking" && <NpcSilhouetteWalking />}
      {id === "detail_npc_crowd_group" && <NpcCrowdGroup />}
      {id === "detail_npc_crowd_walking" && <NpcCrowdWalking />}
      {id === "detail_fish_splash" && <FishSplash />}
      {id === "detail_falling_coconut" && <FallingCoconut />}
      {id === "detail_rooster_crowing" && <RoosterCrowing />}

      {showAnchor && (
        <g className="detail-debug-anchor" pointerEvents="none">
          <circle cx="0" cy="0" r="4.5" fill="#F59E0B" />
          <line x1="-18" y1="0" x2="18" y2="0" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,3" />
        </g>
      )}
    </g>
  );
};

/**
 * 1. BLACK CROW (Quạ Đen Mắt Trắng)
 */
const BlackCrow: React.FC = () => {
  return (
    <g className="anim-moon-pulse" transform="translate(0, -18)">
      {/* Legs/Talons */}
      <line x1="-4" y1="6" x2="-6" y2="18" stroke="#050507" strokeWidth="2" />
      <line x1="4" y1="6" x2="6" y2="18" stroke="#050507" strokeWidth="2" />
      {/* Tail feathers */}
      <polygon points="-14,4 -36,16 -24,20 -10,10" fill={COLOR_PALETTE.silhouette_primary} />
      {/* Body */}
      <ellipse cx="0" cy="0" rx="18" ry="11" fill={COLOR_PALETTE.silhouette_primary} transform="rotate(-15)" />
      {/* Slightly raised ominous wing */}
      <path d="M -12 -4 C -20 -24, 5 -26, 12 -8 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      {/* Head & Sharp Beak */}
      <circle cx="16" cy="-10" r="8" fill={COLOR_PALETTE.silhouette_primary} />
      <polygon points="22,-11 36,-7 22,-4" fill="#000" />
      {/* Piercing Pale Eye */}
      <circle cx="18" cy="-11" r="2" fill={COLOR_PALETTE.accent_fog_white} />
    </g>
  );
};

/**
 * 2. WILL-O'-THE-WISP (Đốm Ma Trơi Lân Tinh)
 */
const WillOWisp: React.FC = () => {
  return (
    <g className="rig-floating">
      {/* Outer Eerie Aura */}
      <circle cx="0" cy="-20" r="45" fill="url(#eclipse-glow-radial)" opacity="0.75" />
      {/* Flame Core */}
      <path
        d="M 0 -48 C -14 -28, -18 -10, 0 0 C 18 -10, 14 -28, 0 -48 Z"
        fill={COLOR_PALETTE.accent_swamp_green}
        opacity="0.85"
        className="anim-flicker-ember"
      />
      <path
        d="M 0 -36 C -7 -22, -9 -10, 0 -2 C 9 -10, 7 -22, 0 -36 Z"
        fill={COLOR_PALETTE.accent_phantom_teal}
      />
      <circle cx="0" cy="-14" r="4" fill="#E2E8F0" />
      {/* Trailing Ghost Sparks */}
      <circle cx="-14" cy="-35" r="2.2" fill={COLOR_PALETTE.accent_swamp_green} opacity="0.8" />
      <circle cx="12" cy="-42" r="1.8" fill={COLOR_PALETTE.accent_phantom_teal} opacity="0.7" />
    </g>
  );
};

/**
 * 3. BLOOD LANTERN (Đèn Lồng Giấy Đỏ Rách)
 */
const BloodLantern: React.FC = () => {
  return (
    <g className="anim-sway-subtle">
      {/* Bamboo Pole Stand */}
      <line x1="-22" y1="0" x2="-22" y2="-115" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="4" />
      <line x1="-22" y1="-115" x2="6" y2="-115" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="3" />
      <line x1="0" y1="-115" x2="0" y2="-92" stroke="#111" strokeWidth="1.5" />

      {/* Crimson Glow */}
      <circle cx="0" cy="-68" r="48" fill="url(#blood-moon-glow-radial)" opacity="0.65" />

      {/* Lantern Body */}
      <rect x="-8" y="-92" width="16" height="5" fill="#000" />
      <ellipse cx="0" cy="-68" rx="18" ry="24" fill={COLOR_PALETTE.accent_blood_red} opacity="0.92" />
      <ellipse cx="0" cy="-68" rx="8" ry="15" fill="#EF4444" opacity="0.65" className="anim-flicker-ember" />
      {/* Ribs */}
      <ellipse cx="0" cy="-68" rx="18" ry="7" fill="none" stroke="#1F0404" strokeWidth="1.2" />
      <rect x="-8" y="-46" width="16" height="5" fill="#000" />

      {/* Tattered Tassels */}
      <line x1="-4" y1="-41" x2="-6" y2="-22" stroke="#111" strokeWidth="1.5" />
      <line x1="0" y1="-41" x2="0" y2="-18" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="1.5" />
      <line x1="4" y1="-41" x2="5" y2="-24" stroke="#111" strokeWidth="1.5" />
    </g>
  );
};

/**
 * 4. INCENSE BOWL & RITUAL CANDLES (Bát Hương Tàn & Nến Cầu Hồn)
 */
const IncenseBowl: React.FC = () => {
  return (
    <g>
      {/* Stone Altar Pad */}
      <rect x="-45" y="-10" width="90" height="10" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Left Candle */}
      <rect x="-32" y="-36" width="8" height="26" fill={COLOR_PALETTE.accent_fog_white} opacity="0.8" />
      <path d="M -28 -48 C -32 -40, -24 -40, -28 -48 Z" fill={COLOR_PALETTE.accent_eerie_gold} className="anim-flicker-ember" />

      {/* Right Candle */}
      <rect x="24" y="-32" width="8" height="22" fill={COLOR_PALETTE.accent_fog_white} opacity="0.8" />
      <path d="M 28 -44 C 24 -36, 32 -36, 28 -44 Z" fill={COLOR_PALETTE.accent_eerie_gold} className="anim-flicker-ember" />

      {/* Ceramic Incense Bowl */}
      <path d="M -18 -10 L -14 -34 L 14 -34 L 18 -10 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      <ellipse cx="0" cy="-34" rx="14" ry="4" fill="#050507" />

      {/* 3 Burning Incense Sticks */}
      <line x1="-6" y1="-34" x2="-9" y2="-66" stroke="#222" strokeWidth="1.5" />
      <circle cx="-9" cy="-67" r="2" fill={COLOR_PALETTE.accent_bright_red} className="anim-flicker-ember" />

      <line x1="0" y1="-34" x2="0" y2="-72" stroke="#222" strokeWidth="1.5" />
      <circle cx="0" cy="-73" r="2.2" fill={COLOR_PALETTE.accent_bright_red} className="anim-flicker-ember" />

      <line x1="6" y1="-34" x2="9" y2="-64" stroke="#222" strokeWidth="1.5" />
      <circle cx="9" cy="-65" r="2" fill={COLOR_PALETTE.accent_bright_red} className="anim-flicker-ember" />

      {/* Eerie Rising Smoke */}
      <path
        d="M 0 -75 Q -10 -105 6 -130 Q 15 -155 -2 -180"
        stroke={COLOR_PALETTE.accent_fog_white}
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
        className="anim-smoke-rise"
      />
    </g>
  );
};

/**
 * 5. SKULL PILE & BONES (Đống Đầu Lâu & Xương Khô)
 */
const SkullPile: React.FC = () => {
  return (
    <g>
      {/* Mound Base */}
      <path d="M -55 0 C -40 -22, 40 -22, 55 0 Z" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Scattered Femur Bones */}
      <line x1="-45" y1="-6" x2="35" y2="-12" stroke="#CBD5E1" strokeWidth="4" opacity="0.7" />
      <line x1="-20" y1="-2" x2="45" y2="-8" stroke="#94A3B8" strokeWidth="3.5" opacity="0.65" />

      {/* Bottom Left Skull */}
      <g transform="translate(-22, -16) rotate(-18)">
        <circle cx="0" cy="0" r="13" fill="#CBD5E1" opacity="0.8" />
        <rect x="-7" y="6" width="14" height="8" rx="2" fill="#CBD5E1" opacity="0.8" />
        <circle cx="-5" cy="0" r="3" fill="#050507" />
        <circle cx="5" cy="0" r="3" fill="#050507" />
        <polygon points="0,3 -2,7 2,7" fill="#050507" />
      </g>

      {/* Bottom Right Skull */}
      <g transform="translate(20, -14) rotate(22)">
        <circle cx="0" cy="0" r="12" fill="#94A3B8" opacity="0.75" />
        <rect x="-6" y="5" width="12" height="7" rx="2" fill="#94A3B8" opacity="0.75" />
        <circle cx="-4" cy="0" r="2.8" fill="#050507" />
        <circle cx="4" cy="0" r="2.8" fill="#050507" />
      </g>

      {/* Top Center Prominent Skull */}
      <g transform="translate(-2, -32) rotate(4)">
        <circle cx="0" cy="0" r="15" fill="#E2E8F0" opacity="0.88" />
        <rect x="-8" y="8" width="16" height="9" rx="2" fill="#E2E8F0" opacity="0.88" />
        <circle cx="-5.5" cy="-1" r="3.6" fill="#050507" />
        <circle cx="5.5" cy="-1" r="3.6" fill="#050507" />
        <polygon points="0,4 -2.5,8.5 2.5,8.5" fill="#050507" />
        {/* Teeth lines */}
        <line x1="-5" y1="12" x2="-5" y2="17" stroke="#050507" strokeWidth="1.2" />
        <line x1="0" y1="12" x2="0" y2="17" stroke="#050507" strokeWidth="1.2" />
        <line x1="5" y1="12" x2="5" y2="17" stroke="#050507" strokeWidth="1.2" />
      </g>
    </g>
  );
};

/**
 * 6. HANGING TALISMAN CORD (Dây Bùa Trấn Yểm Bay Phấp Phới)
 */
const HangingTalisman: React.FC = () => {
  return (
    <g>
      {/* Horizontal Ritual Hemp Rope */}
      <path d="M -80 -10 Q 0 12 80 -10" stroke="#78716C" strokeWidth="2.5" fill="none" />

      {/* 3 Hanging Talismans */}
      <g transform="translate(-45, 0)" className="anim-sway-subtle">
        <polygon points="-8,0 8,0 7,42 -7,42" fill={COLOR_PALETTE.accent_talisman_yellow} />
        <line x1="0" y1="6" x2="0" y2="36" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2" />
        <line x1="-4" y1="14" x2="4" y2="14" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="1.8" />
      </g>

      <g transform="translate(0, 6)" className="anim-sway-subtle">
        <polygon points="-9,0 9,0 8,48 -8,48" fill={COLOR_PALETTE.accent_talisman_yellow} />
        <line x1="0" y1="6" x2="0" y2="42" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2.2" />
        <circle cx="0" cy="20" r="3" fill={COLOR_PALETTE.accent_blood_red} />
      </g>

      <g transform="translate(45, 0)" className="anim-sway-subtle">
        <polygon points="-8,0 8,0 7,42 -7,42" fill={COLOR_PALETTE.accent_talisman_yellow} />
        <line x1="0" y1="6" x2="0" y2="36" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2" />
        <line x1="-4" y1="24" x2="4" y2="24" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="1.8" />
      </g>
    </g>
  );
};

/**
 * 7. IV DRIP STAND (Cột Truyền Dịch Y Tế Rỉ Máu)
 */
const IvDripStand: React.FC = () => {
  return (
    <g className="iv-drip-stand">
      {/* 5-Legged Castor Spider Base on Ground Y=0 */}
      <circle cx="-22" cy="-3" r="3.5" fill="#334155" />
      <circle cx="-10" cy="-2" r="3" fill="#1E293B" />
      <circle cx="10" cy="-2" r="3" fill="#1E293B" />
      <circle cx="22" cy="-3" r="3.5" fill="#334155" />
      <path d="M -22 -3 L 0 -12 L 22 -3" stroke="#1E293B" strokeWidth="3" fill="none" />
      <circle cx="0" cy="-12" r="4" fill="#475569" />

      {/* Vertical Chrome Rod */}
      <line x1="0" y1="-12" x2="0" y2="-165" stroke="#94A3B8" strokeWidth="3" />
      <line x1="-1" y1="-12" x2="-1" y2="-165" stroke="#E2E8F0" strokeWidth="1" opacity="0.6" />
      <circle cx="0" cy="-90" r="3" fill="#475569" />

      {/* Top Ram's Horn Hooks */}
      <path
        d="M -16 -170 C -16 -162, 0 -162, 0 -165 C 0 -162, 16 -162, 16 -170"
        stroke="#64748B"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Hanging IV Saline Infusion Bag */}
      <g transform="translate(-16, -170)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" strokeWidth="1.5" />
        {/* Transparent IV Bag */}
        <rect x="-9" y="8" width="18" height="30" rx="3" fill="#E0F2FE" opacity="0.8" stroke="#0284C7" strokeWidth="1" />
        {/* Fluid Level with Red Stain */}
        <rect x="-8" y="16" width="16" height="20" rx="2" fill="#BAE6FD" opacity="0.9" />
        <rect x="-8" y="26" width="16" height="10" rx="1" fill={COLOR_PALETTE.accent_blood_red} opacity="0.85" />
        {/* Drip Chamber */}
        <rect x="-3" y="38" width="6" height="10" rx="1" fill="#E2E8F0" stroke="#0284C7" strokeWidth="1" />
        {/* Plastic Infusion Tube Looping Down */}
        <path d="M 0 48 Q 12 75 8 105 Q 4 130 14 150" fill="none" stroke="#E0F2FE" strokeWidth="1.5" opacity="0.75" />
        {/* Dripping Blood Droplet */}
        <circle cx="14" cy="153" r="2" fill={COLOR_PALETTE.accent_blood_red} />
      </g>
    </g>
  );
};

/**
 * 8. SHOPPING CART (Xe Đẩy Siêu Thị Rỉ Sét)
 */
const ShoppingCart: React.FC = () => {
  return (
    <g className="shopping-cart">
      {/* 4 Castor Wheels on Ground Y=0 */}
      <circle cx="-32" cy="-4" r="4" fill="#334155" stroke="#0F172A" strokeWidth="1.5" />
      <circle cx="-18" cy="-4" r="3.5" fill="#1E293B" />
      <circle cx="18" cy="-4" r="3.5" fill="#1E293B" />
      <circle cx="32" cy="-4" r="4" fill="#334155" stroke="#0F172A" strokeWidth="1.5" />

      {/* Lower Wire Frame Chassis */}
      <line x1="-34" y1="-8" x2="34" y2="-8" stroke="#475569" strokeWidth="3" />
      <line x1="-32" y1="-8" x2="-28" y2="-32" stroke="#475569" strokeWidth="3" />
      <line x1="28" y1="-8" x2="32" y2="-32" stroke="#475569" strokeWidth="3" />
      {/* Lower Tray Shelf with Rusted Box */}
      <line x1="-22" y1="-12" x2="22" y2="-12" stroke="#64748B" strokeWidth="1.5" />
      <rect x="-10" y="-22" width="18" height="10" fill="#78350F" opacity="0.8" />

      {/* Slanted Wireframe Basket (Slanted front) */}
      <polygon
        points="-35,-72 32,-72 26,-32 -28,-32"
        fill="#0F172A"
        opacity="0.25"
        stroke="#64748B"
        strokeWidth="2"
      />
      {/* Horizontal Wire Grid */}
      <line x1="-33" y1="-60" x2="30" y2="-60" stroke="#94A3B8" strokeWidth="1.2" opacity="0.7" />
      <line x1="-31" y1="-48" x2="28" y2="-48" stroke="#94A3B8" strokeWidth="1.2" opacity="0.7" />
      <line x1="-29" y1="-38" x2="27" y2="-38" stroke="#94A3B8" strokeWidth="1.2" opacity="0.7" />
      {/* Vertical Wire Grid */}
      {[-20, -10, 0, 10, 20].map((x) => (
        <line key={x} x1={x} y1="-72" x2={x} y2="-32" stroke="#94A3B8" strokeWidth="1.2" opacity="0.7" />
      ))}

      {/* Push Handle Extending Upwards */}
      <line x1="-28" y1="-50" x2="-40" y2="-80" stroke="#475569" strokeWidth="3" />
      <ellipse cx="-40" cy="-80" rx="3" ry="5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
    </g>
  );
};

/**
 * 9. SURVEILLANCE CAMERA (Camera An Ninh Chớp Đỏ) - AIR SLOT
 */
const SurveillanceCamera: React.FC = () => {
  return (
    <g className="surveillance-camera">
      {/* Ceiling Mount Bracket */}
      <rect x="-14" y="0" width="28" height="6" rx="1" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
      {/* Swivel Stem Arm */}
      <line x1="0" y1="6" x2="0" y2="18" stroke="#334155" strokeWidth="3.5" />
      <circle cx="0" cy="18" r="4.5" fill="#475569" />

      {/* Angled Camera Body (pointing down & right ~35 deg) */}
      <g transform="translate(0, 18) rotate(32)">
        {/* Rear cable loop */}
        <path d="M -16 0 Q -24 -10 -12 -16" fill="none" stroke="#0F172A" strokeWidth="2" />
        {/* Main Cylindrical Housing */}
        <rect x="-16" y="-8" width="34" height="16" rx="3" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
        {/* Sunshield Visor Hood */}
        <path d="M -14 -10 L 22 -10 L 20 -8 L -14 -8 Z" fill="#94A3B8" />
        {/* Front Lens Barrel */}
        <rect x="18" y="-7" width="6" height="14" rx="2" fill="#0F172A" />
        <ellipse cx="23" cy="0" rx="2" ry="5" fill="#0284C7" />
        {/* Pulsing Red Recording LED Dot */}
        <circle cx="16" cy="-4" r="2" fill="#EF4444" className="anim-pulse-eerie" />
      </g>
    </g>
  );
};

/**
 * 10. FLICKERING CEILING LAMP (Đèn Huỳnh Quang Trần Chập Chờn) - AIR SLOT
 */
const FlickeringCeilingLamp: React.FC = () => {
  return (
    <g className="flickering-ceiling-lamp">
      {/* Two Hanging Suspension Cords from Ceiling */}
      <line x1="-42" y1="-45" x2="-42" y2="0" stroke="#475569" strokeWidth="1.5" />
      <line x1="42" y1="-45" x2="42" y2="0" stroke="#475569" strokeWidth="1.5" />
      {/* Loose Dangling Wire Cord */}
      <path d="M 46 -30 Q 55 -10 50 15" fill="none" stroke="#0F172A" strokeWidth="1.5" />

      {/* Industrial Lamp Metal Body Casing */}
      <rect x="-55" y="0" width="110" height="14" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />

      {/* Diffuse Eerie Downward Glow Cone */}
      <polygon
        points="-45,14 -85,120 85,120 45,14"
        fill="url(#lantern-warm-glow)"
        opacity="0.2"
        className="anim-flicker-ember"
      />

      {/* Fluorescent Light Tube Inside */}
      <rect
        x="-48"
        y="5"
        width="96"
        height="6"
        rx="2"
        fill="#A7F3D0"
        className="anim-flicker-ember"
      />
    </g>
  );
};

/**
 * 11. BROKEN BATHROOM MIRROR (Gương Nhà Tắm Vỡ Nứt Vấy Máu)
 * Wall-mounted bathroom mirror with web of fracture cracks and a bloody handprint.
 * Anchored at [bottom-center] (0, 0).
 */
const BrokenBathroomMirror: React.FC = () => {
  return (
    <g className="detail-broken-mirror" transform="translate(0, -65)">
      {/* Outer Rusted Metal Frame */}
      <rect
        x="-42"
        y="-65"
        width="84"
        height="130"
        rx="4"
        fill="#0B0E14"
        stroke="#334155"
        strokeWidth="2.5"
      />
      {/* Frame Mounting Screws on 4 Corners */}
      <circle cx="-37" cy="-60" r="1.5" fill="#64748B" />
      <circle cx="37" cy="-60" r="1.5" fill="#64748B" />
      <circle cx="-37" cy="60" r="1.5" fill="#64748B" />
      <circle cx="37" cy="60" r="1.5" fill="#64748B" />

      {/* Dark Eerie Mirror Glass */}
      <rect
        x="-38"
        y="-61"
        width="76"
        height="122"
        rx="2"
        fill="url(#mirror-glass-glow)"
      />

      {/* Spiderweb Fracture Cracks radiating from center */}
      <g stroke="#CBD5E1" strokeWidth="1.2" fill="none" opacity="0.85">
        <path d="M 0 -8 L 14 -22 L 32 -30 M 14 -22 L 20 -45 L 36 -55" />
        <path d="M 0 -8 L -16 -24 L -32 -32 M -16 -24 L -25 -48 L -36 -54" />
        <path d="M 0 -8 L -18 12 L -34 26 M -18 12 L -24 38 L -35 55" />
        <path d="M 0 -8 L 16 14 L 32 28 M 16 14 L 26 42 L 35 56" />
        <path d="M 0 -8 L -8 -38 L -12 -58" />
        <path d="M 0 -8 L 8 36 L 12 58" />
      </g>

      {/* Secondary Fine Hairline Cracks */}
      <g stroke="#94A3B8" strokeWidth="0.7" fill="none" opacity="0.7">
        <path d="M 8 -16 L 22 -14 M -10 -18 L -24 -15" />
        <path d="M 10 6 L 24 10 M -10 4 L -22 6" />
        <path d="M -8 -30 L 4 -35 L 12 -28" />
        <path d="M -12 24 L 2 30 L 14 22" />
      </g>

      {/* Central Impact Shatter Cavity */}
      <polygon points="0,-12 6,-8 4,0 -4,2 -6,-6" fill="#030408" stroke="#E2E8F0" strokeWidth="0.8" />

      {/* Bloody Handprint Smear on the Glass */}
      <g opacity="0.75">
        <ellipse cx="6" cy="-2" rx="7.5" ry="10" fill="#7F1D1D" />
        {/* Finger streaks dragging down */}
        <path d="M 1 -12 L 0 5" stroke="#991B1B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 5 -15 L 4 8" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 9 -14 L 8 9" stroke="#991B1B" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M 13 -10 L 12 6" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
        {/* Palm blood drips down the mirror bottom */}
        <line x1="4" y1="10" x2="3" y2="28" stroke="#7F1D1D" strokeWidth="1.2" strokeDasharray="4,3" />
        <circle cx="3" cy="30" r="1.3" fill="#DC2626" />
      </g>
    </g>
  );
};

/**
 * 12. MUDDY WATER PUDDLE (Vũng Nước Ướt Sũng Lẫn Bùn Non)
 * Sinister pool of turbid water and oozing river mud spreading along the ground threshold.
 * Features dark blue-black liquid sheen, grey reflective fringes, and mud spatter.
 * Anchored at [bottom-center] (0, 0) at Ground Y = 800px.
 */
const MuddyWaterPuddle: React.FC = () => {
  return (
    <g className="detail-muddy-water-puddle">
      {/* 1. Base Dark Ground Shadow & Stained Earth */}
      <ellipse cx="0" cy="0" rx="105" ry="12" fill="#000000" opacity="0.6" />

      {/* 2. Main Mud & Turbid Water Pool */}
      <path
        d="M -98 0 
           C -108 -6, -88 -14, -55 -16 
           C -25 -18, 15 -14, 52 -16 
           C 85 -17, 108 -9, 98 -1 
           C 88 5, 55 7, 18 6 
           C -25 5, -88 6, -98 0 Z"
        fill="#0A0F1D"
        stroke="#1E293B"
        strokeWidth="1.5"
      />

      {/* 3. Concentric Wet Sheen & Mud Ripple Reflections */}
      <path
        d="M -75 -2 
           C -82 -7, -65 -12, -40 -13 
           C -15 -14, 18 -11, 46 -13 
           C 72 -14, 86 -7, 78 -1 
           C 70 4, 42 5, 12 4 
           C -20 3, -68 4, -75 -2 Z"
        fill="#0F172A"
        opacity="0.85"
      />

      {/* Silver-grey Translucent Edge Reflective Highlighting */}
      <path
        d="M -70 -11 C -40 -15, 20 -13, 65 -14"
        fill="none"
        stroke="#64748B"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M -45 -6 C -10 -9, 35 -8, 55 -6"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* 4. Oozing Mud Blobs & Spatter Droplets (Vết bùn non loang lổ) */}
      <ellipse cx="-82" cy="-4" rx="8" ry="3.5" fill="#07090F" stroke="#334155" strokeWidth="0.8" />
      <ellipse cx="-52" cy="3" rx="10" ry="4" fill="#07090F" stroke="#334155" strokeWidth="0.8" />
      <ellipse cx="68" cy="2" rx="7" ry="3" fill="#07090F" stroke="#334155" strokeWidth="0.8" />
      <circle cx="-95" cy="-8" r="2.2" fill="#0F172A" />
      <circle cx="86" cy="-8" r="2.5" fill="#0F172A" />
      <circle cx="98" cy="4" r="1.8" fill="#0F172A" />
      <circle cx="-18" cy="5" r="2" fill="#334155" opacity="0.7" />

      {/* Eerie cold mist hovering over wet mud */}
      <ellipse cx="0" cy="-6" rx="65" ry="5" fill="#94A3B8" opacity="0.12" pointerEvents="none" />
    </g>
  );
};

/**
 * 13. OIL LAMP (Đèn Dầu Hột Vịt / Đèn Dầu Cổ Để Bàn)
 * Vintage Vietnamese glass hurricane oil lamp ("đèn hột vịt") with glowing amber wick flame.
 * Anchored at [bottom-center] (0, 0) at Ground Y = 800px (or tabletop via negative offsetY).
 */
const OilLamp: React.FC = () => {
  return (
    <g className="detail-oil-lamp">
      {/* 1. Ground Contact Shadow */}
      <ellipse cx="0" cy="-1.5" rx="18" ry="4" fill="#000000" opacity="0.6" />

      {/* 2. Ambient Warm Amber Glow radiating around the lamp */}
      <circle cx="0" cy="-44" r="48" fill="#FACC15" opacity="0.22" pointerEvents="none" />
      <circle cx="0" cy="-44" r="28" fill="#FEF08A" opacity="0.18" pointerEvents="none" />

      {/* 3. Lamp Base & Fuel Reservoir (Đế đèn thiếc & Bầu dầu thủy tinh) */}
      {/* Flanged tin base foot */}
      <rect x="-14" y="-5" width="28" height="5" rx="1.5" fill="#141419" stroke="#272733" strokeWidth="1" />
      <line x1="-12" y1="-2" x2="12" y2="-2" stroke="#374151" strokeWidth="1" />

      {/* Glass Fuel Bowl (Bầu đựng dầu hột vịt tròn phình) */}
      <ellipse cx="0" cy="-16" rx="15" ry="11" fill="#12141C" stroke="#2F3647" strokeWidth="1.5" />
      {/* Kerosene liquid level inside bowl */}
      <ellipse cx="0" cy="-14" rx="12" ry="7" fill="#2E2310" opacity="0.75" />
      {/* Submerged cotton wick (tim đèn ngâm trong dầu) */}
      <line x1="0" y1="-26" x2="-3" y2="-10" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />

      {/* 4. Brass Burner Collar & Wick Wheel Knob (Họng đèn đồng & Núm vặn bấc) */}
      <rect x="-7" y="-28" width="14" height="6" rx="1" fill="#78350F" stroke="#B45309" strokeWidth="1" />
      {/* Wick adjustment thumb-wheel knob on right */}
      <circle cx="10" cy="-25" r="3.2" fill="#D97706" stroke="#78350F" strokeWidth="0.8" />
      <line x1="7" y1="-25" x2="10" y2="-25" stroke="#78350F" strokeWidth="1.5" />

      {/* 5. Flickering Teardrop Flame inside Glass (Ngọn lửa bấc leo lét) */}
      <g className="anim-flicker-ember">
        {/* Outer Orange Teardrop Flame */}
        <path
          d="M 0 -54 
             C -6 -46, -5 -35, 0 -31 
             C 5 -35, 6 -46, 0 -54 Z"
          fill="#F59E0B"
        />
        {/* Inner Brilliant Yellow Core */}
        <path
          d="M 0 -48 
             C -3 -42, -2.5 -35, 0 -32 
             C 2.5 -35, 3 -42, 0 -48 Z"
          fill="#FEF08A"
        />
        {/* Incandescent white center point */}
        <ellipse cx="0" cy="-34" rx="1.5" ry="2" fill="#FFFFFF" />
      </g>

      {/* 6. Glass Chimney (Bóng đèn thủy tinh hột vịt thon eo) */}
      {/* Chimney path: seated at Y = -27, flares out to rx=10 at Y = -42, tapers to neck at Y = -64, flares out at top rim Y = -72 */}
      <path
        d="M -7 -27 
           C -12 -38, -11 -48, -7 -62 
           C -6 -68, -8 -71, -6 -73 
           L 6 -73 
           C 8 -71, 6 -68, 7 -62 
           C 11 -48, 12 -38, 7 -27 Z"
        fill="#CBD5E1"
        fillOpacity="0.08"
        stroke="#94A3B8"
        strokeWidth="1.2"
      />
      {/* Glass curved highlight reflections */}
      <path
        d="M -6 -32 C -9 -40, -9 -48, -5 -58"
        fill="none"
        stroke="#F8FAFC"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <line x1="4" y1="-34" x2="6" y2="-45" stroke="#F8FAFC" strokeWidth="0.8" opacity="0.4" />
      {/* Scalloped top glass rim */}
      <line x1="-6" y1="-73" x2="6" y2="-73" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
};

/**
 * 14. VINTAGE CASSETTE RADIO (Đài Radio Cassette Cổ Chạy Pin)
 * 1980s-1990s vintage portable radio with metallic whip antenna, tuning scale dial, and speakers.
 * Anchored at [bottom-center] (0, 0) at Ground Y = 800px (or tabletop via negative offsetY).
 */
const VintageRadio: React.FC = () => {
  return (
    <g className="detail-vintage-radio">
      {/* 1. Ground Shadow */}
      <ellipse cx="0" cy="-1.5" rx="44" ry="5.5" fill="#000000" opacity="0.65" />

      {/* 2. Metal Telescopic Whip Antenna (Ăng-ten kim loại vươn chéo) */}
      <g>
        <line x1="28" y1="-56" x2="48" y2="-102" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="29" y1="-56" x2="47" y2="-100" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="48" cy="-102" r="2.5" fill="#E2E8F0" />
      </g>

      {/* 3. Folded Carrying Handle on Top (Quai xách gấp) */}
      <path
        d="M -26 -56 L -26 -64 L 26 -64 L 26 -56"
        fill="none"
        stroke="#1E232E"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M -26 -56 L -26 -64 L 26 -64 L 26 -56"
        fill="none"
        stroke="#334155"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* 4. Main Radio Body Chassis (Hộp máy chữ nhật bo góc) */}
      <rect
        x="-42"
        y="-56"
        width="84"
        height="54"
        rx="4"
        fill="#0D0F14"
        stroke="#1E2430"
        strokeWidth="2"
      />
      {/* Upper control bevel plate */}
      <rect x="-38" y="-53" width="76" height="10" rx="1.5" fill="#141822" />

      {/* Knobs on Top Control Panel */}
      <circle cx="-28" cy="-48" r="3.2" fill="#334155" stroke="#475569" strokeWidth="1" />
      <circle cx="-16" cy="-48" r="3.2" fill="#334155" stroke="#475569" strokeWidth="1" />
      {/* Red Power / Battery Status LED indicator */}
      <circle cx="30" cy="-48" r="2" fill="#EF4444" />
      <circle cx="30" cy="-48" r="0.8" fill="#FCA5A5" />

      {/* 5. Dual Circular Speaker Grilles (Hai màng loa tròn) */}
      {/* Left Speaker */}
      <g>
        <circle cx="-23" cy="-25" r="14" fill="#07080B" stroke="#252D3D" strokeWidth="1.5" />
        <circle cx="-23" cy="-25" r="7" fill="#0E121A" />
        {/* Speaker grille pattern dots */}
        {[-4, 0, 4].map((dx) =>
          [-4, 0, 4].map((dy) => (
            <circle key={`spkL-${dx}-${dy}`} cx={-23 + dx} cy={-25 + dy} r="0.8" fill="#475569" />
          ))
        )}
      </g>
      {/* Right Speaker */}
      <g>
        <circle cx="23" cy="-25" r="14" fill="#07080B" stroke="#252D3D" strokeWidth="1.5" />
        <circle cx="23" cy="-25" r="7" fill="#0E121A" />
        {/* Speaker grille pattern dots */}
        {[-4, 0, 4].map((dx) =>
          [-4, 0, 4].map((dy) => (
            <circle key={`spkR-${dx}-${dy}`} cx={23 + dx} cy={-25 + dy} r="0.8" fill="#475569" />
          ))
        )}
      </g>

      {/* 6. Central Tuning Scale / Cassette Bay (Dải tần số sóng radio) */}
      <rect x="-8" y="-39" width="16" height="32" rx="2" fill="#050709" stroke="#1F2937" strokeWidth="1" />
      {/* Cassette Tape Spools */}
      <circle cx="-3" cy="-30" r="2.5" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
      <circle cx="3" cy="-30" r="2.5" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
      <rect x="-5" y="-23" width="10" height="4" fill="#0B1320" />

      {/* Glowing emerald frequency needle indicator */}
      <g opacity="0.85">
        <line x1="-6" y1="-15" x2="6" y2="-15" stroke="#10B981" strokeWidth="1.4" />
        <rect x="-2" y="-17" width="4" height="4" fill="#34D399" />
      </g>
    </g>
  );
};

/**
 * 15. WATER HYACINTH CLUMP (Bụi Lục Bình Dày Đặc Trôi Nổi)
 * Dense clump of floating water hyacinth ("bèo tây") with spongy bulbous petioles, fleshy leaves, and violet flowers.
 * Anchored at [bottom-center] (0, 0) on Ground/Canal surface Y = 800px.
 */
const WaterHyacinthClump: React.FC = () => {
  return (
    <g className="detail-water-hyacinth anim-sway-subtle">
      {/* 1. Submerged Feathery Dark Roots under Waterline (Y = 0 to Y = 16) */}
      <g stroke="#050C08" strokeWidth="1.2" opacity="0.65">
        <path d="M -35 0 C -42 6, -38 12, -45 18" />
        <path d="M -20 0 C -22 8, -18 14, -24 20" />
        <path d="M -5 0 C -6 8, 0 15, -4 22" />
        <path d="M 12 0 C 15 7, 10 14, 16 21" />
        <path d="M 30 0 C 28 8, 35 14, 32 19" />
        <path d="M 45 0 C 48 6, 44 12, 50 17" />
      </g>

      {/* 2. Water Surface Contact Ripple & Shadow */}
      <ellipse cx="0" cy="0" rx="65" ry="5.5" fill="#000000" opacity="0.55" />
      <ellipse cx="0" cy="0" rx="50" ry="3.5" fill="#08140E" opacity="0.4" />

      {/* 3. Spongy Swollen Leaf Stalks (Cuống lá lục bình phình xốp hình bóng tròn) */}
      {/* Outer base bulbs */}
      <ellipse cx="-38" cy="-5" rx="14" ry="7" fill="#08140E" stroke="#040906" strokeWidth="1" />
      <ellipse cx="-16" cy="-6" rx="16" ry="8" fill="#0B1C13" stroke="#050E09" strokeWidth="1" />
      <ellipse cx="14" cy="-6" rx="17" ry="8.5" fill="#0C1F15" stroke="#050E09" strokeWidth="1" />
      <ellipse cx="38" cy="-5" rx="14" ry="7" fill="#08140E" stroke="#040906" strokeWidth="1" />

      {/* 4. Glossy Rounded Fan-like Green Leaves (Tàu lá lục bình xanh đậm xếp xòe) */}
      {/* Left Leaf 1 */}
      <ellipse cx="-45" cy="-14" rx="16" ry="11" fill="#0F2A1C" stroke="#07170E" strokeWidth="1" transform="rotate(-25, -45, -14)" />
      <path d="M -45 -14 L -54 -20" stroke="#1A402C" strokeWidth="1.2" />

      {/* Left Leaf 2 */}
      <ellipse cx="-24" cy="-18" rx="17" ry="12" fill="#133624" stroke="#081C11" strokeWidth="1" transform="rotate(-12, -24, -18)" />
      <path d="M -24 -18 L -30 -26" stroke="#1D4A32" strokeWidth="1.2" />

      {/* Center Background Leaf */}
      <ellipse cx="0" cy="-22" rx="18" ry="13" fill="#0E281B" stroke="#06150E" strokeWidth="1" />

      {/* Right Leaf 1 */}
      <ellipse cx="24" cy="-18" rx="17" ry="12" fill="#133624" stroke="#081C11" strokeWidth="1" transform="rotate(12, 24, -18)" />
      <path d="M 24 -18 L 30 -26" stroke="#1D4A32" strokeWidth="1.2" />

      {/* Right Leaf 2 */}
      <ellipse cx="45" cy="-14" rx="16" ry="11" fill="#0F2A1C" stroke="#07170E" strokeWidth="1" transform="rotate(25, 45, -14)" />
      <path d="M 45 -14 L 54 -20" stroke="#1A402C" strokeWidth="1.2" />

      {/* 5. Flower Spike & Purple Blossoms (Bông hoa lục bình tím nhạt mộng mị) */}
      <g transform="translate(0, -18)">
        {/* Flower stem spike */}
        <line x1="0" y1="0" x2="0" y2="-22" stroke="#18422B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Lower Flower Petals */}
        <ellipse cx="-6" cy="-14" rx="5" ry="7" fill="#6B21A8" opacity="0.85" transform="rotate(-28, -6, -14)" />
        <ellipse cx="6" cy="-14" rx="5" ry="7" fill="#6B21A8" opacity="0.85" transform="rotate(28, 6, -14)" />
        <ellipse cx="0" cy="-10" rx="4.5" ry="6.5" fill="#7E22CE" opacity="0.9" />

        {/* Top Flower Petals */}
        <ellipse cx="-5" cy="-22" rx="4.5" ry="6.5" fill="#7E22CE" opacity="0.9" transform="rotate(-20, -5, -22)" />
        <ellipse cx="5" cy="-22" rx="4.5" ry="6.5" fill="#7E22CE" opacity="0.9" transform="rotate(20, 5, -22)" />

        {/* Crown Top Center Petal with distinctive blue-yellow eye spot */}
        <ellipse cx="0" cy="-27" rx="5.5" ry="8" fill="#9333EA" />
        <ellipse cx="0" cy="-28" rx="3.5" ry="5" fill="#C084FC" />
        {/* Blue halo on top petal */}
        <circle cx="0" cy="-28" r="2.2" fill="#38BDF8" opacity="0.9" />
        {/* Yellow center eye dot */}
        <circle cx="0" cy="-28" r="1.1" fill="#FACC15" />
      </g>
    </g>
  );
};

/**
 * 16. CHILD SANDALS (Đôi Dép Trẻ Con Bỏ Lại Trên Mặt Đất)
 * Tiny plastic / honeycomb sandals lying askew and abandoned in the squishy mud by the water's edge.
 * Evokes an eerie sense of a child suddenly vanished or pulled into the deep dark canal.
 * Anchored at [bottom-center] (0, 0) on Ground Y = 800px.
 */
const ChildSandals: React.FC = () => {
  return (
    <g className="detail-child-sandals">
      {/* 1. Ground contact shadow & cold squishy mud puddle */}
      <ellipse cx="0" cy="0" rx="46" ry="5.5" fill="#030504" opacity="0.65" />
      <path
        d="M -38 -2 Q -20 3 -4 -1 Q 14 4 38 -1 Q 20 -4 -12 -3 Z"
        fill="#0A110C"
        opacity="0.75"
      />
      {/* Wet mud splatters around the sandals */}
      <ellipse cx="-26" cy="1" rx="4" ry="1.8" fill="#131C14" opacity="0.8" />
      <ellipse cx="28" cy="2" rx="5" ry="2" fill="#131C14" opacity="0.8" />
      <ellipse cx="2" cy="2.5" rx="3" ry="1.2" fill="#0C150E" opacity="0.9" />

      {/* 2. Left Sandal (Dép trái - hơi chếch nghiêng góc -14 độ, lấm bùn) */}
      <g transform="translate(-14, -2) rotate(-14)">
        {/* Soft ground drop shadow beneath left sole */}
        <ellipse cx="0" cy="1.5" rx="13" ry="3.2" fill="#000000" opacity="0.7" />

        {/* Rubber Sole (Đế dép tổ ong dày dặn, có khía rãnh chống trượt) */}
        <rect x="-12" y="-4" width="24" height="4.2" rx="2.1" fill="#141E28" stroke="#080C10" strokeWidth="0.9" />
        {/* Sole bottom tread groove accents */}
        <line x1="-8" y1="-0.4" x2="-8" y2="-1.8" stroke="#080C10" strokeWidth="0.8" />
        <line x1="-3" y1="-0.4" x2="-3" y2="-1.8" stroke="#080C10" strokeWidth="0.8" />
        <line x1="2" y1="-0.4" x2="2" y2="-1.8" stroke="#080C10" strokeWidth="0.8" />
        <line x1="7" y1="-0.4" x2="7" y2="-1.8" stroke="#080C10" strokeWidth="0.8" />

        {/* Inner Footbed / Insole highlight */}
        <path d="M -10 -4 L 10 -4" stroke="#253545" strokeWidth="0.8" opacity="0.7" />

        {/* Upper Strap Arch (Quai dép vòm quai ngang tổ ong) */}
        <path
          d="M -7 -4 C -7 -13, 5 -13, 6 -4"
          fill="none"
          stroke="#273849"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Inner strap shadow depth */}
        <path
          d="M -5.5 -4 C -5.5 -10.5, 4 -10.5, 4.8 -4"
          fill="#0A0E13"
          opacity="0.65"
        />
        {/* Characteristic honeycomb holes (Lỗ tổ ong li ti trên quai dép) */}
        <circle cx="-3" cy="-9" r="0.7" fill="#0E161F" />
        <circle cx="0" cy="-10.2" r="0.7" fill="#0E161F" />
        <circle cx="2.8" cy="-9" r="0.7" fill="#0E161F" />
        <circle cx="-4" cy="-6.5" r="0.7" fill="#0E161F" />
        <circle cx="-1" cy="-7.2" r="0.7" fill="#0E161F" />
        <circle cx="2" cy="-6.8" r="0.7" fill="#0E161F" />

        {/* Wet brown mud smear on front toe */}
        <path d="M -11 -3 Q -5 0 -1 -2" stroke="#1A1208" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
      </g>

      {/* 3. Right Sandal (Dép phải - nằm vẹo hẳn sang một bên góc +26 độ, như bị tụt lại) */}
      <g transform="translate(13, -1) rotate(26)">
        {/* Soft ground drop shadow beneath right sole */}
        <ellipse cx="0" cy="1.5" rx="12" ry="3" fill="#000000" opacity="0.7" />

        {/* Rubber Sole */}
        <rect x="-11" y="-4" width="22" height="4" rx="2" fill="#16222E" stroke="#080D12" strokeWidth="0.9" />
        {/* Tread notches */}
        <line x1="-6" y1="-0.4" x2="-6" y2="-1.8" stroke="#080C10" strokeWidth="0.8" />
        <line x1="-1" y1="-0.4" x2="-1" y2="-1.8" stroke="#080C10" strokeWidth="0.8" />
        <line x1="4" y1="-0.4" x2="4" y2="-1.8" stroke="#080C10" strokeWidth="0.8" />

        {/* Insole outline */}
        <path d="M -9 -4 L 9 -4" stroke="#2B3E52" strokeWidth="0.8" opacity="0.65" />

        {/* Upper Strap Arch */}
        <path
          d="M -6 -4 C -6 -12.5, 4.5 -12.5, 5 -4"
          fill="none"
          stroke="#2E4256"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Inner strap darkness */}
        <path
          d="M -4.5 -4 C -4.5 -10, 3.5 -10, 4 -4"
          fill="#090E14"
          opacity="0.6"
        />
        {/* Honeycomb perforations */}
        <circle cx="-2.5" cy="-8.5" r="0.7" fill="#0D151F" />
        <circle cx="0.5" cy="-9.5" r="0.7" fill="#0D151F" />
        <circle cx="3" cy="-8.5" r="0.7" fill="#0D151F" />
        <circle cx="-3.2" cy="-6.2" r="0.7" fill="#0D151F" />
        <circle cx="-0.2" cy="-6.8" r="0.7" fill="#0D151F" />
        <circle cx="2.5" cy="-6.3" r="0.7" fill="#0D151F" />

        {/* Mud splatter on heel and side */}
        <ellipse cx="6" cy="-2" rx="3.5" ry="1.6" fill="#1C140C" opacity="0.8" />
      </g>

      {/* 4. Tiny cold dew drops & eerie ground mist vapor */}
      <circle cx="-22" cy="-4.5" r="0.8" fill="#E2E8F0" opacity="0.9" />
      <circle cx="7" cy="-5" r="0.7" fill="#E2E8F0" opacity="0.85" />
      <path
        d="M -35 -1 Q -15 -6 5 -2 Q 25 3 42 -1"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="0.8"
        opacity="0.22"
      />
    </g>
  );
};

/**
 * 17. OFFERING TRAY WITH TOYS (Mẹt Đồ Cúng Cô Hồn Trên Đất)
 * Woven bamboo tray with fresh banana leaf lining, a hand of ripe bananas, tiny terracotta clay toys
 * (cooking pot, clay bowl, animal figurine), and lit incense stick with rising pale smoke.
 * Placed on the ground Y = 800px for child wandering ghosts (cô hồn con nít).
 * Anchored at [bottom-center] (0, 0) on Ground Y = 800px.
 */
const OfferingTrayToys: React.FC = () => {
  return (
    <g className="detail-offering-tray-toys">
      {/* 1. Ground contact shadow & spiritual aura */}
      <ellipse cx="0" cy="0" rx="58" ry="7" fill="#000000" opacity="0.6" />
      <ellipse cx="0" cy="-1" rx="44" ry="4.5" fill="#080E0A" opacity="0.5" />
      {/* Spiritual ambient glow */}
      <ellipse cx="0" cy="-16" rx="52" ry="28" fill="url(#candle-eerie-glow)" opacity="0.28" pointerEvents="none" />

      {/* 2. Woven Bamboo Tray (Mẹt tre viền mây mộc mạc) */}
      <ellipse cx="0" cy="-4" rx="52" ry="12" fill="#3D2614" stroke="#1A1008" strokeWidth="1.8" />
      <ellipse cx="0" cy="-5" rx="48" ry="10" fill="#5A3A1E" stroke="#2B1A0D" strokeWidth="1.2" />

      {/* Subtle wicker woven radial weave lines */}
      <g stroke="#3A2312" strokeWidth="0.8" opacity="0.5">
        <line x1="-42" y1="-5" x2="42" y2="-5" />
        <line x1="-30" y1="-10" x2="30" y2="0" />
        <line x1="-30" y1="0" x2="30" y2="-10" />
      </g>

      {/* 3. Banana Leaf Lining (Tàu lá chuối xanh thẫm lót đáy mẹt) */}
      <path
        d="M -44 -6 C -32 -13, 32 -13, 44 -6 C 34 1, -34 1, -44 -6 Z"
        fill="#143019"
        stroke="#0A1C0E"
        strokeWidth="1"
      />
      {/* Midrib and secondary leaf veins */}
      <line x1="-40" y1="-6" x2="40" y2="-6" stroke="#23562C" strokeWidth="1.2" opacity="0.8" />
      {[-30, -20, -10, 0, 10, 20, 30].map((vx) => (
        <line
          key={`leaf-vein-${vx}`}
          x1={vx}
          y1="-6"
          x2={vx + 4}
          y2="-10"
          stroke="#1B4222"
          strokeWidth="0.7"
          opacity="0.6"
        />
      ))}

      {/* 4. Hand of Bananas (Nải chuối cúng cô hồn nằm bên trái mẹt) */}
      <g transform="translate(-16, -10)">
        {/* Dark banana stalk crown */}
        <path d="M -16 -8 Q -6 -13 4 -10 L 3 -6 Q -6 -9 -14 -4 Z" fill="#292524" stroke="#0C0A09" strokeWidth="1" />

        {/* 5 Distinct curved bananas */}
        {/* Banana 1 (leftmost, dark amber) */}
        <path
          d="M -16 -6 C -25 0, -23 9, -12 10 C -15 4, -15 -2, -9 -5 Z"
          fill="#92400E"
          stroke="#451A03"
          strokeWidth="0.9"
        />
        {/* Banana 2 (golden brown) */}
        <path
          d="M -11 -7 C -18 1, -15 11, -4 11 C -8 5, -7 -2, -3 -6 Z"
          fill="#B45309"
          stroke="#451A03"
          strokeWidth="0.9"
        />
        {/* Banana 3 (ripe yellow) */}
        <path
          d="M -5 -8 C -11 0, -7 11, 3 11 C -1 5, 0 -2, 2 -7 Z"
          fill="#CA8A04"
          stroke="#713F12"
          strokeWidth="0.9"
        />
        {/* Banana 4 (bright yellow) */}
        <path
          d="M 0 -8 C -4 0, 0 11, 10 10 C 5 5, 5 -1, 6 -7 Z"
          fill="#EAB308"
          stroke="#854D0E"
          strokeWidth="0.9"
        />
        {/* Banana 5 (greenish yellow accent) */}
        <path
          d="M 4 -7 C 3 0, 9 8, 16 6 C 11 3, 9 -2, 9 -6 Z"
          fill="#65A30D"
          stroke="#365314"
          strokeWidth="0.9"
        />
        {/* Dark banana blossom tips */}
        <circle cx="-12" cy="10" r="1" fill="#1C1917" />
        <circle cx="-4" cy="11" r="1" fill="#1C1917" />
        <circle cx="3" cy="11" r="1" fill="#1C1917" />
        <circle cx="10" cy="10" r="1" fill="#1C1917" />
        <circle cx="16" cy="6" r="1" fill="#1C1917" />
      </g>

      {/* 5. Miniature Terracotta Clay Toys (Đồ chơi đất nung con nít bên phải mẹt) */}
      <g transform="translate(18, -8)">
        {/* Tiny Clay Pot with Lid (Nồi đất nung kho cá nhỏ) */}
        <ellipse cx="-5" cy="0" rx="7.5" ry="6" fill="#9A3412" stroke="#431407" strokeWidth="1.1" />
        <ellipse cx="-5" cy="-4" rx="5.5" ry="1.8" fill="#7C2D12" stroke="#431407" strokeWidth="0.9" />
        {/* Lid and cute clay knob */}
        <path d="M -8.5 -4.8 Q -5 -8.5 -1.5 -4.8 Z" fill="#C2410C" stroke="#431407" strokeWidth="0.9" />
        <circle cx="-5" cy="-7.5" r="1.3" fill="#EA580C" />

        {/* Tiny Clay Bowl (Chén đất nung con nít) */}
        <path d="M 5 2 Q 10 7 15 2 L 14 -0.8 L 6 -0.8 Z" fill="#B45309" stroke="#451A03" strokeWidth="1" />
        <ellipse cx="10" cy="-0.8" rx="4.2" ry="1.4" fill="#78350F" />

        {/* Tiny Clay Figurine / Animal Toy (Con giống đất nung nhỏ) */}
        <g transform="translate(8, -8)">
          <ellipse cx="0" cy="0" rx="4" ry="2.8" fill="#C2410C" stroke="#431407" strokeWidth="0.9" />
          <circle cx="-3" cy="-3" r="2.2" fill="#EA580C" stroke="#431407" strokeWidth="0.8" />
          {/* Ears */}
          <polygon points="-4,-5 -3,-7 -2,-5" fill="#7C2D12" />
          {/* Tiny legs */}
          <line x1="-2" y1="2.5" x2="-2" y2="5" stroke="#431407" strokeWidth="1.1" />
          <line x1="2" y1="2.5" x2="2" y2="5" stroke="#431407" strokeWidth="1.1" />
        </g>
      </g>

      {/* 6. Lit Incense Stick & Rising Thin Smoke (Nén nhang cắm nghiêng đỏ lửa & khói trắng) */}
      <g transform="translate(2, -12)">
        {/* Bamboo incense stick */}
        <line x1="0" y1="6" x2="-6" y2="-28" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        {/* Burning Ember Tip */}
        <circle cx="-6" cy="-28" r="2.2" fill="#DC2626" className="anim-flicker-ember" />
        <circle cx="-6" cy="-28" r="1.2" fill="#FCA5A5" />
        {/* Subtle red glow around ember */}
        <circle cx="-6" cy="-28" r="6" fill="#EF4444" opacity="0.32" pointerEvents="none" />

        {/* Rising Thin Ghostly Smoke Tendril */}
        <path
          d="M -6 -30 C -12 -44, -1 -54, -7 -68 C -13 -80, -3 -92, -8 -105"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1.2"
          opacity="0.6"
          className="anim-smoke-rise"
        />
        {/* Secondary wispy smoke line */}
        <path
          d="M -6 -30 C -2 -42, -9 -52, -4 -64 C 2 -76, -5 -88, -2 -98"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="0.8"
          opacity="0.35"
          className="anim-smoke-rise"
        />
      </g>

      {/* 7. Scattered raw rice & salt grains on tray edge (Gạo muối cúng thí thực) */}
      <g opacity="0.85">
        <circle cx="-42" cy="-2" r="0.8" fill="#F8FAFC" />
        <circle cx="-38" cy="1" r="0.7" fill="#F8FAFC" />
        <circle cx="-34" cy="-3" r="0.8" fill="#F8FAFC" />
        <circle cx="34" cy="-2" r="0.7" fill="#F8FAFC" />
        <circle cx="38" cy="1" r="0.8" fill="#F8FAFC" />
        <circle cx="43" cy="-1.5" r="0.7" fill="#F8FAFC" />
      </g>
    </g>
  );
};

/**
 * 18. VINTAGE MATCHBOX (Hộp Quẹt Diêm Cổ Để Bàn)
 * Small aged brownish-yellow paper matchbox slightly slid open with red-tipped matches.
 * Anchored at [bottom-center] (0, 0) — supports negative offsetY to sit on wooden table.
 */
const Matchbox: React.FC = () => {
  return (
    <g className="detail-matchbox">
      {/* Subtle contact shadow */}
      <ellipse cx="0" cy="0" rx="20" ry="3.5" fill="#000000" opacity="0.55" />

      {/* Slid-out inner wooden/cardboard tray on the right */}
      <g transform="translate(8, -2)">
        <polygon
          points="-6,-6 12,-6 14,0 -4,0"
          fill="#78350F"
          stroke="#271406"
          strokeWidth="1"
        />
        {/* Tiny matchsticks inside tray */}
        <line x1="-1" y1="-4" x2="8" y2="-4" stroke="#E7E5E4" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="8.5" cy="-4" r="1.4" fill="#991B1B" />
        <line x1="0" y1="-2" x2="10" y2="-2" stroke="#D6D3D1" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="10.5" cy="-2" r="1.4" fill="#DC2626" />
      </g>

      {/* Outer aged brownish-yellow paper matchbox sleeve */}
      <polygon
        points="-16,-9 6,-9 8,-1 -14,-1"
        fill="#B45309"
        stroke="#451A03"
        strokeWidth="1.1"
      />
      {/* Front striker strip (dark brown/charcoal phosphorus) */}
      <rect x="-15" y="-5" width="21" height="4" rx="0.6" fill="#1C1917" stroke="#0A0A0C" strokeWidth="0.8" />
      {/* Vintage faded cream label on top */}
      <polygon
        points="-12,-8.2 3,-8.2 4,-5.5 -11,-5.5"
        fill="#FDE68A"
        opacity="0.78"
      />
      {/* Tiny silhouette flame emblem on label */}
      <circle cx="-4" cy="-6.8" r="1" fill="#991B1B" />

      {/* One stray matchstick resting beside the box on surface y=0 */}
      <line x1="-18" y1="0" x2="-7" y2="1.5" stroke="#D6D3D1" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="-6.5" cy="1.5" r="1.4" fill="#991B1B" />
    </g>
  );
};

/**
 * 19. WATER DROPLETS OUTSIDE WINDOW (Giọt Nước Nhỏ Tí Tách Bên Ngoài Cửa Sổ)
 * Dripping water droplets forming small concentric ripples in the dark, hinting at a wet entity lurking outside.
 * Anchored at [bottom-center] (0, 0).
 */
const WaterDroplets: React.FC = () => {
  return (
    <g className="detail-water-droplets">
      {/* Dark wet dampness & concentric water ripples at [0, 0] */}
      <ellipse cx="0" cy="0" rx="28" ry="6" fill="#0F172A" opacity="0.65" />
      <ellipse
        cx="0"
        cy="0"
        rx="22"
        ry="4.5"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1"
        opacity="0.5"
        className="anim-moon-pulse"
      />
      <ellipse
        cx="0"
        cy="0"
        rx="12"
        ry="2.5"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="1.1"
        opacity="0.7"
      />
      <ellipse cx="-14" cy="2" rx="7" ry="1.8" fill="none" stroke="#64748B" strokeWidth="0.8" opacity="0.45" />

      {/* Vertical trail of falling cold water droplets */}
      <g className="anim-sway-subtle">
        {/* Top droplet */}
        <path
          d="M -2 -88 C -5 -81, -5 -76, -2 -76 C 1 -76, 1 -81, -2 -88 Z"
          fill="#CBD5E1"
          fillOpacity="0.75"
          stroke="#64748B"
          strokeWidth="0.8"
        />
        <circle cx="-2.8" cy="-79" r="0.7" fill="#FFFFFF" opacity="0.85" />

        {/* Middle droplet */}
        <path
          d="M 4 -58 C 1 -50, 1 -44, 4 -44 C 7 -44, 7 -50, 4 -58 Z"
          fill="#E2E8F0"
          fillOpacity="0.82"
          stroke="#64748B"
          strokeWidth="0.8"
        />
        <circle cx="3.2" cy="-47" r="0.8" fill="#FFFFFF" opacity="0.9" />

        {/* Bottom droplet about to hit surface */}
        <path
          d="M 0 -24 C -3.5 -16, -3.5 -10, 0 -10 C 3.5 -10, 3.5 -16, 0 -24 Z"
          fill="#CBD5E1"
          fillOpacity="0.85"
          stroke="#475569"
          strokeWidth="0.9"
        />
        <circle cx="-1" cy="-13.5" r="0.9" fill="#FFFFFF" opacity="0.9" />

        {/* Tiny side splash droplets */}
        <circle cx="-12" cy="-34" r="1.4" fill="#94A3B8" opacity="0.65" />
        <circle cx="11" cy="-18" r="1.2" fill="#CBD5E1" opacity="0.6" />
      </g>
    </g>
  );
};

/**
 * 20. PORRIDGE BOWL & CERAMIC SPOON (Bát Cháo Trắng & Muỗng Sứ)
 * Rural white rice porridge bowl with a ceramic spoon and thin rising warm steam.
 * Anchored at [bottom-center] (0, 0), supports negative offsetY (e.g. -75) to sit on wooden table.
 */
const PorridgeBowl: React.FC = () => {
  return (
    <g className="detail-porridge-bowl">
      {/* Subtle contact shadow on table/ground at y=0 */}
      <ellipse cx="0" cy="0" rx="22" ry="3.2" fill="#050507" opacity="0.55" />

      {/* Bowl foot ring (đế bát sứ) */}
      <path
        d="M -12 -3 L 12 -3 L 10 0 L -10 0 Z"
        fill="#64748B"
        stroke="#0F172A"
        strokeWidth="0.9"
      />

      {/* Outer ceramic bowl body (thân tô/bát sứ) */}
      <path
        d="M -25 -20 C -24 -9, -17 -3, -11 -3 L 11 -3 C 17 -3, 24 -9, 25 -20 Z"
        fill="#94A3B8"
        stroke="#0F172A"
        strokeWidth="1.2"
      />
      {/* Left-side soft shading on bowl */}
      <path
        d="M -25 -20 C -24 -9, -17 -3, -11 -3 L -3 -3 C -9 -6, -13 -12, -14 -20 Z"
        fill="#475569"
        opacity="0.45"
      />

      {/* Bowl rim & white rice porridge surface */}
      <ellipse
        cx="0"
        cy="-20"
        rx="25"
        ry="5.5"
        fill="#CBD5E1"
        stroke="#0F172A"
        strokeWidth="1.1"
      />
      <ellipse cx="0" cy="-19.5" rx="22" ry="4.2" fill="#F1F5F9" />
      {/* Subtle porridge texture ripples */}
      <path
        d="M -13 -19 Q -5 -17.5, 4 -19.5 M -7 -21 Q 3 -20, 12 -21"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Ceramic spoon resting inside the bowl (muỗng sứ) */}
      <g className="porridge-ceramic-spoon">
        {/* Spoon handle leaning out to the upper-right */}
        <path
          d="M 4 -19 L 23 -32 C 25 -33.5, 27.5 -31.5, 26 -29.5 L 9 -17.5 Z"
          fill="#E2E8F0"
          stroke="#1E293B"
          strokeWidth="0.9"
        />
        {/* Spoon scoop dipped into porridge */}
        <ellipse
          cx="3"
          cy="-18.8"
          rx="5.5"
          ry="2.3"
          transform="rotate(-12 3 -18.8)"
          fill="#F8FAFC"
          stroke="#334155"
          strokeWidth="0.8"
        />
      </g>

      {/* Thin rising warm steam wisps (làn khói ấm mỏng) */}
      <g className="anim-sway-subtle" opacity="0.55">
        <path
          d="M -8 -25 C -12 -33, -4 -39, -9 -47 C -12 -52, -7 -57, -9 -62"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M 1 -24 C 5 -32, -2 -40, 3 -48 C 6 -54, 1 -59, 3 -65"
          fill="none"
          stroke="#F8FAFC"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M 10 -24 C 14 -31, 8 -37, 12 -45"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.45"
        />
      </g>
    </g>
  );
};

interface HumanBodySilhouetteProps {
  fill?: string;
  rimStroke?: string;
  pose?: "standing" | "walking" | "standing_alt";
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
}

/**
 * Reusable pure human body silhouette (no face, no clothes) anchored at [0, 0] feet.
 */
const HumanBodySilhouette: React.FC<HumanBodySilhouetteProps> = ({
  fill = COLOR_PALETTE.silhouette_primary,
  rimStroke = "#1E1E26",
  pose = "standing",
  x = 0,
  y = 0,
  scaleX = 1,
  scaleY = 1,
  opacity = 1,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`} opacity={opacity}>
      {/* Head & Neck (pure smooth silhouette, no face) */}
      <ellipse cx="0" cy="-242" rx="16" ry="20" fill={fill} stroke={rimStroke} strokeWidth="0.9" />
      <rect x="-6.5" y="-225" width="13" height="16" rx="4" fill={fill} />

      {pose === "standing" && (
        <g>
          {/* Back Arm */}
          <path
            d="M -22 -204 C -28 -172, -30 -142, -26 -112 C -25 -105, -18 -105, -17 -112 C -16 -138, -15 -168, -12 -194 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
          {/* Torso */}
          <path
            d="M -24 -206 C -26 -212, 26 -212, 24 -206 L 19 -122 C 18 -112, -18 -112, -19 -122 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.9"
          />
          {/* Legs */}
          <path
            d="M -17 -118 L -19 -58 L -17 -4 C -17 0, -6 0, -6 -4 L -4 -62 L -1 -112 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
          <path
            d="M 1 -112 L 5 -60 L 7 -4 C 7 0, 18 0, 18 -4 L 19 -58 L 17 -118 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
          {/* Front Arm */}
          <path
            d="M 21 -204 C 28 -170, 29 -140, 25 -110 C 24 -103, 17 -103, 16 -110 C 16 -138, 15 -168, 13 -194 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
        </g>
      )}

      {pose === "standing_alt" && (
        <g>
          {/* Slightly turned torso & relaxed arms */}
          <path
            d="M -22 -205 C -24 -211, 23 -211, 21 -205 L 17 -122 C 16 -112, -16 -112, -17 -122 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.9"
          />
          {/* Arms slightly bent */}
          <path
            d="M -20 -202 C -26 -175, -24 -150, -14 -132 C -11 -127, -6 -130, -9 -136 C -15 -150, -16 -172, -12 -194 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
          <path
            d="M 19 -202 C 25 -172, 24 -144, 18 -114 C 17 -108, 10 -109, 11 -115 C 14 -142, 14 -170, 11 -194 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
          {/* Legs */}
          <path
            d="M -16 -118 L -18 -58 L -15 -4 C -15 0, -5 0, -5 -4 L -3 -62 L 0 -112 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
          <path
            d="M 1 -112 L 6 -60 L 11 -4 C 11 0, 21 0, 20 -4 L 18 -58 L 16 -118 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
        </g>
      )}

      {pose === "walking" && (
        <g>
          {/* Back Arm swinging backward */}
          <path
            d="M -18 -202 C -32 -174, -42 -148, -46 -122 C -47 -116, -39 -114, -37 -120 C -31 -144, -22 -170, -11 -193 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
          {/* Back Leg trailing */}
          <path
            d="M -14 -118 L -28 -62 L -42 -6 C -43 -1, -33 1, -31 -4 L -16 -58 L -2 -112 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
          {/* Slightly leaned forward Torso */}
          <path
            d="M -21 -206 C -22 -212, 24 -211, 23 -205 L 17 -121 C 15 -112, -17 -112, -18 -121 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.9"
          />
          {/* Front Leg striding forward */}
          <path
            d="M 1 -112 L 18 -60 L 33 -4 C 35 0, 44 -1, 42 -6 L 27 -62 L 15 -118 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
          {/* Front Arm swinging forward */}
          <path
            d="M 19 -202 C 30 -174, 38 -148, 40 -122 C 41 -116, 33 -115, 31 -121 C 28 -146, 20 -170, 11 -193 Z"
            fill={fill}
            stroke={rimStroke}
            strokeWidth="0.8"
          />
        </g>
      )}
    </g>
  );
};

/**
 * 21. NPC SILHOUETTE STANDING (Bóng người NPC đứng - Cơ thể thuần)
 */
const NpcSilhouetteStanding: React.FC = () => {
  return (
    <g>
      <HumanBodySilhouette pose="standing" />
    </g>
  );
};

/**
 * 22. NPC SILHOUETTE WALKING (Bóng người NPC bước đi - Cơ thể thuần)
 */
const NpcSilhouetteWalking: React.FC = () => {
  return (
    <g>
      <HumanBodySilhouette pose="walking" />
    </g>
  );
};

/**
 * 23. NPC CROWD GROUP (Nhóm đông người NPC đứng tụ tập - 4 bóng người)
 */
const NpcCrowdGroup: React.FC = () => {
  return (
    <g>
      {/* Back row (slightly smaller & lighter silhouette for depth separation) */}
      <HumanBodySilhouette
        pose="standing_alt"
        x={-48}
        y={-4}
        scaleX={0.92}
        scaleY={0.92}
        fill="#191922"
        rimStroke="#2A2A36"
        opacity={0.92}
      />
      <HumanBodySilhouette
        pose="standing"
        x={38}
        y={-6}
        scaleX={-0.95}
        scaleY={0.95}
        fill="#16161E"
        rimStroke="#272732"
        opacity={0.95}
      />
      {/* Front row */}
      <HumanBodySilhouette
        pose="standing"
        x={-16}
        y={0}
        scaleX={1}
        scaleY={1}
        fill={COLOR_PALETTE.silhouette_primary}
        rimStroke="#22222B"
      />
      <HumanBodySilhouette
        pose="standing_alt"
        x={66}
        y={0}
        scaleX={-0.88}
        scaleY={0.88}
        fill={COLOR_PALETTE.silhouette_secondary}
        rimStroke="#24242E"
      />
    </g>
  );
};

/**
 * 24. NPC CROWD WALKING (Đoàn người NPC di chuyển - 4 bóng người bước đi)
 */
const NpcCrowdWalking: React.FC = () => {
  return (
    <g>
      {/* Back row walkers */}
      <HumanBodySilhouette
        pose="walking"
        x={-68}
        y={-5}
        scaleX={0.9}
        scaleY={0.9}
        fill="#191922"
        rimStroke="#2A2A36"
        opacity={0.92}
      />
      <HumanBodySilhouette
        pose="walking"
        x={22}
        y={-4}
        scaleX={0.94}
        scaleY={0.94}
        fill="#16161E"
        rimStroke="#272732"
        opacity={0.95}
      />
      {/* Front row walkers */}
      <HumanBodySilhouette
        pose="walking"
        x={-22}
        y={0}
        scaleX={1}
        scaleY={1}
        fill={COLOR_PALETTE.silhouette_primary}
        rimStroke="#22222B"
      />
      <HumanBodySilhouette
        pose="walking"
        x={72}
        y={0}
        scaleX={0.87}
        scaleY={0.87}
        fill={COLOR_PALETTE.silhouette_secondary}
        rimStroke="#24242E"
      />
    </g>
  );
};

/**
 * 25. FISH SPLASH (Cá lóc quẫy nước dưới kênh đêm)
 * Curved snakehead fish silhouette leaping from dark canal water with concentric ripples & silver-white splashes.
 * Anchored at [bottom-center] (0, 0) = Water surface Y=800px.
 */
const FishSplash: React.FC = () => {
  return (
    <g className="detail-fish-splash">
      {/* Concentric water ripples on dark canal surface */}
      <ellipse cx="0" cy="0" rx="54" ry="11" fill="#090D14" opacity="0.72" />
      <ellipse
        cx="0"
        cy="0"
        rx="48"
        ry="9.5"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1.2"
        opacity="0.55"
        className="anim-moon-pulse"
      />
      <ellipse
        cx="0"
        cy="0"
        rx="32"
        ry="6.5"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="1.3"
        opacity="0.7"
      />
      <ellipse
        cx="-4"
        cy="1"
        rx="18"
        ry="3.8"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="1"
        opacity="0.78"
      />

      {/* Leaping snakehead fish silhouette (cá lóc uốn cong vọt lên) */}
      <g className="anim-sway-subtle">
        <path
          d="M -26 -4 C -24 -28, -6 -46, 16 -42 C 28 -40, 36 -30, 38 -22 C 30 -24, 22 -26, 12 -28 C -2 -30, -14 -20, -16 -3 Z"
          fill={COLOR_PALETTE.silhouette_primary}
          stroke="#334155"
          strokeWidth="1"
        />
        {/* Dorsal fin (vây lưng dài đặc trưng cá lóc) */}
        <path
          d="M -14 -26 Q 2 -42, 18 -36 L 14 -31 Q 2 -33, -10 -22 Z"
          fill="#141820"
        />
        {/* Caudal tail fin (vây đuôi) */}
        <path
          d="M -22 -5 L -34 -12 L -30 -2 L -35 4 L -19 -2 Z"
          fill={COLOR_PALETTE.silhouette_primary}
        />
        {/* Faint moonlit rim highlight on arched back */}
        <path
          d="M -18 -20 C -8 -36, 10 -41, 28 -33"
          fill="none"
          stroke="#94A3B8"
          strokeWidth="1.1"
          opacity="0.65"
          strokeLinecap="round"
        />
      </g>

      {/* Silver-white water splash arcs & droplets */}
      <g fill="#E2E8F0" opacity="0.82">
        <path d="M -22 -4 Q -36 -24, -44 -34 Q -32 -20, -18 -4 Z" fill="#CBD5E1" opacity="0.75" />
        <path d="M 22 -3 Q 36 -20, 44 -28 Q 30 -16, 18 -2 Z" fill="#CBD5E1" opacity="0.7" />
        <circle cx="-38" cy="-40" r="2.2" />
        <circle cx="-46" cy="-24" r="1.6" />
        <circle cx="-12" cy="-52" r="1.8" />
        <circle cx="8" cy="-55" r="1.5" />
        <circle cx="34" cy="-38" r="2" />
        <circle cx="46" cy="-22" r="1.6" />
        <circle cx="26" cy="-14" r="1.4" />
      </g>
    </g>
  );
};

/**
 * 26. FALLING COCONUT (Trái dừa khô rụng bịch xuống đất)
 * Dried dark-husked coconut resting on ground with vertical falling motion streaks & impact dust.
 * Anchored at [bottom-center] (0, 0) = Ground Y=800px.
 */
const FallingCoconut: React.FC = () => {
  return (
    <g className="detail-falling-coconut">
      {/* Vertical falling motion streaks from above (vệt chuyển động rơi thẳng đứng) */}
      <g stroke="#CBD5E1" strokeLinecap="round" opacity="0.45">
        <line x1="-10" y1="-152" x2="-10" y2="-36" strokeWidth="1.4" strokeDasharray="18 8 10 6" />
        <line x1="0" y1="-168" x2="0" y2="-32" strokeWidth="1.8" strokeDasharray="24 7 12 5" />
        <line x1="11" y1="-142" x2="11" y2="-34" strokeWidth="1.2" strokeDasharray="14 9 8 6" />
      </g>

      {/* Ground impact shadow */}
      <ellipse cx="0" cy="0" rx="26" ry="5.5" fill="#040507" opacity="0.8" />

      {/* Light dust puffs kicking up from ground impact (bụi đất nhẹ bắn lên) */}
      <g fill="#94A3B8" opacity="0.42">
        <path d="M -18 -1 Q -28 -8, -34 -3 Q -29 -14, -18 -7 Z" />
        <path d="M 18 -1 Q 29 -9, 36 -3 Q 30 -15, 19 -7 Z" />
        <circle cx="-27" cy="-14" r="2.8" />
        <circle cx="28" cy="-13" r="2.4" />
        <circle cx="-35" cy="-7" r="1.8" />
        <circle cx="37" cy="-6" r="1.6" />
      </g>

      {/* Dried dark-husked coconut (trái dừa khô vỏ sẫm màu) */}
      <g transform="rotate(-14 0 -13)">
        <ellipse
          cx="0"
          cy="-13"
          rx="18"
          ry="14.5"
          fill="#141110"
          stroke="#2A2421"
          strokeWidth="1.1"
        />
        {/* Fibrous husk ridges */}
        <path d="M -13 -18 Q 0 -22, 13 -16" fill="none" stroke="#292320" strokeWidth="1.2" opacity="0.75" />
        <path d="M -15 -11 Q 0 -14, 15 -9" fill="none" stroke="#292320" strokeWidth="1.1" opacity="0.65" />
        <path d="M -12 -5 Q 0 -6, 12 -4" fill="none" stroke="#080706" strokeWidth="1.2" opacity="0.8" />
        {/* Dried stem cap */}
        <path d="M -19 -14 L -22 -16 L -21 -11 L -18 -10 Z" fill="#1F1A17" />
      </g>
    </g>
  );
};

/**
 * 27. ROOSTER CROWING (Bóng gà trống gáy sáng phía xa)
 * Silhouette of a crowing rooster stretching its neck at dawn with faint sound wave arcs in morning mist.
 * Anchored at [bottom-center] (0, 0).
 */
const RoosterCrowing: React.FC = () => {
  return (
    <g className="detail-rooster-crowing">
      {/* Subtle perch / fence rail base at [0, 0] */}
      <rect x="-32" y="-3" width="64" height="4" rx="1.5" fill="#12141A" opacity="0.85" />

      {/* Rooster legs & claws */}
      <g stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="2" strokeLinecap="round">
        <line x1="-4" y1="-20" x2="-6" y2="-2" />
        <line x1="5" y1="-20" x2="7" y2="-2" />
        <line x1="-9" y1="-2" x2="-2" y2="-2" />
        <line x1="4" y1="-2" x2="11" y2="-2" />
      </g>

      {/* Rooster body, puffed chest & stretched crowing neck */}
      <path
        d="M -18 -26
           C -16 -38, -2 -44, 10 -40
           C 14 -52, 18 -64, 21 -72
           L 26 -72
           C 26 -62, 23 -50, 22 -38
           C 20 -26, 10 -18, -4 -19
           C -14 -20, -19 -22, -18 -26 Z"
        fill={COLOR_PALETTE.silhouette_primary}
        stroke="#1E293B"
        strokeWidth="0.9"
      />

      {/* Sweeping curved tail feathers (lông đuôi cong vút) */}
      <path
        d="M -14 -31 C -28 -44, -40 -46, -44 -34 C -36 -38, -26 -35, -18 -25 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />
      <path
        d="M -16 -27 C -30 -35, -42 -32, -46 -22 C -37 -26, -28 -25, -17 -22 Z"
        fill="#0D0F14"
      />

      {/* Jagged rooster comb & wattle (mào & tích gà trống) */}
      <path
        d="M 19 -72 L 18 -79 L 22 -76 L 25 -81 L 27 -75 L 30 -78 L 28 -71 Z"
        fill="#1E1418"
      />
      <ellipse cx="26" cy="-66" rx="2" ry="3.2" fill="#1E1418" />

      {/* Open crowing beak pointing up-right */}
      <polygon points="26,-72 35,-76 27,-70" fill={COLOR_PALETTE.silhouette_primary} />
      <polygon points="27,-69 34,-69 26,-67" fill={COLOR_PALETTE.silhouette_primary} />

      {/* Faint dawn sound waves radiating from beak in morning mist */}
      <g fill="none" stroke="#CBD5E1" strokeLinecap="round" className="anim-moon-pulse">
        <path d="M 39 -79 Q 45 -73, 40 -66" strokeWidth="1.4" opacity="0.65" />
        <path d="M 45 -84 Q 54 -73, 46 -61" strokeWidth="1.2" opacity="0.45" />
        <path d="M 51 -89 Q 63 -73, 52 -56" strokeWidth="1" opacity="0.28" />
      </g>
    </g>
  );
};


