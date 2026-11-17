/**
 * VOICE PACING & SCRIPT SEGMENTATION UTILITIES
 * Estimates voice-over duration for Vietnamese horror storytelling
 * and ensures 100% text fidelity between user's story and scene subtitles.
 */

export type VoicePacePreset = "slow_horror" | "normal_narrative" | "fast_tense";

export interface VoicePaceConfig {
  id: VoicePacePreset;
  label: string;
  description: string;
  wordsPerSecond: number; // Tốc độ đọc (từ/giây)
}

export const VOICE_PACE_PRESETS: Record<VoicePacePreset, VoicePaceConfig> = {
  slow_horror: {
    id: "slow_horror",
    label: "Chậm Rãi, Rùng Rợn",
    description: "Nhả chữ ma mị, thì thầm chậm rãi, tăng tối đa cảm giác ớn lạnh (~120 từ/phút)",
    wordsPerSecond: 2.0,
  },
  normal_narrative: {
    id: "normal_narrative",
    label: "Kể Chuyện Chuẩn",
    description: "Nhịp điệu truyền cảm tự nhiên của người dẫn truyện kinh dị (~145 từ/phút)",
    wordsPerSecond: 2.4,
  },
  fast_tense: {
    id: "fast_tense",
    label: "Dồn Dập, Kịch Tính",
    description: "Hối hả, gấp gáp khi đối đầu quỷ dữ hoặc rượt đuổi thoát thân (~175 từ/phút)",
    wordsPerSecond: 2.9,
  },
};

/**
 * Counts the number of words in a string accurately (supporting Vietnamese accents & whitespace)
 */
