import React from "react";
import type { HeldItemId } from "../types";
import { COLOR_PALETTE } from "../constants";

export interface HeldItemMeta {
  id: HeldItemId;
  name: string;
  desc: string;
}

export const HELD_ITEM_CATALOG: HeldItemMeta[] = [
  { id: "none", name: "Không cầm đồ vật", desc: "Hai tay trống không" },
  { id: "item_storm_lantern", name: "Đèn bão sắt cổ phát sáng", desc: "Quầng sáng vàng ấm soi rọi màn sương" },
  { id: "item_paper_lantern", name: "Đèn lồng giấy đỏ cầm tay", desc: "Đèn lồng cán gỗ tỏa ánh đỏ ma mị" },
  { id: "item_soul_candle", name: "Nến cầu hồn sáp chảy", desc: "Ngọn lửa lân tinh lập lòe trên đĩa đồng" },
  { id: "item_peach_wood_sword", name: "Kiếm gỗ đào trừ tà", desc: "Kiếm đạo sĩ khắc ấn chú & tua chỉ đỏ" },
  { id: "item_yellow_talisman", name: "Lá bùa vàng trấn yểm", desc: "Bùa giấy vàng viết chữ chu sa giơ tay" },
  { id: "item_rusty_sickle", name: "Liềm gỉ vương máu", desc: "Lưỡi liềm rỉ sét sắc lạnh mang dấu máu" },
  { id: "item_ritual_bell", name: "Chuông đồng triệu hồn", desc: "Chuông Tam Thanh dùng trong nghi lễ gọi hồn" },
  { id: "item_tattered_doll", name: "Búp bê vải rách kinh dị", desc: "Búp bê mất đầu bằng vải bố khâu vá" },
  { id: "item_tattered_umbrella", name: "Ô giấy dầu cổ rách nát", desc: "Cây dù cổ rách tơi tả che sương đêm" },
];

interface HandheldItemRendererProps {
  itemId?: HeldItemId;
  scale?: number;
}

/**
 * Pure SVG/JSX procedural handheld props anchored at [0, 0] = character palm grip point.
 * Attached directly inside ArmsRig hand socket so CSS animations and facing flips move it in lockstep.
 */
export const HandheldItemRenderer: React.FC<HandheldItemRendererProps> = ({
  itemId = "none",
  scale = 1,
}) => {
  if (!itemId || itemId === "none") return null;

  return (
    <g transform={`scale(${scale})`} className="handheld-item-root">
      {renderHeldItemSvg(itemId)}
    </g>
  );
};

