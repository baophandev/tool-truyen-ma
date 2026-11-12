import { useState } from "react";
import type { DirectorSceneScript } from "./engine/types";
import { DEFAULT_HORROR_SCENES } from "./engine/defaultScenes";
import { PlayerView } from "./components/PlayerView";
import { EditorView } from "./components/EditorView";
import { ExporterView } from "./components/ExporterView";
import {
  Film,
  Sliders,
  Download,
  Skull,
} from "lucide-react";

type ActiveTab = "player" | "editor" | "exporter";

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("player");
  const [scenes, setScenes] = useState<DirectorSceneScript[]>(DEFAULT_HORROR_SCENES);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [showGizmo, setShowGizmo] = useState<boolean>(false);

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  const handleUpdateCurrentScene = (updated: DirectorSceneScript) => {
    const newScenes = [...scenes];
    newScenes[currentSceneIndex] = updated;
    setScenes(newScenes);
  };

  const handleResetCurrentScene = () => {
    const defaultScene = DEFAULT_HORROR_SCENES[currentSceneIndex] || DEFAULT_HORROR_SCENES[0];
    handleUpdateCurrentScene(JSON.parse(JSON.stringify(defaultScene)));
  };

  const handleImportScene = (newScene: DirectorSceneScript) => {
    setScenes((prev) => [...prev, newScene]);
    setCurrentSceneIndex(scenes.length);
    setActiveTab("player");
  };

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
      </header>

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* VIEW 1: FILM PLAYER */}
        {activeTab === "player" && (
          <PlayerView
            scenes={scenes}
            currentSceneIndex={currentSceneIndex}
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
          />
        )}

        {/* VIEW 3: FILM EXPORTER */}
        {activeTab === "exporter" && (
          <ExporterView
            currentScene={currentScene}
            onImportScene={handleImportScene}
          />
        )}
      </main>

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
