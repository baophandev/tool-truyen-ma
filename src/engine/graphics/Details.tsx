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

