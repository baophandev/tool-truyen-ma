import React from "react";
import type { ShoulderItemId, HeadItemId, LegItemId, CharacterPoseId } from "../types";

// ============================================================================
// 1. SHOULDER SOCKET PROPS (ĐỒ VẬT VÁC / GÁNH TRÊN VAI)
// Neo tại trục vai [0, -188]
// ============================================================================

export interface ShoulderItemMeta {
  id: ShoulderItemId;
  name: string;
  desc: string;
}

export const SHOULDER_ITEM_CATALOG: ShoulderItemMeta[] = [
  { id: "none", name: "Không vác đồ vật", desc: "Hai vai trống không" },
  {
    id: "shoulder_carrying_pole",
    name: "Đòn gánh tre hai thúng quang dầu",
    desc: "Đòn gánh tre uốn cong đặt ngang vai, hai đầu móc dây quang treo hai thúng nan tre đung đưa nhịp nhàng",
  },
  {
    id: "shoulder_coffin_pole",
    name: "Đòn khiêng áo quan / đòn sóc",
    desc: "Thanh đòn gỗ vuông vức vác ngang bờ vai quấn dây thừng gai chắc nịch",
  },
  {
    id: "shoulder_hoe",
    name: "Cuốc cày rỉ sét vác vai",
    desc: "Cán tre vác chéo qua vai, lưỡi cuốc sắt đen gỉ xám vương bùn đất chạng vạng",
  },
  {
    id: "shoulder_sack",
    name: "Bao tải gai cũ kỹ vác trĩu vai",
    desc: "Bao tải vải thô phồng tròn vác trĩu đè lên một bên vai sau lưng",
  },
  {
    id: "shoulder_firewood_bundle",
    name: "Bó củi khô buộc lạt mây",
    desc: "Chùm cành cây khô khẳng khiu buộc chặt bằng hai vòng lạt tre vàng",
  },
];

interface ShoulderItemRendererProps {
  itemId?: ShoulderItemId;
  pose?: CharacterPoseId;
  scale?: number;
}

export const ShoulderItemRenderer: React.FC<ShoulderItemRendererProps> = ({
  itemId = "none",
  pose = "pose_standing",
  scale = 1,
}) => {
  if (!itemId || itemId === "none") return null;

  const isWalking = pose === "pose_walking";

  return (
    <g
      transform={`scale(${scale})`}
      className={`shoulder-item-root ${isWalking ? "anim-shoulder-sway" : ""}`}
    >
      {renderShoulderItemSvg(itemId, isWalking)}
    </g>
  );
};

