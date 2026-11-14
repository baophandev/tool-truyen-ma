/**
 * 2D PROCEDURAL GRAPHICS & LAYOUT ENGINE ARCHITECTURE TYPES
 * Style: Silhouette Minimalist Horror (Limbo / Badland / U Linh Kỳ Truyện)
 */

export type ThemeId =
  | "rural_graveyard"
  | "abandoned_village"
  | "cursed_swamp"
  | "modern_indoor"
  | "vehicle_interior";

export type SkyPresetId =
  | "blood_moon"
  | "foggy_night"
  | "stormy_dark"
  | "eclipse_abyss"
  | "flickering_fluorescent"
  | "dim_indoor_night";

export type StructureId =
  | "creepy_banyan_tree"
  | "ancient_tomb"
  | "dilapidated_hut"
  | "abandoned_shrine"
  | "broken_wooden_bridge"
  | "scarecrow_of_the_damned"
  | "creepy_well"
  | "haunted_gallows_tree"
  | "hospital_operating_bed"
  | "hotel_reception_desk"
  | "supermarket_shelf_aisle"
  | "creepy_elevator_doors"
  | "dining_table_chairs"
  | "bus_interior"
  | "creepy_bathtub";

export type DetailId =
  | "detail_black_crow"
  | "detail_will_o_wisp"
  | "detail_blood_lantern"
  | "detail_incense_bowl"
  | "detail_skull_pile"
  | "detail_hanging_talisman"
  | "detail_iv_drip_stand"
  | "detail_shopping_cart"
  | "detail_surveillance_camera"
  | "detail_flickering_ceiling_lamp"
  | "detail_broken_mirror";

export type CharacterBaseId =
  | "male_adult"
  | "female_adult"
  | "elder_hunched"
  | "brute_hulking"
  | "skeletal_emaciated"
  | "ghost_wraith"
  | "creepy_child"
  | "jiangshi_corpse"
  | "demon_shadow";

export type CostumeId =
  | "outfit_tattered_tunic"     // Áo tơi / Áo nông phu sờn rách
  | "outfit_flowing_ao_dai"     // Áo dài cổ truyền tà rách ma mị
  | "outfit_shrouded_cloak"     // Áo choàng trùm đầu tăm tối (Reaper / Cultist Cloak)
  | "outfit_mandarin_court"     // Quan phục triều đình / Bổ tử phong kiến
  | "outfit_monk_cassock"       // Áo cà sa pháp sư / Đạo bào trừ tà
  | "outfit_shredded_burial"    // Vải liệm oan hồn / Áo niệm tử thi
  | "outfit_ancient_armor"      // Giáp tướng cổ vỡ nát / Chiến bào tử sĩ
  | "outfit_child_pajamas"      // Yếm hoa / Bộ đồ trẻ thơ vương vết ố
  | "outfit_doctor_coat"        // Áo blouse bác sĩ / Y tá bệnh viện hiện đại
  | "outfit_patient_gown"       // Áo bệnh nhân sọc xanh lấm lem
  | "outfit_modern_casual";     // Trang phục thường ngày hiện đại (Hoodie / Áo khoác)

export type CharacterFaceId =
  | "face_calm"
  | "face_scared"
  | "face_creepy_smile"
  | "face_bleeding_eyes"
  | "face_faceless"
  | "face_glowing_hollow"
  | "face_talisman_covered"
  | "face_old_wrinkled"
  | "face_rage_furious"
  | "face_pale_corpse"
  | "face_weeping_ghost"
  | "face_sewn_mouth"
  | "face_haggard_gaunt"
  | "face_headless";           // Không đầu / Cổ chém lìa vương máu (Headless Severed Neck)

export type CharacterPoseId =
  | "pose_standing"
  | "pose_sitting"
  | "pose_sitting_twisted_legs"
  | "pose_twisted_legs_floating"
  | "pose_shivering"
  | "pose_walking"
  | "pose_floating"
  | "pose_crawling"
  | "pose_reaching"
  | "pose_hanging"
  | "pose_holding";

export type HeldItemId =
  | "none"
  | "item_storm_lantern"
  | "item_paper_lantern"
  | "item_soul_candle"
  | "item_peach_wood_sword"
  | "item_yellow_talisman"
  | "item_rusty_sickle"
  | "item_ritual_bell"
  | "item_tattered_doll"
  | "item_tattered_umbrella"
  | "item_flashlight"
  | "item_scalpel"
  | "item_smartphone"
  | "item_severed_head";       // Thủ cấp đứt lìa túm tóc xách tay vương máu rỉ giọt

