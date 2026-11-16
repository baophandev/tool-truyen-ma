import type { SkyPresetId, SubtitleStyleId, SubtitleAnimId } from "./types";

export interface SubtitleThemeDefinition {
  id: SubtitleStyleId;
  label: string;
  textColor: string;
  accentColor: string;
  textShadowCss: string;
  canvasGlowOuter: string;
  canvasGlowOuterBlur: number;
  canvasGlowInner: string;
  canvasGlowInnerBlur: number;
  canvasStrokeDark: string;
  backdropGradientCss: string;
}

export const SUBTITLE_THEMES: Record<
  Exclude<SubtitleStyleId, "auto">,
  SubtitleThemeDefinition
> = {
  blood_red: {
    id: "blood_red",
    label: "Viền Bóng Đỏ Máu (Trăng Máu / Oan Hồn)",
    textColor: "#FFF1F2",
    accentColor: "#FCA5A5",
    textShadowCss:
      "0 0 6px #EF4444, 0 0 16px #DC2626, 0 0 32px rgba(185, 28, 28, 0.85), 0 2px 4px #000000, 0 0 2px #000000",
    canvasGlowOuter: "rgba(185, 28, 28, 0.85)",
    canvasGlowOuterBlur: 28,
    canvasGlowInner: "#DC2626",
    canvasGlowInnerBlur: 14,
    canvasStrokeDark: "#000000",
    backdropGradientCss:
      "radial-gradient(ellipse at center, rgba(30, 4, 4, 0.75) 0%, rgba(15, 2, 2, 0.45) 55%, rgba(0, 0, 0, 0) 100%)",
  },
  smoky_grey: {
    id: "smoky_grey",
    label: "Viền Bóng Xám Khói (Sương Đêm / Bão Tối)",
    textColor: "#F8FAFC",
    accentColor: "#CBD5E1",
    textShadowCss:
      "0 0 8px rgba(226, 232, 240, 0.8), 0 0 20px rgba(100, 116, 139, 0.85), 0 0 36px rgba(30, 41, 59, 0.95), 0 2px 4px #000000, 0 0 2px #000000",
    canvasGlowOuter: "rgba(30, 41, 59, 0.95)",
    canvasGlowOuterBlur: 30,
    canvasGlowInner: "rgba(148, 163, 184, 0.8)",
    canvasGlowInnerBlur: 14,
    canvasStrokeDark: "#000000",
    backdropGradientCss:
      "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.75) 0%, rgba(8, 11, 20, 0.45) 55%, rgba(0, 0, 0, 0) 100%)",
  },
  emerald_phantom: {
    id: "emerald_phantom",
    label: "Lân Tinh Quỷ Dị (Nhật Thực / Cương Thi)",
    textColor: "#ECFDF5",
    accentColor: "#6EE7B7",
    textShadowCss:
      "0 0 8px #10B981, 0 0 20px #059669, 0 0 36px rgba(4, 120, 87, 0.85), 0 2px 4px #000000, 0 0 2px #000000",
    canvasGlowOuter: "rgba(4, 120, 87, 0.85)",
    canvasGlowOuterBlur: 28,
    canvasGlowInner: "#10B981",
    canvasGlowInnerBlur: 14,
    canvasStrokeDark: "#000000",
    backdropGradientCss:
      "radial-gradient(ellipse at center, rgba(4, 28, 20, 0.75) 0%, rgba(2, 14, 10, 0.45) 55%, rgba(0, 0, 0, 0) 100%)",
  },
  candle_amber: {
    id: "candle_amber",
    label: "Vàng Nến Âm Ty (Bùa Chu Sa / Nến Cầu Hồn)",
    textColor: "#FFFBEB",
    accentColor: "#FCD34D",
    textShadowCss:
      "0 0 8px #F59E0B, 0 0 20px #D97706, 0 0 36px rgba(180, 83, 9, 0.8), 0 2px 4px #000000, 0 0 2px #000000",
    canvasGlowOuter: "rgba(180, 83, 9, 0.8)",
    canvasGlowOuterBlur: 28,
    canvasGlowInner: "#F59E0B",
    canvasGlowInnerBlur: 14,
    canvasStrokeDark: "#000000",
    backdropGradientCss:
      "radial-gradient(ellipse at center, rgba(30, 20, 4, 0.75) 0%, rgba(15, 10, 2, 0.45) 55%, rgba(0, 0, 0, 0) 100%)",
  },
  cyan_fluorescent: {
    id: "cyan_fluorescent",
    label: "Xanh Băng Huỳnh Quang (Bệnh Viện / Xe Buýt)",
    textColor: "#F0FDF4",
    accentColor: "#67E8F9",
    textShadowCss:
      "0 0 8px #06B6D4, 0 0 20px #0891B2, 0 0 36px rgba(14, 116, 144, 0.85), 0 2px 4px #000000, 0 0 2px #000000",
    canvasGlowOuter: "rgba(14, 116, 144, 0.85)",
    canvasGlowOuterBlur: 28,
    canvasGlowInner: "#06B6D4",
    canvasGlowInnerBlur: 14,
    canvasStrokeDark: "#000000",
    backdropGradientCss:
      "radial-gradient(ellipse at center, rgba(6, 30, 36, 0.75) 0%, rgba(3, 15, 18, 0.45) 55%, rgba(0, 0, 0, 0) 100%)",
  },
};