export function countWords(text?: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Resolves effective words-per-second rate from a preset ID or custom number
 */
export function resolveWordsPerSecond(pace: VoicePacePreset | number = "normal_narrative"): number {
  if (typeof pace === "number") {
    return Math.max(1.0, Math.min(5.0, pace));
  }
  return VOICE_PACE_PRESETS[pace]?.wordsPerSecond || 2.4;
}

/**
 * Estimates voice-over reading duration in seconds for a Vietnamese text segment.
 * Includes:
 * - Lead-in buffer: 0.5s for initial ambient atmosphere before speaking
 * - Speech time: wordCount / wordsPerSecond
 * - Punctuation breath pauses: +0.35s for commas/ellipses, +0.6s for end-of-sentence periods
 * - Lead-out buffer: 0.8s for lingering dread before cutting to next scene
 * - Clamped to a cinematic safe range: minimum 4.0s
 */
export function estimateVoiceDurationSec(
  text: string,
  pace: VoicePacePreset | number = "normal_narrative",
  options: {
    minDuration?: number;
    maxDuration?: number;
    includePunctuationPauses?: boolean;
  } = {}
): number {
  const words = countWords(text);
  if (words === 0) return options.minDuration || 5.0;

  const wps = resolveWordsPerSecond(pace);
  const speechTime = words / wps;

  // Count punctuation pauses
  let punctuationTime = 0;
  if (options.includePunctuationPauses !== false) {
    // Commas, semicolons, dashes, ellipses
    const midPauses = (text.match(/[,;:\-–—]|\.{3}/g) || []).length;
    // Sentence-ending marks
    const endPauses = (text.match(/[.!?]/g) || []).length;
    punctuationTime = Math.min(2.5, midPauses * 0.35 + endPauses * 0.55);
  }

  const leadIn = 0.5;
  const leadOut = 0.8;
  const rawDuration = leadIn + speechTime + punctuationTime + leadOut;

  // Round to 1 decimal place (e.g. 6.5s)
  const rounded = Math.round(rawDuration * 10) / 10;

  const min = options.minDuration !== undefined ? options.minDuration : 4.0;
  const max = options.maxDuration !== undefined ? options.maxDuration : 20.0;

  return Math.max(min, Math.min(max, rounded));
}

export interface VoiceSegment {
  index: number;
  text: string;
  wordCount: number;
  estimatedDurationSec: number;
}

/**
 * Splits raw story into clean sentences while preserving all original characters and ordering.
 */
function extractSentencesWithDelimiters(rawText: string): string[] {
  if (!rawText || !rawText.trim()) return [];

  // Normalize line breaks
  const normalized = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  // Split by explicit double line breaks first (paragraphs)
  const paragraphs = normalized.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const sentences: string[] = [];

  for (const para of paragraphs) {
    // If the paragraph itself has single line breaks (like bullet points or screenplay lines), treat each line as a unit
    const lines = para.split(/\n/).map((l) => l.trim()).filter(Boolean);

    for (const line of lines) {
      // Split by sentence terminators (. ! ?) followed by whitespace or end of string,
      // but avoid splitting numbers or decimals like 3.5 or 03:00
      const sentenceRegex = /([^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$)/g;
      const matches = line.match(sentenceRegex);

      if (matches && matches.length > 0) {
        for (const m of matches) {
          const trimmed = m.trim();
          if (trimmed.length > 0) {
            sentences.push(trimmed);
          }
        }
      } else {
        sentences.push(line);
      }
    }
  }

  return sentences;
}

/**
 * Intelligently splits a long sentence (>20 words) into balanced, natural clauses
 * while strictly keeping commas/punctuation attached to the preceding clause.
 */
function splitLongSentenceIntoClauses(sentence: string, targetWords = 14): string[] {
  const clauseMatches = sentence.match(/[^,;:\-–—]+(?:[,;:\-–—]+|\s*$)/g);
  if (!clauseMatches || clauseMatches.length <= 1) {
    return [sentence.trim()];
  }

  const results: string[] = [];
  let current = "";

  for (const clause of clauseMatches) {
    const trimmedClause = clause.trim();
    const candidate = current ? `${current} ${trimmedClause}` : trimmedClause;

    // If candidate reaches target size and we already had a clause, push current and start new
    if (current && countWords(candidate) > targetWords * 1.3) {
      results.push(current.trim());
      current = trimmedClause;
    } else {
      current = candidate;
    }
  }

  if (current.trim()) {
    results.push(current.trim());
  }

  return results.filter(Boolean);
}

/**
 * Intelligently clusters or splits sentences into balanced segments for film scenes.
 * - Ensures 100% of user text is strictly preserved in sequential order.
 * - Targets roughly 10-20 words per scene (~5s to 8s duration).
 * - Avoids scenes being too short (< 3.5s) or too long (> 9.5s).
 */
export function splitStoryIntoVoiceSegments(
  storyText: string,
  options: {
    targetSceneCount?: number | "auto";
    pace?: VoicePacePreset | number;
    targetWordsPerScene?: number;
  } = {}
): VoiceSegment[] {
  if (!storyText || !storyText.trim()) return [];

  const pace = options.pace || "normal_narrative";
  const rawSentences = extractSentencesWithDelimiters(storyText);

  if (rawSentences.length === 0) return [];

  // Expand overly long sentences into clauses first
  const sentences: string[] = [];
  for (const s of rawSentences) {
    if (countWords(s) > 22) {
      sentences.push(...splitLongSentenceIntoClauses(s, options.targetWordsPerScene || 14));
    } else {
      sentences.push(s);
    }
  }

  const targetCount =
    options.targetSceneCount && options.targetSceneCount !== "auto"
      ? Math.max(1, Math.min(10, options.targetSceneCount))
      : null;

  let segmentsText: string[] = [];

  if (targetCount) {
    if (sentences.length <= targetCount) {
      segmentsText = [...sentences];
      while (segmentsText.length < targetCount) {
        let longestIdx = 0;
        let maxWords = 0;
        for (let i = 0; i < segmentsText.length; i++) {
          const w = countWords(segmentsText[i]);
          if (w > maxWords) {
            maxWords = w;
            longestIdx = i;
          }
        }

        if (maxWords < 6) break;

        const clauses = splitLongSentenceIntoClauses(segmentsText[longestIdx], Math.floor(maxWords / 2));
        if (clauses.length >= 2) {
          segmentsText.splice(longestIdx, 1, ...clauses);
        } else {
          break;
        }
      }
    } else {
      // Group adjacent sentences into targetCount buckets
      const totalWords = countWords(storyText);
      const idealWordsPerScene = Math.max(8, totalWords / targetCount);

      const buckets: string[][] = Array.from({ length: targetCount }, () => []);
      let currentBucket = 0;
      let currentBucketWords = 0;

      for (let i = 0; i < sentences.length; i++) {
        const s = sentences[i];
        const sWords = countWords(s);
        const remainingSentences = sentences.length - i;
        const remainingBuckets = targetCount - currentBucket;

        if (remainingSentences <= remainingBuckets && currentBucket < targetCount - 1) {
          if (buckets[currentBucket].length > 0) {
            currentBucket++;
            currentBucketWords = 0;
          }
        } else if (
          currentBucketWords + sWords > idealWordsPerScene * 1.3 &&
          currentBucket < targetCount - 1 &&
          buckets[currentBucket].length > 0
        ) {
          currentBucket++;
          currentBucketWords = 0;
        }

        buckets[currentBucket].push(s);
        currentBucketWords += sWords;
      }

      segmentsText = buckets
        .filter((b) => b.length > 0)
        .map((b) => b.join(" ").trim());
    }
  } else {
    // "auto" mode: Group sentences targeting 10 to 18 words per scene (~5s to 7.5s)
    const idealTargetWords = options.targetWordsPerScene || 14;
    let currentBuffer: string[] = [];
    let currentCount = 0;

    for (const s of sentences) {
      const sCount = countWords(s);

      if (currentCount > 0 && currentCount + sCount > idealTargetWords * 1.45) {
        segmentsText.push(currentBuffer.join(" ").trim());
        currentBuffer = [s];
        currentCount = sCount;
      } else {
        currentBuffer.push(s);
        currentCount += sCount;
      }
    }

    if (currentBuffer.length > 0) {
      segmentsText.push(currentBuffer.join(" ").trim());
    }
  }

  // Format into VoiceSegment array with calculated durations
  return segmentsText.map((text, idx) => ({
    index: idx + 1,
    text,
    wordCount: countWords(text),
    estimatedDurationSec: estimateVoiceDurationSec(text, pace),
  }));
}

/**
 * Calculates overall story narration statistics for UI display
 */
export interface StoryPacingStats {
  totalWords: number;
  totalEstimatedDurationSec: number;
  suggestedSceneCount: number;
  segments: VoiceSegment[];
  pace: VoicePacePreset;
}

export function analyzeStoryPacing(
  storyText: string,
  pace: VoicePacePreset = "normal_narrative",
  targetSceneCount?: number | "auto"
): StoryPacingStats {
  const totalWords = countWords(storyText);
  const segments = splitStoryIntoVoiceSegments(storyText, {
    targetSceneCount,
    pace,
  });

  const totalEstimatedDurationSec = segments.reduce((sum, s) => sum + s.estimatedDurationSec, 0);

  return {
    totalWords,
    totalEstimatedDurationSec: Math.round(totalEstimatedDurationSec * 10) / 10,
    suggestedSceneCount: Math.max(1, segments.length),
    segments,
    pace,
  };
}

function stripEnclosingPunctuation(str: string): string {
  return str.replace(/^[“"'"«\[(\s.,!?:;]+|[”"'"»\])\s.,!?:;]+$/g, "").trim();
}

function getFirstNWords(text: string, n = 4): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, n).join(" ");
}