function renderShoulderItemSvg(itemId: Exclude<ShoulderItemId, "none">, isWalking: boolean) {
  switch (itemId) {
    case "shoulder_carrying_pole":
      return (
        <g className="prop-carrying-pole">
          {/* Main Bamboo Pole (Cây đòn gánh tre uốn lượn cong mềm mại) */}
          <path
            d="M -82 -186 Q -42 -200 0 -193 Q 42 -186 84 -198"
            fill="none"
            stroke="#D97706"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M -82 -185 Q -42 -199 0 -192 Q 42 -185 84 -197"
            fill="none"
            stroke="#78350F"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Bamboo Notches / Horns (Mấu sừng chặn dây ở hai đầu đòn) */}
          <circle cx="-81" cy="-189" r="3.2" fill="#B45309" />
          <circle cx="-81" cy="-189" r="1.5" fill="#451A03" />
          <circle cx="83" cy="-201" r="3.2" fill="#B45309" />
          <circle cx="83" cy="-201" r="1.5" fill="#451A03" />

          {/* BACK BASKET (Thúng sau bên trái X = -81) */}
          <g className={isWalking ? "anim-pendulum-sway" : ""} style={{ transformOrigin: "-81px -189px" }}>
            {/* Ropes (Dây quang thừng) */}
            <line x1="-81" y1="-186" x2="-96" y2="-68" stroke="#78350F" strokeWidth="1.3" />
            <line x1="-81" y1="-186" x2="-66" y2="-68" stroke="#92400E" strokeWidth="1.3" />
            {/* Woven Bamboo Basket */}
            <ellipse cx="-81" cy="-68" rx="20" ry="6.5" fill="#451A03" stroke="#78350F" strokeWidth="1.5" />
            <path
              d="M -101 -68 C -101 -48, -61 -48, -61 -68 Z"
              fill="#92400E"
              stroke="#451A03"
              strokeWidth="1.6"
            />
            {/* Woven weave lines */}
            <path d="M -94 -66 L -70 -52 M -68 -66 L -92 -52" stroke="#78350F" strokeWidth="1.1" opacity="0.65" />
            <path d="M -86 -66 L -76 -50 M -76 -66 L -86 -50" stroke="#78350F" strokeWidth="1.1" opacity="0.65" />
          </g>

          {/* FRONT BASKET (Thúng trước bên phải X = 83) */}
          <g className={isWalking ? "anim-pendulum-sway" : ""} style={{ transformOrigin: "83px -201px", animationDelay: "0.45s" }}>
            {/* Ropes (Dây quang thừng) */}
            <line x1="83" y1="-198" x2="68" y2="-68" stroke="#78350F" strokeWidth="1.3" />
            <line x1="83" y1="-198" x2="98" y2="-68" stroke="#92400E" strokeWidth="1.3" />
            {/* Woven Bamboo Basket */}
            <ellipse cx="83" cy="-68" rx="20" ry="6.5" fill="#451A03" stroke="#78350F" strokeWidth="1.5" />
            <path
              d="M 63 -68 C 63 -48, 103 -48, 103 -68 Z"
              fill="#B45309"
              stroke="#451A03"
              strokeWidth="1.6"
            />
            {/* Woven weave lines */}
            <path d="M 70 -66 L 94 -52 M 96 -66 L 72 -52" stroke="#78350F" strokeWidth="1.1" opacity="0.65" />
            <path d="M 78 -66 L 88 -50 M 88 -66 L 78 -50" stroke="#78350F" strokeWidth="1.1" opacity="0.65" />
          </g>
        </g>
      );

    case "shoulder_coffin_pole":
      return (
        <g className="prop-coffin-pole">
          {/* Heavy Square Wooden Carrying Beam */}
          <polygon
            points="-115,-198 115,-176 115,-165 -115,-187"
            fill="#1C1917"
            stroke="#0C0A09"
            strokeWidth="1.5"
          />
          <line x1="-115" y1="-192" x2="115" y2="-170" stroke="#44403C" strokeWidth="1" strokeDasharray="25,10" />
          {/* Hemp rope bindings */}
          <rect x="-65" y="-195" width="8" height="13" rx="1" fill="#78350F" stroke="#451A03" strokeWidth="0.8" />
          <rect x="55" y="-178" width="8" height="13" rx="1" fill="#78350F" stroke="#451A03" strokeWidth="0.8" />
          <line x1="-61" y1="-195" x2="-61" y2="-155" stroke="#78350F" strokeWidth="1.5" />
          <line x1="59" y1="-178" x2="59" y2="-138" stroke="#78350F" strokeWidth="1.5" />
        </g>
      );

    case "shoulder_hoe":
      return (
        <g className="prop-shoulder-hoe">
          {/* Long Bamboo Handle across shoulder */}
          <line x1="45" y1="-130" x2="-85" y2="-235" stroke="#78350F" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="45" y1="-129" x2="-85" y2="-234" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
          {/* Rusted Iron Blade attached to rear end */}
          <polygon
            points="-80,-236 -100,-252 -88,-260 -70,-242"
            fill="#334155"
            stroke="#0F172A"
            strokeWidth="1.4"
          />
          <polygon
            points="-82,-237 -96,-250 -89,-255 -74,-241"
            fill="#1E293B"
          />
          {/* Mud / dried blood stain */}
          <path d="M -88 -244 L -76 -252" stroke="#7F1D1D" strokeWidth="1.2" opacity="0.75" />
        </g>
      );

    case "shoulder_sack":
      return (
        <g className="prop-shoulder-sack">
          {/* Bulging Hessian Sack draped over back shoulder */}
          <ellipse
            cx="-32"
            cy="-186"
            rx="25"
            ry="34"
            transform="rotate(-24 -32 -186)"
            fill="#292524"
            stroke="#0C0A09"
            strokeWidth="1.6"
          />
          <path
            d="M -48 -208 C -36 -195, -28 -175, -25 -158"
            stroke="#1C1917"
            strokeWidth="1.8"
            fill="none"
          />
          {/* Tied Neck with rope */}
          <rect x="-18" y="-218" width="10" height="6" rx="1.5" fill="#78350F" />
          <polygon points="-16,-220 -8,-232 -4,-218" fill="#44403C" stroke="#1C1917" strokeWidth="0.8" />
        </g>
      );

    case "shoulder_firewood_bundle":
      return (
        <g className="prop-firewood-bundle">
          {/* Bundle of Dry Jagged Branches */}
          <polygon points="-90,-198 80,-178 82,-168 -88,-188" fill="#262626" stroke="#0A0A0A" strokeWidth="1.2" />
          <polygon points="-85,-204 88,-184 86,-176 -87,-196" fill="#171717" stroke="#0A0A0A" strokeWidth="1" />
          <polygon points="-92,-192 75,-172 73,-164 -94,-184" fill="#332D27" stroke="#0A0A0A" strokeWidth="1" />
          {/* Two Yellow Rattan Ties */}
          <rect x="-45" y="-198" width="5" height="18" fill="#EAB308" stroke="#713F12" strokeWidth="0.8" />
          <rect x="35" y="-182" width="5" height="18" fill="#EAB308" stroke="#713F12" strokeWidth="0.8" />
        </g>
      );
  }
}

