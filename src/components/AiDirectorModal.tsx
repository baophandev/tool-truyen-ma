import React, { useState, useEffect } from "react";
import type { DirectorSceneScript, NamedEnvironmentPreset } from "../engine/types";
import {
  generateFilmFromDescriptions,
  generateSceneFromDescription,
  generateNamedEnvironmentFromPrompt,
  getStoredApiKey,
  setStoredApiKey,
  getStoredModel,
  setStoredModel,
  type SceneDescriptionSpec,
} from "../engine/geminiDirector";
import {
  loadStoredNamedEnvironments,
  addOrUpdateNamedEnvironment,
  deleteNamedEnvironment,
  applyEnvironmentToScene,
  extractEnvironmentFromScene,
} from "../engine/environmentPresets";
import {
  Sparkles,
  Bot,
  Film,
  Key,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
  Sliders,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Compass,
  BookmarkPlus,
  Trash2,
  Plus,
  Check,
} from "lucide-react";

export type AiModalMode =
  | "description_film"
  | "environments_manager"
  | "re_direct_scene"
  | "full_film"
  | "append_scene";

interface AiDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScene: DirectorSceneScript;
  currentSceneIndex: number;
  totalScenesCount: number;
  onApplyNewFilm: (newScenes: DirectorSceneScript[]) => void;
  onApplySingleScene: (updatedScene: DirectorSceneScript) => void;
  onAppendScene: (newScene: DirectorSceneScript) => void;
  initialMode?: AiModalMode;
}

interface SceneDraftSpec {
  environmentId: string;
  actionDescription: string;
  duration_sec: number;
  title: string;
}

