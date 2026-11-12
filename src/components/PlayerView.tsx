import React, { useState, useEffect, useRef } from "react";
import type { DirectorSceneScript } from "../engine/types";
import { SceneRenderer } from "../engine/SceneRenderer";
import { soundEngine } from "../engine/AudioSynthesizer";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Zap,
  Film,
  Layers,
  Info,
} from "lucide-react";

interface PlayerViewProps {
  scenes: DirectorSceneScript[];
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  showGizmo: boolean;
  onToggleGizmo: () => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  scenes,
  currentSceneIndex,
  onSelectScene,
  showGizmo,
  onToggleGizmo,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLetterbox, setIsLetterbox] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeScene = scenes[currentSceneIndex] || scenes[0];
  const sceneDuration = activeScene?.duration_sec || 6;

  // Reset timeline when switching scenes
  useEffect(() => {
    setCurrentTime(0);
  }, [currentSceneIndex]);

  // Smooth ~60fps requestAnimationFrame playback loop for A -> B motion
  useEffect(() => {
    if (!isPlaying) return;

    let rafId: number | null = null;
    let transitionTimer: number | null = null;
    let lastTimestamp = performance.now();
    let hasTriggeredAdvance = false;

    const tick = (now: number) => {
      const dt = Math.min(0.1, Math.max(0, (now - lastTimestamp) / 1000));
      lastTimestamp = now;

      setCurrentTime((prev) => {
        const next = prev + dt * playbackSpeed;
        if (next >= sceneDuration) {
          if (scenes.length > 1) {
            if (!hasTriggeredAdvance) {
              hasTriggeredAdvance = true;
              setIsTransitioning(true);
              transitionTimer = window.setTimeout(() => {
                const nextIndex = (currentSceneIndex + 1) % scenes.length;
                onSelectScene(nextIndex);
                setIsTransitioning(false);
              }, 300);
            }
            return 0;
          }
          return next % sceneDuration;
        }
        return next;
      });

      if (!hasTriggeredAdvance) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (transitionTimer !== null) window.clearTimeout(transitionTimer);
    };
  }, [isPlaying, currentSceneIndex, scenes.length, sceneDuration, playbackSpeed, onSelectScene]);

  // Audio mute sync
  const toggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto w-full">
      {/* Top Banner Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800/80 px-5 py-3 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
          <h2 className="text-lg font-semibold tracking-wide text-neutral-100 flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <span>Rạp Chiếu Phim Bóng Đen</span>
          </h2>
          <span className="text-xs bg-red-950 text-red-300 border border-red-800/60 px-2.5 py-0.5 rounded-full font-mono">
            {activeScene?.scene_id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle button */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isMuted
                ? "bg-red-700/80 text-white shadow-lg shadow-red-900/30"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            }`}
            title="Âm thanh rùng rợn giả lập qua Web Audio API thuần"
          >
            {!isMuted ? <Volume2 className="w-4 h-4 text-white animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span>{!isMuted ? "Âm thanh: BẬT" : "Bật âm thanh"}</span>
          </button>

          {/* Trigger Thunder */}
          <button
            onClick={() => soundEngine.triggerThunder()}
            disabled={isMuted}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-300 transition-all"
            title="Tạo tiếng sấm sét rền rĩ"
          >
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Sấm Sét</span>
          </button>

          {/* Gizmo Toggle */}
          <button
            onClick={onToggleGizmo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showGizmo
                ? "bg-emerald-800/80 text-emerald-200 border border-emerald-600/50"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            }`}
            title="Hiện tọa độ Y=800, các slot neo và socket nhân vật"
          >
            <Layers className="w-4 h-4" />
            <span>{showGizmo ? "Tắt Lưới Neo" : "Hiện Lưới Neo"}</span>
          </button>
        </div>
      </div>

      {/* Main Cinematic Viewport */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden border border-neutral-800/80 bg-black shadow-2xl transition-all duration-300 ${
          isLetterbox ? "p-4 md:p-8 bg-neutral-950" : ""
        }`}
      >
        {/* Cinematic Fade Transition Overlay */}
        <div
          className={`absolute inset-0 bg-black z-40 pointer-events-none transition-opacity duration-300 ${
            isTransitioning ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* The 2D Procedural SVG Horror Engine */}
        <div className="relative w-full overflow-hidden">
          <SceneRenderer
            script={activeScene}
            showGizmo={showGizmo}
            showSubtitles={true}
            currentTime={currentTime}
            interactiveDrag={false}
          />
        </div>

        {/* Narrative Director Note in Corner */}
        {activeScene?.narrative_note && (
          <div className="absolute top-4 left-4 max-w-md bg-neutral-950/75 backdrop-blur-md border border-neutral-800/60 p-3 rounded-lg text-xs text-neutral-300 shadow-xl pointer-events-none">
            <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Ghi chú Đạo diễn</span>
            </div>
            <p className="leading-relaxed opacity-90">{activeScene.narrative_note}</p>
          </div>
        )}
      </div>

      {/* Playback Controls & Timeline Scrubber */}
      <div className="bg-neutral-900/70 border border-neutral-800/80 p-4 md:p-5 rounded-2xl flex flex-col gap-4 backdrop-blur-md">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-400 w-10 text-right">
            {currentTime.toFixed(1)}s
          </span>
          <div
            className="flex-1 h-2 bg-neutral-800 hover:h-3 rounded-full overflow-hidden cursor-pointer transition-all relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              setCurrentTime(pos * sceneDuration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-red-800 to-red-600 rounded-full transition-all duration-75"
              style={{ width: `${(currentTime / sceneDuration) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-neutral-400 w-10">
            {sceneDuration.toFixed(1)}s
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Main Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const prevIndex = (currentSceneIndex - 1 + scenes.length) % scenes.length;
                onSelectScene(prevIndex);
                setCurrentTime(0);
              }}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all"
              title="Cảnh trước"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-medium flex items-center gap-2 shadow-lg shadow-red-900/30 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isPlaying ? "Tạm dừng" : "Phát phim"}</span>
            </button>

            <button
              onClick={() => {
                const nextIndex = (currentSceneIndex + 1) % scenes.length;
                onSelectScene(nextIndex);
                setCurrentTime(0);
              }}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all"
              title="Cảnh kế tiếp"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Speed & Options */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-800/80 rounded-xl p-1 border border-neutral-700/60">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${
                    playbackSpeed === spd
                      ? "bg-red-700 text-white font-bold"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsLetterbox(!isLetterbox)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isLetterbox
                  ? "bg-neutral-700 text-neutral-100 border-neutral-500"
                  : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200"
              }`}
            >
              Letterbox
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all"
              title="Toàn màn hình"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scene Playlist / Timeline Thumbnails */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>Danh Sách Cảnh Trong Phim ({scenes.length} cảnh)</span>
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenes.map((sc, idx) => {
            const isCur = idx === currentSceneIndex;
            return (
              <div
                key={sc.scene_id}
                onClick={() => {
                  onSelectScene(idx);
                  setCurrentTime(0);
                }}
                className={`cursor-pointer rounded-xl p-3 border transition-all ${
                  isCur
                    ? "bg-red-950/40 border-red-600/70 shadow-lg shadow-red-950/40 ring-1 ring-red-600/40"
                    : "bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-800/60 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-red-400">
                    #{idx + 1}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {sc.duration_sec || 6}s | {sc.lighting.sky_preset}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-neutral-100 truncate">
                  {sc.title || sc.scene_id}
                </h4>
                <p className="text-xs text-neutral-400 truncate mt-1">
                  {sc.dialogue || "Không có lời thoại"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
