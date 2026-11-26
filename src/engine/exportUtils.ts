/**
 * FILM & ASSET EXPORT UTILITIES
 * - SVG to PNG Snapshot
 * - SVG Download
 * - Realtime Video Recording via HTML5 Canvas & MediaRecorder
 */

import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import type { DirectorSceneScript } from "./types";
import {
  generateTimedSubtitleCues,
  getActiveSubtitleCue,
} from "./subtitleUtils";

export interface VideoExportSegment {
  scene: Pick<DirectorSceneScript, "dialogue">;
  durationSec: number;
}

export interface RecordedVideoResult {
  blob: Blob;
  extension: "mp4" | "webm";
}

export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = typeof content === "string" ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJson(data: any, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  downloadFile(jsonStr, filename, "application/json");
}

export function exportSvgFile(svgElement: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  downloadFile(source, filename, "image/svg+xml;charset=utf-8");
}

export function drawCinemaSubtitle(
  ctx: CanvasRenderingContext2D,
  dialogue?: string,
  width = 1920,
  height = 1080,
  timeSec?: number,
  durationSec = 6
) {
  if (!dialogue || !dialogue.trim()) return;

  const cues = generateTimedSubtitleCues(dialogue, durationSec);
  const activeCue = getActiveSubtitleCue(cues, timeSec);
  if (!activeCue || !activeCue.text.trim()) return;

  ctx.save();
  ctx.font = "normal 30px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.fillText(activeCue.text.trim(), width / 2, height - 55);
  ctx.restore();
}

export async function exportPngSnapshot(
  svgElement: SVGSVGElement,
  filename: string,
  width = 1920,
  height = 1080,
  dialogue?: string
): Promise<void> {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);
  const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas 2d context");

  ctx.fillStyle = "#0A0A0C";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  drawCinemaSubtitle(ctx, dialogue, width, height, 0, 6);
  URL.revokeObjectURL(url);

  canvas.toBlob((blob) => {
    if (blob) {
      downloadFile(blob, filename, "image/png");
    }
  }, "image/png");
}

/**
 * Helper: find the active segment and local timestamp for a global timeline position.
 */
function resolveSegmentAtTime(
  segments: VideoExportSegment[],
  globalTimeSec: number
): { sceneIndex: number; segment: VideoExportSegment; localTimeSec: number } {
  let elapsed = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (globalTimeSec < elapsed + seg.durationSec || i === segments.length - 1) {
      return {
        sceneIndex: i,
        segment: seg,
        localTimeSec: Math.max(0, globalTimeSec - elapsed),
      };
    }
    elapsed += seg.durationSec;
  }
  return {
    sceneIndex: 0,
    segment: segments[0],
    localTimeSec: 0,
  };
}

/**
 * Seek all CSS/Web animations inside the live SVG to `localTimeSec` and bake
 * their computed transform, transformOrigin, opacity, and filter into a cloned
 * SVG so serialized <img> frames preserve all character, weather, and prop motion.
 */
function cloneSvgWithBakedAnimations(
  svgElement: SVGSVGElement,
  localTimeSec: number
): SVGSVGElement {
  const animations =
    typeof svgElement.getAnimations === "function"
      ? svgElement.getAnimations({ subtree: true })
      : [];

  const animatedTargets = new Set<Element>();
  const timeMs = Math.max(0, localTimeSec * 1000);

  for (const anim of animations) {
    try {
      anim.pause();
      anim.currentTime = timeMs;
      const target = (anim.effect as KeyframeEffect | null)?.target;
      if (target instanceof Element) {
        animatedTargets.add(target);
      }
    } catch {
      // Ignore non-seekable animations
    }
  }

  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  if (animatedTargets.size > 0) {
    const origAll = svgElement.querySelectorAll("*");
    const cloneAll = clone.querySelectorAll("*");
    const count = Math.min(origAll.length, cloneAll.length);

    for (let i = 0; i < count; i++) {
      const origEl = origAll[i];
      if (!animatedTargets.has(origEl)) continue;

      const cloneEl = cloneAll[i] as SVGElement;
      const cs = window.getComputedStyle(origEl);

      cloneEl.style.animation = "none";
      if (cs.transform && cs.transform !== "none") {
        cloneEl.style.transform = cs.transform;
      }
      if (cs.transformOrigin) {
        cloneEl.style.transformOrigin = cs.transformOrigin;
      }
      if (cs.opacity && cs.opacity !== "1") {
        cloneEl.style.opacity = cs.opacity;
      }
      if (cs.filter && cs.filter !== "none") {
        cloneEl.style.filter = cs.filter;
      }
    }
  }

  return clone;
}

