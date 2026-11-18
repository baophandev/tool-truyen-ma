import type {
  ActorConfig,
  CameraKeyframe,
  CameraShakeIntensity,
  CameraShotType,
  DirectorCameraConfig,
} from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y } from "./constants";
import { getSlotCoordinates } from "./layoutRouter";
import { applyEasing, evaluateActorAtTime, type Point2D } from "./motionUtils";

export interface EvaluatedCameraState {
  target: Point2D;
  zoom: number;
  dutchAngle: number;
  shakeOffset: Point2D;
  shakeAngle: number;
  shot: CameraShotType;
  motionProgress: number;
  isMoving: boolean;
  // Multi-shot metadata (populated when camera.keyframes has entries)
  activeShotIndex?: number;
  totalShots?: number;
  // Parallax transform strings ready to inject into SVG <g>
  worldTransform: string;
  skyTransform: string;
  bgTransform: string;
  fgTransform: string;
  // Viewport bounds in world coordinate (for Gizmo / Safe Area Frame)
  viewportBounds: {
    minX: number;
    minY: number;
    width: number;
    height: number;
  };
}

export interface CameraShotPresetInfo {
  name: string;
  description: string;
  defaultZoom: number;
  yOffset: number; // Offset relative to actor ground anchor [Y=800]
  defaultDutch: number;
}

export const CAMERA_SHOT_PRESETS: Record<CameraShotType, CameraShotPresetInfo> = {
  extreme_wide: {
    name: "Đại cảnh (Extreme Wide)",
    description: "Bao quát mênh mông, nhân vật cô độc lọt thỏm giữa không gian kinh hoàng",
    defaultZoom: 0.88,
    yOffset: -160,
    defaultDutch: 0,
  },
  wide: {
    name: "Toàn cảnh (Wide / Master)",
    description: "Khung nhìn tiêu chuẩn toàn bộ sân khấu 1920x1080",
    defaultZoom: 1.0,
    yOffset: 0,
    defaultDutch: 0,
  },
  medium_wide: {
    name: "Trung toàn cảnh (Medium Wide / Cowboy)",
    description: "Đóng khung từ đầu gối lên, thấy rõ nhân vật tương tác với môi trường",
    defaultZoom: 1.45,
    yOffset: -130,
    defaultDutch: 0,
  },
  medium: {
    name: "Trung cảnh (Medium Shot)",
    description: "Đóng khung từ thắt lưng lên, tập trung vào cử chỉ tay, vũ khí, bùa chú",
    defaultZoom: 1.9,
    yOffset: -175,
    defaultDutch: 0,
  },
  close_up: {
    name: "Cận cảnh (Close-Up)",
    description: "Đóng khung từ ngực lên đỉnh đầu, thấy rõ biểu cảm kinh hoàng, chớp mắt, há hốc",
    defaultZoom: 2.85,
    yOffset: -235,
    defaultDutch: 0,
  },
  extreme_close_up: {
    name: "Đặc tả (Extreme Close-Up)",
    description: "Tập trung tối đa vào đôi mắt rỉ máu, nụ cười quái đản, hoặc mũi dao găm",
    defaultZoom: 4.3,
    yOffset: -250,
    defaultDutch: 0,
  },
  dutch_tilt: {
    name: "Góc nghiêng ma mị (Dutch Angle)",
    description: "Ống kính nghiêng tạo cảm giác điên loạn, bất an, tà khí bóp méo không gian",
    defaultZoom: 1.6,
    yOffset: -140,
    defaultDutch: -7.5,
  },
};

export const SHAKE_AMPLITUDES: Record<CameraShakeIntensity, number> = {
  none: 0,
  subtle_handheld: 1.5,
  creepy_tremor: 5.0,
  heavy_jumpscare: 18.0,
};

/**
 * Computes deterministic multi-frequency harmonic shake offset and rotation.
 * - 'none': Completely stable, zero jitter (default).
 * - 'subtle_handheld': Slow organic handheld breathing sway (~0.3-0.7 Hz), no high-frequency jitter.
 * - 'creepy_tremor': Eerie shivering tremor (~2-4 Hz).
 * - 'heavy_jumpscare': Violent shock impact / earthquake tremor (~5-8 Hz).
 */