// ============================================================================
// 2. HEAD SOCKET PROPS (ĐỒ VẬT ĐỘI / QUẤN TRÊN ĐẦU)
// Neo tại tọa độ headPos = [headPos.x, headPos.y]
// ============================================================================

export interface HeadItemMeta {
  id: HeadItemId;
  name: string;
  desc: string;
}

export const HEAD_ITEM_CATALOG: HeadItemMeta[] = [
  { id: "none", name: "Đầu trần", desc: "Không đội nón hay phụ kiện" },
  {
    id: "head_conical_hat",
    name: "Nón lá cổ truyền chóp nhọn",
    desc: "Nón lá chóp nhọn nan tre, quai vải mềm che nghiêng nửa khuôn mặt ma mị",
  },
  {
    id: "head_funeral_band",
    name: "Dải khăn tang trắng xô gai",
    desc: "Khăn tang trắng quấn quanh trán thắt nút sau gáy, hai dải khăn dài rủ xơ xác qua vai",
  },
  {
    id: "head_straw_hat",
    name: "Mũ cói / mũ rơm rách vành",
    desc: "Mũ cói nông dân tròn vành tua rua rách mép tả tơi che nắng gió",
  },
  {
    id: "head_talisman_mask",
    name: "Lá bùa vàng trấn yểm dán trán",
    desc: "Lá bùa giấy vàng viết chu sa dán từ giữa trán rủ xuống che kín mắt mũi trừ tà",
  },
  {
    id: "head_basket",
    name: "Thúng / Mẹt tre đội đầu",
    desc: "Mẹt tre đan mộc mạc đội thăng bằng trên đỉnh đầu có khăn đệm vải đen",
  },
];

interface HeadItemRendererProps {
  itemId?: HeadItemId;
  headPos: { x: number; y: number };
}

