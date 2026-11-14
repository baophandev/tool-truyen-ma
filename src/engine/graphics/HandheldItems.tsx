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
  { id: "item_flashlight", name: "Đèn pin rọi nón sáng kinh dị", desc: "Đèn pin hiện đại phát luồng sáng hình nón rọi bóng đêm" },
  { id: "item_scalpel", name: "Dao mổ phẫu thuật sắc lạnh", desc: "Dao mổ kim loại sáng loáng vương vệt máu" },
  { id: "item_smartphone", name: "Điện thoại di động phát sáng", desc: "Màn hình smartphone xanh lạnh ma mị soi tỏ bóng đêm" },
  { id: "item_severed_head", name: "Thủ cấp đứt lìa vương máu", desc: "Đầu người bị chém đứt túm tóc xách tay, mắt trợn trừng, máu rỉ giọt" },
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

    case "item_flashlight":
      return (
        <g className="held-flashlight">
          {/* Tactical Flashlight Body held at palm [0, 0] */}
          <rect x="-18" y="-5" width="34" height="10" rx="2" fill="#0A0C10" stroke="#334155" strokeWidth="1.2" />
          <line x1="-12" y1="-5" x2="-12" y2="5" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="-6" y1="-5" x2="-6" y2="5" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="6" y1="-5" x2="6" y2="5" stroke="#1E293B" strokeWidth="1.5" />
          <rect x="-22" y="-4" width="4" height="8" rx="1" fill="#1E293B" />
          <polygon points="16,-5 26,-9 26,9 16,5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          <ellipse cx="26" cy="0" rx="2" ry="9" fill="#F8FAFC" className="anim-flicker-ember" />

          {/* Conical Light Beam */}
          <path
            d="M 27 -8 L 380 -85 L 380 85 L 27 8 Z"
            fill="url(#flashlight-beam-glow)"
            style={{ mixBlendMode: "screen", pointerEvents: "none" }}
          />
          {/* Dust motes */}
          <g opacity="0.6">
            <circle cx="80" cy="-12" r="1.5" fill="#FFFFFF" />
            <circle cx="150" cy="18" r="1.8" fill="#FFFFFF" />
            <circle cx="230" cy="-25" r="1.2" fill="#FFFFFF" />
            <circle cx="310" cy="15" r="2" fill="#FFFFFF" />
          </g>
        </g>
      );

    case "item_scalpel":
      return (
        <g className="held-scalpel">
          {/* Surgical Handle held at [0, 0] */}
          <path
            d="M -24 -2 L 8 -2 L 10 3 L -24 3 Z"
            fill="#94A3B8"
            stroke="#475569"
            strokeWidth="1"
          />
          <line x1="-16" y1="-1" x2="-16" y2="2" stroke="#334155" strokeWidth="1" />
          <line x1="-10" y1="-1" x2="-10" y2="2" stroke="#334155" strokeWidth="1" />
          <line x1="-4" y1="-1" x2="-4" y2="2" stroke="#334155" strokeWidth="1" />
          <polygon points="8,-3 14,-2 14,2 8,3" fill="#64748B" />
          {/* Scalpel Blade */}
          <path
            d="M 14 -2 L 28 -2 C 32 0, 32 3, 26 4 L 14 3 Z"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          <line x1="14" y1="3" x2="26" y2="4" stroke="#FFFFFF" strokeWidth="1.2" />
          <circle cx="27" cy="2" r="1.5" fill={COLOR_PALETTE.accent_blood_red} />
        </g>
      );

    case "item_smartphone":
      return (
        <g className="held-smartphone">
          {/* Ambient Radial Aura around Phone */}
          <circle cx="6" cy="-8" r="48" fill="url(#smartphone-glow-radial)" opacity="0.65" pointerEvents="none" />

          {/* Forward Conical Light Beam cast from glowing screen */}
          <polygon
            points="12,-20 220,-75 220,55 12,6"
            fill="url(#smartphone-beam-glow)"
            style={{ mixBlendMode: "screen", pointerEvents: "none" }}
            opacity="0.48"
          />

          {/* Floating Atmospheric Dust Specks in screen beam */}
          <g opacity="0.6" pointerEvents="none">
            <circle cx="55" cy="-18" r="1.2" fill="#E0F2FE" />
            <circle cx="110" cy="8" r="1.6" fill="#BAE6FD" />
            <circle cx="165" cy="-28" r="1.1" fill="#E0F2FE" />
            <circle cx="195" cy="22" r="1.4" fill="#BAE6FD" />
          </g>

          {/* Phone Chassis / Slim Bezel anchored at palm [0, 0] */}
          <g transform="rotate(-12, 4, -4)">
            {/* Outer Case / Bumper */}
            <rect
              x="-4"
              y="-26"
              width="18"
              height="36"
              rx="4"
              fill="#090D16"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* Volume / Power Button bumps */}
            <rect x="-5.5" y="-18" width="1.5" height="5" rx="0.5" fill="#475569" />
            <rect x="-5.5" y="-11" width="1.5" height="5" rx="0.5" fill="#475569" />
            <rect x="14" y="-15" width="1.5" height="7" rx="0.5" fill="#475569" />

            {/* Glowing Smartphone Display Screen */}
            <rect
              x="-1.5"
              y="-23"
              width="13"
              height="30"
              rx="2.5"
              fill="#0369A1"
              stroke="#0284C7"
              strokeWidth="0.8"
            />
            {/* Bright screen light wash */}
            <rect
              x="-0.5"
              y="-22"
              width="11"
              height="28"
              rx="1.5"
              fill="#38BDF8"
              opacity="0.85"
              className="anim-flicker-ember"
            />

            {/* Top Speaker Slit & Front Camera Notch */}
            <rect x="3" y="-22" width="4" height="1" rx="0.5" fill="#090D16" />
            <circle cx="8.5" cy="-21.5" r="0.6" fill="#090D16" />

            {/* Status Bar Indicators */}
            <line x1="1" y1="-19.5" x2="3.5" y2="-19.5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
            <rect x="7.5" y="-20" width="3" height="1.2" rx="0.4" fill="#FFFFFF" opacity="0.9" />

            {/* Screen Content: Eerie Incoming Midnight Call */}
            {/* Pulsing red caller avatar / warning indicator */}
            <circle cx="5" cy="-13" r="3" fill="#DC2626" className="anim-pulse-eerie" />
            <circle cx="5" cy="-13" r="1.4" fill="#FEF2F2" />

            {/* Call Action Icons (Green Accept & Red Decline buttons) */}
            <circle cx="2" cy="-4" r="1.6" fill="#16A34A" />
            <circle cx="8" cy="-4" r="1.6" fill="#DC2626" />
            <path d="M 1.2 -4 L 2.8 -4" stroke="#FFFFFF" strokeWidth="0.6" strokeLinecap="round" />
            <path d="M 7.2 -4 L 8.8 -4" stroke="#FFFFFF" strokeWidth="0.6" strokeLinecap="round" />
          </g>
        </g>
      );

    case "item_severed_head":
      return (
        <g className="held-severed-head anim-sway-subtle">
          {/* Blood drips falling toward ground */}
          <path d="M -2 38 L -3 49" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="-3" cy="51" r="1.3" fill="#991B1B" />
          <path d="M 3 38 L 4 46" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="4" cy="48" r="1.1" fill="#DC2626" />
          <circle cx="0" cy="54" r="0.9" fill="#7F1D1D" className="anim-pulse-slow" />

          {/* Hair clump held tightly in palm socket [0, 0] */}
          <ellipse cx="0" cy="0" rx="4.5" ry="3.5" fill="#0A0A0C" />
          <path
            d="M -5 1 C -7 8, -9 16, -11 26 L 11 26 C 9 16, 7 8, 5 1 Z"
            fill="#0F172A"
          />

          {/* Severed Head Skull Base */}
          <ellipse cx="0" cy="22" rx="11" ry="14" fill="#CBD5E1" stroke="#0A0A0C" strokeWidth="1.2" />

          {/* Messy wet hair hanging down and framing face */}
          <path
            d="M -11 12 C -15 22, -14 36, -10 46 C -9 36, -9 22, -6 14 Z"
            fill="#09090B"
          />
          <path
            d="M 11 12 C 15 22, 14 36, 10 46 C 9 36, 9 22, 6 14 Z"
            fill="#09090B"
          />
          {/* Bangs across forehead */}
          <path
            d="M -9 11 Q 0 16 9 11 Q 0 13 -9 11 Z"
            fill="#0A0A0C"
          />

          {/* Dead horrified eyes */}
          <ellipse cx="-4" cy="20" rx="3" ry="2.5" fill="#0F172A" />
          <circle cx="-4" cy="20" r="1.6" fill="#F8FAFC" />
          <circle cx="-4" cy="20" r="0.7" fill="#450A0A" />
          <ellipse cx="4" cy="20" rx="3" ry="2.5" fill="#0F172A" />
          <circle cx="4" cy="20" r="1.6" fill="#F8FAFC" />
          <circle cx="4" cy="20" r="0.7" fill="#450A0A" />

          {/* Bleeding tear trails down dead cheeks */}
          <path d="M -4 22 L -4.5 32" stroke="#991B1B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 4 22 L 4.5 31" stroke="#991B1B" strokeWidth="1.2" strokeLinecap="round" />

          {/* Gaping dead slack mouth */}
          <ellipse cx="0" cy="29" rx="3.5" ry="2.5" fill="#18181B" stroke="#450A0A" strokeWidth="0.8" />
          <path d="M -1 30 L -1.5 36" stroke="#7F1D1D" strokeWidth="1" strokeLinecap="round" />

          {/* Severed neck stump at bottom of head */}
          <ellipse cx="0" cy="36" rx="6.5" ry="2.8" fill="#450A0A" stroke="#1C0C0E" strokeWidth="0.8" />
          <ellipse cx="0" cy="36" rx="4" ry="1.5" fill="#7F1D1D" />
          {/* Exposed bone fragment */}
          <rect x="-1" y="34.5" width="2" height="3" rx="0.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.6" />
        </g>
      );
  }
}