/**
 * Resolves effective Subtitle Style ID from scene sky preset and custom preference
 */
export function resolveSubtitleStyle(
  skyPreset?: SkyPresetId,
  style?: SubtitleStyleId
): Exclude<SubtitleStyleId, "auto"> {
  if (style && style !== "auto" && SUBTITLE_THEMES[style]) {
    return style;
  }
  switch (skyPreset) {
    case "blood_moon":
      return "blood_red";
    case "eclipse_abyss":
      return "emerald_phantom";
    case "flickering_fluorescent":
      return "cyan_fluorescent";
    case "dim_indoor_night":
      return "candle_amber";
    case "foggy_night":
    case "stormy_dark":
    default:
      return "smoky_grey";
  }
}

export interface WordEvaluation {
  text: string;
  opacity: number;
  isActive: boolean;
}

export interface SubtitleEvaluation {
  overallOpacity: number;
  words: WordEvaluation[];
  isFinished: boolean;
  activeWordIndex: number;
}

/**
 * Deterministically evaluates subtitle words visibility, opacity, and active typewriter state
 * at a given playback timestamp.
 */
export function evaluateSubtitleTiming(
  text?: string,
  currentTimeSec?: number,
  durationSec: number = 6,
  animMode: SubtitleAnimId = "typewriter_fade"
): SubtitleEvaluation | null {
  if (!text || !text.trim()) return null;

  const rawWords = text.trim().split(/\s+/);
  if (rawWords.length === 0) return null;

  // Static edit preview or snapshot export -> 100% visible
  if (currentTimeSec === undefined || animMode === "static") {
    return {
      overallOpacity: 1,
      words: rawWords.map((w) => ({ text: w, opacity: 1, isActive: false })),
      isFinished: true,
      activeWordIndex: -1,
    };
  }

  const safeDuration = Math.max(1.5, durationSec);
  const t = Math.max(0, Math.min(safeDuration, currentTimeSec));

  // Cinematic timing curve:
  // Lead-in pause: 0.35s - 0.5s for initial scene atmosphere to set in
  const tStart = Math.min(0.45, safeDuration * 0.08);
  // Typewriter completion: finishes around 72% of scene duration to allow viewer to absorb
  const tEndTyping = Math.min(safeDuration - 1.2, safeDuration * 0.72);
  // Fade-out starts at 90% of scene duration
  const tFadeOutStart = Math.min(safeDuration - 0.5, safeDuration * 0.9);

  // 1. Overall Opacity (Fade in at start, fade out at end of scene)
  let overallOpacity = 1;
  if (t < tStart) {
    overallOpacity = 0;
  } else if (t >= tFadeOutStart) {
    const fadeRatio = (t - tFadeOutStart) / (safeDuration - tFadeOutStart);
    overallOpacity = Math.max(0, 1 - Math.min(1, fadeRatio));
  }

  if (overallOpacity <= 0) {
    return {
      overallOpacity: 0,
      words: rawWords.map((w) => ({ text: w, opacity: 0, isActive: false })),
      isFinished: false,
      activeWordIndex: -1,
    };
  }

  // 2. Smooth fade mode: whole sentence fades in and stays
  if (animMode === "smooth_fade") {
    const enterDuration = 1.0;
    const enterProgress = Math.min(1, Math.max(0, (t - tStart) / enterDuration));
    return {
      overallOpacity: overallOpacity * enterProgress,
      words: rawWords.map((w) => ({ text: w, opacity: 1, isActive: false })),
      isFinished: enterProgress >= 1,
      activeWordIndex: -1,
    };
  }

  // 3. Word-by-word / Typewriter Fade
  const typingDuration = Math.max(0.6, tEndTyping - tStart);
  const typingProgress = Math.max(0, Math.min(1, (t - tStart) / typingDuration));
  const floatingIndex = typingProgress * rawWords.length;
  const activeIndex = Math.min(rawWords.length - 1, Math.floor(floatingIndex));
  const isFinished = typingProgress >= 1;

  const words: WordEvaluation[] = rawWords.map((word, idx) => {
    if (isFinished || idx < activeIndex) {
      return { text: word, opacity: 1, isActive: false };
    }
    if (idx > activeIndex) {
      return { text: word, opacity: 0, isActive: false };
    }
    // Actively emerging word (idx === activeIndex)
    const wordProgress = floatingIndex - idx; // 0.0 to 1.0
    if (animMode === "word_by_word") {
      return { text: word, opacity: wordProgress >= 0.2 ? 1 : 0, isActive: true };
    }
    // "typewriter_fade": subtle fast fade ramp for the current word
    const ramp = Math.min(1, Math.max(0.1, wordProgress * 1.6));
    return { text: word, opacity: ramp, isActive: true };
  });

  return {
    overallOpacity,
    words,
    isFinished,
    activeWordIndex: isFinished ? -1 : activeIndex,
  };
}

