import { useState, useEffect } from "react";
import type { DirectorSceneScript, ThemeId, SkyPresetId, CharacterBaseId, CostumeId, CharacterFaceId, CharacterPoseId, StructureId } from "./engine/types";
import { DEFAULT_HORROR_SCENES } from "./engine/defaultScenes";
import { PlayerView } from "./components/PlayerView";
import { EditorView } from "./components/EditorView";
import { ExporterView } from "./components/ExporterView";
import { AiDirectorModal, type AiModalMode } from "./components/AiDirectorModal";
import {
  Film,
  Sliders,
  Download,
  Skull,
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Compass,
} from "lucide-react";

type ActiveTab = "player" | "editor" | "exporter";

function createTemplateScene(sceneNumber: number): DirectorSceneScript {
  const presets: Array<{
    theme: ThemeId;
    sky: SkyPresetId;
    structure: StructureId;
    structSlot: "far_left" | "center" | "far_right";
    base: CharacterBaseId;
    costume: CostumeId;
    face: CharacterFaceId;
    pose: CharacterPoseId;
  }> = [
    {
      theme: "rural_graveyard",
      sky: "foggy_night",
      structure: "ancient_tomb",
      structSlot: "center",
      base: "female_adult",
      costume: "outfit_flowing_ao_dai",
      face: "face_creepy_smile",
      pose: "pose_standing",
    },
    {
      theme: "abandoned_village",
      sky: "stormy_dark",
      structure: "dilapidated_hut",
      structSlot: "far_left",
      base: "creepy_child",
      costume: "outfit_child_pajamas",
      face: "face_faceless",
      pose: "pose_shivering",
    },
    {
      theme: "cursed_swamp",
      sky: "eclipse_abyss",
      structure: "creepy_well",
      structSlot: "center",
      base: "jiangshi_corpse",
      costume: "outfit_mandarin_court",
      face: "face_talisman_covered",
      pose: "pose_reaching",
    },
  ];

  const pick = presets[(sceneNumber - 1) % presets.length];
  return {
    scene_id: `scene_${String(sceneNumber).padStart(2, "0")}_${Date.now().toString().slice(-4)}`,
    title: `Cảnh ${sceneNumber}: Khung Hình Mới`,
    duration_sec: 6,
    theme: pick.theme,
    lighting: {
      sky_preset: pick.sky,
      fog_density: 0.65,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: pick.structure,
        slot: pick.structSlot,
        scale: 1,
      },
    ],
    actors: [
      {
        id: `actor_${sceneNumber}_1`,
        base: pick.base,
        costume: pick.costume,
        face: pick.face,
        pose: pick.pose,
        facing: "right",
        slot: "mid_left",
        scale: 1,
      },
    ],
    details: [],
    dialogue: `Cảnh ${sceneNumber}... Một bóng đen mới xuất hiện trong sương mù.`,
    narrative_note: "",
  };
}

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("player");
  const [scenes, setScenes] = useState<DirectorSceneScript[]>(DEFAULT_HORROR_SCENES);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [showGizmo, setShowGizmo] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiModalMode, setAiModalMode] = useState<AiModalMode>("description_film");

  const safeSceneIndex = Math.min(currentSceneIndex, Math.max(0, scenes.length - 1));
  const currentScene = scenes[safeSceneIndex] || scenes[0];

  useEffect(() => {
    if (safeSceneIndex !== currentSceneIndex) {
      setCurrentSceneIndex(safeSceneIndex);
    }
  }, [safeSceneIndex, currentSceneIndex]);

  const handleUpdateCurrentScene = (updated: DirectorSceneScript) => {
    setScenes((prev) => {
      const next = [...prev];
      next[safeSceneIndex] = updated;
      return next;
    });
  };

  const handleOpenAiDirector = (mode: AiModalMode = "description_film") => {
    setAiModalMode(mode);
    setIsAiModalOpen(true);
  };

  const handleApplyNewFilm = (newScenes: DirectorSceneScript[]) => {
    if (!newScenes || newScenes.length === 0) return;
    setScenes(newScenes);
    setCurrentSceneIndex(0);
    setActiveTab("player");
    setIsAiModalOpen(false);
  };

  const handleApplySingleScene = (updatedScene: DirectorSceneScript) => {
    handleUpdateCurrentScene(updatedScene);
    setActiveTab("player");
    setIsAiModalOpen(false);
  };

  const handleAppendScene = (newScene: DirectorSceneScript) => {
    const nextIdx = scenes.length;
    setScenes((prev) => [...prev, newScene]);
    setCurrentSceneIndex(nextIdx);
    setActiveTab("player");
    setIsAiModalOpen(false);
  };

  const handleResetCurrentScene = () => {
    const defaultScene = DEFAULT_HORROR_SCENES[safeSceneIndex];
    if (defaultScene) {
      handleUpdateCurrentScene(JSON.parse(JSON.stringify(defaultScene)));
    } else {
      handleUpdateCurrentScene(createTemplateScene(safeSceneIndex + 1));
    }
  };

  const handleAddScene = () => {
    const newScene = createTemplateScene(scenes.length + 1);
    const nextIdx = scenes.length;
    setScenes((prev) => [...prev, newScene]);
    setCurrentSceneIndex(nextIdx);
    setActiveTab("editor");
  };

  const handleDuplicateCurrentScene = () => {
    const cloned: DirectorSceneScript = JSON.parse(JSON.stringify(currentScene));
    cloned.scene_id = `${currentScene.scene_id}_copy_${Date.now().toString().slice(-4)}`;
    cloned.title = `${currentScene.title || `Cảnh ${safeSceneIndex + 1}`} (Bản sao)`;
    const insertAt = safeSceneIndex + 1;
    setScenes((prev) => [
      ...prev.slice(0, insertAt),
      cloned,
      ...prev.slice(insertAt),
    ]);
    setCurrentSceneIndex(insertAt);
    setActiveTab("editor");
  };

  const handleDeleteCurrentScene = () => {
    if (scenes.length <= 1) return;
    setScenes((prev) => prev.filter((_, idx) => idx !== safeSceneIndex));
    setCurrentSceneIndex((prevIdx) => Math.max(0, Math.min(prevIdx, scenes.length - 2)));
  };

  const handleMoveCurrentScene = (direction: -1 | 1) => {
    const targetIdx = safeSceneIndex + direction;
    if (targetIdx < 0 || targetIdx >= scenes.length) return;
    setScenes((prev) => {
      const next = [...prev];
      const [moved] = next.splice(safeSceneIndex, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setCurrentSceneIndex(targetIdx);
  };

  const handleImportScene = (newScene: DirectorSceneScript) => {
    const nextIdx = scenes.length;
    setScenes((prev) => [...prev, newScene]);
    setCurrentSceneIndex(nextIdx);
    setActiveTab("player");
  };

  const totalFilmDuration = scenes.reduce((sum, s) => sum + (s.duration_sec || 6), 0);

  return (
    <div className="min-h-screen bg-[#07080c] text-neutral-200 flex flex-col font-sans selection:bg-red-800 selection:text-white pb-16">
      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#090b12]/90 backdrop-blur-md border-b border-neutral-800/80 px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-700 to-red-950 flex items-center justify-center border border-red-600/40 shadow-lg shadow-red-950/60">
              <Skull className="w-5 h-5 text-red-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white m-0">
                  LIMBO ENGINE 2D
                </h1>
                <span className="text-[10px] bg-red-950 text-red-400 font-mono px-2 py-0.5 rounded border border-red-800/50">
                  PURE CODE SVG
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 tracking-wide">
                Hệ Thống Đồ Họa & Router Layout Hoạt Hình Kinh Dị Bóng Đen
              </p>
            </div>
          </div>

          {/* Quick AI Director Launcher & Tab Navigation */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenAiDirector("description_film")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 via-amber-600 to-purple-600 hover:from-red-500 hover:via-amber-500 hover:to-purple-500 text-white shadow-lg shadow-red-950/50 border border-amber-400/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              title="Cỗ máy tạo video 2D theo mô tả trực tiếp & khóa bối cảnh chung dùng lại"
            >
              <Compass className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>✨ Cỗ Máy Video 2D (Gemini)</span>
            </button>

            {/* Tab Navigation Switches */}
            <nav className="flex items-center bg-black/60 p-1.5 rounded-xl border border-neutral-800/80">
              {/* Tab 1: Xem Phim */}
              <button
                onClick={() => setActiveTab("player")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "player"
                    ? "bg-red-700 text-white shadow-lg shadow-red-950/50"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }`}
              >
                <Film className="w-4 h-4" />
                <span>1. Xem Đoạn Phim</span>
              </button>

              {/* Tab 2: Điều Chỉnh Cảnh Vật */}
              <button
                onClick={() => setActiveTab("editor")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "editor"
                    ? "bg-red-700 text-white shadow-lg shadow-red-950/50"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>2. Điều Chỉnh Vị Trí Cảnh</span>
              </button>

              {/* Tab 3: Xuất Phim */}
              <button
                onClick={() => setActiveTab("exporter")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "exporter"
                    ? "bg-red-700 text-white shadow-lg shadow-red-950/50"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }`}
              >
                <Download className="w-4 h-4" />
                <span>3. Xuất Phim & Video</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* SCENE SEQUENCER BAR (GLOBAL ACROSS ALL TABS) */}
      <div className="border-b border-neutral-800/70 bg-[#080a10]/95 px-4 md:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
              Chuỗi Cảnh ({scenes.length}):
            </span>

            {scenes.map((sc, idx) => {
              const isActive = idx === safeSceneIndex;
              const dur = sc.duration_sec || 6;
              return (
                <button
                  key={`${sc.scene_id}-${idx}`}
                  onClick={() => setCurrentSceneIndex(idx)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    isActive
                      ? "bg-red-800/80 border-red-500 text-white font-semibold shadow-md shadow-red-950/50"
                      : "bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  }`}
                  title={sc.title || sc.scene_id}
                >
                  <span>Cảnh {idx + 1}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-cyan-300">
                    {dur}s
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {sc.actors.length}NV
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 mr-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Tổng: {totalFilmDuration.toFixed(1)}s
            </span>

            <button
              onClick={() => handleOpenAiDirector("environments_manager")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-800/60 text-xs font-semibold transition-all shadow"
              title="Mở thư viện các bối cảnh chung dùng lại để áp dụng cho cảnh"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Thư Viện Bối Cảnh</span>
            </button>

            <button
              onClick={() => handleOpenAiDirector("description_film")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-800 to-red-800 hover:from-purple-700 hover:to-red-700 text-white text-xs font-semibold transition-all shadow border border-purple-500/40"
              title="Tạo phân cảnh video từ mô tả hành động nhân vật"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tạo Video Theo Mô Tả</span>
            </button>

            <button
              onClick={handleAddScene}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-all shadow"
              title="Tạo một Scene mới với bối cảnh & nhân vật riêng"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Cảnh Mới</span>
            </button>

            <button
              onClick={handleDuplicateCurrentScene}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs transition-all"
              title="Nhân bản cảnh hiện tại thành một cảnh tiếp theo"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Nhân bản</span>
            </button>

            <button
              onClick={() => handleMoveCurrentScene(-1)}
              disabled={safeSceneIndex === 0}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-35 text-neutral-300 border border-neutral-700 transition-all"
              title="Đẩy cảnh hiện tại lên trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleMoveCurrentScene(1)}
              disabled={safeSceneIndex >= scenes.length - 1}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-35 text-neutral-300 border border-neutral-700 transition-all"
              title="Đẩy cảnh hiện tại ra sau"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDeleteCurrentScene}
              disabled={scenes.length <= 1}
              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 disabled:opacity-35 text-red-300 border border-red-800/50 transition-all"
              title="Xóa cảnh hiện tại"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* VIEW 1: FILM PLAYER */}
        {activeTab === "player" && (
          <PlayerView
            scenes={scenes}
            currentSceneIndex={safeSceneIndex}
            onSelectScene={(idx) => setCurrentSceneIndex(idx)}
            showGizmo={showGizmo}
            onToggleGizmo={() => setShowGizmo(!showGizmo)}
          />
        )}

        {/* VIEW 2: SCENE & LAYOUT EDITOR */}
        {activeTab === "editor" && (
          <EditorView
            scene={currentScene}
            onChangeScene={handleUpdateCurrentScene}
            onResetScene={handleResetCurrentScene}
            onOpenAiDirector={handleOpenAiDirector}
          />
        )}

        {/* VIEW 3: FILM EXPORTER */}
        {activeTab === "exporter" && (
          <ExporterView
            currentScene={currentScene}
            onImportScene={handleImportScene}
            onOpenAiDirector={handleOpenAiDirector}
          />
        )}
      </main>

      {/* GEMINI AI DIRECTOR MODAL */}
      <AiDirectorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentScene={currentScene}
        currentSceneIndex={safeSceneIndex}
        totalScenesCount={scenes.length}
        onApplyNewFilm={handleApplyNewFilm}
        onApplySingleScene={handleApplySingleScene}
        onAppendScene={handleAppendScene}
        initialMode={aiModalMode}
      />

      {/* FOOTER SPECS */}
      <footer className="mt-auto border-t border-neutral-900 bg-[#06070a] px-6 py-4 text-center text-xs text-neutral-500 font-mono">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <span>Khung hình: 1920x1080 (16:9)</span>
          <span>Trục tiếp đất: Y = 800px [bottom-center]</span>
          <span>100% Thuần SVG / CSS / Web Audio API</span>
          <span>Gemini Director JSON Contract v1.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
