import React from "react";
import type {
  CharacterBaseId,
  CharacterFaceId,
  CharacterPoseId,
  CostumeId,
  FacingDirection,
  HeldHand,
  HeldItemId,
} from "../types";
import {
  COLOR_PALETTE,
  BASE_APPEARANCE,
  COSTUME_PALETTES,
  type BaseAppearance,
  type CostumePalette,
} from "../constants";
import { getDefaultCostumeForBase } from "../layoutRouter";
import { HandheldItemRenderer } from "./HandheldItems";

interface HandSocketPoint {
  x: number;
  y: number;
  rot: number;
}

/**
 * Single source of truth for dynamic Left/Right Hand Sockets across every base & pose.
 * Ensures ArmsRig drawing, HeldItem anchoring, and Gizmo socket overlay stay 100% aligned.
 */
function resolveHandSockets(
  base: CharacterBaseId,
  pose: CharacterPoseId,
  heldItem?: HeldItemId,
  heldHand: HeldHand = "right"
): { left: HandSocketPoint; right: HandSocketPoint } {
  if (base === "jiangshi_corpse") {
    return {
      left: { x: 75, y: -180, rot: 0 },
      right: { x: 81, y: -178, rot: 0 },
    };
  }
  if (base === "elder_hunched") {
    if (pose === "pose_holding") {
      return {
        left: heldHand === "left" ? { x: 42, y: -130, rot: 0 } : { x: -14, y: -78, rot: 0 },
        right: heldHand === "left" ? { x: 14, y: -78, rot: 0 } : { x: 50, y: -134, rot: 0 },
      };
    }
    return {
      left: { x: -16, y: -78, rot: 10 },
      right: { x: 28, y: -80, rot: -5 },
    };
  }
  if (base === "brute_hulking") {
    if (pose === "pose_holding") {
      return {
        left: heldHand === "left" ? { x: 58, y: -160, rot: 0 } : { x: -32, y: -98, rot: 0 },
        right: heldHand === "left" ? { x: 32, y: -98, rot: 0 } : { x: 74, y: -162, rot: 0 },
      };
    }
    return {
      left: { x: -36, y: -96, rot: 0 },
      right: { x: 36, y: -96, rot: 0 },
    };
  }
  if (base === "skeletal_emaciated") {
    if (pose === "pose_holding") {
      return {
        left: heldHand === "left" ? { x: 52, y: -160, rot: 0 } : { x: -22, y: -96, rot: 0 },
        right: heldHand === "left" ? { x: 22, y: -96, rot: 0 } : { x: 68, y: -164, rot: 0 },
      };
    }
    return {
      left: { x: -22, y: -92, rot: 0 },
      right: { x: 22, y: -92, rot: 0 },
    };
  }
  if (pose === "pose_crawling") {
    return {
      left: { x: -69, y: -6, rot: 0 },
      right: { x: 69, y: -6, rot: 0 },
    };
  }
  if (pose === "pose_reaching") {
    return {
      left: { x: -18, y: -115, rot: 0 },
      right: { x: 91, y: -185, rot: 10 },
    };
  }
  if (pose === "pose_hanging") {
    return {
      left: { x: -22, y: -87, rot: -8 },
      right: { x: 22, y: -87, rot: 8 },
    };
  }
  if (pose === "pose_holding") {
    return {
      left: heldHand === "left" ? { x: 48, y: -158, rot: 0 } : { x: -20, y: -98, rot: 0 },
      right: heldHand === "left" ? { x: 20, y: -98, rot: 0 } : { x: 62, y: -162, rot: 0 },
    };
  }
  if (pose === "pose_shivering") {
    return {
      left: { x: -15, y: -145, rot: 8 },
      right: { x: 13, y: -150, rot: -8 },
    };
  }
  if (pose === "pose_walking") {
    return {
      left: { x: -46, y: -98, rot: -10 },
      right: { x: 42, y: -100, rot: 6 },
    };
  }
  if (pose === "pose_floating") {
    return {
      left: { x: -93, y: -196, rot: -12 },
      right: { x: 93, y: -196, rot: 12 },
    };
  }

  const hasItem = Boolean(heldItem && heldItem !== "none");
  const isChild = base === "creepy_child";
  const rightRaised = hasItem && heldHand === "right";
  const leftRaised = hasItem && heldHand === "left";

  return {
    left: leftRaised
      ? { x: isChild ? -32 : -38, y: isChild ? -136 : -128, rot: 0 }
      : { x: isChild ? -16 : -19, y: isChild ? -108 : -95, rot: 0 },
    right: rightRaised
      ? { x: isChild ? 34 : 44, y: isChild ? -138 : -130, rot: 0 }
      : { x: isChild ? 16 : 19, y: isChild ? -108 : -95, rot: 0 },
  };
}

interface CharacterRigProps {
  id?: string;
  base: CharacterBaseId;
  costume?: CostumeId;
  face: CharacterFaceId;
  pose: CharacterPoseId;
  facing: FacingDirection;
  scale?: number;
  opacity?: number;
  heldItem?: HeldItemId;
  heldHand?: HeldHand;
  showSockets?: boolean;
}