/**
 * Breaks long text into balanced lines for 1920x1080 canvas subtitle layout
 */
function layoutSubtitleLines(
  ctx: CanvasRenderingContext2D,
  words: WordEvaluation[],
  maxWidth: number
): Array<{ words: WordEvaluation[]; totalWidth: number }> {
  const spaceWidth = ctx.measureText(" ").width;
  const lines: Array<{ words: WordEvaluation[]; totalWidth: number }> = [];
  let currentLineWords: WordEvaluation[] = [];
  let currentLineWidth = 0;

  for (const wordItem of words) {
    const wordWidth = ctx.measureText(wordItem.text).width;
    const testWidth = currentLineWidth === 0 ? wordWidth : currentLineWidth + spaceWidth + wordWidth;

    if (testWidth > maxWidth && currentLineWords.length > 0) {
      lines.push({ words: currentLineWords, totalWidth: currentLineWidth });
      currentLineWords = [wordItem];
      currentLineWidth = wordWidth;
    } else {
      currentLineWords.push(wordItem);
      currentLineWidth = testWidth;
    }
  }

  if (currentLineWords.length > 0) {
    lines.push({ words: currentLineWords, totalWidth: currentLineWidth });
  }

  return lines;
}

/**
 * Draws High-Fidelity Cinematic Subtitles onto HTML5 Canvas for Video/Snapshot Exporter
 */
