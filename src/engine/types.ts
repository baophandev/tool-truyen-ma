/**
 * 2D PROCEDURAL GRAPHICS & LAYOUT ENGINE ARCHITECTURE TYPES
 * Style: Silhouette Minimalist Horror (Limbo / Badland / U Linh Kỳ Truyện)
 */

export type SpaceDividerStyle =
  | "wooden_pillar"
  | "bamboo_partition"
  | "brick_wall"
  | "black_silhouette";

export interface SpaceDividerConfig {
  enabled?: boolean;
  slot?: GroundSlotId; // Slot đặt vách ngăn chia 2 không gian ("far_left" | "mid_left" | "center" | "mid_right" | "far_right"), mặc định "mid_left"
  offsetX?: number;    // Tinh chỉnh pixel X nếu muốn xê dịch vách ngăn
  style?: SpaceDividerStyle; // Kiểu dáng vách/cột ("wooden_pillar", "bamboo_partition", "brick_wall", "black_silhouette")
  width?: number;      // Bề rộng vách/cột (px, mặc định 64px)
  label_left?: string;  // Nhãn không gian bên trái (vd: "Ngoài Hiên / Bờ Kênh")
  label_right?: string; // Nhãn không gian bên phải (vd: "Trong Buồng / Gian Nhà")
}

export type ThemeId =
  | "rural_graveyard"
  | "abandoned_village"
  | "cursed_swamp"
  | "modern_indoor"
  | "vehicle_interior"
  | "urban_night_market"
  | "thatched_house_interior";

export type SkyPresetId =
  | "blood_moon"
  | "foggy_night"
  | "stormy_dark"
  | "eclipse_abyss"
  | "flickering_fluorescent"
  | "dim_indoor_night"
  | "clear_day"
  | "golden_sunset"
  | "morning_dawn";

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
  | "creepy_bathtub"
  | "market_stall_tent"
  | "abandoned_subway_station"
  | "rusty_train_tracks_tunnel"
  | "structure_old_apartment_gate"
  | "structure_wooden_sampan"
  | "structure_monkey_bridge"
  | "structure_wooden_coffin"
  | "structure_bamboo_bed_net"
  | "structure_wooden_latch_door"
  | "structure_rural_passenger_bus"
  | "structure_coconut_banana_grove"
  | "structure_wooden_chair"
  | "structure_wooden_bed"
  | "structure_small_wooden_table"
  | "structure_wooden_window"
  | "structure_ancestor_altar"
  | "structure_hammock"
  | "structure_wooden_stairs"
  | "structure_overgrown_ruins"
  | "structure_thatched_tile_house";

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
  | "detail_broken_mirror"
  | "detail_muddy_water_puddle"
  | "detail_oil_lamp"
  | "detail_vintage_radio"
  | "detail_water_hyacinth"
  | "detail_child_sandals"
  | "detail_offering_tray_toys"
  | "detail_matchbox"
  | "detail_water_droplets"
  | "detail_porridge_bowl"
  | "detail_npc_silhouette_standing"
  | "detail_npc_silhouette_walking"
  | "detail_npc_crowd_group"
  | "detail_npc_crowd_walking"
  | "detail_fish_splash"
  | "detail_falling_coconut"
  | "detail_rooster_crowing";

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
  | "outfit_modern_casual"      // Trang phục thường ngày hiện đại (Hoodie / Áo khoác)
  | "outfit_traditional_ba_ba"  // Áo bà ba trắng truyền thống Nam Bộ & quần lụa đen
  | "outfit_funeral_white";     // Trang phục tang lễ trắng xô gai & dải khăn tang trắng quấn đầu

export type CharacterFaceId =
  | "face_calm"
  | "face_scared"
  | "face_screaming_gasp"       // Há hốc kinh hoàng / Mắt tròn trừng trợn đớp khí (Screaming Gasp Tongue)
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

