import { ALL_SLOTS, GROUND_SLOTS, AIR_SLOTS } from "./constants";
import type {
  ActorConfig,
  CharacterPoseId,
  DetailId,
  GroundSlotId,
  SlotAnchor,
  SlotId,
  StructureId,
} from "./types";

const ALL_GROUND_SLOT_IDS: GroundSlotId[] = [
  "far_left",
  "mid_left",
  "center",
  "mid_right",
  "far_right",
];

const ALL_AIR_SLOT_IDS: SlotId[] = ["air_left", "air_center", "air_right"];
const ALL_SLOT_IDS: SlotId[] = [...ALL_GROUND_SLOT_IDS, ...ALL_AIR_SLOT_IDS];

export interface StructureRule {
  name: string;
  allowedSlots: GroundSlotId[];
  reason: string;
}

export const STRUCTURE_RULES: Record<StructureId, StructureRule> = {
  creepy_banyan_tree: {
    name: "Cây đa cổ thụ",
    allowedSlots: ["far_left", "far_right"],
    reason: "Cây đa kích thước lớn chỉ được đặt ở hai bìa khung hình (far_left, far_right) để tạo vòm che mà không chắn nhân vật trung tâm.",
  },
  haunted_gallows_tree: {
    name: "Cây treo cổ",
    allowedSlots: ["far_left", "far_right"],
    reason: "Cây treo cổ rủ cành liễu chỉ đặt ở hai bìa trái/phải (far_left, far_right).",
  },
  ancient_tomb: {
    name: "Ngôi mộ cổ & bia đá",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Ngôi mộ cổ là tâm điểm dị thường nên đặt tại khu vực giữa sân khấu (mid_left, center, mid_right).",
  },
  abandoned_shrine: {
    name: "Miếu hoang cô hồn",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Miếu hoang đặt tại vùng giữa mặt đất (mid_left, center, mid_right).",
  },
  creepy_well: {
    name: "Giếng cạn oan hồn",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Giếng cổ chỉ đặt ở các vị trí trung tâm (mid_left, center, mid_right).",
  },
  dilapidated_hut: {
    name: "Căn lều tranh xiêu vẹo",
    allowedSlots: ["far_left", "center", "far_right"],
    reason: "Lều tranh đặt ở hai bên rìa hoặc chính giữa khung hình (far_left, center, far_right).",
  },
  broken_wooden_bridge: {
    name: "Cầu gỗ gãy nhịp",
    allowedSlots: ["far_left", "center", "far_right"],
    reason: "Cầu gãy bắc ngang tại hai rìa hoặc trung tâm (far_left, center, far_right).",
  },
  scarecrow_of_the_damned: {
    name: "Bù nhìn rơm bị quỷ ám",
    allowedSlots: ["far_left", "mid_left", "center", "mid_right", "far_right"],
    reason: "Bù nhìn rơm nhỏ gọn có thể đặt tại mọi vị trí mặt đất Y=800px.",
  },
  hospital_operating_bed: {
    name: "Giường mổ bệnh viện rỉ sét",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Giường mổ bệnh viện là tâm điểm bối cảnh kinh dị hiện đại, đặt tại khu vực giữa sân khấu.",
  },
  hotel_reception_desk: {
    name: "Quầy lễ tân khách sạn u ám",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Quầy lễ tân đặt tại các vị trí tiếp đất trung tâm (mid_left, center, mid_right).",
  },
  supermarket_shelf_aisle: {
    name: "Dãy kệ hàng siêu thị hoang tàn",
    allowedSlots: ["far_left", "center", "far_right"],
    reason: "Dãy kệ hàng siêu thị cao lớn đặt ở hai bên rìa hoặc trung tâm tạo chiều sâu lối đi.",
  },
  creepy_elevator_doors: {
    name: "Cửa thang máy rùng rợn hé mở",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Cửa thang máy đặt tại khu vực giữa sân khấu (mid_left, center, mid_right) tạo điểm nhìn kịch tính.",
  },
  dining_table_chairs: {
    name: "Bàn ăn nhà hàng khăn rách",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Bàn ăn nhà hàng đặt tiếp đất tại khu vực giữa sân khấu (mid_left, center, mid_right).",
  },
  bus_interior: {
    name: "Buồng lái tài xế & Máy bán vé xe bus",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Buồng lái tài xế, vô lăng, bảng đồng hồ và máy thu vé xe bus đặt tại khu vực giữa sân khấu (mid_left, center, mid_right) tạo điểm nhấn chân thực trong khoang xe.",
  },
  creepy_bathtub: {
    name: "Bồn tắm rỉ sét ngập máu",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Bồn tắm cổ quái đặt tại khu vực giữa sân khấu (mid_left, center, mid_right) làm tâm điểm kinh hoàng trong phòng tắm.",
  },
};