export type HeldHand = "right" | "left";

export type FacingDirection = "left" | "right";

export type GroundSlotId = "far_left" | "mid_left" | "center" | "mid_right" | "far_right";
export type AirSlotId = "air_left" | "air_center" | "air_right";
export type SlotId = GroundSlotId | AirSlotId;

export type LayerLevel = "layer0_sky" | "layer1_background" | "layer2_ground" | "layer3_foreground";

/**
 * Director Scene Script Interface
 * Strict JSON schema contracted with Gemini Director
 */
export interface EnvironmentItemConfig {
  asset_id: StructureId;
  slot: GroundSlotId;
  offsetX?: number; // Optional fine-tuning in px
  offsetY?: number; // Optional fine-tuning in px
  scale?: number;   // Optional scaling factor
}

export interface DetailItemConfig {
  id: string;
  asset_id: DetailId;
  slot: SlotId;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
}

export type EasingType = "linear" | "ease_in_out" | "ease_in" | "ease_out";

export interface ActorMotionConfig {
  targetSlot: SlotId;
  targetOffsetX?: number;
  targetOffsetY?: number;
  startTimeSec?: number;  // Default: 0
  endTimeSec?: number;    // Default: scene duration
  easing?: EasingType;    // Default: "ease_in_out"
  autoFaceTarget?: boolean; // Automatically turn toward destination when moving (default: true)
  movingPose?: CharacterPoseId; // Optional pose override while actively moving (e.g. pose_walking / pose_floating)
}

export interface ActorConfig {
  id: string;
  base: CharacterBaseId;
  costume?: CostumeId; // Modular Clothing / Outfit Asset
  face: CharacterFaceId;
  pose: CharacterPoseId;
  facing: FacingDirection;
  slot: SlotId;
  offsetX?: number; // Optional fine-tuning in px
  offsetY?: number; // Optional fine-tuning in px
  scale?: number;   // Optional scaling factor
  opacity?: number; // e.g. 0.0 - 1.0 for spectral ghost
  heldItem?: HeldItemId; // Modular handheld prop attached to Hand Socket
  heldHand?: HeldHand;   // "right" (front arm, default) or "left" (back arm)
  motion?: ActorMotionConfig; // Optional A -> B keyframe movement
}

export interface DirectorLightingConfig {
  sky_preset: SkyPresetId;
  fog_density: number; // 0.0 to 1.0
  ambient_tint?: string;
  thunder_flash?: boolean;
}

export interface DirectorSceneScript {
  scene_id: string;
  title?: string;
  duration_sec?: number;
  theme: ThemeId;
  lighting: DirectorLightingConfig;
  environment_items: EnvironmentItemConfig[];
  actors: ActorConfig[];
  details?: DetailItemConfig[];
  dialogue?: string;
  narrative_note?: string;
}

/**
 * Named Shared Environment Preset
 * Cấu hình bối cảnh dùng lại giữa các phân cảnh để tránh lệch bối cảnh
 */
export interface NamedEnvironmentPreset {
  id: string;
  name: string; // Tên bối cảnh (ví dụ: "Bãi Tha Ma Đêm Ba Mươi", "Miếu Hoang Trăng Máu")
  description?: string; // Ghi chú mô tả bối cảnh
  theme: ThemeId;
  lighting: DirectorLightingConfig;
  environment_items: EnvironmentItemConfig[];
  details?: DetailItemConfig[];
}

/**
 * Coordinate definition for slot anchors
 */
export interface SlotAnchor {
  id: SlotId;
  x: number;
  y: number;
  type: "ground" | "air";
  name: string;
}

/**
 * Socket hierarchy for character rig
 */
export interface RigSockets {
  ground: [number, number];       // [0, 0]
  hip: [number, number];          // [0, -90]
  shoulder_left: [number, number];// [-25, -190]
  shoulder_right: [number, number];// [25, -190]
  neck: [number, number];         // [0, -210]
  head: [number, number];         // [0, -250]
}

export type SelectedEntity =
  | { type: "actor"; id: string }
  | { type: "structure"; index: number }
  | { type: "detail"; id: string }
  | null;
