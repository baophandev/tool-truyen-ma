import React from "react";
import type {
  CharacterBaseId,
  CharacterFaceId,
  CharacterPoseId,
  CostumeId,
  FacingDirection,
} from "../types";
import {
  COLOR_PALETTE,
  BASE_APPEARANCE,
  COSTUME_PALETTES,
  type BaseAppearance,
  type CostumePalette,
} from "../constants";
import { getDefaultCostumeForBase } from "../layoutRouter";

interface CharacterRigProps {
  id?: string;
  base: CharacterBaseId;
  costume?: CostumeId;
  face: CharacterFaceId;
  pose: CharacterPoseId;
  facing: FacingDirection;
  scale?: number;
  opacity?: number;
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
  showSockets = false,
}) => {
  const activeCostume = costume || getDefaultCostumeForBase(base);
  const appearance = BASE_APPEARANCE[base];
  const palette = COSTUME_PALETTES[activeCostume];

  const flip = facing === "left" ? -1 : 1;
  const isGhost = base === "ghost_wraith";
  const isDemon = base === "demon_shadow";
  const isChild = base === "creepy_child";

  // Base scale adjustment
  const baseScaleModifier = isChild ? 0.65 : isDemon ? 1.25 : 1;
  const finalScale = scale * baseScaleModifier;

  // Socket relative coordinates
  const SOCKETS = {
    ground: [0, 0],
    hip: [0, -90],
    shoulderL: [-25, -190],
    shoulderR: [25, -190],
    neck: [0, -210],
    head: [0, -250],
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
      </g>

      {/* 3. ARMS & SLEEVES */}
      <g className="rig-arms-costume">
        <ArmsRig
          costume={activeCostume}
          base={base}
          pose={pose}
          palette={palette}
          appearance={appearance}
        />
      </g>

      {/* 4. NECK SOCKET */}
      <path
        d="M -7 -190 L -6 -218 L 6 -218 L 7 -190 Z"
        fill={appearance.skinShadow}
        stroke={appearance.outline}
        strokeWidth="1"
      />

      {/* 5. BASE-SPECIFIC HEAD ACCESSORIES (Behind / Side of Head) */}
      {base === "female_adult" && (
        <g className="rig-hair">
          <path
            d="M -18 -260 C -45 -220, -40 -160, -32 -110 C -28 -125, -25 -170, -18 -210 Z"
            fill={appearance.hair}
            stroke={appearance.outline}
            strokeWidth="1"
          />
          <path
            d="M 18 -260 C 42 -220, 38 -160, 30 -105 C 26 -125, 23 -170, 18 -210 Z"
            fill={appearance.hair}
            stroke={appearance.outline}
            strokeWidth="1"
          />
        </g>
      )}

      {base === "demon_shadow" && (
        <g className="rig-demon-horns" transform="translate(0, -250)">
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
        <g className="rig-cloak-hood" transform="translate(0, -250)">
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
      <g className="rig-head-group" transform="translate(0, -250)">
        {activeCostume !== "outfit_shrouded_cloak" && (
          <>
            <ellipse
              cx="0"
              cy="0"
              rx={isChild ? "26" : "22"}
              ry={isChild ? "26" : "28"}
              fill={appearance.skin}
              stroke={appearance.outline}
              strokeWidth="1.5"
            />
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

    case "outfit_tattered_tunic":
    default:
      return (
        <g className="costume-tattered-tunic-torso">
          <path
            d={
              isDemon
                ? "M -35 -195 C -45 -150, -32 -115, -22 -90 L 22 -90 C 32 -115, 45 -150, 35 -195 Z"
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

/**
 * =========================================================
 * ARMS & SLEEVES RIG (Matches Costume Color + Skin Hands)
 * =========================================================
 */
const ArmsRig: React.FC<{
  costume: CostumeId;
  base: CharacterBaseId;
  pose: CharacterPoseId;
  palette: CostumePalette;
  appearance: BaseAppearance;
}> = ({ costume, base, pose, palette, appearance }) => {
  const sleeveColor = costume === "outfit_child_pajamas" ? appearance.skin : palette.sleeve;
  const sleeveShadowColor = costume === "outfit_child_pajamas" ? appearance.skinShadow : palette.sleeveShadow;
  const handColor = appearance.skin;
  const handShadowColor = appearance.skinShadow;

  // 1. Jiangshi rigid outstretched arms
  if (base === "jiangshi_corpse") {
    return (
      <g className="anim-arms-rigid">
        <polygon points="-25,-185 75,-185 75,-172 -25,-172" fill={sleeveColor} stroke={appearance.outline} strokeWidth="1" />
        <rect x="75" y="-184" width="12" height="11" rx="3" fill={handColor} />
        <polygon points="87,-184 106,-183 87,-180" fill="#1E293B" />
        <polygon points="87,-180 109,-178 87,-176" fill="#1E293B" />
        <polygon points="87,-176 105,-173 87,-172" fill="#1E293B" />
      </g>
    );
  }

  // 2. Crawling pose arms
  if (pose === "pose_crawling") {
    return (
      <g>
        <path d="M -25 -185 L -55 -120 L -75 -10 L -62 -10 L -45 -115 L -20 -185 Z" fill={sleeveColor} />
        <path d="M 25 -185 L 55 -120 L 75 -10 L 62 -10 L 45 -115 L 20 -185 Z" fill={sleeveShadowColor} />
        <circle cx="-69" cy="-6" r="5.5" fill={handColor} />
        <circle cx="69" cy="-6" r="5.5" fill={handShadowColor} />
      </g>
    );
  }

  // 3. Reaching out arms
  if (pose === "pose_reaching") {
    return (
      <g className="anim-arms-reaching">
        <path d="M -25 -185 C 10 -180, 48 -195, 86 -190 L 84 -178 C 46 -182, 10 -170, -20 -185 Z" fill={sleeveColor} />
        <ellipse cx="91" cy="-185" rx="7" ry="5.5" fill={handColor} />
        <polygon points="96,-190 116,-195 100,-185" fill="#7C5E56" />
        <polygon points="96,-185 119,-185 99,-180" fill="#7C5E56" />
      </g>
    );
  }

  // 4. Hanging pose
  if (pose === "pose_hanging") {
    return (
      <g>
        <line x1="-25" y1="-185" x2="-22" y2="-92" stroke={sleeveColor} strokeWidth="7" strokeLinecap="round" />
        <line x1="25" y1="-185" x2="22" y2="-92" stroke={sleeveShadowColor} strokeWidth="7" strokeLinecap="round" />
        <circle cx="-22" cy="-87" r="4.5" fill={handColor} />
        <circle cx="22" cy="-87" r="4.5" fill={handShadowColor} />
      </g>
    );
  }

  // 5. Creepy child holding headless rag doll
  if (base === "creepy_child") {
    return (
      <g>
        <path d="M -16 -170 C -5 -150, 5 -150, 10 -160 L 5 -165 C 0 -155, -10 -155, -14 -170 Z" fill={sleeveColor} />
        <circle cx="10" cy="-161" r="4" fill={handColor} />
        {/* Vintage Burlap Rag Doll */}
        <g transform="translate(15, -145) rotate(15)">
          <ellipse cx="0" cy="0" rx="8" ry="14" fill="#8C7355" stroke="#2D2218" strokeWidth="1" />
          <line x1="-6" y1="-5" x2="-14" y2="5" stroke="#8C7355" strokeWidth="3.5" />
          <line x1="6" y1="-5" x2="14" y2="5" stroke="#8C7355" strokeWidth="3.5" />
          <line x1="-4" y1="12" x2="-6" y2="22" stroke="#8C7355" strokeWidth="3.5" />
          <line x1="4" y1="12" x2="6" y2="22" stroke="#8C7355" strokeWidth="3.5" />
          <circle cx="0" cy="-14" r="3" fill={COLOR_PALETTE.accent_blood_red} />
        </g>
      </g>
    );
  }

  // Shivering pose
  if (pose === "pose_shivering") {
    return (
      <g className="anim-arms-tremble">
        <path d="M -24 -185 C -20 -160, -5 -145, 12 -150 C 14 -155, 10 -165, -8 -160 C -18 -170, -20 -180, -24 -185 Z" fill={sleeveColor} />
        <path d="M 24 -185 C 20 -160, 5 -140, -14 -145 C -16 -150, -10 -160, 8 -155 C 18 -168, 20 -180, 24 -185 Z" fill={sleeveShadowColor} />
        <circle cx="13" cy="-150" r="4.5" fill={handColor} />
        <circle cx="-15" cy="-145" r="4.5" fill={handShadowColor} />
      </g>
    );
  }

  // Walking pose
  if (pose === "pose_walking") {
    return (
      <g className="anim-arms-walk">
        <path d="M -25 -185 C -35 -150, -45 -120, -50 -102 L -42 -100 C -37 -120, -28 -145, -20 -185 Z" fill={sleeveColor} />
        <path d="M 25 -185 C 32 -150, 40 -120, 45 -104 L 38 -102 C 33 -120, 26 -145, 20 -185 Z" fill={sleeveShadowColor} />
        <circle cx="-46" cy="-98" r="4.8" fill={handColor} />
        <circle cx="42" cy="-100" r="4.5" fill={handShadowColor} />
      </g>
    );
  }

  // Floating pose
  if (pose === "pose_floating") {
    return (
      <g className="anim-arms-float">
        <path d="M -25 -185 C -50 -175, -75 -180, -90 -193 C -86 -198, -68 -190, -45 -190 C -35 -190, -26 -188, -22 -185 Z" fill={sleeveColor} />
        <path d="M 25 -185 C 50 -175, 75 -180, 90 -193 C 86 -198, 68 -190, 45 -190 C 35 -190, 26 -188, 22 -185 Z" fill={sleeveShadowColor} />
        <circle cx="-93" cy="-196" r="4.5" fill={handColor} />
        <circle cx="93" cy="-196" r="4.5" fill={handShadowColor} />
      </g>
    );
  }

  // Default standing arms
  return (
    <g>
      <path d="M -25 -185 C -28 -150, -26 -125, -22 -99 L -16 -99 C -20 -125, -21 -150, -18 -185 Z" fill={sleeveColor} />
      <path d="M 25 -185 C 28 -150, 26 -125, 22 -99 L 16 -99 C 20 -125, 21 -150, 18 -185 Z" fill={sleeveShadowColor} />
      <circle cx="-19" cy="-95" r="4.5" fill={handColor} />
      <circle cx="19" cy="-95" r="4.5" fill={handShadowColor} />
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