/**
 * Resume any paused CSS/Web animations inside the live SVG after export finishes.
 */
function resumeSvgAnimations(svgElement: SVGSVGElement | null) {
  if (!svgElement || typeof svgElement.getAnimations !== "function") return;
  for (const anim of svgElement.getAnimations({ subtree: true })) {
    try {
      anim.play();
    } catch {
      // Ignore
    }
  }
}

/**
 * Helper: render an SVG element + subtitle onto a 1920x1080 2D canvas.
 */
async function renderSvgFrameToCanvas(
  svgElement: SVGSVGElement,
  ctx: CanvasRenderingContext2D,
  serializer: XMLSerializer,
  width: number,
  height: number,
  dialogue: string | undefined,
  localTimeSec: number,
  durationSec: number
): Promise<void> {
  const bakedSvg = cloneSvgWithBakedAnimations(svgElement, localTimeSec);
  const svgString = serializer.serializeToString(bakedSvg);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });
    if (typeof img.decode === "function") {
      await img.decode().catch(() => {});
    }

    ctx.fillStyle = "#0A0A0C";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    drawCinemaSubtitle(ctx, dialogue, width, height, localTimeSec, durationSec);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Find the first supported H.264 VideoEncoder configuration for 1080p @ 30fps.
 */
async function findSupportedH264Config(
  width: number,
  height: number,
  fps: number
): Promise<VideoEncoderConfig | null> {
  if (typeof VideoEncoder === "undefined" || typeof VideoFrame === "undefined") {
    return null;
  }

  const codecs = [
    "avc1.640028", // High Profile L4.0
    "avc1.4d002a", // Main Profile L4.2
    "avc1.420028", // Baseline Profile L4.0
    "avc1.42001f", // Baseline Profile L3.1
  ];

  for (const codec of codecs) {
    try {
      const config: VideoEncoderConfig = {
        codec,
        width,
        height,
        bitrate: 6_000_000,
        framerate: fps,
      };
      const support = await VideoEncoder.isConfigSupported(config);
      if (support.supported) {
        return config;
      }
    } catch {
      // Try next codec
    }
  }
  return null;
}

/**
 * Record one or more sequential scenes into a single continuous MP4 (via WebCodecs + mp4-muxer)
 * or fallback to WebM (via MediaRecorder) if WebCodecs H.264 is unavailable.
 */