export const HeadItemRenderer: React.FC<HeadItemRendererProps> = ({
  itemId = "none",
  headPos,
}) => {
  if (!itemId || itemId === "none") return null;

  return (
    <g className="head-item-root">
      {renderHeadItemSvg(itemId, headPos)}
    </g>
  );
};

function renderHeadItemSvg(itemId: Exclude<HeadItemId, "none">, headPos: { x: number; y: number }) {
  const { x, y } = headPos;

  switch (itemId) {
    case "head_conical_hat":
      return (
        <g className="prop-conical-hat">
          {/* Main Cone Peak (Chóp nón lá) */}
          <polygon
            points={`${x},${y - 38} ${x - 36},${y - 8} ${x + 36},${y - 8}`}
            fill="#78350F"
            stroke="#451A03"
            strokeWidth="1.4"
          />
          {/* Lit front slope */}
          <polygon
            points={`${x},${y - 38} ${x},${y - 8} ${x + 36},${y - 8}`}
            fill="#B45309"
            opacity="0.82"
          />
          {/* Rim Curve */}
          <path
            d={`M ${x - 36} ${y - 8} Q ${x} ${y - 4} ${x + 36} ${y - 8}`}
            stroke="#451A03"
            strokeWidth="1.6"
            fill="none"
          />
          {/* Bamboo Rib Ring Lines */}
          <path
            d={`M ${x - 18} ${y - 23} Q ${x} ${y - 20} ${x + 18} ${y - 23}`}
            stroke="#451A03"
            strokeWidth="0.8"
            fill="none"
            opacity="0.7"
          />
          {/* Soft Fabric Chin Strap (Quai nón) */}
          <path
            d={`M ${x - 14} ${y - 8} Q ${x - 18} ${y + 16} ${x - 4} ${y + 20}`}
            stroke="#0F172A"
            strokeWidth="1.6"
            fill="none"
          />
        </g>
      );

    case "head_funeral_band":
      return (
        <g className="prop-funeral-band">
          {/* White Headband wrapping around forehead */}
          <rect
            x={x - 19}
            y={y - 18}
            width="38"
            height="8"
            rx="1.5"
            fill="#E2E8F0"
            stroke="#0F172A"
            strokeWidth="1"
          />
          {/* Knot at back */}
          <circle cx={x - 18} cy={y - 14} r="3" fill="#CBD5E1" stroke="#0F172A" strokeWidth="0.8" />
          {/* Two long frayed mourning ribbons falling over shoulder down to chest */}
          <path
            d={`M ${x - 18} ${y - 14} C ${x - 26} ${y + 15}, ${x - 28} ${y + 50}, ${x - 20} ${y + 75} L ${x - 14} ${y + 73} C ${x - 20} ${y + 50}, ${x - 18} ${y + 15}, ${x - 12} ${y - 14} Z`}
            fill="#CBD5E1"
            stroke="#0F172A"
            strokeWidth="0.9"
            opacity="0.92"
          />
          <path
            d={`M ${x - 15} ${y - 14} C ${x - 22} ${y + 15}, ${x - 23} ${y + 45}, ${x - 17} ${y + 65} L ${x - 12} ${y + 64} C ${x - 17} ${y + 45}, ${x - 15} ${y + 15}, ${x - 9} ${y - 14} Z`}
            fill="#E2E8F0"
            stroke="#0F172A"
            strokeWidth="0.8"
            opacity="0.95"
          />
        </g>
      );

    case "head_straw_hat":
      return (
        <g className="prop-straw-hat">
          {/* Rounded Crown */}
          <ellipse cx={x} cy={y - 22} rx="16" ry="11" fill="#78350F" stroke="#451A03" strokeWidth="1.2" />
          <ellipse cx={x + 3} cy={y - 23} rx="12" ry="8" fill="#B45309" opacity="0.8" />
          {/* Wide ragged brim */}
          <path
            d={`M ${x - 35} ${y - 12} Q ${x} ${y - 7} ${x + 35} ${y - 12} L ${x + 32} ${y - 15} Q ${x} ${y - 10} ${x - 32} ${y - 15} Z`}
            fill="#92400E"
            stroke="#451A03"
            strokeWidth="1.2"
          />
          {/* Ragged edge frills */}
          <polygon points={`${x - 35},${y - 12} ${x - 38},${y - 8} ${x - 32},${y - 11}`} fill="#78350F" />
          <polygon points={`${x + 35},${y - 12} ${x + 38},${y - 9} ${x + 32},${y - 11}`} fill="#78350F" />
        </g>
      );

    case "head_talisman_mask":
      return (
        <g className="prop-talisman-mask">
          {/* Yellow paper strip hanging over face */}
          <rect
            x={x - 8}
            y={y - 18}
            width="16"
            height="44"
            rx="1.5"
            fill="#FACC15"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          {/* Red occult cinnabar seal */}
          <path
            d={`M ${x} ${y - 14} L ${x} ${y + 20} M ${x - 5} ${y - 4} L ${x + 5} ${y - 4} M ${x - 5} ${y + 8} L ${x + 5} ${y + 8}`}
            stroke="#DC2626"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx={x} cy={y - 12} r="2" fill="#B91C1C" />
          <polygon points={`${x - 5},${y + 22} ${x},${y + 25} ${x + 5},${y + 22}`} fill="#DC2626" />
        </g>
      );

    case "head_basket":
      return (
        <g className="prop-head-basket">
          {/* Black cloth head roll pad */}
          <ellipse cx={x} cy={y - 20} rx="12" ry="4" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
          {/* Shallow round woven bamboo tray */}
          <ellipse cx={x} cy={y - 25} rx="28" ry="6" fill="#451A03" stroke="#78350F" strokeWidth="1.4" />
          <ellipse cx={x} cy={y - 26} rx="26" ry="4.5" fill="#B45309" />
          <path d={`M ${x - 22} ${y - 26} L ${x + 22} ${y - 26}`} stroke="#78350F" strokeWidth="1" opacity="0.6" />
        </g>
      );
  }
}

