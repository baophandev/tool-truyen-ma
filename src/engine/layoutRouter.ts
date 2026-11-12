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
  StructureId,
  ThemeId,
  SkyPresetId,
} from "./types";
import {
  DETAIL_RULES,
  STRUCTURE_RULES,
  getAllowedSlotsForActor,
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
    case "male_adult":
    default:
      return "outfit_tattered_tunic";
  }
}

const VALID_THEMES: ThemeId[] = ["rural_graveyard", "abandoned_village", "cursed_swamp"];
const VALID_SKY_PRESETS: SkyPresetId[] = ["blood_moon", "foggy_night", "stormy_dark", "eclipse_abyss"];
const VALID_STRUCTURES: StructureId[] = [
  "creepy_banyan_tree",
  "ancient_tomb",
  "dilapidated_hut",
  "abandoned_shrine",
  "broken_wooden_bridge",
  "scarecrow_of_the_damned",
  "creepy_well",
  "haunted_gallows_tree",
];
const VALID_BASES: CharacterBaseId[] = [
  "male_adult",
  "female_adult",
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
];
const VALID_FACES: CharacterFaceId[] = [
  "face_calm",
  "face_scared",
  "face_creepy_smile",
  "face_bleeding_eyes",
  "face_faceless",
  "face_glowing_hollow",
  "face_talisman_covered",
];
const VALID_POSES: CharacterPoseId[] = [
  "pose_standing",
  "pose_shivering",
  "pose_walking",
  "pose_floating",
  "pose_crawling",
  "pose_reaching",
  "pose_hanging",
];
const VALID_DETAILS: DetailId[] = [
  "detail_black_crow",
  "detail_will_o_wisp",
  "detail_blood_lantern",
  "detail_incense_bowl",
  "detail_skull_pile",
  "detail_hanging_talisman",
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
 * Rigorous validator for DirectorSceneScript JSON emitted by Gemini LLM
 */
export function validateDirectorScript(script: any): { valid: boolean; errors: string[]; normalized?: DirectorSceneScript } {
  const errors: string[] = [];

  if (!script || typeof script !== "object") {
    return { valid: false, errors: ["Script phải là một JSON Object hợp lệ"] };
  }

  if (!script.scene_id || typeof script.scene_id !== "string") {
    errors.push('Thiếu trường "scene_id" (string)');
  }

  if (!VALID_THEMES.includes(script.theme)) {
    errors.push(`theme "${script.theme}" không hợp lệ. Phải là: ${VALID_THEMES.join(" | ")}`);
  }

  if (!script.lighting || typeof script.lighting !== "object") {
    errors.push('Thiếu khối "lighting"');
  } else {
    if (!VALID_SKY_PRESETS.includes(script.lighting.sky_preset)) {
      errors.push(`lighting.sky_preset "${script.lighting.sky_preset}" không hợp lệ. Phải là: ${VALID_SKY_PRESETS.join(" | ")}`);
    }
    const fog = Number(script.lighting.fog_density);
    if (isNaN(fog) || fog < 0 || fog > 1) {
      errors.push('lighting.fog_density phải là số thực từ 0.0 đến 1.0');
    }
  }

  if (!Array.isArray(script.environment_items)) {
    errors.push('environment_items phải là mảng Array');
  } else {
    script.environment_items.forEach((item: any, idx: number) => {
      if (!VALID_STRUCTURES.includes(item.asset_id)) {
        errors.push(`environment_items[${idx}].asset_id "${item.asset_id}" không hợp lệ`);
      } else if (!isSlotAllowed(item.slot, STRUCTURE_RULES[item.asset_id as StructureId].allowedSlots)) {
        errors.push(
          `environment_items[${idx}].slot "${item.slot}" không hợp lệ cho "${item.asset_id}". Cho phép: ${STRUCTURE_RULES[item.asset_id as StructureId].allowedSlots.join(" | ")}`
        );
      } else if (!["far_left", "mid_left", "center", "mid_right", "far_right"].includes(item.slot)) {
        errors.push(`environment_items[${idx}].slot "${item.slot}" không phải là GroundSlot hợp lệ`);
      }
    });
  }

  if (!Array.isArray(script.actors)) {
    errors.push('actors phải là mảng Array');
  } else {
    script.actors.forEach((actor: any, idx: number) => {
      if (!actor.id) errors.push(`actors[${idx}] thiếu id`);
      if (!VALID_BASES.includes(actor.base)) errors.push(`actors[${idx}].base "${actor.base}" không hợp lệ`);
      if (actor.costume && !VALID_COSTUMES.includes(actor.costume)) {
        errors.push(`actors[${idx}].costume "${actor.costume}" không hợp lệ`);
      }
      if (!VALID_FACES.includes(actor.face)) errors.push(`actors[${idx}].face "${actor.face}" không hợp lệ`);
      if (!VALID_POSES.includes(actor.pose)) errors.push(`actors[${idx}].pose "${actor.pose}" không hợp lệ`);
      if (!VALID_FACINGS.includes(actor.facing)) errors.push(`actors[${idx}].facing "${actor.facing}" không hợp lệ (chỉ nhận "left" hoặc "right")`);
      if (!VALID_SLOTS.includes(actor.slot)) {
        errors.push(`actors[${idx}].slot "${actor.slot}" không hợp lệ`);
      } else if (VALID_BASES.includes(actor.base) && VALID_POSES.includes(actor.pose)) {
        const actorRule = getAllowedSlotsForActor({ base: actor.base, pose: actor.pose });
        if (!isSlotAllowed(actor.slot, actorRule.allowedSlots)) {
          errors.push(
            `actors[${idx}].slot "${actor.slot}" không phù hợp với pose "${actor.pose}". Cho phép: ${actorRule.allowedSlots.join(" | ")}`
          );
        }
        if (actor.motion !== undefined) {
          if (!actor.motion || typeof actor.motion !== "object") {
            errors.push(`actors[${idx}].motion phải là một Object hợp lệ`);
          } else {
            if (!VALID_SLOTS.includes(actor.motion.targetSlot)) {
              errors.push(`actors[${idx}].motion.targetSlot "${actor.motion.targetSlot}" không hợp lệ`);
            } else if (!isSlotAllowed(actor.motion.targetSlot, actorRule.allowedSlots)) {
              errors.push(
                `actors[${idx}].motion.targetSlot "${actor.motion.targetSlot}" không phù hợp quy tắc vùng của pose "${actor.pose}". Cho phép: ${actorRule.allowedSlots.join(" | ")}`
              );
            }
            if (
              actor.motion.easing !== undefined &&
              !["linear", "ease_in_out", "ease_in", "ease_out"].includes(actor.motion.easing)
            ) {
              errors.push(`actors[${idx}].motion.easing "${actor.motion.easing}" không hợp lệ`);
            }
            if (actor.motion.movingPose !== undefined && !VALID_POSES.includes(actor.motion.movingPose)) {
              errors.push(`actors[${idx}].motion.movingPose "${actor.motion.movingPose}" không hợp lệ`);
            }
          }
        }
      }
    });
  }

  if (script.details !== undefined) {
    if (!Array.isArray(script.details)) {
      errors.push('details phải là mảng Array nếu được khai báo');
    } else {
      script.details.forEach((detail: any, idx: number) => {
        if (!detail.id) errors.push(`details[${idx}] thiếu id`);
        if (!VALID_DETAILS.includes(detail.asset_id)) {
          errors.push(`details[${idx}].asset_id "${detail.asset_id}" không hợp lệ`);
        } else if (!VALID_SLOTS.includes(detail.slot)) {
          errors.push(`details[${idx}].slot "${detail.slot}" không hợp lệ`);
        } else if (!isSlotAllowed(detail.slot, DETAIL_RULES[detail.asset_id as DetailId].allowedSlots)) {
          errors.push(
            `details[${idx}].slot "${detail.slot}" không được phép cho "${detail.asset_id}". Cho phép: ${DETAIL_RULES[detail.asset_id as DetailId].allowedSlots.join(" | ")}`
          );
        }
      });
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const normalized: DirectorSceneScript = {
    scene_id: script.scene_id,
    title: script.title || "Cảnh Không Tên",
    duration_sec: script.duration_sec || 5,
    theme: script.theme,
    lighting: {
      sky_preset: script.lighting.sky_preset,
      fog_density: Math.min(1, Math.max(0, Number(script.lighting.fog_density))),
      ambient_tint: script.lighting.ambient_tint,
      thunder_flash: Boolean(script.lighting.thunder_flash),
    },
    environment_items: script.environment_items.map((it: any) => ({
      asset_id: it.asset_id,
      slot: it.slot,
      offsetX: Number(it.offsetX) || 0,
      offsetY: Number(it.offsetY) || 0,
      scale: Number(it.scale) || 1,
    })),
    actors: script.actors.map((ac: any) => ({
      id: ac.id,
      base: ac.base,
      costume: ac.costume || getDefaultCostumeForBase(ac.base),
      face: ac.face,
      pose: ac.pose,
      facing: ac.facing,
      slot: ac.slot,
      offsetX: Number(ac.offsetX) || 0,
      offsetY: Number(ac.offsetY) || 0,
      scale: Number(ac.scale) || 1,
      opacity: ac.opacity !== undefined ? Number(ac.opacity) : 1,
      ...(ac.motion
        ? {
            motion: {
              targetSlot: ac.motion.targetSlot,
              targetOffsetX: Number(ac.motion.targetOffsetX) || 0,
              targetOffsetY:
                ac.pose === "pose_floating" || ac.pose === "pose_hanging"
                  ? Number(ac.motion.targetOffsetY) || 0
                  : 0,
              startTimeSec:
                ac.motion.startTimeSec !== undefined
                  ? Math.max(0, Number(ac.motion.startTimeSec) || 0)
                  : 0,
              endTimeSec:
                ac.motion.endTimeSec !== undefined
                  ? Math.max(0, Number(ac.motion.endTimeSec))
                  : undefined,
              easing: ac.motion.easing || "ease_in_out",
              autoFaceTarget: ac.motion.autoFaceTarget !== false,
              movingPose: ac.motion.movingPose,
            },
          }
        : {}),
    })),
    details: Array.isArray(script.details)
      ? script.details.map((dt: any, idx: number) => ({
          id: dt.id || `detail_${idx + 1}`,
          asset_id: dt.asset_id,
          slot: dt.slot,
          offsetX: Number(dt.offsetX) || 0,
          offsetY: Number(dt.offsetY) || 0,
          scale: Number(dt.scale) || 1,
        }))
      : [],
    dialogue: script.dialogue || "",
    narrative_note: script.narrative_note || "",
  };

  return { valid: true, errors: [], normalized };
}