export type FacialActionId =
  | "none"
  | "blink_natural"            // Chớp mắt tự nhiên (đều đặn nhịp nhàng)
  | "blink_nervous"            // Chớp mắt lia lịa hoảng loạn (nháy liên hồi)
  | "darting_eyes"             // Liếc mắt dáo dác qua lại (dò xét bóng tối)
  | "crying_tears"             // Rơi lệ khóc ròng (dòng lệ tuôn trào)
  | "bleeding_tears"           // Khóc ra máu (dòng máu tươi rỉ từ hốc mắt)
  | "creepy_laugh"             // Cười ma quái giật rung (khuôn miệng co giật)
  | "terrified_scream"         // Há to đớp khí trong kinh hãi (quivering jaw scream)
  | "talking_jaw";             // Cử động môi nói / thì thào theo lời thoại

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
  | "pose_holding"
  | "pose_lying_down"
  | "pose_lying_hammock"
  | "pose_sitting_bed"
  | "pose_climbing_stairs"
  | "pose_balancing_bridge"
  | "pose_kneeling"
  | "pose_squatting"
  | "pose_lying_ground"
  | "pose_swimming"
  | "pose_drowning"
  | "pose_floating_corpse";

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
  | "item_severed_head"       // Thủ cấp đứt lìa túm tóc xách tay vương máu rỉ giọt
  | "item_mysterious_note"    // Mẩu giấy / lá thư bí ẩn vương máu mang thông điệp kinh hoàng
  | "item_offering_toys"      // Nải chuối & đồ chơi đất nung cúng cô hồn trên tàu lá chuối
  | "item_areca_palm_fan"     // Quạt mo cau miền quê phe phẩy đêm hè oi bức
  | "item_fresh_ginger"       // Lát gừng tươi giữ khí chống tà khí ban đêm
  | "item_oil_lamp"           // Đèn dầu hột vịt cầm tay soi bóng đêm
  | "item_incense_sticks"     // Ba nén nhang đang cháy cầm tay khấn vái
  | "item_book"               // Cuốn sách giấy bìa cũ mở đôi
  | "item_betel_quid";        // Miếng trầu têm cánh phượng

export type ShoulderItemId =
  | "none"
  | "shoulder_carrying_pole"       // Đòn gánh tre hai thúng quang dầu trĩu nặng đung đưa nhịp nhàng
  | "shoulder_coffin_pole"         // Đòn khiêng áo quan / đòn khiêng tử thi vuông vức
  | "shoulder_hoe"                 // Chiếc cuốc cày rỉ sét vác ngang vai nông phu
  | "shoulder_sack"                // Bao tải gai cũ kỹ vác trĩu một bên vai
  | "shoulder_firewood_bundle";    // Bó củi khô khẳng khiu buộc lạt mây vác vai

export type HeadItemId =
  | "none"
  | "head_conical_hat"             // Nón lá cổ truyền chóp nhọn, quai vải mềm che nghiêng mặt ma mị
  | "head_funeral_band"            // Dải khăn tang trắng xô gai quấn trán rủ hai vạt dài
  | "head_straw_hat"               // Mũ cói rách vành che nắng gió ma mị
  | "head_talisman_mask"           // Lá bùa vàng trấn yểm dán rủ trước trán che kín mặt
  | "head_basket";                 // Thúng / Mẹt tre đội thăng bằng trên đỉnh đầu

export type LegItemId =
  | "none"
  | "leg_iron_chains"              // Cùm xích sắt hoen rỉ ôm cổ chân, xích lê loẹt quẹt sát đất
  | "leg_wooden_shackles"          // Gông cùm gỗ kẹp mắt cá chân tử tù
  | "leg_bloody_bandage"           // Băng vải trắng vấy máu quấn quanh cổ chân
  | "leg_muddy_splatter";          // Vệt bùn sình lầy đen ngòm bám quanh cổ chân lội kênh rạch

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
  facing?: FacingDirection; // Optional horizontal facing direction ("left" | "right")
  isShaking?: boolean; // Tùy chọn rung lắc (ví dụ cánh cửa gỗ bị đập mạnh, chấn động kịch tính)
  zIndex?: number;  // Độ sâu lớp hiển thị (ai trên ai dưới - số càng lớn càng ở phía trên)
}

