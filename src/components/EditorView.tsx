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
  EnvironmentItemConfig,
  DetailItemConfig,
  SelectedEntity,
} from "../engine/types";
import { SceneRenderer, type DragSnapMode } from "../engine/SceneRenderer";
import { ALL_SLOTS, GROUND_Y } from "../engine/constants";
import { getDefaultCostumeForBase, getSlotCoordinates } from "../engine/layoutRouter";
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
} from "lucide-react";

interface EditorViewProps {
  scene: DirectorSceneScript;
  onChangeScene: (updated: DirectorSceneScript) => void;
  onResetScene: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  scene,
  onChangeScene,
  onResetScene,
}) => {
  const [activeTab, setActiveTab] = useState<"actors" | "structures" | "details" | "lighting" | "story">("actors");
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>(() => {
    if (scene.actors.length > 0) return { type: "actor", id: scene.actors[0].id };
    if (scene.environment_items.length > 0) return { type: "structure", index: 0 };
    if (scene.details && scene.details.length > 0) return { type: "detail", id: scene.details[0].id };
    return null;
  });
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

  const selectEntityUnified = (entity: SelectedEntity) => {
    setSelectedEntity(entity);
    if (!entity) return;
    if (entity.type === "actor") {
      setSelectedActorId(entity.id);
      setActiveTab("actors");
    } else if (entity.type === "structure") {
      setSelectedStructureIdx(entity.index);
      setActiveTab("structures");
    } else {
      setSelectedDetailId(entity.id);
      setActiveTab("details");
    }
  };

  // Update Actor helper (auto-migrates slot if pose plane switches Ground <-> Air)
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
      }
      if (!isAirPose(merged.pose) && merged.offsetY) {
        merged.offsetY = 0;
      }
      return merged;
    });
    onChangeScene({ ...scene, actors: updatedActors });
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
          selectedEntity={selectedEntity}
          interactiveDrag={true}
          dragSnapMode={dragSnapMode}
          onSelectEntity={selectEntityUnified}
          onSelectSlot={(slotId) => moveSelectedEntityToSlot(slotId)}
          onUpdateActorPosition={(actorId, slot, offsetX, offsetY) => {
            updateActor(actorId, { slot, offsetX, offsetY });
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
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Bầu Trời & Trăng (Sky Preset):
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
          )}

          {/* TAB 4: STORY & DIALOGUE */}
          {activeTab === "story" && (
            <div className="flex flex-col gap-4">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
