/**
 * 2D PROCEDURAL GRAPHICS & LAYOUT ENGINE ARCHITECTURE TYPES
 * Style: Silhouette Minimalist Horror (Limbo / Badland / U Linh Kỳ Truyện)
 */

export type ThemeId = "rural_graveyard" | "abandoned_village" | "cursed_swamp";
export type SkyPresetId = "blood_moon" | "foggy_night" | "stormy_dark" | "eclipse_abyss";

export type StructureId =
  | "creepy_banyan_tree"
  | "ancient_tomb"
  | "dilapidated_hut"
  | "abandoned_shrine"
  | "broken_wooden_bridge"
  | "scarecrow_of_the_damned"
  | "creepy_well"
  | "haunted_gallows_tree";

export type CharacterBaseId =
  | "male_adult"
  | "female_adult"
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
  | "outfit_child_pajamas";     // Yếm hoa / Bộ đồ trẻ thơ vương vết ố

export type CharacterFaceId =
  | "face_calm"
  | "face_scared"
  | "face_creepy_smile"
  | "face_bleeding_eyes"
  | "face_faceless"
  | "face_glowing_hollow"
  | "face_talisman_covered";

export type CharacterPoseId =
  | "pose_standing"
  | "pose_shivering"
  | "pose_walking"
  | "pose_floating"
  | "pose_crawling"
  | "pose_reaching"
  | "pose_hanging";

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
  dialogue?: string;
  narrative_note?: string;
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