// ============================================================================
// 3. LEG / FEET SOCKET PROPS (ĐỒ VẬT CÙM / BÓ Ở CHÂN)
// Neo tại mắt cá chân [Y = -25 đến 0]
// ============================================================================

export interface LegItemMeta {
  id: LegItemId;
  name: string;
  desc: string;
}

export const LEG_ITEM_CATALOG: LegItemMeta[] = [
  { id: "none", name: "Chân tự do", desc: "Không bị gông cùm hay thương tích" },
  {
    id: "leg_iron_chains",
    name: "Cùm xích sắt hoen rỉ cổ chân",
    desc: "Hai vòng cùm sắt đen rỉ ôm hai cổ chân, xích lê loẹt quẹt sát mặt đất khi bước đi",
  },
  {
    id: "leg_wooden_shackles",
    name: "Gông cùm gỗ kẹp mắt cá chân",
    desc: "Gông cùm gỗ kẹp chặt hai mắt cá chân có then chốt sắt tử tù",
  },
  {
    id: "leg_bloody_bandage",
    name: "Băng vải trắng vấy máu quấn chân",
    desc: "Dải băng vải xô quấn quanh cẳng chân rỉ vệt máu đỏ tươi",
  },
  {
    id: "leg_muddy_splatter",
    name: "Vệt bùn sình lầy đầm lầy bám chân",
    desc: "Bùn đen nâu ngập từ bàn chân lên ống chân sau khi lội kênh rạch",
  },
];

interface LegItemRendererProps {
  itemId?: LegItemId;
  pose?: CharacterPoseId;
}

