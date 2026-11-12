import React, { useState, useRef, useEffect } from "react";
import type { DirectorSceneScript, SlotId, GroundSlotId } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y, ALL_SLOTS, GROUND_SLOTS, AIR_SLOTS } from "./constants";
import { getSlotCoordinates } from "./layoutRouter";
import { SvgDefs } from "./graphics/SvgDefs";
import { SkyLayer, BackgroundLayer, MainGroundLayer, ForegroundLayer } from "./graphics/Environments";
import { StructureRenderer } from "./graphics/Structures";
import { CharacterRig } from "./graphics/CharacterRig";
import { soundEngine } from "./AudioSynthesizer";

interface SceneRendererProps {
  script: DirectorSceneScript;
  showGizmo?: boolean;
  showSubtitles?: boolean;
  activeActorId?: string | null;
  interactiveDrag?: boolean;
  onSelectActor?: (actorId: string) => void;
  onSelectSlot?: (slotId: SlotId) => void;
  onUpdateActorPosition?: (actorId: string, slot: SlotId, offsetX: number, offsetY: number) => void;
  onUpdateStructurePosition?: (structIndex: number, slot: GroundSlotId, offsetX: number, offsetY: number) => void;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

interface DragSession {
  type: "actor" | "structure";
  id: string; // actorId or structure index
  index?: number;
  initialPointerSvg: { x: number; y: number };
  initialEntityCoords: { x: number; y: number };
  currentCoords: { x: number; y: number };
  candidateSlot: SlotId;
  isSnapped: boolean;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  script,
  showGizmo = false,
  showSubtitles = true,
  activeActorId = null,
  interactiveDrag = true,
  onSelectActor,
  onSelectSlot,
  onUpdateActorPosition,
  onUpdateStructurePosition,
  svgRef: externalSvgRef,
}) => {
  const { theme, lighting, environment_items = [], actors = [], dialogue } = script;
  const internalSvgRef = useRef<SVGSVGElement | null>(null);
  const activeSvgRef = externalSvgRef || internalSvgRef;

  const [dragSession, setDragSession] = useState<DragSession | null>(null);
  const lastSnapRef = useRef<boolean>(false);

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

  // Start dragging Actor
  const handleActorPointerDown = (e: React.PointerEvent, actorId: string) => {
    if (!interactiveDrag) return;
    e.stopPropagation();

    const actor = actors.find((a) => a.id === actorId);
    if (!actor) return;

    if (onSelectActor) onSelectActor(actorId);

    const svgPt = getSvgCoordinates(e);
    const actorCoords = getSlotCoordinates(actor.slot, actor.offsetX, actor.offsetY);

    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // In case element capture is not supported
    }

    setDragSession({
      type: "actor",
      id: actorId,
      initialPointerSvg: svgPt,
      initialEntityCoords: actorCoords,
      currentCoords: actorCoords,
      candidateSlot: actor.slot,
      isSnapped: (actor.offsetX || 0) === 0 && (actor.offsetY || 0) === 0,
    });
    lastSnapRef.current = false;
  };

  // Start dragging Structure
  const handleStructurePointerDown = (e: React.PointerEvent, index: number) => {
    if (!interactiveDrag) return;
    e.stopPropagation();

    const struct = environment_items[index];
    if (!struct) return;

    const svgPt = getSvgCoordinates(e);
    const structCoords = getSlotCoordinates(struct.slot, struct.offsetX, struct.offsetY);

    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // In case element capture is not supported
    }

    setDragSession({
      type: "structure",
      id: String(index),
      index,
      initialPointerSvg: svgPt,
      initialEntityCoords: structCoords,
      currentCoords: structCoords,
      candidateSlot: struct.slot,
      isSnapped: (struct.offsetX || 0) === 0 && (struct.offsetY || 0) === 0,
    });
    lastSnapRef.current = false;
  };

  // Move drag handler
  const handleSvgPointerMove = (e: React.PointerEvent) => {
    if (!dragSession) return;
    e.preventDefault();

    const currSvg = getSvgCoordinates(e);
    const dx = currSvg.x - dragSession.initialPointerSvg.x;
    const dy = currSvg.y - dragSession.initialPointerSvg.y;

    let targetX = dragSession.initialEntityCoords.x + dx;
    let targetY = dragSession.initialEntityCoords.y + dy;

    // Boundary constraints
    targetX = Math.max(120, Math.min(1800, targetX));

    if (dragSession.type === "structure") {
      // Structures are strictly grounded on Ground Plane Y = 800
      targetY = GROUND_Y;

      // Scan closest ground slot
      const slots = Object.values(GROUND_SLOTS);
      let closestSlot = slots[0];
      let minDist = Infinity;

      for (const slot of slots) {
        const dist = Math.abs(targetX - slot.x);
        if (dist < minDist) {
          minDist = dist;
          closestSlot = slot;
        }
      }

      // Magnetic snap threshold: 85px
      const isSnapped = minDist < 85;
      const finalX = isSnapped ? closestSlot.x : targetX;
      const offsetX = isSnapped ? 0 : Math.round(targetX - closestSlot.x);

      if (isSnapped && !lastSnapRef.current) {
        soundEngine.triggerSnapClick();
      }
      lastSnapRef.current = isSnapped;

      setDragSession((prev) =>
        prev
          ? {
              ...prev,
              currentCoords: { x: finalX, y: GROUND_Y },
              candidateSlot: closestSlot.id,
              isSnapped,
            }
          : null
      );

      if (onUpdateStructurePosition && dragSession.index !== undefined) {
        onUpdateStructurePosition(dragSession.index, closestSlot.id as GroundSlotId, offsetX, 0);
      }
    } else {
      // Dragging Actor
      const actor = actors.find((a) => a.id === dragSession.id);
      const isGhost = actor?.base === "ghost_wraith" || actor?.pose === "pose_floating";

      // If actor is dragged into upper zone or is ghost, check air slots
      let candidateSlots = Object.values(ALL_SLOTS);
      if (!isGhost && targetY > 580) {
        // Prioritize ground slots for ground characters
        candidateSlots = Object.values(GROUND_SLOTS);
        // Magnetic snap towards Ground Y=800 if within 60px of ground line
        if (Math.abs(targetY - GROUND_Y) < 60) {
          targetY = GROUND_Y;
        }
      } else if (targetY <= 520) {
        // Prioritize air slots in upper space
        candidateSlots = Object.values(AIR_SLOTS);
      }

      let closestSlot = candidateSlots[0];
      let minDist = Infinity;

      for (const slot of candidateSlots) {
        const dist = Math.hypot(targetX - slot.x, targetY - slot.y);
        if (dist < minDist) {
          minDist = dist;
          closestSlot = slot;
        }
      }

      // Magnetic snap threshold: 80px
      const isSnapped = minDist < 80;
      const finalX = isSnapped ? closestSlot.x : targetX;
      const finalY = isSnapped ? closestSlot.y : targetY;
      const offsetX = isSnapped ? 0 : Math.round(targetX - closestSlot.x);
      const offsetY = isSnapped ? 0 : Math.round(targetY - closestSlot.y);

      if (isSnapped && !lastSnapRef.current) {
        soundEngine.triggerSnapClick();
      }
      lastSnapRef.current = isSnapped;

      setDragSession((prev) =>
        prev
          ? {
              ...prev,
              currentCoords: { x: finalX, y: finalY },
              candidateSlot: closestSlot.id,
              isSnapped,
            }
          : null
      );

      if (onUpdateActorPosition) {
        onUpdateActorPosition(dragSession.id, closestSlot.id, offsetX, offsetY);
      }
    }
  };

  // End drag
  const handleSvgPointerUp = (e: React.PointerEvent) => {
    if (dragSession) {
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Safe catch
      }
      setDragSession(null);
    }
  };

  // Cleanup drag if pointer leaves or cancels
  useEffect(() => {
    const handleGlobalUp = () => setDragSession(null);
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  }, []);

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
          <MainGroundLayer />

          {/* Environment Structures */}
          <g id="structures-group">
            {environment_items.map((item, index) => {
              const coords = getSlotCoordinates(item.slot, item.offsetX, item.offsetY);
              const isBeingDragged = dragSession?.type === "structure" && dragSession.index === index;
              const displayCoords = isBeingDragged ? dragSession.currentCoords : coords;

              return (
                <g
                  key={`struct-${item.asset_id}-${index}`}
                  transform={`translate(${displayCoords.x}, ${displayCoords.y})`}
                  className={`${interactiveDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                  onPointerDown={(e) => handleStructurePointerDown(e, index)}
                >
                  {/* Subtle drag highlight */}
                  {isBeingDragged && (
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="70"
                      ry="15"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray="6,4"
                      className="anim-pulse-slow"
                    />
                  )}

                  <StructureRenderer
                    id={item.asset_id}
                    scale={item.scale || 1}
                    showAnchor={showGizmo || isBeingDragged}
                  />
                </g>
              );
            })}
          </g>

          {/* Actors / Modular Character Rigs */}
          <g id="actors-group">
            {actors.map((actor) => {
              const coords = getSlotCoordinates(actor.slot, actor.offsetX, actor.offsetY);
              const isSelected = activeActorId === actor.id;
              const isBeingDragged = dragSession?.type === "actor" && dragSession.id === actor.id;
              const displayCoords = isBeingDragged ? dragSession.currentCoords : coords;

              return (
                <g
                  key={`actor-${actor.id}`}
                  transform={`translate(${displayCoords.x}, ${displayCoords.y})`}
                  className={`${interactiveDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                  onPointerDown={(e) => handleActorPointerDown(e, actor.id)}
                >
                  {/* Selection / Drag Highlight Ring */}
                  {(isSelected || isBeingDragged) && (
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="48"
                      ry="14"
                      fill="none"
                      stroke={isBeingDragged ? "#10B981" : "#EF4444"}
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                      className="anim-pulse-slow"
                    />
                  )}

                  {/* Character Rig */}
                  <CharacterRig
                    id={actor.id}
                    base={actor.base}
                    face={actor.face}
                    pose={actor.pose}
                    facing={actor.facing}
                    scale={actor.scale || 1}
                    opacity={actor.opacity !== undefined ? actor.opacity : 1}
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
                      {actor.id} ({actor.slot})
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
          />
        </g>

        {/* DEBUG GIZMO OVERLAY: GROUND PLANE & SLOT MARKERS */}
        {(showGizmo || Boolean(dragSession)) && (
          <g id="debug-gizmo-layer" pointerEvents="all">
            {/* Ground Plane Guide Line Y = 800px */}
            <line
              x1="0"
              y1={GROUND_Y}
              x2={CANVAS_WIDTH}
              y2={GROUND_Y}
              stroke="#10B981"
              strokeWidth="2.5"
              strokeDasharray="8,6"
              opacity={dragSession ? 0.95 : 0.85}
            />
            <rect x="20" y={GROUND_Y - 26} width="190" height="22" fill="#064E3B" rx="4" opacity="0.9" />
            <text x="28" y={GROUND_Y - 10} fill="#6EE7B7" fontSize="13" fontFamily="monospace" fontWeight="bold">
              GROUND PLANE Y = 800px
            </text>

            {/* Slot Anchors Markers */}
            {Object.values(ALL_SLOTS).map((slot) => {
              const isGround = slot.type === "ground";
              const isTargetOfDrag = dragSession?.candidateSlot === slot.id;
              const color = isTargetOfDrag ? "#EF4444" : isGround ? "#10B981" : "#8B5CF6";

              return (
                <g
                  key={`gizmo-slot-${slot.id}`}
                  transform={`translate(${slot.x}, ${slot.y})`}
                  className="cursor-pointer"
                  onClick={() => onSelectSlot && onSelectSlot(slot.id)}
                >
                  {/* Magnet Active Pulse Ring when target of drag */}
                  {isTargetOfDrag && (
                    <circle
                      cx="0"
                      cy="0"
                      r="42"
                      fill="none"
                      stroke={dragSession.isSnapped ? "#10B981" : "#F59E0B"}
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      className="anim-pulse-slow"
                    />
                  )}

                  {/* Slot Crosshair & Pin */}
                  <circle cx="0" cy="0" r={isTargetOfDrag ? "18" : "14"} fill={color} opacity="0.3" />
                  <circle cx="0" cy="0" r={isTargetOfDrag ? "7" : "5"} fill={color} />
                  <line x1="-15" y1="0" x2="15" y2="0" stroke={color} strokeWidth="2" />
                  <line x1="0" y1="-15" x2="0" y2="15" stroke={color} strokeWidth="2" />

                  {/* Slot Tag Pill */}
                  <g transform={`translate(0, ${isGround ? 25 : -25})`}>
                    <rect
                      x="-65"
                      y="-12"
                      width="130"
                      height="24"
                      fill="#0B0F19"
                      stroke={color}
                      strokeWidth={isTargetOfDrag ? "2.5" : "1.5"}
                      rx="4"
                      opacity="0.95"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#F3F4F6"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {slot.id} ({slot.x},{slot.y})
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        )}

        {/* ACTIVE DRAG HUD & GROUND ANCHOR LASER GUIDE */}
        {dragSession && (
          <g id="drag-feedback-hud" pointerEvents="none">
            {/* Ground Contact Ripple at Y=800 */}
            <ellipse
              cx={dragSession.currentCoords.x}
              cy={GROUND_Y}
              rx="35"
              ry="10"
              fill={dragSession.isSnapped ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.35)"}
              stroke={dragSession.isSnapped ? "#10B981" : "#EF4444"}
              strokeWidth="2"
            />

            {/* Vertical Laser Guide Line connecting entity to Ground Plane */}
            <line
              x1={dragSession.currentCoords.x}
              y1={dragSession.currentCoords.y}
              x2={dragSession.currentCoords.x}
              y2={GROUND_Y}
              stroke={dragSession.isSnapped ? "#10B981" : "#EF4444"}
              strokeWidth="2.5"
              strokeDasharray="6,4"
              opacity="0.9"
            />

            {/* Floating Info Badge HUD above the dragged entity */}
            <g transform={`translate(${dragSession.currentCoords.x}, ${dragSession.currentCoords.y - 330})`}>
              <rect
                x="-140"
                y="-18"
                width="280"
                height="36"
                fill="#070A12"
                stroke={dragSession.isSnapped ? "#10B981" : "#F59E0B"}
                strokeWidth="2"
                rx="8"
                filter="drop-shadow(0 4px 10px rgba(0,0,0,0.8))"
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill={dragSession.isSnapped ? "#34D399" : "#FBBF24"}
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {dragSession.isSnapped
                  ? `🎯 ĐÃ HÚT: ${dragSession.candidateSlot.toUpperCase()}`
                  : `📍 X: ${Math.round(dragSession.currentCoords.x)} | Y: ${Math.round(dragSession.currentCoords.y)}`}
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