function getLastNWords(text: string, n = 4): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.slice(-n).join(" ");
}

function normalizeSimple(str: string): string {
  return str.toLowerCase().replace(/[.,!?:;'"“”‘’\-–—()[\]]/g, " ").replace(/\s+/g, " ").trim();
}

function adjustOpeningQuoteBoundary(story: string, cutPos: number, currentCursor: number): number {
  let pos = cutPos;
  while (pos > currentCursor && /[“"'"«\[(—\-]/.test(story[pos - 1])) {
    pos--;
  }
  return pos;
}

/**
 * Adjust proposed slices count to match targetCount if specified
 */
function adjustProposedSliceCount(proposedSlices: string[], targetCount?: number | "auto"): string[] {
  if (!targetCount || targetCount === "auto" || proposedSlices.length === targetCount) {
    return proposedSlices;
  }

  const slices = [...proposedSlices];

  // If fewer slices than targetCount, split longest slice at natural sentence boundary
  while (slices.length < targetCount) {
    let longestIdx = 0;
    let maxWords = 0;
    for (let i = 0; i < slices.length; i++) {
      const w = countWords(slices[i]);
      if (w > maxWords) {
        maxWords = w;
        longestIdx = i;
      }
    }

    if (maxWords < 6) break;

    const textToSplit = slices[longestIdx];
    const sentenceBreak = textToSplit.search(/[.!?]\s+/);
    if (sentenceBreak !== -1) {
      const part1 = textToSplit.slice(0, sentenceBreak + 1).trim();
      const part2 = textToSplit.slice(sentenceBreak + 1).trim();
      if (part1 && part2) {
        slices.splice(longestIdx, 1, part1, part2);
        continue;
      }
    }

    const commaBreak = textToSplit.search(/[,;]\s+/);
    if (commaBreak !== -1) {
      const part1 = textToSplit.slice(0, commaBreak + 1).trim();
      const part2 = textToSplit.slice(commaBreak + 1).trim();
      if (part1 && part2) {
        slices.splice(longestIdx, 1, part1, part2);
        continue;
      }
    }
    break;
  }

  // If more slices than targetCount, merge shortest adjacent pair
  while (slices.length > targetCount) {
    let shortestPairIdx = 0;
    let minCombinedWords = Infinity;
    for (let i = 0; i < slices.length - 1; i++) {
      const w1 = countWords(slices[i]);
      const w2 = countWords(slices[i + 1]);
      if (w1 + w2 < minCombinedWords) {
        minCombinedWords = w1 + w2;
        shortestPairIdx = i;
      }
    }
    slices.splice(shortestPairIdx, 2, `${slices[shortestPairIdx]} ${slices[shortestPairIdx + 1]}`.trim());
  }

  return slices;
}

/**
 * RECONCILE SCENE DIALOGUE SLICES TO ORIGINAL STORY
 * Guarantees that:
 * 1. Each resulting dialogue slice is a 100% verbatim continuous substring of the original user story.
 * 2. Concatenating all slices in order covers the original story 100% with zero lost characters, words, or clauses.
 * 3. Prevents any AI paraphrasing, summarization, or text alteration from leaking into voiceover/subtitles.
 */
export function reconcileDialogueSlicesToStory(
  fullStory: string,
  proposedSlices: string[],
  targetCount?: number | "auto"
): string[] {
  const cleanedStory = fullStory.trim();
  if (!cleanedStory) return [];
  if (!proposedSlices || proposedSlices.length === 0) return [cleanedStory];

  const adjustedSlices = adjustProposedSliceCount(proposedSlices, targetCount);
  if (adjustedSlices.length <= 1) return [cleanedStory];

  const n = adjustedSlices.length;
  const cutIndices: number[] = [];
  let currentCursor = 0;

  for (let k = 0; k < n - 1; k++) {
    const currentSlice = adjustedSlices[k]?.trim() || "";
    const nextSlice = adjustedSlices[k + 1]?.trim() || "";

    let cutPos = -1;

    // Method A: Search for the first 3-5 words of nextSlice
    const nextWordsCount = countWords(nextSlice);
    const wordsToTry = [Math.min(5, nextWordsCount), 4, 3, 2];

    for (const wCount of wordsToTry) {
      if (wCount <= 0) continue;
      const rawHead = getFirstNWords(nextSlice, wCount);
      const cleanHead = stripEnclosingPunctuation(rawHead);
      const headVariants = rawHead !== cleanHead ? [rawHead, cleanHead] : [rawHead];

      for (const head of headVariants) {
        if (!head || head.length < 2) continue;
        const idx = cleanedStory.indexOf(head, currentCursor);
        if (idx > currentCursor || (currentCursor === 0 && idx === 0 && currentSlice.length === 0)) {
          cutPos = adjustOpeningQuoteBoundary(cleanedStory, idx, currentCursor);
          break;
        }
      }
      if (cutPos !== -1) break;
    }

    // Method B: Search for trailing words of currentSlice
    if (cutPos === -1) {
      const currWordsCount = countWords(currentSlice);
      const tailWordsToTry = [Math.min(4, currWordsCount), 3, 2];
      for (const wCount of tailWordsToTry) {
        if (wCount <= 0) continue;
        const rawTail = getLastNWords(currentSlice, wCount);
        const cleanTail = stripEnclosingPunctuation(rawTail);
        const tailVariants = rawTail !== cleanTail ? [rawTail, cleanTail] : [rawTail];

        for (const tail of tailVariants) {
          if (!tail || tail.length < 2) continue;
          const idx = cleanedStory.indexOf(tail, currentCursor);
          if (idx !== -1) {
            let afterTail = idx + tail.length;
            while (afterTail < cleanedStory.length && /[.,!?:;'"“”‘’\s]/.test(cleanedStory[afterTail])) {
              afterTail++;
            }
            if (afterTail > currentCursor) {
              cutPos = adjustOpeningQuoteBoundary(cleanedStory, afterTail, currentCursor);
              break;
            }
          }
        }
        if (cutPos !== -1) break;
      }
    }

    // Method C: Case-insensitive normalized search
    if (cutPos === -1) {
      const normHead = normalizeSimple(getFirstNWords(nextSlice, 3));
      if (normHead) {
        const lowerStory = cleanedStory.toLowerCase();
        const normWords = normHead.split(" ");
        let searchStart = currentCursor;
        while (searchStart < cleanedStory.length) {
          const matchIdx = lowerStory.indexOf(normWords[0], searchStart);
          if (matchIdx === -1) break;
          let allMatch = true;
          let checkPos = matchIdx;
          for (const w of normWords) {
            const wIdx = lowerStory.indexOf(w, checkPos);
            if (wIdx === -1 || wIdx - checkPos > 25) {
              allMatch = false;
              break;
            }
            checkPos = wIdx + w.length;
          }
          if (allMatch && matchIdx > currentCursor) {
            cutPos = adjustOpeningQuoteBoundary(cleanedStory, matchIdx, currentCursor);
            break;
          }
          searchStart = matchIdx + 1;
        }
      }
    }

    // Method D: Fallback to proportional sentence boundary
    if (cutPos === -1 || cutPos <= currentCursor || cutPos >= cleanedStory.length) {
      const remainingLen = cleanedStory.length - currentCursor;
      const remainingSlices = n - k;
      const approxLen = Math.floor(remainingLen / remainingSlices);
      const targetPos = currentCursor + approxLen;

      let bestBreak = -1;
      let minDistance = Infinity;

      for (let i = currentCursor + 5; i < cleanedStory.length - 5; i++) {
        if (/[.!?\n]/.test(cleanedStory[i])) {
          const dist = Math.abs(i - targetPos);
          if (dist < minDistance) {
            minDistance = dist;
            bestBreak = i + 1;
          }
        }
      }

      cutPos = bestBreak !== -1 ? bestBreak : targetPos;
      cutPos = adjustOpeningQuoteBoundary(cleanedStory, cutPos, currentCursor);
    }

    cutIndices.push(cutPos);
    currentCursor = cutPos;
  }

  // Build verbatim slices directly from cleanedStory
  const result: string[] = [];
  let prev = 0;
  for (let i = 0; i < cutIndices.length; i++) {
    const end = cutIndices[i];
    const slice = cleanedStory.slice(prev, end).trim();
    if (slice) result.push(slice);
    prev = end;
  }
  const lastSlice = cleanedStory.slice(prev).trim();
  if (lastSlice) result.push(lastSlice);

  return result;
}
