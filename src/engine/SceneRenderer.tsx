import React, { useState, useRef, useEffect } from "react";
import type {
  DirectorSceneScript,
  GroundSlotId,
  SelectedEntity,
  SlotId,
} from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y, ALL_SLOTS } from "./constants";
import { getSlotCoordinates } from "./layoutRouter";
import {
  STRUCTURE_RULES,
  DETAIL_RULES,
  coordsToSlotAssignment,
  findNearestAllowedSlot,
  getAllowedSlotsForActor,
  getAllowedSlotsForDetail,
  getAllowedSlotsForStructure,
  getSlotType,
  isSlotAllowed,
  supportsContinuousAirPlacement,
  supportsContinuousGroundPlacement,
} from "./placementRules";
import { SvgDefs } from "./graphics/SvgDefs";
import { SkyLayer, BackgroundLayer, MainGroundLayer, ForegroundLayer } from "./graphics/Environments";
import { StructureRenderer } from "./graphics/Structures";
import { CharacterRig } from "./graphics/CharacterRig";
import { DetailRenderer } from "./graphics/Details";
import { soundEngine } from "./AudioSynthesizer";
import { evaluateActorAtTime } from "./motionUtils";

export type DragSnapMode = "strict_slot" | "allowed_offset";

interface SceneRendererProps {
  script: DirectorSceneScript;
  showGizmo?: boolean;
  showSubtitles?: boolean;
  currentTime?: number;
  selectedEntity?: SelectedEntity;
  activeActorId?: string | null;
  activeMotionHandle?: "start" | "target";
  interactiveDrag?: boolean;
  dragSnapMode?: DragSnapMode;
  onSelectEntity?: (entity: SelectedEntity) => void;
  onSelectActor?: (actorId: string) => void;
  onSelectSlot?: (slotId: SlotId) => void;
  onUpdateActorPosition?: (actorId: string, slot: SlotId, offsetX: number, offsetY: number) => void;
  onUpdateActorTargetPosition?: (actorId: string, targetSlot: SlotId, targetOffsetX: number, targetOffsetY: number) => void;
  onUpdateStructurePosition?: (structIndex: number, slot: GroundSlotId, offsetX: number, offsetY: number) => void;
  onUpdateDetailPosition?: (detailId: string, slot: SlotId, offsetX: number, offsetY: number) => void;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

interface DragSession {
  type: "actor" | "actor_target" | "structure" | "detail";
  id: string; // actorId, detailId, or String(index)
  index?: number;
  entityLabel: string;
  allowedSlots: SlotId[];
  ruleReason: string;
  initialPointerSvg: { x: number; y: number };
  initialEntityCoords: { x: number; y: number };
  currentCoords: { x: number; y: number };
  candidateSlot: SlotId;
  offsetX: number;
  offsetY: number;
  isSnapped: boolean;
  isOverAllowedZone: boolean;
  hasMoved: boolean;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  script,
  showGizmo = false,
  showSubtitles = true,
  currentTime,
  selectedEntity,
  activeActorId = null,
  activeMotionHandle = "start",
  interactiveDrag = true,
  dragSnapMode = "allowed_offset",
  onSelectEntity,
  onSelectActor,
  onSelectSlot,
  onUpdateActorPosition,
  onUpdateActorTargetPosition,
  onUpdateStructurePosition,
  onUpdateDetailPosition,
  svgRef: externalSvgRef,
}) => {
  const { theme, lighting, environment_items = [], actors = [], details = [], dialogue } = script;
  const internalSvgRef = useRef<SVGSVGElement | null>(null);
  const activeSvgRef = externalSvgRef || internalSvgRef;

  const [dragSession, setDragSession] = useState<DragSession | null>(null);
  const dragSessionRef = useRef<DragSession | null>(null);
  const lastSnapRef = useRef<boolean>(false);

  const effectiveSelection: SelectedEntity =
    selectedEntity !== undefined
      ? selectedEntity
      : activeActorId
      ? { type: "actor", id: activeActorId }
      : null;

  const getSelectionRuleInfo = (
    entity: SelectedEntity
  ): { allowedSlots: SlotId[]; reason: string; label: string } | null => {
    if (!entity) return null;
    if (entity.type === "actor") {
      const actor = actors.find((a) => a.id === entity.id);
      if (!actor) return null;
      const rule = getAllowedSlotsForActor(actor);
      return { ...rule, label: `Nhân vật: ${actor.id}` };
    }
    if (entity.type === "structure") {
      const struct = environment_items[entity.index];
      if (!struct) return null;
      const rule = getAllowedSlotsForStructure(struct.asset_id);
      return { ...rule, label: `Công trình: ${STRUCTURE_RULES[struct.asset_id].name}` };
    }
    const detail = details.find((d) => d.id === entity.id);
    if (!detail) return null;
    const rule = getAllowedSlotsForDetail(detail.asset_id);
    return { ...rule, label: `Chi tiết: ${DETAIL_RULES[detail.asset_id].name}` };
  };

  const activeSelectionRules = getSelectionRuleInfo(effectiveSelection);
  const activeRuleAllowedSlots = dragSession?.allowedSlots ?? activeSelectionRules?.allowedSlots ?? null;

  // Helper: Convert client PointerEvent to SVG ViewBox (0..1920, 0..1080) coordinates
  const getSvgCoordinates = (e: React.PointerEvent | PointerEvent): { x: number; y: number } => {
    const svg = activeSvgRef.current;
    if (!svg) return { x: e.clientX, y: e.clientY };

    try {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (ctm) {
        const transformed = pt.matrixTransform(ctm.inverse());
        return { x: transformed.x, y: transformed.y };
      }
    } catch {
      // Fallback
    }

    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    };
  };

  const selectAndStartDrag = (
    e: React.PointerEvent,
    entity: Exclude<SelectedEntity, null>,
    entityCoords: { x: number; y: number },
    currentSlot: SlotId,
    offsetX = 0,
    offsetY = 0,
    sessionTypeOverride?: DragSession["type"]
  ) => {
    const rule = getSelectionRuleInfo(entity);
    if (!rule) return;

    if (onSelectEntity) onSelectEntity(entity);
    if (entity.type === "actor" && onSelectActor) onSelectActor(entity.id);

    const svgPt = getSvgCoordinates(e);

    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // In case element capture is not supported
    }

    const sessionType = sessionTypeOverride || entity.type;

    const session: DragSession = {
      type: sessionType,
      id: entity.type === "structure" ? String(entity.index) : entity.id,
      index: entity.type === "structure" ? entity.index : undefined,
      entityLabel:
        sessionType === "actor_target" && entity.type === "actor"
          ? `Đích B: ${entity.id}`
          : rule.label,
      allowedSlots: rule.allowedSlots,
      ruleReason: rule.reason,
      initialPointerSvg: svgPt,
      initialEntityCoords: entityCoords,
      currentCoords: entityCoords,
      candidateSlot: isSlotAllowed(currentSlot, rule.allowedSlots)
        ? currentSlot
        : findNearestAllowedSlot(entityCoords.x, entityCoords.y, rule.allowedSlots).slot.id,
      offsetX,
      offsetY,
      isSnapped: offsetX === 0 && offsetY === 0,
      isOverAllowedZone: true,
      hasMoved: false,
    };

    dragSessionRef.current = session;
    setDragSession(session);
    lastSnapRef.current = false;
  };

  // Start dragging Actor (Point A)
  const handleActorPointerDown = (e: React.PointerEvent, actorId: string) => {
    if (!interactiveDrag) return;
    e.stopPropagation();

    const actor = actors.find((a) => a.id === actorId);
    if (!actor) return;

    const actorCoords = getSlotCoordinates(actor.slot, actor.offsetX, actor.offsetY);
    selectAndStartDrag(
      e,
      { type: "actor", id: actorId },
      actorCoords,
      actor.slot,
      actor.offsetX || 0,
      actor.offsetY || 0
    );
  };

  // Start dragging Actor Motion Destination (Point B)
  const handleActorTargetPointerDown = (e: React.PointerEvent, actorId: string) => {
    if (!interactiveDrag) return;
    e.stopPropagation();

    const actor = actors.find((a) => a.id === actorId);
    if (!actor || !actor.motion) return;

    const targetCoords = getSlotCoordinates(
      actor.motion.targetSlot,
      actor.motion.targetOffsetX,
      actor.motion.targetOffsetY
    );
    selectAndStartDrag(
      e,
      { type: "actor", id: actorId },
      targetCoords,
      actor.motion.targetSlot,
      actor.motion.targetOffsetX || 0,
      actor.motion.targetOffsetY || 0,
      "actor_target"
    );
  };

  // Start dragging Structure
  const handleStructurePointerDown = (e: React.PointerEvent, index: number) => {
    if (!interactiveDrag) return;
    e.stopPropagation();

    const struct = environment_items[index];
    if (!struct) return;

    const structCoords = getSlotCoordinates(struct.slot, struct.offsetX, struct.offsetY);
    selectAndStartDrag(
      e,
      { type: "structure", index },
      structCoords,
      struct.slot,
      struct.offsetX || 0,
      struct.offsetY || 0
    );
  };

  // Start dragging Detail / Scene Prop
  const handleDetailPointerDown = (e: React.PointerEvent, detailId: string) => {
    if (!interactiveDrag) return;
    e.stopPropagation();

    const detail = details.find((d) => d.id === detailId);
    if (!detail) return;

    const detailCoords = getSlotCoordinates(detail.slot, detail.offsetX, detail.offsetY);
    selectAndStartDrag(
      e,
      { type: "detail", id: detailId },
      detailCoords,
      detail.slot,
      detail.offsetX || 0,
      detail.offsetY || 0
    );
  };

  // Commit drag to parent state ONLY on release and strictly within allowed slots
  const commitDragSession = () => {
    const session = dragSessionRef.current;
    if (!session) return;

    dragSessionRef.current = null;
    setDragSession(null);

    if (!session.hasMoved) return;

    const finalSlot = session.candidateSlot;
    const useZeroOffset = dragSnapMode === "strict_slot" || !session.isOverAllowedZone;
    const finalOffsetX = useZeroOffset ? 0 : session.offsetX;
    const finalOffsetY =
      useZeroOffset || getSlotType(finalSlot) === "ground" ? 0 : session.offsetY;

    if (useZeroOffset) {
      soundEngine.triggerSnapClick();
    }

    if (session.type === "actor" && onUpdateActorPosition) {
      onUpdateActorPosition(session.id, finalSlot, finalOffsetX, finalOffsetY);
    } else if (session.type === "actor_target" && onUpdateActorTargetPosition) {
      onUpdateActorTargetPosition(session.id, finalSlot, finalOffsetX, finalOffsetY);
    } else if (
      session.type === "structure" &&
      onUpdateStructurePosition &&
      session.index !== undefined
    ) {
      onUpdateStructurePosition(session.index, finalSlot as GroundSlotId, finalOffsetX, 0);
    } else if (session.type === "detail" && onUpdateDetailPosition) {
      onUpdateDetailPosition(session.id, finalSlot, finalOffsetX, finalOffsetY);
    }
  };

  // Click anywhere along continuous Ground Line Y = 800px to place selected actor (Point A/B) or detail there
  const handleGroundRunwayClick = (e: React.MouseEvent) => {
    if (!interactiveDrag || !effectiveSelection || !activeRuleAllowedSlots) return;
    if (!supportsContinuousGroundPlacement(activeRuleAllowedSlots)) return;
    e.stopPropagation();

    const pt = getSvgCoordinates(e as unknown as React.PointerEvent);
    const clickX = Math.max(80, Math.min(1840, Math.round(pt.x)));
    const assigned =
      dragSnapMode === "strict_slot"
        ? { slot: findNearestAllowedSlot(clickX, GROUND_Y, activeRuleAllowedSlots).slot.id, offsetX: 0, offsetY: 0 }
        : coordsToSlotAssignment(clickX, GROUND_Y, activeRuleAllowedSlots);

    soundEngine.triggerSnapClick();

    if (effectiveSelection.type === "actor") {
      if (activeMotionHandle === "target" && onUpdateActorTargetPosition) {
        onUpdateActorTargetPosition(effectiveSelection.id, assigned.slot, assigned.offsetX, 0);
      } else if (onUpdateActorPosition) {
        onUpdateActorPosition(effectiveSelection.id, assigned.slot, assigned.offsetX, 0);
      }
    } else if (effectiveSelection.type === "detail" && onUpdateDetailPosition) {
      onUpdateDetailPosition(effectiveSelection.id, assigned.slot, assigned.offsetX, 0);
    }
  };

  // Move drag handler (supports continuous ground/air placement & constrained structure slots)
  const handleSvgPointerMove = (e: React.PointerEvent) => {
    const session = dragSessionRef.current;
    if (!session) return;
    e.preventDefault();

    const currSvg = getSvgCoordinates(e);
    const dx = currSvg.x - session.initialPointerSvg.x;
    const dy = currSvg.y - session.initialPointerSvg.y;
    const hasMoved = session.hasMoved || Math.hypot(dx, dy) > 4;

    const targetX = Math.max(80, Math.min(1840, session.initialEntityCoords.x + dx));
    let targetY = Math.max(130, Math.min(GROUND_Y + 60, session.initialEntityCoords.y + dy));

    const hasGroundAllowed = session.allowedSlots.some((s) => getSlotType(s) === "ground");
    const hasAirAllowed = session.allowedSlots.some((s) => getSlotType(s) === "air");
    const isContinuousGround = supportsContinuousGroundPlacement(session.allowedSlots);
    const isContinuousAir = supportsContinuousAirPlacement(session.allowedSlots);

    // Lock entity onto its allowed height/plane
    if (hasGroundAllowed && !hasAirAllowed) {
      targetY = GROUND_Y;
    } else if (hasAirAllowed && !hasGroundAllowed) {
      targetY = Math.max(140, Math.min(480, targetY));
    } else if (targetY > 640) {
      targetY = GROUND_Y;
    } else {
      targetY = Math.max(140, Math.min(580, targetY));
    }

    const isOnContinuousPlane =
      (targetY === GROUND_Y && isContinuousGround) ||
      (targetY < GROUND_Y && isContinuousAir);

    // Closest ALLOWED slot
    const { slot: closestAllowed, distance: allowedDist } = findNearestAllowedSlot(
      targetX,
      targetY,
      session.allowedSlots
    );

    // Detect hover near a FORBIDDEN slot (only when not moving along a continuous allowed plane)
    const hoveringDisallowed = isOnContinuousPlane
      ? false
      : Object.values(ALL_SLOTS).some(
          (s) =>
            !isSlotAllowed(s.id, session.allowedSlots) &&
            Math.hypot(targetX - s.x, targetY - s.y) < 115
        );

    const isSnapped =
      dragSnapMode === "strict_slot"
        ? allowedDist < 130 && !hoveringDisallowed
        : false;

    const isOverAllowedZone =
      dragSnapMode === "strict_slot"
        ? !hoveringDisallowed && allowedDist < 240
        : isOnContinuousPlane || !hoveringDisallowed;

    let finalX: number;
    let finalY: number;
    let offsetX = 0;
    let offsetY = 0;

    if (isSnapped) {
      finalX = closestAllowed.x;
      finalY = closestAllowed.y;
    } else if (dragSnapMode === "strict_slot") {
      // Smooth cursor preview while showing snap target back to closestAllowed
      finalX = targetX;
      finalY = targetY;
    } else if (isOnContinuousPlane) {
      // Free continuous placement ANYWHERE along Ground Line Y=800 (or continuous Air space)
      const assigned = coordsToSlotAssignment(targetX, targetY, session.allowedSlots);
      finalX = targetX;
      finalY = targetY;
      offsetX = assigned.offsetX;
      offsetY = assigned.offsetY;
    } else {
      // Partially constrained asset (e.g. structure or incense bowl limited to specific anchors)
      const clampedX = Math.max(-200, Math.min(200, Math.round(targetX - closestAllowed.x)));
      const clampedY =
        getSlotType(closestAllowed.id) === "ground"
          ? 0
          : Math.max(-160, Math.min(180, Math.round(targetY - closestAllowed.y)));
      finalX = Math.max(80, Math.min(1840, closestAllowed.x + clampedX));
      finalY = closestAllowed.y + clampedY;
      offsetX = Math.round(finalX - closestAllowed.x);
      offsetY = clampedY;
    }

    if (isSnapped && !lastSnapRef.current) {
      soundEngine.triggerSnapClick();
    }
    lastSnapRef.current = isSnapped;

    const nextSession: DragSession = {
      ...session,
      currentCoords: { x: finalX, y: finalY },
      candidateSlot: closestAllowed.id,
      offsetX,
      offsetY,
      isSnapped,
      isOverAllowedZone,
      hasMoved,
    };

    dragSessionRef.current = nextSession;
    setDragSession(nextSession);
  };

  // End drag
  const handleSvgPointerUp = (e: React.PointerEvent) => {
    if (dragSessionRef.current) {
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Safe catch
      }
      commitDragSession();
    }
  };

  // Cleanup drag if pointer leaves or cancels
  useEffect(() => {
    const handleGlobalUp = () => commitDragSession();
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  });

  return (
    <div
      className={`relative w-full aspect-video select-none overflow-hidden bg-black shadow-2xl rounded-lg border border-neutral-800 ${
        dragSession ? "cursor-grabbing" : ""
      }`}
    >
      <svg
        ref={activeSvgRef}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        onPointerMove={handleSvgPointerMove}
        onPointerUp={handleSvgPointerUp}
      >
        {/* COMMON SVG DEFINITIONS */}
        <SvgDefs />

        {/* LAYER 0 (z-index 0): SKY, MOON, CLOUDS, THUNDER */}
        <g id="layer-0-sky">
          <SkyLayer
            skyPreset={lighting.sky_preset}
            thunderFlash={lighting.thunder_flash}
          />
        </g>

        {/* LAYER 1 (z-index 10): DISTANT BACKGROUND */}
        <g id="layer-1-background">
          <BackgroundLayer
            theme={theme}
            skyPreset={lighting.sky_preset}
          />
        </g>

        {/* LAYER 2 (z-index 20): MAIN GROUND & MIDGROUND OBJECTS */}
        <g id="layer-2-ground-world">
          {/* Main Ground Surface */}
          <MainGroundLayer theme={theme} />

          {/* Interactive Click-Anywhere Ground Line Runway (underneath entities so drags always take priority) */}
          {interactiveDrag &&
            activeRuleAllowedSlots &&
            supportsContinuousGroundPlacement(activeRuleAllowedSlots) && (
              <rect
                x="60"
                y={GROUND_Y - 22}
                width="1800"
                height="44"
                rx="8"
                fill="rgba(16, 185, 129, 0.08)"
                className="cursor-crosshair"
                onClick={handleGroundRunwayClick}
              />
            )}

          {/* Environment Structures */}
          <g id="structures-group">
            {environment_items.map((item, index) => {
              const coords = getSlotCoordinates(item.slot, item.offsetX, item.offsetY);
              const isSelected =
                effectiveSelection?.type === "structure" && effectiveSelection.index === index;
              const isBeingDragged = dragSession?.type === "structure" && dragSession.index === index;
              const displayCoords = isBeingDragged ? dragSession.currentCoords : coords;

              return (
                <g
                  key={`struct-${item.asset_id}-${index}`}
                  transform={`translate(${displayCoords.x}, ${displayCoords.y})`}
                  className={`${interactiveDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                  onPointerDown={(e) => handleStructurePointerDown(e, index)}
                >
                  {interactiveDrag && (
                    <rect x="-130" y="-280" width="260" height="290" fill="transparent" />
                  )}

                  {/* Selection / Drag Highlight Ring */}
                  {(isSelected || isBeingDragged) && (
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="82"
                      ry="18"
                      fill="none"
                      stroke={
                        isBeingDragged
                          ? dragSession.isOverAllowedZone
                            ? "#10B981"
                            : "#EF4444"
                          : "#34D399"
                      }
                      strokeWidth="3.5"
                      strokeDasharray="7,4"
                      className="anim-pulse-slow"
                    />
                  )}

                  <StructureRenderer
                    id={item.asset_id}
                    scale={item.scale || 1}
                    showAnchor={showGizmo || isSelected || isBeingDragged}
                  />

                  {(showGizmo || isSelected) && !isBeingDragged && (
                    <text
                      x="0"
                      y="-240"
                      textAnchor="middle"
                      fill="#A7F3D0"
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))"
                    >
                      #{index + 1} {item.asset_id} ({item.slot})
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Motion Trajectories (A -> B Path Lines in Editor/Gizmo Mode) */}
          {(interactiveDrag || showGizmo) && (
            <g id="motion-trajectories-group" pointerEvents="none">
              {actors.map((actor) => {
                if (!actor.motion) return null;
                const evaluated = evaluateActorAtTime(actor, currentTime, script.duration_sec || 6);
                const isSelected = effectiveSelection?.type === "actor" && effectiveSelection.id === actor.id;
                const isDraggingA = dragSession?.type === "actor" && dragSession.id === actor.id;
                const isDraggingB = dragSession?.type === "actor_target" && dragSession.id === actor.id;

                const startPt = isDraggingA ? dragSession.currentCoords : evaluated.pointA;
                const endPt = isDraggingB ? dragSession.currentCoords : evaluated.pointB;
                const dx = endPt.x - startPt.x;
                const dy = endPt.y - startPt.y;
                const dist = Math.hypot(dx, dy);

                return (
                  <g key={`motion-path-${actor.id}`} opacity={isSelected || isDraggingA || isDraggingB ? 0.95 : 0.45}>
                    {/* Dashed Path from A to B */}
                    <line
                      x1={startPt.x}
                      y1={startPt.y - 110}
                      x2={endPt.x}
                      y2={endPt.y - 110}
                      stroke="#22D3EE"
                      strokeWidth={isSelected || isDraggingB ? "3" : "2"}
                      strokeDasharray="10,7"
                    />
                    <line
                      x1={startPt.x}
                      y1={startPt.y}
                      x2={endPt.x}
                      y2={endPt.y}
                      stroke="#22D3EE"
                      strokeWidth="1.5"
                      strokeDasharray="5,5"
                      opacity="0.6"
                    />

                    {/* Start Marker A */}
                    <circle cx={startPt.x} cy={startPt.y} r="7" fill="#10B981" stroke="#022C22" strokeWidth="2" />
                    <text
                      x={startPt.x}
                      y={startPt.y + 24}
                      textAnchor="middle"
                      fill="#6EE7B7"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      A ({Math.round(startPt.x)})
                    </text>

                    {/* Midpoint Arrow Direction Indicator */}
                    {dist > 40 && (
                      <g
                        transform={`translate(${(startPt.x + endPt.x) / 2}, ${(startPt.y + endPt.y) / 2 - 110}) rotate(${(Math.atan2(dy, dx) * 180) / Math.PI})`}
                      >
                        <polygon points="-8,-6 10,0 -8,6 -4,0" fill="#22D3EE" />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Actors / Modular Character Rigs */}
          <g id="actors-group">
            {actors.map((actor) => {
              const evaluated = evaluateActorAtTime(actor, currentTime, script.duration_sec || 6);
              const isSelected = effectiveSelection?.type === "actor" && effectiveSelection.id === actor.id;
              const isBeingDragged = dragSession?.type === "actor" && dragSession.id === actor.id;
              const displayCoords = isBeingDragged ? dragSession.currentCoords : evaluated.coords;

              return (
                <g
                  key={`actor-${actor.id}`}
                  transform={`translate(${displayCoords.x}, ${displayCoords.y})`}
                  className={`${interactiveDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                  onPointerDown={(e) => handleActorPointerDown(e, actor.id)}
                >
                  {interactiveDrag && (
                    <rect x="-60" y="-305" width="120" height="320" fill="transparent" />
                  )}

                  {/* Selection / Drag Highlight Ring */}
                  {(isSelected || isBeingDragged) && (
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="52"
                      ry="15"
                      fill="none"
                      stroke={
                        isBeingDragged
                          ? dragSession.isOverAllowedZone
                            ? "#10B981"
                            : "#EF4444"
                          : "#EF4444"
                      }
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                      className="anim-pulse-slow"
                    />
                  )}

                  {/* Character Rig */}
                  <CharacterRig
                    id={actor.id}
                    base={actor.base}
                    costume={actor.costume}
                    face={actor.face}
                    pose={evaluated.pose}
                    facing={evaluated.facing}
                    scale={actor.scale || 1}
                    opacity={actor.opacity !== undefined ? actor.opacity : 1}
                    heldItem={actor.heldItem}
                    heldHand={actor.heldHand}
                    showSockets={showGizmo || isSelected || isBeingDragged}
                  />

                  {/* Label in Debug/Gizmo Mode */}
                  {(showGizmo || isSelected) && !isBeingDragged && (
                    <text
                      x="0"
                      y="-310"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="monospace"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                    >
                      {actor.id} ({actor.slot}{evaluated.hasMotion ? " → B" : ""})
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Draggable Destination Handles (Point B Ghosts in Interactive Editor Mode) */}
          {interactiveDrag && (
            <g id="motion-targets-group">
              {actors.map((actor) => {
                if (!actor.motion) return null;
                const evaluated = evaluateActorAtTime(actor, currentTime, script.duration_sec || 6);
                const isSelected = effectiveSelection?.type === "actor" && effectiveSelection.id === actor.id;
                const isDraggingB = dragSession?.type === "actor_target" && dragSession.id === actor.id;
                const displayB = isDraggingB ? dragSession.currentCoords : evaluated.pointB;
                const ghostFacing =
                  actor.motion.autoFaceTarget !== false && Math.abs(displayB.x - evaluated.pointA.x) > 4
                    ? displayB.x >= evaluated.pointA.x
                      ? "right"
                      : "left"
                    : actor.facing;

                return (
                  <g
                    key={`motion-target-${actor.id}`}
                    transform={`translate(${displayB.x}, ${displayB.y})`}
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => handleActorTargetPointerDown(e, actor.id)}
                  >
                    <rect x="-56" y="-305" width="112" height="320" fill="transparent" />

                    {/* Ghost Silhouette at Point B */}
                    <CharacterRig
                      id={`ghost-b-${actor.id}`}
                      base={actor.base}
                      costume={actor.costume}
                      face={actor.face}
                      pose={actor.motion.movingPose || actor.pose}
                      facing={ghostFacing}
                      scale={actor.scale || 1}
                      opacity={isSelected || isDraggingB ? 0.36 : 0.18}
                      heldItem={actor.heldItem}
                      heldHand={actor.heldHand}
                      showSockets={false}
                    />

                    {/* Target Ring & Pin */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="46"
                      ry="13"
                      fill="rgba(34, 211, 238, 0.14)"
                      stroke={isDraggingB && !dragSession.isOverAllowedZone ? "#EF4444" : "#22D3EE"}
                      strokeWidth={isSelected || isDraggingB ? "3" : "2"}
                      strokeDasharray="6,4"
                    />
                    <circle cx="0" cy="0" r="8" fill="#22D3EE" stroke="#083344" strokeWidth="2.5" />

                    {/* Interactive Handle Badge */}
                    <g transform="translate(0, -312)">
                      <rect
                        x="-58"
                        y="-16"
                        width="116"
                        height="24"
                        rx="6"
                        fill={isSelected && activeMotionHandle === "target" ? "#0891B2" : "#082F49"}
                        stroke="#22D3EE"
                        strokeWidth="1.8"
                      />
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill="#ECFEFF"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {`ĐÍCH B (${Math.round(displayB.x)})`}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {/* Scene Details / Horror Props */}
          <g id="details-group">
            {details.map((detail) => {
              const coords = getSlotCoordinates(detail.slot, detail.offsetX, detail.offsetY);
              const isSelected = effectiveSelection?.type === "detail" && effectiveSelection.id === detail.id;
              const isBeingDragged = dragSession?.type === "detail" && dragSession.id === detail.id;
              const displayCoords = isBeingDragged ? dragSession.currentCoords : coords;

              return (
                <g
                  key={`detail-${detail.id}`}
                  transform={`translate(${displayCoords.x}, ${displayCoords.y})`}
                  className={`${interactiveDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                  onPointerDown={(e) => handleDetailPointerDown(e, detail.id)}
                >
                  {interactiveDrag && (
                    <rect x="-70" y="-140" width="140" height="165" fill="transparent" />
                  )}

                  {(isSelected || isBeingDragged) && (
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="42"
                      ry="12"
                      fill="none"
                      stroke={
                        isBeingDragged
                          ? dragSession.isOverAllowedZone
                            ? "#10B981"
                            : "#EF4444"
                          : "#F59E0B"
                      }
                      strokeWidth="3"
                      strokeDasharray="5,4"
                      className="anim-pulse-slow"
                    />
                  )}

                  <DetailRenderer
                    id={detail.asset_id}
                    scale={detail.scale || 1}
                    showAnchor={showGizmo || isSelected || isBeingDragged}
                  />

                  {(showGizmo || isSelected) && !isBeingDragged && (
                    <text
                      x="0"
                      y="-118"
                      textAnchor="middle"
                      fill="#FDE68A"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))"
                    >
                      {DETAIL_RULES[detail.asset_id].name} ({detail.slot})
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </g>

        {/* LAYER 3 (z-index 30): FOREGROUND MIST, DRY BRANCHES, VIGNETTE */}
        <g id="layer-3-foreground">
          <ForegroundLayer
            fogDensity={lighting.fog_density}
            skyPreset={lighting.sky_preset}
            theme={theme}
          />
        </g>

        {/* DEBUG GIZMO OVERLAY: GROUND PLANE & ALLOWED/LOCKED SLOT MARKERS */}
        {(showGizmo || Boolean(dragSession) || (interactiveDrag && Boolean(activeRuleAllowedSlots))) && (
          <g id="debug-gizmo-layer" pointerEvents="all">
            {/* Continuous Ground Runway Glow when Ground Line placement is allowed anywhere */}
            {activeRuleAllowedSlots && supportsContinuousGroundPlacement(activeRuleAllowedSlots) && (
              <line
                x1="80"
                y1={GROUND_Y}
                x2="1840"
                y2={GROUND_Y}
                stroke="#10B981"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.28"
                pointerEvents="none"
              />
            )}

            {/* Ground Plane Guide Line Y = 800px */}
            <line
              x1="0"
              y1={GROUND_Y}
              x2={CANVAS_WIDTH}
              y2={GROUND_Y}
              stroke="#10B981"
              strokeWidth="2.5"
              strokeDasharray="8,6"
              opacity={dragSession ? 0.95 : 0.8}
              pointerEvents="none"
            />
            <g pointerEvents="none">
              <rect x="20" y={GROUND_Y - 26} width="245" height="22" fill="#064E3B" rx="4" opacity="0.92" />
              <text x="28" y={GROUND_Y - 10} fill="#6EE7B7" fontSize="12" fontFamily="monospace" fontWeight="bold">
                {activeRuleAllowedSlots && supportsContinuousGroundPlacement(activeRuleAllowedSlots)
                  ? "LINE Y = 800px (ĐỨNG MỌI NƠI)"
                  : "GROUND PLANE Y = 800px"}
              </text>
            </g>

            {/* Slot Anchors Markers */}
            {Object.values(ALL_SLOTS).map((slot) => {
              const isGround = slot.type === "ground";
              const hasRule = Boolean(activeRuleAllowedSlots);
              const allowed = hasRule ? isSlotAllowed(slot.id, activeRuleAllowedSlots!) : true;
              const isTargetOfDrag = dragSession?.candidateSlot === slot.id;
              const isForbiddenHovered = Boolean(
                dragSession &&
                  !allowed &&
                  Math.hypot(dragSession.currentCoords.x - slot.x, dragSession.currentCoords.y - slot.y) < 115
              );

              const color = !allowed
                ? isForbiddenHovered
                  ? "#EF4444"
                  : "#991B1B"
                : hasRule
                ? "#10B981"
                : isGround
                ? "#10B981"
                : "#8B5CF6";

              return (
                <g
                  key={`gizmo-slot-${slot.id}`}
                  transform={`translate(${slot.x}, ${slot.y})`}
                  opacity={allowed ? 1 : isForbiddenHovered ? 0.95 : 0.45}
                  className={allowed ? "cursor-pointer" : "cursor-not-allowed"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (allowed && onSelectSlot) {
                      soundEngine.triggerSnapClick();
                      onSelectSlot(slot.id);
                    }
                  }}
                >
                  {/* Allowed Zone Drop Pad Highlight when an entity is selected or dragged */}
                  {allowed && hasRule && (
                    isGround ? (
                      <ellipse
                        cx="0"
                        cy="0"
                        rx="64"
                        ry="18"
                        fill={isTargetOfDrag ? "rgba(16, 185, 129, 0.28)" : "rgba(16, 185, 129, 0.12)"}
                        stroke="#10B981"
                        strokeWidth={isTargetOfDrag ? "3" : "1.8"}
                        strokeDasharray="6,4"
                      />
                    ) : (
                      <circle
                        cx="0"
                        cy="0"
                        r="48"
                        fill={isTargetOfDrag ? "rgba(16, 185, 129, 0.22)" : "rgba(16, 185, 129, 0.08)"}
                        stroke="#10B981"
                        strokeWidth={isTargetOfDrag ? "3" : "1.8"}
                        strokeDasharray="6,4"
                      />
                    )
                  )}

                  {/* Forbidden Slot Hover Warning Ring */}
                  {isForbiddenHovered && (
                    <circle
                      cx="0"
                      cy="0"
                      r="44"
                      fill="rgba(239, 68, 68, 0.18)"
                      stroke="#EF4444"
                      strokeWidth="3"
                      strokeDasharray="5,4"
                    />
                  )}

                  {/* Magnet Active Pulse Ring on destination allowed slot during drag */}
                  {isTargetOfDrag && allowed && (
                    <circle
                      cx="0"
                      cy="0"
                      r="36"
                      fill="none"
                      stroke={dragSession?.isSnapped ? "#34D399" : "#F59E0B"}
                      strokeWidth="3.5"
                      strokeDasharray="5,5"
                      className="anim-pulse-slow"
                    />
                  )}

                  {/* Slot Crosshair or Forbidden Cross */}
                  <circle cx="0" cy="0" r={isTargetOfDrag ? "18" : "14"} fill={color} opacity="0.28" />
                  <circle cx="0" cy="0" r={isTargetOfDrag ? "7" : "5"} fill={color} />
                  {allowed ? (
                    <>
                      <line x1="-15" y1="0" x2="15" y2="0" stroke={color} strokeWidth="2" />
                      <line x1="0" y1="-15" x2="0" y2="15" stroke={color} strokeWidth="2" />
                    </>
                  ) : (
                    <>
                      <line x1="-11" y1="-11" x2="11" y2="11" stroke="#EF4444" strokeWidth="2.5" />
                      <line x1="11" y1="-11" x2="-11" y2="11" stroke="#EF4444" strokeWidth="2.5" />
                    </>
                  )}

                  {/* Slot Tag Pill */}
                  <g transform={`translate(0, ${isGround ? 28 : -28})`}>
                    <rect
                      x="-74"
                      y="-13"
                      width="148"
                      height="26"
                      fill={!allowed ? "#1C0B0E" : "#071310"}
                      stroke={color}
                      strokeWidth={isTargetOfDrag || isForbiddenHovered ? "2.5" : "1.5"}
                      rx="5"
                      opacity="0.96"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={!allowed ? "#FCA5A5" : hasRule ? "#6EE7B7" : "#F3F4F6"}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {!allowed
                        ? `✕ ${slot.id} (KHÓA)`
                        : hasRule
                        ? `✓ ${slot.id}`
                        : `${slot.id} (${slot.x},${slot.y})`}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Rule Hint Banner inside stage when an entity is selected */}
            {interactiveDrag && activeSelectionRules && !dragSession && (
              <g transform={`translate(${CANVAS_WIDTH / 2}, 28)`} pointerEvents="none">
                <rect
                  x="-385"
                  y="-16"
                  width="770"
                  height="32"
                  rx="8"
                  fill="rgba(7, 10, 18, 0.88)"
                  stroke="rgba(16, 185, 129, 0.55)"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#A7F3D0"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {supportsContinuousGroundPlacement(activeSelectionRules.allowedSlots)
                    ? `${activeSelectionRules.label} — Kéo hoặc bấm bất kỳ điểm nào trên Line Xanh Y=800px`
                    : `${activeSelectionRules.label} — Bấm vùng ✓ Xanh hoặc Kéo Thả để đổi vị trí`}
                </text>
              </g>
            )}
          </g>
        )}

        {/* ACTIVE DRAG HUD & TETHER GUIDE */}
        {dragSession && (
          <g id="drag-feedback-hud" pointerEvents="none">
            {/* Only draw snap-back tether if over forbidden zone or in strict 5-slot snap mode */}
            {(!dragSession.isOverAllowedZone || dragSnapMode === "strict_slot") && (
              <line
                x1={dragSession.currentCoords.x}
                y1={dragSession.currentCoords.y}
                x2={ALL_SLOTS[dragSession.candidateSlot].x}
                y2={ALL_SLOTS[dragSession.candidateSlot].y}
                stroke={dragSession.isOverAllowedZone ? "#10B981" : "#EF4444"}
                strokeWidth="2.5"
                strokeDasharray="6,4"
                opacity="0.85"
              />
            )}

            {/* Vertical Ground Projection Line */}
            {dragSession.currentCoords.y < GROUND_Y && (
              <line
                x1={dragSession.currentCoords.x}
                y1={dragSession.currentCoords.y}
                x2={dragSession.currentCoords.x}
                y2={GROUND_Y}
                stroke={dragSession.isOverAllowedZone ? "#10B981" : "#EF4444"}
                strokeWidth="1.8"
                strokeDasharray="4,4"
                opacity="0.65"
              />
            )}

            {/* Ground Contact Ripple at Y=800 */}
            <ellipse
              cx={dragSession.currentCoords.x}
              cy={GROUND_Y}
              rx="34"
              ry="10"
              fill={dragSession.isOverAllowedZone ? "rgba(16, 185, 129, 0.35)" : "rgba(239, 68, 68, 0.35)"}
              stroke={dragSession.isOverAllowedZone ? "#10B981" : "#EF4444"}
              strokeWidth="2"
            />

            {/* Floating Info Badge HUD (clamped within 1920x1080 viewport) */}
            <g
              transform={`translate(${Math.max(210, Math.min(1710, dragSession.currentCoords.x))}, ${Math.max(
                44,
                Math.min(920, dragSession.currentCoords.y - (dragSession.type === "detail" ? 160 : 240))
              )})`}
            >
              <rect
                x="-210"
                y="-20"
                width="420"
                height="40"
                fill="#070A12"
                stroke={
                  dragSession.isSnapped || (dragSnapMode === "allowed_offset" && dragSession.isOverAllowedZone)
                    ? "#10B981"
                    : dragSession.isOverAllowedZone
                    ? "#F59E0B"
                    : "#EF4444"
                }
                strokeWidth="2"
                rx="8"
                filter="drop-shadow(0 4px 10px rgba(0,0,0,0.85))"
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill={
                  dragSession.isSnapped || (dragSnapMode === "allowed_offset" && dragSession.isOverAllowedZone)
                    ? "#34D399"
                    : dragSession.isOverAllowedZone
                    ? "#FBBF24"
                    : "#FCA5A5"
                }
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {dragSession.isSnapped
                  ? `🎯 HÚT VÀO ĐIỂM NEO: ${dragSession.candidateSlot.toUpperCase()}`
                  : !dragSession.isOverAllowedZone
                  ? `⚠ VÙNG BỊ KHÓA — TRẢ VỀ: ${dragSession.candidateSlot.toUpperCase()}`
                  : dragSession.type === "actor_target"
                  ? `🏁 ĐÍCH B (Tới ${dragSession.candidateSlot.toUpperCase()}): X=${Math.round(
                      dragSession.currentCoords.x
                    )}px${
                      dragSession.currentCoords.y === GROUND_Y
                        ? ", Y=800"
                        : `, Y=${Math.round(dragSession.currentCoords.y)}`
                    }`
                  : dragSnapMode === "allowed_offset"
                  ? `📍 ĐỨNG TẠI LINE: X=${Math.round(dragSession.currentCoords.x)}px (${
                      dragSession.currentCoords.y === GROUND_Y
                        ? "Y=800"
                        : `Y=${Math.round(dragSession.currentCoords.y)}`
                    })`
                  : `✓ ĐÍCH GẦN NHẤT: ${dragSession.candidateSlot.toUpperCase()} (X:${Math.round(
                      dragSession.currentCoords.x
                    )})`}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* HORROR SUBTITLE OVERLAY */}
      {showSubtitles && dialogue && (
        <div className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none px-6">
          <div className="max-w-3xl bg-neutral-950/80 backdrop-blur-sm border-y border-red-950/70 px-8 py-3 text-center rounded">
            <p className="text-red-100/90 text-lg md:text-xl font-serif tracking-wider italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              "{dialogue}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