export async function recordScenesToVideo(
  getSvgElement: () => SVGSVGElement | null,
  segments: VideoExportSegment[],
  onProgress?: (
    progressPercent: number,
    info?: { sceneIndex: number; totalScenes: number; localTimeSec: number; globalTimeSec: number }
  ) => void,
  onFrameStep?: (
    sceneIndex: number,
    localTimeSec: number,
    globalTimeSec: number
  ) => Promise<void> | void
): Promise<RecordedVideoResult> {
  if (segments.length === 0) {
    throw new Error("Không có cảnh nào để xuất video.");
  }

  const normalizedSegments = segments.map((seg) => ({
    ...seg,
    durationSec: Math.max(0.5, Number(seg.durationSec) || 6),
  }));

  const width = 1920;
  const height = 1080;
  const fps = 30;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) throw new Error("Canvas context not available");

  const serializer = new XMLSerializer();
  const totalDurationSec = normalizedSegments.reduce((sum, s) => sum + s.durationSec, 0);
  const totalFrames = Math.max(1, Math.floor(totalDurationSec * fps));

  const waitForFrameCommit = async () => {
    await new Promise<void>((res) => {
      const fallback = window.setTimeout(res, 35);
      requestAnimationFrame(() => {
        window.clearTimeout(fallback);
        res();
      });
    });
  };

  // Preferred Path: Deterministic frame-by-frame MP4 via WebCodecs + mp4-muxer
  const h264Config = await findSupportedH264Config(width, height, fps);
  if (h264Config) {
    const target = new ArrayBufferTarget();
    const muxer = new Muxer({
      target,
      video: {
        codec: "avc",
        width,
        height,
      },
      fastStart: "in-memory",
    });

    let encoderError: unknown = null;
    const encoder = new VideoEncoder({
      output: (chunk, meta) => {
        muxer.addVideoChunk(chunk, meta);
      },
      error: (err) => {
        encoderError = err;
      },
    });
    encoder.configure(h264Config);

    const frameDurationUs = Math.round(1_000_000 / fps);

    try {
      for (let frameIdx = 0; frameIdx < totalFrames; frameIdx++) {
        if (encoderError) throw encoderError;

        const globalTimeSec = frameIdx / fps;
        const { sceneIndex, segment, localTimeSec } = resolveSegmentAtTime(
          normalizedSegments,
          globalTimeSec
        );

        if (onFrameStep) {
          await onFrameStep(sceneIndex, localTimeSec, globalTimeSec);
          await waitForFrameCommit();
        }

        if (onProgress) {
          onProgress(
            Math.min(100, Math.round(((frameIdx + 1) / totalFrames) * 100)),
            {
              sceneIndex,
              totalScenes: normalizedSegments.length,
              localTimeSec,
              globalTimeSec,
            }
          );
        }

        const svgElement = getSvgElement();
        if (svgElement) {
          try {
            await renderSvgFrameToCanvas(
              svgElement,
              ctx,
              serializer,
              width,
              height,
              segment.scene.dialogue,
              localTimeSec,
              segment.durationSec
            );
          } catch (err) {
            console.warn("Frame capture error:", err);
          }
        }

        const frame = new VideoFrame(canvas, {
          timestamp: frameIdx * frameDurationUs,
          duration: frameDurationUs,
        });
        try {
          encoder.encode(frame, { keyFrame: frameIdx % fps === 0 });
        } finally {
          frame.close();
        }

        while (encoder.encodeQueueSize > 8) {
          await new Promise((res) => setTimeout(res, 10));
        }
      }

      await encoder.flush();
      encoder.close();
      muxer.finalize();
    } finally {
      resumeSvgAnimations(getSvgElement());
    }

    if (encoderError) throw encoderError;
    return {
      blob: new Blob([target.buffer], { type: "video/mp4" }),
      extension: "mp4",
    };
  }

  // Fallback Path: MediaRecorder WebM for browsers without WebCodecs H.264
  const stream = canvas.captureStream(fps);
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5000000 });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      resolve({ blob: videoBlob, extension: "webm" });
    };

    recorder.onerror = (e) => reject(e);

    const runCapture = async () => {
      recorder.start(200);
      const frameDurationMs = 1000 / fps;

      for (let frameIdx = 0; frameIdx < totalFrames; frameIdx++) {
        const frameStart = performance.now();
        const globalTimeSec = frameIdx / fps;
        const { sceneIndex, segment, localTimeSec } = resolveSegmentAtTime(
          normalizedSegments,
          globalTimeSec
        );

        if (onFrameStep) {
          await onFrameStep(sceneIndex, localTimeSec, globalTimeSec);
          await waitForFrameCommit();
        }

        if (onProgress) {
          onProgress(
            Math.min(100, Math.round(((frameIdx + 1) / totalFrames) * 100)),
            {
              sceneIndex,
              totalScenes: normalizedSegments.length,
              localTimeSec,
              globalTimeSec,
            }
          );
        }

        const svgElement = getSvgElement();
        if (svgElement) {
          try {
            await renderSvgFrameToCanvas(
              svgElement,
              ctx,
              serializer,
              width,
              height,
              segment.scene.dialogue,
              localTimeSec,
              segment.durationSec
            );
          } catch (err) {
            console.warn("Frame capture error:", err);
          }
        }

        const elapsed = performance.now() - frameStart;
        const waitMs = Math.max(0, frameDurationMs - elapsed);
        if (waitMs > 0) {
          await new Promise((res) => setTimeout(res, waitMs));
        }
      }

      setTimeout(() => recorder.stop(), 200);
    };

    runCapture().catch(reject);
  });
}

/**
 * Record single animated SVG to video (MP4 via WebCodecs, or WebM fallback)
 */
export async function recordSvgToVideo(
  svgElement: SVGSVGElement,
  durationSec: number,
  onProgress?: (progressPercent: number) => void,
  onTimeStep?: (timeSec: number) => Promise<void> | void,
  dialogue?: string
): Promise<Blob> {
  const result = await recordScenesToVideo(
    () => svgElement,
    [{ scene: { dialogue }, durationSec }],
    (pct) => onProgress?.(pct),
    (_idx, localTimeSec) => onTimeStep?.(localTimeSec)
  );
  return result.blob;
}