export interface DetailItemConfig {
  id: string;
  asset_id: DetailId;
  slot: SlotId;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
  zIndex?: number;  // Độ sâu lớp hiển thị (ai trên ai dưới - số càng lớn càng ở phía trên)
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
  name?: string; // Optional character display name
  base: CharacterBaseId;
  costume?: CostumeId; // Modular Clothing / Outfit Asset
  face: CharacterFaceId;
  facialAction?: FacialActionId; // Dynamic facial action (blinking, eye darting, weeping, laughing, etc.)
  pose: CharacterPoseId;
  facing: FacingDirection;
  slot: SlotId;
  offsetX?: number; // Optional fine-tuning in px
  offsetY?: number; // Optional fine-tuning in px (-80 for beds, -60 for hammock, 0 for ground/chair)
  interact_with?: StructureId | "none" | null; // Optional special interactive structure docked to (bed, chair, hammock)
  scale?: number;   // Optional scaling factor
  opacity?: number; // e.g. 0.0 - 1.0 for spectral ghost
  heldItem?: HeldItemId; // Modular handheld prop attached to Hand Socket
  heldHand?: HeldHand;   // "right" (front arm, default) or "left" (back arm)
  shoulderItem?: ShoulderItemId; // Modular prop anchored to Shoulder Socket (e.g. đòn gánh, cuốc, bao tải)
  headItem?: HeadItemId;         // Modular prop anchored to Head Socket (e.g. nón lá, khăn tang, bùa dán)
  legItem?: LegItemId;           // Modular prop anchored to Leg/Feet Socket (e.g. cùm xích sắt, gông cùm, băng bó máu)
  motion?: ActorMotionConfig; // Optional A -> B keyframe movement
  zIndex?: number;  // Độ sâu lớp hiển thị (ai trên ai dưới - số càng lớn càng ở phía trên)
}

export type WeatherEffectId =
  | "none"
  | "heavy_rain"
  | "storm_thunder"
  | "blood_rain"
  | "floating_embers"
  | "drifting_ash"
  | "haunted_mist";

export interface DirectorLightingConfig {
  sky_preset: SkyPresetId;
  fog_density?: number; // 0.0 to 1.0 (Tùy chọn, mặc định 0.0 nếu không có sương mù)
  ambient_tint?: string;
  thunder_flash?: boolean;
  weather?: WeatherEffectId;
}

export type SubtitleStyleId =
  | "auto"
  | "blood_red"
  | "smoky_grey"
  | "emerald_phantom"
  | "candle_amber"
  | "cyan_fluorescent";

export type SubtitleAnimId =
  | "typewriter_fade"
  | "word_by_word"
  | "smooth_fade"
  | "static";

export type CameraShotType =
  | "extreme_wide"     // Đại cảnh (bao quát mênh mông, nhân vật cô độc lọt thỏm)
  | "wide"             // Toàn cảnh (mặc định, toàn bộ sân khấu 1920x1080)
  | "medium_wide"      // Trung toàn cảnh (từ đầu gối lên, tương tác môi trường)
  | "medium"           // Trung cảnh (từ thắt lưng lên, hành động vũ khí/bùa chú)
  | "close_up"         // Cận cảnh (từ ngực lên mặt, biểu cảm rùng rợn)
  | "extreme_close_up" // Đặc tả (chỉ thấy đôi mắt rỉ máu, nụ cười quái dị)
  | "dutch_tilt";      // Góc nghiêng ma mị (tâm lý bất an, tà khí)

export type CameraMotionType =
  | "static"           // Máy quay cố định
  | "pan_left"         // Lia máy sang trái
  | "pan_right"        // Lia máy sang phải
  | "tilt_up"          // Lia từ đất lên trời
  | "tilt_down"        // Lia từ trời xuống đất
  | "push_in"          // Zoom từ từ vào đối tượng (Dolly In)
  | "pull_out"         // Zoom từ từ lùi ra xa (Dolly Out)
  | "follow_actor";    // Bám theo nhân vật di chuyển

export type CameraShakeIntensity = "none" | "subtle_handheld" | "creepy_tremor" | "heavy_jumpscare";

export type CameraTransitionType = "cut" | "smooth";

export interface CameraMotionConfig {
  type: CameraMotionType;
  endShot?: CameraShotType;
  endZoom?: number;
  endPanX?: number;
  endPanY?: number;
  endDutchAngle?: number;
  startTimeSec?: number;  // Default: 0 (or keyframe startTimeSec)
  endTimeSec?: number;    // Default: scene duration (or next keyframe startTimeSec)
  easing?: EasingType;    // Default: "ease_in_out"
}

