import { ALL_SLOTS, GROUND_SLOTS, AIR_SLOTS, GROUND_Y } from "./constants";
import type {
  DirectorSceneScript,
  SlotId,
  GroundSlotId,
  AirSlotId,
  CharacterBaseId,
  CharacterFaceId,
  CharacterPoseId,
  CostumeId,
  DetailId,
  FacingDirection,
  HeldHand,
  HeldItemId,
  ShoulderItemId,
  HeadItemId,
  LegItemId,
  StructureId,
  ThemeId,
  SkyPresetId,
  SubtitleStyleId,
  SubtitleAnimId,
  WeatherEffectId,
  FacialActionId,
  DirectorCameraConfig,
  CameraKeyframe,
  CameraMotionConfig,
  CameraShotType,
  CameraMotionType,
  CameraShakeIntensity,
  CameraTransitionType,
  EasingType,
} from "./types";
import {
  DETAIL_RULES,
  STRUCTURE_RULES,
  getAllowedSlotsForActor,
  findNearestAllowedSlot,
  isAirPose,
  supportsVerticalOffset,
  isSlotAllowed,
} from "./placementRules";

/**
 * Returns accurate absolute [X, Y] world coordinate for any slot
 * applying any custom fine-tune offsets.
 */
export function getSlotCoordinates(slotId: SlotId, offsetX = 0, offsetY = 0): { x: number; y: number } {
  const slot = ALL_SLOTS[slotId];
  if (!slot) {
    console.warn(`[LayoutRouter] Unknown slotId "${slotId}", fallback to center.`);
    return { x: 960 + offsetX, y: GROUND_Y + offsetY };
  }
  return {
    x: slot.x + offsetX,
    y: slot.y + offsetY,
  };
}

export function isGroundSlot(slotId: string): slotId is GroundSlotId {
  return slotId in GROUND_SLOTS;
}

export function isAirSlot(slotId: string): slotId is AirSlotId {
  return slotId in AIR_SLOTS;
}

export function getDefaultCostumeForBase(base: CharacterBaseId): CostumeId {
  switch (base) {
    case "female_adult":
      return "outfit_flowing_ao_dai";
    case "ghost_wraith":
      return "outfit_shredded_burial";
    case "creepy_child":
      return "outfit_child_pajamas";
    case "jiangshi_corpse":
      return "outfit_mandarin_court";
    case "demon_shadow":
      return "outfit_ancient_armor";
    case "elder_hunched":
      return "outfit_tattered_tunic";
    case "brute_hulking":
      return "outfit_ancient_armor";
    case "skeletal_emaciated":
      return "outfit_shredded_burial";
    case "male_adult":
    default:
      return "outfit_tattered_tunic";
  }
}

