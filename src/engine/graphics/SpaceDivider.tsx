import React from "react";
import type { SpaceDividerConfig, GroundSlotId, SpaceDividerStyle } from "../types";
import { ALL_SLOTS, CANVAS_HEIGHT } from "../constants";

interface SpaceDividerProps {
  config?: SpaceDividerConfig | boolean | GroundSlotId;
  showLabels?: boolean;
}

/**
 * SPACE DIVIDER RENDERER (Cột / Vách Ngăn Phân Chia 2 Không Gian Khác Nhau)
 * Anchored in World Space (layer-2-ground-world) so it pans & zooms in 100% lockstep with the scene.
 * Clearly separates Space A (left) from Space B (right) with authentic architecture & ambient shadows.
 */
export const SpaceDividerRenderer: React.FC<SpaceDividerProps> = ({
  config,
  showLabels = false,
}) => {
  if (!config) return null;

  let slotId: GroundSlotId = "mid_left";
  let offsetX = 0;
  let style: SpaceDividerStyle = "wooden_pillar";
  let width = 64;
  let labelLeft = "";
  let labelRight = "";

  if (typeof config === "string") {
    slotId = config;
  } else if (typeof config === "boolean") {
    if (!config) return null;
    slotId = "mid_left";
  } else if (typeof config === "object") {
    if (config.enabled === false) return null;
    slotId = config.slot || "mid_left";
    offsetX = config.offsetX || 0;
    style = config.style || "wooden_pillar";
    width = config.width || 64;
    labelLeft = config.label_left || "";
    labelRight = config.label_right || "";
  }

  const slot = ALL_SLOTS[slotId] || { x: 600, y: 800 };
  const posX = slot.x + offsetX;
  const halfW = width / 2;

  return (
    <g className="space-divider-root" pointerEvents="none">
      {/* 1. Ambient Occlusion / Shadow Gradient separating Space Left from Space Right */}
      {/* Shadow cast to the left into Space A */}
      <rect
        x={posX - halfW - 120}
        y="0"
        width="120"
        height={CANVAS_HEIGHT}
        fill="url(#right-shadow-vignette)"
        opacity="0.8"
      />
      {/* Shadow cast to the right into Space B */}
      <rect
        x={posX + halfW}
        y="0"
        width="120"
        height={CANVAS_HEIGHT}
        fill="url(#left-shadow-vignette)"
        opacity="0.8"
      />

      {/* 2. Architectural Divider Rendering */}
      {style === "bamboo_partition" ? (
        <g className="bamboo-divider">
          {/* Main Bamboo Slats Wall */}
          <rect
            x={posX - halfW}
            y="0"
            width={width}
            height={CANVAS_HEIGHT}
            fill="#090C10"
            stroke="#161B24"
            strokeWidth="2"
          />
          {/* Vertical bamboo tubes */}
          {Array.from({ length: Math.max(3, Math.floor(width / 12)) }).map((_, i) => {
            const bx = posX - halfW + 6 + i * 12;
            return (
              <g key={`bamboo-col-${i}`}>
                <line x1={bx} y1="0" x2={bx} y2={CANVAS_HEIGHT} stroke="#1C2433" strokeWidth="3" />
                <line x1={bx - 1} y1="0" x2={bx - 1} y2={CANVAS_HEIGHT} stroke="#2D3A50" strokeWidth="1" opacity="0.6" />
              </g>
            );
          })}
          {/* Horizontal rattan tie bindings */}
          {[120, 240, 360, 480, 600, 720, 800, 920].map((by) => (
            <rect
              key={`tie-${by}`}
              x={posX - halfW - 2}
              y={by}
              width={width + 4}
              height="8"
              rx="2"
              fill="#3E2E1E"
              stroke="#1F150C"
              strokeWidth="1"
            />
          ))}
        </g>
      ) : style === "brick_wall" ? (
        <g className="brick-divider">
          <rect
            x={posX - halfW}
            y="0"
            width={width}
            height={CANVAS_HEIGHT}
            fill="#0C0E14"
            stroke="#1E2433"
            strokeWidth="2"
          />
          {/* Brick masonry lines */}
          {Array.from({ length: 26 }).map((_, i) => {
            const by = i * 42;
            return (
              <line
                key={`brick-h-${i}`}
                x1={posX - halfW}
                y1={by}
                x2={posX + halfW}
                y2={by}
                stroke="#151A24"
                strokeWidth="1.5"
              />
            );
          })}
        </g>
      ) : style === "black_silhouette" ? (
        <g className="silhouette-divider">
          <rect
            x={posX - halfW}
            y="0"
            width={width}
            height={CANVAS_HEIGHT}
            fill="#05070A"
            stroke="#10141D"
            strokeWidth="2"
          />
          <line
            x1={posX - halfW + 4}
            y1="0"
            x2={posX - halfW + 4}
            y2={CANVAS_HEIGHT}
            stroke="#1E2738"
            strokeWidth="1.2"
            opacity="0.6"
          />
          <line
            x1={posX + halfW - 4}
            y1="0"
            x2={posX + halfW - 4}
            y2={CANVAS_HEIGHT}
            stroke="#020304"
            strokeWidth="2"
          />
        </g>
      ) : (
        /* Default: "wooden_pillar" (Cột gỗ lim lớn chia 2 không gian) */
        <g className="wooden-pillar-divider">
          {/* Main Heavy Timber Column Body */}
          <rect
            x={posX - halfW}
            y="0"
            width={width}
            height={CANVAS_HEIGHT}
            fill="#07090D"
            stroke="#171C26"
            strokeWidth="2"
          />
          {/* Longitudinal deep shadow groove down center */}
          <line x1={posX} y1="0" x2={posX} y2={CANVAS_HEIGHT} stroke="#020305" strokeWidth="5" />
          {/* Left highlight ridge */}
          <line
            x1={posX - halfW + 6}
            y1="0"
            x2={posX - halfW + 6}
            y2={CANVAS_HEIGHT}
            stroke="#222B3B"
            strokeWidth="2.5"
          />
          {/* Right edge shadow */}
          <line
            x1={posX + halfW - 4}
            y1="0"
            x2={posX + halfW - 4}
            y2={CANVAS_HEIGHT}
            stroke="#030406"
            strokeWidth="3"
          />
          {/* Stone Plinth Footing at ground line Y = 800px */}
          <polygon
            points={`${posX - halfW - 14},800 ${posX + halfW + 14},800 ${posX + halfW + 6},782 ${posX - halfW - 6},782`}
            fill="#121620"
            stroke="#242E40"
            strokeWidth="1.5"
          />
          <polygon
            points={`${posX - halfW - 14},800 ${posX + halfW + 14},800 ${posX + halfW + 10},814 ${posX - halfW - 10},814`}
            fill="#090C12"
            stroke="#1A212E"
            strokeWidth="1.5"
          />
        </g>
      )}

      {/* 3. Space Semantics Badges / Labels (Ký hiệu chia 2 không gian) */}
      {(showLabels || labelLeft || labelRight) && (
        <g className="space-labels" opacity="0.9">
          {labelLeft && (
            <g transform={`translate(${posX - halfW - 12}, 95)`}>
              <rect
                x="-140"
                y="-14"
                width="140"
                height="28"
                rx="6"
                fill="#0A0E17"
                stroke="#2563EB"
                strokeWidth="1.2"
              />
              <text
                x="-70"
                y="4"
                fill="#93C5FD"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                ◂ {labelLeft}
              </text>
            </g>
          )}
          {labelRight && (
            <g transform={`translate(${posX + halfW + 12}, 95)`}>
              <rect
                x="0"
                y="-14"
                width="140"
                height="28"
                rx="6"
                fill="#0A0E17"
                stroke="#059669"
                strokeWidth="1.2"
              />
              <text
                x="70"
                y="4"
                fill="#6EE7B7"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {labelRight} ▸
              </text>
            </g>
          )}
        </g>
      )}
    </g>
  );
};