export function generateCameraShake(
  intensity: CameraShakeIntensity = "none",
  timeSec: number = 0
): { offset: Point2D; angle: number } {
  const amp = SHAKE_AMPLITUDES[intensity] || 0;
  if (amp <= 0) {
    return { offset: { x: 0, y: 0 }, angle: 0 };
  }

  const t = timeSec;

  if (intensity === "subtle_handheld") {
    // Smooth, organic handheld breathing drift - never rapid mechanical vibration
    const dx = amp * (Math.sin(t * 2.1) * 0.7 + Math.sin(t * 4.3) * 0.3);
    const dy = amp * (Math.cos(t * 1.8) * 0.7 + Math.cos(t * 3.6) * 0.3);
    const dAngle = amp * 0.04 * Math.sin(t * 1.4);
    return { offset: { x: dx, y: dy }, angle: dAngle };
  }

  if (intensity === "creepy_tremor") {
    // Eerie cold shiver / ghostly tremor
    const dx = amp * (Math.sin(t * 11.2) * 0.6 + Math.sin(t * 19.5) * 0.4);
    const dy = amp * (Math.cos(t * 13.4) * 0.6 + Math.cos(t * 22.1) * 0.4);
    const dAngle = amp * 0.05 * Math.sin(t * 9.8);
    return { offset: { x: dx, y: dy }, angle: dAngle };
  }

  // Heavy jumpscare / earthquake shock: high-energy multi-frequency impact
  const dx = amp * (Math.sin(t * 19.3) * 0.65 + Math.sin(t * 37.7) * 0.35);
  const dy = amp * (Math.cos(t * 23.1) * 0.65 + Math.cos(t * 43.9) * 0.35);
  const dAngle = amp * 0.075 * Math.sin(t * 16.5);

  return {
    offset: { x: dx, y: dy },
    angle: dAngle,
  };
}

/**
 * Clamps target point to ensure camera frame stays comfortably within cinematic boundaries.
 */
export function clampCameraFocus(
  target: Point2D,
  zoom: number,
  margin = 40
): Point2D {
  const safeZoom = Math.max(0.5, Math.min(6.0, zoom));
  const halfW = (CANVAS_WIDTH / safeZoom) / 2;
  const halfH = (CANVAS_HEIGHT / safeZoom) / 2;

  // With environments overscan extended to [-400, 2320], we allow generous focus coverage
  // while safely preventing off-screen runaway panning
  const minX = Math.min(margin + halfW * 0.35, 960);
  const maxX = Math.max(CANVAS_WIDTH - margin - halfW * 0.35, 960);
  const minY = Math.min(margin + halfH * 0.35, 540);
  const maxY = Math.max(CANVAS_HEIGHT - margin - halfH * 0.35, 540);

  return {
    x: Math.max(minX, Math.min(maxX, target.x)),
    y: Math.max(minY, Math.min(maxY, target.y)),
  };
}

/**
 * Resolves static focus center point in world coordinate for a given camera config.
 */
