import React, { useState, useEffect } from "react";
import type { DirectorSceneScript, NamedEnvironmentPreset } from "../engine/types";
import {
  generateFilmFromDescriptions,
  generateSceneFromDescription,
  generateNamedEnvironmentFromPrompt,
  breakdownStoryToSceneDrafts,
  auditStoryAssets,
  SAMPLE_HORROR_PROMPTS,
  getStoredApiKey,
  setStoredApiKey,
  getStoredModel,
  setStoredModel,
  type SceneDescriptionSpec,
  type AssetAuditResult,
} from "../engine/geminiDirector";
import {
  loadStoredNamedEnvironments,
  resetStoredNamedEnvironments,
  addOrUpdateNamedEnvironment,
  deleteNamedEnvironment,
  applyEnvironmentToScene,
  extractEnvironmentFromScene,
} from "../engine/environmentPresets";
import {
  Sparkles,
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
  Wand2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Search,
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
  dialogue?: string;
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

  // Story Breakdown Assistant state (Auto-fill)
  const [rawStoryInput, setRawStoryInput] = useState<string>("");
  const [lastBreakdownStory, setLastBreakdownStory] = useState<string>("");
  const [targetSceneCount, setTargetSceneCount] = useState<number | "auto">("auto");
  const [isBreakingDown, setIsBreakingDown] = useState<boolean>(false);
  const [breakdownNotice, setBreakdownNotice] = useState<string | null>(null);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState<boolean>(true);

  // Asset Audit state (Kiểm tra tài nguyên theo GEMINI_DIRECTOR_ASSETS.md)
  const [assetAudit, setAssetAudit] = useState<AssetAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

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

  // Auto-breakdown story to auto-fill scene drafts
  const handleAutoBreakdownStory = async () => {
    if (!rawStoryInput.trim()) {
      setErrorMessage("Vui lòng dán nội dung cốt truyện hoặc chọn một cốt truyện mẫu.");
      return;
    }

    setIsBreakingDown(true);
    setErrorMessage(null);
    setBreakdownNotice(null);

    try {
      const result = await breakdownStoryToSceneDrafts(rawStoryInput, namedEnvironments, {
        targetSceneCount,
        apiKey,
        model,
      });

      if (!result.success || !result.drafts || result.drafts.length === 0) {
        setErrorMessage(result.error || "Không thể phân tích cốt truyện.");
      } else {
        const drafts = result.drafts;
        setSceneCount(drafts.length);
        setSceneDrafts(
          drafts.map((d) => ({
            environmentId: d.environmentId,
            title: d.title,
            actionDescription: d.actionDescription,
            dialogue: d.dialogue || "",
            duration_sec: d.duration_sec,
          }))
        );
        setLastBreakdownStory(rawStoryInput.trim());

        setBreakdownNotice(
          `✨ Trợ thủ AI đã tự động điền thành công ${drafts.length} phân cảnh! Toàn bộ bối cảnh dùng lại và mô tả hành động đã được điền sẵn vào các thẻ bên dưới.`
        );
      }
    } catch (err: any) {
      setErrorMessage(`Lỗi phân tích cốt truyện: ${err.message}`);
    } finally {
      setIsBreakingDown(false);
    }
  };

  // Re-check story assets against GEMINI_DIRECTOR_ASSETS.md
  const handleRecheckAssets = async () => {
    const textToCheck = rawStoryInput.trim() || sceneDrafts.map((d) => d.actionDescription).join(". ");
    if (!textToCheck) {
      setErrorMessage("Vui lòng nhập cốt truyện hoặc mô tả phân cảnh để kiểm tra tài nguyên asset.");
      return;
    }

    setIsAuditing(true);
    setErrorMessage(null);

    try {
      const result = await auditStoryAssets(textToCheck, {
        apiKey,
        model,
      });

      if (!result.success) {
        setErrorMessage(result.error || "Không thể kiểm tra tài nguyên asset.");
      } else {
        setAssetAudit(result);
      }
    } catch (err: any) {
      setErrorMessage(`Lỗi kiểm tra tài nguyên: ${err.message}`);
    } finally {
      setIsAuditing(false);
    }
  };

  // Acknowledge missing assets and proceed with available fallbacks
  const handleAcknowledgeAndProceed = () => {
    if (assetAudit) {
      setAssetAudit({
        ...assetAudit,
        isSufficient: true,
        summary: "Đã xác nhận sử dụng asset thay thế có sẵn.",
      });
    }
  };

  // Reset assistant state to start a clean new film
  const handleResetAssistant = () => {
    const confirmReset = window.confirm(
      "Bạn có chắc muốn làm mới toàn bộ trợ thủ AI để viết phim mới?\n\n- Toàn bộ cốt truyện và các phân cảnh đã điền sẽ được xóa sạch.\n- Thư viện bối cảnh sẽ được khôi phục về danh sách chuẩn mặc định (bao gồm phòng tắm, xe bus, bệnh viện...)."
    );
    if (!confirmReset) return;

    const freshEnvs = resetStoredNamedEnvironments();
    setNamedEnvironments(freshEnvs);
    setRawStoryInput("");
    setLastBreakdownStory("");
    setBreakdownNotice(null);
    setAssetAudit(null);
    setErrorMessage(null);
    setGeneratedScenes(null);
    setSceneCount(3);
    const env1 = freshEnvs[0]?.id || "env_graveyard_foggy";
    setSceneDrafts([
      {
        environmentId: env1,
        title: "Cảnh 1: Khởi Đầu",
        actionDescription: "",
        dialogue: "",
        duration_sec: 6,
      },
    ]);
  };

  // Generate Film from Description Specs
  const handleGenerateFilmFromDescriptions = async () => {
    let currentDrafts = sceneDrafts;

    // AUTO-SYNC CHECK: If user entered/changed rawStoryInput without clicking Step 2:
    // Auto-run breakdown FIRST so user's new story is never bypassed or stuck on old scenes!
    if (rawStoryInput.trim() && rawStoryInput.trim() !== lastBreakdownStory) {
      setIsLoading(true);
      setErrorMessage(null);
      setLoadingStep("1/4: Đang tự động phân tích cốt truyện mới của bạn và bóc tách các phân cảnh...");

      try {
        const result = await breakdownStoryToSceneDrafts(rawStoryInput, namedEnvironments, {
          targetSceneCount,
          apiKey,
          model,
        });

        if (!result.success || !result.drafts || result.drafts.length === 0) {
          setErrorMessage(result.error || "Không thể phân tích cốt truyện mới.");
          setIsLoading(false);
          return;
        }

        const drafts = result.drafts;
        setSceneCount(drafts.length);
        const mappedDrafts = drafts.map((d) => ({
          environmentId: d.environmentId,
          title: d.title,
          actionDescription: d.actionDescription,
          dialogue: d.dialogue || "",
          duration_sec: d.duration_sec,
        }));
        setSceneDrafts(mappedDrafts);
        setLastBreakdownStory(rawStoryInput.trim());
        setBreakdownNotice(`✨ Trợ thủ AI đã tự động điền thành công ${drafts.length} phân cảnh từ cốt truyện mới!`);
        currentDrafts = mappedDrafts;
      } catch (err: any) {
        setErrorMessage(`Lỗi phân tích cốt truyện: ${err.message}`);
        setIsLoading(false);
        return;
      }
    }

    const hasAny = currentDrafts.some((d) => d.actionDescription.trim().length > 0);
    if (!hasAny) {
      setErrorMessage("Vui lòng nhập mô tả hành động nhân vật cho ít nhất một phân cảnh.");
      setIsLoading(false);
      return;
    }

    const envMap = new Map(namedEnvironments.map((e) => [e.id, e]));
    const fallbackEnv = namedEnvironments[0];

    const specs: SceneDescriptionSpec[] = currentDrafts.map((draft) => {
      const env = envMap.get(draft.environmentId) || fallbackEnv;
      return {
        environment: env,
        actionDescription: draft.actionDescription.trim() || "Nhân vật bước đi cẩn trọng trong màn sương mù.",
        duration_sec: draft.duration_sec || 6,
        title: draft.title || undefined,
        dialogue: draft.dialogue || undefined,
      };
    });

    setIsLoading(true);
    setErrorMessage(null);
    setGeneratedScenes(null);
    setLoadingStep("2/4: Đang kết nối tới trí tuệ nhân tạo Gemini...");

    const stepTimer1 = setTimeout(() => {
      setLoadingStep("3/4: Đang khóa cố định bối cảnh và biên dịch hành động nhân vật sang SVG JSX...");
    }, 1500);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep("4/4: Đang tính toán socket cán cầm và quỹ đạo chuyển động A → B...");
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
                  CỖ MÁY TẠO VIDEO 2D THEO CỐT TRUYỆN & MÔ TẢ
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                  AI STORY ASSISTANT & 2D ENGINE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Trợ thủ AI tự động bóc tách cốt truyện, khóa bối cảnh dùng lại chống lệch cảnh và điền sẵn kịch bản
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
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>1. Trợ Thủ Cốt Truyện & Tạo Phim ({sceneCount} Cảnh)</span>
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

          {/* TAB 1: DESCRIPTION-DRIVEN MULTI-SCENE GENERATOR WITH AI STORY ASSISTANT */}
          {mode === "description_film" && (
            <div className="flex flex-col gap-4">
              {/* AI STORY BREAKDOWN ASSISTANT (NHẬP CỐT TRUYỆN THÔ -> TỰ ĐỘNG ĐIỀN CẢNH) */}
              <div className="bg-gradient-to-b from-purple-950/40 via-neutral-950 to-neutral-950 border border-purple-800/50 rounded-2xl p-4 flex flex-col gap-3 shadow-xl shadow-purple-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 via-purple-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-purple-950/50 border border-amber-400/30">
                      <Wand2 className="w-4 h-4 text-amber-100" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-white tracking-wide uppercase m-0">
                          Trợ Thủ Biên Kịch: Nhập Cốt Truyện Thô
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                          AI Tự Động Điền & Khóa Bối Cảnh
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 m-0">
                        Dán một câu chuyện bất kỳ, LLM sẽ tự động bóc tách các cảnh, chọn bối cảnh dùng lại và điền sẵn mọi trường. Bạn không cần suy nghĩ hay dán thủ công!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetAssistant}
                      className="text-neutral-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-red-950/80 border border-neutral-700/80 hover:border-red-700/80 transition-all text-xs flex items-center gap-1.5 font-semibold shadow"
                      title="Xóa trắng cốt truyện cũ và các phân cảnh đã điền để bắt đầu viết phim mới hoàn toàn"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Làm Phim Mới</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAssistantExpanded(!isAssistantExpanded)}
                      className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-all text-xs flex items-center gap-1 font-mono"
                    >
                      <span>{isAssistantExpanded ? "Thu gọn" : "Mở rộng"}</span>
                      {isAssistantExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {isAssistantExpanded && (
                  <div className="flex flex-col gap-3 pt-1 border-t border-purple-900/30">
                    {/* Quick Inspirations Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-neutral-400 font-semibold mr-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Cốt truyện mẫu:
                      </span>
                      {SAMPLE_HORROR_PROMPTS.slice(0, 5).map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setRawStoryInput(preset.prompt);
                            setTargetSceneCount(preset.suggestedScenes);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-800/60 hover:border-amber-400/50 text-[11px] text-purple-200 hover:text-white transition-all font-medium"
                        >
                          {preset.title}
                        </button>
                      ))}
                    </div>

                    {/* Raw Story Input Textarea */}
                    <div className="flex flex-col gap-1.5">
                      <textarea
                        rows={3}
                        value={rawStoryInput}
                        onChange={(e) => setRawStoryInput(e.target.value)}
                        placeholder="Dán câu chuyện, ý tưởng kịch bản hoặc truyền thuyết kinh dị của bạn vào đây (ví dụ: Một lữ khách đi qua bãi tha ma sương mù đêm ba mươi...)"
                        className="w-full bg-black/80 border border-neutral-700/80 rounded-xl p-3 text-xs text-neutral-200 focus:outline-none focus:border-purple-500 resize-none leading-relaxed shadow-inner"
                      />
                    </div>

                    {/* 3-Step Pipeline Flow Banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 text-xs">
                      <div
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          assetAudit?.isSufficient
                            ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-300"
                            : assetAudit && !assetAudit.isSufficient
                            ? "bg-amber-950/40 border-amber-700/60 text-amber-300"
                            : "bg-neutral-900/60 border-neutral-800 text-neutral-300"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-neutral-800 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          1
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold">Bước 1: Rà Soát Asset</span>
                          <span className="text-[10px] text-neutral-400 font-normal">
                            {assetAudit
                              ? assetAudit.isSufficient
                                ? "Đủ 100% asset"
                                : `Thiếu ${assetAudit.missingAssets.length} asset`
                              : "Kiểm tra xem đủ chưa"}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          breakdownNotice
                            ? "bg-purple-950/40 border-purple-700/60 text-purple-300"
                            : "bg-neutral-900/60 border-neutral-800 text-neutral-300"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-neutral-800 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          2
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold">Bước 2: Tạo Phân Cảnh</span>
                          <span className="text-[10px] text-neutral-400 font-normal">
                            {breakdownNotice ? `Đã điền ${sceneCount} cảnh` : "Bóc tách & điền dữ liệu"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-xl border border-neutral-800 bg-neutral-900/60 text-neutral-300">
                        <span className="w-5 h-5 rounded-full bg-neutral-800 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          3
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold">Bước 3: Tạo Phim</span>
                          <span className="text-[10px] text-neutral-400 font-normal">
                            Biên dịch hoạt hình 2D
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Controls Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-neutral-300">
                          Số cảnh mong muốn:
                        </span>
                        <div className="flex items-center gap-1">
                          {(["auto", 2, 3, 4, 5] as const).map((cnt) => (
                            <button
                              key={String(cnt)}
                              type="button"
                              onClick={() => setTargetSceneCount(cnt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                                targetSceneCount === cnt
                                  ? "bg-purple-700 text-white shadow ring-1 ring-purple-400"
                                  : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
                              }`}
                            >
                              {cnt === "auto" ? "Tự động" : `${cnt} cảnh`}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* BUTTON 1: AUDIT ASSET */}
                        <button
                          type="button"
                          onClick={handleRecheckAssets}
                          disabled={isAuditing || !rawStoryInput.trim()}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-neutral-200 hover:text-white text-xs font-bold transition-all shadow"
                          title="Kiểm tra xem kịch bản có thiếu asset nào trong GEMINI_DIRECTOR_ASSETS.md không"
                        >
                          {isAuditing ? (
                            <>
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                              <span>Đang Rà Soát Asset...</span>
                            </>
                          ) : (
                            <>
                              <Search className="w-3.5 h-3.5 text-amber-400" />
                              <span>🔍 Bước 1: Kiểm Tra Asset</span>
                            </>
                          )}
                        </button>

                        {/* BUTTON 2: BREAKDOWN SCENES & AUTO-FILL */}
                        <button
                          type="button"
                          onClick={handleAutoBreakdownStory}
                          disabled={isBreakingDown || !rawStoryInput.trim()}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-purple-600 to-red-600 hover:from-amber-500 hover:via-purple-500 hover:to-red-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-purple-950/60 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                          title="Bóc tách kịch bản thành các phân cảnh, khóa bối cảnh dùng lại và tự động điền các trường"
                        >
                          {isBreakingDown ? (
                            <>
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                              <span>AI Đang Điền Phân Cảnh...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 text-amber-200" />
                              <span>✨ Bước 2: Tạo Phân Cảnh (Điền Thông Tin)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Feedback Notice after Breakdown */}
                    {breakdownNotice && (
                      <div className="p-2.5 bg-emerald-950/70 border border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-200 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{breakdownNotice}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ASSET AUDIT & WARNING PANEL (DỰA VÀO GEMINI_DIRECTOR_ASSETS.MD) */}
              {assetAudit && (
                <div
                  className={`rounded-2xl p-4 flex flex-col gap-3.5 border transition-all animate-in fade-in ${
                    !assetAudit.isSufficient && assetAudit.missingAssets.length > 0
                      ? "bg-amber-950/30 border-amber-600/60 shadow-lg shadow-amber-950/40"
                      : "bg-emerald-950/30 border-emerald-600/60 shadow-lg shadow-emerald-950/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {!assetAudit.isSufficient && assetAudit.missingAssets.length > 0 ? (
                        <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white tracking-wide uppercase m-0 flex items-center gap-1.5">
                            {!assetAudit.isSufficient && assetAudit.missingAssets.length > 0 ? (
                              <>
                                <span className="text-amber-300">Cảnh Báo: Thiếu {assetAudit.missingAssets.length} Asset Trong Code</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                                  GEMINI_DIRECTOR_ASSETS.md
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-emerald-300">AI Xác Nhận: Đủ Asset 100% (Sẵn Sàng Làm Phim)</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                  ĐÃ KIỂM TRA HỢP LỆ
                                </span>
                              </>
                            )}
                          </h4>
                        </div>
                        <p className="text-[11px] text-neutral-300 m-0">
                          {assetAudit.summary}
                        </p>
                      </div>
                    </div>

                    {/* Re-check Button */}
                    <button
                      type="button"
                      onClick={handleRecheckAssets}
                      disabled={isAuditing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:text-white transition-all shadow"
                      title="Kiểm tra lại toàn bộ cốt truyện và các phân cảnh so với tài liệu GEMINI_DIRECTOR_ASSETS.md"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isAuditing ? "animate-spin" : ""}`} />
                      <span>{isAuditing ? "Đang kiểm tra lại..." : "🔄 Kiểm Tra Lại Asset"}</span>
                    </button>
                  </div>

                  {/* MISSING ASSETS DETAILS TABLE / CARDS */}
                  {!assetAudit.isSufficient && assetAudit.missingAssets.length > 0 && (
                    <div className="flex flex-col gap-2.5 pt-2 border-t border-amber-900/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {assetAudit.missingAssets.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-black/70 border border-amber-800/60 rounded-xl p-3 flex flex-col gap-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-200">
                                {item.name}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                                {item.categoryLabel}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-300">
                              <span className="text-neutral-400">ID đề xuất thêm:</span>{" "}
                              <code className="text-cyan-300 font-mono text-[10px] px-1 py-0.5 bg-neutral-950 rounded border border-neutral-800">
                                {item.suggestedId}
                              </code>
                            </div>
                            <p className="text-[11px] text-neutral-400 m-0 leading-relaxed">
                              <strong className="text-neutral-300">Lý do:</strong> {item.reason}
                            </p>
                            {item.replacementAvailable && (
                              <div className="text-[10px] text-neutral-400 bg-neutral-950/80 px-2 py-1 rounded border border-neutral-800/80">
                                <span className="text-amber-400 font-semibold">Tạm thay bằng:</span> {item.replacementAvailable}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 7-Step Guide Note */}
                      <div className="p-2.5 bg-neutral-950/90 border border-neutral-800 rounded-xl flex items-start justify-between gap-3 text-xs">
                        <div className="text-neutral-300 text-[11px] leading-relaxed">
                          <span className="font-bold text-amber-300">Quy trình thêm asset vào code (theo GEMINI.md):</span> Cập nhật đồng thời vào 7 tệp: <code className="text-neutral-200">GEMINI_DIRECTOR_ASSETS.md</code>, <code className="text-neutral-200">types.ts</code>, <code className="text-neutral-200">graphics/</code>, <code className="text-neutral-200">placementRules.ts</code>, <code className="text-neutral-200">layoutRouter.ts</code>, <code className="text-neutral-200">EditorView.tsx</code>, <code className="text-neutral-200">asset_manifest.json</code>.
                        </div>
                        <button
                          type="button"
                          onClick={handleAcknowledgeAndProceed}
                          className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800 border border-amber-700/60 text-[11px] font-semibold text-amber-200 transition-all"
                          title="Nếu chưa kịp thêm code, bạn có thể bấm vào đây để chấp nhận dùng asset thay thế tạm thời"
                        >
                          Chấp Nhận Dùng Tạm Asset Thay Thế
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION HEADER: SCENE CARDS */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950/70 p-3 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">
                    Danh Sách Phân Cảnh ({sceneCount} Cảnh):
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
                  <span>Các cảnh chung bối cảnh sẽ có khung cảnh 100% y hệt nhau, không bị lệch.</span>
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

                      {/* Dialogue / Subtitle */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-neutral-400">
                          Phụ đề / Lời thoại nhân vật trong cảnh:
                        </label>
                        <input
                          type="text"
                          value={draft.dialogue || ""}
                          onChange={(e) => handleUpdateDraft(idx, "dialogue", e.target.value)}
                          placeholder="Ví dụ: Đêm ba mươi sao lạnh thấu xương... có tiếng ai gọi tên mình?"
                          className="w-full bg-neutral-950 border border-neutral-800/80 rounded-lg px-2.5 py-1 text-xs text-red-200 italic font-serif focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button: Chạy Tạo Phim */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    if (assetAudit && !assetAudit.isSufficient && assetAudit.missingAssets.length > 0) {
                      if (
                        !window.confirm(
                          `Phát hiện ${assetAudit.missingAssets.length} asset trong cốt truyện chưa có trong GEMINI_DIRECTOR_ASSETS.md.\n\nBạn có muốn tiếp tục tạo phim bằng các asset thay thế tạm thời không?`
                        )
                      ) {
                        return;
                      }
                    }
                    handleGenerateFilmFromDescriptions();
                  }}
                  disabled={isLoading || isBreakingDown || isAuditing}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-700 via-amber-700 to-purple-800 hover:from-red-600 hover:via-amber-600 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-950/80 ring-1 ring-amber-400/30 transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>
                    {isLoading
                      ? "Gemini Đang Biên Dịch Kịch Bản Sang Hoạt Hình 2D..."
                      : `🎬 BƯỚC 3: CHẠY TẠO PHIM NGAY (Tạo ${sceneCount} Phân Cảnh)`}
                  </span>
                </button>
                <p className="text-[11px] text-neutral-400 text-center m-0">
                  Sau khi kiểm tra asset và điền xong các phân cảnh, bạn nhấn nút này thì Engine mới bắt đầu biên dịch sang hoạt hình và mở Player.
                </p>
              </div>
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
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">
                    Danh Sách Bối Cảnh Chung Đang Có Trong Thư Viện ({namedEnvironments.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Khôi phục toàn bộ thư viện bối cảnh về danh sách mặc định gốc của Limbo Engine (bao gồm Phòng tắm, Xe bus, Bệnh viện, v.v.)?")) {
                        const fresh = resetStoredNamedEnvironments();
                        setNamedEnvironments(fresh);
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 border border-neutral-700 text-[11px] transition-all font-medium"
                    title="Khôi phục lại danh sách bối cảnh mặc định chuẩn của Engine"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Khôi phục bối cảnh mặc định</span>
                  </button>
                </div>

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
