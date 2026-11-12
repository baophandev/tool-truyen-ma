import type {
  ActorConfig,
  CharacterPoseId,
  EasingType,
  FacingDirection,
} from "./types";
import { getSlotCoordinates } from "./layoutRouter";

export interface Point2D {
  x: number;
  y: number;
}

export interface EvaluatedActorState {
  coords: Point2D;
  pointA: Point2D;
  pointB: Point2D;
  hasMotion: boolean;
  facing: FacingDirection;
  pose: CharacterPoseId;
  isMoving: boolean;
  progress: number;
}

/**
 * Applies normalized progress easing in [0, 1].
 */
export function applyEasing(t: number, easing: EasingType = "ease_in_out"): number {
  const clamped = Math.max(0, Math.min(1, t));
  switch (easing) {
    case "linear":
      return clamped;
    case "ease_in":
      return clamped * clamped;
    case "ease_out":
      return 1 - (1 - clamped) * (1 - clamped);
    case "ease_in_out":
    default:
      return clamped < 0.5
        ? 2 * clamped * clamped
        : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
  }
}

/**
 * Deterministically evaluates an actor's position, facing direction, and active pose
 * at a given playback timestamp (in seconds).
 * When `currentTimeSec` is undefined, returns static Point A state plus resolved Point B anchor.
 */
export function evaluateActorAtTime(
  actor: ActorConfig,
  currentTimeSec?: number,
  sceneDurationSec: number = 6
): EvaluatedActorState {
  const pointA = getSlotCoordinates(actor.slot, actor.offsetX, actor.offsetY);
  const motion = actor.motion;

  if (!motion) {
    return {
      coords: pointA,
      pointA,
      pointB: pointA,
      hasMotion: false,
      facing: actor.facing,
      pose: actor.pose,
      isMoving: false,
      progress: 0,
    };
  }

  const pointB = getSlotCoordinates(
    motion.targetSlot,
    motion.targetOffsetX,
    motion.targetOffsetY
  );

  // Static edit mode (no timeline clock active) -> display actor anchored at Point A
  if (currentTimeSec === undefined) {
    return {
      coords: pointA,
      pointA,
      pointB,
      hasMotion: true,
      facing: actor.facing,
      pose: actor.pose,
      isMoving: false,
      progress: 0,
    };
  }

  const safeDuration = Math.max(0.5, sceneDurationSec);
  const startSec = Math.max(0, Math.min(safeDuration, motion.startTimeSec ?? 0));
  const rawEnd = motion.endTimeSec ?? safeDuration;
  const endSec = Math.max(startSec, Math.min(safeDuration, rawEnd));

  let rawProgress = 0;
  if (endSec <= startSec) {
    rawProgress = currentTimeSec >= startSec ? 1 : 0;
  } else if (currentTimeSec <= startSec) {
    rawProgress = 0;
  } else if (currentTimeSec >= endSec) {
    rawProgress = 1;
  } else {
    rawProgress = (currentTimeSec - startSec) / (endSec - startSec);
  }

  const eased = applyEasing(rawProgress, motion.easing ?? "ease_in_out");
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;

  const coords: Point2D = {
    x: Math.round((pointA.x + dx * eased) * 10) / 10,
    y: Math.round((pointA.y + dy * eased) * 10) / 10,
  };

  const isMoving = rawProgress > 0 && rawProgress < 1 && (Math.abs(dx) > 1 || Math.abs(dy) > 1);
  const hasReachedOrStarted = rawProgress > 0;

  let facing: FacingDirection = actor.facing;
  if (
    motion.autoFaceTarget !== false &&
    hasReachedOrStarted &&
    Math.abs(dx) > 4
  ) {
    facing = dx >= 0 ? "right" : "left";
  }

  const pose: CharacterPoseId =
    isMoving && motion.movingPose ? motion.movingPose : actor.pose;

  return {
    coords,
    pointA,
    pointB,
    hasMotion: true,
    facing,
    pose,
    isMoving,
    progress: eased,
  };
}

