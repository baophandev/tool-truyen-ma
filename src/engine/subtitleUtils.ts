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

export interface TimedSubtitleCue {
  index: number;
  text: string;
  startTimeSec: number;
  endTimeSec: number;
  wordCount: number;
}

/**
 * Losslessly splits text into sentences at sentence-ending punctuation
 * (optionally followed by closing quotes/brackets) when followed by whitespace.
 * Never drops text on closing quotes (e.g. `."`), decimals (`3.5`), or abbreviations (`TP.HCM`).
 */
function splitSentencesLossless(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const sentences: string[] = [];
  const boundaryRegex = /[.!?…]+["”'’)\]»]*\s+/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boundaryRegex.exec(trimmed)) !== null) {
    if (match.index === lastIndex) continue;
    const endIdx = match.index + match[0].length;
    const part = trimmed.slice(lastIndex, endIdx).trim();
    if (part) sentences.push(part);
    lastIndex = endIdx;
  }

  const remainder = trimmed.slice(lastIndex).trim();
  if (remainder) sentences.push(remainder);

  return sentences.length > 0 ? sentences : [trimmed];
}

/**
 * Losslessly splits a sentence into natural clauses at punctuation marks
 * (optionally followed by closing quotes/brackets) when followed by whitespace.
 * Preserves times (`03:00`), leading dialogue dashes (`- ...`), and closing quotes.
 */
function splitClausesLossless(sentence: string): string[] {
  const trimmed = sentence.trim();
  if (!trimmed) return [];

  const clauses: string[] = [];
  const boundaryRegex = /[,;:\-–—]+["”'’)\]»]*\s+/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boundaryRegex.exec(trimmed)) !== null) {
    if (match.index === lastIndex) continue;
    const endIdx = match.index + match[0].length;
    const part = trimmed.slice(lastIndex, endIdx).trim();
    if (part) clauses.push(part);
    lastIndex = endIdx;
  }

  const remainder = trimmed.slice(lastIndex).trim();
  if (remainder) clauses.push(remainder);

  return clauses.length > 0 ? clauses : [trimmed];
}

/**
 * Splits a long dialogue paragraph into balanced, bite-sized subtitle lines (typically 7-12 words).
 * Slices cleanly at sentence delimiters, commas, dashes, and conjunctions
 * while strictly preserving 100% of the raw text and punctuation.
 */
export function splitIntoSubtitleChunks(rawText: string, maxWordsPerChunk = 12): string[] {
  if (!rawText || !rawText.trim()) return [];

  const text = rawText.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  // If already short enough, return as single chunk
  if (totalWords <= maxWordsPerChunk + 2) {
    return [text];
  }

  // 1. Split into primary sentences (100% lossless)
  const rawSentences = splitSentencesLossless(text);

  const preliminaryChunks: string[] = [];

  for (const s of rawSentences) {
    const sTrimmed = s.trim();
    if (!sTrimmed) continue;

    const sWordsCount = sTrimmed.split(/\s+/).filter(Boolean).length;
    if (sWordsCount <= maxWordsPerChunk + 2) {
      preliminaryChunks.push(sTrimmed);
      continue;
    }

    // Split sentence by punctuation marks: comma, semicolon, colon, dash (100% lossless)
    const rawClauses = splitClausesLossless(sTrimmed);

    let currentBuffer = "";

    for (const c of rawClauses) {
      const cTrimmed = c.trim();
      if (!cTrimmed) continue;

      const candidate = currentBuffer ? `${currentBuffer} ${cTrimmed}` : cTrimmed;
      const candidateWords = candidate.split(/\s+/).filter(Boolean).length;

      if (candidateWords > maxWordsPerChunk && currentBuffer) {
        preliminaryChunks.push(currentBuffer.trim());
        currentBuffer = cTrimmed;
      } else {
        currentBuffer = candidate;
      }
    }

    if (currentBuffer.trim()) {
      preliminaryChunks.push(currentBuffer.trim());
    }
  }

  // 2. Further split any chunk that is still too long (> maxWordsPerChunk + 3)
  const conjunctions = [
    "để",
    "mà",
    "nhưng",
    "và",
    "khi",
    "nơi",
    "với",
    "rồi",
    "cho",
    "lúc",
    "song",
    "tuy",
    "bởi",
    "vì",
  ];
  const refinedChunks: string[] = [];
  const queue = [...preliminaryChunks];

  while (queue.length > 0) {
    const chunk = queue.shift()!;
    const chunkWords = chunk.split(/\s+/).filter(Boolean);
    if (chunkWords.length <= maxWordsPerChunk + 3) {
      refinedChunks.push(chunk);
    } else {
      const half = Math.ceil(chunkWords.length / 2);
      let splitIdx = half;
      for (let offset = 0; offset <= 3; offset++) {
        const left = half - offset;
        const right = half + offset;
        if (left > 3 && left < chunkWords.length - 3 && conjunctions.includes(chunkWords[left].toLowerCase())) {
          splitIdx = left;
          break;
        }
        if (right > 3 && right < chunkWords.length - 3 && conjunctions.includes(chunkWords[right].toLowerCase())) {
          splitIdx = right;
          break;
        }
      }

      const p1 = chunkWords.slice(0, splitIdx).join(" ");
      const p2 = chunkWords.slice(splitIdx).join(" ");
      queue.unshift(p1, p2);
    }
  }

  // 3. Balance trailing tiny chunk (< 4 words) into previous chunk
  const finalChunks: string[] = [];
  for (let i = 0; i < refinedChunks.length; i++) {
    const chunk = refinedChunks[i];
    const chunkWordsCount = chunk.split(/\s+/).filter(Boolean).length;
    if (finalChunks.length > 0 && chunkWordsCount < 4 && i === refinedChunks.length - 1) {
      finalChunks[finalChunks.length - 1] = `${finalChunks[finalChunks.length - 1]} ${chunk}`;
    } else {
      finalChunks.push(chunk);
    }
  }

  const cleanedFinal = finalChunks.filter(Boolean);

  // 4. Lossless integrity safeguard: guarantee 100% of original words/characters are preserved
  const originalCompact = words.join(" ");
  const resultCompact = cleanedFinal.join(" ").replace(/\s+/g, " ").trim();
  if (resultCompact !== originalCompact) {
    const fallbackChunks: string[] = [];
    for (let i = 0; i < words.length; i += maxWordsPerChunk) {
      fallbackChunks.push(words.slice(i, i + maxWordsPerChunk).join(" "));
    }
    return fallbackChunks;
  }

  return cleanedFinal;
}