export function drawCanvasCinemaSubtitle(
  ctx: CanvasRenderingContext2D,
  dialogue?: string,
  width = 1920,
  height = 1080,
  currentTimeSec?: number,
  durationSec = 6,
  skyPreset?: SkyPresetId,
  subtitleStyle?: SubtitleStyleId,
  animMode: SubtitleAnimId = "typewriter_fade"
): void {
  if (!dialogue || !dialogue.trim()) return;

  const evaluation = evaluateSubtitleTiming(dialogue, currentTimeSec, durationSec, animMode);
  if (!evaluation || evaluation.overallOpacity <= 0) return;

  const styleId = resolveSubtitleStyle(skyPreset, subtitleStyle);
  const theme = SUBTITLE_THEMES[styleId];

  ctx.save();

  // Typography: Cinematic Gothic / Literary Serif with elegant kerning
  ctx.font = 'italic 600 32px "Cormorant Garamond", "Cinzel", "Playfair Display", Georgia, "Times New Roman", serif';
  ctx.textBaseline = "middle";

  const maxLineWidth = Math.min(1440, width - 240);
  const lines = layoutSubtitleLines(ctx, evaluation.words, maxLineWidth);
  const lineHeight = 46;
  const totalBlockHeight = lines.length * lineHeight;
  const startY = height - 70 - (lines.length - 1) * lineHeight;

  // 1. Cinematic Atmospheric Dark Gradient Backdrop Underlay
  const backdropGradient = ctx.createRadialGradient(
    width / 2,
    startY + (totalBlockHeight / 2),
    40,
    width / 2,
    startY + (totalBlockHeight / 2),
    720
  );
  if (styleId === "blood_red") {
    backdropGradient.addColorStop(0, `rgba(28, 4, 4, ${0.72 * evaluation.overallOpacity})`);
    backdropGradient.addColorStop(0.65, `rgba(12, 2, 2, ${0.4 * evaluation.overallOpacity})`);
    backdropGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  } else if (styleId === "emerald_phantom") {
    backdropGradient.addColorStop(0, `rgba(4, 26, 18, ${0.72 * evaluation.overallOpacity})`);
    backdropGradient.addColorStop(0.65, `rgba(2, 12, 8, ${0.4 * evaluation.overallOpacity})`);
    backdropGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  } else if (styleId === "candle_amber") {
    backdropGradient.addColorStop(0, `rgba(32, 20, 4, ${0.72 * evaluation.overallOpacity})`);
    backdropGradient.addColorStop(0.65, `rgba(14, 8, 2, ${0.4 * evaluation.overallOpacity})`);
    backdropGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  } else {
    backdropGradient.addColorStop(0, `rgba(10, 14, 24, ${0.75 * evaluation.overallOpacity})`);
    backdropGradient.addColorStop(0.65, `rgba(6, 8, 14, ${0.42 * evaluation.overallOpacity})`);
    backdropGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  }

  ctx.fillStyle = backdropGradient;
  ctx.fillRect(width / 2 - 760, startY - 35, 1520, totalBlockHeight + 70);

  // 2. Render Words line by line with multi-pass atmospheric glows
  const spaceWidth = ctx.measureText(" ").width;

  lines.forEach((line, lineIdx) => {
    const lineY = startY + lineIdx * lineHeight;
    let cursorX = (width - line.totalWidth) / 2;

    for (const wordItem of line.words) {
      const wordWidth = ctx.measureText(wordItem.text).width;
      const effectiveAlpha = evaluation.overallOpacity * wordItem.opacity;

      if (effectiveAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = effectiveAlpha;

        // Pass 1: Broad atmospheric aura glow
        ctx.shadowColor = theme.canvasGlowOuter;
        ctx.shadowBlur = theme.canvasGlowOuterBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = theme.accentColor;
        ctx.fillText(wordItem.text, cursorX, lineY);

        // Pass 2: Intense inner spectral glow
        ctx.shadowColor = theme.canvasGlowInner;
        ctx.shadowBlur = theme.canvasGlowInnerBlur;
        ctx.fillText(wordItem.text, cursorX, lineY);

        // Pass 3: Crisp dark contour edge for maximum readability over bright fog
        ctx.shadowColor = theme.canvasStrokeDark;
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = theme.textColor;
        ctx.fillText(wordItem.text, cursorX, lineY);

        ctx.restore();
      }

      cursorX += wordWidth + spaceWidth;
    }
  });

  ctx.restore();
}