export function resolveTargetPoint(
  cameraConfig: DirectorCameraConfig | undefined,
  actors: ActorConfig[] = [],
  currentTimeSec?: number,
  durationSec: number = 6
): Point2D {
  const shot = cameraConfig?.shot || "wide";
  const preset = CAMERA_SHOT_PRESETS[shot] || CAMERA_SHOT_PRESETS.wide;
  const panX = cameraConfig?.pan_x || 0;
  const panY = cameraConfig?.pan_y || 0;

  // 1. Target by Specific Actor (Dynamic Tracking)
  if (cameraConfig?.target_actor_id) {
    const actor = actors.find((a) => a.id === cameraConfig.target_actor_id);
    if (actor) {
      const evaluated = evaluateActorAtTime(actor, currentTimeSec, durationSec);
      return {
        x: evaluated.coords.x + panX,
        y: evaluated.coords.y + preset.yOffset + panY,
      };
    }
  }

  // 2. Target by Specific Slot
  if (cameraConfig?.target_slot) {
    const slotCoords = getSlotCoordinates(cameraConfig.target_slot);
    return {
      x: slotCoords.x + panX,
      y: slotCoords.y + preset.yOffset + panY,
    };
  }

  // 3. Fallback: If close-up/medium shot but no target specified, lock to first actor
  if ((shot === "close_up" || shot === "extreme_close_up" || shot === "medium") && actors.length > 0) {
    const firstActor = actors[0];
    const evaluated = evaluateActorAtTime(firstActor, currentTimeSec, durationSec);
    return {
      x: evaluated.coords.x + panX,
      y: evaluated.coords.y + preset.yOffset + panY,
    };
  }

  // 4. Default: World Viewport Center (960, 540)
  return {
    x: CANVAS_WIDTH / 2 + panX,
    y: (shot === "wide" ? CANVAS_HEIGHT / 2 : GROUND_Y + preset.yOffset) + panY,
  };
}

/**
 * Standard alias for resolveTargetPoint
 */
export const resolveCameraFocus = resolveTargetPoint;

/**
 * Builds SVG transform string with screen center pivot (960, 540) and parallax damping.
 */
export function buildLayerTransform(
  target: Point2D,
  zoom: number,
  dutchAngle: number,
  shakeOffset: Point2D,
  shakeAngle: number,
  parallaxFactor: number = 1.0
): string {
  const cx = CANVAS_WIDTH / 2;
  const cy = CANVAS_HEIGHT / 2;

  // Parallax shifts target relative to center
  const effTargetX = cx + (target.x - cx) * parallaxFactor;
  const effTargetY = cy + (target.y - cy) * parallaxFactor;

  // Parallax also softly scales zoom (distant skies zoom less)
  const effZoom = 1 + (zoom - 1) * Math.min(1.0, parallaxFactor * 1.1);

  const finalDutch = dutchAngle + shakeAngle * parallaxFactor;
  const finalShakeX = shakeOffset.x * parallaxFactor;
  const finalShakeY = shakeOffset.y * parallaxFactor;

  return `translate(${cx + finalShakeX}, ${cy + finalShakeY}) rotate(${finalDutch}) scale(${effZoom}) translate(${-effTargetX}, ${-effTargetY})`;
}

/**
 * Standard alias for buildLayerTransform
 */
export const getCameraTransformMatrix = buildLayerTransform;

interface SingleShotEval {
  target: Point2D;
  zoom: number;
  dutchAngle: number;
  shot: CameraShotType;
  shake: CameraShakeIntensity;
  motionProgress: number;
  isMoving: boolean;
}

/**
 * Evaluates a single shot config (either a standalone DirectorCameraConfig or one CameraKeyframe)
 * within the time window [windowStartSec, windowEndSec].
 */
