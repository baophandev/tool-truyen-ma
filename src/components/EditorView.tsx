import React, { useState, useEffect } from "react";
import type {
  DirectorSceneScript,
  SlotId,
  GroundSlotId,
  CharacterBaseId,
  CostumeId,
  CharacterFaceId,
  CharacterPoseId,
  StructureId,
  DetailId,
  ThemeId,
  SkyPresetId,
  ActorConfig,
  ActorMotionConfig,
  EasingType,
  HeldItemId,
  HeldHand,
  EnvironmentItemConfig,
  DetailItemConfig,
  SelectedEntity,
} from "../engine/types";
import { SceneRenderer, type DragSnapMode } from "../engine/SceneRenderer";
import { ALL_SLOTS, GROUND_Y } from "../engine/constants";
import { HELD_ITEM_CATALOG } from "../engine/graphics/HandheldItems";
import { getDefaultCostumeForBase, getSlotCoordinates } from "../engine/layoutRouter";
import {
  loadStoredNamedEnvironments,
  applyEnvironmentToScene,
} from "../engine/environmentPresets";
import {
  STRUCTURE_RULES,
  DETAIL_RULES,
  coordsToSlotAssignment,
  findNearestAllowedSlot,
  findOpenGroundX,
  getAllowedSlotsForActor,
  getAllowedSlotsForDetail,
  getAllowedSlotsForStructure,
  getSlotType,
  isAirPose,
  isSlotAllowed,
  supportsContinuousGroundPlacement,
} from "../engine/placementRules";
import {
  Sliders,
  User,
  Trees,
  Sparkles,
  CloudMoon,
  Plus,
  Trash2,
  RotateCcw,
  Eye,
  Type,
  Lock,
  CheckCircle2,
  Magnet,
  Play,
  Pause,
  ArrowRight,
  Compass,
} from "lucide-react";