const VALID_THEMES: ThemeId[] = [
  "rural_graveyard",
  "abandoned_village",
  "cursed_swamp",
  "modern_indoor",
  "vehicle_interior",
  "urban_night_market",
  "thatched_house_interior",
];
const VALID_SKY_PRESETS: SkyPresetId[] = [
  "blood_moon",
  "foggy_night",
  "stormy_dark",
  "eclipse_abyss",
  "flickering_fluorescent",
  "dim_indoor_night",
  "clear_day",
  "golden_sunset",
  "morning_dawn",
];
export const VALID_WEATHER_EFFECTS: WeatherEffectId[] = [
  "none",
  "heavy_rain",
  "storm_thunder",
  "blood_rain",
  "floating_embers",
  "drifting_ash",
  "haunted_mist",
];
const VALID_STRUCTURES: StructureId[] = [
  "creepy_banyan_tree",
  "ancient_tomb",
  "dilapidated_hut",
  "abandoned_shrine",
  "broken_wooden_bridge",
  "scarecrow_of_the_damned",
  "creepy_well",
  "haunted_gallows_tree",
  "hospital_operating_bed",
  "hotel_reception_desk",
  "supermarket_shelf_aisle",
  "creepy_elevator_doors",
  "dining_table_chairs",
  "bus_interior",
  "creepy_bathtub",
  "market_stall_tent",
  "abandoned_subway_station",
  "rusty_train_tracks_tunnel",
  "structure_old_apartment_gate",
  "structure_wooden_sampan",
  "structure_monkey_bridge",
  "structure_wooden_coffin",
  "structure_bamboo_bed_net",
  "structure_wooden_latch_door",
  "structure_rural_passenger_bus",
  "structure_coconut_banana_grove",
  "structure_wooden_chair",
  "structure_wooden_bed",
  "structure_small_wooden_table",
  "structure_wooden_window",
  "structure_ancestor_altar",
  "structure_hammock",
  "structure_wooden_stairs",
];
const VALID_BASES: CharacterBaseId[] = [
  "male_adult",
  "female_adult",
  "elder_hunched",
  "brute_hulking",
  "skeletal_emaciated",
  "ghost_wraith",
  "creepy_child",
  "jiangshi_corpse",
  "demon_shadow",
];
const VALID_COSTUMES: CostumeId[] = [
  "outfit_tattered_tunic",
  "outfit_flowing_ao_dai",
  "outfit_shrouded_cloak",
  "outfit_mandarin_court",
  "outfit_monk_cassock",
  "outfit_shredded_burial",
  "outfit_ancient_armor",
  "outfit_child_pajamas",
  "outfit_doctor_coat",
  "outfit_patient_gown",
  "outfit_modern_casual",
  "outfit_traditional_ba_ba",
  "outfit_funeral_white",
];
const VALID_FACES: CharacterFaceId[] = [
  "face_calm",
  "face_scared",
  "face_screaming_gasp",
  "face_creepy_smile",
  "face_bleeding_eyes",
  "face_faceless",
  "face_glowing_hollow",
  "face_talisman_covered",
  "face_old_wrinkled",
  "face_rage_furious",
  "face_pale_corpse",
  "face_weeping_ghost",
  "face_sewn_mouth",
  "face_haggard_gaunt",
  "face_headless",
];
export const VALID_FACIAL_ACTIONS: FacialActionId[] = [
  "none",
  "blink_natural",
  "blink_nervous",
  "darting_eyes",
  "crying_tears",
  "bleeding_tears",
  "creepy_laugh",
  "terrified_scream",
  "talking_jaw",
];
const VALID_POSES: CharacterPoseId[] = [
  "pose_standing",
  "pose_sitting",
  "pose_sitting_twisted_legs",
  "pose_twisted_legs_floating",
  "pose_shivering",
  "pose_walking",
  "pose_floating",
  "pose_crawling",
  "pose_reaching",
  "pose_hanging",
  "pose_holding",
  "pose_lying_down",
  "pose_lying_hammock",
  "pose_sitting_bed",
  "pose_climbing_stairs",
  "pose_balancing_bridge",
  "pose_kneeling",
  "pose_squatting",
];
const VALID_HELD_ITEMS: HeldItemId[] = [
  "none",
  "item_storm_lantern",
  "item_paper_lantern",
  "item_soul_candle",
  "item_peach_wood_sword",
  "item_yellow_talisman",
  "item_rusty_sickle",
  "item_ritual_bell",
  "item_tattered_doll",
  "item_tattered_umbrella",
  "item_flashlight",
  "item_scalpel",
  "item_smartphone",
  "item_severed_head",
  "item_mysterious_note",
  "item_offering_toys",
  "item_areca_palm_fan",
  "item_fresh_ginger",
  "item_oil_lamp",
];
export const VALID_SHOULDER_ITEMS: ShoulderItemId[] = [
  "none",
  "shoulder_carrying_pole",
  "shoulder_coffin_pole",
  "shoulder_hoe",
  "shoulder_sack",
  "shoulder_firewood_bundle",
];
export const VALID_HEAD_ITEMS: HeadItemId[] = [
  "none",
  "head_conical_hat",
  "head_funeral_band",
  "head_straw_hat",
  "head_talisman_mask",
  "head_basket",
];
export const VALID_LEG_ITEMS: LegItemId[] = [
  "none",
  "leg_iron_chains",
  "leg_wooden_shackles",
  "leg_bloody_bandage",
  "leg_muddy_splatter",
];
const VALID_HELD_HANDS: HeldHand[] = ["right", "left"];
const VALID_DETAILS: DetailId[] = [
  "detail_black_crow",
  "detail_will_o_wisp",
  "detail_blood_lantern",
  "detail_incense_bowl",
  "detail_skull_pile",
  "detail_hanging_talisman",
  "detail_iv_drip_stand",
  "detail_shopping_cart",
  "detail_surveillance_camera",
  "detail_flickering_ceiling_lamp",
  "detail_broken_mirror",
  "detail_muddy_water_puddle",
  "detail_oil_lamp",
  "detail_vintage_radio",
  "detail_water_hyacinth",
];
const VALID_FACINGS: FacingDirection[] = ["left", "right"];
const VALID_SLOTS: SlotId[] = [
  "far_left",
  "mid_left",
  "center",
  "mid_right",
  "far_right",
  "air_left",
  "air_center",
  "air_right",
];