function renderHeldItemSvg(itemId: Exclude<HeldItemId, "none">) {
  switch (itemId) {
    case "item_storm_lantern":
      return (
        <g className="held-storm-lantern anim-sway-subtle">
          {/* Warm atmospheric glow */}
          <circle cx="0" cy="34" r="56" fill="url(#lantern-warm-glow)" opacity="0.68" />
          {/* Bail wire hooking palm [0, 0] */}
          <path
            d="M -6 0 C -8 10, -10 14, -7 18 L 7 18 C 10 14, 8 10, 6 0"
            fill="none"
            stroke="#334155"
            strokeWidth="2.2"
          />
          <circle cx="0" cy="0" r="3" fill="#475569" />
          {/* Lantern chimney & dome */}
          <path d="M -9 18 L 9 18 L 6 12 L -6 12 Z" fill="#1E293B" stroke="#090B0E" strokeWidth="1.2" />
          <rect x="-12" y="18" width="24" height="5" rx="2" fill="#0F172A" />
          {/* Glowing glass chamber */}
          <path
            d="M -10 23 C -13 31, -13 40, -9 46 L 9 46 C 13 40, 13 31, 10 23 Z"
            fill="#FDE047"
            opacity="0.92"
            stroke="#78350F"
            strokeWidth="1.5"
          />
          {/* Inner flame */}
          <path d="M 0 28 C 3 34, 3 41, 0 43 C -3 41, -3 34, 0 28 Z" fill="#FFFBEB" className="anim-flicker-ember" />
          {/* Protective cage ribs & base */}
          <line x1="-10" y1="23" x2="-9" y2="46" stroke="#1E293B" strokeWidth="1.6" />
          <line x1="0" y1="23" x2="0" y2="46" stroke="#1E293B" strokeWidth="1.2" opacity="0.8" />
          <line x1="10" y1="23" x2="9" y2="46" stroke="#1E293B" strokeWidth="1.6" />
          <rect x="-13" y="46" width="26" height="7" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1" />
        </g>
      );

    case "item_paper_lantern":
      return (
        <g className="held-paper-lantern">
          {/* Carrying bamboo stick held at [0,0] extending forward */}
          <line x1="-8" y1="3" x2="40" y2="-14" stroke="#4A3525" strokeWidth="3.5" strokeLinecap="round" />
          {/* Hanging red paper lantern */}
          <g transform="translate(38, -13)" className="anim-sway-subtle">
            <circle cx="0" cy="30" r="46" fill="url(#blood-moon-glow-radial)" opacity="0.65" />
            <line x1="0" y1="0" x2="0" y2="12" stroke="#D4AF37" strokeWidth="1.8" />
            <rect x="-8" y="12" width="16" height="4" rx="1" fill="#0F172A" />
            <ellipse cx="0" cy="29" rx="14" ry="17" fill="#B91C1C" stroke="#450A0A" strokeWidth="1.4" />
            <ellipse cx="0" cy="29" rx="8" ry="12" fill="#F59E0B" opacity="0.65" className="anim-flicker-ember" />
            <path d="M -12 22 Q 0 25 12 22" fill="none" stroke="#450A0A" strokeWidth="1" />
            <path d="M -13 30 Q 0 33 13 30" fill="none" stroke="#450A0A" strokeWidth="1" />
            <path d="M -11 38 Q 0 41 11 38" fill="none" stroke="#450A0A" strokeWidth="1" />
            <rect x="-7" y="45" width="14" height="4" rx="1" fill="#0F172A" />
            {/* Tassel */}
            <line x1="0" y1="49" x2="0" y2="63" stroke={COLOR_PALETTE.accent_bright_red} strokeWidth="2.5" />
          </g>
        </g>
      );

    case "item_soul_candle":
      return (
        <g className="held-soul-candle">
          {/* Eerie spirit glow */}
          <circle cx="0" cy="-42" r="44" fill="url(#candle-eerie-glow)" opacity="0.7" />
          {/* Bronze saucer handle */}
          <ellipse cx="0" cy="2" rx="12" ry="4" fill="#92400E" stroke="#451A03" strokeWidth="1.2" />
          <path d="M -12 2 C -18 2, -18 11, -11 10" fill="none" stroke="#B45309" strokeWidth="2.4" />
          {/* Melted wax candle stick */}
          <rect x="-5" y="-32" width="10" height="33" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
          {/* Wax drips */}
          <path d="M -5 -26 Q -7 -16 -5 -12" stroke="#CBD5E1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 5 -22 Q 7 -10 5 -6" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Wick & Flame */}
          <line x1="0" y1="-32" x2="0" y2="-36" stroke="#0F172A" strokeWidth="1.5" />
          <path
            d="M 0 -49 C 5 -42, 4 -36, 0 -35 C -4 -36, -5 -42, 0 -49 Z"
            fill="#FDE047"
            className="anim-flicker-ember"
          />
          <circle cx="0" cy="-40" r="2.2" fill="#ECFDF5" />
        </g>
      );

    case "item_peach_wood_sword":
      return (
        <g className="held-peach-sword" transform="rotate(-38)">
          {/* Tassel dangling from pommel */}
          <path d="M 0 12 Q -6 22 -3 30" stroke={COLOR_PALETTE.accent_bright_red} strokeWidth="2.5" fill="none" />
          {/* Hilt & Pommel */}
          <rect x="-3" y="-6" width="6" height="18" rx="1.5" fill="#451A03" stroke="#1C0F07" strokeWidth="1" />
          <circle cx="0" cy="12" r="4" fill="#D4AF37" />
          {/* Bronze guard */}
          <polygon points="-13,-7 13,-7 9,-12 -9,-12" fill="#D4AF37" stroke="#78350F" strokeWidth="1" />
          {/* Dark crimson-brown peach wood blade pointing up */}
          <polygon
            points="-5,-12 5,-12 3,-92 0,-104 -3,-92"
            fill="#5C2318"
            stroke="#1C0C0E"
            strokeWidth="1.3"
          />
          <line x1="0" y1="-18" x2="0" y2="-92" stroke="#D4AF37" strokeWidth="1.1" strokeDasharray="5,4" opacity="0.85" />
          {/* Red spirit binding near guard */}
          <rect x="-4.5" y="-22" width="9" height="5" fill={COLOR_PALETTE.accent_blood_red} />
        </g>
      );

    case "item_yellow_talisman":
      return (
        <g className="held-yellow-talisman" transform="rotate(14)">
          <circle cx="0" cy="-26" r="30" fill="url(#lantern-warm-glow)" opacity="0.35" />
          <g className="anim-sway-subtle">
            <polygon
              points="-9,4 9,4 11,-50 4,-54 0,-49 -4,-54 -11,-50"
              fill={COLOR_PALETTE.accent_talisman_yellow}
              stroke="#854D0E"
              strokeWidth="1"
            />
            <line x1="0" y1="-44" x2="0" y2="-6" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2.4" />
            <line x1="-6" y1="-34" x2="6" y2="-34" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="1.8" />
            <line x1="-5" y1="-22" x2="5" y2="-22" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="1.8" />
            <circle cx="0" cy="-12" r="2.6" fill={COLOR_PALETTE.accent_blood_red} />
          </g>
        </g>
      );

    case "item_rusty_sickle":
      return (
        <g className="held-rusty-sickle" transform="rotate(-12)">
          {/* Worn wooden grip */}
          <rect x="-3.5" y="-16" width="7" height="28" rx="2" fill="#4A3222" stroke="#1A110B" strokeWidth="1" />
          <circle cx="0" cy="-16" r="4" fill="#334155" />
          {/* Curved rusty crescent blade */}
          <path
            d="M 0 -18 C 30 -32, 50 -20, 44 12 C 36 -8, 22 -14, 0 -10 Z"
            fill="#475569"
            stroke="#0F172A"
            strokeWidth="1.4"
          />
          {/* Inner sharp edge & rust patches */}
          <path d="M 3 -12 C 23 -15, 36 -8, 43 9" fill="none" stroke="#94A3B8" strokeWidth="1.3" />
          {/* Blood stain at blade tip */}
          <path d="M 41 0 C 46 4, 46 11, 43 13 C 40 9, 40 4, 41 0 Z" fill={COLOR_PALETTE.accent_blood_red} />
        </g>
      );

    case "item_ritual_bell":
      return (
        <g className="held-ritual-bell anim-sway-subtle">
          {/* Ornate pronged handle */}
          <rect x="-2.5" y="-12" width="5" height="18" rx="1.5" fill="#B45309" stroke="#451A03" strokeWidth="1" />
          <circle cx="0" cy="-14" r="3.5" fill="#D4AF37" />
          {/* Crimson cord knot */}
          <rect x="-4" y="2" width="8" height="4" rx="1" fill={COLOR_PALETTE.accent_blood_red} />
          {/* Flared bronze bell */}
          <path
            d="M -7 6 L 7 6 C 10 18, 15 26, 17 31 L -17 31 C -15 26, -10 18, -7 6 Z"
            fill="#D4AF37"
            stroke="#78350F"
            strokeWidth="1.4"
          />
          <line x1="-11" y1="20" x2="11" y2="20" stroke="#78350F" strokeWidth="2" />
          <circle cx="0" cy="32" r="3" fill="#451A03" />
        </g>
      );

    case "item_tattered_doll":
      return (
        <g className="held-tattered-doll" transform="translate(2, 16) rotate(14)">
          <ellipse cx="0" cy="0" rx="8.5" ry="14" fill="#8C7355" stroke="#2D2218" strokeWidth="1.1" />
          <line x1="-6" y1="-5" x2="-15" y2="5" stroke="#8C7355" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="6" y1="-5" x2="15" y2="5" stroke="#8C7355" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-4" y1="12" x2="-6" y2="23" stroke="#8C7355" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="4" y1="12" x2="6" y2="23" stroke="#8C7355" strokeWidth="3.5" strokeLinecap="round" />
          {/* Severed neck stitch & blood spot */}
          <circle cx="0" cy="-14" r="3.4" fill={COLOR_PALETTE.accent_blood_red} />
          <line x1="-4" y1="-2" x2="4" y2="6" stroke="#2D2218" strokeWidth="1" />
          <line x1="4" y1="-2" x2="-4" y2="6" stroke="#2D2218" strokeWidth="1" />
        </g>
      );

    case "item_tattered_umbrella":
      return (
        <g className="held-tattered-umbrella" transform="rotate(-18)">
          {/* Hook handle at palm */}
          <path d="M 0 0 L 0 12 C 0 18, -8 18, -8 12" fill="none" stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" />
          {/* Bamboo shaft going upward */}
          <line x1="0" y1="0" x2="0" y2="-92" stroke="#5C4033" strokeWidth="3.2" />
          {/* Tattered oil-paper canopy */}
          <path
            d="M -58 -62 C -45 -88, -20 -96, 0 -92 C 20 -96, 45 -88, 58 -62 L 42 -66 L 32 -56 L 18 -66 L 0 -58 L -14 -67 L -30 -55 L -44 -66 Z"
            fill="#1F1614"
            stroke="#090B0E"
            strokeWidth="1.5"
          />
          {/* Exposed bamboo ribs */}
          <line x1="0" y1="-92" x2="-42" y2="-65" stroke="#78350F" strokeWidth="1.2" opacity="0.8" />
          <line x1="0" y1="-92" x2="-16" y2="-64" stroke="#78350F" strokeWidth="1.2" opacity="0.8" />
          <line x1="0" y1="-92" x2="18" y2="-64" stroke="#78350F" strokeWidth="1.2" opacity="0.8" />
          <line x1="0" y1="-92" x2="42" y2="-65" stroke="#78350F" strokeWidth="1.2" opacity="0.8" />
          {/* Top finial */}
          <polygon points="-3,-92 3,-92 0,-102" fill="#451A03" />
        </g>
      );
  }
}