export const AiDirectorModal: React.FC<AiDirectorModalProps> = ({
  isOpen,
  onClose,
  currentScene,
  currentSceneIndex,
  onApplyNewFilm,
  onApplySingleScene,
  initialMode = "description_film",
}) => {
  // Map legacy mode names if passed
  const normalizeInitialMode = (m: AiModalMode): "description_film" | "environments_manager" | "re_direct_scene" => {
    if (m === "full_film" || m === "append_scene") return "description_film";
    return m;
  };

  const [mode, setMode] = useState<"description_film" | "environments_manager" | "re_direct_scene">(() =>
    normalizeInitialMode(initialMode)
  );
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [model, setModel] = useState<string>(getStoredModel);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Environments library state
  const [namedEnvironments, setNamedEnvironments] = useState<NamedEnvironmentPreset[]>(loadStoredNamedEnvironments);

  // Multi-scene description drafts
  const [sceneCount, setSceneCount] = useState<number>(3);
  const [sceneDrafts, setSceneDrafts] = useState<SceneDraftSpec[]>(() => {
    const envs = loadStoredNamedEnvironments();
    const env1 = envs[0]?.id || "env_graveyard_foggy";
    const env2 = envs[1]?.id || env1;

    return [
      {
        environmentId: env1,
        title: "Cảnh 1: Lữ Khách Bãi Tha Ma",
        actionDescription:
          "Người nông dân mặc áo tơi sờn rách cầm đèn bão sắt bước từ bên trái sang giữa, run rẩy dừng lại trước bia mộ cổ.",
        duration_sec: 6,
      },
      {
        environmentId: env1, // Shared environment 100% same background!
        title: "Cảnh 2: Hồn Ma Hiện Hình",
        actionDescription:
          "Một bóng ma quấn vải liệm tử thi hiện hình lơ lửng trên không trung nhìn chằm chằm, người nông dân sợ hãi giơ đèn bão lùi lại.",
        duration_sec: 6,
      },
      {
        environmentId: env2, // Move to next set
        title: "Cảnh 3: Trấn Áp Tại Miếu Cổ",
        actionDescription:
          "Người nông dân tháo chạy tới trước cửa miếu hoang, pháp sư mặc áo cà sa cầm kiếm gỗ đào và bùa vàng xuất hiện nghênh chiến.",
        duration_sec: 7,
      },
    ];
  });

  // Single Scene Action Director state
  const [singleSceneEnvId, setSingleSceneEnvId] = useState<string>(() => {
    const envs = loadStoredNamedEnvironments();
    return envs[0]?.id || "env_graveyard_foggy";
  });
  const [singleSceneAction, setSingleSceneAction] = useState<string>(
    "Cho bóng ma quấn vải liệm bay từ trên cao xuống rượt đuổi lữ khách, lữ khách cầm đèn bão hoảng loạn cắm đầu bỏ chạy."
  );
  const [singleSceneDuration, setSingleSceneDuration] = useState<number>(currentScene.duration_sec || 6);

  // New environment creation state
  const [newEnvPrompt, setNewEnvPrompt] = useState<string>(
    "Ngôi miếu hoang cô hồn dưới ánh trăng máu đỏ rực, có lều tranh xiêu vẹo ở bìa trái và bùa vàng treo phấp phới"
  );
  const [customEnvSaveName, setCustomEnvSaveName] = useState<string>("");
  const [envSaveSuccess, setEnvSaveSuccess] = useState<string | null>(null);

  // Loading & Result state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedScenes, setGeneratedScenes] = useState<DirectorSceneScript[] | null>(null);
  const [generatedSingleScene, setGeneratedSingleScene] = useState<DirectorSceneScript[] | null>(null);

  // Sync mode whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(normalizeInitialMode(initialMode));
      setErrorMessage(null);
      setNamedEnvironments(loadStoredNamedEnvironments());
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    setStoredApiKey(newKey);
  };

  const handleSaveModel = (newModel: string) => {
    setModel(newModel);
    setStoredModel(newModel);
  };

  const handleSceneCountChange = (newCount: number) => {
    setSceneCount(newCount);
    setSceneDrafts((prev) => {
      const next = [...prev];
      const defaultEnvId = namedEnvironments[0]?.id || "env_graveyard_foggy";
      if (newCount > next.length) {
        while (next.length < newCount) {
          const num = next.length + 1;
          next.push({
            environmentId: defaultEnvId,
            title: `Cảnh ${num}: Diễn Biến Tiếp`,
            actionDescription: "",
            duration_sec: 6,
          });
        }
      } else if (newCount < next.length) {
        return next.slice(0, newCount);
      }
      return next;
    });
  };

  const handleUpdateDraft = (index: number, field: keyof SceneDraftSpec, value: any) => {
    setSceneDrafts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Generate Film from Description Specs
  const handleGenerateFilmFromDescriptions = async () => {
    const hasAny = sceneDrafts.some((d) => d.actionDescription.trim().length > 0);
    if (!hasAny) {
      setErrorMessage("Vui lòng nhập mô tả hành động nhân vật cho ít nhất một phân cảnh.");
      return;
    }

    const envMap = new Map(namedEnvironments.map((e) => [e.id, e]));
    const fallbackEnv = namedEnvironments[0];

    const specs: SceneDescriptionSpec[] = sceneDrafts.map((draft) => {
      const env = envMap.get(draft.environmentId) || fallbackEnv;
      return {
        environment: env,
        actionDescription: draft.actionDescription.trim() || "Nhân vật bước đi cẩn trọng trong màn sương mù.",
        duration_sec: draft.duration_sec || 6,
        title: draft.title || undefined,
      };
    });

    setIsLoading(true);
    setErrorMessage(null);
    setGeneratedScenes(null);
    setLoadingStep("1/3: Đang kết nối tới trí tuệ nhân tạo Gemini...");

    const stepTimer1 = setTimeout(() => {
      setLoadingStep("2/3: Đang khóa cố định bối cảnh và biên dịch hành động nhân vật sang SVG JSX...");
    }, 1500);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep("3/3: Đang tính toán socket cán cầm và quỹ đạo chuyển động A → B...");
    }, 3500);

    try {
      const result = await generateFilmFromDescriptions(specs, {
        apiKey,
        model,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!result.success || !result.scenes) {
        setErrorMessage(result.error || "Không thể tạo kịch bản phim.");
      } else {
        setGeneratedScenes(result.scenes);
      }
    } catch (err: any) {
      setErrorMessage(`Lỗi: ${err.message}`);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  // Generate Single Scene from Description
  const handleGenerateSingleScene = async () => {
    if (!singleSceneAction.trim()) {
      setErrorMessage("Vui lòng nhập mô tả hành động của nhân vật trong cảnh này.");
      return;
    }

    const envMap = new Map(namedEnvironments.map((e) => [e.id, e]));
    const env = envMap.get(singleSceneEnvId) || namedEnvironments[0];

    setIsLoading(true);
    setErrorMessage(null);
    setGeneratedSingleScene(null);
    setLoadingStep("Gemini đang bố trí nhân vật theo mô tả...");

    try {
      const result = await generateSceneFromDescription(env, singleSceneAction, {
        duration_sec: singleSceneDuration,
        title: currentScene.title,
        apiKey,
        model,
        sceneIndex: currentSceneIndex,
      });

      if (!result.success || !result.scene) {
        setErrorMessage(result.error || "Không thể tạo cảnh.");
      } else {
        setGeneratedSingleScene([result.scene]);
      }
    } catch (err: any) {
      setErrorMessage(`Lỗi: ${err.message}`);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  // Create new Named Environment from AI Prompt
  const handleCreateEnvFromPrompt = async () => {
    if (!newEnvPrompt.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep("Gemini đang thiết kế bối cảnh 2D mới...");

    try {
      const res = await generateNamedEnvironmentFromPrompt(newEnvPrompt, {
        apiKey,
        model,
      });

      if (res.success && res.environment) {
        const updated = addOrUpdateNamedEnvironment(res.environment);
        setNamedEnvironments(updated);
        setEnvSaveSuccess(`Đã tạo thành công bối cảnh: "${res.environment.name}"!`);
        setTimeout(() => setEnvSaveSuccess(null), 3500);
      } else {
        setErrorMessage(res.error || "Không thể tạo bối cảnh mới.");
      }
    } catch (err: any) {
      setErrorMessage(`Lỗi: ${err.message}`);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  // Save current scene environment as a reusable set
  const handleSaveCurrentSceneEnv = () => {
    const name = customEnvSaveName.trim() || `Bối Cảnh Tùy Chỉnh (${new Date().toLocaleTimeString("vi-VN")})`;
    const env = extractEnvironmentFromScene(currentScene, name);
    const updated = addOrUpdateNamedEnvironment(env);
    setNamedEnvironments(updated);
    setCustomEnvSaveName("");
    setEnvSaveSuccess(`Đã lưu bối cảnh: "${name}" vào thư viện dùng lại!`);
    setTimeout(() => setEnvSaveSuccess(null), 3500);
  };

  // Delete environment
  const handleDeleteEnv = (id: string) => {
    const updated = deleteNamedEnvironment(id);
    setNamedEnvironments(updated);
  };

  // Apply environment directly to current scene
  const handleApplyEnvToCurrentScene = (env: NamedEnvironmentPreset) => {
    const updated = applyEnvironmentToScene(currentScene, env);
    onApplySingleScene(updated);
    setEnvSaveSuccess(`Đã áp dụng bối cảnh "${env.name}" vào Cảnh ${currentSceneIndex + 1}!`);
    setTimeout(() => setEnvSaveSuccess(null), 3000);
  };

  // Confirm Handlers
  const handleConfirmApplyFilm = () => {
    if (generatedScenes && generatedScenes.length > 0) {
      onApplyNewFilm(generatedScenes);
      onClose();
    }
  };

  const handleConfirmApplySingle = () => {
    if (generatedSingleScene && generatedSingleScene[0]) {
      onApplySingleScene(generatedSingleScene[0]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b0d14] border border-neutral-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl shadow-black overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0d101a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-purple-900 flex items-center justify-center border border-red-500/40 shadow-lg shadow-red-950/60">
              <Compass className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight m-0">
                  CỖ MÁY TẠO VIDEO 2D THEO MÔ TẢ TRỰC TIẾP
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                  DIRECT DESCRIPTION ENGINE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Khóa bối cảnh chung dùng lại chống lệch cảnh • Mô tả trực tiếp nhân vật làm gì trong scene
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* TOP CONTROLS & API KEY SETTINGS BANNER */}
          <div className="flex flex-col gap-2 bg-neutral-950/90 border border-neutral-800/80 rounded-xl p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-neutral-200">
                  Mô hình LLM: <strong className="text-cyan-300 font-mono">{model}</strong>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  Đã kết nối
                </span>
                <span className="text-[11px] text-neutral-400 font-mono ml-2">
                  • Thư viện: <strong className="text-white">{namedEnvironments.length} bối cảnh chung</strong>
                </span>
              </div>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 transition-all font-mono"
              >
                <span>Cấu hình API Key & Model</span>
                {showSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showSettings && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-neutral-800/80 mt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-neutral-300">
                    Google Gemini API Key:
                  </label>
                  <div className="flex items-center gap-1 bg-black border border-neutral-800 rounded-lg px-2.5 py-1.5">
                    <input
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => handleSaveApiKey(e.target.value)}
                      placeholder="Nhập API Key Gemini..."
                      className="flex-1 bg-transparent text-xs text-neutral-200 font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="text-neutral-400 hover:text-white"
                      title={showKey ? "Ẩn" : "Hiện"}
                    >
                      {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-neutral-300">
                    Chọn phiên bản Gemini:
                  </label>
                  <select
                    value={model}
                    onChange={(e) => handleSaveModel(e.target.value)}
                    className="bg-black border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 font-mono focus:outline-none focus:border-red-600"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Khuyên dùng: Phản hồi tức thì)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Suy luận sâu)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* MODE TABS SWITCHER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1 bg-neutral-950/80 rounded-xl border border-neutral-800">
            {/* TAB 1 */}
            <button
              onClick={() => {
                setMode("description_film");
                setErrorMessage(null);
                setGeneratedScenes(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                mode === "description_film"
                  ? "bg-gradient-to-r from-red-700 to-purple-800 text-white shadow-md shadow-red-950/50"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850"
              }`}
            >
              <Film className="w-4 h-4 text-amber-300" />
              <span>1. Tạo Phim Theo Mô Tả ({sceneCount} Cảnh)</span>
            </button>

            {/* TAB 2 */}
            <button
              onClick={() => {
                setMode("environments_manager");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                mode === "environments_manager"
                  ? "bg-gradient-to-r from-red-700 to-purple-800 text-white shadow-md shadow-red-950/50"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850"
              }`}
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>2. Thư Viện Bối Cảnh Dùng Lại ({namedEnvironments.length})</span>
            </button>

            {/* TAB 3 */}
            <button
              onClick={() => {
                setMode("re_direct_scene");
                setErrorMessage(null);
                setGeneratedSingleScene(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                mode === "re_direct_scene"
                  ? "bg-gradient-to-r from-red-700 to-purple-800 text-white shadow-md shadow-red-950/50"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850"
              }`}
            >
              <RotateCcw className="w-4 h-4 text-purple-300" />
              <span>3. AI Bố Trí Lại Cảnh {currentSceneIndex + 1}</span>
            </button>
          </div>

          {/* TAB 1: DESCRIPTION-DRIVEN MULTI-SCENE GENERATOR */}
          {mode === "description_film" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950/70 p-3 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">
                    Số lượng phân cảnh:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => handleSceneCountChange(cnt)}
                        className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all ${
                          sceneCount === cnt
                            ? "bg-red-700 text-white shadow-md shadow-red-950/50 ring-1 ring-red-400"
                            : "bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                    <span className="text-xs text-neutral-400 ml-1">cảnh</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Các cảnh chọn cùng một bối cảnh sẽ có khung cảnh 100% y hệt nhau, không bị lệch.</span>
                </div>
              </div>

              {/* Per-Scene Description Cards */}
              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                {sceneDrafts.map((draft, idx) => {
                  const sceneNum = idx + 1;
                  const selectedEnv = namedEnvironments.find((e) => e.id === draft.environmentId) || namedEnvironments[0];

                  return (
                    <div
                      key={`scene-spec-${sceneNum}`}
                      className="bg-black/75 border border-neutral-800/90 hover:border-neutral-700 rounded-xl p-3.5 flex flex-col gap-3 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/70 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-red-900/80 border border-red-600/40 text-white font-mono text-xs font-bold flex items-center justify-center">
                            {sceneNum}
                          </span>
                          <input
                            type="text"
                            value={draft.title}
                            onChange={(e) => handleUpdateDraft(idx, "title", e.target.value)}
                            className="bg-transparent text-xs font-bold text-white border-b border-transparent hover:border-neutral-700 focus:border-red-600 focus:outline-none"
                            placeholder={`Tiêu đề cảnh ${sceneNum}...`}
                          />
                        </div>

                        {/* Environment Selector Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-neutral-400">Khóa Bối Cảnh:</span>
                          <select
                            value={draft.environmentId}
                            onChange={(e) => handleUpdateDraft(idx, "environmentId", e.target.value)}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-amber-200 font-medium focus:outline-none focus:border-amber-400"
                          >
                            {namedEnvironments.map((env) => (
                              <option key={env.id} value={env.id}>
                                📍 {env.name} ({env.theme})
                              </option>
                            ))}
                          </select>

                          {/* Duration */}
                          <div className="flex items-center gap-1 font-mono text-xs text-neutral-300 ml-1">
                            <input
                              type="number"
                              min="3"
                              max="20"
                              value={draft.duration_sec}
                              onChange={(e) => handleUpdateDraft(idx, "duration_sec", parseFloat(e.target.value) || 6)}
                              className="w-12 bg-black border border-neutral-800 rounded px-1.5 py-0.5 text-center text-xs text-cyan-300 focus:outline-none"
                            />
                            <span>s</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Description */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <label className="font-semibold text-neutral-300">
                            Mô Tả: Nhân vật làm gì trong cảnh này?
                          </label>
                          <span className="text-neutral-500 font-mono">
                            Bối cảnh cố định: {selectedEnv?.theme} | {selectedEnv?.lighting.sky_preset}
                          </span>
                        </div>

                        <textarea
                          rows={2}
                          value={draft.actionDescription}
                          onChange={(e) => handleUpdateDraft(idx, "actionDescription", e.target.value)}
                          placeholder="Ví dụ: Người nông dân mặc áo tơi cầm đèn bão sắt bước đi từ trái qua giữa, run rẩy dừng lại trước mộ cổ khi thấy quạ đen kêu..."
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600 resize-none leading-relaxed transition-all"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateFilmFromDescriptions}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-700 via-amber-700 to-purple-800 hover:from-red-600 hover:via-amber-600 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/60"
              >
                <Bot className="w-4 h-4 text-amber-300" />
                <span>
                  {isLoading
                    ? "Gemini Đang Biên Dịch Mô Tả Thành Hoạt Hình 2D..."
                    : `Bắt Đầu Tạo ${sceneCount} Phân Cảnh (Theo Mô Tả Trực Tiếp)`}
                </span>
              </button>
            </div>
          )}

          {/* TAB 2: REUSABLE NAMED ENVIRONMENTS MANAGER */}
          {mode === "environments_manager" && (
            <div className="flex flex-col gap-5">
              {/* Alert Feedback */}
              {envSaveSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{envSaveSuccess}</span>
                </div>
              )}

              {/* TOP: CREATION TOOLBAR */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* TOOL 1: CREATE BY AI DESCRIPTION */}
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Tạo Bối Cảnh Mới Từ Mô Tả Của Bạn</span>
                  </div>
                  <textarea
                    rows={2}
                    value={newEnvPrompt}
                    onChange={(e) => setNewEnvPrompt(e.target.value)}
                    placeholder="Mô tả bối cảnh muốn tạo (ví dụ: Miếu hoang đổ nát lúc trăng máu có bùa dán lơ lửng và giếng cạn...)"
                    className="w-full bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600 resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreateEnvFromPrompt}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isLoading ? "Đang tạo..." : "✨ AI Tạo Bối Cảnh Này"}</span>
                  </button>
                </div>

                {/* TOOL 2: SAVE CURRENT STUDIO SCENE ENVIRONMENT */}
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <BookmarkPlus className="w-4 h-4 text-cyan-400" />
                    <span>Lưu Bối Cảnh Đang Mở Trong Studio</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Lưu toàn bộ Theme ({currentScene.theme}), Bầu trời ({currentScene.lighting.sky_preset}) và các công trình của Cảnh {currentSceneIndex + 1} thành một mẫu dùng lại.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customEnvSaveName}
                      onChange={(e) => setCustomEnvSaveName(e.target.value)}
                      placeholder="Đặt tên bối cảnh (ví dụ: Bãi Tha Ma Của Tôi)..."
                      className="flex-1 bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-600"
                    />
                    <button
                      type="button"
                      onClick={handleSaveCurrentSceneEnv}
                      className="shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-semibold transition-all shadow"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Lưu Bối Cảnh</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* LIST OF SAVED ENVIRONMENTS */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-neutral-300">
                  Danh Sách Bối Cảnh Chung Đang Có Trong Thư Viện ({namedEnvironments.length}):
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {namedEnvironments.map((env) => (
                    <div
                      key={env.id}
                      className="bg-black/60 border border-neutral-800 hover:border-neutral-700 rounded-xl p-3.5 flex flex-col justify-between gap-3 transition-all"
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-amber-400" />
                            <span>{env.name}</span>
                          </h4>
                          {env.id.startsWith("env_custom_") && (
                            <button
                              onClick={() => handleDeleteEnv(env.id)}
                              className="text-neutral-500 hover:text-red-400 p-1 transition-all"
                              title="Xóa bối cảnh tùy chỉnh này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {env.description && (
                          <p className="text-[11px] text-neutral-400 leading-relaxed m-0">
                            {env.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-300">
                            {env.theme}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-cyan-300">
                            {env.lighting.sky_preset}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                            {env.environment_items.length} công trình
                          </span>
                          {env.details && (
                            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                              {env.details.length} đạo cụ
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyEnvToCurrentScene(env)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold transition-all"
                      >
                        <Compass className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Áp Dụng Cho Cảnh {currentSceneIndex + 1} Hiện Tại</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RE-DIRECT SINGLE SCENE */}
          {mode === "re_direct_scene" && (
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-semibold text-neutral-200">
                    Đang chọn cảnh {currentSceneIndex + 1}:
                  </span>{" "}
                  <span className="text-cyan-300 font-mono">
                    "{currentScene.title || currentScene.scene_id}"
                  </span>
                </div>

                {/* Environment Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">Bối Cảnh Khóa:</span>
                  <select
                    value={singleSceneEnvId}
                    onChange={(e) => setSingleSceneEnvId(e.target.value)}
                    className="bg-black border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-amber-200 font-medium focus:outline-none"
                  >
                    {namedEnvironments.map((env) => (
                      <option key={env.id} value={env.id}>
                        📍 {env.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-200">
                  Mô Tả: Bạn muốn nhân vật làm gì trong cảnh này?
                </label>
                <textarea
                  rows={3}
                  value={singleSceneAction}
                  onChange={(e) => setSingleSceneAction(e.target.value)}
                  placeholder="Ví dụ: Cho bóng ma quấn vải liệm bay từ trên cao xuống rượt đuổi lữ khách, lữ khách cầm đèn bão hoảng loạn tháo chạy..."
                  className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 focus:outline-none focus:border-red-600 resize-none leading-relaxed"
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Cho bóng ma sà xuống từ trên cao rượt đuổi lữ khách",
                  "Lữ khách cầm đèn bão sắt bước đi từ trái sang phải rồi dừng lại",
                  "Cương thi nhảy cứng đờ từ bên phải ra chặn đường",
                  "Pháp sư cầm kiếm gỗ đào và bùa vàng lao tới trấn áp",
                ].map((txt, i) => (
                  <button
                    key={i}
                    onClick={() => setSingleSceneAction(txt)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 transition-all"
                  >
                    + {txt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400">Thời lượng cảnh:</span>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={singleSceneDuration}
                  onChange={(e) => setSingleSceneDuration(parseFloat(e.target.value) || 6)}
                  className="w-16 bg-black border border-neutral-800 rounded-lg px-2 py-1 text-center text-xs text-cyan-300 font-bold focus:outline-none"
                />
                <span className="text-xs text-neutral-400">giây</span>
              </div>

              <button
                onClick={handleGenerateSingleScene}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 to-purple-800 hover:from-red-600 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/60"
              >
                <RotateCcw className="w-4 h-4" />
                <span>
                  {isLoading
                    ? "Gemini Đang Bố Trí Diễn Viên..."
                    : `Tạo Lại Cảnh ${currentSceneIndex + 1} Theo Mô Tả Này`}
                </span>
              </button>
            </div>
          )}

          {/* LOADING ANIMATION */}
          {isLoading && (
            <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-2xl flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
              <p className="text-xs font-medium text-red-200 font-mono tracking-wide text-center">
                {loadingStep || "Đang xử lý phân cảnh..."}
              </p>
            </div>
          )}

          {/* ERROR DISPLAY */}
          {errorMessage && (
            <div className="p-4 bg-red-950/50 border border-red-800 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-white">Chưa thể tạo kịch bản:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* GENERATED RESULTS PREVIEW */}
          {(generatedScenes || generatedSingleScene) && (
            <div className="flex flex-col gap-4 pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">
                    Kết Quả Tạo Phân Cảnh (
                    {(generatedScenes || generatedSingleScene)!.length} phân cảnh hoàn tất)
                  </span>
                </div>

                {generatedScenes && (
                  <button
                    onClick={handleConfirmApplyFilm}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Áp Dụng Toàn Bộ Vào Phim Ngay</span>
                  </button>
                )}

                {generatedSingleScene && (
                  <button
                    onClick={handleConfirmApplySingle}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cập Nhật Vào Cảnh {currentSceneIndex + 1}</span>
                  </button>
                )}
              </div>

              {/* Notice for User */}
              <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Bối cảnh được giữ nguyên 100%:</strong> Các cảnh có cùng tên bối cảnh sẽ có công trình và bầu trời giống nhau hoàn toàn. Bạn có thể sang ngay{" "}
                  <strong className="text-white">Tab 2: "Điều Chỉnh Vị Trí Cảnh"</strong> để kéo thả tinh chỉnh lại thủ công nếu muốn.
                </span>
              </div>

              {/* Scene Cards Preview */}
              <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1">
                {(generatedScenes || generatedSingleScene)!.map((sc, idx) => (
                  <div
                    key={`${sc.scene_id}-${idx}`}
                    className="bg-black/60 border border-neutral-800 rounded-xl p-3.5 flex flex-col gap-2 hover:border-neutral-700 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-red-950 text-red-400 border border-red-800/60 font-mono text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {sc.title || sc.scene_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                          {sc.duration_sec || 6}s
                        </span>
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-amber-300 border border-neutral-800">
                          {sc.theme}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-cyan-300 border border-neutral-800">
                          {sc.lighting.sky_preset}
                        </span>
                      </div>
                    </div>

                    {sc.dialogue && (
                      <p className="text-[11px] text-red-200 italic font-serif bg-neutral-950/80 px-3 py-1.5 rounded border-l-2 border-red-700 m-0">
                        "{sc.dialogue}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
                      <span>Diễn viên ({sc.actors.length}):</span>
                      {sc.actors.map((act) => (
                        <span
                          key={act.id}
                          className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200 font-mono text-[10px]"
                        >
                          {act.id} ({act.base})
                          {act.heldItem && act.heldItem !== "none" ? ` 🗡️ ${act.heldItem.replace("item_", "")}` : ""}
                          {act.motion ? ` ➔ ${act.motion.targetSlot}` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