function evaluateSingleShot(
  shotConfig: DirectorCameraConfig | CameraKeyframe | undefined,
  actors: ActorConfig[],
  currentTimeSec: number | undefined,
  sceneDurationSec: number,
  windowStartSec: number,
  windowEndSec: number,
  fallbackShake?: CameraShakeIntensity
): SingleShotEval {
  const shot = shotConfig?.shot || "wide";
  const preset = CAMERA_SHOT_PRESETS[shot] || CAMERA_SHOT_PRESETS.wide;

  const baseZoom = shotConfig?.zoom ?? preset.defaultZoom;
  const baseDutch = shotConfig?.dutch_angle ?? preset.defaultDutch;
  const baseTarget = resolveTargetPoint(shotConfig, actors, currentTimeSec, sceneDurationSec);

  const motion = shotConfig?.motion;
  const currentTime = currentTimeSec ?? 0;

  let currentTarget = { ...baseTarget };
  let currentZoom = baseZoom;
  let currentDutch = baseDutch;
  let motionProgress = 0;
  let isMoving = false;

  if (motion && motion.type !== "static") {
    const defaultStart = windowStartSec;
    const defaultEnd = Math.max(windowStartSec, windowEndSec);
    const startSec = Math.max(0, Math.min(sceneDurationSec, motion.startTimeSec ?? defaultStart));
    const rawEnd = motion.endTimeSec ?? defaultEnd;
    const endSec = Math.max(startSec, Math.min(sceneDurationSec, rawEnd));

    let rawProgress = 0;
    if (endSec <= startSec) {
      rawProgress = currentTime >= startSec ? 1 : 0;
    } else if (currentTime <= startSec) {
      rawProgress = 0;
    } else if (currentTime >= endSec) {
      rawProgress = 1;
    } else {
      rawProgress = (currentTime - startSec) / (endSec - startSec);
    }

    const easedProgress = applyEasing(rawProgress, motion.easing ?? "ease_in_out");
    motionProgress = easedProgress;
    isMoving = rawProgress > 0 && rawProgress < 1;

    // Target end state evaluation
    let endZoom = motion.endZoom;
    if (endZoom === undefined && motion.endShot) {
      endZoom = CAMERA_SHOT_PRESETS[motion.endShot]?.defaultZoom;
    }

    const endDutch = motion.endDutchAngle ?? baseDutch;

    switch (motion.type) {
      case "push_in": {
        const targetZoom = endZoom ?? Math.min(4.5, baseZoom * 1.6);
        currentZoom = baseZoom + (targetZoom - baseZoom) * easedProgress;
        break;
      }
      case "pull_out": {
        const targetZoom = endZoom ?? Math.max(0.9, baseZoom * 0.65);
        currentZoom = baseZoom + (targetZoom - baseZoom) * easedProgress;
        break;
      }
      case "pan_left": {
        const deltaX = motion.endPanX ?? -320;
        currentTarget.x = baseTarget.x + deltaX * easedProgress;
        break;
      }
      case "pan_right": {
        const deltaX = motion.endPanX ?? 320;
        currentTarget.x = baseTarget.x + deltaX * easedProgress;
        break;
      }
      case "tilt_up": {
        const deltaY = motion.endPanY ?? -220;
        currentTarget.y = baseTarget.y + deltaY * easedProgress;
        break;
      }
      case "tilt_down": {
        const deltaY = motion.endPanY ?? 220;
        currentTarget.y = baseTarget.y + deltaY * easedProgress;
        break;
      }
      case "follow_actor": {
        // Dynamic actor tracking is automatically evaluated at currentTime inside resolveTargetPoint
        if (endZoom !== undefined) {
          currentZoom = baseZoom + (endZoom - baseZoom) * easedProgress;
        }
        break;
      }
    }

    if (endDutch !== baseDutch) {
      currentDutch = baseDutch + (endDutch - baseDutch) * easedProgress;
    }
  }

  return {
    target: currentTarget,
    zoom: currentZoom,
    dutchAngle: currentDutch,
    shot,
    shake: shotConfig?.shake ?? fallbackShake ?? "none",
    motionProgress,
    isMoving,
  };
}

/**
 * Computes the full evaluated camera state at a given playback timestamp.
 * Supports both classic single-shot DirectorCameraConfig and Multi-Shot camera.keyframes timelines.
 */