export const LegItemRenderer: React.FC<LegItemRendererProps> = ({
  itemId = "none",
}) => {
  if (!itemId || itemId === "none") return null;

  return (
    <g className="leg-item-root">
      {renderLegItemSvg(itemId)}
    </g>
  );
};

function renderLegItemSvg(itemId: Exclude<LegItemId, "none">) {
  switch (itemId) {
    case "leg_iron_chains":
      return (
        <g className="prop-iron-chains">
          {/* Left Ankle Iron Collar */}
          <rect x="-18" y="-14" width="14" height="6.5" rx="2" fill="#334155" stroke="#0F172A" strokeWidth="1.2" />
          <circle cx="-11" cy="-10.5" r="1.5" fill="#64748B" />
          {/* Right Ankle Iron Collar */}
          <rect x="4" y="-14" width="14" height="6.5" rx="2" fill="#334155" stroke="#0F172A" strokeWidth="1.2" />
          <circle cx="11" cy="-10.5" r="1.5" fill="#64748B" />

          {/* Heavy Slack Iron Chain dragging along Ground Y=0 */}
          <path
            d="M -11 -8 Q 0 3 11 -8"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M -11 -8 Q 0 3 11 -8"
            fill="none"
            stroke="#475569"
            strokeWidth="1.4"
            strokeDasharray="4,2.5"
          />
          {/* Trailing ground chain link */}
          <circle cx="0" cy="1.5" r="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        </g>
      );

    case "leg_wooden_shackles":
      return (
        <g className="prop-wooden-shackles">
          {/* Heavy wooden block clamped across both ankles */}
          <rect x="-24" y="-15" width="48" height="9" rx="2" fill="#292524" stroke="#0C0A09" strokeWidth="1.4" />
          <line x1="-24" y1="-10.5" x2="24" y2="-10.5" stroke="#44403C" strokeWidth="0.8" />
          {/* Left ankle hole */}
          <circle cx="-11" cy="-10.5" r="3.5" fill="#0C0A09" />
          {/* Right ankle hole */}
          <circle cx="11" cy="-10.5" r="3.5" fill="#0C0A09" />
          {/* Center iron wedge pin */}
          <polygon points="-2,-18 2,-18 1,-5 -1,-5" fill="#64748B" stroke="#0F172A" strokeWidth="0.8" />
        </g>
      );

    case "leg_bloody_bandage":
      return (
        <g className="prop-bloody-bandage">
          {/* Gauze wrap on right ankle */}
          <path d="M 6 -24 L 16 -21 L 15 -10 L 5 -12 Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.8" opacity="0.9" />
          <path d="M 5 -18 L 16 -15" stroke="#94A3B8" strokeWidth="1.2" />
          {/* Dripping fresh blood */}
          <ellipse cx="11" cy="-15" rx="3.5" ry="5" fill="#DC2626" opacity="0.88" />
          <circle cx="11" cy="-8" r="1.5" fill="#991B1B" />
          <path d="M 11 -15 L 11 -8" stroke="#7F1D1D" strokeWidth="1.2" />
        </g>
      );

    case "leg_muddy_splatter":
      return (
        <g className="prop-muddy-splatter">
          {/* Left foot muddy grime */}
          <path
            d="M -19 -2 C -18 -8, -16 -16, -11 -18 C -7 -14, -6 -6, -5 -2 Z"
            fill="#1C1917"
            opacity="0.85"
          />
          {/* Right foot muddy grime */}
          <path
            d="M 5 -2 C 6 -8, 8 -16, 11 -18 C 15 -14, 16 -6, 19 -2 Z"
            fill="#1C1917"
            opacity="0.85"
          />
          {/* Mud speckles */}
          <circle cx="-13" cy="-24" r="1.5" fill="#292524" />
          <circle cx="-9" cy="-21" r="1.2" fill="#292524" />
          <circle cx="13" cy="-24" r="1.5" fill="#292524" />
          <circle cx="9" cy="-21" r="1.2" fill="#292524" />
        </g>
      );
  }
}