export const CharacterRig: React.FC<CharacterRigProps> = ({
  id,
  base,
  costume,
  face,
  pose,
  facing,
  scale = 1,
  opacity = 1,
  heldItem = "none",
  heldHand = "right",
  showSockets = false,
}) => {
  const activeCostume = costume || getDefaultCostumeForBase(base);
  const appearance = BASE_APPEARANCE[base];
  const palette = COSTUME_PALETTES[activeCostume];
  const handSockets = resolveHandSockets(base, pose, heldItem, heldHand);

  const flip = facing === "left" ? -1 : 1;
  const isGhost = base === "ghost_wraith";
  const isDemon = base === "demon_shadow";
  const isChild = base === "creepy_child";
  const isElder = base === "elder_hunched";
  const isBrute = base === "brute_hulking";
  const isSkeletal = base === "skeletal_emaciated";

  // Base scale adjustment
  const baseScaleModifier = isChild ? 0.65 : isDemon ? 1.25 : isBrute ? 1.2 : isElder ? 0.85 : isSkeletal ? 1.05 : 1;
  const finalScale = scale * baseScaleModifier;

  // Dynamic Head Position based on Base (adjusting neck length to realistic & natural proportions)
  const headPos = isElder
    ? { x: 18, y: -212 }
    : isChild
    ? { x: 0, y: -226 }
    : isBrute
    ? { x: 0, y: -232 }
    : isSkeletal
    ? { x: 0, y: -242 }
    : { x: 0, y: -234 };

  // Socket relative coordinates
  const SOCKETS = {
    ground: [0, 0],
    hip: [0, -90],
    shoulderL: isBrute ? [-35, -190] : [-25, -190],
    shoulderR: isBrute ? [35, -190] : [25, -190],
    neck: [headPos.x, headPos.y + 24],
    head: [headPos.x, headPos.y],
  };

  // Determine CSS animation class based on pose
  let poseClass = "rig-idle";
  if (pose === "pose_shivering") poseClass = "rig-shivering";
  if (pose === "pose_walking") poseClass = "rig-walking";
  if (pose === "pose_floating") poseClass = "rig-floating";
  if (pose === "pose_crawling") poseClass = "rig-crawling";
  if (pose === "pose_hanging") poseClass = "rig-hanging";

  return (
    <g
      id={id ? `actor-${id}` : undefined}
      transform={`scale(${flip * finalScale}, ${finalScale})`}
      opacity={isGhost ? Math.min(opacity, 0.88) : opacity}
      className={`character-rig ${poseClass}`}
    >
      {/* Ghost aura glow */}
      {isGhost && (
        <circle
          cx="0"
          cy="-150"
          r="140"
          fill="url(#ghost-aura-grad)"
          opacity="0.4"
          className="anim-pulse-slow"
        />
      )}

      {/* Demon dark smoky shadow aura */}
      {isDemon && (
        <g opacity="0.35" filter="url(#ghost-blur)">
          <ellipse cx="0" cy="-160" rx="90" ry="170" fill="#000000" />
        </g>
      )}

      {/* Hunched Back / Hump behind torso for Elder */}
      {isElder && (
        <g className="rig-elder-hump">
          <path
            d="M -15 -180 C -36 -165, -34 -120, -18 -95 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* Broad Muscular Shoulders / Trapezius for Brute */}
      {isBrute && (
        <g className="rig-brute-trapezius">
          <polygon
            points="-40,-185 -16,-208 16,-208 40,-185"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* 1. LOWER BODY & LEGS (Underneath / Integrated with Outfit) */}
      <g className="rig-lower-body">
        {isGhost ? (
          <GhostTail palette={palette} />
        ) : (
          <LowerBodyOutfit
            costume={activeCostume}
            base={base}
            pose={pose}
            palette={palette}
            appearance={appearance}
          />
        )}
      </g>

      {/* 2. TORSO & OUTFIT COLLECTION */}
      <g className="rig-torso-costume">
        <TorsoOutfit
          costume={activeCostume}
          base={base}
          pose={pose}
          palette={palette}
          appearance={appearance}
        />
        {/* Prominent Ribcage Lines for Skeletal Base */}
        {isSkeletal && (
          <g className="rig-skeletal-ribs" opacity="0.55">
            <path d="M -15 -170 Q 0 -162 15 -170" stroke={appearance.outline} strokeWidth="1.8" fill="none" />
            <path d="M -16 -152 Q 0 -144 16 -152" stroke={appearance.outline} strokeWidth="1.8" fill="none" />
            <path d="M -14 -134 Q 0 -126 14 -134" stroke={appearance.outline} strokeWidth="1.8" fill="none" />
            <path d="M -12 -116 Q 0 -108 12 -116" stroke={appearance.outline} strokeWidth="1.8" fill="none" />
          </g>
        )}
      </g>

      {/* 3. ARMS, SLEEVES & HANDHELD ITEM SOCKETS */}
      <g className="rig-arms-costume">
        <ArmsRig
          costume={activeCostume}
          base={base}
          pose={pose}
          palette={palette}
          appearance={appearance}
          heldItem={heldItem}
          heldHand={heldHand}
          handSockets={handSockets}
        />
      </g>

      {/* 4. NECK SOCKET */}
      {isElder ? (
        <path
          d="M -10 -175 C -5 -190, 6 -200, 16 -210 L 22 -206 C 14 -194, 6 -175, 4 -168 Z"
          fill={appearance.skinShadow}
          stroke={appearance.outline}
          strokeWidth="1"
        />
      ) : isSkeletal ? (
        <path
          d="M -4 -188 L -3 -220 L 3 -220 L 4 -188 Z"
          fill={appearance.skinShadow}
          stroke={appearance.outline}
          strokeWidth="1"
        />
      ) : isBrute ? (
        <path
          d="M -11 -188 L -10 -214 L 10 -214 L 11 -188 Z"
          fill={appearance.skinShadow}
          stroke={appearance.outline}
          strokeWidth="1"
        />
      ) : (
        <path
          d="M -7 -188 L -6 -214 L 6 -214 L 7 -188 Z"
          fill={appearance.skinShadow}
          stroke={appearance.outline}
          strokeWidth="1"
        />
      )}

      {/* 5. BASE-SPECIFIC HEAD ACCESSORIES (Behind / Side of Head) */}
      {base === "female_adult" && (
        <g className="rig-hair">
          <path
            d="M -18 -246 C -45 -206, -40 -150, -32 -100 C -28 -115, -25 -160, -18 -200 Z"
            fill={appearance.hair}
            stroke={appearance.outline}
            strokeWidth="1"
          />
          <path
            d="M 18 -246 C 42 -206, 38 -150, 30 -95 C 26 -115, 23 -160, 18 -200 Z"
            fill={appearance.hair}
            stroke={appearance.outline}
            strokeWidth="1"
          />
        </g>
      )}

      {base === "demon_shadow" && (
        <g className="rig-demon-horns" transform={`translate(${headPos.x}, ${headPos.y})`}>
          <path
            d="M -18 -15 C -35 -40, -55 -60, -50 -85 C -40 -70, -30 -40, -12 -28 Z"
            fill="#5C443E"
            stroke="#1C0C0E"
            strokeWidth="1.5"
          />
          <path
            d="M 18 -15 C 35 -40, 55 -60, 50 -85 C 40 -70, 30 -40, 12 -28 Z"
            fill="#5C443E"
            stroke="#1C0C0E"
            strokeWidth="1.5"
          />
        </g>
      )}

      {/* Hooded Cloak Special Hood Overlay */}
      {activeCostume === "outfit_shrouded_cloak" && (
        <g className="rig-cloak-hood" transform={`translate(${headPos.x}, ${headPos.y})`}>
          {/* Colored dark cowl covering head */}
          <path
            d="M -28 10 C -38 -20, -32 -48, 0 -60 C 32 -48, 38 -20, 28 10 C 20 22, -20 22, -28 10 Z"
            fill={palette.primary}
            stroke={palette.trim}
            strokeWidth="1.5"
          />
          {/* Inner dark void of the hood */}
          <ellipse cx="0" cy="-4" rx="20" ry="24" fill="#07060B" />
        </g>
      )}

      {/* 6. HEAD, HAIR CAP & INTERCHANGEABLE FACE */}
      <g className="rig-head-group" transform={`translate(${headPos.x}, ${headPos.y})`}>
        {activeCostume !== "outfit_shrouded_cloak" && (
          <>
            <ellipse
              cx="0"
              cy="0"
              rx={isChild ? "26" : isElder ? "19" : isBrute ? "24" : isSkeletal ? "18" : "22"}
              ry={isChild ? "26" : isElder ? "22" : isBrute ? "27" : isSkeletal ? "30" : "28"}
              fill={appearance.skin}
              stroke={appearance.outline}
              strokeWidth="1.5"
            />
            {/* Brute squarish heavy jaw */}
            {isBrute && (
              <polygon points="-22,10 22,10 18,27 -18,27" fill={appearance.skin} stroke={appearance.outline} strokeWidth="1.2" />
            )}
            {/* Simple stylized hair caps */}
            {base === "male_adult" && (
              <path
                d="M -22 -3 C -23 -25, -10 -31, 0 -30 C 14 -31, 23 -24, 22 -3 C 17 -14, 9 -17, 0 -16 C -9 -17, -17 -14, -22 -3 Z"
                fill={appearance.hair}
              />
            )}
            {base === "female_adult" && (
              <path
                d="M -22 -2 C -23 -27, 0 -32, 22 -27 C 23 -11, 22 -2, 20 -4 C 14 -16, 4 -18, 0 -13 C -4 -18, -14 -16, -20 -4 Z"
                fill={appearance.hair}
              />
            )}
            {base === "elder_hunched" && (
              <g className="rig-elder-hair">
                <ellipse cx="-15" cy="-14" rx="7" ry="8" fill={appearance.hair} />
                <line x1="-21" y1="-20" x2="-7" y2="-6" stroke="#92400E" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M -18 -8 Q -24 6 -20 16" stroke={appearance.hair} strokeWidth="2" fill="none" />
                <path d="M 18 -8 Q 24 6 20 16" stroke={appearance.hair} strokeWidth="2" fill="none" />
              </g>
            )}
            {base === "brute_hulking" && (
              <g className="rig-brute-hair">
                <path d="M -23 -8 C -23 -28, 0 -32, 23 -28 C 24 -15, 23 -8, 20 -10 C 14 -19, -14 -19, -20 -10 Z" fill={appearance.hair} />
                <line x1="8" y1="-2" x2="16" y2="10" stroke="#7F1D1D" strokeWidth="1.5" />
                <line x1="10" y1="2" x2="13" y2="5" stroke="#7F1D1D" strokeWidth="1.5" />
              </g>
            )}
            {base === "skeletal_emaciated" && (
              <g className="rig-skeletal-hair">
                <path d="M -19 -10 Q -28 15 -24 35" stroke={appearance.hair} strokeWidth="1.8" fill="none" />
                <path d="M -14 -15 Q -22 20 -17 42" stroke={appearance.hair} strokeWidth="1.5" fill="none" />
                <path d="M 19 -10 Q 28 15 24 35" stroke={appearance.hair} strokeWidth="1.8" fill="none" />
                <path d="M 14 -15 Q 22 20 17 40" stroke={appearance.hair} strokeWidth="1.5" fill="none" />
              </g>
            )}
            {base === "creepy_child" && (
              <path
                d="M -26 -2 C -27 -27, 0 -31, 27 -27 C 26 -10, 26 -2, 24 -5 L -24 -5 Z"
                fill={appearance.hair}
              />
            )}
            {base === "ghost_wraith" && (
              <path
                d="M -22 -4 C -24 -27, -8 -33, 2 -31 C 15 -32, 24 -24, 22 -4 C 16 -14, 8 -18, -2 -13 C -10 -18, -17 -14, -22 -4 Z"
                fill={appearance.hair}
                opacity="0.85"
              />
            )}
          </>
        )}

        {/* Jiangshi Hat sits cleanly atop the head */}
        {base === "jiangshi_corpse" && (
          <g className="rig-jiangshi-hat">
            <path
              d="M -32 -16 C -22 -39, 22 -39, 32 -16 Z"
              fill="#1E293B"
              stroke="#0F172A"
              strokeWidth="1.5"
            />
            <rect x="-24" y="-21" width="48" height="5" rx="2" fill="#334155" />
            <circle cx="0" cy="-38" r="5" fill={COLOR_PALETTE.accent_blood_red} />
            <line x1="0" y1="-38" x2="26" y2="-19" stroke={COLOR_PALETTE.accent_eerie_gold} strokeWidth="2.5" />
          </g>
        )}

        <FaceRig face={face} />
      </g>

      {/* DEBUG SOCKETS & GIZMO OVERLAY */}
      {showSockets && (
        <g className="rig-debug-gizmo" pointerEvents="none">
          <circle cx={SOCKETS.ground[0]} cy={SOCKETS.ground[1]} r="6" fill="#10B981" />
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#10B981" strokeWidth="2" strokeDasharray="3,3" />
          <text x="10" y="-8" fill="#10B981" fontSize="11" fontFamily="monospace">Ground [0,0]</text>
          <circle cx={SOCKETS.hip[0]} cy={SOCKETS.hip[1]} r="4" fill="#3B82F6" />
          <circle cx={SOCKETS.shoulderL[0]} cy={SOCKETS.shoulderL[1]} r="4" fill="#F59E0B" />
          <circle cx={SOCKETS.shoulderR[0]} cy={SOCKETS.shoulderR[1]} r="4" fill="#F59E0B" />
          <circle cx={SOCKETS.neck[0]} cy={SOCKETS.neck[1]} r="4" fill="#EC4899" />
          <circle cx={SOCKETS.head[0]} cy={SOCKETS.head[1]} r="5" fill="#EF4444" />

          {/* Hand Grip Sockets (Left & Right) */}
          <g transform={`translate(${handSockets.left.x}, ${handSockets.left.y})`}>
            <circle cx="0" cy="0" r="6" fill="none" stroke="#A855F7" strokeWidth="1.8" strokeDasharray="2,2" />
            <circle cx="0" cy="0" r="2.2" fill="#A855F7" />
          </g>
          <g transform={`translate(${handSockets.right.x}, ${handSockets.right.y})`}>
            <circle cx="0" cy="0" r="6.5" fill="none" stroke="#22D3EE" strokeWidth="2" />
            <circle cx="0" cy="0" r="2.5" fill="#22D3EE" />
            <text x="9" y="4" fill="#67E8F9" fontSize="10" fontFamily="monospace">
              {`Hand${heldHand === "left" ? "L" : "R"}`}
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/**
 * =========================================================
 * TORSO OUTFIT COLLECTION
 * Renders the costume over Chest/Torso (Y = -210 down to -90)
 * =========================================================
 */
const TorsoOutfit: React.FC<{
  costume: CostumeId;
  base: CharacterBaseId;
  pose: CharacterPoseId;
  palette: CostumePalette;
  appearance: BaseAppearance;
}> = ({ costume, base, palette, appearance }) => {
  const isDemon = base === "demon_shadow";
  const isBrute = base === "brute_hulking";
  const isSkeletal = base === "skeletal_emaciated";

  switch (costume) {
    case "outfit_flowing_ao_dai":
      return (
        <g className="costume-ao-dai-torso">
          <path
            d="M -18 -190 C -15 -150, -14 -120, -13 -90 L 13 -90 C 14 -120, 15 -150, 18 -190 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          <path d="M -8 -198 Q 0 -170 12 -185 L 0 -160 Z" fill={palette.secondary} />
          <line x1="-14" y1="-92" x2="14" y2="-92" stroke={palette.accent} strokeWidth="3.5" />
        </g>
      );

    case "outfit_shrouded_cloak":
      return (
        <g className="costume-shrouded-cloak-torso">
          <path
            d="M -35 -195 C -45 -140, -40 -100, -35 -85 L 35 -85 C 40 -100, 45 -140, 35 -195 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          <path
            d="M -22 -190 Q 0 -140 22 -190 L 12 -120 L -12 -120 Z"
            fill={palette.secondary}
            opacity="0.9"
          />
          <circle cx="0" cy="-180" r="3.5" fill={palette.accent} />
        </g>
      );

    case "outfit_mandarin_court":
      return (
        <g className="costume-mandarin-court-torso">
          <polygon
            points="-32,-195 -35,-90 35,-90 32,-195"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          {/* Rank Badge (Bổ Tử) on chest */}
          <rect x="-16" y="-165" width="32" height="32" fill={palette.secondary} stroke={palette.accent} strokeWidth="1.2" />
          <rect x="-14" y="-163" width="28" height="28" fill="none" stroke={palette.trim} strokeWidth="1.5" />
          <polygon points="-6,-149 0,-157 6,-149 0,-141" fill={palette.trim} />
          {/* Court Beads (Triều châu) */}
          <path d="M -18 -190 Q 0 -125 18 -190" stroke={palette.accent} strokeWidth="2.5" strokeDasharray="3,3" fill="none" />
          <line x1="-34" y1="-92" x2="34" y2="-92" stroke={palette.accent} strokeWidth="2" />
        </g>
      );

    case "outfit_monk_cassock":
      return (
        <g className="costume-monk-cassock-torso">
          <path
            d="M -22 -190 L -18 -90 L 18 -90 L 22 -190 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          {/* Crimson diagonal monastic stole */}
          <polygon points="-22,-190 -7,-190 18,-90 5,-90" fill={palette.accent} />
          {/* Buddhist prayer beads */}
          <path d="M -15 -190 Q 0 -130 15 -170" stroke="#D4AF37" strokeWidth="3" strokeDasharray="4,4" fill="none" />
          {/* Waist sash & yellow talisman */}
          <line x1="-18" y1="-92" x2="18" y2="-92" stroke={palette.secondary} strokeWidth="4" />
          <polygon points="-6,-95 2,-95 1,-74 -7,-74" fill={palette.trim} stroke={palette.accent} strokeWidth="0.8" />
        </g>
      );

    case "outfit_shredded_burial":
      return (
        <g className="costume-burial-shroud-torso">
          <path
            d="M -20 -185 L -16 -90 L 16 -90 L 20 -185 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          <line x1="-20" y1="-175" x2="16" y2="-120" stroke={palette.trim} strokeWidth="3" opacity="0.85" />
          <line x1="20" y1="-165" x2="-16" y2="-110" stroke={palette.secondary} strokeWidth="3" opacity="0.8" />
          <line x1="-18" y1="-135" x2="14" y2="-95" stroke={palette.trim} strokeWidth="2.5" opacity="0.8" />
          {/* Subtle blood stain & trailing strip */}
          <ellipse cx="-6" cy="-148" rx="5" ry="7" fill={palette.accent} opacity="0.7" />
          <path d="M -12 -150 Q -28 -110 -22 -75" stroke={palette.trim} strokeWidth="2.5" fill="none" opacity="0.75" className="anim-sway-subtle" />
        </g>
      );

    case "outfit_ancient_armor":
      return (
        <g className="costume-ancient-armor-torso">
          <path
            d="M -26 -195 C -30 -160, -25 -120, -20 -90 L 20 -90 C 25 -120, 30 -160, 26 -195 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          {/* Bronze Heart-Protecting Mirror Crest */}
          <circle cx="0" cy="-145" r="14" fill={palette.secondary} stroke={palette.accent} strokeWidth="2.5" />
          <line x1="-8" y1="-150" x2="6" y2="-138" stroke="#090B0E" strokeWidth="2" />
          {/* Waist Belt with Crimson Sash & Bronze Buckle */}
          <rect x="-22" y="-96" width="44" height="12" fill={palette.trim} />
          <polygon points="-7,-96 0,-103 7,-96 0,-89" fill={palette.accent} />
          <line x1="-20" y1="-175" x2="20" y2="-175" stroke={palette.accent} strokeWidth="2" strokeDasharray="4,3" />
        </g>
      );

    case "outfit_child_pajamas":
      return (
        <g className="costume-child-pajamas-torso">
          {/* Exposed pale shoulders underneath Áo Yếm */}
          <path d="M -19 -185 L 19 -185 L 17 -160 L -17 -160 Z" fill={appearance.skinShadow} />
          {/* Traditional Crimson Áo Yếm */}
          <path
            d="M -16 -175 C -18 -140, -15 -110, -14 -85 L 14 -85 C 15 -110, 18 -140, 16 -175 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1"
          />
          <path d="M -8 -175 Q 0 -150 8 -175 Z" fill={palette.accent} opacity="0.9" />
          <line x1="-12" y1="-175" x2="0" y2="-195" stroke={palette.accent} strokeWidth="2" />
          <line x1="12" y1="-175" x2="0" y2="-195" stroke={palette.accent} strokeWidth="2" />
          <circle cx="0" cy="-88" r="3.5" fill={palette.trim} />
        </g>
      );

    case "outfit_doctor_coat":
      return (
        <g className="costume-doctor-coat-torso">
          {/* Main Lab Coat Body */}
          <path
            d="M -22 -190 C -24 -150, -20 -115, -18 -90 L 18 -90 C 20 -115, 24 -150, 22 -190 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          {/* V-neck opening with dark scrub shirt inside */}
          <polygon points="-8,-190 8,-190 0,-155" fill={palette.pantsPrimary} />
          {/* Lapels */}
          <path d="M -16 -190 L -6 -150 L -12 -120" stroke={palette.secondary} strokeWidth="1.5" fill="none" />
          <path d="M 16 -190 L 6 -150 L 12 -120" stroke={palette.secondary} strokeWidth="1.5" fill="none" />
          {/* Stethoscope draped around neck */}
          <path d="M -12 -190 Q -15 -145 0 -138 Q 15 -145 12 -190" fill="none" stroke={palette.trim} strokeWidth="2.5" />
          <circle cx="0" cy="-136" r="3.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
          {/* Blood Splatters on Doctor's Coat */}
          <circle cx="-8" cy="-110" r="2.5" fill={palette.accent} />
          <path d="M 5 -125 Q 7 -105 6 -95" stroke={palette.accent} strokeWidth="2" fill="none" />
          <circle cx="10" cy="-105" r="1.8" fill={palette.accent} />
        </g>
      );

    case "outfit_patient_gown":
      return (
        <g className="costume-patient-gown-torso">
          {/* Loose Baggy Hospital Patient Gown */}
          <path
            d="M -25 -188 C -26 -150, -22 -115, -20 -90 L 20 -90 C 22 -115, 26 -150, 25 -188 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          {/* Open Round Collar with Ties */}
          <ellipse cx="0" cy="-188" rx="10" ry="5" fill={appearance.skinShadow} />
          {/* Vertical Pale Hospital Faint Stripes */}
          {[-12, -4, 4, 12].map((x) => (
            <line key={x} x1={x} y1="-180" x2={x} y2="-90" stroke={palette.secondary} strokeWidth="1.2" opacity="0.65" />
          ))}
          {/* Creepy Stain */}
          <circle cx="-6" cy="-120" r="3" fill={palette.accent} opacity="0.75" />
        </g>
      );

    case "outfit_modern_casual":
      return (
        <g className="costume-modern-casual-torso">
          {/* Modern Zipper Hoodie / Jacket */}
          <path
            d="M -24 -190 C -26 -150, -21 -115, -18 -90 L 18 -90 C 21 -115, 26 -150, 24 -190 Z"
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          {/* Front Center Zipper Line */}
          <line x1="0" y1="-190" x2="0" y2="-90" stroke={palette.secondary} strokeWidth="2" />
          <circle cx="0" cy="-155" r="2" fill={palette.accent} />
          {/* Kangaroo Pockets */}
          <path d="M -15 -115 L -6 -90 L 6 -90 L 15 -115" stroke={palette.trim} strokeWidth="1.5" fill="none" />
          {/* Dangling White Drawstrings */}
          <path d="M -4 -185 Q -7 -160 -5 -145" stroke={palette.accent} strokeWidth="1.5" fill="none" />
          <path d="M 4 -185 Q 7 -160 5 -145" stroke={palette.accent} strokeWidth="1.5" fill="none" />
        </g>
      );

    case "outfit_tattered_tunic":
    default:
      return (
        <g className="costume-tattered-tunic-torso">
          <path
            d={
              isDemon || isBrute
                ? "M -35 -195 C -45 -150, -32 -115, -22 -90 L 22 -90 C 32 -115, 45 -150, 35 -195 Z"
                : isSkeletal
                ? "M -18 -185 C -20 -150, -17 -115, -13 -92 L 13 -92 C 17 -115, 20 -150, 18 -185 Z"
                : "M -22 -185 C -25 -150, -20 -115, -16 -92 L 16 -92 C 20 -115, 25 -150, 22 -185 Z"
            }
            fill={palette.primary}
            stroke={appearance.outline}
            strokeWidth="1.2"
          />
          {/* Patched darker fold & hemp rope belt */}
          <path d="M -18 -120 L -6 -88 L 0 -92 L 7 -87 L 18 -120 Z" fill={palette.secondary} />
          <path d="M -8 -185 L 0 -164 L 8 -185 Z" fill={appearance.skinShadow} />
          <line x1="-17" y1="-93" x2="17" y2="-93" stroke={palette.accent} strokeWidth="3" strokeDasharray="4,2" />
        </g>
      );
  }
};

/**
 * =========================================================
 * LOWER BODY & SKIRT / TROUSERS OUTFIT COLLECTION
 * Socket: Hip [0, -90] -> Ground [0, 0]
 * =========================================================
 */
const LowerBodyOutfit: React.FC<{
  costume: CostumeId;
  base: CharacterBaseId;
  pose: CharacterPoseId;
  palette: CostumePalette;
  appearance: BaseAppearance;
}> = ({ costume, base, pose, palette, appearance }) => {
  const isWalking = pose === "pose_walking";
  const isShivering = pose === "pose_shivering";
  const isCrawling = pose === "pose_crawling";

  // Crawling Pose override
  if (isCrawling) {
    return (
      <g className="crawling-legs">
        <path
          d="M -15 -92 L -45 -40 L -65 -5 L -50 -5 L -35 -40 L -5 -92 Z"
          fill={palette.pantsPrimary}
          stroke={appearance.outline}
          strokeWidth="1"
        />
        <path
          d="M 5 -92 L 25 -40 L 45 -5 L 35 -5 L 18 -40 L -2 -92 Z"
          fill={palette.pantsSecondary}
          stroke={appearance.outline}
          strokeWidth="1"
        />
        <ellipse cx="-60" cy="-3" rx="7" ry="3.5" fill={appearance.skinShadow} />
        <ellipse cx="42" cy="-3" rx="6" ry="3.5" fill={appearance.skinShadow} />
      </g>
    );
  }

  // 1. Áo Dài / Tứ Thân (Flowing Long Panels over Dark Silk Trousers)
  if (costume === "outfit_flowing_ao_dai") {
    return (
      <g className={isWalking ? "anim-skirt-walk" : isShivering ? "anim-skirt-shiver" : ""}>
        <line x1="-8" y1="-90" x2="-12" y2="0" stroke={palette.pantsPrimary} strokeWidth="8" />
        <line x1="8" y1="-90" x2="12" y2="0" stroke={palette.pantsSecondary} strokeWidth="8" />
        <path
          d="M -14 -90 C -18 -40, -25 -15, -28 0 L 28 0 C 25 -15, 18 -40, 14 -90 Z"
          fill={palette.primary}
          stroke={appearance.outline}
          strokeWidth="1"
        />
        <polygon points="-28,0 -23,-8 -18,0 -12,-7 -6,0 0,-9 6,0 12,-6 18,0 24,-7 28,0" fill={palette.secondary} />
      </g>
    );
  }

  // 2. Hooded Reaper Cloak (Floor-length trailing cloak)
  if (costume === "outfit_shrouded_cloak") {
    return (
      <g className="cloak-trailing-skirt">
        <path
          d="M -35 -90 C -48 -45, -55 -15, -58 0 L 58 0 C 55 -15, 48 -45, 35 -90 Z"
          fill={palette.primary}
          stroke={appearance.outline}
          strokeWidth="1.2"
        />
        <polygon points="-58,0 -50,-12 -42,0 -34,-14 -24,0 -12,-10 0,0 12,-12 24,0 36,-14 48,0 58,0" fill={palette.secondary} />
      </g>
    );
  }

  // 3. Mandarin Court Robe (Boxy Indigo Skirt + Court Boots)
  if (costume === "outfit_mandarin_court") {
    return (
      <g className="mandarin-court-skirt">
        <path d="M -35 -90 L -38 -6 L 38 -6 L 35 -90 Z" fill={palette.primary} stroke={appearance.outline} strokeWidth="1.2" />
        <line x1="-37" y1="-10" x2="37" y2="-10" stroke={palette.accent} strokeWidth="2.5" />
        <polygon points="-25,0 -25,-12 -8,-12 -6,0" fill="#11131A" />
        <polygon points="6,0 8,-12 25,-12 25,0" fill="#11131A" />
      </g>
    );
  }

  // 4. Ancient Armor War Skirt
  if (costume === "outfit_ancient_armor") {
    return (
      <g className="ancient-armor-skirt">
        <polygon points="-20,-90 -24,-25 -6,-25 -4,-90" fill={palette.primary} stroke={appearance.outline} strokeWidth="1" />
        <polygon points="4,-90 6,-25 24,-25 20,-90" fill={palette.primary} stroke={appearance.outline} strokeWidth="1" />
        <line x1="-15" y1="-85" x2="-15" y2="-30" stroke={palette.accent} strokeWidth="1.8" />
        <line x1="15" y1="-85" x2="15" y2="-30" stroke={palette.accent} strokeWidth="1.8" />
        <path d="M -14 -25 L -16 0 L -6 0 L -4 -25 Z" fill={palette.secondary} />
        <path d="M 14 -25 L 16 0 L 6 0 L 4 -25 Z" fill={palette.secondary} />
      </g>
    );
  }

  // 5. Shredded Burial Shrouds
  if (costume === "outfit_shredded_burial") {
    return (
      <g className="burial-shroud-legs">
        <line x1="-10" y1="-90" x2="-14" y2="-4" stroke={palette.pantsPrimary} strokeWidth="8" />
        <line x1="10" y1="-90" x2="14" y2="-4" stroke={palette.pantsSecondary} strokeWidth="8" />
        <ellipse cx="-14" cy="-2" rx="6" ry="3" fill={appearance.skinShadow} />
        <ellipse cx="14" cy="-2" rx="6" ry="3" fill={appearance.skinShadow} />
        <path d="M -12 -90 Q -25 -45 -18 0" stroke={palette.trim} strokeWidth="2.5" fill="none" opacity="0.75" />
        <path d="M 12 -90 Q 25 -45 18 0" stroke={palette.trim} strokeWidth="2.5" fill="none" opacity="0.75" />
      </g>
    );
  }

  // 6. Child Pajamas (Short Trousers + Bare Calves)
  if (costume === "outfit_child_pajamas" || base === "creepy_child") {
    return (
      <g>
        {/* Bare lower legs */}
        <path d="M -9 -40 L -10 0 L -4 0 L -5 -40 Z" fill={appearance.skin} />
        <path d="M 9 -40 L 10 0 L 4 0 L 5 -40 Z" fill={appearance.skinShadow} />
        {/* Knee-length shorts */}
        <path d="M -11 -85 L -13 -38 L -3 -38 L -3 -85 Z" fill={palette.pantsPrimary} stroke={appearance.outline} strokeWidth="0.9" />
        <path d="M 11 -85 L 13 -38 L 3 -38 L 3 -85 Z" fill={palette.pantsSecondary} stroke={appearance.outline} strokeWidth="0.9" />
      </g>
    );
  }

  // 7. Doctor Coat Tails over Hospital Scrubs
  if (costume === "outfit_doctor_coat") {
    return (
      <g className={isWalking ? "anim-male-walk" : isShivering ? "anim-leg-tremble" : ""}>
        {/* Dark Hospital Scrub Trousers */}
        <line x1="-8" y1="-90" x2="-12" y2="-4" stroke={palette.pantsPrimary} strokeWidth="8" />
        <line x1="8" y1="-90" x2="12" y2="-4" stroke={palette.pantsSecondary} strokeWidth="8" />
        {/* Doctor Clogs / Shoes */}
        <ellipse cx="-13" cy="-2" rx="7" ry="3.5" fill="#0F172A" />
        <ellipse cx="13" cy="-2" rx="7" ry="3.5" fill="#0F172A" />
        {/* White Lab Coat Tails (slit in center) */}
        <polygon points="-18,-90 -22,-38 -6,-38 -4,-90" fill={palette.primary} stroke={appearance.outline} strokeWidth="1" />
        <polygon points="4,-90 6,-38 22,-38 18,-90" fill={palette.primary} stroke={appearance.outline} strokeWidth="1" />
        {/* Blood splatter drip on coat tail */}
        <circle cx="-14" cy="-45" r="2" fill={palette.accent} />
      </g>
    );
  }

  // 8. Patient Gown (Hem at Knee + Bare Ankles)
  if (costume === "outfit_patient_gown") {
    return (
      <g className={isWalking ? "anim-skirt-walk" : isShivering ? "anim-leg-tremble" : ""}>
        {/* Bare Shins / Ankles */}
        <path d="M -9 -45 L -11 -3 L -5 -3 L -4 -45 Z" fill={appearance.skin} />
        <path d="M 9 -45 L 11 -3 L 5 -3 L 4 -45 Z" fill={appearance.skinShadow} />
        {/* Bare Feet or Hospital Slippers */}
        <ellipse cx="-10" cy="-2" rx="6" ry="3" fill={appearance.skinShadow} />
        <ellipse cx="10" cy="-2" rx="6" ry="3" fill={appearance.skinShadow} />
        {/* Patient Gown Skirt */}
        <path
          d="M -20 -90 C -24 -65, -22 -45, -20 -42 L 20 -42 C 22 -45, 24 -65, 20 -90 Z"
          fill={palette.primary}
          stroke={appearance.outline}
          strokeWidth="1"
        />
        <line x1="-19" y1="-42" x2="19" y2="-42" stroke={palette.secondary} strokeWidth="1.5" />
      </g>
    );
  }

  // 9. Modern Casual (Slim Jeans + Modern Sneakers)
  if (costume === "outfit_modern_casual") {
    return (
      <g className={isWalking ? "anim-male-walk" : isShivering ? "anim-leg-tremble" : ""}>
        {/* Dark Cargo / Denim Pants */}
        <line x1="-8" y1="-90" x2="-11" y2="-6" stroke={palette.pantsPrimary} strokeWidth="7.5" />
        <line x1="8" y1="-90" x2="11" y2="-6" stroke={palette.pantsSecondary} strokeWidth="7.5" />
        {/* Modern Sneakers with White Rubber Soles */}
        <ellipse cx="-12" cy="-5" rx="8" ry="4" fill={palette.primary} />
        <line x1="-19" y1="-2" x2="-5" y2="-2" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="12" cy="-5" rx="8" ry="4" fill={palette.secondary} />
        <line x1="5" y1="-2" x2="19" y2="-2" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  }

  // Default Peasant / Monk Trousers
  if (isWalking) {
    return (
      <g className="anim-male-walk">
        <path d="M -12 -92 L -25 -45 L -35 -4 L -22 -4 L -14 -45 L -4 -92 Z" fill={palette.pantsPrimary} />
        <path d="M 4 -92 L 18 -45 L 30 -4 L 18 -4 L 8 -45 L -2 -92 Z" fill={palette.pantsSecondary} />
        <ellipse cx="-29" cy="-2" rx="8" ry="3.5" fill="#181512" />
        <ellipse cx="24" cy="-2" rx="8" ry="3.5" fill="#181512" />
      </g>
    );
  }

  if (isShivering) {
    return (
      <g className="anim-leg-tremble">
        <path d="M -15 -92 L -8 -50 L -14 -4 L -4 -4 L -2 -50 L -3 -92 Z" fill={palette.pantsPrimary} />
        <path d="M 15 -92 L 6 -50 L 12 -4 L 4 -4 L 1 -50 L 3 -92 Z" fill={palette.pantsSecondary} />
        <ellipse cx="-9" cy="-2" rx="7" ry="3" fill="#181512" />
        <ellipse cx="8" cy="-2" rx="7" ry="3" fill="#181512" />
      </g>
    );
  }

  if (base === "skeletal_emaciated") {
    return (
      <g className="rig-skeletal-legs">
        <line x1="-12" y1="-92" x2="-10" y2="0" stroke={palette.pantsPrimary} strokeWidth="5" />
        <line x1="12" y1="-92" x2="10" y2="0" stroke={palette.pantsSecondary} strokeWidth="5" />
        <circle cx="-11" cy="-45" r="4.5" fill={appearance.skinShadow} />
        <circle cx="11" cy="-45" r="4.5" fill={appearance.skinShadow} />
        <ellipse cx="-10" cy="-2" rx="6" ry="2.5" fill="#181512" />
        <ellipse cx="10" cy="-2" rx="6" ry="2.5" fill="#181512" />
      </g>
    );
  }

  if (base === "brute_hulking") {
    return (
      <g className="rig-brute-legs">
        <path d="M -22 -92 L -25 -45 L -20 -4 L -8 -4 L -10 -45 L -7 -92 Z" fill={palette.pantsPrimary} />
        <path d="M 22 -92 L 25 -45 L 20 -4 L 8 -4 L 10 -45 L 7 -92 Z" fill={palette.pantsSecondary} />
        <ellipse cx="-14" cy="-2" rx="9" ry="4" fill="#181512" />
        <ellipse cx="14" cy="-2" rx="9" ry="4" fill="#181512" />
      </g>
    );
  }

  return (
    <g>
      <path d="M -15 -92 L -18 -45 L -16 -4 L -6 -4 L -8 -45 L -4 -92 Z" fill={palette.pantsPrimary} />
      <path d="M 15 -92 L 18 -45 L 16 -4 L 6 -4 L 8 -45 L 4 -92 Z" fill={palette.pantsSecondary} />
      <ellipse cx="-11" cy="-2" rx="7" ry="3" fill="#181512" />
      <ellipse cx="11" cy="-2" rx="7" ry="3" fill="#181512" />
    </g>
  );
};

/**
 * =========================================================
 * GHOST WRAITH TAIL
 * =========================================================
 */
const GhostTail: React.FC<{ palette: CostumePalette }> = ({ palette }) => {
  return (
    <g className="anim-ghost-tail">
      <path d="M -18 -90 C -35 -40, -45 10, -30 45 C -15 25, -20 -10, -5 -60 Z" fill={palette.pantsSecondary} opacity="0.82" />
      <path d="M -8 -90 C -15 -30, -5 30, 0 65 C 5 35, 15 -20, 8 -90 Z" fill={palette.pantsPrimary} opacity="0.9" />
      <path d="M 18 -90 C 35 -40, 48 15, 32 50 C 20 25, 15 -10, 5 -60 Z" fill={palette.pantsSecondary} opacity="0.78" />
    </g>
  );
};

const AttachedProp: React.FC<{ socket: HandSocketPoint; itemId?: HeldItemId }> = ({
  socket,
  itemId,
}) => {
  if (!itemId || itemId === "none") return null;
  return (
    <g transform={`translate(${socket.x}, ${socket.y}) rotate(${socket.rot})`}>
      <HandheldItemRenderer itemId={itemId} />
    </g>
  );
};

/**
 * =========================================================
 * ARMS & SLEEVES RIG (Matches Costume Color + Skin Hands + Hand Sockets)
 * =========================================================
 */
const ArmsRig: React.FC<{
  costume: CostumeId;
  base: CharacterBaseId;
  pose: CharacterPoseId;
  palette: CostumePalette;
  appearance: BaseAppearance;
  heldItem?: HeldItemId;
  heldHand?: HeldHand;
  handSockets: { left: HandSocketPoint; right: HandSocketPoint };
}> = ({ costume, base, pose, palette, appearance, heldItem = "none", heldHand = "right", handSockets }) => {
  const sleeveColor = costume === "outfit_child_pajamas" ? appearance.skin : palette.sleeve;
  const sleeveShadowColor = costume === "outfit_child_pajamas" ? appearance.skinShadow : palette.sleeveShadow;
  const handColor = appearance.skin;
  const handShadowColor = appearance.skinShadow;
  const activeSocket = heldHand === "left" ? handSockets.left : handSockets.right;
  const hasItem = Boolean(heldItem && heldItem !== "none");
  const isChild = base === "creepy_child";

  // 1. Jiangshi rigid outstretched arms
  if (base === "jiangshi_corpse") {
    return (
      <g className="anim-arms-rigid">
        <polygon points="-25,-185 75,-185 75,-172 -25,-172" fill={sleeveColor} stroke={appearance.outline} strokeWidth="1" />
        <rect x="75" y="-184" width="12" height="11" rx="3" fill={handColor} />
        <polygon points="87,-184 106,-183 87,-180" fill="#1E293B" />
        <polygon points="87,-180 109,-178 87,-176" fill="#1E293B" />
        <polygon points="87,-176 105,-173 87,-172" fill="#1E293B" />
        <AttachedProp socket={activeSocket} itemId={heldItem} />
      </g>
    );
  }

  // 2. Crawling pose arms
  if (pose === "pose_crawling") {
    return (
      <g>
        <path d="M -25 -185 L -55 -120 L -75 -10 L -62 -10 L -45 -115 L -20 -185 Z" fill={sleeveColor} />
        <path d="M 25 -185 L 55 -120 L 75 -10 L 62 -10 L 45 -115 L 20 -185 Z" fill={sleeveShadowColor} />
        <circle cx={handSockets.left.x} cy={handSockets.left.y} r="5.5" fill={handColor} />
        <circle cx={handSockets.right.x} cy={handSockets.right.y} r="5.5" fill={handShadowColor} />
        <AttachedProp socket={activeSocket} itemId={heldItem} />
      </g>
    );
  }

  // 3. Reaching out arms
  if (pose === "pose_reaching") {
    return (
      <g className="anim-arms-reaching">
        <path d="M -25 -185 C 10 -180, 48 -195, 86 -190 L 84 -178 C 46 -182, 10 -170, -20 -185 Z" fill={sleeveColor} />
        <ellipse cx={handSockets.right.x} cy={handSockets.right.y} rx="7" ry="5.5" fill={handColor} />
        <polygon points="96,-190 116,-195 100,-185" fill="#7C5E56" />
        <polygon points="96,-185 119,-185 99,-180" fill="#7C5E56" />
        <AttachedProp socket={activeSocket} itemId={heldItem} />
      </g>
    );
  }

  // 4. Hanging pose
  if (pose === "pose_hanging") {
    return (
      <g>
        <line x1="-25" y1="-185" x2="-22" y2="-92" stroke={sleeveColor} strokeWidth="7" strokeLinecap="round" />
        <line x1="25" y1="-185" x2="22" y2="-92" stroke={sleeveShadowColor} strokeWidth="7" strokeLinecap="round" />
        <circle cx={handSockets.left.x} cy={handSockets.left.y} r="4.5" fill={handColor} />
        <circle cx={handSockets.right.x} cy={handSockets.right.y} r="4.5" fill={handShadowColor} />
        <AttachedProp socket={activeSocket} itemId={heldItem} />
      </g>
    );
  }

  // 5. Holding / Raising Item Forward Pose (e.g. holding lantern or talisman in the fog)
  if (pose === "pose_holding") {
    const raiseLeft = heldHand === "left";
    return (
      <g>
        {/* Back resting arm */}
        <path
          d={
            raiseLeft
              ? "M 22 -185 C 25 -150, 23 -125, 20 -100 L 14 -100 C 17 -125, 18 -150, 15 -185 Z"
              : "M -22 -185 C -25 -150, -23 -125, -20 -100 L -14 -100 C -17 -125, -18 -150, -15 -185 Z"
          }
          fill={sleeveShadowColor}
        />
        <circle
          cx={raiseLeft ? handSockets.right.x : handSockets.left.x}
          cy={raiseLeft ? handSockets.right.y : handSockets.left.y}
          r="4.5"
          fill={handShadowColor}
        />
        {/* Active raised forearm holding object out in front */}
        <path
          d={
            raiseLeft
              ? `M -12 -184 L 22 -144 L ${handSockets.left.x} ${handSockets.left.y + 4} L ${handSockets.left.x - 4} ${handSockets.left.y - 5} L 20 -155 L -4 -184 Z`
              : `M 18 -184 L 38 -144 L ${handSockets.right.x} ${handSockets.right.y + 4} L ${handSockets.right.x - 4} ${handSockets.right.y - 5} L 34 -155 L 10 -184 Z`
          }
          fill={sleeveColor}
          stroke={appearance.outline}
          strokeWidth="0.9"
        />
        <circle
          cx={raiseLeft ? handSockets.left.x : handSockets.right.x}
          cy={raiseLeft ? handSockets.left.y : handSockets.right.y}
          r="4.8"
          fill={handColor}
        />
        <AttachedProp socket={activeSocket} itemId={heldItem} />
      </g>
    );
  }

  // 6. Shivering pose
  if (pose === "pose_shivering") {
    return (
      <g className="anim-arms-tremble">
        <path d="M -24 -185 C -20 -160, -5 -145, 12 -150 C 14 -155, 10 -165, -8 -160 C -18 -170, -20 -180, -24 -185 Z" fill={sleeveColor} />
        <path d="M 24 -185 C 20 -160, 5 -140, -14 -145 C -16 -150, -10 -160, 8 -155 C 18 -168, 20 -180, 24 -185 Z" fill={sleeveShadowColor} />
        <circle cx={handSockets.right.x} cy={handSockets.right.y} r="4.5" fill={handColor} />
        <circle cx={handSockets.left.x} cy={handSockets.left.y} r="4.5" fill={handShadowColor} />
        <AttachedProp socket={activeSocket} itemId={heldItem} />
      </g>
    );
  }

  // 7. Walking pose
  if (pose === "pose_walking") {
    return (
      <g className="anim-arms-walk">
        <path d="M -25 -185 C -35 -150, -45 -120, -50 -102 L -42 -100 C -37 -120, -28 -145, -20 -185 Z" fill={sleeveColor} />
        <path d="M 25 -185 C 32 -150, 40 -120, 45 -104 L 38 -102 C 33 -120, 26 -145, 20 -185 Z" fill={sleeveShadowColor} />
        <circle cx={handSockets.left.x} cy={handSockets.left.y} r="4.8" fill={handColor} />
        <circle cx={handSockets.right.x} cy={handSockets.right.y} r="4.5" fill={handShadowColor} />
        <AttachedProp socket={activeSocket} itemId={heldItem} />
      </g>
    );
  }

  // 8. Floating pose
  if (pose === "pose_floating") {
    return (
      <g className="anim-arms-float">
        <path d="M -25 -185 C -50 -175, -75 -180, -90 -193 C -86 -198, -68 -190, -45 -190 C -35 -190, -26 -188, -22 -185 Z" fill={sleeveColor} />
        <path d="M 25 -185 C 50 -175, 75 -180, 90 -193 C 86 -198, 68 -190, 45 -190 C 35 -190, 26 -188, 22 -185 Z" fill={sleeveShadowColor} />
        <circle cx={handSockets.left.x} cy={handSockets.left.y} r="4.5" fill={handColor} />
        <circle cx={handSockets.right.x} cy={handSockets.right.y} r="4.5" fill={handShadowColor} />
        <AttachedProp socket={activeSocket} itemId={heldItem} />
      </g>
    );
  }

  // 9. Default standing arms (automatically bends active holding arm slightly outward to clear body silhouette)
  const rightArmPath =
    hasItem && heldHand === "right"
      ? `M 20 -184 L 33 -148 L ${handSockets.right.x} ${handSockets.right.y + 3} L ${handSockets.right.x - 4} ${handSockets.right.y - 5} L 28 -155 L 14 -184 Z`
      : isChild
      ? "M -18 -172 C -21 -148, -19 -128, -17 -111 L -12 -111 C -15 -128, -15 -148, -13 -172 Z"
      : "M 25 -185 C 28 -150, 26 -125, 22 -99 L 16 -99 C 20 -125, 21 -150, 18 -185 Z";

  const leftArmPath =
    hasItem && heldHand === "left"
      ? `M -20 -184 L -31 -148 L ${handSockets.left.x} ${handSockets.left.y + 3} L ${handSockets.left.x + 4} ${handSockets.left.y - 5} L -26 -155 L -14 -184 Z`
      : isChild
      ? "M 18 -172 C 21 -148, 19 -128, 17 -111 L 12 -111 C 15 -128, 15 -148, 13 -172 Z"
      : "M -25 -185 C -28 -150, -26 -125, -22 -99 L -16 -99 C -20 -125, -21 -150, -18 -185 Z";

  return (
    <g>
      <path d={leftArmPath} fill={sleeveShadowColor} />
      <path d={rightArmPath} fill={sleeveColor} />
      <circle cx={handSockets.left.x} cy={handSockets.left.y} r="4.5" fill={handShadowColor} />
      <circle cx={handSockets.right.x} cy={handSockets.right.y} r="4.5" fill={handColor} />
      <AttachedProp socket={activeSocket} itemId={heldItem} />
    </g>
  );
};

/**
 * =========================================================
 * INTERCHANGEABLE FACE RIG
 * =========================================================
 */
const FaceRig: React.FC<{ face: CharacterFaceId }> = ({ face }) => {
  switch (face) {
    case "face_faceless":
      return (
        <g className="face-faceless">
          <ellipse cx="0" cy="0" rx="18" ry="24" fill="#E2E8F0" opacity="0.92" />
        </g>
      );

    case "face_glowing_hollow":
      return (
        <g className="face-glowing-hollow">
          <ellipse cx="-7" cy="-5" rx="5" ry="6" fill="#050709" />
          <ellipse cx="7" cy="-5" rx="5" ry="6" fill="#050709" />
          <circle cx="-7" cy="-5" r="3" fill={COLOR_PALETTE.accent_swamp_green} className="anim-flicker-ember" />
          <circle cx="7" cy="-5" r="3" fill={COLOR_PALETTE.accent_swamp_green} className="anim-flicker-ember" />
          <ellipse cx="0" cy="14" rx="7" ry="9" fill="#050709" />
          <ellipse cx="0" cy="14" rx="4" ry="6" fill={COLOR_PALETTE.accent_swamp_green} className="anim-flicker-ember" />
        </g>
      );

    case "face_talisman_covered":
      return (
        <g className="face-talisman anim-sway-subtle" transform="translate(0, -12)">
          <polygon points="-9,-12 9,-12 8,36 -8,36" fill={COLOR_PALETTE.accent_talisman_yellow} stroke="#854D0E" strokeWidth="0.8" />
          <polygon points="-8,36 -4,42 0,36 4,42 8,36" fill={COLOR_PALETTE.accent_talisman_yellow} />
          <line x1="0" y1="-6" x2="0" y2="30" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2.5" />
          <line x1="-5" y1="2" x2="5" y2="2" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2" />
          <line x1="-4" y1="12" x2="4" y2="12" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="2" />
          <circle cx="0" cy="22" r="2.5" fill={COLOR_PALETTE.accent_blood_red} />
        </g>
      );

    case "face_scared":
      return (
        <g className="face-scared anim-jitter-slight">
          <ellipse cx="-7" cy="-5" rx="5.5" ry="6.5" fill={COLOR_PALETTE.accent_fog_white} stroke="#0F172A" strokeWidth="1" />
          <ellipse cx="7" cy="-5" rx="5.5" ry="6.5" fill={COLOR_PALETTE.accent_fog_white} stroke="#0F172A" strokeWidth="1" />
          <circle cx="-7" cy="-5" r="1.6" fill="#000000" />
          <circle cx="7" cy="-5" r="1.6" fill="#000000" />
          <path
            d="M -7 9 Q 0 4 7 9 Q 5 21 0 21 Q -5 21 -7 9 Z"
            fill="#1A0505"
            stroke="#0F172A"
            strokeWidth="1"
          />
          <ellipse cx="0" cy="17" rx="3.5" ry="2.5" fill={COLOR_PALETTE.accent_blood_red} />
        </g>
      );

    case "face_creepy_smile":
      return (
        <g className="face-creepy-smile">
          <path d="M -12 -7 Q -7 -12 -2 -7 Q -7 -5 -12 -7 Z" fill={COLOR_PALETTE.accent_fog_white} stroke="#0F172A" strokeWidth="0.9" />
          <path d="M 2 -7 Q 7 -12 12 -7 Q 7 -5 2 -7 Z" fill={COLOR_PALETTE.accent_fog_white} stroke="#0F172A" strokeWidth="0.9" />
          <path d="M -18 3 Q 0 26 18 3 Q 0 8 -18 3 Z" fill="#3B0505" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="1.2" />
          <polygon points="-14,5 -12,12 -10,6" fill={COLOR_PALETTE.accent_fog_white} />
          <polygon points="-9,6 -7,14 -5,7" fill={COLOR_PALETTE.accent_fog_white} />
          <polygon points="-4,7 -2,15 0,7" fill={COLOR_PALETTE.accent_fog_white} />
          <polygon points="1,7 3,15 5,7" fill={COLOR_PALETTE.accent_fog_white} />
          <polygon points="6,6 8,14 10,6" fill={COLOR_PALETTE.accent_fog_white} />
          <polygon points="11,5 13,12 15,5" fill={COLOR_PALETTE.accent_fog_white} />
        </g>
      );

    case "face_bleeding_eyes":
      return (
        <g className="face-bleeding-eyes">
          <circle cx="-7" cy="-5" r="4.5" fill={COLOR_PALETTE.accent_fog_white} stroke="#0F172A" strokeWidth="1" />
          <circle cx="7" cy="-5" r="4.5" fill={COLOR_PALETTE.accent_fog_white} stroke="#0F172A" strokeWidth="1" />
          <path d="M -8 -1 L -8 24 L -6 24 L -6 -1 Z" fill={COLOR_PALETTE.accent_blood_red} />
          <circle cx="-7" cy="25" r="1.8" fill={COLOR_PALETTE.accent_blood_red} />
          <path d="M 6 -1 L 6 22 L 8 22 L 8 -1 Z" fill={COLOR_PALETTE.accent_blood_red} />
          <circle cx="7" cy="23" r="1.8" fill={COLOR_PALETTE.accent_blood_red} />
          <line x1="-5" y1="12" x2="5" y2="12" stroke="#1F1212" strokeWidth="1.3" />
        </g>
      );

    case "face_old_wrinkled":
      return (
        <g className="face-old-wrinkled">
          {/* Forehead wrinkles */}
          <path d="M -12 -18 Q 0 -15 12 -18" stroke="#4A3B32" strokeWidth="1" fill="none" opacity="0.8" />
          <path d="M -9 -14 Q 0 -11 9 -14" stroke="#4A3B32" strokeWidth="1" fill="none" opacity="0.8" />
          {/* Drooping old eyelids and dim eyes */}
          <path d="M -9 -6 Q -6 -9 -3 -6" stroke="#2B1D16" strokeWidth="1.2" fill="none" />
          <ellipse cx="-6" cy="-4" rx="2.2" ry="1.4" fill="#1C1917" />
          <circle cx="-6.5" cy="-4.5" r="0.6" fill="#CBD5E1" />
          {/* Crow's feet wrinkles near eyes */}
          <path d="M -9 -5 L -14 -7 M -10 -4 L -15 -4 M -9 -3 L -13 -1" stroke="#4A3B32" strokeWidth="0.8" />
          <path d="M 3 -6 Q 6 -9 9 -6" stroke="#2B1D16" strokeWidth="1.2" fill="none" />
          <ellipse cx="6" cy="-4" rx="2.2" ry="1.4" fill="#1C1917" />
          <circle cx="5.5" cy="-4.5" r="0.6" fill="#CBD5E1" />
          <path d="M 9 -5 L 14 -7 M 10 -4 L 15 -4 M 9 -3 L 13 -1" stroke="#4A3B32" strokeWidth="0.8" />
          {/* Deep nasolabial folds */}
          <path d="M -7 4 Q -9 12 -5 18" stroke="#3A2820" strokeWidth="1.2" fill="none" />
          <path d="M 7 4 Q 9 12 5 18" stroke="#3A2820" strokeWidth="1.2" fill="none" />
          {/* Sunken toothless mouth */}
          <path d="M -5 14 Q 0 12 5 14" stroke="#1C1917" strokeWidth="1.8" fill="none" />
          {/* Chin wrinkles */}
          <path d="M -4 20 Q 0 22 4 20" stroke="#4A3B32" strokeWidth="0.9" fill="none" />
        </g>
      );

    case "face_rage_furious":
      return (
        <g className="face-rage-furious anim-jitter-slight">
          {/* Deep furrowed brow & sharp angry eyebrows angled down */}
          <polygon points="-12,-12 -2,-4 -2,-6 -12,-15" fill="#1F2937" />
          <polygon points="12,-12 2,-4 2,-6 12,-15" fill="#1F2937" />
          <line x1="-1" y1="-8" x2="-1" y2="-1" stroke="#450A0A" strokeWidth="1.5" />
          <line x1="1" y1="-8" x2="1" y2="-1" stroke="#450A0A" strokeWidth="1.5" />
          {/* Piercing bloodshot red-rimmed glare */}
          <ellipse cx="-6" cy="-3" rx="4.5" ry="3.5" fill="#450A0A" />
          <circle cx="-6" cy="-3" r="2.2" fill={COLOR_PALETTE.accent_blood_red} />
          <circle cx="-6" cy="-3" r="0.8" fill="#FFFFFF" />
          <ellipse cx="6" cy="-3" rx="4.5" ry="3.5" fill="#450A0A" />
          <circle cx="6" cy="-3" r="2.2" fill={COLOR_PALETTE.accent_blood_red} />
          <circle cx="6" cy="-3" r="0.8" fill="#FFFFFF" />
          {/* Snarl teeth & menacing open grimace */}
          <path d="M -9 8 Q 0 4 9 8 Q 8 20 0 20 Q -8 20 -9 8 Z" fill="#2A0404" stroke="#7F1D1D" strokeWidth="1" />
          {/* Sharp fangs */}
          <polygon points="-7,8 -5,14 -4,8" fill="#F8FAFC" />
          <polygon points="4,8 5,14 7,8" fill="#F8FAFC" />
          <polygon points="-5,19 -4,15 -3,19" fill="#F8FAFC" />
          <polygon points="3,19 4,15 5,19" fill="#F8FAFC" />
        </g>
      );

    case "face_pale_corpse":
      return (
        <g className="face-pale-corpse">
          {/* Dark bruised purplish eye hollows */}
          <ellipse cx="-7" cy="-4" rx="6.5" ry="5.5" fill="#1E1B2E" opacity="0.85" />
          <ellipse cx="7" cy="-4" rx="6.5" ry="5.5" fill="#1E1B2E" opacity="0.85" />
          {/* Wide dead glassy white pupilless eyes */}
          <ellipse cx="-7" cy="-4" rx="4.5" ry="4" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="-7" cy="-4" r="1.5" fill="#94A3B8" opacity="0.5" />
          <ellipse cx="7" cy="-4" rx="4.5" ry="4" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="7" cy="-4" r="1.5" fill="#94A3B8" opacity="0.5" />
          {/* Cold bluish dead lips hanging slack */}
          <path d="M -6 11 Q 0 9 6 11 Q 4 16 0 16 Q -4 16 -6 11 Z" fill="#2E1026" stroke="#4C1D45" strokeWidth="1" />
          <line x1="-7" y1="11" x2="7" y2="11" stroke="#0F0814" strokeWidth="1.2" />
        </g>
      );

    case "face_weeping_ghost":
      return (
        <g className="face-weeping-ghost">
          {/* Sorrowful downward arched eyebrows */}
          <path d="M -11 -9 Q -6 -13 -2 -8" stroke="#1E293B" strokeWidth="1.2" fill="none" />
          <path d="M 11 -9 Q 6 -13 2 -8" stroke="#1E293B" strokeWidth="1.2" fill="none" />
          {/* Tightly closed weeping eyes */}
          <path d="M -9 -4 Q -6 -1 -3 -4" stroke="#0F172A" strokeWidth="1.8" fill="none" />
          <path d="M 3 -4 Q 6 -1 9 -4" stroke="#0F172A" strokeWidth="1.8" fill="none" />
          {/* Bleeding black sorrowful tear streams dripping down to chin */}
          <path d="M -6 -2 L -7 14 L -5 23 L -6 23 L -8 13 L -6 -2 Z" fill="#09090B" />
          <circle cx="-5.5" cy="25" r="1.5" fill="#09090B" />
          <path d="M 6 -2 L 7 12 L 5 21 L 6 21 L 8 11 L 6 -2 Z" fill="#09090B" />
          <circle cx="5.5" cy="23" r="1.4" fill="#09090B" />
          {/* Melancholy trembling mouth */}
          <path d="M -5 13 Q 0 10 5 13 Q 0 15 -5 13 Z" fill="#1C1917" stroke="#451A03" strokeWidth="0.8" />
        </g>
      );

    case "face_sewn_mouth":
      return (
        <g className="face-sewn-mouth anim-jitter-slight">
          {/* Wide terrified bulging eyes */}
          <ellipse cx="-7" cy="-5" rx="5.5" ry="6.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
          <circle cx="-7" cy="-5" r="1.8" fill="#000000" />
          <circle cx="-6" cy="-6" r="0.8" fill="#FFFFFF" />
          <ellipse cx="7" cy="-5" rx="5.5" ry="6.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
          <circle cx="7" cy="-5" r="1.8" fill="#000000" />
          <circle cx="8" cy="-6" r="0.8" fill="#FFFFFF" />
          {/* Lips clamped shut with stitch line */}
          <line x1="-12" y1="12" x2="12" y2="12" stroke="#450A0A" strokeWidth="2" />
          {/* Cross stitches (X stitches) with blood dots */}
          {[-9, -5, -1, 3, 7].map((x, i) => (
            <g key={i}>
              <line x1={x - 2} y1="8" x2={x + 2} y2="16" stroke="#000000" strokeWidth="1.6" />
              <line x1={x + 2} y1="8" x2={x - 2} y2="16" stroke="#000000" strokeWidth="1.6" />
              <circle cx={x} cy="8" r="0.9" fill={COLOR_PALETTE.accent_blood_red} />
              <circle cx={x} cy="16" r="0.9" fill={COLOR_PALETTE.accent_blood_red} />
            </g>
          ))}
        </g>
      );

    case "face_haggard_gaunt":
      return (
        <g className="face-haggard-gaunt">
          {/* Deep dark hollow eye sockets */}
          <ellipse cx="-7" cy="-4" rx="7" ry="6" fill="#18181B" opacity="0.9" />
          <ellipse cx="7" cy="-4" rx="7" ry="6" fill="#18181B" opacity="0.9" />
          {/* Unnerving pinprick stare in darkness */}
          <circle cx="-7" cy="-4" r="2.8" fill="#E2E8F0" />
          <circle cx="-7" cy="-4" r="1" fill="#000000" />
          <circle cx="7" cy="-4" r="2.8" fill="#E2E8F0" />
          <circle cx="7" cy="-4" r="1" fill="#000000" />
          {/* Sharp prominent cheekbones */}
          <path d="M -15 2 L -7 6" stroke="#3F3F46" strokeWidth="1.5" />
          <path d="M 15 2 L 7 6" stroke="#3F3F46" strokeWidth="1.5" />
          {/* Sunken dry hollow cheeks */}
          <ellipse cx="-11" cy="9" rx="3" ry="5" fill="#18181B" opacity="0.35" />
          <ellipse cx="11" cy="9" rx="3" ry="5" fill="#18181B" opacity="0.35" />
          {/* Chapped parted lips */}
          <ellipse cx="0" cy="14" rx="4" ry="2.5" fill="#18181B" stroke="#52525B" strokeWidth="0.8" />
        </g>
      );

    case "face_calm":
    default:
      return (
        <g className="face-calm">
          <circle cx="-6" cy="-4" r="2.6" fill="#0F172A" />
          <circle cx="6" cy="-4" r="2.6" fill="#0F172A" />
          <circle cx="-5.5" cy="-4.5" r="0.8" fill={COLOR_PALETTE.accent_fog_white} />
          <circle cx="6.5" cy="-4.5" r="0.8" fill={COLOR_PALETTE.accent_fog_white} />
          <line x1="-4" y1="11" x2="4" y2="11" stroke="#1F172A" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      );
  }
};