export interface DetailRule {
  name: string;
  allowedSlots: SlotId[];
  reason: string;
}

export const DETAIL_RULES: Record<DetailId, DetailRule> = {
  detail_black_crow: {
    name: "Quạ đen mắt trắng",
    allowedSlots: ALL_SLOT_IDS,
    reason: "Quạ đen có thể đậu trên mặt đất hoặc bay lơ lửng tại mọi vị trí trên không.",
  },
  detail_will_o_wisp: {
    name: "Đốm ma trơi lân tinh",
    allowedSlots: ["air_left", "air_center", "air_right", "mid_left", "center", "mid_right"],
    reason: "Ma trơi lơ lửng trên không trung hoặc bay là là vùng trung tâm mặt đất.",
  },
  detail_blood_lantern: {
    name: "Đèn lồng giấy đỏ rách",
    allowedSlots: ["far_left", "mid_left", "center", "mid_right", "far_right", "air_left", "air_right"],
    reason: "Đèn lồng có thể đặt trên mặt đất hoặc treo cao ở hai bên trái/phải.",
  },
  detail_incense_bowl: {
    name: "Bát hương tàn & Nến cầu hồn",
    allowedSlots: ["mid_left", "center", "mid_right"],
    reason: "Bát hương và nến chỉ đặt tiếp đất tại khu vực giữa sân khấu (mid_left, center, mid_right).",
  },
  detail_skull_pile: {
    name: "Đống đầu lâu & Xương khô",
    allowedSlots: ALL_GROUND_SLOT_IDS,
    reason: "Đống xương khô bắt buộc phải đặt tiếp đất trên trục Y=800px.",
  },
  detail_hanging_talisman: {
    name: "Dây bùa trấn yểm",
    allowedSlots: ALL_AIR_SLOT_IDS,
    reason: "Dây bùa treo giăng ngang chỉ được đặt tại các vị trí trên không (air_left, air_center, air_right).",
  },
  detail_iv_drip_stand: {
    name: "Cột truyền dịch y tế rỉ máu",
    allowedSlots: ALL_GROUND_SLOT_IDS,
    reason: "Cột truyền dịch y tế có bánh xe có thể đứng tại mọi vị trí trên mặt đất Y=800px.",
  },
  detail_shopping_cart: {
    name: "Xe đẩy siêu thị rỉ sét",
    allowedSlots: ALL_GROUND_SLOT_IDS,
    reason: "Xe đẩy siêu thị có thể đặt tại mọi vị trí trên mặt đất Y=800px.",
  },
  detail_surveillance_camera: {
    name: "Camera an ninh chớp đỏ",
    allowedSlots: ALL_AIR_SLOT_IDS,
    reason: "Camera an ninh chỉ được gắn trên cao (air_left, air_center, air_right).",
  },
  detail_flickering_ceiling_lamp: {
    name: "Đèn huỳnh quang trần chập chờn",
    allowedSlots: ALL_AIR_SLOT_IDS,
    reason: "Bóng đèn tuýp huỳnh quang chỉ treo trên cao (air_left, air_center, air_right).",
  },
  detail_broken_mirror: {
    name: "Gương nhà tắm vỡ nứt vấy máu",
    allowedSlots: ALL_SLOT_IDS,
    reason: "Gương nhà tắm có thể gắn tường trên không hoặc đặt tiếp đất dựa tường.",
  },
};

const AIR_POSES: CharacterPoseId[] = ["pose_floating", "pose_hanging"];

export function isAirPose(pose: CharacterPoseId): boolean {
  return AIR_POSES.includes(pose);
}