/**
 * Generates timed subtitle cues for a scene.
 * Partitions the scene's duration proportionally across all subtitle chunks.
 */
export function generateTimedSubtitleCues(
  dialogue?: string,
  sceneDurationSec = 6,
  maxWordsPerChunk = 12
): TimedSubtitleCue[] {
  if (!dialogue || !dialogue.trim()) return [];

  const chunks = splitIntoSubtitleChunks(dialogue, maxWordsPerChunk);
  if (chunks.length === 0) return [];

  const safeDuration = Math.max(2.0, sceneDurationSec);

  if (chunks.length === 1) {
    return [
      {
        index: 1,
        text: chunks[0],
        startTimeSec: 0,
        endTimeSec: safeDuration,
        wordCount: chunks[0].split(/\s+/).filter(Boolean).length,
      },
    ];
  }

  // Calculate weights based on reading duration
  const weights = chunks.map((c) => {
    const w = c.split(/\s+/).filter(Boolean).length;
    const midPauses = (c.match(/[,;:\-–—]|\.{3}/g) || []).length;
    const endPauses = (c.match(/[.!?]/g) || []).length;
    const pauses = midPauses * 0.35 + endPauses * 0.5;
    return Math.max(1.0, w / 2.4 + pauses);
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let currentStart = 0;
  return chunks.map((chunk, idx) => {
    const isLast = idx === chunks.length - 1;
    const duration = isLast
      ? safeDuration - currentStart
      : (weights[idx] / totalWeight) * safeDuration;
    const endTime = isLast ? safeDuration : currentStart + duration;

    const cue: TimedSubtitleCue = {
      index: idx + 1,
      text: chunk,
      startTimeSec: Math.round(currentStart * 100) / 100,
      endTimeSec: Math.round(endTime * 100) / 100,
      wordCount: chunk.split(/\s+/).filter(Boolean).length,
    };
    currentStart = endTime;
    return cue;
  });
}

/**
 * Retrieves the currently active subtitle cue for a given playback time in seconds.
 */
export function getActiveSubtitleCue(
  cues: TimedSubtitleCue[],
  currentTimeSec?: number
): TimedSubtitleCue | null {
  if (!cues || cues.length === 0) return null;

  // Static preview without active playback: return the first cue
  if (currentTimeSec === undefined || isNaN(currentTimeSec)) {
    return cues[0];
  }

  const t = Math.max(0, currentTimeSec);

  const match = cues.find((c) => t >= c.startTimeSec && t < c.endTimeSec);
  if (match) return match;

  if (t < cues[0].startTimeSec) return cues[0];
  return cues[cues.length - 1];
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

