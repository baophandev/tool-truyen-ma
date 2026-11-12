import React, { useState } from "react";
import type { DirectorSceneScript } from "../engine/types";
import { SceneRenderer } from "../engine/SceneRenderer";
import {
  downloadJson,
  exportSvgFile,
  exportPngSnapshot,
  recordSvgToVideo,
} from "../engine/exportUtils";
import { validateDirectorScript } from "../engine/layoutRouter";
import {
  Download,
  Video,
  FileCode,
  Image as ImageIcon,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  Bot,
  RefreshCw,
} from "lucide-react";

interface ExporterViewProps {
  currentScene: DirectorSceneScript;
  onImportScene: (newScene: DirectorSceneScript) => void;
}

export const ExporterView: React.FC<ExporterViewProps> = ({
  currentScene,
  onImportScene,
}) => {
  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [recordDuration, setRecordDuration] = useState<number>(5);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>("");
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const [exportTime, setExportTime] = useState<number>(0);

  // Handle Video Recording
  const handleRecordVideo = async () => {
    if (!svgRef) return;
    try {
      setIsRecording(true);
      setRecordProgress(0);
      setExportTime(0);

      const videoBlob = await recordSvgToVideo(
        svgRef,
        recordDuration,
        (pct) => {
          setRecordProgress(pct);
        },
        (timeSec) => {
          setExportTime(timeSec);
        }
      );

      const filename = `${currentScene.scene_id || "horror_film"}_${recordDuration}s.webm`;
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi khi quay video:", err);
      alert("Quá trình xuất video gặp lỗi. Vui lòng thử lại.");
    } finally {
      setIsRecording(false);
      setRecordProgress(0);
    }
  };

  // Handle PNG Snapshot
  const handleSnapshotPng = async () => {
    if (!svgRef) return;
    try {
      await exportPngSnapshot(svgRef, `${currentScene.scene_id || "scene"}_frame.png`);
    } catch (err) {
      console.error(err);
      alert("Không thể xuất PNG.");
    }
  };

  // Handle SVG Export
  const handleExportSvg = () => {
    if (!svgRef) return;
    exportSvgFile(svgRef, `${currentScene.scene_id || "scene"}.svg`);
  };

  // Handle JSON Copy
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentScene, null, 2));
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Handle Gemini Director Prompt Copy
  const geminiSystemPrompt = `Bạn là Gemini Director - Đạo diễn Kịch bản Hoạt hình Kinh dị Bóng Đen (Silhouette Minimalist Horror).
Hệ thống đồ họa 2D thuần code có các tài nguyên và tọa độ cố định:
- Khung hình: 1920x1080 (16:9), Ground Y = 800px.
- Themes: "rural_graveyard" | "abandoned_village" | "cursed_swamp"
- Sky presets: "blood_moon" | "foggy_night" | "stormy_dark" | "eclipse_abyss"
- Structures: "creepy_banyan_tree" | "ancient_tomb" | "dilapidated_hut" | "abandoned_shrine" | "broken_wooden_bridge" | "scarecrow_of_the_damned" | "creepy_well" | "haunted_gallows_tree"
- Details (Props): "detail_black_crow" | "detail_will_o_wisp" | "detail_blood_lantern" | "detail_incense_bowl" | "detail_skull_pile" | "detail_hanging_talisman"
- Ground Slots (Y=800): "far_left" (250), "mid_left" (600), "center" (960), "mid_right" (1320), "far_right" (1670)
- Air Slots: "air_left" (400, 350), "air_center" (960, 280), "air_right" (1520, 350)
- Placement Constraints:
  * "creepy_banyan_tree", "haunted_gallows_tree" -> chỉ đặt ở far_left | far_right
  * "ancient_tomb", "abandoned_shrine", "creepy_well" -> chỉ đặt ở mid_left | center | mid_right
  * "dilapidated_hut", "broken_wooden_bridge" -> chỉ đặt ở far_left | center | far_right
  * "detail_incense_bowl" -> mid_left | center | mid_right; "detail_skull_pile" -> 5 Ground Slots; "detail_hanging_talisman" -> 3 Air Slots; "detail_blood_lantern" -> Ground hoặc air_left | air_right
  * Nhân vật "pose_floating" | "pose_hanging" -> Air Slots; các tư thế khác -> Ground Slots (Y=800)
- Actor Bases: "male_adult" | "female_adult" | "ghost_wraith" | "creepy_child" | "jiangshi_corpse" | "demon_shadow"
- Actor Costumes: "outfit_tattered_tunic" | "outfit_flowing_ao_dai" | "outfit_shrouded_cloak" | "outfit_mandarin_court" | "outfit_monk_cassock" | "outfit_shredded_burial" | "outfit_ancient_armor" | "outfit_child_pajamas"
- Actor Faces: "face_calm" | "face_scared" | "face_creepy_smile" | "face_bleeding_eyes" | "face_faceless" | "face_glowing_hollow" | "face_talisman_covered"
- Actor Poses: "pose_standing" | "pose_shivering" | "pose_walking" | "pose_floating" | "pose_crawling" | "pose_reaching" | "pose_hanging"
- Actor Facing: "left" | "right"
- Actor Motion (Tùy chọn di chuyển từ Điểm A -> Điểm B trong cảnh):
  "motion": { "targetSlot": SlotId, "targetOffsetX": number, "targetOffsetY": number, "startTimeSec": number, "endTimeSec": number, "easing": "linear"|"ease_in_out"|"ease_in"|"ease_out", "autoFaceTarget": true, "movingPose": CharacterPoseId }

HÃY XUẤT RA CHÍNH XÁC MỘT ĐOẠN JSON DUY NHẤT theo cấu trúc DirectorSceneScript:
{
  "scene_id": "scene_gemini_01",
  "title": "Tên Cảnh",
  "duration_sec": 6,
  "theme": "cursed_swamp",
  "lighting": {
    "sky_preset": "eclipse_abyss",
    "fog_density": 0.8
  },
  "environment_items": [
    { "asset_id": "abandoned_shrine", "slot": "center" }
  ],
  "actors": [
    {
      "id": "actor_jiangshi",
      "base": "jiangshi_corpse",
      "costume": "outfit_mandarin_court",
      "face": "face_talisman_covered",
      "pose": "pose_standing",
      "facing": "left",
      "slot": "mid_right"
    }
  ],
  "details": [
    { "id": "detail_1", "asset_id": "detail_hanging_talisman", "slot": "air_center" },
    { "id": "detail_2", "asset_id": "detail_incense_bowl", "slot": "center", "offsetX": 80 }
  ],
  "dialogue": "Lời thoại rùng rợn...",
  "narrative_note": "Mô tả bối cảnh..."
}`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(geminiSystemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Handle Import JSON
  const handleImport = () => {
    setImportErrors([]);
    setImportSuccess(false);

    try {
      const parsed = JSON.parse(importJsonText);
      const result = validateDirectorScript(parsed);
      if (!result.valid) {
        setImportErrors(result.errors);
      } else if (result.normalized) {
        onImportScene(result.normalized);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      }
    } catch (err: any) {
      setImportErrors([`Lỗi cú pháp JSON: ${err.message}`]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Hidden/Referenced Canvas Viewport for Exporter */}
      <div className="bg-neutral-900/60 border border-neutral-800/80 p-5 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-neutral-100">Cửa Sổ Nguồn Xuất Film (1920x1080 ViewBox)</h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {currentScene.scene_id} ({currentScene.lighting.sky_preset})
          </span>
        </div>

        <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-neutral-800 shadow-xl">
          {/* Custom renderer that captures SVG ref */}
          <div className="relative w-full aspect-video">
            <SceneRenderer
              script={currentScene}
              showGizmo={false}
              showSubtitles={true}
              currentTime={isRecording ? exportTime : undefined}
              interactiveDrag={false}
              svgRef={{
                get current() {
                  return svgRef;
                },
                set current(val) {
                  if (val !== svgRef) setSvgRef(val);
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Export Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Record Video */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 p-5 rounded-2xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
              <Video className="w-5 h-5" />
              <h4>Xuất Video (WebM / MP4)</h4>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ghi hình trực tiếp luồng chuyển động SVG ở chuẩn 30 FPS bằng HTML5 Canvas và MediaRecorder.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-neutral-300">
              <span>Thời lượng ghi hình:</span>
              <div className="flex items-center gap-1 font-mono">
                {[3, 5, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setRecordDuration(sec)}
                    className={`px-2 py-0.5 rounded ${
                      recordDuration === sec
                        ? "bg-red-700 text-white font-bold"
                        : "bg-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {isRecording && (
              <div className="flex flex-col gap-1">
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all duration-100"
                    style={{ width: `${recordProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-center text-red-400 font-mono">
                  Đang ghi hình: {recordProgress}%...
                </span>
              </div>
            )}

            <button
              onClick={handleRecordVideo}
              disabled={isRecording}
              className="w-full py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/30"
            >
              <Download className="w-4 h-4" />
              <span>{isRecording ? "Đang xuất phim..." : `Quay & Tải Video (${recordDuration}s)`}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Snapshots (PNG & SVG) */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 p-5 rounded-2xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-neutral-200 font-semibold mb-2">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              <h4>Ảnh Chụp Frame (1920x1080)</h4>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Trích xuất khung hình độ nét cao định dạng PNG hoặc file vector SVG gốc thuần code.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSnapshotPng}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-neutral-700"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Tải Ảnh PNG (1920x1080)</span>
            </button>

            <button
              onClick={handleExportSvg}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-neutral-700"
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Tải File Vector SVG Gốc</span>
            </button>
          </div>
        </div>

        {/* Card 3: Director Script JSON */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 p-5 rounded-2xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-neutral-200 font-semibold mb-2">
              <FileCode className="w-5 h-5 text-blue-400" />
              <h4>Kịch Bản Director (JSON)</h4>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Xuất hoặc sao chép hợp đồng dữ liệu JSON chuẩn để nạp vào Gemini API hoặc lưu trữ kịch bản.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleCopyJson}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-neutral-700"
            >
              {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedScript ? "Đã sao chép JSON!" : "Sao chép Script JSON"}</span>
            </button>

            <button
              onClick={() => downloadJson(currentScene, `${currentScene.scene_id}.json`)}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-neutral-700"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Tải file scene_script.json</span>
            </button>
          </div>
        </div>
      </div>

      {/* Import & Gemini LLM Bridge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Gemini Director Prompt Generator */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-100 font-semibold text-sm">
              <Bot className="w-5 h-5 text-purple-400" />
              <span>Prompt Chuẩn Dành Cho Gemini Director</span>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-all border border-neutral-700"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? "Đã chép Prompt!" : "Sao Chép Prompt"}</span>
            </button>
          </div>
          <p className="text-xs text-neutral-400">
            Sao chép đoạn chỉ lệnh kèm từ điển tài nguyên này và gửi cho Gemini để AI sinh kịch bản cảnh mới hợp lệ 100%.
          </p>
          <pre className="p-3 bg-black/60 rounded-xl text-[11px] font-mono text-neutral-300 max-h-56 overflow-y-auto border border-neutral-800/70 select-all whitespace-pre-wrap">
            {geminiSystemPrompt}
          </pre>
        </div>

        {/* Right: Import & Validate Script JSON */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-100 font-semibold text-sm">
              <Sparkles className="w-5 h-5 text-red-400" />
              <span>Nạp & Render Kịch Bản Từ Gemini</span>
            </div>
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-800 hover:bg-red-700 text-xs font-semibold text-white transition-all shadow-md shadow-red-950/40"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nạp & Render Ngay</span>
            </button>
          </div>

          <textarea
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Dán mã JSON kịch bản do Gemini sinh ra vào đây..."
            rows={7}
            className="w-full bg-black/70 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-red-600 transition-all resize-none"
          />

          {/* Validation Feedback */}
          {importErrors.length > 0 && (
            <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl flex flex-col gap-1 text-xs text-red-300">
              <div className="flex items-center gap-1.5 font-semibold text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>Phát hiện lỗi kịch bản:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 font-mono text-[11px]">
                {importErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {importSuccess && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Kịch bản hợp lệ! Đã nạp thành công vào Engine đồ họa.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