export function getAllowedSlotsForActor(actor: Pick<ActorConfig, "base" | "pose">): {
  allowedSlots: SlotId[];
  reason: string;
} {
  if (isAirPose(actor.pose)) {
    return {
      allowedSlots: ALL_AIR_SLOT_IDS,
      reason: `Tư thế "${actor.pose === "pose_floating" ? "Bay lơ lửng" : "Treo lơ lửng"}" chỉ cho phép đặt tại các vị trí trên không (air_left, air_center, air_right).`,
    };
  }

  return {
    allowedSlots: ALL_GROUND_SLOT_IDS,
    reason:
      "Nhân vật ở tư thế tiếp đất hoặc ngồi (pose_standing, pose_sitting, pose_sitting_twisted_legs, v.v.) bắt buộc đặt trên trục Ground Y=800px (far_left -> far_right).",
  };
}

export function getAllowedSlotsForStructure(assetId: StructureId): {
  allowedSlots: GroundSlotId[];
  reason: string;
} {
  const rule = STRUCTURE_RULES[assetId];
  return {
    allowedSlots: rule.allowedSlots,
    reason: rule.reason,
  };
}

export function getAllowedSlotsForDetail(assetId: DetailId): {
  allowedSlots: SlotId[];
  reason: string;
} {
  const rule = DETAIL_RULES[assetId];
  return {
    allowedSlots: rule.allowedSlots,
    reason: rule.reason,
  };
}

export function isSlotAllowed(slotId: SlotId, allowedSlots: SlotId[]): boolean {
  return allowedSlots.includes(slotId);
}

/**
 * Find the closest allowed slot anchor from arbitrary SVG (x, y) coordinates
 */
export function findNearestAllowedSlot(
  x: number,
  y: number,
  allowedSlots: SlotId[]
): { slot: SlotAnchor; distance: number } {
  const candidates = allowedSlots
    .map((id) => ALL_SLOTS[id])
    .filter((s): s is SlotAnchor => Boolean(s));

  if (candidates.length === 0) {
    return { slot: GROUND_SLOTS.center, distance: Math.hypot(x - 960, y - 800) };
  }

  let bestSlot = candidates[0];
  let minDistance = Infinity;

  for (const slot of candidates) {
    const dist = Math.hypot(x - slot.x, y - slot.y);
    if (dist < minDistance) {
      minDistance = dist;
      bestSlot = slot;
    }
  }

  return { slot: bestSlot, distance: minDistance };
}

/**
 * Determine whether a candidate slot is ground or air type
 */
export function getSlotType(slotId: SlotId): "ground" | "air" {
  return slotId in AIR_SLOTS ? "air" : "ground";
}

/**
 * Check if an entity is permitted along the entire continuous Ground Line Y = 800px
 * (i.e. all 5 ground anchors are allowed).
 */
export function supportsContinuousGroundPlacement(allowedSlots: SlotId[]): boolean {
  return ALL_GROUND_SLOT_IDS.every((id) => allowedSlots.includes(id));
}

/**
 * Check if an entity is permitted across the entire upper Air zone.
 */
export function supportsContinuousAirPlacement(allowedSlots: SlotId[]): boolean {
  return ALL_AIR_SLOT_IDS.every((id) => allowedSlots.includes(id));
}

/**
 * Convert an arbitrary (x, y) stage coordinate into the nearest allowed (slot, offsetX, offsetY).
 */
export function coordsToSlotAssignment(
  x: number,
  y: number,
  allowedSlots: SlotId[]
): { slot: SlotId; offsetX: number; offsetY: number } {
  const { slot } = findNearestAllowedSlot(x, y, allowedSlots);
  const clampedX = Math.max(80, Math.min(1840, Math.round(x)));
  const offsetX = clampedX - slot.x;
  const offsetY = slot.type === "ground" ? 0 : Math.max(-180, Math.min(200, Math.round(y - slot.y)));
  return {
    slot: slot.id,
    offsetX,
    offsetY,
  };
}

/**
 * Find an open X coordinate along Ground Plane Y = 800px that avoids overlapping existing actors.
 */
export function findOpenGroundX(existingXPositions: number[]): number {
  const candidateXs = [960, 600, 1320, 420, 1500, 780, 1140, 250, 1670, 335, 510, 690, 870, 1050, 1230, 1410, 1585, 1760, 165];
  for (const cx of candidateXs) {
    const tooClose = existingXPositions.some((ex) => Math.abs(ex - cx) < 95);
    if (!tooClose) return cx;
  }
  return 160 + ((existingXPositions.length * 110) % 1600);
}