export const VALID_CAMERA_SHOTS: CameraShotType[] = [
  "extreme_wide",
  "wide",
  "medium_wide",
  "medium",
  "close_up",
  "extreme_close_up",
  "dutch_tilt",
];

export const VALID_CAMERA_MOTIONS: CameraMotionType[] = [
  "static",
  "pan_left",
  "pan_right",
  "tilt_up",
  "tilt_down",
  "push_in",
  "pull_out",
  "follow_actor",
];

export const VALID_CAMERA_SHAKES: CameraShakeIntensity[] = [
  "none",
  "subtle_handheld",
  "creepy_tremor",
  "heavy_jumpscare",
];

/**
 * Rigorous validator and self-healing normalizer for DirectorSceneScript JSON
 * Guarantees that minor LLM quirks (e.g. missing facing, motion: null, out-of-range fog)
 * are cleanly sanitized and auto-repaired so valid, glitch-free scenes are always produced.
 */
export function validateDirectorScript(script: any): { valid: boolean; errors: string[]; normalized?: DirectorSceneScript } {
  if (!script || typeof script !== "object") {
    return { valid: false, errors: ["Script phải là một JSON Object hợp lệ"] };
  }

  // 1. Scene ID, Title & Duration
  const scene_id =
    script.scene_id && typeof script.scene_id === "string"
      ? script.scene_id.trim()
      : `scene_ai_${Date.now().toString().slice(-6)}`;

  const title =
    script.title && typeof script.title === "string"
      ? script.title.trim()
      : "Phân Cảnh Hoạt Hình";

  const rawDuration = Number(script.duration_sec);
  const duration_sec =
    !isNaN(rawDuration) && rawDuration >= 1 && rawDuration <= 60
      ? Math.round(rawDuration)
      : 6;

  // 2. Theme
  const theme: ThemeId = VALID_THEMES.includes(script.theme)
    ? script.theme
    : "rural_graveyard";

  // 3. Lighting
  const lightingRaw = script.lighting && typeof script.lighting === "object" ? script.lighting : {};
  const sky_preset: SkyPresetId = VALID_SKY_PRESETS.includes(lightingRaw.sky_preset)
    ? lightingRaw.sky_preset
    : (theme === "modern_indoor" || theme === "vehicle_interior" ? "flickering_fluorescent" : theme === "thatched_house_interior" ? "dim_indoor_night" : "foggy_night");

  const rawWeather = script.weather || lightingRaw.weather;
  const weather: WeatherEffectId = VALID_WEATHER_EFFECTS.includes(rawWeather)
    ? rawWeather
    : (sky_preset === "stormy_dark" ? "storm_thunder" : "none");

  const rawFog =
    lightingRaw.fog_density !== undefined && lightingRaw.fog_density !== null
      ? Number(lightingRaw.fog_density)
      : undefined;
  const fog_density =
    rawFog !== undefined && !isNaN(rawFog)
      ? Math.min(1, Math.max(0, rawFog))
      : (weather === "haunted_mist" ? 0.65 : sky_preset === "foggy_night" ? 0.35 : 0.0);
  const thunder_flash = Boolean(lightingRaw.thunder_flash || weather === "storm_thunder");
  const ambient_tint = lightingRaw.ambient_tint;

  // 4. Environment Items (Structures)
  const environment_items: DirectorSceneScript["environment_items"] = [];
  if (Array.isArray(script.environment_items)) {
    script.environment_items.forEach((item: any) => {
      if (!item || typeof item !== "object") return;
      if (item.asset_id === "old_apartment_gate") {
        item.asset_id = "structure_old_apartment_gate";
      }
      if (item.asset_id === "wooden_sampan") {
        item.asset_id = "structure_wooden_sampan";
      }
      if (item.asset_id === "monkey_bridge") {
        item.asset_id = "structure_monkey_bridge";
      }
      if (item.asset_id === "wooden_chair" || item.asset_id === "chair") {
        item.asset_id = "structure_wooden_chair";
      }
      if (item.asset_id === "wooden_bed" || item.asset_id === "bed") {
        item.asset_id = "structure_wooden_bed";
      }
      if (item.asset_id === "small_wooden_table" || item.asset_id === "wooden_table" || item.asset_id === "table") {
        item.asset_id = "structure_small_wooden_table";
      }
      if (item.asset_id === "wooden_window" || item.asset_id === "window" || item.asset_id === "country_window") {
        item.asset_id = "structure_wooden_window";
      }
      if (!VALID_STRUCTURES.includes(item.asset_id)) return;

      const structId = item.asset_id as StructureId;
      const rule = STRUCTURE_RULES[structId];
      let rawSlot = typeof item.slot === "string" ? item.slot.trim().replace(/^ground_/, "").replace(/^air_slot_/, "air_") : "center";
      let slot: GroundSlotId = rawSlot as GroundSlotId;
      if (!rule.allowedSlots.includes(slot)) {
        slot = rule.allowedSlots[0] || "center";
      }

      environment_items.push({
        asset_id: structId,
        slot,
        offsetX: Number(item.offsetX) || 0,
        offsetY: Number(item.offsetY) || 0,
        scale: Number(item.scale) || 1,
        ...(item.facing === "left" || item.facing === "right" ? { facing: item.facing } : {}),
      });
    });
  }

  // 5. Actors with Self-Healing (facing, motion, pose compatibility)
  const rawActors = Array.isArray(script.actors) ? script.actors : [];
  const actors: DirectorSceneScript["actors"] = [];

  rawActors.forEach((actor: any, idx: number) => {
    if (!actor || typeof actor !== "object") return;

    const id = actor.id && typeof actor.id === "string" ? actor.id.trim() : `actor_${idx + 1}`;
    const base: CharacterBaseId = VALID_BASES.includes(actor.base) ? actor.base : "male_adult";
    let rawCostume = actor.costume;
    if (rawCostume === "funeral_white" || rawCostume === "mourning_white" || rawCostume === "white_mourning") {
      rawCostume = "outfit_funeral_white";
    }
    const costume: CostumeId = VALID_COSTUMES.includes(rawCostume)
      ? rawCostume
      : getDefaultCostumeForBase(base);
    const face: CharacterFaceId = VALID_FACES.includes(actor.face) ? actor.face : "face_calm";
    const facialAction: FacialActionId | undefined = VALID_FACIAL_ACTIONS.includes(actor.facialAction)
      ? actor.facialAction
      : undefined;
    let rawPose = actor.pose;
    if (rawPose === "pose_idle" || rawPose === "idle" || rawPose === "standing") {
      rawPose = "pose_standing";
    }
    const pose: CharacterPoseId = VALID_POSES.includes(rawPose) ? rawPose : "pose_standing";

    const actorRule = getAllowedSlotsForActor({ base, pose });

    // Slot healing: ensure slot matches pose allowed area
    let rawSlot = typeof actor.slot === "string" ? actor.slot.trim().replace(/^ground_/, "").replace(/^air_slot_/, "air_") : "center";
    let slot: SlotId = rawSlot as SlotId;
    if (!VALID_SLOTS.includes(slot) || !isSlotAllowed(slot, actorRule.allowedSlots)) {
      const fallbackInitialSlot = isAirPose(pose) ? "air_center" : "center";
      const curCoord = getSlotCoordinates(VALID_SLOTS.includes(slot) ? slot : fallbackInitialSlot);
      const nearest = findNearestAllowedSlot(curCoord.x, curCoord.y, actorRule.allowedSlots);
      slot = nearest.slot.id;
    }

    const name = typeof actor.name === "string" && actor.name.trim() ? actor.name.trim() : undefined;
    let interact_with: StructureId | "none" | null | undefined = undefined;
    if (actor.interact_with && actor.interact_with !== "none" && VALID_STRUCTURES.includes(actor.interact_with as StructureId)) {
      interact_with = actor.interact_with as StructureId;
    }

    const offsetX = Number(actor.offsetX) || 0;
    let offsetY = supportsVerticalOffset(pose, interact_with) ? (Number(actor.offsetY) || 0) : 0;

    // Auto-heal offsetY if interact_with is specified but offsetY was omitted or 0
    if (interact_with && offsetY === 0) {
      if (
        (interact_with === "structure_wooden_bed" ||
          interact_with === "structure_bamboo_bed_net" ||
          interact_with === "hospital_operating_bed") &&
        (pose === "pose_lying_down" || pose === "pose_sitting_bed")
      ) {
        offsetY = -80;
      } else if (interact_with === "structure_hammock" && pose === "pose_lying_hammock") {
        offsetY = -60;
      } else if (interact_with === "structure_wooden_stairs") {
        // When docked on stairs without active motion, default to upper landing platform
        offsetY = -180;
      } else if (interact_with === "structure_monkey_bridge") {
        offsetY = -115;
      } else if (interact_with === "broken_wooden_bridge") {
        offsetY = -110;
      }
    }
    const scale = Number(actor.scale) || 1;
    const opacity = actor.opacity !== undefined ? Math.min(1, Math.max(0, Number(actor.opacity))) : 1;

    let rawHeldItem = actor.heldItem;
    if (rawHeldItem === "oil_lamp" || rawHeldItem === "handheld_oil_lamp" || rawHeldItem === "item_handheld_oil_lamp") {
      rawHeldItem = "item_oil_lamp";
    }
    const heldItem: HeldItemId = VALID_HELD_ITEMS.includes(rawHeldItem) ? rawHeldItem : "none";
    const heldHand: HeldHand = VALID_HELD_HANDS.includes(actor.heldHand) ? actor.heldHand : "right";

    const shoulderItem: ShoulderItemId = VALID_SHOULDER_ITEMS.includes(actor.shoulderItem)
      ? actor.shoulderItem
      : "none";
    const headItem: HeadItemId = VALID_HEAD_ITEMS.includes(actor.headItem)
      ? actor.headItem
      : "none";
    const legItem: LegItemId = VALID_LEG_ITEMS.includes(actor.legItem)
      ? actor.legItem
      : "none";

    // Motion healing: drop motion if null, false, empty object, or invalid
    let motion: DirectorSceneScript["actors"][0]["motion"] = undefined;
    const rawMotion = actor.motion;
    const rawTargetSlot = rawMotion && typeof rawMotion.targetSlot === "string"
      ? rawMotion.targetSlot.trim().replace(/^ground_/, "").replace(/^air_slot_/, "air_")
      : "";
    const rawTargetOffsetX = Number(rawMotion?.targetOffsetX) || 0;
    const rawTargetOffsetY = Number(rawMotion?.targetOffsetY) || 0;
    const isMovingSameSlot = rawTargetSlot === slot && (rawTargetOffsetX !== offsetX || rawTargetOffsetY !== offsetY);
    if (
      rawMotion &&
      typeof rawMotion === "object" &&
      rawMotion !== null &&
      !Array.isArray(rawMotion) &&
      rawTargetSlot &&
      VALID_SLOTS.includes(rawTargetSlot as SlotId) &&
      (rawTargetSlot !== slot || isMovingSameSlot)
    ) {
      let targetSlot: SlotId = rawTargetSlot as SlotId;
      if (!isSlotAllowed(targetSlot, actorRule.allowedSlots)) {
        const curTargetCoord = getSlotCoordinates(targetSlot);
        const nearest = findNearestAllowedSlot(curTargetCoord.x, curTargetCoord.y, actorRule.allowedSlots);
        targetSlot = nearest.slot.id;
      }

      const easing = ["linear", "ease_in_out", "ease_in", "ease_out"].includes(rawMotion.easing)
        ? rawMotion.easing
        : "ease_in_out";

      const autoFaceTarget = rawMotion.autoFaceTarget !== false;
      const movingPose = VALID_POSES.includes(rawMotion.movingPose)
        ? rawMotion.movingPose
        : (isAirPose(pose) ? "pose_floating" : "pose_walking");

      const startTimeSec = Math.max(0, Number(rawMotion.startTimeSec) || 0);
      const endTimeSec = rawMotion.endTimeSec !== undefined
        ? Math.max(startTimeSec + 0.5, Number(rawMotion.endTimeSec) || duration_sec)
        : duration_sec;

      const targetOffsetX = rawTargetOffsetX;
      let targetOffsetY = (supportsVerticalOffset(pose, interact_with) || supportsVerticalOffset(movingPose, interact_with))
        ? rawTargetOffsetY
        : 0;

      // Auto-heal targetOffsetY if climbing stairs and targetOffsetY is not explicitly set
      if (
        targetOffsetY === 0 &&
        (interact_with === "structure_wooden_stairs" || movingPose === "pose_climbing_stairs")
      ) {
        targetOffsetY = -180;
      }

      motion = {
        targetSlot,
        targetOffsetX,
        targetOffsetY,
        startTimeSec,
        endTimeSec,
        easing,
        autoFaceTarget,
        movingPose,
      };
    }

    // Facing healing: auto-infer facing if undefined, null, or invalid
    let facing: FacingDirection;
    if (VALID_FACINGS.includes(actor.facing)) {
      facing = actor.facing;
    } else {
      if (motion) {
        const startX = getSlotCoordinates(slot).x + offsetX;
        const targetX = getSlotCoordinates(motion.targetSlot).x + (motion.targetOffsetX || 0);
        facing = targetX < startX ? "left" : "right";
      } else if (slot === "far_left" || slot === "mid_left") {
        facing = "right"; // Look inwards towards center
      } else if (slot === "far_right" || slot === "mid_right") {
        facing = "left"; // Look inwards towards center
      } else {
        facing = idx === 0 ? "right" : "left";
      }
    }

    actors.push({
      id,
      ...(name ? { name } : {}),
      base,
      costume,
      face,
      ...(facialAction ? { facialAction } : {}),
      pose,
      facing,
      slot,
      offsetX,
      offsetY,
      ...(interact_with ? { interact_with } : {}),
      scale,
      opacity,
      heldItem,
      heldHand,
      ...(shoulderItem !== "none" ? { shoulderItem } : {}),
      ...(headItem !== "none" ? { headItem } : {}),
      ...(legItem !== "none" ? { legItem } : {}),
      ...(motion ? { motion } : {}),
    });
  });

  // Guarantee at least 1 actor exists
  if (actors.length === 0) {
    actors.push({
      id: "actor_main",
      base: "male_adult",
      costume: "outfit_tattered_tunic",
      face: "face_scared",
      pose: "pose_standing",
      facing: "right",
      slot: "center",
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      opacity: 1,
      heldItem: "none",
      heldHand: "right",
    });
  }

  // 6. Details with Self-Healing
  const details: NonNullable<DirectorSceneScript["details"]> = [];
  if (Array.isArray(script.details)) {
    script.details.forEach((dt: any, dIdx: number) => {
      if (!dt || typeof dt !== "object") return;
      if (!VALID_DETAILS.includes(dt.asset_id)) return;

      const detailId = dt.asset_id as DetailId;
      const rule = DETAIL_RULES[detailId];
      let rawSlot = typeof dt.slot === "string" ? dt.slot.trim().replace(/^ground_/, "").replace(/^air_slot_/, "air_") : "center";
      let slot: SlotId = rawSlot as SlotId;
      if (!VALID_SLOTS.includes(slot) || !isSlotAllowed(slot, rule.allowedSlots)) {
        slot = rule.allowedSlots[0] || "center";
      }

      details.push({
        id: dt.id && typeof dt.id === "string" ? dt.id.trim() : `detail_${dIdx + 1}`,
        asset_id: detailId,
        slot,
        offsetX: Number(dt.offsetX) || 0,
        offsetY: Number(dt.offsetY) || 0,
        scale: Number(dt.scale) || 1,
      });
    });
  }

  const dialogue = typeof script.dialogue === "string" ? script.dialogue.trim() : "";
  const narrative_note = typeof script.narrative_note === "string" ? script.narrative_note.trim() : "";

  const VALID_SUBTITLE_STYLES: SubtitleStyleId[] = [
    "auto",
    "blood_red",
    "smoky_grey",
    "emerald_phantom",
    "candle_amber",
    "cyan_fluorescent",
  ];
  const VALID_SUBTITLE_ANIMS: SubtitleAnimId[] = [
    "typewriter_fade",
    "word_by_word",
    "smooth_fade",
    "static",
  ];

  const subtitle_style = VALID_SUBTITLE_STYLES.includes(script.subtitle_style)
    ? script.subtitle_style
    : undefined;
  const subtitle_anim = VALID_SUBTITLE_ANIMS.includes(script.subtitle_anim)
    ? script.subtitle_anim
    : undefined;

  // 7. Camera Configuration with Self-Healing (supports single-shot & multi-shot keyframes)
  const sanitizeCameraMotion = (
    rawMot: any,
    defaultStartSec: number,
    defaultEndSec: number
  ): CameraMotionConfig | undefined => {
    if (!rawMot || typeof rawMot !== "object" || !VALID_CAMERA_MOTIONS.includes(rawMot.type)) {
      return undefined;
    }
    const easing: EasingType =
      rawMot.easing === "linear" ||
      rawMot.easing === "ease_in" ||
      rawMot.easing === "ease_out" ||
      rawMot.easing === "ease_in_out"
        ? rawMot.easing
        : "ease_in_out";
    return {
      type: rawMot.type as CameraMotionType,
      endShot: VALID_CAMERA_SHOTS.includes(rawMot.endShot) ? rawMot.endShot : undefined,
      endZoom: typeof rawMot.endZoom === "number" && !isNaN(rawMot.endZoom) ? Math.max(0.5, Math.min(6.0, rawMot.endZoom)) : undefined,
      endPanX: typeof rawMot.endPanX === "number" && !isNaN(rawMot.endPanX) ? rawMot.endPanX : undefined,
      endPanY: typeof rawMot.endPanY === "number" && !isNaN(rawMot.endPanY) ? rawMot.endPanY : undefined,
      endDutchAngle:
        typeof rawMot.endDutchAngle === "number" && !isNaN(rawMot.endDutchAngle)
          ? Math.max(-25, Math.min(25, rawMot.endDutchAngle))
          : undefined,
      startTimeSec:
        typeof rawMot.startTimeSec === "number" && !isNaN(rawMot.startTimeSec)
          ? Math.max(0, Math.min(duration_sec, rawMot.startTimeSec))
          : defaultStartSec,
      endTimeSec:
        typeof rawMot.endTimeSec === "number" && !isNaN(rawMot.endTimeSec)
          ? Math.max(0, Math.min(duration_sec, rawMot.endTimeSec))
          : defaultEndSec,
      easing,
    };
  };

  let camera: DirectorCameraConfig | undefined = undefined;
  if (script.camera && typeof script.camera === "object") {
    const rawCam = script.camera;
    const rawShotValid = VALID_CAMERA_SHOTS.includes(rawCam.shot);
    let shot: CameraShotType = rawShotValid ? rawCam.shot : "wide";
    const target_slot = VALID_SLOTS.includes(rawCam.target_slot) ? rawCam.target_slot : undefined;
    const target_actor_id =
      typeof rawCam.target_actor_id === "string" && rawCam.target_actor_id.trim()
        ? rawCam.target_actor_id.trim()
        : undefined;

    const zoom =
      typeof rawCam.zoom === "number" && !isNaN(rawCam.zoom)
        ? Math.max(0.5, Math.min(6.0, rawCam.zoom))
        : undefined;
    const pan_x = typeof rawCam.pan_x === "number" && !isNaN(rawCam.pan_x) ? rawCam.pan_x : undefined;
    const pan_y = typeof rawCam.pan_y === "number" && !isNaN(rawCam.pan_y) ? rawCam.pan_y : undefined;
    const dutch_angle =
      typeof rawCam.dutch_angle === "number" && !isNaN(rawCam.dutch_angle)
        ? Math.max(-25, Math.min(25, rawCam.dutch_angle))
        : undefined;
    const shake = VALID_CAMERA_SHAKES.includes(rawCam.shake) ? rawCam.shake : undefined;
    const motion = sanitizeCameraMotion(rawCam.motion, 0, duration_sec);

    // Self-heal multi-shot camera keyframes (also gracefully accept `cuts` / `shots` alias from LLM)
    const rawKfList = Array.isArray(rawCam.keyframes)
      ? rawCam.keyframes
      : Array.isArray(rawCam.cuts)
      ? rawCam.cuts
      : Array.isArray(rawCam.shots)
      ? rawCam.shots
      : null;

    let keyframes: CameraKeyframe[] | undefined = undefined;
    if (rawKfList && rawKfList.length > 0) {
      const parsedKfs: CameraKeyframe[] = [];
      const maxStart = Math.max(0, duration_sec - 0.5);

      rawKfList.forEach((rawKf: any, kIdx: number) => {
        if (!rawKf || typeof rawKf !== "object") return;
        const kfShot: CameraShotType = VALID_CAMERA_SHOTS.includes(rawKf.shot) ? rawKf.shot : "wide";
        const rawTime = Number(rawKf.startTimeSec ?? rawKf.timeSec ?? rawKf.start_sec);
        const startTimeSec =
          !isNaN(rawTime)
            ? Math.round(Math.max(0, Math.min(maxStart, rawTime)) * 10) / 10
            : Math.round(((kIdx / rawKfList.length) * duration_sec) * 10) / 10;

        const transition: CameraTransitionType =
          rawKf.transition === "smooth" ? "smooth" : "cut";
        const rawTransDur = Number(rawKf.transitionDurationSec);
        const transitionDurationSec =
          transition === "smooth" && !isNaN(rawTransDur)
            ? Math.max(0.2, Math.min(3.0, Math.round(rawTransDur * 10) / 10))
            : transition === "smooth"
            ? 1.0
            : undefined;
        const kfEasing: EasingType | undefined =
          transition === "smooth"
            ? rawKf.easing === "linear" ||
              rawKf.easing === "ease_in" ||
              rawKf.easing === "ease_out" ||
              rawKf.easing === "ease_in_out"
              ? rawKf.easing
              : "ease_in_out"
            : undefined;

        const kfTargetSlot = VALID_SLOTS.includes(rawKf.target_slot) ? rawKf.target_slot : undefined;
        const kfTargetActorId =
          typeof rawKf.target_actor_id === "string" && rawKf.target_actor_id.trim()
            ? rawKf.target_actor_id.trim()
            : undefined;
        const kfZoom =
          typeof rawKf.zoom === "number" && !isNaN(rawKf.zoom)
            ? Math.max(0.5, Math.min(6.0, rawKf.zoom))
            : undefined;
        const kfPanX = typeof rawKf.pan_x === "number" && !isNaN(rawKf.pan_x) ? rawKf.pan_x : undefined;
        const kfPanY = typeof rawKf.pan_y === "number" && !isNaN(rawKf.pan_y) ? rawKf.pan_y : undefined;
        const kfDutch =
          typeof rawKf.dutch_angle === "number" && !isNaN(rawKf.dutch_angle)
            ? Math.max(-25, Math.min(25, rawKf.dutch_angle))
            : undefined;
        const kfShake = VALID_CAMERA_SHAKES.includes(rawKf.shake) ? rawKf.shake : undefined;

        parsedKfs.push({
          startTimeSec,
          transition,
          ...(transitionDurationSec !== undefined ? { transitionDurationSec } : {}),
          ...(kfEasing ? { easing: kfEasing } : {}),
          shot: kfShot,
          ...(kfTargetSlot ? { target_slot: kfTargetSlot } : {}),
          ...(kfTargetActorId ? { target_actor_id: kfTargetActorId } : {}),
          ...(kfZoom !== undefined ? { zoom: kfZoom } : {}),
          ...(kfPanX !== undefined ? { pan_x: kfPanX } : {}),
          ...(kfPanY !== undefined ? { pan_y: kfPanY } : {}),
          ...(kfDutch !== undefined ? { dutch_angle: kfDutch } : {}),
          ...(kfShake ? { shake: kfShake } : {}),
          ...(rawKf.motion ? { motion: rawKf.motion } : {}),
        });
      });

      if (parsedKfs.length > 0) {
        parsedKfs.sort((a, b) => a.startTimeSec - b.startTimeSec);

        // Guarantee keyframe[0] covers t = 0
        if (parsedKfs[0].startTimeSec > 0.2) {
          parsedKfs[0].startTimeSec = 0;
        } else {
          parsedKfs[0].startTimeSec = 0;
        }

        // Deduplicate overly close timestamps (< 0.4s apart)
        const deduped: CameraKeyframe[] = [];
        for (const kf of parsedKfs) {
          if (deduped.length === 0 || kf.startTimeSec - deduped[deduped.length - 1].startTimeSec >= 0.4) {
            deduped.push(kf);
          }
        }

        // Sanitize nested motion using each keyframe's actual [segStart, segEnd] window
        keyframes = deduped.map((kf, idx) => {
          const segStart = kf.startTimeSec;
          const segEnd = idx < deduped.length - 1 ? deduped[idx + 1].startTimeSec : duration_sec;
          const sanitizedMot = kf.motion ? sanitizeCameraMotion(kf.motion, segStart, segEnd) : undefined;
          return {
            ...kf,
            motion: sanitizedMot,
          };
        });

        // Keep top-level shot synced with first keyframe if top-level shot was not explicitly given
        if (!rawShotValid && keyframes.length > 0) {
          shot = keyframes[0].shot;
        }
      }
    }

    camera = {
      shot,
      target_slot,
      target_actor_id,
      zoom,
      pan_x,
      pan_y,
      dutch_angle,
      shake,
      motion,
      ...(keyframes && keyframes.length > 0 ? { keyframes } : {}),
    };
  }

  const normalized: DirectorSceneScript = {
    scene_id,
    title,
    duration_sec,
    theme,
    weather,
    lighting: {
      sky_preset,
      fog_density,
      thunder_flash,
      ambient_tint,
      weather,
    },
    camera,
    environment_items,
    actors,
    details,
    dialogue,
    subtitle_style,
    subtitle_anim,
    narrative_note,
  };

  return { valid: true, errors: [], normalized };
}
