import React, { useState } from "react";
import type {
  DirectorSceneScript,
  SlotId,
  GroundSlotId,
  CharacterBaseId,
  CostumeId,
  CharacterFaceId,
  CharacterPoseId,
  StructureId,
  ThemeId,
  SkyPresetId,
  ActorConfig,
  EnvironmentItemConfig,
} from "../engine/types";
import { SceneRenderer } from "../engine/SceneRenderer";
import { GROUND_SLOTS } from "../engine/constants";
import { getDefaultCostumeForBase } from "../engine/layoutRouter";
import {
  Sliders,
  User,
  Trees,
  CloudMoon,
  Plus,
  Trash2,
  RotateCcw,
  Eye,
  Type,
} from "lucide-react";

interface EditorViewProps {
  scene: DirectorSceneScript;
  onChangeScene: (updated: DirectorSceneScript) => void;
  onResetScene: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  scene,
  onChangeScene,
  onResetScene,
}) => {
  const [activeTab, setActiveTab] = useState<"actors" | "structures" | "lighting" | "story">("actors");
  const [selectedActorId, setSelectedActorId] = useState<string | null>(
    scene.actors.length > 0 ? scene.actors[0].id : null
  );
  const [selectedStructureIdx, setSelectedStructureIdx] = useState<number>(0);
  const [showGizmo, setShowGizmo] = useState<boolean>(true);

  // Update Actor helper
  const updateActor = (actorId: string, updates: Partial<ActorConfig>) => {
    const updatedActors = scene.actors.map((ac) => {
      if (ac.id === actorId) {
        return { ...ac, ...updates };
      }
      return ac;
    });
    onChangeScene({ ...scene, actors: updatedActors });
  };

  // Add Actor helper
  const addActor = () => {
    const newId = `actor_${Date.now().toString().slice(-4)}`;
    const newActor: ActorConfig = {
      id: newId,
      base: "male_adult",
      costume: "outfit_tattered_tunic",
      face: "face_scared",
      pose: "pose_standing",
      facing: "right",
      slot: "center",
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    };
    onChangeScene({ ...scene, actors: [...scene.actors, newActor] });
    setSelectedActorId(newId);
  };

  // Remove Actor helper
  const removeActor = (actorId: string) => {
    const remaining = scene.actors.filter((a) => a.id !== actorId);
    onChangeScene({ ...scene, actors: remaining });
    if (selectedActorId === actorId) {
      setSelectedActorId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Update Structure helper
  const updateStructure = (idx: number, updates: Partial<EnvironmentItemConfig>) => {
    const updated = scene.environment_items.map((item, i) => {
      if (i === idx) {
        return { ...item, ...updates };
      }
      return item;
    });
    onChangeScene({ ...scene, environment_items: updated });
  };

  // Add Structure helper
  const addStructure = () => {
    const newStruct: EnvironmentItemConfig = {
      asset_id: "creepy_banyan_tree",
      slot: "far_right",
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    };
    onChangeScene({
      ...scene,
      environment_items: [...scene.environment_items, newStruct],
    });
    setSelectedStructureIdx(scene.environment_items.length);
  };

  // Remove Structure helper
  const removeStructure = (idx: number) => {
    const remaining = scene.environment_items.filter((_, i) => i !== idx);
    onChangeScene({ ...scene, environment_items: remaining });
    if (selectedStructureIdx >= remaining.length) {
      setSelectedStructureIdx(Math.max(0, remaining.length - 1));
    }
  };

  const selectedActor = scene.actors.find((a) => a.id === selectedActorId);
  const selectedStructure = scene.environment_items[selectedStructureIdx];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/60 border border-neutral-800/80 px-5 py-3 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-red-500" />
          <h2 className="font-semibold text-neutral-100">Phòng Điều Khiển Cảnh & Neo Vị Trí (Layout Studio)</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGizmo(!showGizmo)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showGizmo
                ? "bg-emerald-800/80 text-emerald-200 border border-emerald-600/50"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showGizmo ? "Ẩn Lưới Neo & Socket" : "Hiện Lưới Neo & Socket"}</span>
          </button>

          <button
            onClick={onResetScene}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all border border-neutral-700"
            title="Khôi phục cảnh về ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Mặc Định</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Quick Tip */}
      <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/50 px-4 py-2.5 rounded-xl text-xs text-red-200">
        <span className="text-base">🖱️</span>
        <span className="font-medium">
          <strong>Kéo Thả Trực Quan (Interactive Drag & Drop):</strong> Giữ chuột trái vào nhân vật hoặc công trình bất kỳ trên khung hình để kéo thả vị trí. Vật thể sẽ tự động <strong>hút nam châm (Magnetic Snap)</strong> vào các điểm neo (Slot) hoặc trục mặt đất Y = 800px!
        </span>
      </div>

      {/* Main Visual Canvas Viewport */}
      <div className="w-full rounded-2xl overflow-hidden border border-neutral-800/80 shadow-2xl bg-black">
        <SceneRenderer
          script={scene}
          showGizmo={showGizmo}
          showSubtitles={true}
          activeActorId={selectedActorId}
          interactiveDrag={true}
          onSelectActor={(id) => {
            setSelectedActorId(id);
            setActiveTab("actors");
          }}
          onSelectSlot={(slotId) => {
            if (activeTab === "actors" && selectedActorId) {
              updateActor(selectedActorId, { slot: slotId });
            } else if (activeTab === "structures" && selectedStructure) {
              if (slotId in GROUND_SLOTS) {
                updateStructure(selectedStructureIdx, { slot: slotId as GroundSlotId });
              }
            }
          }}
          onUpdateActorPosition={(actorId, slot, offsetX, offsetY) => {
            updateActor(actorId, { slot, offsetX, offsetY });
            setSelectedActorId(actorId);
            setActiveTab("actors");
          }}
          onUpdateStructurePosition={(idx, slot, offsetX, offsetY) => {
            updateStructure(idx, { slot, offsetX, offsetY });
            setSelectedStructureIdx(idx);
            setActiveTab("structures");
          }}
        />
      </div>

      {/* Interactive Controls Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 bg-neutral-900/70 border border-neutral-800/80 p-3 rounded-2xl">
          <button
            onClick={() => setActiveTab("actors")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === "actors"
                ? "bg-red-800/80 text-white font-semibold shadow-lg shadow-red-950/40"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            <User className="w-4 h-4 text-red-400" />
            <span>Nhân Vật & Socket ({scene.actors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("structures")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === "structures"
                ? "bg-red-800/80 text-white font-semibold shadow-lg shadow-red-950/40"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            <Trees className="w-4 h-4 text-emerald-400" />
            <span>Công Trình & Bối Cảnh ({scene.environment_items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("lighting")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === "lighting"
                ? "bg-red-800/80 text-white font-semibold shadow-lg shadow-red-950/40"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            <CloudMoon className="w-4 h-4 text-blue-400" />
            <span>Bầu Trời, Sương Mù & Ánh Sáng</span>
          </button>

          <button
            onClick={() => setActiveTab("story")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === "story"
                ? "bg-red-800/80 text-white font-semibold shadow-lg shadow-red-950/40"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            <Type className="w-4 h-4 text-amber-400" />
            <span>Lời Thoại & Kịch Bản Cảnh</span>
          </button>
        </div>

        {/* Right Tab Content Panel (9 cols) */}
        <div className="lg:col-span-9 bg-neutral-900/70 border border-neutral-800/80 p-5 rounded-2xl flex flex-col gap-5">
          {/* TAB 1: ACTORS & CHARACTER RIG */}
          {activeTab === "actors" && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-neutral-400 font-medium">Chọn nhân vật:</span>
                  {scene.actors.map((actor) => (
                    <button
                      key={actor.id}
                      onClick={() => setSelectedActorId(actor.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        selectedActorId === actor.id
                          ? "bg-red-700 text-white font-bold shadow-md shadow-red-950/50"
                          : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      }`}
                    >
                      {actor.id} ({actor.base.split("_")[0]})
                    </button>
                  ))}
                </div>

                <button
                  onClick={addActor}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-emerald-300 border border-neutral-700 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Nhân Vật</span>
                </button>
              </div>

              {selectedActor ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-4">
                    {/* Character Base */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        1. Khung Thân Thể (Base Mesh):
                      </label>
                      <select
                        value={selectedActor.base}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            base: e.target.value as CharacterBaseId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="male_adult">Nam thanh niên (male_adult - dáng gầy, bước đi)</option>
                        <option value="female_adult">Nữ thanh niên (female_adult - tà áo dài/váy buông)</option>
                        <option value="ghost_wraith">Bóng ma bay lượn (ghost_wraith - không chân, tà áo rách)</option>
                        <option value="creepy_child">Đứa trẻ ma (creepy_child - nhỏ bé, ôm búp bê rách)</option>
                        <option value="jiangshi_corpse">Cương thi áo quan (jiangshi_corpse - bùa trán, tay duỗi thẳng)</option>
                        <option value="demon_shadow">Quỷ bóng đen dị hình (demon_shadow - sừng cong, móng vuốt)</option>
                      </select>
                    </div>

                    {/* Costume / Outfit Selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                        <span>2. Bộ Sưu Tập Trang Phục (Costume):</span>
                        <span className="font-mono text-emerald-400 text-[11px]">
                          {selectedActor.costume || getDefaultCostumeForBase(selectedActor.base).split("_")[1]}
                        </span>
                      </label>
                      <select
                        value={selectedActor.costume || getDefaultCostumeForBase(selectedActor.base)}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            costume: e.target.value as CostumeId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="outfit_tattered_tunic">Áo tơi / Áo nông phu sờn rách (outfit_tattered_tunic)</option>
                        <option value="outfit_flowing_ao_dai">Áo dài cổ truyền tà rách ma mị (outfit_flowing_ao_dai)</option>
                        <option value="outfit_shrouded_cloak">Áo choàng trùm đầu tăm tối Reaper (outfit_shrouded_cloak)</option>
                        <option value="outfit_mandarin_court">Quan phục triều đình / Bổ tử phong kiến (outfit_mandarin_court)</option>
                        <option value="outfit_monk_cassock">Áo cà sa pháp sư / Đạo bào trừ tà (outfit_monk_cassock)</option>
                        <option value="outfit_shredded_burial">Vải liệm oan hồn / Áo niệm tử thi (outfit_shredded_burial)</option>
                        <option value="outfit_ancient_armor">Giáp tướng cổ vỡ nát / Chiến bào tử sĩ (outfit_ancient_armor)</option>
                        <option value="outfit_child_pajamas">Yếm hoa / Đồ trẻ thơ vương vết ố (outfit_child_pajamas)</option>
                      </select>
                    </div>

                    {/* Face */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        3. Biểu Cảm Khuôn Mặt (Head Socket -250px):
                      </label>
                      <select
                        value={selectedActor.face}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            face: e.target.value as CharacterFaceId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="face_calm">Mặt bình thường (face_calm - mắt đen nhỏ vô hồn)</option>
                        <option value="face_scared">Kinh hãi (face_scared - mắt trắng dã, miệng há hốc run rẩy)</option>
                        <option value="face_creepy_smile">Nụ cười ma quái (face_creepy_smile - xé dài tới mang tai)</option>
                        <option value="face_bleeding_eyes">Mắt chảy máu (face_bleeding_eyes - hai vệt máu đen rỉ xuống)</option>
                        <option value="face_faceless">Mặt trắng trơn vô diện (face_faceless - không ngũ quan)</option>
                        <option value="face_glowing_hollow">Hốc mắt miệng rực lửa ma trơi (face_glowing_hollow)</option>
                        <option value="face_talisman_covered">Dán bùa vàng chu sa che trán (face_talisman_covered)</option>
                      </select>
                    </div>

                    {/* Pose */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        4. Tư Thế & Động Tác (Pose):
                      </label>
                      <select
                        value={selectedActor.pose}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            pose: e.target.value as CharacterPoseId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="pose_standing">Đứng quan sát (pose_standing)</option>
                        <option value="pose_shivering">Run rẩy co ro (pose_shivering)</option>
                        <option value="pose_walking">Bước đi chậm rãi (pose_walking)</option>
                        <option value="pose_floating">Bay lơ lửng dập dềnh (pose_floating)</option>
                        <option value="pose_crawling">Bò trườn sát đất (pose_crawling)</option>
                        <option value="pose_reaching">Vươn tay bắt hồn (pose_reaching)</option>
                        <option value="pose_hanging">Bị treo lơ lửng rũ đầu (pose_hanging)</option>
                      </select>
                    </div>

                    {/* Facing Direction */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-neutral-300">
                        5. Hướng Nhìn (Facing):
                      </span>
                      <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-neutral-800">
                        <button
                          onClick={() => updateActor(selectedActor.id, { facing: "left" })}
                          className={`px-3 py-1 rounded text-xs transition-all ${
                            selectedActor.facing === "left"
                              ? "bg-red-700 text-white font-bold"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Sang Trái
                        </button>
                        <button
                          onClick={() => updateActor(selectedActor.id, { facing: "right" })}
                          className={`px-3 py-1 rounded text-xs transition-all ${
                            selectedActor.facing === "right"
                              ? "bg-red-700 text-white font-bold"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Sang Phải
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Slot Selection & Fine-tuning Sliders */}
                  <div className="flex flex-col gap-4 bg-black/40 border border-neutral-800/80 p-4 rounded-xl">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                        <span>Vị Trí Neo (Layout Slot):</span>
                        <span className="font-mono text-red-400 text-[11px]">{selectedActor.slot}</span>
                      </label>
                      <select
                        value={selectedActor.slot}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            slot: e.target.value as SlotId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <optgroup label="Mặt Đất (Ground Y=800px)">
                          <option value="far_left">far_left (X=250, Y=800)</option>
                          <option value="mid_left">mid_left (X=600, Y=800)</option>
                          <option value="center">center (X=960, Y=800)</option>
                          <option value="mid_right">mid_right (X=1320, Y=800)</option>
                          <option value="far_right">far_right (X=1670, Y=800)</option>
                        </optgroup>
                        <optgroup label="Trên Không (Air Slots)">
                          <option value="air_left">air_left (X=400, Y=350)</option>
                          <option value="air_center">air_center (X=960, Y=280)</option>
                          <option value="air_right">air_right (X=1520, Y=350)</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Tinh chỉnh X (Offset):</span>
                        <span className="font-mono text-emerald-400">{selectedActor.offsetX || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-300"
                        max="300"
                        step="5"
                        value={selectedActor.offsetX || 0}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            offsetX: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full accent-red-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Tinh chỉnh Y (Offset):</span>
                        <span className="font-mono text-emerald-400">{selectedActor.offsetY || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        step="5"
                        value={selectedActor.offsetY || 0}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            offsetY: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full accent-red-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Kích thước (Scale):</span>
                        <span className="font-mono text-amber-400">{(selectedActor.scale || 1).toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.05"
                        value={selectedActor.scale || 1}
                        onChange={(e) =>
                          updateActor(selectedActor.id, {
                            scale: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-red-600"
                      />
                    </div>

                    <button
                      onClick={() => removeActor(selectedActor.id)}
                      className="mt-2 py-2 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-red-800/60 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa nhân vật này</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-neutral-500">
                  Chưa có nhân vật nào. Bấm "Thêm Nhân Vật" để tạo mới.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STRUCTURES */}
          {activeTab === "structures" && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-neutral-400 font-medium">Chọn công trình:</span>
                  {scene.environment_items.map((item, idx) => (
                    <button
                      key={`struct-btn-${idx}`}
                      onClick={() => setSelectedStructureIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        selectedStructureIdx === idx
                          ? "bg-emerald-800 text-white font-bold shadow-md shadow-emerald-950/50"
                          : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      }`}
                    >
                      #{idx + 1} {item.asset_id.split("_")[0]} ({item.slot})
                    </button>
                  ))}
                </div>

                <button
                  onClick={addStructure}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-emerald-300 border border-neutral-700 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Công Trình</span>
                </button>
              </div>

              {selectedStructure ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Loại Công Trình (Structure Asset):
                      </label>
                      <select
                        value={selectedStructure.asset_id}
                        onChange={(e) =>
                          updateStructure(selectedStructureIdx, {
                            asset_id: e.target.value as StructureId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="creepy_banyan_tree">Cây đa cổ thụ cành trơ trụi (creepy_banyan_tree)</option>
                        <option value="ancient_tomb">Ngôi mộ cổ nứt nẻ và bia đá (ancient_tomb)</option>
                        <option value="dilapidated_hut">Căn lều tranh xiêu vẹo (dilapidated_hut)</option>
                        <option value="abandoned_shrine">Miếu hoang cô hồn cổ kính (abandoned_shrine)</option>
                        <option value="broken_wooden_bridge">Cầu khỉ gãy nhịp qua đầm lầy (broken_wooden_bridge)</option>
                        <option value="scarecrow_of_the_damned">Bù nhìn rơm bị quỷ ám (scarecrow_of_the_damned)</option>
                        <option value="creepy_well">Giếng cạn oan hồn (creepy_well)</option>
                        <option value="haunted_gallows_tree">Cây treo cổ rủ cành liễu (haunted_gallows_tree)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Vị Trí Neo Tiếp Đất (Y=800px):
                      </label>
                      <select
                        value={selectedStructure.slot}
                        onChange={(e) =>
                          updateStructure(selectedStructureIdx, {
                            slot: e.target.value as GroundSlotId,
                          })
                        }
                        className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                      >
                        <option value="far_left">Cạnh trái (far_left - X=250)</option>
                        <option value="mid_left">Nửa trái (mid_left - X=600)</option>
                        <option value="center">Chính giữa (center - X=960)</option>
                        <option value="mid_right">Nửa phải (mid_right - X=1320)</option>
                        <option value="far_right">Cạnh phải (far_right - X=1670)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 bg-black/40 border border-neutral-800/80 p-4 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Tinh chỉnh X:</span>
                        <span className="font-mono text-emerald-400">{selectedStructure.offsetX || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        step="5"
                        value={selectedStructure.offsetX || 0}
                        onChange={(e) =>
                          updateStructure(selectedStructureIdx, {
                            offsetX: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full accent-red-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span>Kích thước (Scale):</span>
                        <span className="font-mono text-amber-400">{(selectedStructure.scale || 1).toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.05"
                        value={selectedStructure.scale || 1}
                        onChange={(e) =>
                          updateStructure(selectedStructureIdx, {
                            scale: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-red-600"
                      />
                    </div>

                    <button
                      onClick={() => removeStructure(selectedStructureIdx)}
                      className="mt-2 py-2 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-red-800/60 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa công trình này</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-neutral-500">
                  Chưa có công trình nào. Bấm "Thêm Công Trình" để đặt bối cảnh.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIGHTING & ENVIRONMENT */}
          {activeTab === "lighting" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Chủ Đề Bối Cảnh (Theme):
                  </label>
                  <select
                    value={scene.theme}
                    onChange={(e) =>
                      onChangeScene({ ...scene, theme: e.target.value as ThemeId })
                    }
                    className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                  >
                    <option value="rural_graveyard">Bãi tha ma nông thôn (rural_graveyard)</option>
                    <option value="abandoned_village">Đường làng hoang vắng (abandoned_village)</option>
                    <option value="cursed_swamp">Đầm lầy u minh (cursed_swamp)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Bầu Trời & Trăng (Sky Preset):
                  </label>
                  <select
                    value={scene.lighting.sky_preset}
                    onChange={(e) =>
                      onChangeScene({
                        ...scene,
                        lighting: {
                          ...scene.lighting,
                          sky_preset: e.target.value as SkyPresetId,
                        },
                      })
                    }
                    className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                  >
                    <option value="blood_moon">Trăng Máu U Uất (blood_moon - Gradient đỏ rực, trăng máu khổng lồ)</option>
                    <option value="foggy_night">Đêm Sương Lạnh Buốt (foggy_night - Gradient đen tím lạnh, trăng mờ nhạt)</option>
                    <option value="stormy_dark">Bão Đêm Sấm Chớp (stormy_dark - Trời dông tối om, chớp giật)</option>
                    <option value="eclipse_abyss">Nhật Thực Hắc Ám & Ma Trơi (eclipse_abyss - Lửa xanh lân tinh)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-4 bg-black/40 border border-neutral-800/80 p-4 rounded-xl">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-neutral-300">
                    <span>Mật độ sương mù (Fog Density):</span>
                    <span className="font-mono text-cyan-400">{scene.lighting.fog_density.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={scene.lighting.fog_density}
                    onChange={(e) =>
                      onChangeScene({
                        ...scene,
                        lighting: {
                          ...scene.lighting,
                          fog_density: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-red-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-neutral-300">
                    Chớp Giật Sấm Sét (Thunder Flash):
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(scene.lighting.thunder_flash)}
                    onChange={(e) =>
                      onChangeScene({
                        ...scene,
                        lighting: {
                          ...scene.lighting,
                          thunder_flash: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STORY & DIALOGUE */}
          {activeTab === "story" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Tiêu Đề Cảnh:
                </label>
                <input
                  type="text"
                  value={scene.title || ""}
                  onChange={(e) => onChangeScene({ ...scene, title: e.target.value })}
                  placeholder="Ví dụ: Cảnh 1: Lạc Bước Bãi Tha Ma"
                  className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Lời Thoại / Phụ Đề Điện Ảnh (Hiển thị đáy màn hình):
                </label>
                <input
                  type="text"
                  value={scene.dialogue || ""}
                  onChange={(e) => onChangeScene({ ...scene, dialogue: e.target.value })}
                  placeholder="Lời thoại rùng rợn..."
                  className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Ghi Chú Đạo Diễn / Diễn Biến Cảnh:
                </label>
                <textarea
                  value={scene.narrative_note || ""}
                  onChange={(e) => onChangeScene({ ...scene, narrative_note: e.target.value })}
                  rows={3}
                  placeholder="Ghi chú bối cảnh và cảm xúc nhân vật..."
                  className="bg-black border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-600 resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
