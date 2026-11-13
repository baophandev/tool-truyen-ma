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
  StructureId,
  ThemeId,
  SkyPresetId,
} from "./types";
import {
  DETAIL_RULES,
  STRUCTURE_RULES,
  getAllowedSlotsForActor,
  findNearestAllowedSlot,
  isAirPose,
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

const VALID_THEMES: ThemeId[] = ["rural_graveyard", "abandoned_village", "cursed_swamp", "modern_indoor"];
const VALID_SKY_PRESETS: SkyPresetId[] = [
  "blood_moon",
  "foggy_night",
  "stormy_dark",
  "eclipse_abyss",
  "flickering_fluorescent",
  "dim_indoor_night",
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
];
const VALID_FACES: CharacterFaceId[] = [
  "face_calm",
  "face_scared",
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
];
const VALID_POSES: CharacterPoseId[] = [
  "pose_standing",
  "pose_shivering",
  "pose_walking",
  "pose_floating",
  "pose_crawling",
  "pose_reaching",
  "pose_hanging",
  "pose_holding",
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
    : (theme === "modern_indoor" ? "flickering_fluorescent" : "foggy_night");

  const rawFog = Number(lightingRaw.fog_density);
  const fog_density = !isNaN(rawFog) ? Math.min(1, Math.max(0, rawFog)) : 0.65;
  const thunder_flash = Boolean(lightingRaw.thunder_flash);
  const ambient_tint = lightingRaw.ambient_tint;

  // 4. Environment Items (Structures)
  const environment_items: DirectorSceneScript["environment_items"] = [];
  if (Array.isArray(script.environment_items)) {
    script.environment_items.forEach((item: any) => {
      if (!item || typeof item !== "object") return;
      if (!VALID_STRUCTURES.includes(item.asset_id)) return;

      const structId = item.asset_id as StructureId;
      const rule = STRUCTURE_RULES[structId];
      let slot: GroundSlotId = item.slot;
      if (!rule.allowedSlots.includes(slot)) {
        slot = rule.allowedSlots[0] || "center";
      }

      environment_items.push({
        asset_id: structId,
        slot,
        offsetX: Number(item.offsetX) || 0,
        offsetY: Number(item.offsetY) || 0,
        scale: Number(item.scale) || 1,
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
    const costume: CostumeId = VALID_COSTUMES.includes(actor.costume)
      ? actor.costume
      : getDefaultCostumeForBase(base);
    const face: CharacterFaceId = VALID_FACES.includes(actor.face) ? actor.face : "face_calm";
    const pose: CharacterPoseId = VALID_POSES.includes(actor.pose) ? actor.pose : "pose_standing";

    const actorRule = getAllowedSlotsForActor({ base, pose });

    // Slot healing: ensure slot matches pose allowed area
    let slot: SlotId = actor.slot;
    if (!VALID_SLOTS.includes(slot) || !isSlotAllowed(slot, actorRule.allowedSlots)) {
      const fallbackInitialSlot = isAirPose(pose) ? "air_center" : "center";
      const curCoord = getSlotCoordinates(VALID_SLOTS.includes(slot) ? slot : fallbackInitialSlot);
      const nearest = findNearestAllowedSlot(curCoord.x, curCoord.y, actorRule.allowedSlots);
      slot = nearest.slot.id;
    }

    const offsetX = Number(actor.offsetX) || 0;
    const offsetY = isAirPose(pose) ? (Number(actor.offsetY) || 0) : 0;
    const scale = Number(actor.scale) || 1;
    const opacity = actor.opacity !== undefined ? Math.min(1, Math.max(0, Number(actor.opacity))) : 1;

    const heldItem: HeldItemId = VALID_HELD_ITEMS.includes(actor.heldItem) ? actor.heldItem : "none";
    const heldHand: HeldHand = VALID_HELD_HANDS.includes(actor.heldHand) ? actor.heldHand : "right";

    // Motion healing: drop motion if null, false, empty object, or invalid
    let motion: DirectorSceneScript["actors"][0]["motion"] = undefined;
    const rawMotion = actor.motion;
    if (
      rawMotion &&
      typeof rawMotion === "object" &&
      rawMotion !== null &&
      !Array.isArray(rawMotion) &&
      rawMotion.targetSlot &&
      VALID_SLOTS.includes(rawMotion.targetSlot) &&
      rawMotion.targetSlot !== slot
    ) {
      let targetSlot: SlotId = rawMotion.targetSlot;
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

      const targetOffsetX = Number(rawMotion.targetOffsetX) || 0;
      const targetOffsetY = isAirPose(pose) ? (Number(rawMotion.targetOffsetY) || 0) : 0;

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
      base,
      costume,
      face,
      pose,
      facing,
      slot,
      offsetX,
      offsetY,
      scale,
      opacity,
      heldItem,
      heldHand,
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
      let slot: SlotId = dt.slot;
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

  const normalized: DirectorSceneScript = {
    scene_id,
    title,
    duration_sec,
    theme,
    lighting: {
      sky_preset,
      fog_density,
      thunder_flash,
      ambient_tint,
    },
    environment_items,
    actors,
    details,
    dialogue,
    narrative_note,
  };

  return { valid: true, errors: [], normalized };
}