export interface CameraKeyframe {
  startTimeSec: number;                 // Mốc thời gian bắt đầu góc máy này (giây, >= 0)
  transition?: CameraTransitionType;    // "cut" (cắt máy dứt khoát - mặc định) | "smooth" (lướt mượt từ góc trước)
  transitionDurationSec?: number;       // Thời lượng lướt khi transition === "smooth" (mặc định 1.0s)
  easing?: EasingType;                  // Easing khi transition === "smooth" (mặc định "ease_in_out")
  shot: CameraShotType;                 // Cỡ cảnh chuẩn cho nhịp này
  target_slot?: SlotId;                 // Điểm ngắm theo slot
  target_actor_id?: string;             // Khóa mục tiêu theo nhân vật (có thể đổi nhân vật giữa các cú cắt)
  zoom?: number;                        // Hệ số zoom tự do (0.5x - 6.0x, mặc định theo shot)
  pan_x?: number;                       // Tinh chỉnh tọa độ X (px)
  pan_y?: number;                       // Tinh chỉnh tọa độ Y (px)
  dutch_angle?: number;                 // Góc xoay nghiêng (-25 đến 25 độ)
  shake?: CameraShakeIntensity;         // Rung lắc ống kính riêng cho nhịp này
  motion?: CameraMotionConfig;          // Chuyển động máy quay cục bộ trong đoạn góc máy này
}

export interface DirectorCameraConfig {
  shot?: CameraShotType;              // Cỡ cảnh chuẩn (dùng khi chỉ có 1 góc máy, hoặc làm gốc)
  target_slot?: SlotId;               // Điểm ngắm theo slot
  target_actor_id?: string;           // Khóa mục tiêu theo nhân vật
  zoom?: number;                      // Hệ số zoom tự do (0.8x - 5.0x, default theo shot)
  pan_x?: number;                     // Tinh chỉnh tọa độ X (px)
  pan_y?: number;                     // Tinh chỉnh tọa độ Y (px)
  dutch_angle?: number;               // Góc xoay nghiêng (-15 đến 15 độ)
  shake?: CameraShakeIntensity;       // Rung lắc ống kính
  motion?: CameraMotionConfig;        // Chuyển động máy quay theo thời gian
  keyframes?: CameraKeyframe[];       // Đa góc máy theo mốc thời gian trong cùng 1 phân cảnh (AI hoặc người dùng đạo diễn)
}

export interface DirectorSceneScript {
  scene_id: string;
  title?: string;
  duration_sec?: number;
  theme: ThemeId;
  weather?: WeatherEffectId; // Hiệu ứng thời tiết cấp phân cảnh (none, heavy_rain, storm_thunder, haunted_mist...)
  lighting: DirectorLightingConfig;
  camera?: DirectorCameraConfig;
  environment_items: EnvironmentItemConfig[];
  actors: ActorConfig[];
  details?: DetailItemConfig[];
  space_divider?: SpaceDividerConfig | boolean | GroundSlotId; // Cột / Vách ngăn kiến trúc chia 2 không gian độc lập
  dialogue?: string;
  subtitle_style?: SubtitleStyleId;
  subtitle_anim?: SubtitleAnimId;
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
 * Named Shared Character / Cast Preset
 * Cấu hình diễn viên/nhân vật dùng lại để khóa rắc-co (continuity) giữa các phân cảnh và các tập
 */
export interface NamedCharacterPreset {
  id: string; // e.g. "char_male_explorer", "char_female_ao_dai"
  name: string; // Tên nhân vật (ví dụ: "Nam chính (Minh - Nhà báo)", "Oan hồn nữ áo dài")
  description?: string; // Vai trò ngữ nghĩa (ví dụ: "Nhân vật chính bị truy đuổi trong suốt bộ phim")
  base: CharacterBaseId; // male_adult, female_adult, elder_hunched, v.v.
  costume: CostumeId; // outfit_modern_casual, outfit_flowing_ao_dai, v.v.
  face?: CharacterFaceId; // Biểu cảm đặc trưng (mặc định e.g. face_scared, face_calm)
  defaultHeldItem?: HeldItemId; // Đồ vật quen thuộc (e.g. item_flashlight)
  defaultHeldHand?: HeldHand; // "right" | "left"
  defaultShoulderItem?: ShoulderItemId; // Vật thể vác vai mặc định (e.g. shoulder_carrying_pole)
  defaultHeadItem?: HeadItemId;         // Vật thể đội đầu mặc định (e.g. head_conical_hat)
  defaultLegItem?: LegItemId;           // Vật thể chân mặc định (e.g. leg_iron_chains)
  scale?: number; // Tỷ lệ co giãn (mặc định 1.0)
}

/**
 * Pre-production scene draft specification
 */
export interface SceneDraftSpec {
  environmentId: string;
  title: string;
  actionDescription: string;
  duration_sec?: number;
  dialogue?: string;
  cameraShot?: CameraShotType | "auto";
  weather?: WeatherEffectId;
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
