/**
 * FILM & ASSET EXPORT UTILITIES
 * - SVG to PNG Snapshot
 * - SVG Download
 * - Realtime Video Recording via HTML5 Canvas & MediaRecorder
 */

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

export async function exportPngSnapshot(
  svgElement: SVGSVGElement,
  filename: string,
  width = 1920,
  height = 1080
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
  URL.revokeObjectURL(url);

  canvas.toBlob((blob) => {
    if (blob) {
      downloadFile(blob, filename, "image/png");
    }
  }, "image/png");
}

/**
 * Record animated SVG to WebM video using HTML5 Canvas & MediaRecorder
 */
export async function recordSvgToVideo(
  svgElement: SVGSVGElement,
  durationSec: number,
  onProgress?: (progressPercent: number) => void
): Promise<Blob> {
  const width = 1920;
  const height = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  const stream = canvas.captureStream(30); // 30 FPS
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5000000 });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const serializer = new XMLSerializer();
  const totalFrames = Math.floor(durationSec * 30);
  let frameCount = 0;

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      resolve(videoBlob);
    };

    recorder.onerror = (e) => reject(e);
    recorder.start();

    const intervalTime = 1000 / 30;
    const interval = setInterval(async () => {
      frameCount++;
      if (onProgress) onProgress(Math.min(100, Math.round((frameCount / totalFrames) * 100)));

      try {
        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
          img.src = url;
        });

        ctx.fillStyle = "#0A0A0C";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.warn("Frame capture error:", err);
      }

      if (frameCount >= totalFrames) {
        clearInterval(interval);
        setTimeout(() => recorder.stop(), 200);
      }
    }, intervalTime);
  });
}

