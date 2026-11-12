import React from "react";
import type {
  CharacterBaseId,
  CharacterFaceId,
  CharacterPoseId,
  CostumeId,
  FacingDirection,
} from "../types";
import { COLOR_PALETTE } from "../constants";
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
          <GhostTail />
        ) : (
          <LowerBodyOutfit costume={activeCostume} base={base} pose={pose} />
        )}
      </g>

      {/* 2. TORSO & OUTFIT COLLECTION */}
      <g className="rig-torso-costume">
        <TorsoOutfit costume={activeCostume} base={base} pose={pose} />
      </g>

      {/* 3. ARMS & SLEEVES */}
      <g className="rig-arms-costume">
        <ArmsRig costume={activeCostume} base={base} pose={pose} />
      </g>

      {/* 4. NECK SOCKET */}
      <path
        d="M -7 -190 L -6 -218 L 6 -218 L 7 -190 Z"
        fill={COLOR_PALETTE.silhouette_primary}
      />

      {/* 5. BASE-SPECIFIC HEAD ACCESSORIES */}
      {base === "female_adult" && (
        <g className="rig-hair">
          <path
            d="M -18 -260 C -45 -220, -40 -160, -32 -110 C -28 -125, -25 -170, -18 -210 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
          <path
            d="M 18 -260 C 42 -220, 38 -160, 30 -105 C 26 -125, 23 -170, 18 -210 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
        </g>
      )}

      {base === "jiangshi_corpse" && (
        <g className="rig-jiangshi-hat" transform="translate(0, -250)">
          <path d="M -30 -18 C -20 -38, 20 -38, 30 -18 Z" fill={COLOR_PALETTE.silhouette_primary} />
          <circle cx="0" cy="-38" r="4.5" fill={COLOR_PALETTE.accent_blood_red} />
          <line x1="0" y1="-38" x2="25" y2="-20" stroke={COLOR_PALETTE.accent_eerie_gold} strokeWidth="2" />
        </g>
      )}

      {base === "demon_shadow" && (
        <g className="rig-demon-horns" transform="translate(0, -250)">
          <path
            d="M -18 -15 C -35 -40, -55 -60, -50 -85 C -40 -70, -30 -40, -12 -28 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
          <path
            d="M 18 -15 C 35 -40, 55 -60, 50 -85 C 40 -70, 30 -40, 12 -28 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
        </g>
      )}

      {/* Hooded Cloak Special Hood Overlay */}
      {activeCostume === "outfit_shrouded_cloak" && (
        <g className="rig-cloak-hood" transform="translate(0, -250)">
          {/* Deep voluminous cowl covering head and casting shadow */}
          <path
            d="M -28 10 C -38 -20, -32 -48, 0 -60 C 32 -48, 38 -20, 28 10 C 20 22, -20 22, -28 10 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
          {/* Inner dark void of the hood */}
          <ellipse cx="0" cy="-6" rx="20" ry="24" fill="#010103" />
        </g>
      )}

      {/* 6. HEAD & INTERCHANGEABLE FACE */}
      <g className="rig-head-group" transform="translate(0, -250)">
        {activeCostume !== "outfit_shrouded_cloak" && (
          <ellipse
            cx="0"
            cy="0"
            rx={isChild ? "26" : "22"}
            ry={isChild ? "26" : "28"}
            fill={COLOR_PALETTE.silhouette_primary}
          />
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
const TorsoOutfit: React.FC<{ costume: CostumeId; base: CharacterBaseId; pose: CharacterPoseId }> = ({
  costume,
  base,
}) => {
  const isDemon = base === "demon_shadow";

  switch (costume) {
    case "outfit_flowing_ao_dai":
      return (
        <g className="costume-ao-dai-torso">
          {/* Slender traditional tunic hugging the torso */}
          <path
            d="M -18 -190 C -15 -150, -14 -120, -13 -90 L 13 -90 C 14 -120, 15 -150, 18 -190 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
          {/* Asymmetric collar / lapel curve */}
          <path d="M -8 -198 Q 0 -170 12 -185 L 0 -160 Z" fill={COLOR_PALETTE.silhouette_secondary} />
          {/* Subtle silk sash at waist */}
          <line x1="-14" y1="-92" x2="14" y2="-92" stroke={COLOR_PALETTE.silhouette_highlight} strokeWidth="3" />
        </g>
      );

    case "outfit_shrouded_cloak":
      return (
        <g className="costume-shrouded-cloak-torso">
          {/* Heavy flowing mantle over shoulders */}
          <path
            d="M -35 -195 C -45 -140, -40 -100, -35 -85 L 35 -85 C 40 -100, 45 -140, 35 -195 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
          {/* Cowl folds across chest */}
          <path
            d="M -22 -190 Q 0 -140 22 -190 L 12 -120 L -12 -120 Z"
            fill={COLOR_PALETTE.silhouette_secondary}
            opacity="0.85"
          />
        </g>
      );

    case "outfit_mandarin_court":
      return (
        <g className="costume-mandarin-court-torso">
          {/* Stiff rectangular shoulders and court robe */}
          <polygon points="-32,-195 -35,-90 35,-90 32,-195" fill={COLOR_PALETTE.silhouette_primary} />
          {/* Rank Badge (Bổ Tử) on chest */}
          <rect x="-16" y="-165" width="32" height="32" fill={COLOR_PALETTE.silhouette_secondary} />
          <rect x="-14" y="-163" width="28" height="28" fill="none" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="1.5" />
          <polygon points="-6,-149 0,-157 6,-149 0,-141" fill={COLOR_PALETTE.accent_blood_red} />
          {/* Court Beads (Triều châu) necklace */}
          <path d="M -18 -190 Q 0 -125 18 -190" stroke={COLOR_PALETTE.accent_eerie_gold} strokeWidth="2" strokeDasharray="3,3" fill="none" />
        </g>
      );

    case "outfit_monk_cassock":
      return (
        <g className="costume-monk-cassock-torso">
          {/* Diagonal monastic cassock / Taoist robe */}
          <path d="M -22 -190 L -18 -90 L 18 -90 L 22 -190 Z" fill={COLOR_PALETTE.silhouette_primary} />
          {/* Stole draped diagonally across chest */}
          <polygon points="-22,-190 -8,-190 18,-90 6,-90" fill={COLOR_PALETTE.silhouette_secondary} />
          {/* Heavy wooden Buddhist prayer beads dangling across chest */}
          <path d="M -15 -190 Q 0 -130 15 -170" stroke={COLOR_PALETTE.accent_eerie_gold} strokeWidth="3" strokeDasharray="4,4" fill="none" />
          {/* Yellow talisman tucked into belt */}
          <polygon points="-6,-95 2,-95 1,-75 -7,-75" fill={COLOR_PALETTE.accent_talisman_yellow} />
        </g>
      );

    case "outfit_shredded_burial":
      return (
        <g className="costume-burial-shroud-torso">
          {/* Criss-crossed bandages and mummified shroud strips */}
          <path d="M -20 -185 L -16 -90 L 16 -90 L 20 -185 Z" fill={COLOR_PALETTE.silhouette_primary} />
          <line x1="-20" y1="-175" x2="16" y2="-120" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2.5" opacity="0.4" />
          <line x1="20" y1="-165" x2="-16" y2="-110" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2.5" opacity="0.4" />
          <line x1="-18" y1="-135" x2="14" y2="-95" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2" opacity="0.35" />
          {/* Ragged shroud trailing ribbons */}
          <path d="M -12 -150 Q -28 -110 -22 -75" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2" fill="none" opacity="0.5" className="anim-sway-subtle" />
        </g>
      );

    case "outfit_ancient_armor":
      return (
        <g className="costume-ancient-armor-torso">
          {/* Heavy Warrior Cuirass / Scale armor plate */}
          <path
            d="M -26 -195 C -30 -160, -25 -120, -20 -90 L 20 -90 C 25 -120, 30 -160, 26 -195 Z"
            fill={COLOR_PALETTE.silhouette_primary}
          />
          {/* Broken Heart-Protecting Bronze Mirror Crest (Hộ tâm kính nứt vỡ) */}
          <circle cx="0" cy="-145" r="14" fill={COLOR_PALETTE.silhouette_secondary} stroke={COLOR_PALETTE.silhouette_highlight} strokeWidth="2" />
          <line x1="-8" y1="-150" x2="6" y2="-138" stroke="#000" strokeWidth="2" />
          {/* Armored Waist Belt with Beast Buckle */}
          <rect x="-22" y="-96" width="44" height="12" fill={COLOR_PALETTE.silhouette_secondary} />
          <polygon points="-6,-96 0,-102 6,-96 0,-90" fill={COLOR_PALETTE.accent_eerie_gold} />
          {/* Lamellar scales on chest */}
          <line x1="-18" y1="-175" x2="18" y2="-175" stroke={COLOR_PALETTE.silhouette_highlight} strokeWidth="2" strokeDasharray="4,3" />
        </g>
      );

    case "outfit_child_pajamas":
      return (
        <g className="costume-child-pajamas-torso">
          {/* Traditional Halter-neck Apron (Áo Yếm) */}
          <path d="M -16 -175 C -18 -140, -15 -110, -14 -85 L 14 -85 C 15 -110, 18 -140, 16 -175 Z" fill={COLOR_PALETTE.silhouette_primary} />
          {/* Yếm neck cord & bib front */}
          <path d="M -8 -175 Q 0 -150 8 -175 Z" fill={COLOR_PALETTE.accent_blood_red} opacity="0.75" />
          {/* Waist tie knot */}
          <circle cx="0" cy="-88" r="3" fill={COLOR_PALETTE.silhouette_secondary} />
        </g>
      );

    case "outfit_tattered_tunic":
    default:
      return (
        <g className="costume-tattered-tunic-torso">
          {/* Peasant rough-woven tunic */}
          <path
            d={
              isDemon
                ? "M -35 -195 C -45 -150, -32 -115, -22 -90 L 22 -90 C 32 -115, 45 -150, 35 -195 Z"
                : "M -22 -185 C -25 -150, -20 -115, -16 -92 L 16 -92 C 20 -115, 25 -150, 22 -185 Z"
            }
            fill={COLOR_PALETTE.silhouette_primary}
          />
          {/* Ragged tattered tunic folds and hemp rope belt */}
          <path d="M -18 -120 L -6 -88 L 0 -92 L 7 -87 L 18 -120 Z" fill={COLOR_PALETTE.silhouette_secondary} />
          <line x1="-16" y1="-93" x2="16" y2="-93" stroke={COLOR_PALETTE.accent_eerie_gold} strokeWidth="2" strokeDasharray="3,2" />
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
}> = ({ costume, base, pose }) => {
  const isWalking = pose === "pose_walking";
  const isShivering = pose === "pose_shivering";
  const isCrawling = pose === "pose_crawling";

  // Crawling Pose override
  if (isCrawling) {
    return (
      <g className="crawling-legs">
        <path d="M -15 -92 L -45 -40 L -65 -5 L -50 -5 L -35 -40 L -5 -92 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <path d="M 5 -92 L 25 -40 L 45 -5 L 35 -5 L 18 -40 L -2 -92 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  // 1. Áo Dài / Tứ Thân (Flowing Long Panels)
  if (costume === "outfit_flowing_ao_dai") {
    return (
      <g className={isWalking ? "anim-skirt-walk" : isShivering ? "anim-skirt-shiver" : ""}>
        {/* Black silken trousers inside */}
        <line x1="-8" y1="-90" x2="-12" y2="0" stroke="#000" strokeWidth="8" />
        <line x1="8" y1="-90" x2="12" y2="0" stroke="#000" strokeWidth="8" />
        {/* Front flowing panel (Tà trước rách mép) */}
        <path
          d="M -14 -90 C -18 -40, -25 -15, -28 0 L 28 0 C 25 -15, 18 -40, 14 -90 Z"
          fill={COLOR_PALETTE.silhouette_primary}
        />
        {/* Tattered jagged hem */}
        <polygon points="-28,0 -23,-8 -18,0 -12,-7 -6,0 0,-9 6,0 12,-6 18,0 24,-7 28,0" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  // 2. Hooded Reaper Cloak (Floor-length trailing cloak)
  if (costume === "outfit_shrouded_cloak") {
    return (
      <g className="cloak-trailing-skirt">
        {/* Voluminous bell-shaped shroud cloak falling to ground */}
        <path
          d="M -35 -90 C -48 -45, -55 -15, -58 0 L 58 0 C 55 -15, 48 -45, 35 -90 Z"
          fill={COLOR_PALETTE.silhouette_primary}
        />
        {/* Shredded bottom edge resembling wisps of black smoke */}
        <polygon points="-58,0 -50,-12 -42,0 -34,-14 -24,0 -12,-10 0,0 12,-12 24,0 36,-14 48,0 58,0" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  // 3. Mandarin Court Robe (Straight boxy skirt)
  if (costume === "outfit_mandarin_court") {
    return (
      <g className="mandarin-court-skirt">
        <path d="M -35 -90 L -38 0 L 38 0 L 35 -90 Z" fill={COLOR_PALETTE.silhouette_primary} />
        {/* Traditional Court boots */}
        <polygon points="-25,0 -25,-12 -8,-12 -6,0" fill="#000000" />
        <polygon points="6,0 8,-12 25,-12 25,0" fill="#000000" />
      </g>
    );
  }

  // 4. Ancient Armor War Skirt (Giáp váy phân phiến)
  if (costume === "outfit_ancient_armor") {
    return (
      <g className="ancient-armor-skirt">
        {/* Central split armored plates (Hạ giáp) */}
        <polygon points="-20,-90 -24,-25 -6,-25 -4,-90" fill={COLOR_PALETTE.silhouette_primary} />
        <polygon points="4,-90 6,-25 24,-25 20,-90" fill={COLOR_PALETTE.silhouette_primary} />
        <line x1="-15" y1="-85" x2="-15" y2="-30" stroke={COLOR_PALETTE.silhouette_highlight} strokeWidth="1.5" />
        <line x1="15" y1="-85" x2="15" y2="-30" stroke={COLOR_PALETTE.silhouette_highlight} strokeWidth="1.5" />
        {/* Armored greaves on legs */}
        <path d="M -14 -25 L -16 0 L -6 0 L -4 -25 Z" fill={COLOR_PALETTE.silhouette_secondary} />
        <path d="M 14 -25 L 16 0 L 6 0 L 4 -25 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  // 5. Shredded Burial Shrouds (Tangled strips)
  if (costume === "outfit_shredded_burial") {
    return (
      <g className="burial-shroud-legs">
        <line x1="-10" y1="-90" x2="-14" y2="0" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="8" />
        <line x1="10" y1="-90" x2="14" y2="0" stroke={COLOR_PALETTE.silhouette_secondary} strokeWidth="8" />
        {/* Loose linen wraps */}
        <path d="M -12 -90 Q -25 -45 -18 0" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M 12 -90 Q 25 -45 18 0" stroke={COLOR_PALETTE.accent_fog_white} strokeWidth="2" fill="none" opacity="0.4" />
      </g>
    );
  }

  // 6. Child Pajamas (Short pants)
  if (costume === "outfit_child_pajamas" || base === "creepy_child") {
    return (
      <g>
        <path d="M -10 -85 L -12 -45 L -10 0 L -4 0 L -6 -45 L -4 -85 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <path d="M 10 -85 L 12 -45 L 10 0 L 4 0 L 6 -45 L 4 -85 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  // Default Peasant Pants (male / monk / tattered tunic)
  if (isWalking) {
    return (
      <g className="anim-male-walk">
        <path d="M -12 -92 L -25 -45 L -35 0 L -22 0 L -14 -45 L -4 -92 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <path d="M 4 -92 L 18 -45 L 30 0 L 18 0 L 8 -45 L -2 -92 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  if (isShivering) {
    return (
      <g className="anim-leg-tremble">
        <path d="M -15 -92 L -8 -50 L -14 0 L -4 0 L -2 -50 L -3 -92 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <path d="M 15 -92 L 6 -50 L 12 0 L 4 0 L 1 -50 L 3 -92 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  return (
    <g>
      <path d="M -15 -92 L -18 -45 L -16 0 L -6 0 L -8 -45 L -4 -92 Z" fill={COLOR_PALETTE.silhouette_primary} />
      <path d="M 15 -92 L 18 -45 L 16 0 L 6 0 L 8 -45 L 4 -92 Z" fill={COLOR_PALETTE.silhouette_secondary} />
    </g>
  );
};

/**
 * =========================================================
 * GHOST WRAITH TAIL
 * =========================================================
 */
const GhostTail: React.FC = () => {
  return (
    <g className="anim-ghost-tail">
      <path d="M -18 -90 C -35 -40, -45 10, -30 45 C -15 25, -20 -10, -5 -60 Z" fill={COLOR_PALETTE.silhouette_primary} opacity="0.85" />
      <path d="M -8 -90 C -15 -30, -5 30, 0 65 C 5 35, 15 -20, 8 -90 Z" fill={COLOR_PALETTE.silhouette_secondary} opacity="0.9" />
      <path d="M 18 -90 C 35 -40, 48 15, 32 50 C 20 25, 15 -10, 5 -60 Z" fill={COLOR_PALETTE.silhouette_primary} opacity="0.8" />
    </g>
  );
};

/**
 * =========================================================
 * ARMS & SLEEVES RIG
 * =========================================================
 */
const ArmsRig: React.FC<{
  costume: CostumeId;
  base: CharacterBaseId;
  pose: CharacterPoseId;
}> = ({ base, pose }) => {
  // 1. Jiangshi rigid outstretched arms
  if (base === "jiangshi_corpse") {
    return (
      <g className="anim-arms-rigid">
        <polygon points="-25,-185 85,-185 85,-172 -25,-172" fill={COLOR_PALETTE.silhouette_primary} />
        {/* Long talons */}
        <polygon points="85,-185 105,-183 85,-180" fill="#000" />
        <polygon points="85,-180 108,-178 85,-175" fill="#000" />
        <polygon points="85,-175 104,-172 85,-170" fill="#000" />
      </g>
    );
  }

  // 2. Crawling pose arms
  if (pose === "pose_crawling") {
    return (
      <g>
        <path d="M -25 -185 L -55 -120 L -75 -10 L -62 -10 L -45 -115 L -20 -185 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <path d="M 25 -185 L 55 -120 L 75 -10 L 62 -10 L 45 -115 L 20 -185 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  // 3. Reaching out arms
  if (pose === "pose_reaching") {
    return (
      <g className="anim-arms-reaching">
        <path d="M -25 -185 C 10 -180, 50 -195, 95 -190 L 92 -178 C 50 -182, 10 -170, -20 -185 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <polygon points="95,-190 115,-195 100,-185" fill={COLOR_PALETTE.silhouette_primary} />
        <polygon points="95,-185 118,-185 98,-180" fill={COLOR_PALETTE.silhouette_primary} />
      </g>
    );
  }

  // 4. Hanging pose
  if (pose === "pose_hanging") {
    return (
      <g>
        <line x1="-25" y1="-185" x2="-22" y2="-85" stroke={COLOR_PALETTE.silhouette_primary} strokeWidth="7" strokeLinecap="round" />
        <line x1="25" y1="-185" x2="22" y2="-85" stroke={COLOR_PALETTE.silhouette_secondary} strokeWidth="7" strokeLinecap="round" />
      </g>
    );
  }

  // 5. Creepy child holding headless rag doll
  if (base === "creepy_child") {
    return (
      <g>
        <path d="M -16 -170 C -5 -150, 5 -150, 10 -160 L 5 -165 C 0 -155, -10 -155, -14 -170 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <g transform="translate(14, -145) rotate(15)">
          <ellipse cx="0" cy="0" rx="8" ry="14" fill="#1C1917" />
          <line x1="-6" y1="-5" x2="-14" y2="5" stroke="#1C1917" strokeWidth="3" />
          <line x1="6" y1="-5" x2="14" y2="5" stroke="#1C1917" strokeWidth="3" />
          <line x1="-4" y1="12" x2="-6" y2="22" stroke="#1C1917" strokeWidth="3" />
          <line x1="4" y1="12" x2="6" y2="22" stroke="#1C1917" strokeWidth="3" />
          <circle cx="0" cy="-14" r="3" fill={COLOR_PALETTE.accent_blood_red} />
        </g>
      </g>
    );
  }

  // Shivering pose
  if (pose === "pose_shivering") {
    return (
      <g className="anim-arms-tremble">
        <path d="M -24 -185 C -20 -160, -5 -145, 12 -150 C 14 -155, 10 -165, -8 -160 C -18 -170, -20 -180, -24 -185 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <path d="M 24 -185 C 20 -160, 5 -140, -14 -145 C -16 -150, -10 -160, 8 -155 C 18 -168, 20 -180, 24 -185 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  // Walking pose
  if (pose === "pose_walking") {
    return (
      <g className="anim-arms-walk">
        <path d="M -25 -185 C -35 -150, -45 -120, -50 -100 L -42 -98 C -37 -118, -28 -145, -20 -185 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <path d="M 25 -185 C 32 -150, 40 -120, 45 -102 L 38 -100 C 33 -118, 26 -145, 20 -185 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  // Floating pose
  if (pose === "pose_floating") {
    return (
      <g className="anim-arms-float">
        <path d="M -25 -185 C -50 -175, -75 -180, -95 -195 C -90 -200, -70 -190, -45 -190 C -35 -190, -26 -188, -22 -185 Z" fill={COLOR_PALETTE.silhouette_primary} />
        <path d="M 25 -185 C 50 -175, 75 -180, 95 -195 C 90 -200, 70 -190, 45 -190 C 35 -190, 26 -188, 22 -185 Z" fill={COLOR_PALETTE.silhouette_secondary} />
      </g>
    );
  }

  // Default standing arms
  return (
    <g>
      <path d="M -25 -185 C -28 -150, -26 -125, -22 -95 L -16 -95 C -20 -125, -21 -150, -18 -185 Z" fill={COLOR_PALETTE.silhouette_primary} />
      <path d="M 25 -185 C 28 -150, 26 -125, 22 -95 L 16 -95 C 20 -125, 21 -150, 18 -185 Z" fill={COLOR_PALETTE.silhouette_secondary} />
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
          <ellipse cx="0" cy="0" rx="18" ry="24" fill="#CBD5E1" opacity="0.9" />
        </g>
      );

    case "face_glowing_hollow":
      return (
        <g className="face-glowing-hollow">
          <ellipse cx="-7" cy="-5" rx="5" ry="6" fill="#000" />
          <ellipse cx="7" cy="-5" rx="5" ry="6" fill="#000" />
          <circle cx="-7" cy="-5" r="3" fill={COLOR_PALETTE.accent_swamp_green} className="anim-flicker-ember" />
          <circle cx="7" cy="-5" r="3" fill={COLOR_PALETTE.accent_swamp_green} className="anim-flicker-ember" />
          <ellipse cx="0" cy="14" rx="7" ry="9" fill="#000" />
          <ellipse cx="0" cy="14" rx="4" ry="6" fill={COLOR_PALETTE.accent_swamp_green} className="anim-flicker-ember" />
        </g>
      );

    case "face_talisman_covered":
      return (
        <g className="face-talisman anim-sway-subtle" transform="translate(0, -12)">
          <polygon points="-9,-12 9,-12 8,36 -8,36" fill={COLOR_PALETTE.accent_talisman_yellow} />
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
          <ellipse cx="-7" cy="-5" rx="5.5" ry="6.5" fill={COLOR_PALETTE.accent_fog_white} />
          <ellipse cx="7" cy="-5" rx="5.5" ry="6.5" fill={COLOR_PALETTE.accent_fog_white} />
          <circle cx="-7" cy="-5" r="1.5" fill="#000000" />
          <circle cx="7" cy="-5" r="1.5" fill="#000000" />
          <path
            d="M -7 9 Q 0 4 7 9 Q 5 21 0 21 Q -5 21 -7 9 Z"
            fill="#050505"
            stroke={COLOR_PALETTE.accent_fog_white}
            strokeWidth="0.8"
          />
          <ellipse cx="0" cy="17" rx="3.5" ry="2.5" fill={COLOR_PALETTE.accent_blood_red} />
        </g>
      );

    case "face_creepy_smile":
      return (
        <g className="face-creepy-smile">
          <path d="M -12 -7 Q -7 -12 -2 -7 Q -7 -5 -12 -7 Z" fill={COLOR_PALETTE.accent_fog_white} />
          <path d="M 2 -7 Q 7 -12 12 -7 Q 7 -5 2 -7 Z" fill={COLOR_PALETTE.accent_fog_white} />
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
          <circle cx="-7" cy="-5" r="4.5" fill={COLOR_PALETTE.accent_fog_white} />
          <circle cx="7" cy="-5" r="4.5" fill={COLOR_PALETTE.accent_fog_white} />
          <path d="M -8 -1 L -8 24 L -6 24 L -6 -1 Z" fill={COLOR_PALETTE.accent_blood_red} />
          <circle cx="-7" cy="25" r="1.8" fill={COLOR_PALETTE.accent_blood_red} />
          <path d="M 6 -1 L 6 22 L 8 22 L 8 -1 Z" fill={COLOR_PALETTE.accent_blood_red} />
          <circle cx="7" cy="23" r="1.8" fill={COLOR_PALETTE.accent_blood_red} />
          <line x1="-5" y1="12" x2="5" y2="12" stroke={COLOR_PALETTE.accent_blood_red} strokeWidth="1" />
        </g>
      );

    case "face_calm":
    default:
      return (
        <g className="face-calm">
          <circle cx="-6" cy="-4" r="2" fill={COLOR_PALETTE.accent_fog_white} opacity="0.75" />
          <circle cx="6" cy="-4" r="2" fill={COLOR_PALETTE.accent_fog_white} opacity="0.75" />
          <line x1="-4" y1="11" x2="4" y2="11" stroke="#000" strokeWidth="1.2" />
        </g>
      );
  }
};