export function evaluateCameraAtTime(
  cameraConfig: DirectorCameraConfig | undefined,
  actors: ActorConfig[] = [],
  currentTimeSec?: number,
  durationSec: number = 6
): EvaluatedCameraState {
  const safeDuration = Math.max(0.5, durationSec);
  const currentTime = currentTimeSec ?? 0;

  let evalState: SingleShotEval;
  let activeShotIndex: number | undefined;
  let totalShots: number | undefined;

  const rawKeyframes = cameraConfig?.keyframes;
  if (rawKeyframes && rawKeyframes.length > 0) {
    const sorted = [...rawKeyframes].sort((a, b) => a.startTimeSec - b.startTimeSec);
    totalShots = sorted.length;

    // Locate the active keyframe at currentTime
    let idx = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (currentTime >= sorted[i].startTimeSec) {
        idx = i;
      } else {
        break;
      }
    }
    activeShotIndex = idx;

    const activeKf = sorted[idx];
    const segStart = Math.max(0, activeKf.startTimeSec);
    const segEnd = idx < sorted.length - 1 ? Math.max(segStart, sorted[idx + 1].startTimeSec) : safeDuration;

    const currentEval = evaluateSingleShot(
      activeKf,
      actors,
      currentTimeSec,
      safeDuration,
      segStart,
      segEnd,
      cameraConfig?.shake
    );

    // Smooth camera transition from previous keyframe when transition === "smooth"
    if (idx > 0 && activeKf.transition === "smooth") {
      const transDur = Math.max(0.15, Math.min(activeKf.transitionDurationSec ?? 1.0, Math.max(0.15, segEnd - segStart)));
      const elapsed = currentTime - segStart;

      if (elapsed >= 0 && elapsed < transDur) {
        const prevKf = sorted[idx - 1];
        const prevStart = Math.max(0, prevKf.startTimeSec);
        const prevEval = evaluateSingleShot(
          prevKf,
          actors,
          segStart,
          safeDuration,
          prevStart,
          segStart,
          cameraConfig?.shake
        );

        const t = applyEasing(elapsed / transDur, activeKf.easing ?? "ease_in_out");
        evalState = {
          target: {
            x: prevEval.target.x + (currentEval.target.x - prevEval.target.x) * t,
            y: prevEval.target.y + (currentEval.target.y - prevEval.target.y) * t,
          },
          zoom: prevEval.zoom + (currentEval.zoom - prevEval.zoom) * t,
          dutchAngle: prevEval.dutchAngle + (currentEval.dutchAngle - prevEval.dutchAngle) * t,
          shot: t >= 0.5 ? currentEval.shot : prevEval.shot,
          shake: t >= 0.5 ? currentEval.shake : prevEval.shake,
          motionProgress: t,
          isMoving: true,
        };
      } else {
        evalState = currentEval;
      }
    } else {
      evalState = currentEval;
    }
  } else {
    evalState = evaluateSingleShot(
      cameraConfig,
      actors,
      currentTimeSec,
      safeDuration,
      0,
      safeDuration
    );
  }

  // Clamping focus point within safe cinematic margins
  const currentTarget = clampCameraFocus(evalState.target, evalState.zoom);
  const currentZoom = evalState.zoom;
  const currentDutch = evalState.dutchAngle;

  // Camera Shake calculation
  const shake = generateCameraShake(evalState.shake, currentTimeSec);

  // Parallax layer transforms
  // Parallax factors:
  // Sky: 0.15 (distant celestial bodies drift very subtly)
  // Background: 0.45 (distant mountains / bamboo groves)
  // World: 1.0 (main ground line, structures, actors, details)
  // Foreground: 1.35 (fog waves, creeping branches move faster)
  const skyTransform = buildLayerTransform(currentTarget, currentZoom, currentDutch, shake.offset, shake.angle, 0.15);
  const bgTransform = buildLayerTransform(currentTarget, currentZoom, currentDutch, shake.offset, shake.angle, 0.45);
  const worldTransform = buildLayerTransform(currentTarget, currentZoom, currentDutch, shake.offset, shake.angle, 1.0);
  const fgTransform = buildLayerTransform(currentTarget, currentZoom, currentDutch, shake.offset, shake.angle, 1.35);

  // Viewport bounds in world coordinate system
  const vpWidth = CANVAS_WIDTH / Math.max(0.1, currentZoom);
  const vpHeight = CANVAS_HEIGHT / Math.max(0.1, currentZoom);
  const viewportBounds = {
    minX: currentTarget.x - vpWidth / 2,
    minY: currentTarget.y - vpHeight / 2,
    width: vpWidth,
    height: vpHeight,
  };

  return {
    target: currentTarget,
    zoom: currentZoom,
    dutchAngle: currentDutch,
    shakeOffset: shake.offset,
    shakeAngle: shake.angle,
    shot: evalState.shot,
    motionProgress: evalState.motionProgress,
    isMoving: evalState.isMoving,
    activeShotIndex,
    totalShots,
    worldTransform,
    skyTransform,
    bgTransform,
    fgTransform,
    viewportBounds,
  };
}