interface EditorViewProps {
  scene: DirectorSceneScript;
  onChangeScene: (updated: DirectorSceneScript) => void;
  onResetScene: () => void;
  onOpenAiDirector?: (mode?: "description_film" | "environments_manager" | "re_direct_scene" | "full_film" | "append_scene") => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  scene,
  onChangeScene,
  onResetScene,
  onOpenAiDirector,
}) => {
  const [activeTab, setActiveTab] = useState<"actors" | "structures" | "details" | "lighting" | "story">("actors");
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>(() => {
    if (scene.actors.length > 0) return { type: "actor", id: scene.actors[0].id };
    if (scene.environment_items.length > 0) return { type: "structure", index: 0 };
    if (scene.details && scene.details.length > 0) return { type: "detail", id: scene.details[0].id };
    return null;
  });
  const [activeMotionHandle, setActiveMotionHandle] = useState<"start" | "target">("start");
  const [previewTime, setPreviewTime] = useState<number | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [selectedActorId, setSelectedActorId] = useState<string | null>(
    scene.actors.length > 0 ? scene.actors[0].id : null
  );
  const [selectedStructureIdx, setSelectedStructureIdx] = useState<number>(0);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(
    scene.details && scene.details.length > 0 ? scene.details[0].id : null
  );
  const [showGizmo, setShowGizmo] = useState<boolean>(true);
  const [dragSnapMode, setDragSnapMode] = useState<DragSnapMode>("allowed_offset");

  const sceneDetails = scene.details || [];

  // Re-sync selection cleanly when switching between scenes in the timeline
  useEffect(() => {
    const firstActorId = scene.actors[0]?.id ?? null;
    const firstDetailId = scene.details?.[0]?.id ?? null;
    setSelectedActorId(firstActorId);
    setSelectedStructureIdx(0);
    setSelectedDetailId(firstDetailId);

    if (firstActorId) {
      setSelectedEntity({ type: "actor", id: firstActorId });
    } else if (scene.environment_items.length > 0) {
      setSelectedEntity({ type: "structure", index: 0 });
    } else if (firstDetailId) {
      setSelectedEntity({ type: "detail", id: firstDetailId });
    } else {
      setSelectedEntity(null);
    }
    // Only reset selection when active scene_id changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.scene_id]);

  const sceneDuration = scene.duration_sec || 6;

  // Update Scene Duration (clamps [1, 60] seconds and keeps actor motion keyframes within bounds)
  const updateSceneDuration = (rawSec: number) => {
    if (Number.isNaN(rawSec)) return;
    const clamped = Math.max(1, Math.min(60, Math.round(rawSec * 2) / 2));
    const adjustedActors = scene.actors.map((ac) => {
      if (!ac.motion) return ac;
      const start = Math.min(ac.motion.startTimeSec ?? 0, Math.max(0, clamped - 0.5));
      const end = Math.min(clamped, Math.max(start + 0.3, ac.motion.endTimeSec ?? clamped));
      return {
        ...ac,
        motion: {
          ...ac.motion,
          startTimeSec: Math.round(start * 10) / 10,
          endTimeSec: Math.round(end * 10) / 10,
        },
      };
    });
    if (previewTime !== null && previewTime > clamped) {
      setPreviewTime(clamped);
    }
    onChangeScene({ ...scene, duration_sec: clamped, actors: adjustedActors });
  };

  // Reset timeline preview & motion handle when changing scenes
  useEffect(() => {
    setIsPreviewPlaying(false);
    setPreviewTime(null);
    setActiveMotionHandle("start");
  }, [scene.scene_id]);

  // Smooth ~60fps requestAnimationFrame preview loop in Studio
  useEffect(() => {
    if (!isPreviewPlaying) return;
    let rafId: number | null = null;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.1, Math.max(0, (now - lastTs) / 1000));
      lastTs = now;
      setPreviewTime((prev) => {
        const base = prev === null ? 0 : prev;
        const next = base + dt;
        return next >= sceneDuration ? 0 : next;
      });
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [isPreviewPlaying, sceneDuration]);

  const selectEntityUnified = (entity: SelectedEntity) => {
    setSelectedEntity(entity);
    if (!entity) return;
    if (entity.type === "actor") {
      setSelectedActorId(entity.id);
      setActiveTab("actors");
      const matched = scene.actors.find((a) => a.id === entity.id);
      if (!matched?.motion) {
        setActiveMotionHandle("start");
      }
    } else if (entity.type === "structure") {
      setSelectedStructureIdx(entity.index);
      setActiveTab("structures");
      setActiveMotionHandle("start");
    } else {
      setSelectedDetailId(entity.id);
      setActiveTab("details");
      setActiveMotionHandle("start");
    }
  };

  // Update Actor helper (auto-migrates slot & motion target if pose plane switches Ground <-> Air)
  const updateActor = (actorId: string, updates: Partial<ActorConfig>) => {
    const updatedActors = scene.actors.map((ac) => {
      if (ac.id !== actorId) return ac;
      const merged: ActorConfig = { ...ac, ...updates };
      if (updates.pose !== undefined || updates.base !== undefined) {
        const rule = getAllowedSlotsForActor(merged);
        if (!isSlotAllowed(merged.slot, rule.allowedSlots)) {
          const currCoords = getSlotCoordinates(merged.slot, merged.offsetX, merged.offsetY);
          const nearest = findNearestAllowedSlot(currCoords.x, currCoords.y, rule.allowedSlots);
          merged.slot = nearest.slot.id;
          merged.offsetX = 0;
          merged.offsetY = 0;
        }
        if (merged.motion) {
          const updatedMotion: ActorMotionConfig = { ...merged.motion };
          if (!isSlotAllowed(updatedMotion.targetSlot, rule.allowedSlots)) {
            const targetCoords = getSlotCoordinates(
              updatedMotion.targetSlot,
              updatedMotion.targetOffsetX,
              updatedMotion.targetOffsetY
            );
            const nearestTarget = findNearestAllowedSlot(
              targetCoords.x,
              targetCoords.y,
              rule.allowedSlots
            );
            updatedMotion.targetSlot = nearestTarget.slot.id;
            updatedMotion.targetOffsetX = 0;
            updatedMotion.targetOffsetY = 0;
          }
          if (!isAirPose(merged.pose) && updatedMotion.targetOffsetY) {
            updatedMotion.targetOffsetY = 0;
          }
          if (
            updatedMotion.movingPose &&
            isAirPose(updatedMotion.movingPose) !== isAirPose(merged.pose)
          ) {
            updatedMotion.movingPose = isAirPose(merged.pose) ? "pose_floating" : "pose_walking";
          }
          merged.motion = updatedMotion;
        }
      }
      if (!isAirPose(merged.pose) && merged.offsetY) {
        merged.offsetY = 0;
      }
      return merged;
    });
    onChangeScene({ ...scene, actors: updatedActors });
  };

  // Update / Toggle Actor A -> B motion config
  const updateActorMotion = (
    actorId: string,
    motionUpdates: Partial<ActorMotionConfig> | null
  ) => {
    const targetActor = scene.actors.find((a) => a.id === actorId);
    if (!targetActor) return;

    if (motionUpdates === null) {
      const updatedActors = scene.actors.map((ac) => {
        if (ac.id !== actorId) return ac;
        const { motion: _removed, ...rest } = ac;
        return rest;
      });
      setActiveMotionHandle("start");
      onChangeScene({ ...scene, actors: updatedActors });
      return;
    }

    if (!targetActor.motion) {
      const rule = getAllowedSlotsForActor(targetActor);
      const startCoords = getSlotCoordinates(
        targetActor.slot,
        targetActor.offsetX,
        targetActor.offsetY
      );
      const deltaX = targetActor.facing === "left" ? -380 : 380;
      const defaultTargetX = Math.max(140, Math.min(1780, startCoords.x + deltaX));
      const assigned = coordsToSlotAssignment(
        defaultTargetX,
        startCoords.y,
        rule.allowedSlots
      );
      const defaultMotion: ActorMotionConfig = {
        targetSlot: assigned.slot,
        targetOffsetX: assigned.offsetX,
        targetOffsetY: isAirPose(targetActor.pose) ? assigned.offsetY : 0,
        startTimeSec: 0,
        endTimeSec: Math.max(1.5, Math.round(sceneDuration * 0.85 * 10) / 10),
        easing: "ease_in_out",
        autoFaceTarget: true,
        movingPose: isAirPose(targetActor.pose) ? targetActor.pose : "pose_walking",
        ...motionUpdates,
      };
      updateActor(actorId, { motion: defaultMotion });
      return;
    }

    updateActor(actorId, {
      motion: {
        ...targetActor.motion,
        ...motionUpdates,
      },
    });
  };

  // Direct Point B coordinate commit from canvas drag or Ground Runway click
  const updateActorTargetPosition = (
    actorId: string,
    targetSlot: SlotId,
    targetOffsetX: number,
    targetOffsetY: number
  ) => {
    updateActorMotion(actorId, {
      targetSlot,
      targetOffsetX,
      targetOffsetY,
    });
  };

  // Add Actor helper (auto-places cleanly along Ground Line without stacking)
  const addActor = () => {
    let idx = scene.actors.length + 1;
    while (scene.actors.some((a) => a.id === `actor_${idx}`)) {
      idx += 1;
    }
    const newId = `actor_${idx}`;
    const existingGroundXs = scene.actors
      .filter((a) => !isAirPose(a.pose))
      .map((a) => getSlotCoordinates(a.slot, a.offsetX, a.offsetY).x);
    const openX = findOpenGroundX(existingGroundXs);
    const assigned = coordsToSlotAssignment(openX, GROUND_Y, [
      "far_left",
      "mid_left",
      "center",
      "mid_right",
      "far_right",
    ]);

    const newActor: ActorConfig = {
      id: newId,
      base: "male_adult",
      costume: "outfit_tattered_tunic",
      face: "face_scared",
      pose: "pose_standing",
      facing: openX < 960 ? "right" : "left",
      slot: assigned.slot,
      offsetX: assigned.offsetX,
      offsetY: 0,
      scale: 1,
    };
    onChangeScene({ ...scene, actors: [...scene.actors, newActor] });
    selectEntityUnified({ type: "actor", id: newId });
  };

  // Remove Actor helper
  const removeActor = (actorId: string) => {
    const remaining = scene.actors.filter((a) => a.id !== actorId);
    onChangeScene({ ...scene, actors: remaining });
    if (selectedActorId === actorId) {
      const nextId = remaining.length > 0 ? remaining[0].id : null;
      setSelectedActorId(nextId);
      setSelectedEntity(nextId ? { type: "actor", id: nextId } : null);
    }
  };

  // Update Structure helper (auto-migrates slot if structure asset rule forbids current slot)
  const updateStructure = (idx: number, updates: Partial<EnvironmentItemConfig>) => {
    const updated = scene.environment_items.map((item, i) => {
      if (i !== idx) return item;
      const merged: EnvironmentItemConfig = { ...item, ...updates };
      if (updates.asset_id !== undefined) {
        const rule = getAllowedSlotsForStructure(merged.asset_id);
        if (!isSlotAllowed(merged.slot, rule.allowedSlots)) {
          const currCoords = getSlotCoordinates(merged.slot, merged.offsetX, merged.offsetY);
          const nearest = findNearestAllowedSlot(currCoords.x, currCoords.y, rule.allowedSlots);
          merged.slot = nearest.slot.id as GroundSlotId;
          merged.offsetX = 0;
          merged.offsetY = 0;
        }
      }
      return merged;
    });
    onChangeScene({ ...scene, environment_items: updated });
  };

  // Add Structure helper
  const addStructure = () => {
    const newStruct: EnvironmentItemConfig = {
      asset_id: "creepy_banyan_tree",
      slot: "far_right",
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    };
    const nextIdx = scene.environment_items.length;
    onChangeScene({
      ...scene,
      environment_items: [...scene.environment_items, newStruct],
    });
    selectEntityUnified({ type: "structure", index: nextIdx });
  };

  // Remove Structure helper
  const removeStructure = (idx: number) => {
    const remaining = scene.environment_items.filter((_, i) => i !== idx);
    onChangeScene({ ...scene, environment_items: remaining });
    const nextIdx = Math.max(0, remaining.length - 1);
    if (selectedStructureIdx >= remaining.length) {
      setSelectedStructureIdx(nextIdx);
    }
    if (selectedEntity?.type === "structure") {
      setSelectedEntity(remaining.length > 0 ? { type: "structure", index: nextIdx } : null);
    }
  };

  // Update Detail helper (auto-migrates slot if detail rule forbids current slot)
  const updateDetail = (detailId: string, updates: Partial<DetailItemConfig>) => {
    const updatedDetails = sceneDetails.map((dt) => {
      if (dt.id !== detailId) return dt;
      const merged: DetailItemConfig = { ...dt, ...updates };
      if (updates.asset_id !== undefined) {
        const rule = getAllowedSlotsForDetail(merged.asset_id);
        if (!isSlotAllowed(merged.slot, rule.allowedSlots)) {
          const currCoords = getSlotCoordinates(merged.slot, merged.offsetX, merged.offsetY);
          const nearest = findNearestAllowedSlot(currCoords.x, currCoords.y, rule.allowedSlots);
          merged.slot = nearest.slot.id;
          merged.offsetX = 0;
          merged.offsetY = 0;
        }
      }
      if (getSlotType(merged.slot) === "ground" && merged.offsetY) {
        merged.offsetY = 0;
      }
      return merged;
    });
    onChangeScene({ ...scene, details: updatedDetails });
  };

  // Add Detail helper
  const addDetail = (assetId: DetailId = "detail_black_crow") => {
    const newId = `detail_${Date.now().toString().slice(-4)}`;
    const defaultSlot = DETAIL_RULES[assetId].allowedSlots[0];
    const newDetail: DetailItemConfig = {
      id: newId,
      asset_id: assetId,
      slot: defaultSlot,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    };
    onChangeScene({ ...scene, details: [...sceneDetails, newDetail] });
    selectEntityUnified({ type: "detail", id: newId });
  };

  // Remove Detail helper
  const removeDetail = (detailId: string) => {
    const remaining = sceneDetails.filter((d) => d.id !== detailId);
    onChangeScene({ ...scene, details: remaining });
    if (selectedDetailId === detailId) {
      const nextId = remaining.length > 0 ? remaining[0].id : null;
      setSelectedDetailId(nextId);
      if (selectedEntity?.type === "detail") {
        setSelectedEntity(nextId ? { type: "detail", id: nextId } : null);
      }
    }
  };

  const selectedActor = scene.actors.find((a) => a.id === selectedActorId);
  const selectedStructure = scene.environment_items[selectedStructureIdx];
  const selectedDetail = sceneDetails.find((d) => d.id === selectedDetailId);

  // Move currently selected entity directly to an allowed slot
  const moveSelectedEntityToSlot = (slotId: SlotId) => {
    if (!selectedEntity) return;
    if (selectedEntity.type === "actor") {
      const actor = scene.actors.find((a) => a.id === selectedEntity.id);
      if (!actor) return;
      const rule = getAllowedSlotsForActor(actor);
      if (isSlotAllowed(slotId, rule.allowedSlots)) {
        updateActor(actor.id, { slot: slotId, offsetX: 0, offsetY: 0 });
      }
    } else if (selectedEntity.type === "structure") {
      const struct = scene.environment_items[selectedEntity.index];
      if (!struct) return;
      const rule = getAllowedSlotsForStructure(struct.asset_id);
      if (isSlotAllowed(slotId, rule.allowedSlots)) {
        updateStructure(selectedEntity.index, {
          slot: slotId as GroundSlotId,
          offsetX: 0,
          offsetY: 0,
        });
      }
    } else {
      const detail = sceneDetails.find((d) => d.id === selectedEntity.id);
      if (!detail) return;
      const rule = getAllowedSlotsForDetail(detail.asset_id);
      if (isSlotAllowed(slotId, rule.allowedSlots)) {
        updateDetail(detail.id, { slot: slotId, offsetX: 0, offsetY: 0 });
      }
    }
  };

  // Resolve current selection's placement rules for UI banner & quick buttons
  const currentRuleSummary: {
    label: string;
    currentSlot: SlotId;
    worldX: number;
    worldY: number;
    allowedSlots: SlotId[];
    reason: string;
  } | null = (() => {
    if (!selectedEntity) return null;
    if (selectedEntity.type === "actor") {
      const ac = scene.actors.find((a) => a.id === selectedEntity.id);
      if (!ac) return null;
      const rule = getAllowedSlotsForActor(ac);
      const coords = getSlotCoordinates(ac.slot, ac.offsetX, ac.offsetY);
      return {
        label: `Nhân vật "${ac.id}"`,
        currentSlot: ac.slot,
        worldX: Math.round(coords.x),
        worldY: Math.round(coords.y),
        ...rule,
      };
    }
    if (selectedEntity.type === "structure") {
      const st = scene.environment_items[selectedEntity.index];
      if (!st) return null;
      const rule = getAllowedSlotsForStructure(st.asset_id);
      const coords = getSlotCoordinates(st.slot, st.offsetX, st.offsetY);
      return {
        label: `Công trình #${selectedEntity.index + 1} (${STRUCTURE_RULES[st.asset_id].name})`,
        currentSlot: st.slot,
        worldX: Math.round(coords.x),
        worldY: Math.round(coords.y),
        ...rule,
      };
    }
    const dt = sceneDetails.find((d) => d.id === selectedEntity.id);
    if (!dt) return null;
    const rule = getAllowedSlotsForDetail(dt.asset_id);
    const coords = getSlotCoordinates(dt.slot, dt.offsetX, dt.offsetY);
    return {
      label: `Chi tiết "${DETAIL_RULES[dt.asset_id].name}"`,
      currentSlot: dt.slot,
      worldX: Math.round(coords.x),
      worldY: Math.round(coords.y),
      ...rule,
    };
  })();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/60 border border-neutral-800/80 px-5 py-3 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-red-500" />
          <h2 className="font-semibold text-neutral-100">Phòng Điều Khiển Cảnh & Neo Vị Trí (Layout Studio)</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Drag Mode Switcher */}
          <div className="flex items-center bg-black/70 border border-neutral-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setDragSnapMode("allowed_offset")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                dragSnapMode === "allowed_offset"
                  ? "bg-emerald-700/80 text-white font-semibold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="Kéo thả hoặc bấm đứng tại bất kỳ điểm nào trên Line Xanh Y=800px"
            >
              <span>Đứng Tự Do Trên Line</span>
            </button>
            <button
              onClick={() => setDragSnapMode("strict_slot")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                dragSnapMode === "strict_slot"
                  ? "bg-amber-700/80 text-white font-semibold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="Kéo thả tự động hút cứng vào 5 mốc Slot"
            >
              <Magnet className="w-3.5 h-3.5" />
              <span>Hút 5 Điểm Neo</span>
            </button>
          </div>

          <button
            onClick={() => setShowGizmo(!showGizmo)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showGizmo
                ? "bg-emerald-800/80 text-emerald-200 border border-emerald-600/50"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showGizmo ? "Ẩn Lưới Neo & Vùng Cho Phép" : "Hiện Lưới Neo & Vùng Cho Phép"}</span>
          </button>

          <button
            onClick={onResetScene}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all border border-neutral-700"
            title="Khôi phục cảnh về ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Mặc Định</span>
          </button>
        </div>
      </div>

      {/* Allowed Placement Rules Status Bar for Selected Entity */}
      {currentRuleSummary ? (
        <div className="flex flex-col gap-2.5 bg-emerald-950/30 border border-emerald-800/50 px-4 py-3 rounded-xl text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Đang chọn <strong className="text-white">{currentRuleSummary.label}</strong> — Tọa độ:{" "}
                <code className="px-1.5 py-0.5 bg-black/60 rounded text-emerald-300 font-mono">
                  X={currentRuleSummary.worldX}px, Y={currentRuleSummary.worldY}px ({currentRuleSummary.currentSlot})
                </code>
              </span>
            </div>
            <span className="text-[11px] text-emerald-300/80 italic">
              {supportsContinuousGroundPlacement(currentRuleSummary.allowedSlots)
                ? "✓ Đứng được tại mọi vị trí trên đường Line Y=800px (Kéo thả hoặc bấm trực tiếp lên đường line xanh)"
                : currentRuleSummary.reason}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-neutral-400 mr-1">Mốc neo nhanh:</span>
            {Object.values(ALL_SLOTS).map((slot) => {
              const allowed = isSlotAllowed(slot.id, currentRuleSummary.allowedSlots);
              const isCurrent = currentRuleSummary.currentSlot === slot.id;
              return (
                <button
                  key={`quick-slot-${slot.id}`}
                  disabled={!allowed}
                  onClick={() => moveSelectedEntityToSlot(slot.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all border ${
                    !allowed
                      ? "bg-red-950/20 border-red-900/30 text-red-400/50 cursor-not-allowed line-through"
                      : isCurrent
                      ? "bg-emerald-600 border-emerald-400 text-white font-bold shadow"
                      : "bg-emerald-950/60 hover:bg-emerald-800/70 border-emerald-700/50 text-emerald-200 cursor-pointer"
                  }`}
                  title={
                    allowed
                      ? `Đặt tại ${slot.id} (${slot.x}, ${slot.y})`
                      : `Khóa: ${currentRuleSummary.reason}`
                  }
                >
                  {allowed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-red-500/60" />
                  )}
                  <span>{slot.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/50 px-4 py-2.5 rounded-xl text-xs text-red-200">
          <span className="text-base">🖱️</span>
          <span>
            <strong>Kéo Thả Theo Luật Vùng Cho Phép:</strong> Bấm chọn nhân vật, công trình hoặc chi tiết bất kỳ trên khung hình để xem ngay các vùng neo <strong className="text-emerald-300">✓ Xanh (Cho Phép)</strong> và kéo thả vị trí!
          </span>
        </div>
      )}

      {/* Main Visual Canvas Viewport */}
      <div className="w-full rounded-2xl overflow-hidden border border-neutral-800/80 shadow-2xl bg-black">
        <SceneRenderer
          script={scene}
          showGizmo={showGizmo}
          showSubtitles={true}
          currentTime={previewTime ?? undefined}
          selectedEntity={selectedEntity}
          activeMotionHandle={activeMotionHandle}
          interactiveDrag={previewTime === null}
          dragSnapMode={dragSnapMode}
          onSelectEntity={selectEntityUnified}
          onSelectSlot={(slotId) => moveSelectedEntityToSlot(slotId)}
          onUpdateActorPosition={(actorId, slot, offsetX, offsetY) => {
            updateActor(actorId, { slot, offsetX, offsetY });
            selectEntityUnified({ type: "actor", id: actorId });
          }}
          onUpdateActorTargetPosition={(actorId, targetSlot, targetOffsetX, targetOffsetY) => {
            updateActorTargetPosition(actorId, targetSlot, targetOffsetX, targetOffsetY);
            selectEntityUnified({ type: "actor", id: actorId });
          }}
          onUpdateStructurePosition={(idx, slot, offsetX, offsetY) => {
            updateStructure(idx, { slot, offsetX, offsetY });
            selectEntityUnified({ type: "structure", index: idx });
          }}
          onUpdateDetailPosition={(detailId, slot, offsetX, offsetY) => {
            updateDetail(detailId, { slot, offsetX, offsetY });
            selectEntityUnified({ type: "detail", id: detailId });
          }}
        />

        {/* Inline Studio Timeline Scrubber for A -> B Motion Preview */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-neutral-950/95 border-t border-neutral-800/80 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isPreviewPlaying) {
                  setIsPreviewPlaying(false);
                } else {
                  if (previewTime === null) setPreviewTime(0);
                  setIsPreviewPlaying(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                isPreviewPlaying
                  ? "bg-amber-600 hover:bg-amber-500 text-white"
                  : "bg-cyan-700 hover:bg-cyan-600 text-white"
              }`}
              title="Xem thử chuyển động A -> B ngay trong Studio"
            >
              {isPreviewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPreviewPlaying ? "Tạm Dừng" : "Xem Thử A → B"}</span>
            </button>

            {previewTime !== null && (
              <button
                onClick={() => {
                  setIsPreviewPlaying(false);
                  setPreviewTime(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 font-medium transition-all"
                title="Quay lại chế độ kéo thả vị trí A và Đích B"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Trở Về Sửa A/B</span>
              </button>
            )}
          </div>

          <div className="flex-1 min-w-[200px] flex items-center gap-3">
            <span className="font-mono text-cyan-400 w-24 text-right shrink-0">
              {(previewTime ?? 0).toFixed(2)}s / {sceneDuration.toFixed(1)}s
            </span>
            <input
              type="range"
              min="0"
              max={sceneDuration}
              step="0.05"
              value={previewTime ?? 0}
              onChange={(e) => {
                setIsPreviewPlaying(false);
                setPreviewTime(parseFloat(e.target.value));
              }}
              className="flex-1 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-neutral-400">
            <label className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg text-neutral-300">
              <span>Thời lượng cảnh:</span>
              <input
                type="number"
                min="1"
                max="60"
                step="0.5"
                value={sceneDuration}
                onChange={(e) => updateSceneDuration(parseFloat(e.target.value))}
                className="w-12 bg-black border border-neutral-700 rounded px-1.5 py-0.5 text-center text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
              />
              <span>giây</span>
            </label>

            {previewTime === null ? (
              <span className="text-emerald-400">
                ● Chế độ Sửa Vị Trí ({selectedActor?.motion && activeMotionHandle === "target" ? "Đích B" : "Điểm A"})
              </span>
            ) : (
              <span className="text-cyan-300">
                ● Đang xem Timeline ({Math.round(((previewTime ?? 0) / sceneDuration) * 100)}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Controls Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 bg-neutral-900/70 border border-neutral-800/80 p-3 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab("actors");
              if (selectedActor) setSelectedEntity({ type: "actor", id: selectedActor.id });
            }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === "actors"
                ? "bg-red-800/80 text-white font-semibold shadow-lg shadow-red-950/40"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            <User className="w-4 h-4 text-red-400" />
            <span>Nhân Vật & Socket ({scene.actors.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("structures");
              if (selectedStructure) setSelectedEntity({ type: "structure", index: selectedStructureIdx });
            }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === "structures"
                ? "bg-red-800/80 text-white font-semibold shadow-lg shadow-red-950/40"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            <Trees className="w-4 h-4 text-emerald-400" />
            <span>Công Trình & Bối Cảnh ({scene.environment_items.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("details");
              if (selectedDetail) setSelectedEntity({ type: "detail", id: selectedDetail.id });
            }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === "details"
                ? "bg-red-800/80 text-white font-semibold shadow-lg shadow-red-950/40"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Chi Tiết & Đạo Cụ ({sceneDetails.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("lighting")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === "lighting"
                ? "bg-red-800/80 text-white font-semibold shadow-lg shadow-red-950/40"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            <CloudMoon className="w-4 h-4 text-blue-400" />
            <span>Bầu Trời, Sương Mù & Ánh Sáng</span>
          </button>

          <button
            onClick={() => setActiveTab("story")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === "story"
                ? "bg-red-800/80 text-white font-semibold shadow-lg shadow-red-950/40"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            <Type className="w-4 h-4 text-amber-400" />
            <span>Lời Thoại & Kịch Bản Cảnh</span>
          </button>
        </div>

        {/* Right Tab Content Panel (9 cols) */}
        <div className="lg:col-span-9 bg-neutral-900/70 border border-neutral-800/80 p-5 rounded-2xl flex flex-col gap-5">
          {/* TAB 1: ACTORS & CHARACTER RIG */}
          {activeTab === "actors" && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-neutral-400 font-medium">Chọn nhân vật ({scene.actors.length}):</span>
                  {scene.actors.map((actor) => {
                    const acCoords = getSlotCoordinates(actor.slot, actor.offsetX, actor.offsetY);
                    return (
                      <button
                        key={actor.id}
                        onClick={() => selectEntityUnified({ type: "actor", id: actor.id })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          selectedActorId === actor.id
                            ? "bg-red-700 text-white font-bold shadow-md shadow-red-950/50"
                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        }`}
                      >
                        {actor.id} (X:{Math.round(acCoords.x)})
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={addActor}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-emerald-300 border border-neutral-700 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Nhân Vật</span>
                </button>
              </div>

              {selectedActor ? (
                <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-4">
                    {/* Character Base */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        1. Khung Thân Thể (Base Mesh):
                      </label>
                      <select
                        value={selectedActor.base}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            base: e.target.value as CharacterBaseId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="male_adult">Nam thanh niên (male_adult - dáng gầy, bước đi)</option>
                        <option value="female_adult">Nữ thanh niên (female_adult - tà áo dài/váy buông)</option>
                        <option value="elder_hunched">Bà lão / Cụ già lưng còng (elder_hunched - gập người, tóc búi/bạc)</option>
                        <option value="brute_hulking">Đồ tể / Hộ pháp lực lưỡng (brute_hulking - vai u thịt bắp, cằm bạnh)</option>
                        <option value="skeletal_emaciated">Kẻ gầy trơ xương / Ngạ quỷ (skeletal_emaciated - khẳng khiu, lộ sườn)</option>
                        <option value="ghost_wraith">Bóng ma bay lượn (ghost_wraith - không chân, tà áo rách)</option>
                        <option value="creepy_child">Đứa trẻ ma (creepy_child - nhỏ bé, ôm búp bê rách)</option>
                        <option value="jiangshi_corpse">Cương thi áo quan (jiangshi_corpse - bùa trán, tay duỗi thẳng)</option>
                        <option value="demon_shadow">Quỷ bóng đen dị hình (demon_shadow - sừng cong, móng vuốt)</option>
                      </select>
                    </div>

                    {/* Costume / Outfit Selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                        <span>2. Bộ Sưu Tập Trang Phục (Costume):</span>
                        <span className="font-mono text-emerald-400 text-[11px]">
                          {selectedActor.costume || getDefaultCostumeForBase(selectedActor.base).split("_")[1]}
                        </span>
                      </label>
                      <select
                        value={selectedActor.costume || getDefaultCostumeForBase(selectedActor.base)}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            costume: e.target.value as CostumeId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="outfit_tattered_tunic">Áo tơi / Áo nông phu sờn rách (outfit_tattered_tunic)</option>
                        <option value="outfit_flowing_ao_dai">Áo dài cổ truyền tà rách ma mị (outfit_flowing_ao_dai)</option>
                        <option value="outfit_shrouded_cloak">Áo choàng trùm đầu tăm tối Reaper (outfit_shrouded_cloak)</option>
                        <option value="outfit_mandarin_court">Quan phục triều đình / Bổ tử phong kiến (outfit_mandarin_court)</option>
                        <option value="outfit_monk_cassock">Áo cà sa pháp sư / Đạo bào trừ tà (outfit_monk_cassock)</option>
                        <option value="outfit_shredded_burial">Vải liệm oan hồn / Áo niệm tử thi (outfit_shredded_burial)</option>
                        <option value="outfit_ancient_armor">Giáp tướng cổ vỡ nát / Chiến bào tử sĩ (outfit_ancient_armor)</option>
                        <option value="outfit_child_pajamas">Yếm hoa / Đồ trẻ thơ vương vết ố (outfit_child_pajamas)</option>
                        <option value="outfit_doctor_coat">Áo blouse bác sĩ vấy máu phẫu thuật (outfit_doctor_coat)</option>
                        <option value="outfit_patient_gown">Áo bệnh nhân sọc xanh lấm lem (outfit_patient_gown)</option>
                        <option value="outfit_modern_casual">Áo hoodie / Đồ hiện đại thường nhật (outfit_modern_casual)</option>
                      </select>
                    </div>

                    {/* Face */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        3. Biểu Cảm Khuôn Mặt (Head Socket -250px):
                      </label>
                      <select
                        value={selectedActor.face}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            face: e.target.value as CharacterFaceId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="face_calm">Mặt bình thường (face_calm - mắt đen nhỏ vô hồn)</option>
                        <option value="face_scared">Kinh hãi (face_scared - mắt trắng dã, miệng há hốc run rẩy)</option>
                        <option value="face_creepy_smile">Nụ cười ma quái (face_creepy_smile - xé dài tới mang tai)</option>
                        <option value="face_bleeding_eyes">Mắt chảy máu (face_bleeding_eyes - hai vệt máu đen rỉ xuống)</option>
                        <option value="face_old_wrinkled">Mặt già nua nếp nhăn (face_old_wrinkled - trán nhăn, đuôi mắt chùng, móm)</option>
                        <option value="face_rage_furious">Phẫn nộ trừng mắt (face_rage_furious - mắt đỏ xếch, nhe nanh gầm thét)</option>
                        <option value="face_pale_corpse">Mặt tử thi lạnh lẽo (face_pale_corpse - mắt trợn trắng dã, môi thâm sì)</option>
                        <option value="face_weeping_ghost">Oán phụ khóc than (face_weeping_ghost - nhắm nghiền đẫm lệ đen rỉ dài)</option>
                        <option value="face_sewn_mouth">Miệng khâu chỉ đen (face_sewn_mouth - mũi khâu chéo chữ X gớm ghiếc)</option>
                        <option value="face_haggard_gaunt">Hốc hác đói khát (face_haggard_gaunt - quầng thâm sâu, má hóp trơ gò má)</option>
                        <option value="face_faceless">Mặt trắng trơn vô diện (face_faceless - không ngũ quan)</option>
                        <option value="face_glowing_hollow">Hốc mắt miệng rực lửa ma trơi (face_glowing_hollow)</option>
                        <option value="face_talisman_covered">Dán bùa vàng chu sa che trán (face_talisman_covered)</option>
                      </select>
                    </div>

                    {/* Pose */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        4. Tư Thế & Động Tác (Pose):
                      </label>
                      <select
                        value={selectedActor.pose}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            pose: e.target.value as CharacterPoseId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="pose_standing">Đứng quan sát (pose_standing)</option>
                        <option value="pose_holding">Cầm / Giơ đồ vật phía trước (pose_holding)</option>
                        <option value="pose_shivering">Run rẩy co ro (pose_shivering)</option>
                        <option value="pose_walking">Bước đi chậm rãi (pose_walking)</option>
                        <option value="pose_floating">Bay lơ lửng dập dềnh (pose_floating)</option>
                        <option value="pose_crawling">Bò trườn sát đất (pose_crawling)</option>
                        <option value="pose_reaching">Vươn tay bắt hồn (pose_reaching)</option>
                        <option value="pose_hanging">Bị treo lơ lửng rũ đầu (pose_hanging)</option>
                      </select>
                    </div>

                    {/* Facing Direction */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-neutral-300">
                        5. Hướng Nhìn (Facing):
                      </span>
                      <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-neutral-800">
                        <button
                          onClick={() => updateActor(selectedActor.id, { facing: "left" })}
                          className={`px-3 py-1 rounded text-xs transition-all ${
                            selectedActor.facing === "left"
                              ? "bg-red-700 text-white font-bold"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Sang Trái
                        </button>
                        <button
                          onClick={() => updateActor(selectedActor.id, { facing: "right" })}
                          className={`px-3 py-1 rounded text-xs transition-all ${
                            selectedActor.facing === "right"
                              ? "bg-red-700 text-white font-bold"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Sang Phải
                        </button>
                      </div>
                    </div>

                    {/* Handheld Prop / Hand Socket */}
                    <div className="flex flex-col gap-2 bg-amber-950/15 border border-amber-800/35 p-3 rounded-xl">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-amber-200">
                          6. Đồ Vật Cầm Tay (Hand Socket):
                        </label>
                        <div className="flex items-center gap-1 bg-black p-0.5 rounded-lg border border-neutral-800">
                          <button
                            onClick={() => updateActor(selectedActor.id, { heldHand: "right" as HeldHand })}
                            className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                              (selectedActor.heldHand || "right") === "right"
                                ? "bg-amber-600 text-white font-bold"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            Tay trước (Phải)
                          </button>
                          <button
                            onClick={() => updateActor(selectedActor.id, { heldHand: "left" as HeldHand })}
                            className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                              selectedActor.heldHand === "left"
                                ? "bg-amber-600 text-white font-bold"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            Tay sau (Trái)
                          </button>
                        </div>
                      </div>

                      <select
                        value={selectedActor.heldItem || "none"}
                        onChange={(e) => {
                          const nextItem = e.target.value as HeldItemId;
                          updateActor(selectedActor.id, { heldItem: nextItem });
                        }}
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                      >
                        {HELD_ITEM_CATALOG.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Right Column: Slot Selection & Fine-tuning Sliders */}
                  <div className="flex flex-col gap-4 bg-black/40 border border-neutral-800/80 p-4 rounded-xl">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                        <span>Vị Trí Neo Được Phép (Layout Slot):</span>
                        <span className="font-mono text-emerald-400 text-[11px]">{selectedActor.slot}</span>
                      </label>
                      {(() => {
                        const actorRule = getAllowedSlotsForActor(selectedActor);
                        return (
                          <>
                            <select
                              value={selectedActor.slot}
                              onChange={(e) =>
                                updateActor(selectedActor.id, {
                                  slot: e.target.value as SlotId,
                                  offsetX: 0,
                                  offsetY: 0,
                                })
                              }
                              className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                            >
                              <optgroup label="Mặt Đất (Ground Y=800px)">
                                {(["far_left", "mid_left", "center", "mid_right", "far_right"] as SlotId[]).map((sid) => {
                                  const ok = isSlotAllowed(sid, actorRule.allowedSlots);
                                  const s = ALL_SLOTS[sid];
                                  return (
                                    <option key={sid} value={sid} disabled={!ok}>
                                      {ok ? `✓ ${sid} (X=${s.x}, Y=${s.y})` : `✕ ${sid} (Khóa — chỉ cho phép ở trên không)`}
                                    </option>
                                  );
                                })}
                              </optgroup>
                              <optgroup label="Trên Không (Air Slots)">
                                {(["air_left", "air_center", "air_right"] as SlotId[]).map((sid) => {
                                  const ok = isSlotAllowed(sid, actorRule.allowedSlots);
                                  const s = ALL_SLOTS[sid];
                                  return (
                                    <option key={sid} value={sid} disabled={!ok}>
                                      {ok ? `✓ ${sid} (X=${s.x}, Y=${s.y})` : `✕ ${sid} (Khóa — nhân vật phải đứng đất Y=800)`}
                                    </option>
                                  );
                                })}
                              </optgroup>
                            </select>
                            <span className="text-[11px] text-emerald-300/80 italic">{actorRule.reason}</span>
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex flex-col gap-1">
                      {(() => {
                        const actorCoords = getSlotCoordinates(
                          selectedActor.slot,
                          selectedActor.offsetX,
                          selectedActor.offsetY
                        );
                        const actorRule = getAllowedSlotsForActor(selectedActor);
                        return (
                          <>
                            <div className="flex justify-between text-xs text-neutral-300">
                              <span>Vị trí ngang trên Line (Tọa độ X):</span>
                              <span className="font-mono text-emerald-400">
                                {Math.round(actorCoords.x)}px (gần {selectedActor.slot})
                              </span>
                            </div>
                            <input
                              type="range"
                              min="80"
                              max="1840"
                              step="5"
                              value={Math.round(actorCoords.x)}
                              onChange={(e) => {
                                const targetX = parseInt(e.target.value, 10);
                                const targetY = isAirPose(selectedActor.pose)
                                  ? actorCoords.y
                                  : GROUND_Y;
                                const assigned = coordsToSlotAssignment(
                                  targetX,
                                  targetY,
                                  actorRule.allowedSlots
                                );
                                updateActor(selectedActor.id, {
                                  slot: assigned.slot,
                                  offsetX: assigned.offsetX,
                                  offsetY: assigned.offsetY,
                                });
                              }}
                              className="w-full accent-red-600"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                              <span>80px (Trái)</span>
                              <span>960px (Giữa)</span>
                              <span>1840px (Phải)</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Tinh chỉnh Y (Offset):</span>
                        <span className="font-mono text-emerald-400">
                          {isAirPose(selectedActor.pose)
                            ? `${selectedActor.offsetY || 0}px`
                            : "Khóa Y=800px (Tiếp đất)"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-160"
                        max="180"
                        step="5"
                        disabled={!isAirPose(selectedActor.pose)}
                        value={isAirPose(selectedActor.pose) ? selectedActor.offsetY || 0 : 0}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            offsetY: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full accent-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Kích thước (Scale):</span>
                        <span className="font-mono text-amber-400">{(selectedActor.scale || 1).toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.05"
                        value={selectedActor.scale || 1}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            scale: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-red-600"
                      />
                    </div>

                    <button
                      onClick={() => removeActor(selectedActor.id)}
                      className="mt-2 py-2 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-red-800/60 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa nhân vật này</span>
                    </button>
                  </div>
                </div>

                {/* FULL-WIDTH A -> B MOTION KEYFRAME CARD */}
                <div className="bg-cyan-950/20 border border-cyan-800/50 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-900/70 border border-cyan-500/40 text-cyan-200 font-mono text-[11px] font-bold">
                        A → B
                      </span>
                      <span className="text-xs font-bold text-cyan-200">
                        Chuyển Động Di Chuyển Từ Điểm A Sang Điểm B
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedActor.motion && (
                        <>
                          <button
                            onClick={() => {
                              setIsPreviewPlaying(true);
                              setPreviewTime(0);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-[11px] font-semibold transition-all"
                          >
                            <Play className="w-3 h-3" />
                            <span>Chạy Thử Ngay</span>
                          </button>

                          <button
                            onClick={() => {
                              const m = selectedActor.motion;
                              if (!m) return;
                              updateActor(selectedActor.id, {
                                slot: m.targetSlot,
                                offsetX: m.targetOffsetX ?? 0,
                                offsetY: m.targetOffsetY ?? 0,
                                motion: {
                                  ...m,
                                  targetSlot: selectedActor.slot,
                                  targetOffsetX: selectedActor.offsetX ?? 0,
                                  targetOffsetY: selectedActor.offsetY ?? 0,
                                },
                              });
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-200 border border-cyan-800/50 text-[11px] font-medium transition-all"
                            title="Đảo vị trí Xuất Phát (A) và Đích Đến (B)"
                          >
                            ⇄ Đảo A ↔ B
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          if (selectedActor.motion) {
                            updateActorMotion(selectedActor.id, null);
                          } else {
                            updateActorMotion(selectedActor.id, {});
                            setActiveMotionHandle("target");
                            setIsPreviewPlaying(false);
                            setPreviewTime(null);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          selectedActor.motion
                            ? "bg-red-950/60 hover:bg-red-900/70 text-red-200 border-red-800/60"
                            : "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400"
                        }`}
                      >
                        {selectedActor.motion ? "Tắt Di Chuyển" : "+ Bật Di Chuyển A → B"}
                      </button>
                    </div>
                  </div>

                  {selectedActor.motion ? (
                    (() => {
                      const motion = selectedActor.motion;
                      const actorRule = getAllowedSlotsForActor(selectedActor);
                      const pointACoords = getSlotCoordinates(
                        selectedActor.slot,
                        selectedActor.offsetX,
                        selectedActor.offsetY
                      );
                      const pointBCoords = getSlotCoordinates(
                        motion.targetSlot,
                        motion.targetOffsetX,
                        motion.targetOffsetY
                      );
                      const startTime = motion.startTimeSec ?? 0;
                      const endTime = motion.endTimeSec ?? sceneDuration;

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-cyan-900/40">
                          {/* Column A: Active Drag Handle + Destination Coords */}
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-semibold text-neutral-300">
                                Chọn điểm thao tác khi bấm lên đường Line sân khấu:
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => {
                                    setIsPreviewPlaying(false);
                                    setPreviewTime(null);
                                    setActiveMotionHandle("start");
                                  }}
                                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                                    activeMotionHandle === "start"
                                      ? "bg-emerald-700 border-emerald-400 text-white shadow"
                                      : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                                  }`}
                                >
                                  📍 Điểm A (X:{Math.round(pointACoords.x)})
                                </button>
                                <button
                                  onClick={() => {
                                    setIsPreviewPlaying(false);
                                    setPreviewTime(null);
                                    setActiveMotionHandle("target");
                                  }}
                                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                                    activeMotionHandle === "target"
                                      ? "bg-cyan-600 border-cyan-300 text-white shadow"
                                      : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                                  }`}
                                >
                                  🏁 Đích B (X:{Math.round(pointBCoords.x)})
                                </button>
                              </div>
                              <p className="text-[11px] text-cyan-300/80">
                                Mẹo: Có thể kéo trực tiếp bóng mờ <strong>ĐÍCH B</strong> màu xanh ngọc trên khung hình!
                              </p>
                            </div>

                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between text-xs text-neutral-300">
                                <span>Tọa độ ngang Đích B (Line X):</span>
                                <span className="font-mono text-cyan-300">
                                  {Math.round(pointBCoords.x)}px (gần {motion.targetSlot})
                                </span>
                              </div>
                              <input
                                type="range"
                                min="80"
                                max="1840"
                                step="5"
                                value={Math.round(pointBCoords.x)}
                                onChange={(e) => {
                                  const targetX = parseInt(e.target.value, 10);
                                  const targetY = isAirPose(selectedActor.pose)
                                    ? pointBCoords.y
                                    : GROUND_Y;
                                  const assigned = coordsToSlotAssignment(
                                    targetX,
                                    targetY,
                                    actorRule.allowedSlots
                                  );
                                  updateActorTargetPosition(
                                    selectedActor.id,
                                    assigned.slot,
                                    assigned.offsetX,
                                    isAirPose(selectedActor.pose) ? assigned.offsetY : 0
                                  );
                                }}
                                className="w-full accent-cyan-400"
                              />
                            </div>

                            {isAirPose(selectedActor.pose) && (
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs text-neutral-300">
                                  <span>Độ cao Y Đích B (Air Offset):</span>
                                  <span className="font-mono text-cyan-300">
                                    {motion.targetOffsetY || 0}px
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="-160"
                                  max="180"
                                  step="5"
                                  value={motion.targetOffsetY || 0}
                                  onChange={(e) =>
                                    updateActorMotion(selectedActor.id, {
                                      targetOffsetY: parseInt(e.target.value, 10),
                                    })
                                  }
                                  className="w-full accent-cyan-400"
                                />
                              </div>
                            )}
                          </div>

                          {/* Column B: Timing, Moving Pose & Easing */}
                          <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs text-neutral-300">
                                  <span>Bắt đầu rời A:</span>
                                  <span className="font-mono text-cyan-300">{startTime.toFixed(1)}s</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max={Math.max(0.5, sceneDuration - 0.5)}
                                  step="0.1"
                                  value={startTime}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    updateActorMotion(selectedActor.id, {
                                      startTimeSec: val,
                                      endTimeSec: Math.max(val + 0.3, endTime),
                                    });
                                  }}
                                  className="w-full accent-cyan-400"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs text-neutral-300">
                                  <span>Chạm Đích B:</span>
                                  <span className="font-mono text-cyan-300">{endTime.toFixed(1)}s</span>
                                </div>
                                <input
                                  type="range"
                                  min={Math.min(sceneDuration, startTime + 0.3)}
                                  max={sceneDuration}
                                  step="0.1"
                                  value={endTime}
                                  onChange={(e) =>
                                    updateActorMotion(selectedActor.id, {
                                      endTimeSec: parseFloat(e.target.value),
                                    })
                                  }
                                  className="w-full accent-cyan-400"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs text-neutral-300">Tư thế khi di chuyển:</label>
                                <select
                                  value={motion.movingPose || selectedActor.pose}
                                  onChange={(e) =>
                                    updateActorMotion(selectedActor.id, {
                                      movingPose: e.target.value as CharacterPoseId,
                                    })
                                  }
                                  className="bg-black border border-neutral-800 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500"
                                >
                                  {isAirPose(selectedActor.pose) ? (
                                    <>
                                      <option value="pose_floating">Bay lơ lửng (pose_floating)</option>
                                      <option value="pose_hanging">Đung đưa trên cao (pose_hanging)</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value="pose_walking">Bước đi (pose_walking)</option>
                                      <option value="pose_holding">Cầm đồ vật giơ trước (pose_holding)</option>
                                      <option value="pose_crawling">Bò trườn (pose_crawling)</option>
                                      <option value="pose_reaching">Vươn vuốt tiến tới (pose_reaching)</option>
                                      <option value="pose_shivering">Run rẩy tiến bước (pose_shivering)</option>
                                      <option value="pose_standing">Trượt giữ nguyên dáng (pose_standing)</option>
                                    </>
                                  )}
                                </select>
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-xs text-neutral-300">Nhịp gia tốc (Easing):</label>
                                <select
                                  value={motion.easing || "ease_in_out"}
                                  onChange={(e) =>
                                    updateActorMotion(selectedActor.id, {
                                      easing: e.target.value as EasingType,
                                    })
                                  }
                                  className="bg-black border border-neutral-800 rounded-lg p-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500"
                                >
                                  <option value="ease_in_out">Mượt hai đầu (ease_in_out)</option>
                                  <option value="linear">Đều đặn (linear)</option>
                                  <option value="ease_in">Nhanh dần (ease_in)</option>
                                  <option value="ease_out">Chậm dần khi tới B (ease_out)</option>
                                </select>
                              </div>
                            </div>

                            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none pt-1">
                              <input
                                type="checkbox"
                                checked={motion.autoFaceTarget !== false}
                                onChange={(e) =>
                                  updateActorMotion(selectedActor.id, {
                                    autoFaceTarget: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 accent-cyan-400 rounded"
                              />
                              <span>Tự động quay mặt về hướng Điểm B khi di chuyển</span>
                            </label>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-xs text-neutral-400">
                      Hiện tại nhân vật đang đứng tĩnh tại Điểm A. Bấm{" "}
                      <strong className="text-cyan-300">+ Bật Di Chuyển A → B</strong> để thiết lập đường chạy hoặc lướt ma mị theo thời gian cảnh.
                    </p>
                  )}
                </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-neutral-500">
                  Chưa có nhân vật nào. Bấm "Thêm Nhân Vật" để tạo mới.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STRUCTURES */}
          {activeTab === "structures" && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-neutral-400 font-medium">Chọn công trình:</span>
                  {scene.environment_items.map((item, idx) => (
                    <button
                      key={`struct-btn-${idx}`}
                      onClick={() => selectEntityUnified({ type: "structure", index: idx })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        selectedStructureIdx === idx
                          ? "bg-emerald-800 text-white font-bold shadow-md shadow-emerald-950/50"
                          : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      }`}
                    >
                      #{idx + 1} {item.asset_id.split("_")[0]} ({item.slot})
                    </button>
                  ))}
                </div>

                <button
                  onClick={addStructure}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-emerald-300 border border-neutral-700 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Công Trình</span>
                </button>
              </div>

              {selectedStructure ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Loại Công Trình (Structure Asset):
                      </label>
                      <select
                        value={selectedStructure.asset_id}
                        onChange={(e) =>
                          updateStructure(selectedStructureIdx, {
                            asset_id: e.target.value as StructureId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="creepy_banyan_tree">Cây đa cổ thụ cành trơ trụi (creepy_banyan_tree)</option>
                        <option value="ancient_tomb">Ngôi mộ cổ nứt nẻ và bia đá (ancient_tomb)</option>
                        <option value="dilapidated_hut">Căn lều tranh xiêu vẹo (dilapidated_hut)</option>
                        <option value="abandoned_shrine">Miếu hoang cô hồn cổ kính (abandoned_shrine)</option>
                        <option value="broken_wooden_bridge">Cầu khỉ gãy nhịp qua đầm lầy (broken_wooden_bridge)</option>
                        <option value="scarecrow_of_the_damned">Bù nhìn rơm bị quỷ ám (scarecrow_of_the_damned)</option>
                        <option value="creepy_well">Giếng cạn oan hồn (creepy_well)</option>
                        <option value="haunted_gallows_tree">Cây treo cổ rủ cành liễu (haunted_gallows_tree)</option>
                        <option value="hospital_operating_bed">Giường mổ bệnh viện rỉ sét (hospital_operating_bed)</option>
                        <option value="hotel_reception_desk">Quầy lễ tân khách sạn u ám (hotel_reception_desk)</option>
                        <option value="supermarket_shelf_aisle">Dãy kệ hàng siêu thị hoang tàn (supermarket_shelf_aisle)</option>
                        <option value="creepy_elevator_doors">Cửa thang máy rùng rợn hé mở (creepy_elevator_doors)</option>
                        <option value="dining_table_chairs">Bàn ăn nhà hàng khăn rách (dining_table_chairs)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Vị Trí Neo Cho Phép (Ground Y=800px):
                      </label>
                      {(() => {
                        const structRule = getAllowedSlotsForStructure(selectedStructure.asset_id);
                        return (
                          <>
                            <select
                              value={selectedStructure.slot}
                              onChange={(e) =>
                                updateStructure(selectedStructureIdx, {
                                  slot: e.target.value as GroundSlotId,
                                  offsetX: 0,
                                  offsetY: 0,
                                })
                              }
                              className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                            >
                              {(["far_left", "mid_left", "center", "mid_right", "far_right"] as GroundSlotId[]).map(
                                (sid) => {
                                  const ok = isSlotAllowed(sid, structRule.allowedSlots);
                                  const s = ALL_SLOTS[sid];
                                  return (
                                    <option key={sid} value={sid} disabled={!ok}>
                                      {ok ? `✓ ${sid} (X=${s.x}, Y=${s.y})` : `✕ ${sid} (Khóa theo quy tắc công trình)`}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                            <span className="text-[11px] text-emerald-300/80 italic">{structRule.reason}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 bg-black/40 border border-neutral-800/80 p-4 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Tinh chỉnh X (Offset trong vùng cho phép):</span>
                        <span className="font-mono text-emerald-400">{selectedStructure.offsetX || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        step="5"
                        value={selectedStructure.offsetX || 0}
                        onChange={(e) =>
                          updateStructure(selectedStructureIdx, {
                            offsetX: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full accent-red-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Kích thước (Scale):</span>
                        <span className="font-mono text-amber-400">{(selectedStructure.scale || 1).toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.05"
                        value={selectedStructure.scale || 1}
                        onChange={(e) =>
                          updateStructure(selectedStructureIdx, {
                            scale: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-red-600"
                      />
                    </div>

                    <button
                      onClick={() => removeStructure(selectedStructureIdx)}
                      className="mt-2 py-2 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-red-800/60 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa công trình này</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-neutral-500">
                  Chưa có công trình nào. Bấm "Thêm Công Trình" để đặt bối cảnh.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DETAILS & PROPS */}
          {activeTab === "details" && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-neutral-400 font-medium">Chọn chi tiết:</span>
                  {sceneDetails.map((dt) => (
                    <button
                      key={`detail-btn-${dt.id}`}
                      onClick={() => selectEntityUnified({ type: "detail", id: dt.id })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        selectedDetailId === dt.id
                          ? "bg-amber-700 text-white font-bold shadow-md shadow-amber-950/50"
                          : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      }`}
                    >
                      {DETAIL_RULES[dt.asset_id].name} ({dt.slot})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => addDetail("detail_black_crow")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-amber-300 border border-neutral-700 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Chi Tiết Mới</span>
                </button>
              </div>

              {/* Quick-Add Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-neutral-400 mr-1">Thêm nhanh đạo cụ:</span>
                {(Object.keys(DETAIL_RULES) as DetailId[]).map((did) => (
                  <button
                    key={`add-${did}`}
                    onClick={() => addDetail(did)}
                    className="px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-amber-900/50 border border-neutral-700 text-neutral-300 hover:text-amber-200 transition-all"
                  >
                    + {DETAIL_RULES[did].name}
                  </button>
                ))}
              </div>

              {selectedDetail ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Loại Chi Tiết / Đạo Cụ (Detail Asset):
                      </label>
                      <select
                        value={selectedDetail.asset_id}
                        onChange={(e) =>
                          updateDetail(selectedDetail.id, {
                            asset_id: e.target.value as DetailId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                      >
                        {(Object.keys(DETAIL_RULES) as DetailId[]).map((did) => (
                          <option key={did} value={did}>
                            {DETAIL_RULES[did].name} ({did})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Vị Trí Neo Cho Phép (Layout Slot):
                      </label>
                      {(() => {
                        const detailRule = getAllowedSlotsForDetail(selectedDetail.asset_id);
                        return (
                          <>
                            <select
                              value={selectedDetail.slot}
                              onChange={(e) =>
                                updateDetail(selectedDetail.id, {
                                  slot: e.target.value as SlotId,
                                  offsetX: 0,
                                  offsetY: 0,
                                })
                              }
                              className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                            >
                              <optgroup label="Mặt Đất (Ground Y=800px)">
                                {(["far_left", "mid_left", "center", "mid_right", "far_right"] as SlotId[]).map(
                                  (sid) => {
                                    const ok = isSlotAllowed(sid, detailRule.allowedSlots);
                                    const s = ALL_SLOTS[sid];
                                    return (
                                      <option key={sid} value={sid} disabled={!ok}>
                                        {ok ? `✓ ${sid} (X=${s.x}, Y=${s.y})` : `✕ ${sid} (Khóa)`}
                                      </option>
                                    );
                                  }
                                )}
                              </optgroup>
                              <optgroup label="Trên Không (Air Slots)">
                                {(["air_left", "air_center", "air_right"] as SlotId[]).map((sid) => {
                                  const ok = isSlotAllowed(sid, detailRule.allowedSlots);
                                  const s = ALL_SLOTS[sid];
                                  return (
                                    <option key={sid} value={sid} disabled={!ok}>
                                      {ok ? `✓ ${sid} (X=${s.x}, Y=${s.y})` : `✕ ${sid} (Khóa)`}
                                    </option>
                                  );
                                })}
                              </optgroup>
                            </select>
                            <span className="text-[11px] text-emerald-300/80 italic">{detailRule.reason}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 bg-black/40 border border-neutral-800/80 p-4 rounded-xl">
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const detailRule = getAllowedSlotsForDetail(selectedDetail.asset_id);
                        const detailCoords = getSlotCoordinates(
                          selectedDetail.slot,
                          selectedDetail.offsetX,
                          selectedDetail.offsetY
                        );
                        const isContinuous =
                          getSlotType(selectedDetail.slot) === "ground" &&
                          supportsContinuousGroundPlacement(detailRule.allowedSlots);

                        if (isContinuous) {
                          return (
                            <>
                              <div className="flex justify-between text-xs text-neutral-300">
                                <span>Vị trí ngang trên Line (Tọa độ X):</span>
                                <span className="font-mono text-emerald-400">
                                  {Math.round(detailCoords.x)}px (gần {selectedDetail.slot})
                                </span>
                              </div>
                              <input
                                type="range"
                                min="80"
                                max="1840"
                                step="5"
                                value={Math.round(detailCoords.x)}
                                onChange={(e) => {
                                  const targetX = parseInt(e.target.value, 10);
                                  const assigned = coordsToSlotAssignment(
                                    targetX,
                                    GROUND_Y,
                                    detailRule.allowedSlots
                                  );
                                  updateDetail(selectedDetail.id, {
                                    slot: assigned.slot,
                                    offsetX: assigned.offsetX,
                                    offsetY: 0,
                                  });
                                }}
                                className="w-full accent-amber-500"
                              />
                            </>
                          );
                        }

                        return (
                          <>
                            <div className="flex justify-between text-xs text-neutral-300">
                              <span>Tinh chỉnh X (Offset trong vùng cho phép):</span>
                              <span className="font-mono text-emerald-400">{selectedDetail.offsetX || 0}px</span>
                            </div>
                            <input
                              type="range"
                              min="-200"
                              max="200"
                              step="5"
                              value={selectedDetail.offsetX || 0}
                              onChange={(e) =>
                                updateDetail(selectedDetail.id, {
                                  offsetX: parseInt(e.target.value, 10),
                                })
                              }
                              className="w-full accent-amber-500"
                            />
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Tinh chỉnh Y (Offset):</span>
                        <span className="font-mono text-emerald-400">
                          {getSlotType(selectedDetail.slot) === "air"
                            ? `${selectedDetail.offsetY || 0}px`
                            : "Khóa Y=800px (Tiếp đất)"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-160"
                        max="180"
                        step="5"
                        disabled={getSlotType(selectedDetail.slot) === "ground"}
                        value={getSlotType(selectedDetail.slot) === "air" ? selectedDetail.offsetY || 0 : 0}
                        onChange={(e) =>
                          updateDetail(selectedDetail.id, {
                            offsetY: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full accent-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Kích thước (Scale):</span>
                        <span className="font-mono text-amber-400">{(selectedDetail.scale || 1).toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.05"
                        value={selectedDetail.scale || 1}
                        onChange={(e) =>
                          updateDetail(selectedDetail.id, {
                            scale: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <button
                      onClick={() => removeDetail(selectedDetail.id)}
                      className="mt-2 py-2 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-red-800/60 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa chi tiết này</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-neutral-500">
                  Chưa có chi tiết / đạo cụ nào trong cảnh này. Bấm "+ Quạ đen" hoặc nút thêm phía trên để bổ sung.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIGHTING & ENVIRONMENT */}
          {activeTab === "lighting" && (
            <div className="flex flex-col gap-5">
              {/* Reusable Named Environment Quick Apply */}
              <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black border border-amber-600/40 p-4 rounded-xl flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">
                      Khóa Bối Cảnh Chung Dùng Lại (Chống Lệch Cảnh)
                    </span>
                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/60 px-1.5 py-0.2 rounded font-mono">
                      Shared Set
                    </span>
                  </div>
                  {onOpenAiDirector && (
                    <button
                      type="button"
                      onClick={() => onOpenAiDirector("environments_manager")}
                      className="text-xs text-amber-300 hover:text-amber-200 underline font-mono flex items-center gap-1"
                    >
                      <span>Quản lý thư viện ({loadStoredNamedEnvironments().length} bối cảnh)</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 m-0">
                  Chọn bối cảnh có sẵn để áp dụng đồng bộ ngay lập tức cho cảnh này (Theme, Bầu trời, Công trình & Đạo cụ sẽ được khóa đúng chuẩn, giữ nguyên diễn viên):
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    onChange={(e) => {
                      const envs = loadStoredNamedEnvironments();
                      const selected = envs.find((env) => env.id === e.target.value);
                      if (selected) {
                        onChangeScene(applyEnvironmentToScene(scene, selected));
                      }
                    }}
                    defaultValue=""
                    className="flex-1 bg-black border border-amber-700/80 rounded-lg p-2 text-xs text-amber-200 font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="" disabled>-- Chọn bối cảnh mẫu để khóa khung cảnh --</option>
                    {loadStoredNamedEnvironments().map((env) => (
                      <option key={env.id} value={env.id}>
                        📍 {env.name} ({env.theme} | {env.lighting.sky_preset})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Chủ Đề Bối Cảnh (Theme):
                    </label>
                    <select
                      value={scene.theme}
                      onChange={(e) =>
                        onChangeScene({ ...scene, theme: e.target.value as ThemeId })
                      }
                      className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                    >
                      <option value="rural_graveyard">Bãi tha ma nông thôn (rural_graveyard)</option>
                      <option value="abandoned_village">Đường làng hoang vắng (abandoned_village)</option>
                      <option value="cursed_swamp">Đầm lầy u minh (cursed_swamp)</option>
                      <option value="modern_indoor">Hành lang & Không gian trong nhà hiện đại (modern_indoor)</option>
                    </select>
                  </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Bầu Trời & Ánh Sáng (Sky Preset):
                  </label>
                  <select
                    value={scene.lighting.sky_preset}
                    onChange={(e) =>
                      onChangeScene({
                        ...scene,
                        lighting: {
                          ...scene.lighting,
                          sky_preset: e.target.value as SkyPresetId,
                        },
                      })
                    }
                    className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                  >
                    <option value="blood_moon">Trăng Máu U Uất (blood_moon - Gradient đỏ rực, trăng máu khổng lồ)</option>
                    <option value="foggy_night">Đêm Sương Lạnh Buốt (foggy_night - Gradient đen tím lạnh, trăng mờ nhạt)</option>
                    <option value="stormy_dark">Bão Đêm Sấm Chớp (stormy_dark - Trời dông tối om, chớp giật)</option>
                    <option value="eclipse_abyss">Nhật Thực Hắc Ám & Ma Trơi (eclipse_abyss - Lửa xanh lân tinh)</option>
                    <option value="flickering_fluorescent">Đèn Tuýp Huỳnh Quang Chập Chờn (flickering_fluorescent - Bệnh viện, siêu thị)</option>
                    <option value="dim_indoor_night">Ánh Vàng Đêm Mờ Ảo (dim_indoor_night - Khách sạn, nhà hàng)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-4 bg-black/40 border border-neutral-800/80 p-4 rounded-xl">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-neutral-300">
                    <span>Mật độ sương mù (Fog Density):</span>
                    <span className="font-mono text-cyan-400">{scene.lighting.fog_density.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={scene.lighting.fog_density}
                    onChange={(e) =>
                      onChangeScene({
                        ...scene,
                        lighting: {
                          ...scene.lighting,
                          fog_density: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-red-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-neutral-300">
                    Chớp Giật Sấm Sét (Thunder Flash):
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(scene.lighting.thunder_flash)}
                    onChange={(e) =>
                      onChangeScene({
                        ...scene,
                        lighting: {
                          ...scene.lighting,
                          thunder_flash: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

          {/* TAB 4: STORY & DIALOGUE */}
          {activeTab === "story" && (
            <div className="flex flex-col gap-4">
              {/* Scene Duration Control */}
              <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-cyan-200 block">
                      Thời Lượng Cảnh Này (duration_sec):
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      Quy định thời gian phát trước khi tự chuyển cảnh, tổng chiều dài timeline A → B và thời lượng xuất video.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      step="0.5"
                      value={sceneDuration}
                      onChange={(e) => updateSceneDuration(parseFloat(e.target.value))}
                      className="w-16 bg-black border border-cyan-700/70 rounded-lg px-2 py-1 text-center text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-xs text-neutral-300">giây</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={Math.min(30, sceneDuration)}
                  onChange={(e) => updateSceneDuration(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-neutral-400 mr-1">Mốc nhanh:</span>
                  {[3, 5, 6, 8, 10, 15].map((sec) => (
                    <button
                      key={`dur-preset-${sec}`}
                      onClick={() => updateSceneDuration(sec)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
                        sceneDuration === sec
                          ? "bg-cyan-700 border-cyan-400 text-white font-bold"
                          : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Tiêu Đề Cảnh:
                </label>
                <input
                  type="text"
                  value={scene.title || ""}
                  onChange={(e) => onChangeScene({ ...scene, title: e.target.value })}
                  placeholder="Ví dụ: Cảnh 1: Lạc Bước Bãi Tha Ma"
                  className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Lời Thoại / Phụ Đề Điện Ảnh (Hiển thị đáy màn hình):
                </label>
                <input
                  type="text"
                  value={scene.dialogue || ""}
                  onChange={(e) => onChangeScene({ ...scene, dialogue: e.target.value })}
                  placeholder="Lời thoại rùng rợn..."
                  className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Ghi Chú Đạo Diễn / Diễn Biến Cảnh:
                </label>
                <textarea
                  value={scene.narrative_note || ""}
                  onChange={(e) => onChangeScene({ ...scene, narrative_note: e.target.value })}
                  rows={3}
                  placeholder="Ghi chú bối cảnh và cảm xúc nhân vật..."
                  className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

              {/* AI Direct Description Action & Environment Library */}
              <div className="mt-2 bg-gradient-to-br from-purple-950/40 via-red-950/30 to-black border border-purple-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-purple-950/20">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Compass className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">
                        Cỗ Máy Tạo Video 2D Theo Mô Tả Trực Tiếp (Gemini)
                      </h4>
                      <span className="text-[10px] bg-purple-900/80 text-purple-200 border border-purple-700/60 px-1.5 py-0.2 rounded font-mono">
                        Khóa Bối Cảnh
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Mô tả trực tiếp nhân vật làm gì trong scene (vd: "Cho lữ khách cầm đèn bão chạy hoảng loạn từ trái sang phải, bóng ma bay phía sau") để AI bố trí ngay!
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenAiDirector?.("environments_manager")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-all"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-300" />
                    <span>Thư Viện Bối Cảnh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAiDirector?.("re_direct_scene")}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-purple-950/50 border border-purple-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>✨ AI Bố Trí Cảnh Này</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
