import type {
  DirectorSceneScript,
  NamedEnvironmentPreset,
  NamedCharacterPreset,
  CameraShotType,
} from "./types";
import { validateDirectorScript, VALID_CAMERA_SHOTS } from "./layoutRouter";
import {
  estimateVoiceDurationSec,
  reconcileDialogueSlicesToStory,
  type VoicePacePreset,
} from "./voicePacingUtils";

export const DEFAULT_GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || "";

const STORAGE_KEY_API_KEY = "limbo_gemini_api_key";
const STORAGE_KEY_MODEL = "limbo_gemini_model";

export function getStoredApiKey(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_API_KEY);
    return saved && saved.trim() ? saved.trim() : DEFAULT_GEMINI_API_KEY;
  } catch {
    return DEFAULT_GEMINI_API_KEY;
  }
}

export function setStoredApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  } catch {
    // Ignore storage errors
  }
}

/**
 * Danh sách các model Gemini dự phòng đáng tin cậy (theo thứ tự ưu tiên).
 * Nếu model được chọn gặp sự cố (429 hết quota, 404 model ngừng hoạt động, 503 quá tải),
 * hệ thống sẽ tự động chuyển tiếp sang model kế tiếp để đảm bảo không bị gián đoạn.
 */
export const HEALTHY_FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
];

export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";

export function isDeprecatedModel(model: string): boolean {
  const lower = (model || "").trim().toLowerCase();
  return (
    !lower ||
    lower.includes("1.5") ||
    lower.includes("2.0") ||
    lower === "gemini-2.5-pro"
  );
}

export function getStoredModel(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MODEL);
    if (!saved || !saved.trim()) return DEFAULT_GEMINI_MODEL;
    const trimmed = saved.trim();
    // Tự động chuyển đổi và ghi đè localStorage nếu gặp model đã bị Google khai tử (404) hoặc model 2.5 cũ
    if (isDeprecatedModel(trimmed) || trimmed === "gemini-2.5-flash") {
      localStorage.setItem(STORAGE_KEY_MODEL, DEFAULT_GEMINI_MODEL);
      return DEFAULT_GEMINI_MODEL;
    }
    return trimmed;
  } catch {
    return DEFAULT_GEMINI_MODEL;
  }
}

export function setStoredModel(model: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_MODEL, model.trim());
  } catch {
    // Ignore storage errors
  }
}

/**
 * Detects if user description or story explicitly asks for earthquake/shake/shock impact.
 */
export function hasShakeKeywords(text: string | string[]): boolean {
  if (!text) return false;
  const str = Array.isArray(text) ? text.join(" ") : text;
  return /động đất|earthquake|rung lắc|rung chuyển|chấn động|sập đổ|sụp đổ|nổ tung|jumpscare|vồ lấy|giật nảy|chấn kinh/i.test(str);
}

/**
 * Sanitizes camera shake: if user did not explicitly describe earthquake or violent shock,
 * enforce camera shake to "none" so scenes don't vibrate unintentionally.
 */
export function sanitizeSceneShake(scene: DirectorSceneScript, sourceText: string | string[]): DirectorSceneScript {
  if (!scene.camera) return scene;
  const hasTopShake = Boolean(scene.camera.shake && scene.camera.shake !== "none");
  const hasKfShake = Boolean(
    scene.camera.keyframes?.some((kf) => kf.shake && kf.shake !== "none")
  );
  if ((hasTopShake || hasKfShake) && !hasShakeKeywords(sourceText)) {
    return {
      ...scene,
      camera: {
        ...scene.camera,
        ...(hasTopShake ? { shake: "none" } : {}),
        ...(scene.camera.keyframes
          ? {
              keyframes: scene.camera.keyframes.map((kf) =>
                kf.shake && kf.shake !== "none" ? { ...kf, shake: "none" } : kf
              ),
            }
          : {}),
      },
    };
  }
  return scene;
}

/**
 * 1-Click Horror Story Prompt Inspirations
 */
export interface StoryPromptPreset {
  id: string;
  title: string;
  prompt: string;
  suggestedScenes: number;
  scenePrompts?: string[];
}

export const SAMPLE_HORROR_PROMPTS: StoryPromptPreset[] = [
  {
    id: "graveyard_crossing",
    title: "Lạc Bước Bãi Tha Ma",
    prompt:
      "Một người nông dân mặc áo tơi sờn rách, tay cầm đèn bão sắt bước đi trong sương mù dày đặc bãi tha ma đêm ba mươi. Anh bắt gặp đốm ma trơi dẫn lối tới ngôi mộ cổ còn nghi ngút khói hương, và kinh hoàng khi một bóng ma quấn vải liệm tử thi từ trên không bay là là sà xuống đuổi theo.",
    suggestedScenes: 3,
    scenePrompts: [
      "Người nông dân mặc áo tơi sờn rách, tay cầm đèn bão sắt bước đi trong sương mù dày đặc bãi tha ma đêm tối, quạ đen đậu rình rập trên bia mộ cổ.",
      "Đốm ma trơi xanh lập lòe dẫn lối tới bát hương nghi ngút khói bên mộ cổ, một bóng ma quấn vải liệm tử thi bất ngờ hiện hình lơ lửng trên không trung.",
      "Bóng ma áo rách sà xuống rượt đuổi với nụ cười ma quái, người nông dân hoảng loạn giơ đèn bão tháo chạy qua đống sọ người rải rác.",
    ],
  },
  {
    id: "jiangshi_shrine",
    title: "Trấn Yểm Cương Thi Miếu Cổ",
    prompt:
      "Vị pháp sư mặc áo cà sa vàng đỏ, tay thủ kiếm gỗ đào trừ tà tiến vào ngôi miếu hoang cô hồn dưới ánh trăng máu. Trước cửa miếu, một cương thi trong bộ quan phục phong kiến nhảy cứng đờ vươn vuốt tiến tới. Pháp sư giơ lá bùa vàng chu sa trấn áp.",
    suggestedScenes: 3,
    scenePrompts: [
      "Dưới ánh trăng máu đỏ rực, vị pháp sư mặc áo cà sa tay thủ kiếm gỗ đào trừ tà tiến vào khoảng sân ngôi miếu hoang cô hồn đầy bùa dán.",
      "Trước cửa miếu, một cương thi trong bộ quan phục phong kiến với bùa dán trán nhảy cứng đờ vươn hai tay thẳng tắp tiến tới tấn công.",
      "Pháp sư tung lá bùa vàng chu sa trấn áp trán cương thi, ánh trăng máu lóe sáng, cương thi bất động giữa màn đêm mờ ảo.",
    ],
  },
  {
    id: "smiling_woman",
    title: "Nụ Cười Oan Hồn Áo Dài",
    prompt:
      "Đường làng hoang vắng trong cơn bão sấm chớp dữ dội. Người khách bộ hành nhìn thấy một thiếu nữ mặc áo dài tà rách đứng khóc bên lều tranh xiêu vẹo. Khi người đàn ông lại gần, thiếu nữ quay đầu lại hé lộ khuôn mặt vô diện rồi bất ngờ nở nụ cười ma quái xé dài tới mang tai.",
    suggestedScenes: 3,
    scenePrompts: [
      "Đường làng hoang vắng trong cơn bão sấm chớp dữ dội, người khách bộ hành tay cầm ô rách nhìn thấy bóng một thiếu nữ mặc áo dài bên túp lều tranh xiêu vẹo.",
      "Người khách tiến lại gần lều tranh hỏi han, thiếu nữ từ từ quay đầu lại hé lộ khuôn mặt vô diện trắng bệch kỳ dị không có ngũ quan.",
      "Sấm chớp lóe sáng rạch ngang trời, khuôn mặt thiếu nữ bất ngờ nở nụ cười ma quái xé dài tới mang tai và lao tới rượt đuổi người khách.",
    ],
  },
  {
    id: "swamp_eclipse",
    title: "Nhật Thực Đầm Lầy U Minh",
    prompt:
      "Mặt trời đen viền lửa xanh lân tinh che khuất bầu trời đầm lầy u minh. Bên cây cầu gỗ gãy nhịp và giếng cạn oan hồn, đứa trẻ ma ôm búp bê vải rách đứng bất động. Bất thình lình từ bóng tối, quỷ tướng giáp cổ vỡ nát vươn vuốt đuổi theo đứa trẻ.",
    suggestedScenes: 4,
    scenePrompts: [
      "Bầu trời nhật thực đầm lầy u minh tối tăm, bên cây cầu gỗ gãy nhịp đứa trẻ ma ôm búp bê vải rách đứng bất động trong làn sương độc.",
      "Quạ đen kêu thảm thiết trên cọc cầu, đứa trẻ ma bắt đầu run rẩy khi một bóng quỷ sừng cong khổng lồ trồi lên từ đáy đầm lầy.",
      "Quỷ tướng mang giáp cổ vỡ nát vươn vuốt đuổi theo đứa trẻ ma, đầm lầy nổi sóng rùng rợn dưới ánh nhật thực lân tinh.",
      "Quỷ tướng áp sát giếng cạn u ám, đứa trẻ ma tan biến vào hư vô để lại búp bê rơi xuống miệng giếng cạn.",
    ],
  },
  {
    id: "gallows_bell",
    title: "Tiếng Chuông Cây Treo Cổ",
    prompt:
      "Đêm sương mù lạnh buốt bên cây treo cổ rủ cành liễu ma quái. Một bóng người mặc áo choàng trùm đầu tăm tối tay cầm chuông đồng triệu hồn từng tiếng vang vọng. Trên cành cây cao, một xác chết bị treo cổ bắt đầu đung đưa kẽo kẹt và mở mắt đỏ ngầu.",
    suggestedScenes: 3,
    scenePrompts: [
      "Đêm sương mù lạnh buốt bên cây treo cổ ma quái rủ cành, xác chết quấn vải liệm đung đưa kẽo kẹt trên cành cây cao.",
      "Người mặc áo choàng trùm đầu bí ẩn bước tới gốc cây, tay cầm chuông đồng triệu hồn rung lên từng hồi ngân vang rợn người.",
      "Tiếng chuông dồn dập, xác treo cổ mở bừng mắt đỏ ngầu máu, quạ đen hoảng loạn bay tán loạn trên nền trời u ám.",
    ],
  },
  {
    id: "hospital_nightmare",
    title: "Ác Mộng Bệnh Viện Bỏ Hoang",
    prompt:
      "Trong hành lang bệnh viện hoang tàn ánh đèn huỳnh quang chập chờn, một người lữ khách mặc áo hoodie hiện đại tay cầm đèn pin rọi luồng sáng xuyên qua bóng tối. Anh phát hiện chiếc giường mổ rỉ sét vấy máu ở giữa phòng cùng cột truyền dịch rỉ từng giọt máu tươi. Bất ngờ, một bóng bác sĩ quỷ mặc áo blouse vấy máu tay cầm dao mổ sắc lạnh xuất hiện truy sát.",
    suggestedScenes: 3,
    scenePrompts: [
      "Hành lang bệnh viện bỏ hoang ánh đèn huỳnh quang chập chờn, người thanh niên mặc hoodie cầm đèn pin rọi luồng sáng nón hình học rảo bước qua cánh cửa thang máy tối tăm.",
      "Luồng sáng đèn pin rọi trúng chiếc giường mổ rỉ sét vấy máu ở giữa phòng và cột truyền dịch rỉ máu, camera an ninh trên trần chớp đỏ liên tục.",
      "Một bác sĩ quỷ mặc áo blouse trắng loang lổ máu xuất hiện với nụ cười ma quái xé toạc, tay cầm dao mổ phẫu thuật sắc lạnh lao tới truy đuổi người thanh niên.",
    ],
  },
  {
    id: "hotel_corridor_13",
    title: "Hành Lang Khách Sạn Tầng 13",
    prompt:
      "Hành lang khách sạn cổ u ám ánh vàng mờ ảo giữa đêm khuya. Một vị khách tiến lại quầy lễ tân hoang vắng thì chuông dịch vụ bất ngờ tự rung lên kẽo kẹt. Cửa thang máy tầng 13 ở trung tâm từ từ hé mở một khe đen ngòm hé lộ đôi mắt đỏ ngầu bên trong.",
    suggestedScenes: 3,
    scenePrompts: [
      "Hành lang khách sạn cổ u ám ánh đèn vàng mờ, người khách mặc áo khoác hiện đại cầm đèn pin bước đi trên sàn gạch hướng về phía quầy lễ tân hoang vắng.",
      "Tại quầy lễ tân u ám, chiếc chuông đồng dịch vụ bất ngờ tự vang lên từng tiếng kẽo kẹt, đèn trần bắt đầu chập chờn chao đảo.",
      "Cửa thang máy số 13 ở trung tâm từ từ hé mở một kẽ hở đen ngòm, một đôi mắt đỏ máu rực lên từ bóng tối sâu thẳm của hố thang máy.",
    ],
  },
  {
    id: "creepy_bathroom_night",
    title: "Ác Mộng Phòng Tắm Nửa Đêm",
    prompt:
      "Trong phòng tắm ẩm ướt ánh đèn huỳnh quang chập chờn lúc 03:00 sáng. Một cô gái cầm điện thoại phát sáng bước vào soi gương thì bàng hoàng thấy gương nứt vỡ với dấu bàn tay máu cào xước. Vòi nước đồng trên chiếc bồn tắm rỉ sét bắt đầu rỉ từng giọt máu tươi, và từ làn sương đục ngầu một bóng ma áo liệm từ từ trỗi dậy.",
    suggestedScenes: 3,
    scenePrompts: [
      "Phòng tắm ẩm ướt ánh đèn huỳnh quang chập chờn, cô gái mặc áo hoodie cầm điện thoại phát sáng xanh lạnh bước đi rụt rè về phía bồn tắm cổ.",
      "Gương soi nhà tắm nứt mạng nhện bất ngờ xuất hiện dấu bàn tay máu cào xước, vòi nước đồng rỉ giọt máu đỏ tươi xuống bồn tắm ngập nước đục.",
      "Bóng ma quấn vải liệm tử thi từ từ bay trồi lên từ làn sương bồn tắm, cô gái hoảng loạn giơ điện thoại lùi lại tháo chạy.",
    ],
  },
];

/**
 * Master System Prompt based on GEMINI_DIRECTOR_ASSETS.md
 */
const GEMINI_DIRECTOR_SYSTEM_INSTRUCTION = `Bạn là Gemini Director - Đạo diễn Kịch bản Hoạt hình Kinh dị Bóng Đen (Silhouette Minimalist Horror) tương tự Limbo, Badland, U Linh Kỳ Truyện.
Nhiệm vụ của bạn là nhận câu chuyện, kịch bản hoặc yêu cầu từ người dùng và đạo diễn thành các phân cảnh hoạt hình 2D thuần code (React/SVG/CSS).

1. HỆ TỌA ĐỘ VÀ KHUNG HÌNH CHUẨN:
- ViewBox cố định: 1920 x 1080 (16:9).
- Trục Mặt Đất: Y = 800px. Mọi nhân vật và công trình tiếp đất neo gốc tại [bottom-center] (Y = 800px).
- Hand Socket: Đồ vật cầm tay neo tại cán [0, 0] của bàn tay nhân vật.
- 5 Ground Slots (Y = 800px): "far_left" (X: 250), "mid_left" (X: 600), "center" (X: 960), "mid_right" (X: 1320), "far_right" (X: 1670).
- 3 Air Slots: "air_left" (400, 350), "air_center" (960, 280), "air_right" (1520, 350).
- Đường Line tiếp đất liên tục: Có thể dùng offsetX để nhân vật đứng ở bất kỳ tọa độ X nào từ 80px đến 1840px (X_thực = slot.X + offsetX). Với nhân vật tiếp đất, offsetY BẮT BUỘC bằng 0.

2. KHO TÀI NGUYÊN HỢP LỆ (CHỈ ĐƯỢC DÙNG CÁC ID SAU, KHÔNG ĐƯỢC TỰ BỊA ID MỚI):
- Themes: "rural_graveyard" | "abandoned_village" | "cursed_swamp" | "modern_indoor" | "vehicle_interior" | "urban_night_market"
  * "urban_night_market": Khu chợ đêm & đường phố đô thị rực rỡ ánh đèn neon chớp giật, dây lều bạt cổ vật, mặt đường nhựa bóng loáng trong mưa lạnh.
  * "vehicle_interior": Toàn bộ khoang bên trong xe bus / tàu hỏa (trần cong, ô cửa sổ nhìn ra đường đêm, ghế xe bus, cột tay vịn vàng với chuông bấm). BẮT BUỘC dùng cho cảnh trong xe, KHÔNG dùng modern_indoor vì modern_indoor là sảnh hành lang rộng lớn.
- Sky presets (Bầu trời & Chiếu sáng):
  * "blood_moon" (Trăng máu đỏ rực)
  * "foggy_night" (Đêm sương mù lạnh buốt)
  * "stormy_dark" (Bão đêm sấm chớp)
  * "eclipse_abyss" (Nhật thực lửa xanh lân tinh)
  * "flickering_fluorescent" (Đèn huỳnh quang chập chờn - trong nhà: bệnh viện, siêu thị)
  * "dim_indoor_night" (Ánh vàng mờ ảo đêm muộn - trong nhà: khách sạn, nhà hàng)
- Structures (Công trình & Vùng được phép):
  * "creepy_banyan_tree", "haunted_gallows_tree" -> CHỈ ĐẶT Ở: "far_left" | "far_right"
  * "ancient_tomb", "abandoned_shrine", "creepy_well", "hospital_operating_bed", "hotel_reception_desk", "creepy_elevator_doors", "dining_table_chairs", "bus_interior", "creepy_bathtub", "structure_small_wooden_table" -> CHỈ ĐẶT Ở: "mid_left" | "center" | "mid_right"
  * "dilapidated_hut", "broken_wooden_bridge", "supermarket_shelf_aisle" -> CHỈ ĐẶT Ở: "far_left" | "center" | "far_right"
  * "structure_wooden_window" -> CHỈ ĐẶT Ở: "far_left" | "mid_left" | "mid_right" | "far_right"
  * "scarecrow_of_the_damned", "market_stall_tent", "abandoned_subway_station", "rusty_train_tracks_tunnel", "structure_old_apartment_gate", "structure_wooden_sampan", "structure_monkey_bridge", "structure_wooden_coffin", "structure_bamboo_bed_net", "structure_wooden_latch_door", "structure_rural_passenger_bus", "structure_wooden_chair", "structure_wooden_bed" -> Đặt ở mọi ground slot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right"
- Details (Đạo cụ cảnh):
  * "detail_black_crow", "detail_broken_mirror" -> Tất cả 5 ground slots và 3 air slots
  * "detail_will_o_wisp" -> "air_left" | "air_center" | "air_right" | "mid_left" | "center" | "mid_right"
  * "detail_blood_lantern" -> 5 ground slots hoặc "air_left" | "air_right"
  * "detail_incense_bowl" -> "mid_left" | "center" | "mid_right" (Ground only)
  * "detail_skull_pile", "detail_iv_drip_stand", "detail_shopping_cart" -> 5 ground slots (Ground only)
  * "detail_hanging_talisman", "detail_surveillance_camera", "detail_flickering_ceiling_lamp" -> "air_left" | "air_center" | "air_right" (Air only)
- Actor Bases (Khung nhân vật):
  * "male_adult" (Nam thanh niên, người lữ khách gầy)
  * "female_adult" (Nữ thanh niên, tà áo buông, tóc dài)
  * "elder_hunched" (Bà lão / Cụ già lưng còng 0.85x, tóc hoa râm búi củ tỏi)
  * "brute_hulking" (Đồ tể / Hộ pháp lực lưỡng 1.2x, vai u thịt bắp, cằm bạnh)
  * "skeletal_emaciated" (Kẻ gầy trơ xương / Ngạ quỷ 1.05x, khẳng khiu, ngực lộ sườn)
  * "ghost_wraith" (Bóng ma bay lượn, không chân, áo rách)
  * "creepy_child" (Đứa trẻ ma nhỏ bé 0.65x)
  * "jiangshi_corpse" (Cương thi áo quan, mũ quan bùa trán)
  * "demon_shadow" (Quỷ bóng đen dị hình to lớn 1.25x, sừng cong)
- Actor Costumes (Trang phục):
  * "outfit_tattered_tunic" (Áo tơi nông phu sờn rách)
  * "outfit_flowing_ao_dai" (Áo dài cổ truyền tà rách)
  * "outfit_shrouded_cloak" (Áo choàng trùm đầu Reaper)
  * "outfit_mandarin_court" (Quan phục triều đình)
  * "outfit_monk_cassock" (Áo cà sa pháp sư trừ tà)
  * "outfit_shredded_burial" (Vải liệm oan hồn tử thi)
  * "outfit_ancient_armor" (Giáp tướng cổ vỡ nát)
  * "outfit_child_pajamas" (Yếm hoa trẻ thơ)
  * "outfit_doctor_coat" (Áo blouse bác sĩ vấy máu phẫu thuật)
  * "outfit_patient_gown" (Áo bệnh nhân sọc xanh lấm lem)
  * "outfit_modern_casual" (Áo hoodie / Đồ hiện đại thường nhật)
  * "outfit_traditional_ba_ba" (Áo bà ba trắng truyền thống Nam Bộ & quần lụa đen)
  * "outfit_funeral_white" (Trang phục tang lễ trắng xô gai & dải khăn tang trắng quấn đầu)
- Actor Faces (Khuôn mặt):
  * "face_calm", "face_scared", "face_creepy_smile", "face_bleeding_eyes", "face_old_wrinkled", "face_rage_furious", "face_pale_corpse", "face_weeping_ghost", "face_sewn_mouth", "face_haggard_gaunt", "face_faceless", "face_glowing_hollow", "face_talisman_covered", "face_headless" (Cổ đứt lìa / Không đầu, lộ xương sống cổ và máu rỉ)
- Actor Facing (BẮT BUỘC có trên mỗi actor):
  * "facing": "left" | "right" (hướng mặt quay sang trái hoặc sang phải)
- Actor Poses (Tư thế & Quy định vùng):
  * "pose_standing", "pose_sitting", "pose_sitting_twisted_legs", "pose_holding", "pose_shivering", "pose_walking", "pose_crawling", "pose_reaching" -> BẮT BUỘC ở 5 Ground Slots (offsetY = 0)
  * "pose_floating", "pose_hanging" -> BẮT BUỘC ở 3 Air Slots ("air_left" | "air_center" | "air_right")
  * Lưu ý đặc biệt cho bối cảnh xe buýt / ghế ngồi:
    - "pose_sitting": Nhân vật ngồi ngay ngắn trên ghế / sàn xe (ví dụ Lan ngồi ghế).
    - "pose_sitting_twisted_legs": Tư thế dị dạng kinh dị - thân trên ngồi trên ghế, đôi chân bị xoay ngược 180 độ ra phía sau lưng, hai bàn chân lơ lửng cách mặt sàn vài phân không chạm đất (người đàn ông ma quái trên xe buýt). BẮT BUỘC ở Ground Slot (offsetY = 0).
- Actor Handheld Items (Đồ vật cầm tay qua Hand Socket):
  * "heldItem": "none" | "item_storm_lantern" | "item_paper_lantern" | "item_soul_candle" | "item_peach_wood_sword" | "item_yellow_talisman" | "item_rusty_sickle" | "item_ritual_bell" | "item_tattered_doll" | "item_tattered_umbrella" | "item_flashlight" | "item_scalpel" | "item_smartphone" | "item_severed_head" | "item_mysterious_note" (Mẩu giấy / lá thư bí ẩn vương máu) | "item_offering_toys" (Nải chuối & đồ chơi đất nung cúng cô hồn) | "item_areca_palm_fan" (Quạt mo cau) | "item_fresh_ginger" (Lát gừng tươi giữ khí) | "item_oil_lamp" (Đèn dầu hột vịt cầm tay soi sáng)
  * "heldHand": "right" (tay trước) | "left" (tay sau)
- Chuyển động A -> B (motion tweening):
  * NẾU NHÂN VẬT ĐỨNG YÊN KHÔNG DI CHUYỂN: BỎ HẲN trường "motion" (TUYỆT ĐỐI KHÔNG để null hay {}).
  * CHỈ KHI nhân vật thực sự di chuyển từ điểm A sang điểm B mới thêm:
    "motion": { "targetSlot": SlotId, "targetOffsetX": number, "targetOffsetY": 0, "startTimeSec": number, "endTimeSec": number, "easing": "linear"|"ease_in_out"|"ease_in"|"ease_out", "autoFaceTarget": true, "movingPose": "pose_walking"|"pose_floating"|"pose_crawling"|"pose_reaching" }

3. QUY TẮC ĐẠO DIỄN GÓC MÁY ĐIỆN ẢNH (CINEMATIC CAMERA SYSTEM - BẮT BUỘC ĐẠO DIỄN SỬ DỤNG LINH HOẠT):
Mỗi phân cảnh BẮT BUỘC có khối "camera" để điều phối góc nhìn điện ảnh, TUYỆT ĐỐI KHÔNG để toàn bộ các cảnh đều là "wide" đơn điệu! Khai thác triệt để độ phân giải vector vô hạn của SVG (không vỡ hạt khi zoom):
- "shot" (7 Cỡ cảnh chuẩn):
  * "extreme_wide": Đại cảnh (0.88x) - Cảnh mở màn hoặc kết thúc mênh mông, nhân vật lọt thỏm cô độc giữa không gian hiểm ác, cánh đồng ma trăng máu.
  * "wide": Toàn cảnh (1.0x) - Thiết lập không gian sân khấu 1920x1080, thấy rõ tất cả các công trình và nhân vật.
  * "medium_wide": Trung toàn cảnh (1.45x) - Từ đầu gối lên, nhân vật tương tác với công trình (đứng trước mộ, bàn mổ, bồn tắm, quầy lễ tân).
  * "medium": Trung cảnh (1.9x) - Từ thắt lưng lên, nhấn mạnh hành động rút kiếm gỗ đào, thắp đèn, soi đèn pin, cầm dao mổ, rung chuông.
  * "close_up": Cận cảnh (2.85x) - Từ ngực lên đầu! BẮT BUỘC khi biểu cảm kinh hoàng ("face_scared", "face_screaming_gasp", "face_bleeding_eyes", "face_creepy_smile").
  * "extreme_close_up": Đặc tả (4.3x) - Phóng đại tối đa vào tròng mắt rỉ máu, nụ cười xé toạc, mũi dao mổ, bùa dán trán cương thi.
  * "dutch_tilt": Góc nghiêng ma mị (1.6x, dutch_angle: -6 đến -10 độ) - Tà khí xâm lấn, điên loạn, bất an, bóp méo không gian thực tại.
- "target_actor_id": Khóa mục tiêu vào ID nhân vật chính (ví dụ "actor_1", "ghost_oan_hon"). KHI DÙNG "medium", "close_up", "extreme_close_up", "dutch_tilt" BẮT BUỘC ĐIỀN TRƯỜNG NÀY ĐỂ CAMERA TỰ ĐỘNG CĂN TẦM MẶT VÀ BÁM THEO NHÂN VẬT (TRACKING SHOT)!
- "target_slot": Neo khung nhìn vào một slot ("center", "mid_left", "mid_right", "far_left", "far_right") nếu không khóa theo actor.
- "shake": Hiệu ứng rung giật ống kính:
  * "none": Mặc định (bình thường, ổn định, không rung). QUY TẮC BẮT BUỘC: Mặc định luôn là "none" để khung hình sắc nét, tĩnh tại. TUYỆT ĐỐI KHÔNG tự tiện thêm shake vào các cảnh thông thường nếu người dùng không yêu cầu.
  * "subtle_handheld": Dao động máy quay cầm tay tự nhiên (chỉ dùng khi người dùng yêu cầu góc nhìn cầm tay).
  * "creepy_tremor": Run rẩy rùng mình khi có tà khí lạnh hoặc chấn động nhẹ.
  * "heavy_jumpscare": Giật nảy dữ dội (CHỈ DÙNG khi người dùng có mô tả động đất, sụp đổ, nổ tung, hoặc quỷ dữ vồ giật mình).
- "motion" (Chuyển động máy quay sinh động - tùy chọn):
  * "type": "push_in" (zoom từ từ tiến sát vào mặt đối tượng - tăng hồi hộp nghẹt thở) | "pull_out" (zoom lùi xa để lộ bóng ma sau lưng) | "pan_left" | "pan_right" | "follow_actor" (bám theo bước chân nhân vật).
  * "endZoom": Hệ số zoom đích (ví dụ 3.2 khi push_in từ medium vào close_up).
  * "startTimeSec", "endTimeSec": Thời gian bắt đầu và kết thúc (ví dụ 0.5 đến duration - 0.5).
  * "easing": "ease_in_out" | "linear" | "ease_in" | "ease_out".
- "keyframes" (ĐẠO DIỄN ĐA GÓC MÁY TRONG CÙNG 1 PHÂN CẢNH - MULTI-SHOT TIMELINE - RẤT KHUYẾN KHÍCH!):
  Bạn là đạo diễn điện ảnh thực thụ: ĐỪNG bó buộc 1 cảnh dài chỉ đứng im ở 1 góc máy duy nhất! Hãy tự suy luận theo nhịp hành động, diễn biến tâm lý và độ dài phân cảnh để chọn 1 góc máy (nếu cảnh ngắn ≤ 5s, đơn giản) HOẶC đạo diễn một chuỗi **2 đến 4 góc máy ("camera.keyframes")** trong cùng 1 cảnh (đặc biệt khi cảnh dài ≥ 6s, có nhiều hành động nối tiếp, 2 nhân vật đối mặt, hay có cú twist/hù dọa):
  * Mỗi phần tử trong "keyframes" gồm:
    - "startTimeSec": Mốc giây bắt đầu góc máy đó (mốc đầu tiên BẮT BUỘC là 0, các mốc sau tăng dần trong khoảng 0 đến duration_sec - 1).
    - "transition": "cut" (cắt máy dứt khoát - tạo nhịp dựng phim điện ảnh, cực hợp chuyển sang cận mặt/bóng ma/shot-reverse-shot) | "smooth" (máy quay lướt/zoom mượt từ góc trước sang góc này, kèm "transitionDurationSec": 0.8 - 1.5 và "easing": "ease_in_out").
    - "shot": Cỡ cảnh cho nhịp này ("extreme_wide" | "wide" | "medium_wide" | "medium" | "close_up" | "extreme_close_up" | "dutch_tilt").
    - "target_actor_id" hoặc "target_slot": Đổi đối tượng bám theo từng nhịp (vd nhịp 1 toàn cảnh, nhịp 2 cắt sang "actor_1", nhịp 3 cắt sang "actor_2" hoặc cận mặt "actor_1").
    - "shake": Mặc định "none" (chỉ bật nếu có động đất/sụp đổ/jumpscare).
    - "motion": (tùy chọn) chuyển động nhẹ ngay trong đoạn góc máy đó (vd "push_in" chậm rãi ở nhịp cuối).
  * Công thức dựng đa góc máy kinh dị kinh điển để bạn linh hoạt sáng tạo:
    - Mở bối cảnh → Hành động → Cao trào: 0s: wide → cut sang medium (nhân vật hành động/cầm đồ vật) → cut hoặc smooth sang close_up / dutch_tilt (khuôn mặt kinh hoàng).
    - Đối mặt (Shot / Reverse-Shot): 0s: medium_wide → cut sang medium vào nạn nhân ("actor_1") → cut sang close_up vào bóng ma ("actor_2") → cut sang extreme_close_up khuôn mặt hoảng loạn của nạn nhân.
    - Tiết lộ rợn người (Reveal): 0s: close_up vào nhân vật đang căng thẳng → smooth (hoặc cut) ra wide để lộ bóng ma đang đứng ngay sau lưng!

4. QUY ĐỊNH ĐỊNH DẠNG ĐẦU RA:
- BẮT BUỘC xuất ra CHÍNH XÁC MỘT JSON ARRAY gồm danh sách các cảnh (hoặc 1 JSON object nếu chỉ yêu cầu 1 cảnh duy nhất).
- KHÔNG thêm bất kỳ lời giải thích ngoài lề nào, chỉ trả về chuỗi JSON thuần.`;

/**
 * Formats API errors with user-friendly messages for 503 / 429 overloads.
 */
function formatApiError(res: Response, errBody: string): string {
  try {
    const errJson = JSON.parse(errBody);
    if (errJson.error?.message) {
      if (res.status === 503) {
        return `Máy chủ Gemini đang quá tải tạm thời (HTTP 503: High demand). Hệ thống đã tự động thử lại các model khả dụng nhưng máy chủ Google vẫn bận. Vui lòng thử lại sau 30 giây.`;
      }
      if (res.status === 429) {
        return `Đã vượt quá hạn mức gọi Gemini API (HTTP 429: Quota exceeded). Hệ thống đã cố gắng chuyển qua các model dự phòng nhưng đều chạm trần hạn mức. Vui lòng kiểm tra lại gói cước hoặc đổi API Key.`;
      }
      return `Lỗi Gemini API (${res.status}): ${errJson.error.message}`;
    }
  } catch {
    // raw text fallback
  }
  return `Lỗi Gemini API (Mã HTTP ${res.status}): ${errBody}`;
}

/**
 * Safe Gemini fetch helper with Exponential Backoff retry and automatic multi-tier model fallback.
 * Tự động chuyển đổi sang model khác nếu model hiện tại bị 429 (hết quota), 404 (ngừng hỗ trợ), hoặc 503 (quá tải).
 */
async function callGeminiApiWithRetry(
  apiKey: string,
  model: string,
  systemInstructionText: string,
  userPromptText: string,
  generationConfig: any = { responseMimeType: "application/json", temperature: 0.5 },
  maxRetries: number = 1
): Promise<Response> {
  // Chuỗi model ưu tiên: Lọc bỏ tuyệt đối các model đã bị Google khai tử (1.5, 2.0, 2.5-pro) trước khi gửi request
  const safeRequestedModel = isDeprecatedModel(model) ? DEFAULT_GEMINI_MODEL : model;
  const rawModels = [safeRequestedModel, ...HEALTHY_FALLBACK_MODELS];
  const modelsToTry = Array.from(new Set(rawModels.filter((m) => m && !isDeprecatedModel(m))));

  let lastRes: Response | null = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    const isLastModel = i === modelsToTry.length - 1;
    let attempt = 0;
    let delay = 1000;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

    while (attempt <= maxRetries) {
      attempt++;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstructionText }] },
            contents: [{ parts: [{ text: userPromptText }] }],
            generationConfig,
          }),
        });

        lastRes = res;

        // Thành công: gắn tag modelUsed và trả về ngay lập tức
        if (res.ok) {
          (res as any).modelUsed = currentModel;
          return res;
        }

        // Nếu model bị 404 (đã đóng) hoặc 429 (hết hạn mức):
        // KHÔNG chờ vô ích mà nhảy ngay sang model dự phòng kế tiếp!
        if (res.status === 404 || res.status === 429) {
          console.warn(`[Gemini Director] Model "${currentModel}" trả về HTTP ${res.status}. Tự động fallback sang model kế tiếp...`);
          break; // Thoát vòng retry của model này, chuyển sang model kế tiếp trong modelsToTry
        }

        // Nếu 503 (Google quá tải) hoặc 500: Thử lại 1 lần nhanh nếu còn lượt
        if (res.status === 503 || res.status === 500) {
          if (attempt <= maxRetries) {
            const jitter = Math.random() * 300;
            await new Promise((resolve) => setTimeout(resolve, delay + jitter));
            delay *= 1.6;
            continue;
          } else {
            console.warn(`[Gemini Director] Model "${currentModel}" quá tải (503). Chuyển sang model dự phòng kế tiếp...`);
            break;
          }
        }

        // Lỗi client payload/auth (400, 401, 403) thì trả về luôn vì đổi model cũng vô ích
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          return res;
        }

        break;
      } catch (networkErr) {
        if (isLastModel && attempt > maxRetries) {
          throw networkErr;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 1.6;
      }
    }
  }

  return lastRes!;
}

export interface GenerateFilmResult {
  success: boolean;
  scenes?: DirectorSceneScript[];
  error?: string;
  rawText?: string;
  modelUsed?: string;
}

export interface GenerateSceneResult {
  success: boolean;
  scene?: DirectorSceneScript;
  error?: string;
  rawText?: string;
}

/**
 * Generate a complete multi-scene horror film from a screenplay or story idea.
 */
export async function generateFilmFromStory(
  storyPrompt: string | string[],
  options: {
    sceneCount?: number;
    apiKey?: string;
    model?: string;
  } = {}
): Promise<GenerateFilmResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key để tiếp tục.",
    };
  }

  let userPrompt = "";
  let effectiveSceneCount = options.sceneCount || 3;

  if (Array.isArray(storyPrompt)) {
    effectiveSceneCount = Math.max(1, storyPrompt.length);
    const sceneDescriptions = storyPrompt
      .map(
        (p, idx) =>
          `[PHÂN CẢNH ${idx + 1}]:\n"""${p.trim() || `Diễn biến tiếp nối câu chuyện phân cảnh ${idx + 1}...`}"""`
      )
      .join("\n\n");

    userPrompt = `Người dùng đã phân chia sẵn nội dung cụ thể cho từng phân cảnh trong chuỗi ${effectiveSceneCount} cảnh phim hoạt hình kinh dị. Hãy đạo diễn CHÍNH XÁC từng phân cảnh theo đúng yêu cầu dưới đây:

${sceneDescriptions}

YÊU CẦU ĐẠO DIỄN BẮT BUỘC:
1. Bạn KHÔNG cần suy nghĩ cách chia phân cảnh. Hãy thực hiện chính xác theo nội dung từng [PHÂN CẢNH] mà người dùng đã chỉ định ở trên:
   - Đối tượng JSON thứ 1 trong mảng trả về BẮT BUỘC phải là đạo diễn cho [PHÂN CẢNH 1].
   - Đối tượng JSON thứ 2 trong mảng trả về BẮT BUỘC phải là đạo diễn cho [PHÂN CẢNH 2].
   ${effectiveSceneCount >= 3 ? `- Đối tượng JSON thứ 3 trong mảng trả về BẮT BUỘC phải là đạo diễn cho [PHÂN CẢNH 3].` : ""}
   ${effectiveSceneCount >= 4 ? `- Đối tượng JSON thứ 4 trong mảng trả về BẮT BUỘC phải là đạo diễn cho [PHÂN CẢNH 4].` : ""}
   ${effectiveSceneCount >= 5 ? `- Đối tượng JSON thứ 5 trong mảng trả về BẮT BUỘC phải là đạo diễn cho [PHÂN CẢNH 5].` : ""}
2. Bố trí chuẩn xác tài nguyên theo GEMINI_DIRECTOR_ASSETS.md:
   - theme: "rural_graveyard" | "abandoned_village" | "cursed_swamp" | "modern_indoor" | "vehicle_interior"
   - lighting (sky_preset: "blood_moon" | "foggy_night" | "stormy_dark" | "eclipse_abyss" | "flickering_fluorescent" | "dim_indoor_night", fog_density: 0.5 - 0.9, thunder_flash: boolean)
   - structures & details tuân thủ tuyệt đối quy tắc vị trí neo (Ground Slots vs Air Slots, cây đa/cây gallows chỉ ở far_left/far_right, miếu/mộ/giếng ở giữa...)
   - actors: base, costume, face, pose, facing, slot, continuous offsetX, heldItem, heldHand
   - motion: chuyển động A -> B (nếu nhân vật di chuyển từ vị trí xuất phát tới vị trí đích)
3. ĐẠO DIỄN GÓC MÁY ĐIỆN ẢNH & ĐA GÓC MÁY TRONG 1 CẢNH (CINEMATIC MULTI-SHOT CAMERA - BẮT BUỘC SỬ DỤNG):
   Mỗi cảnh BẮT BUỘC có khối "camera" sinh động theo nhịp điệu kinh dị (TUYỆT ĐỐI KHÔNG để tất cả đều là "wide" tĩnh):
   - Bạn tự suy luận đạo diễn xem mỗi cảnh hợp với 1 góc máy duy nhất (cảnh ngắn ≤ 5s) HAY 2–4 góc máy nối tiếp bằng mảng "keyframes" (cảnh dài ≥ 6s, có nhiều diễn biến, 2 nhân vật đối mặt, hay có cao trào/twist).
   - Cỡ cảnh ("shot"): "extreme_wide" | "wide" | "medium_wide" | "medium" | "close_up" | "extreme_close_up" | "dutch_tilt".
   - "keyframes": Mảng các mốc chuyển góc máy theo thời gian (startTimeSec: 0 → ...), dùng "transition": "cut" (cắt máy dứt khoát) hoặc "smooth" (lướt mượt) và đổi "target_actor_id" theo từng nhịp hành động.
   - "target_actor_id": Khóa mục tiêu vào ID nhân vật chính (ví dụ "actor_1") để camera bám theo mặt nhân vật khi di chuyển.
   - "shake": "none" (MẶC ĐỊNH BẮT BUỘC) | "subtle_handheld" | "creepy_tremor" | "heavy_jumpscare". QUY TẮC RUNG LẮC: Mặc định luôn là "none". TUYỆT ĐỐI KHÔNG tự ý thêm hiệu ứng rung lắc vào mọi phân cảnh hay keyframe. CHỈ sử dụng khi người dùng MÔ TẢ RÕ động đất, sụp đổ, nổ tung hoặc jumpscare giật mình.
   - "motion": Tùy chọn chuyển động máy ("push_in" zoom cận tăng căng thẳng, "follow_actor" bám theo nhân vật di chuyển).
4. Mỗi cảnh có tiêu đề (title), thời lượng (duration_sec: 5-8), phụ đề lời thoại rùng rợn (dialogue) và ghi chú đạo diễn (narrative_note).
5. Đảm bảo nhân vật và trang phục nhất quán giữa các cảnh nếu cùng một nhân vật xuất hiện xuyên suốt.

Trả về một JSON ARRAY gồm đúng ${effectiveSceneCount} đối tượng DirectorSceneScript:
[
  {
    "scene_id": "scene_01_...",
    "title": "...",
    "duration_sec": 7,
    "theme": "...",
    "lighting": { "sky_preset": "foggy_night", "fog_density": 0.6 },
    "camera": {
      "shot": "wide",
      "shake": "none",
      "keyframes": [
        { "startTimeSec": 0, "transition": "cut", "shot": "wide", "shake": "none" },
        { "startTimeSec": 2.5, "transition": "cut", "shot": "medium", "target_actor_id": "actor_1", "shake": "none" },
        { "startTimeSec": 5.0, "transition": "smooth", "transitionDurationSec": 1.0, "shot": "close_up", "target_actor_id": "actor_1", "shake": "none" }
      ]
    },
    "environment_items": [ ... ],
    "actors": [ ... ],
    "details": [ ... ],
    "dialogue": "...",
    "narrative_note": "..."
  },
  ...
]`;
  } else {
    userPrompt = `Hãy đạo diễn một chuỗi ${effectiveSceneCount} phân cảnh hoạt hình kinh dị (mỗi cảnh dài 5-8 giây) từ kịch bản sau:
"""
${storyPrompt}
"""

Yêu cầu cho chuỗi ${effectiveSceneCount} cảnh:
1. Các cảnh phải có sự liên kết cốt truyện liền mạch, căng thẳng dồn dập (Cảnh 1 thiết lập bối cảnh, Cảnh 2 phát hiện điều bất thường/chạm trán, Cảnh 3 cao trào rùng rợn/bị rượt đuổi).
2. Tận dụng tối đa nhân vật, trang phục, khuôn mặt, đồ vật cầm tay (đèn bão, kiếm gỗ đào, nến, bùa...) và chuyển động Điểm A -> Điểm B để câu chuyện sống động.
3. ĐẠO DIỄN GÓC MÁY ĐIỆN ẢNH & ĐA GÓC MÁY TRONG CÙNG 1 CẢNH (MULTI-SHOT CAMERA - BẮT BUỘC):
   Mỗi cảnh BẮT BUỘC có khối "camera" sinh động theo nhịp điệu kinh dị (TUYỆT ĐỐI KHÔNG để tất cả đều là "wide" tĩnh):
   - Bạn tự suy nghĩ chọn góc máy tối ưu cho từng phân cảnh: có thể dùng 1 góc máy gọn cho cảnh ngắn, HOẶC dùng mảng "keyframes" gồm 2–4 góc máy nối tiếp trong cùng 1 cảnh (ví dụ 0s: wide → cut sang medium vào hành động → cut/smooth sang close_up hoặc dutch_tilt lúc cao trào; hoặc shot/reverse-shot giữa nạn nhân và bóng ma).
   - "shake": Mặc định luôn là "none" (CHỈ dùng shake nếu có mô tả động đất, nổ hoặc jumpscare).
4. Mỗi cảnh có tiêu đề (title), thời lượng (duration_sec: 5-8), phụ đề lời thoại rùng rợn (dialogue) và ghi chú đạo diễn (narrative_note).
5. Tuân thủ 100% quy tắc vị trí neo (Ground Slots cho dáng tiếp đất, Air Slots cho dáng bay; cây đa/cây treo cổ chỉ ở rìa; mộ/giếng/miếu ở giữa...).

Trả về một JSON ARRAY gồm đúng ${effectiveSceneCount} đối tượng DirectorSceneScript:
[
  {
    "scene_id": "scene_01_...",
    "title": "...",
    "duration_sec": 7,
    "theme": "...",
    "lighting": { "sky_preset": "blood_moon", "fog_density": 0.6 },
    "camera": {
      "shot": "wide",
      "shake": "none",
      "keyframes": [
        { "startTimeSec": 0, "transition": "cut", "shot": "wide", "shake": "none" },
        { "startTimeSec": 3.5, "transition": "cut", "shot": "close_up", "target_actor_id": "actor_1", "shake": "none", "motion": { "type": "push_in", "endZoom": 3.4 } }
      ]
    },
    "environment_items": [ ... ],
    "actors": [ ... ],
    "details": [ ... ],
    "dialogue": "...",
    "narrative_note": "..."
  },
  ...
]`;
  }

  try {
    const res = await callGeminiApiWithRetry(
      apiKey,
      model,
      GEMINI_DIRECTOR_SYSTEM_INSTRUCTION,
      userPrompt,
      { responseMimeType: "application/json", temperature: 0.7 }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: formatApiError(res, errBody) };
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      return {
        success: false,
        error: "Mô hình Gemini không phản hồi nội dung hợp lệ.",
      };
    }

    const rawText = candidate.content.parts[0].text.trim();
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch (e: any) {
      return {
        success: false,
        error: `Không thể phân tích cú pháp JSON trả về: ${e.message}`,
        rawText,
      };
    }

    const rawList: any[] = Array.isArray(parsed)
      ? parsed
      : parsed.scenes && Array.isArray(parsed.scenes)
      ? parsed.scenes
      : [parsed];

    const validScenes: DirectorSceneScript[] = [];
    const validationErrors: string[] = [];

    rawList.forEach((rawScene, idx) => {
      // Ensure scene_id exists
      if (!rawScene.scene_id) {
        rawScene.scene_id = `scene_${String(idx + 1).padStart(2, "0")}_ai_${Date.now().toString().slice(-4)}`;
      }
      // Ensure duration_sec
      if (!rawScene.duration_sec) {
        rawScene.duration_sec = 6;
      }

      const val = validateDirectorScript(rawScene);
      if (val.valid && val.normalized) {
        validScenes.push(sanitizeSceneShake(val.normalized, storyPrompt));
      } else {
        validationErrors.push(`Cảnh ${idx + 1}: ${val.errors.join("; ")}`);
        // If normalization is still salvageable, push it
        if (val.normalized) {
          validScenes.push(sanitizeSceneShake(val.normalized, storyPrompt));
        }
      }
    });

    if (validScenes.length === 0) {
      return {
        success: false,
        error: `Các cảnh do AI sinh ra không vượt qua bộ kiểm tra quy tắc: ${validationErrors.join(" | ")}`,
        rawText,
      };
    }

    return {
      success: true,
      scenes: validScenes,
      rawText,
      modelUsed: model,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Lỗi kết nối mạng hoặc máy chủ Gemini: ${err.message}`,
    };
  }
}

/**
 * Re-direct / Regenerate a single scene with specific user instructions.
 * E.g., "Add a flying ghost descending from sky", "Change background to abandoned shrine with Jiangshi", etc.
 */
export async function regenerateSingleScene(
  currentScene: DirectorSceneScript,
  userInstruction: string,
  options: {
    apiKey?: string;
    model?: string;
  } = {}
): Promise<GenerateSceneResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key.",
    };
  }

  const userPrompt = `Đây là phân cảnh hiện tại:
${JSON.stringify(currentScene, null, 2)}

Yêu cầu điều chỉnh phân cảnh của người dùng:
"""
${userInstruction}
"""

Hãy điều chỉnh cảnh trên dựa theo yêu cầu của người dùng, giữ nguyên scene_id hoặc cập nhật hợp lý.
Đảm bảo tuân thủ 100% quy tắc vị trí neo, theme, structures, actors, handheld items và motion A -> B.
LƯU Ý VỀ GÓC MÁY (CAMERA): Nếu người dùng yêu cầu thay đổi góc máy (ví dụ đa góc máy, cận cảnh, đặc tả, góc nghiêng, rung giật jumpscare, zoom vào đối tượng...), hãy cập nhật hoặc bổ sung khối "camera" chuẩn xác:
- "shot": "extreme_wide" | "wide" | "medium_wide" | "medium" | "close_up" | "extreme_close_up" | "dutch_tilt"
- "target_actor_id": khóa vào id nhân vật nếu là góc cận/trung
- "shake": "none" | "subtle_handheld" | "creepy_tremor" | "heavy_jumpscare"
- "motion": "push_in" | "pull_out" | "follow_actor"...
- "keyframes": (tùy chọn, rất khuyến khích cho cảnh dài/nhiều nhịp) mảng các mốc đa góc máy trong cùng 1 cảnh: [{ "startTimeSec": 0, "transition": "cut"|"smooth", "shot": "...", "target_actor_id": "...", "shake": "none" }, ...]
Trả về CHÍNH XÁC MỘT JSON OBJECT duy nhất:`;

  try {
    const res = await callGeminiApiWithRetry(
      apiKey,
      model,
      GEMINI_DIRECTOR_SYSTEM_INSTRUCTION,
      userPrompt,
      { responseMimeType: "application/json", temperature: 0.6 }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: formatApiError(res, errBody) };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);
    const targetObj = Array.isArray(parsed) ? parsed[0] : parsed;

    const val = validateDirectorScript(targetObj);
    if (val.valid && val.normalized) {
      return { success: true, scene: sanitizeSceneShake(val.normalized, userInstruction), rawText };
    } else if (val.normalized) {
      return { success: true, scene: sanitizeSceneShake(val.normalized, userInstruction), rawText };
    }

    return {
      success: false,
      error: `Cảnh được chỉnh sửa không hợp lệ: ${val.errors.join("; ")}`,
      rawText,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Lỗi điều chỉnh cảnh: ${err.message}`,
    };
  }
}

/**
 * GENERATE SINGLE SCENE DIRECTLY FROM DESCRIPTION (BỐI CẢNH + HÀNH ĐỘNG NHÂN VẬT)
 * Locks the environment 100% to the chosen Named Environment Preset so there is ZERO background drift!
 * Gemini's role is strictly to translate "Nhân vật làm gì trong scene" into actors, costumes, faces, poses, held items, and A -> B motions.
 */
export async function generateSceneFromDescription(
  environment: NamedEnvironmentPreset,
  actionDescription: string,
  options: {
    duration_sec?: number;
    title?: string;
    apiKey?: string;
    model?: string;
    sceneIndex?: number;
    cameraShot?: CameraShotType | "auto";
  } = {}
): Promise<GenerateSceneResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || DEFAULT_GEMINI_MODEL;
  const duration = options.duration_sec || 6;
  const idx = options.sceneIndex !== undefined ? options.sceneIndex + 1 : 1;

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key.",
    };
  }

  const cameraGuidance =
    options.cameraShot && options.cameraShot !== "auto"
      ? `- Cỡ Cảnh Chỉ Định (BẮT BUỘC): Dùng camera.shot = "${options.cameraShot}", gán target_actor_id = "actor_1", shake mặc định là "none" (chỉ bật rung nếu mô tả có động đất, nổ tung hoặc jumpscare giật mình).`
      : `- Cỡ Cảnh & Đa Góc Máy Điện Ảnh (AI TỰ ĐẠO DIỄN): Bạn hãy tự suy luận đạo diễn xem cảnh này nên dùng 1 góc máy gọn hay một chuỗi **2–4 góc máy nối tiếp qua mảng "camera.keyframes"**! Với cảnh dài ≥ 6s, có nhiều diễn biến hành động hoặc từ 2 nhân vật trở lên, RẤT KHUYẾN KHÍCH dùng "keyframes" (ví dụ 0s: wide → cắt sang medium vào hành động → cắt/lướt sang close_up hoặc dutch_tilt vào biểu cảm kinh hoàng). Shake mặc định luôn là "none" (chỉ dùng shake khi mô tả có động đất, chấn động dữ dội hoặc quỷ dữ vồ jumpscare).`;

  const userPrompt = `BẠN LÀ CỖ MÁY ĐẠO DIỄN HOẠT HÌNH 2D THEO MÔ TẢ TRỰC TIẾP (DIRECT DESCRIPTION-DRIVEN 2D ENGINE).
BỐI CẢNH DƯỚI ĐÂY ĐÃ ĐƯỢC NGƯỜI DÙNG CỐ ĐỊNH 100% (BẮT BUỘC GIỮ NGUYÊN BỐI CẢNH NÀY ĐỂ TRÁNH LỆCH CẢNH):
- Tên bối cảnh: "${environment.name}"
- Theme: "${environment.theme}"
- Lighting: ${JSON.stringify(environment.lighting)}
- Environment items (Công trình): ${JSON.stringify(environment.environment_items)}
- Details (Đạo cụ cảnh): ${JSON.stringify(environment.details || [])}

MÔ TẢ CỦA NGƯỜI DÙNG VỀ NHÂN VẬT & HÀNH ĐỘNG TRONG PHÂN CẢNH ${idx}:
"""
${actionDescription}
"""

NHIỆM VỤ CỦA BẠN:
1. KHÔNG tự suy nghĩ kịch bản/cốt truyện. Hãy biên dịch TRỰC TIẾP mô tả hành động trên thành danh sách diễn viên (actors) và chuyển động (motion):
   - Chọn đúng base: "male_adult" | "female_adult" | "elder_hunched" | "brute_hulking" | "skeletal_emaciated" | "ghost_wraith" | "creepy_child" | "jiangshi_corpse" | "demon_shadow"
   - Chọn đúng costume: "outfit_tattered_tunic" | "outfit_flowing_ao_dai" | "outfit_shrouded_cloak" | "outfit_mandarin_court" | "outfit_monk_cassock" | "outfit_shredded_burial" | "outfit_ancient_armor" | "outfit_child_pajamas" | "outfit_doctor_coat" | "outfit_patient_gown" | "outfit_modern_casual" | "outfit_traditional_ba_ba" | "outfit_funeral_white"
   - Chọn đúng face: "face_calm" | "face_scared" | "face_creepy_smile" | "face_bleeding_eyes" | "face_old_wrinkled" | "face_rage_furious" | "face_pale_corpse" | "face_weeping_ghost" | "face_sewn_mouth" | "face_haggard_gaunt" | "face_faceless" | "face_glowing_hollow" | "face_talisman_covered" | "face_headless"
   - BẮT BUỘC có "facing": "left" | "right" (hướng mặt nhìn trái hoặc phải).
   - Chọn đúng pose và vị trí slot tiếp đất (offsetY = 0): "far_left" (250) | "mid_left" (600) | "center" (960) | "mid_right" (1320) | "far_right" (1670). (Nếu pose_floating/pose_hanging dùng air_left | air_center | air_right).
   - Chọn đúng heldItem & heldHand: "item_storm_lantern" | "item_paper_lantern" | "item_soul_candle" | "item_peach_wood_sword" | "item_yellow_talisman" | "item_rusty_sickle" | "item_ritual_bell" | "item_tattered_doll" | "item_tattered_umbrella" | "item_flashlight" | "item_scalpel" | "item_smartphone" | "item_severed_head" | "item_mysterious_note" | "item_offering_toys" | "item_areca_palm_fan" | "item_fresh_ginger" | "item_oil_lamp" | "none".
   - Nếu có di chuyển A -> B: gắn khối "motion" { targetSlot, targetOffsetX: 0, startTimeSec: 0.2, endTimeSec: ${duration - 0.5}, easing: "ease_in_out", autoFaceTarget: true, movingPose: "pose_walking"|"pose_floating"|"pose_crawling" }.
   - Nếu nhân vật ĐỨNG YÊN KHÔNG DI CHUYỂN: BỎ HẲN trường "motion" (TUYỆT ĐỐI KHÔNG để null hay {}).
2. THIẾT LẬP GÓC MÁY ĐIỆN ẢNH (BẮT BUỘC):
   ${cameraGuidance}
3. Đặt tiêu đề ngắn gọn (title) phản ánh đúng hành động.
4. Sinh 1 câu phụ đề lời thoại rùng rợn (dialogue) phù hợp với hành động.
5. GIỮ NGUYÊN 100% theme, lighting, environment_items và details từ bối cảnh đã cố định.

TRẢ VỀ CHÍNH XÁC MỘT ĐỐI TƯỢNG JSON DUY NHẤT:
{
  "scene_id": "scene_${Date.now().toString().slice(-4)}",
  "title": "${options.title || `Cảnh ${idx}: Hành Động Mới`}",
  "duration_sec": ${duration},
  "theme": "${environment.theme}",
  "lighting": ${JSON.stringify(environment.lighting)},
  "camera": {
    "shot": "${options.cameraShot && options.cameraShot !== "auto" ? options.cameraShot : "wide"}",
    "target_actor_id": "actor_1",
    "shake": "none"${options.cameraShot && options.cameraShot !== "auto" ? `,
    "motion": {
      "type": "push_in",
      "endZoom": 2.2,
      "startTimeSec": 0.5,
      "endTimeSec": ${duration - 0.5},
      "easing": "ease_in_out"
    }` : `,
    "keyframes": [
      { "startTimeSec": 0, "transition": "cut", "shot": "wide", "shake": "none" },
      { "startTimeSec": ${Math.round(duration * 0.4 * 10) / 10}, "transition": "cut", "shot": "medium", "target_actor_id": "actor_1", "shake": "none" },
      { "startTimeSec": ${Math.round(duration * 0.72 * 10) / 10}, "transition": "smooth", "transitionDurationSec": 0.9, "shot": "close_up", "target_actor_id": "actor_1", "shake": "none" }
    ]`}
  },
  "environment_items": ${JSON.stringify(environment.environment_items)},
  "actors": [
    {
      "id": "actor_1",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "pose": "pose_standing",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": 0,
      "offsetY": 0,
      "scale": 1,
      "heldItem": "item_flashlight",
      "heldHand": "right"
    }
  ],
  "details": ${JSON.stringify(environment.details || [])},
  "dialogue": "...",
  "narrative_note": "Mô tả ngắn..."
}`;

  try {
    const res = await callGeminiApiWithRetry(
      apiKey,
      model,
      GEMINI_DIRECTOR_SYSTEM_INSTRUCTION,
      userPrompt,
      { responseMimeType: "application/json", temperature: 0.5 }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: formatApiError(res, errBody) };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);
    const targetObj = Array.isArray(parsed) ? parsed[0] : parsed;

    // Enforce strict environment matching so LLM hallucination cannot drift environment
    targetObj.theme = environment.theme;
    targetObj.lighting = JSON.parse(JSON.stringify(environment.lighting));
    targetObj.environment_items = JSON.parse(JSON.stringify(environment.environment_items));
    targetObj.details = environment.details ? JSON.parse(JSON.stringify(environment.details)) : [];

    const val = validateDirectorScript(targetObj);
    if (val.normalized) {
      return { success: true, scene: sanitizeSceneShake(val.normalized, actionDescription), rawText };
    }

    return {
      success: false,
      error: `Phân cảnh không hợp lệ: ${val.errors.join("; ")}`,
      rawText,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Lỗi tạo phân cảnh theo mô tả: ${err.message}`,
    };
  }
}

/**
 * Scene Description Specification for multi-scene video generation
 */
export interface SceneDescriptionSpec {
  environment: NamedEnvironmentPreset;
  actionDescription: string;
  duration_sec?: number;
  title?: string;
  dialogue?: string;
  cameraShot?: CameraShotType | "auto";
}

/**
 * GENERATE MULTI-SCENE FILM DIRECTLY FROM USER DESCRIPTIONS & REUSABLE NAMED SETS
 * All scenes sharing the same environment will have 100% IDENTICAL backgrounds!
 */
export async function generateFilmFromDescriptions(
  sceneSpecs: SceneDescriptionSpec[],
  options: {
    apiKey?: string;
    model?: string;
    availableCharacters?: NamedCharacterPreset[];
  } = {}
): Promise<GenerateFilmResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key.",
    };
  }

  if (!sceneSpecs || sceneSpecs.length === 0) {
    return {
      success: false,
      error: "Danh sách phân cảnh rỗng.",
    };
  }

  const castSummary = (options.availableCharacters || [])
    .map(
      (c) =>
        `- Diễn Viên: "${c.name}" (ID: "${c.id}") | Khung thân (Base): "${c.base}" | Trang phục (Costume): "${c.costume}" | Mặt: "${c.face || "face_calm"}" | Đồ vật: "${c.defaultHeldItem || "none"}"`
    )
    .join("\n");

  const promptSections = sceneSpecs.map((spec, i) => {
    const camReq =
      spec.cameraShot && spec.cameraShot !== "auto"
        ? `- Cỡ Cảnh Chỉ Định (BẮT BUỘC): "${spec.cameraShot}" (khóa target_actor_id vào nhân vật chính)`
        : `- Cỡ Cảnh (AI Tự Đạo Diễn Đa Góc Máy): Tự suy luận chọn 1 góc máy (nếu cảnh ngắn) HOẶC đạo diễn chuỗi 2–4 góc máy nối tiếp bằng "camera.keyframes" theo đúng diễn biến hành động & lời thoại trong thời lượng ${spec.duration_sec || 6}s (shake mặc định "none").`;

    return `[CẢNH ${i + 1}]:
- Bối Cảnh Cố Định: "${spec.environment.name}" (Theme: "${spec.environment.theme}", Sky: "${spec.environment.lighting.sky_preset}")
- Công trình cố định: ${JSON.stringify(spec.environment.environment_items.map((e) => e.asset_id))}
- Mô Tả Hành Động & Nhân Vật: """${spec.actionDescription.trim() || "Nhân vật bước đi cẩn trọng trong màn đêm."}"""
- Lời thoại / Phụ đề: """${spec.dialogue ? spec.dialogue.trim() : "..."}"""
- Thời lượng: ${spec.duration_sec || 6}s
${camReq}`;
  }).join("\n\n");

  const userPrompt = `BẠN LÀ CỖ MÁY ĐẠO DIỄN HOẠT HÌNH 2D THEO MÔ TẢ TRỰC TIẾP.
Dưới đây là danh sách ${sceneSpecs.length} phân cảnh. Mỗi phân cảnh đã được gán sẵn một BỐI CẢNH CỐ ĐỊNH và MÔ TẢ HÀNH ĐỘNG NHÂN VẬT cụ thể:

${promptSections}

YÊU CẦU ĐẠO DIỄN:
1. Bạn KHÔNG tự bịa cốt truyện hay thay đổi bối cảnh. Hãy đọc mô tả hành động của từng cảnh và tạo mảng "actors" cùng chuyển động "motion" khớp chính xác 100%.
${castSummary ? `2. KHÓA RẮC-CO DIỄN VIÊN (BẮT BUỘC 100%):
Dưới đây là DÀN DIỄN VIÊN CỐ ĐỊNH CỦA BỘ PHIM:
${castSummary}
- Khi phân cảnh có nhân vật xuất hiện, BẮT BUỘC gán đúng "base" và "costume" tương ứng của diễn viên đó. TUYỆT ĐỐI KHÔNG tự tiện đổi sang trang phục khác giữa các phân cảnh để giữ đúng rắc-co điện ảnh!
3. Giữ nguyên 100% theme, lighting, environment_items và details của bối cảnh được chỉ định cho mỗi cảnh. Các cảnh có chung bối cảnh BẮT BUỘC PHẢI CÓ BỐI CẢNH Y HỆT NHAU.` : `2. Giữ nguyên 100% theme, lighting, environment_items và details của bối cảnh được chỉ định cho mỗi cảnh. Các cảnh có chung bối cảnh BẮT BUỘC PHẢI CÓ BỐI CẢNH Y HỆT NHAU.`}
4. ĐẠO DIỄN GÓC MÁY ĐIỆN ẢNH & ĐA GÓC MÁY TRONG 1 CẢNH (AI MULTI-SHOT DIRECTOR - BẮT BUỘC):
   Mỗi cảnh BẮT BUỘC sinh khối "camera" điện ảnh phù hợp (TUYỆT ĐỐI KHÔNG để tất cả đều là "wide" tĩnh):
   - Nếu cảnh có Cỡ Cảnh Chỉ Định, tuân thủ cỡ cảnh đó.
   - Nếu là "AI Tự Đạo Diễn Đa Góc Máy" (mặc định): bạn hãy TỰ SUY LUẬN như đạo diễn phim kinh dị để quyết định góc máy phù hợp nhất cho từng diễn biến trong cảnh!
     * Với cảnh dài (≥ 6s), hoặc cảnh có nhiều hành động/nhiều câu thoại/nhiều nhân vật/cú twist: BẮT BUỘC khai thác mảng "keyframes" gồm **2 đến 4 góc máy nối tiếp** bám sát nhịp lời thoại & hành động từ 0 đến duration_sec!
     * Dùng "transition": "cut" khi chuyển góc dứt khoát (vd: toàn cảnh → cắt cận mặt, hoặc shot/reverse-shot giữa "actor_1" và "actor_2"), hoặc "transition": "smooth" (transitionDurationSec: 0.8–1.4) khi muốn lia/zoom mượt ma mị.
     * Mỗi keyframe nên chọn đúng "target_actor_id" tương ứng (vd nhịp 1 toàn cảnh, nhịp 2 trung cảnh "actor_1", nhịp 3 cận cảnh khuôn mặt "actor_1" hoặc bóng ma "actor_2").
     * "shake" mặc định luôn là "none" (CHỈ dùng shake khi mô tả/lời thoại có động đất, sụp đổ, nổ tung hoặc jumpscare giật mình).
   - Khi dùng "medium", "close_up", "extreme_close_up", "dutch_tilt", BẮT BUỘC điền target_actor_id trỏ vào ID nhân vật tương ứng (ví dụ "actor_1") để camera bám theo!
4. QUY ĐỊNH CHO MỖI ACTOR TRONG DANH SÁCH "actors":
   - "id": id duy nhất ví dụ "actor_1", "actor_2"
   - "facing": "left" | "right" (BẮT BUỘC CÓ trên mọi actor).
   - "base": "male_adult" | "female_adult" | "elder_hunched" | "brute_hulking" | "skeletal_emaciated" | "ghost_wraith" | "creepy_child" | "jiangshi_corpse" | "demon_shadow"
   - "costume": "outfit_tattered_tunic" | "outfit_flowing_ao_dai" | "outfit_shrouded_cloak" | "outfit_mandarin_court" | "outfit_monk_cassock" | "outfit_shredded_burial" | "outfit_ancient_armor" | "outfit_child_pajamas" | "outfit_doctor_coat" | "outfit_patient_gown" | "outfit_modern_casual" | "outfit_traditional_ba_ba" | "outfit_funeral_white"
   - "face": "face_calm" | "face_scared" | "face_creepy_smile" | "face_bleeding_eyes" | "face_old_wrinkled" | "face_rage_furious" | "face_pale_corpse" | "face_weeping_ghost" | "face_sewn_mouth" | "face_haggard_gaunt" | "face_faceless" | "face_glowing_hollow" | "face_talisman_covered" | "face_headless"
   - "pose": "pose_standing" | "pose_sitting" | "pose_sitting_twisted_legs" | "pose_holding" | "pose_shivering" | "pose_walking" | "pose_crawling" | "pose_reaching" (ở ground slots) | "pose_floating" | "pose_hanging" (ở air slots)
   - "slot": "far_left" | "mid_left" | "center" | "mid_right" | "far_right" (hoặc "air_left" | "air_center" | "air_right")
   - "offsetX": 0, "offsetY": 0 (nếu tiếp đất thì offsetY bắt buộc bằng 0)
   - "heldItem": "none" | "item_storm_lantern" | "item_paper_lantern" | "item_soul_candle" | "item_peach_wood_sword" | "item_yellow_talisman" | "item_rusty_sickle" | "item_ritual_bell" | "item_tattered_doll" | "item_tattered_umbrella" | "item_flashlight" | "item_scalpel" | "item_smartphone" | "item_severed_head" | "item_mysterious_note" | "item_offering_toys" | "item_areca_palm_fan" | "item_fresh_ginger" | "item_oil_lamp"
   - "heldHand": "right" | "left"
   - "motion": NẾU NHÂN VẬT ĐỨNG YÊN THÌ BỎ HẲN TRƯỜNG NÀY (TUYỆT ĐỐI KHÔNG để null hay {}). Chỉ khi nhân vật di chuyển từ điểm A sang điểm B mới thêm khối: { "targetSlot": "mid_right", "targetOffsetX": 0, "startTimeSec": 0.2, "endTimeSec": 5, "easing": "ease_in_out", "autoFaceTarget": true, "movingPose": "pose_walking" }.
5. Xuất ra một JSON ARRAY gồm đúng ${sceneSpecs.length} đối tượng DirectorSceneScript:
[
  {
    "scene_id": "scene_01",
    "title": "...",
    "duration_sec": 6,
    "theme": "...",
    "lighting": { ... },
    "camera": {
      "shot": "wide",
      "target_actor_id": "actor_1",
      "shake": "none",
      "keyframes": [
        { "startTimeSec": 0, "transition": "cut", "shot": "wide", "shake": "none" },
        { "startTimeSec": 2.5, "transition": "cut", "shot": "medium", "target_actor_id": "actor_1", "shake": "none" },
        { "startTimeSec": 4.5, "transition": "smooth", "transitionDurationSec": 0.9, "shot": "close_up", "target_actor_id": "actor_1", "shake": "none" }
      ]
    },
    "environment_items": [ ... ],
    "actors": [
      {
        "id": "actor_1",
        "base": "male_adult",
        "costume": "outfit_modern_casual",
        "face": "face_scared",
        "pose": "pose_standing",
        "facing": "right",
        "slot": "mid_left",
        "offsetX": 0,
        "offsetY": 0,
        "scale": 1,
        "heldItem": "item_flashlight",
        "heldHand": "right"
      }
    ],
    "details": [ ... ],
    "dialogue": "..."
  }
]`;

  try {
    const res = await callGeminiApiWithRetry(
      apiKey,
      model,
      GEMINI_DIRECTOR_SYSTEM_INSTRUCTION,
      userPrompt,
      { responseMimeType: "application/json", temperature: 0.5 }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: formatApiError(res, errBody) };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);
    const rawList: any[] = Array.isArray(parsed) ? parsed : [parsed];

    const validScenes: DirectorSceneScript[] = [];
    const validationErrors: string[] = [];

    rawList.slice(0, sceneSpecs.length).forEach((sc, idx) => {
      const spec = sceneSpecs[idx];
      // STRICT ENVIRONMENT ENFORCEMENT: Override environment fields with the exact preset
      sc.theme = spec.environment.theme;
      sc.lighting = JSON.parse(JSON.stringify(spec.environment.lighting));
      sc.environment_items = JSON.parse(JSON.stringify(spec.environment.environment_items));
      sc.details = spec.environment.details ? JSON.parse(JSON.stringify(spec.environment.details)) : [];
      if (spec.duration_sec) sc.duration_sec = spec.duration_sec;
      if (spec.title) sc.title = spec.title;
      if (spec.dialogue && spec.dialogue.trim()) sc.dialogue = spec.dialogue.trim();

      // Enforce explicit manual single cameraShot ONLY when user picked a specific shot instead of "auto"
      if (spec.cameraShot && spec.cameraShot !== "auto") {
        if (!sc.camera || typeof sc.camera !== "object") {
          sc.camera = { shot: spec.cameraShot, target_actor_id: sc.actors?.[0]?.id };
        } else {
          sc.camera.shot = spec.cameraShot;
          delete sc.camera.keyframes;
          if (!sc.camera.target_actor_id && sc.actors?.[0]?.id) {
            sc.camera.target_actor_id = sc.actors[0].id;
          }
        }
      }

      const val = validateDirectorScript(sc);
      if (val.normalized) {
        const spec = sceneSpecs[idx];
        validScenes.push(
          sanitizeSceneShake(val.normalized, [spec?.actionDescription || "", spec?.dialogue || ""])
        );
      } else {
        validationErrors.push(`Cảnh ${idx + 1}: ${val.errors.join("; ")}`);
      }
    });

    if (validScenes.length === 0) {
      return {
        success: false,
        error: `Không thể tạo phân cảnh: ${validationErrors.join(" | ")}`,
        rawText,
      };
    }

    return {
      success: true,
      scenes: validScenes,
      rawText,
      modelUsed: model,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Lỗi kết nối máy chủ Gemini: ${err.message}`,
    };
  }
}

/**
 * AI CREATOR: Generate a new Named Environment from natural language description
 * E.g., "Miếu hoang cô hồn trăng máu có giếng cạn bên phải và bùa dán lơ lửng"
 */
export async function generateNamedEnvironmentFromPrompt(
  descriptionPrompt: string,
  options: {
    apiKey?: string;
    model?: string;
  } = {}
): Promise<{ success: boolean; environment?: NamedEnvironmentPreset; error?: string }> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key.",
    };
  }

  const userPrompt = `Người dùng muốn tạo một BỐI CẢNH CHUNG 2D (Named Environment) dùng lại cho nhiều phân cảnh phim hoạt hình kinh dị:
Mô tả bối cảnh: """${descriptionPrompt}"""

YÊU CẦU:
1. Hãy tạo một đối tượng JSON NamedEnvironmentPreset hợp lệ 100%:
   - "id": "env_custom_${Date.now().toString(36)}",
   - "name": "Đặt tên tiếng Việt ngắn gọn, ấn tượng (vd: 'Miếu Hoang Trăng Máu', 'Cầu Gãy U Minh')",
   - "description": "Tóm tắt ngắn đặc điểm bối cảnh",
   - "theme": "rural_graveyard" | "abandoned_village" | "cursed_swamp",
   - "lighting": { "sky_preset": "blood_moon"|"foggy_night"|"stormy_dark"|"eclipse_abyss", "fog_density": number, "thunder_flash": boolean },
   - "environment_items": danh sách 1-3 công trình đặt đúng quy tắc vị trí neo (cây đa/cây gallows chỉ ở far_left/far_right; mộ/miếu/giếng ở mid_left/center/mid_right; lều/cầu ở far_left/center/far_right),
   - "details": danh sách 1-3 đạo cụ cảnh (quạ đen, ma trơi, lồng đèn, bát hương, sọ người, bùa treo) đặt đúng vùng cho phép.
KHÔNG thêm nhân vật vào đây (chỉ tạo bối cảnh môi trường).

TRẢ VỀ CHÍNH XÁC MỘT ĐỐI TƯỢNG JSON DUY NHẤT:`;

  try {
    const res = await callGeminiApiWithRetry(
      apiKey,
      model,
      GEMINI_DIRECTOR_SYSTEM_INSTRUCTION,
      userPrompt,
      { responseMimeType: "application/json", temperature: 0.6 }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: formatApiError(res, errBody) };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);
    const targetObj: NamedEnvironmentPreset = Array.isArray(parsed) ? parsed[0] : parsed;

    if (!targetObj.name || !targetObj.theme) {
      return { success: false, error: "Dữ liệu bối cảnh không hợp lệ." };
    }

    return { success: true, environment: targetObj };
  } catch (err: any) {
    return { success: false, error: `Lỗi tạo bối cảnh: ${err.message}` };
  }
}

/**
 * AI HELPER: Generate a custom NamedCharacterPreset from a user description to lock continuity (raccord)
 */
export async function generateCharacterPresetFromDescription(
  descriptionPrompt: string,
  options: {
    apiKey?: string;
    model?: string;
  } = {}
): Promise<{ success: boolean; character?: NamedCharacterPreset; error?: string }> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key.",
    };
  }

  const userPrompt = `Người dùng muốn tạo một DIỄN VIÊN DÙNG LẠI (Named Character Preset) để khóa rắc-co cho phim hoạt hình kinh dị 2D Limbo:
Mô tả nhân vật: """${descriptionPrompt}"""

DANH MỤC TÀI NGUYÊN HỆ THỐNG:
- Khung nhân vật (base): "male_adult" | "female_adult" | "elder_hunched" | "brute_hulking" | "skeletal_emaciated" | "ghost_wraith" | "creepy_child" | "jiangshi_corpse" | "demon_shadow"
- Trang phục (costume): "outfit_tattered_tunic" | "outfit_flowing_ao_dai" | "outfit_shrouded_cloak" | "outfit_mandarin_court" | "outfit_monk_cassock" | "outfit_shredded_burial" | "outfit_ancient_armor" | "outfit_child_pajamas" | "outfit_doctor_coat" | "outfit_patient_gown" | "outfit_modern_casual" | "outfit_traditional_ba_ba" | "outfit_funeral_white"
- Biểu cảm (face): "face_calm" | "face_scared" | "face_creepy_smile" | "face_bleeding_eyes" | "face_old_wrinkled" | "face_rage_furious" | "face_pale_corpse" | "face_weeping_ghost" | "face_sewn_mouth" | "face_haggard_gaunt" | "face_faceless" | "face_glowing_hollow" | "face_talisman_covered" | "face_headless"
- Đồ vật (defaultHeldItem): "none" | "item_storm_lantern" | "item_paper_lantern" | "item_soul_candle" | "item_peach_wood_sword" | "item_yellow_talisman" | "item_rusty_sickle" | "item_ritual_bell" | "item_tattered_doll" | "item_tattered_umbrella" | "item_flashlight" | "item_scalpel" | "item_smartphone" | "item_severed_head" | "item_mysterious_note" | "item_offering_toys" | "item_areca_palm_fan" | "item_fresh_ginger" | "item_oil_lamp"

YÊU CẦU:
Tạo một đối tượng JSON NamedCharacterPreset hợp lệ 100%:
- "id": "char_custom_${Date.now().toString(36)}",
- "name": "Tên diễn viên tiếng Việt (vd: 'Thám Tử Đêm', 'Y Tá Ma Ám')",
- "description": "Tóm tắt vai trò và tính cách của nhân vật trong cốt truyện",
- "base": chọn 1 base phù hợp nhất,
- "costume": chọn 1 costume phù hợp nhất,
- "face": chọn 1 face đặc trưng,
- "defaultHeldItem": chọn 1 item phù hợp,
- "defaultHeldHand": "right" | "left",
- "scale": number từ 0.7 đến 1.3

TRẢ VỀ CHÍNH XÁC MỘT ĐỐI TƯỢNG JSON DUY NHẤT:`;

  try {
    const res = await callGeminiApiWithRetry(
      apiKey,
      model,
      GEMINI_DIRECTOR_SYSTEM_INSTRUCTION,
      userPrompt,
      { responseMimeType: "application/json", temperature: 0.6 }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: formatApiError(res, errBody) };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);
    const targetObj: NamedCharacterPreset = Array.isArray(parsed) ? parsed[0] : parsed;

    if (!targetObj.name || !targetObj.base) {
      return { success: false, error: "Dữ liệu nhân vật không hợp lệ." };
    }

    return { success: true, character: targetObj };
  } catch (err: any) {
    return { success: false, error: `Lỗi tạo nhân vật: ${err.message}` };
  }
}

/**
 * AUTO-FILL STORY BREAKDOWN ASSISTANT SPECIFICATION
 */
export interface AutoFillSceneDraft {
  title: string;
  environmentId: string;
  actionDescription: string;
  dialogue?: string;
  duration_sec: number;
  cameraShot?: CameraShotType | "auto";
}

export interface MissingAssetItem {
  category: "actor_base" | "costume" | "face" | "held_item" | "structure" | "detail" | "theme" | "sky_preset";
  categoryLabel: string;
  name: string;
  suggestedId: string;
  reason: string;
  replacementAvailable?: string;
}

export interface AssetAuditResult {
  success: boolean;
  isSufficient: boolean;
  missingAssets: MissingAssetItem[];
  summary: string;
  error?: string;
  rawText?: string;
}

export interface ProjectRaccordResult {
  success: boolean;
  culturalTheme?: string;
  summary?: string;
  characters?: NamedCharacterPreset[];
  environments?: NamedEnvironmentPreset[];
  error?: string;
  rawText?: string;
}

/**
 * AI PRODUCTION ASSISTANT:
 * Analyzes a pre-production breakdown document (Bảng bóc tách thực thể kịch bản)
 * and automatically assembles (ghép) dedicated NamedCharacterPresets and NamedEnvironmentPresets
 * strictly conforming to cultural/epoch consistency and valid engine assets.
 */
export async function generateProjectRaccordFromBreakdown(
  breakdownText: string,
  options: {
    apiKey?: string;
    model?: string;
  } = {}
): Promise<ProjectRaccordResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key để tiếp tục.",
    };
  }

  const rawCleaned = breakdownText.trim();
  if (!rawCleaned) {
    return {
      success: false,
      error: "Vui lòng nhập nội dung bảng bóc tách thực thể kịch bản.",
    };
  }

  const userPrompt = `BẠN LÀ GIÁM ĐỐC NGHỆ THUẬT & THIẾT KẾ BỐI CẢNH (PRODUCTION DESIGNER & CASTING DIRECTOR) CHO PHIM HOẠT HÌNH 2D LIMBO ENGINE.
Người dùng cung cấp một BẢNG BÓC TÁCH THỰC THỂ TIỀN KỲ (SCRIPT BREAKDOWN) cho một dự án phim hoạt hình kinh dị bóng đen:

"""
${rawCleaned}
"""

KHO TÀI NGUYÊN HOẠT HÌNH 2D SẴN CÓ TRONG HỆ THỐNG (CHỈ ĐƯỢC CHỌN TỪ ĐÂY ĐỂ LẮP GHÉP, KHÔNG TỰ BỊA ID MỚI):

1. KHUNG NHÂN VẬT (Bases - 9 loại):
   - "male_adult" (Nam thanh niên, sinh viên, người lữ khách gầy)
   - "female_adult" (Nữ thanh niên, phụ nữ thôn quê, bóng ma tóc dài)
   - "elder_hunched" (Bà lão / Cụ già lưng còng 0.85x, tóc búi)
   - "brute_hulking" (Đồ tể / Hộ pháp lực lưỡng 1.2x)
   - "skeletal_emaciated" (Kẻ gầy trơ xương / Ngạ quỷ 1.05x)
   - "ghost_wraith" (Bóng ma oan hồn bay lơ lửng, không chân)
   - "creepy_child" (Đứa trẻ ma / Trẻ em nhỏ bé 0.65x)
   - "jiangshi_corpse" (Cương thi)
   - "demon_shadow" (Quỷ bóng đen 1.25x sừng cong)

2. TRANG PHỤC (Costumes - 13 bộ):
   - "outfit_traditional_ba_ba" (Áo bà ba truyền thống Nam Bộ & quần lụa đen) -> RẤT QUAN TRỌNG CHO BỐI CẢNH ĐỒNG QUÊ / MIỀN TÂY!
   - "outfit_funeral_white" (Trang phục tang lễ trắng xô gai & dải khăn tang quấn trán) -> ĐÁM TANG / THỨC DẬY TRONG NHÀ TANG!
   - "outfit_tattered_tunic" (Áo tơi sờn rách người nghèo nông thôn)
   - "outfit_flowing_ao_dai" (Áo dài cổ truyền tà rách)
   - "outfit_shrouded_cloak" (Áo choàng trùm đầu Reaper)
   - "outfit_mandarin_court" (Quan phục triều đình)
   - "outfit_monk_cassock" (Áo cà sa pháp sư trừ tà)
   - "outfit_shredded_burial" (Vải liệm tử thi)
   - "outfit_ancient_armor" (Giáp tướng cổ vỡ nát)
   - "outfit_child_pajamas" (Yếm hoa trẻ thơ / quần áo trẻ em đơn sơ)
   - "outfit_modern_casual" (Đồ hoodie / áo thun thường nhật)
   - "outfit_doctor_coat" (Áo blouse bác sĩ - CHỈ DÙNG CHO ĐÔ THỊ HIỆN ĐẠI)
   - "outfit_patient_gown" (Áo bệnh nhân sọc xanh - CHỈ DÙNG CHO ĐÔ THỊ HIỆN ĐẠI)

3. BIỂU CẢM KHUÔN MẶT (Faces - 14 mặt):
   - "face_calm", "face_scared", "face_creepy_smile", "face_bleeding_eyes", "face_old_wrinkled", "face_rage_furious", "face_pale_corpse", "face_weeping_ghost", "face_sewn_mouth", "face_haggard_gaunt", "face_faceless", "face_glowing_hollow", "face_talisman_covered", "face_headless"

4. ĐỒ VẬT CẦM TAY (Held Items - 18 món):
   - "none"
   - "item_oil_lamp" (đèn dầu hột vịt cầm tay soi bóng đêm)
   - "item_areca_palm_fan" (quạt mo cau phe phẩy khi oi nóng)
   - "item_fresh_ginger" (lát gừng tươi giữ khí trừ tà)
   - "item_offering_toys" (nải chuối & đồ chơi đất nung cúng cô hồn)
   - "item_storm_lantern" (đèn bão sắt / đèn dầu)
   - "item_paper_lantern" (lồng đèn giấy)
   - "item_soul_candle" (nến triệu hồn)
   - "item_peach_wood_sword" (kiếm gỗ đào)
   - "item_yellow_talisman" (lá bùa vàng)
   - "item_rusty_sickle" (lưỡi liềm rỉ sét)
   - "item_ritual_bell" (chuông đồng Tam Thanh)
   - "item_tattered_doll" (búp bê vải rách)
   - "item_tattered_umbrella" (ô rách)
   - "item_flashlight" (đèn pin hiện đại)
   - "item_scalpel" (dao mổ phẫu thuật)
   - "item_smartphone" (điện thoại phát sáng)
   - "item_severed_head" (thủ cấp đứt lìa)
   - "item_mysterious_note" (mẩu giấy bí ẩn vương máu)

5. CÔNG TRÌNH BỐI CẢNH (Structures - 30 công trình):
   - Bối cảnh Đồng Quê / Cổ Phong / Gian Nhà Cổ / Miền Tây:
     * "structure_small_wooden_table" (Bàn gỗ nhỏ nông thôn đặt đèn dầu và radio) -> mid_left | center | mid_right
     * "structure_wooden_window" (Cửa sổ gỗ ván nông thôn khép hờ hắt sương lạnh) -> far_left | mid_left | mid_right | far_right
     * "structure_wooden_chair" (Ghế gỗ tựa gia đình - tương tác ngồi vừa khít pose_sitting, pose_sitting_twisted_legs) -> mọi ground slot
     * "structure_wooden_bed" (Giường ngủ gỗ gia đình - tương tác nằm vừa khít pose_lying_down kèm offsetY: -80, hoặc ngồi mép giường) -> mọi ground slot
     * "structure_bamboo_bed_net" (Giường tre nông thôn giăng mùng) -> mọi ground slot
     * "structure_wooden_coffin" (Cỗ quan tài gỗ trong nhà) -> mid_left | center | mid_right
     * "structure_wooden_latch_door" (Cửa gỗ cũ cài then ngang) -> mid_left | center | mid_right
     * "structure_rural_passenger_bus" (Xe đò khách cũ vùng quê) -> mọi ground slot
     * "structure_coconut_banana_grove" (Rặng dừa nước & bụi chuối) -> far_left | far_right
     * "structure_monkey_bridge" (Cầu khỉ tre miền Tây chênh vênh) -> mọi ground slot
     * "structure_wooden_sampan" (Xuồng ba lá / ghe nước miền Tây chở bông súng) -> mọi ground slot
     * "dilapidated_hut" (Căn lều tranh / vách nứa xiêu vẹo) -> far_left | center | far_right
     * "creepy_banyan_tree" (Cây đa cổ thụ) -> far_left | far_right
     * "ancient_tomb" (Mộ cổ bia đá) -> mid_left | center | mid_right
     * "abandoned_shrine" (Miếu hoang cô hồn) -> mid_left | center | mid_right
     * "broken_wooden_bridge" (Cầu gỗ gãy nhịp) -> far_left | center | far_right
     * "creepy_well" (Giếng cạn oan hồn) -> mid_left | center | mid_right
     * "scarecrow_of_the_damned" (Bù nhìn quỷ ám) -> mọi ground slot
   - Bối cảnh Đô Thị / Hiện Đại (CHỈ DÙNG KHI CỐT TRUYỆN THUỘC THỂ LOẠI ĐÔ THỊ HIỆN ĐẠI):
     * "hospital_operating_bed", "hotel_reception_desk", "supermarket_shelf_aisle", "creepy_elevator_doors", "dining_table_chairs", "bus_interior", "creepy_bathtub", "market_stall_tent", "abandoned_subway_station", "rusty_train_tracks_tunnel", "structure_old_apartment_gate"

6. ĐẠO CỤ BỐI CẢNH (Details - 11 đạo cụ):
   - "detail_black_crow" (Quạ đen)
   - "detail_will_o_wisp" (Đốm ma trơi xanh lân tinh)
   - "detail_blood_lantern" (Lồng đèn máu / ngọn đèn dầu)
   - "detail_incense_bowl" (Bát hương tàn / khói nhang cuộn)
   - "detail_skull_pile" (Đống sọ người)
   - "detail_hanging_talisman" (Dây bùa treo)
   - "detail_iv_drip_stand" (Cột truyền dịch - hiện đại)
   - "detail_shopping_cart" (Xe đẩy siêu thị - hiện đại)
   - "detail_surveillance_camera" (Camera an ninh - hiện đại)
   - "detail_flickering_ceiling_lamp" (Đèn huỳnh quang trần - hiện đại)
   - "detail_broken_mirror" (Gương vỡ nứt vấy máu)

7. THEMES & SKY PRESETS:
   - Themes: "abandoned_village" (Làng quê bỏ hoang), "cursed_swamp" (Đầm lầy / ven kênh sông nước), "rural_graveyard" (Bãi tha ma cổ), "modern_indoor" (Trong nhà hiện đại), "vehicle_interior" (Khoang xe), "urban_night_market" (Chợ đêm đô thị)
   - Sky: "foggy_night" (Sương mù lạnh buốt), "stormy_dark" (Bão đêm / Đêm oi ả ngột ngạt), "blood_moon" (Trăng máu), "eclipse_abyss" (Nhật thực lửa xanh)

QUY TẮC LẮP GHÉP BẮT BUỘC (TUYỆT ĐỐI TUÂN THỦ):
1. NHẬN DIỆN THỜI ĐẠI & KHÔNG GIAN BỐI CẢNH (CULTURAL & EPOCH FILTER):
   - Đọc kỹ bảng bóc tách để nhận diện đúng thể loại & thời đại kịch bản:
     * Ví dụ: "Đồng quê / Dân gian Việt Nam", "Đô thị / Bệnh viện hiện đại", "Khách sạn / Chung cư u ám", "Chuyến xe đêm / Ga tàu ngầm", "Cổ phong / Cương thi miếu hoang"...
   - NGUYÊN TẮC NHẤT QUÁN THỜI ĐẠI & KHÔNG GIAN (CHỐNG LỆCH NGỮ CẢNH):
     * Nếu kịch bản là ĐỒNG QUÊ / DÂN GIAN VIỆT NAM (nhà lá, bến sông, ruộng đồng, miếu cổ...): Tuyệt đối CẤM chọn các công trình / trang phục / đạo cụ hiện đại (như hospital_operating_bed, creepy_elevator_doors, supermarket_shelf_aisle, outfit_doctor_coat, outfit_patient_gown, detail_surveillance_camera, detail_iv_drip_stand). Bắt buộc chọn asset phù hợp nông thôn (cầu khỉ, xuồng ba lá, lều tranh, áo bà ba, áo tơi, quạt mo, gừng tươi...).
     * Nếu kịch bản là ĐÔ THỊ / HIỆN ĐẠI (Bệnh viện, khách sạn, siêu thị, chung cư, xe buýt...): Bắt buộc dùng đúng asset hiện đại (hospital_operating_bed, hotel_reception_desk, creepy_elevator_doors, supermarket_shelf_aisle, bus_interior, creepy_bathtub, outfit_modern_casual, outfit_doctor_coat, outfit_patient_gown, item_flashlight, item_smartphone...). CẤM chọn bừa xuồng ba lá, cầu khỉ, hay quan phục phong kiến.
     * Nếu kịch bản là CỔ TRANG / PHONG KIẾN / CƯƠNG THI: Bắt buộc chọn quan phục (outfit_mandarin_court), áo cà sa (outfit_monk_cassock), miếu hoang, mộ cổ, kiếm gỗ đào, bùa vàng...
2. LẮP GHÉP DÀN DIỄN VIÊN (characters - từ 2 đến 6 diễn viên):
   - Trích xuất toàn bộ các nhân vật xuất hiện trong bảng bóc tách của người dùng.
   - Đặt "id" duy nhất (vd: "char_proj_...").
   - Gán đúng "name", "description", "base", "costume", "face", "defaultHeldItem", "defaultHeldHand", "scale" theo đúng mô tả của người dùng.
3. LẮP GHÉP DÀN BỐI CẢNH DÙNG LẠI (environments - từ 2 đến 5 bối cảnh):
   - Trích xuất các địa điểm chính trong kịch bản mà người dùng đã mô tả.
   - Đặt "id" duy nhất (vd: "env_proj_...").
   - Gán đúng "name", "description", "theme", "lighting" (sky_preset, fog_density, thunder_flash, weather).
   - "environment_items": mảng 1-3 công trình với slot neo hợp lệ.
   - "details": mảng 1-3 đạo cụ cảnh đặt đúng slot.

TRẢ VỀ CHÍNH XÁC MỘT ĐỐI TƯỢNG JSON DUY NHẤT:
{
  "culturalTheme": "Chủ đề văn hóa & không gian kịch bản (vd: 'Đồng quê dân gian Việt Nam' hoặc 'Đô thị hiện đại')",
  "summary": "Tóm tắt ngắn gọn các nhân vật và bối cảnh đã phân tích và lắp ghép thành công...",
  "characters": [
    {
      "id": "char_proj_example",
      "name": "Tên nhân vật",
      "description": "Vai trò, đặc điểm...",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_calm",
      "defaultHeldItem": "item_flashlight",
      "defaultHeldHand": "right",
      "scale": 1.0
    }
  ],
  "environments": [
    {
      "id": "env_proj_example",
      "name": "Tên bối cảnh",
      "description": "Mô tả không gian...",
      "theme": "modern_indoor",
      "lighting": { "sky_preset": "flickering_fluorescent", "fog_density": 0.6, "thunder_flash": false },
      "environment_items": [
        { "asset_id": "hospital_operating_bed", "slot": "center", "scale": 1.0 }
      ],
      "details": [
        { "id": "detail_lamp_1", "asset_id": "detail_flickering_ceiling_lamp", "slot": "air_center" }
      ]
    }
  ]
}`;

  try {
    const res = await callGeminiApiWithRetry(
      apiKey,
      model,
      GEMINI_DIRECTOR_SYSTEM_INSTRUCTION,
      userPrompt,
      { responseMimeType: "application/json", temperature: 0.3 }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: formatApiError(res, errBody) };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);

    const characters: NamedCharacterPreset[] = Array.isArray(parsed.characters) ? parsed.characters : [];
    const environments: NamedEnvironmentPreset[] = Array.isArray(parsed.environments) ? parsed.environments : [];

    if (characters.length === 0 && environments.length === 0) {
      return {
        success: false,
        error: "Không thể trích xuất nhân vật hoặc bối cảnh từ bảng bóc tách.",
        rawText,
      };
    }

    return {
      success: true,
      culturalTheme: parsed.culturalTheme || "Kinh dị dân gian",
      summary: parsed.summary || `Đã lắp ghép thành công ${characters.length} nhân vật và ${environments.length} bối cảnh chuẩn.`,
      characters,
      environments,
      rawText,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Lỗi phân tích bảng bóc tách: ${err.message}`,
    };
  }
}

export interface BreakdownStoryResult {
  success: boolean;
  drafts?: AutoFillSceneDraft[];
  assetAudit?: AssetAuditResult;
  error?: string;
  rawText?: string;
}

/**
 * AUDIT STORY ASSETS AGAINST GEMINI_DIRECTOR_ASSETS.md
 * Checks if the story implies or requires entities not currently implemented in the 2D SVG engine.
 */
export async function auditStoryAssets(
  storyPrompt: string,
  options: {
    apiKey?: string;
    model?: string;
  } = {}
): Promise<AssetAuditResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    return {
      success: false,
      isSufficient: false,
      missingAssets: [],
      summary: "Chưa cấu hình API Key.",
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key.",
    };
  }

  if (!storyPrompt.trim()) {
    return {
      success: false,
      isSufficient: false,
      missingAssets: [],
      summary: "Cốt truyện trống.",
      error: "Vui lòng nhập nội dung cốt truyện để kiểm tra asset.",
    };
  }

  const userPrompt = `BẠN LÀ CHUYÊN VIÊN KIỂM ĐỊNH TÀI NGUYÊN ĐỒ HỌA (ASSET AUDITOR) DỰA THEO TÀI LIỆU GEMINI_DIRECTOR_ASSETS.md.
Nhiệm vụ của bạn là đọc kỹ cốt truyện dưới đây, nhận diện tất cả các thực thể (nhân vật, trang phục, khuôn mặt, đồ vật cầm tay, công trình bối cảnh, đạo cụ) mà cốt truyện nhắc đến hoặc ngụ ý cần có, và đối chiếu với DANH MỤC ASSETS ĐANG CÓ SẴN TRONG HỆ THỐNG.

CỐT TRUYỆN:
"""
${storyPrompt.trim()}
"""

DANH MỤC TOÀN BỘ ASSETS HIỆN CÓ TRONG GEMINI_DIRECTOR_ASSETS.md:
1. KHUNG NHÂN VẬT (Bases - 9 loại):
   - "male_adult" (Nam thanh niên, lữ khách gầy)
   - "female_adult" (Nữ thanh niên tóc dài)
   - "elder_hunched" (Bà lão / Cụ già lưng còng 0.85x)
   - "brute_hulking" (Đồ tể / Hộ pháp lực lưỡng 1.2x)
   - "skeletal_emaciated" (Kẻ gầy trơ xương / Ngạ quỷ 1.05x)
   - "ghost_wraith" (Bóng ma oan hồn bay lơ lửng, không chân)
   - "creepy_child" (Đứa trẻ ma nhỏ bé 0.65x)
   - "jiangshi_corpse" (Cương thi áo quan nhảy cứng đờ)
   - "demon_shadow" (Quỷ bóng đen to lớn 1.25x sừng cong)

2. TRANG PHỤC (Costumes - 12 bộ):
   - "outfit_tattered_tunic" (Áo tơi sờn rách)
   - "outfit_flowing_ao_dai" (Áo dài tà rách)
   - "outfit_shrouded_cloak" (Áo choàng trùm đầu Reaper)
   - "outfit_mandarin_court" (Quan phục triều đình)
   - "outfit_monk_cassock" (Áo cà sa pháp sư)
   - "outfit_shredded_burial" (Vải liệm tử thi)
   - "outfit_ancient_armor" (Giáp tướng cổ)
   - "outfit_child_pajamas" (Yếm hoa trẻ thơ)
   - "outfit_doctor_coat" (Áo blouse bác sĩ)
   - "outfit_patient_gown" (Áo bệnh nhân)
   - "outfit_modern_casual" (Đồ hoodie hiện đại)
   - "outfit_traditional_ba_ba" (Áo bà ba trắng truyền thống Nam Bộ & quần lụa đen)
   - "outfit_funeral_white" (Trang phục tang lễ trắng xô gai & dải khăn tang)

3. BIỂU CẢM KHUÔN MẶT & ĐẶC ĐIỂM ĐẦU (Faces - 14 mặt):
   - "face_calm", "face_scared", "face_creepy_smile", "face_bleeding_eyes", "face_old_wrinkled", "face_rage_furious", "face_pale_corpse", "face_weeping_ghost", "face_sewn_mouth", "face_haggard_gaunt", "face_faceless", "face_glowing_hollow", "face_talisman_covered", "face_headless" (Cổ đứt lìa / Không đầu)

4. ĐỒ VẬT CẦM TAY (Held Items - 18 món):
   - "none" (tay không)
   - "item_oil_lamp" (đèn dầu hột vịt cầm tay)
   - "item_storm_lantern" (đèn bão sắt)
   - "item_paper_lantern" (lồng đèn giấy)
   - "item_soul_candle" (nến triệu hồn)
   - "item_peach_wood_sword" (kiếm gỗ đào)
   - "item_yellow_talisman" (lá bùa vàng)
   - "item_rusty_sickle" (lưỡi liềm rỉ sét)
   - "item_ritual_bell" (chuông đồng Tam Thanh)
   - "item_tattered_doll" (búp bê vải)
   - "item_tattered_umbrella" (ô rách)
   - "item_flashlight" (đèn pin hiện đại)
   - "item_scalpel" (dao mổ phẫu thuật)
   - "item_smartphone" (điện thoại di động phát sáng)
   - "item_severed_head" (thủ cấp đứt lìa xách tay)
   - "item_mysterious_note" (mẩu giấy bí ẩn vương máu)
   - "item_offering_toys" (nải chuối và đồ chơi đất nung cúng cô hồn)
   - "item_areca_palm_fan" (quạt mo cau)
   - "item_fresh_ginger" (lát gừng tươi giữ khí)

5. CÔNG TRÌNH BỐI CẢNH (Structures - 23 công trình):
   - "creepy_banyan_tree" (Cây đa cổ thụ)
   - "haunted_gallows_tree" (Cây treo cổ rủ cành)
   - "ancient_tomb" (Ngôi mộ cổ và bia đá)
   - "abandoned_shrine" (Miếu hoang cô hồn)
   - "creepy_well" (Giếng cạn oan hồn)
   - "dilapidated_hut" (Lều tranh xiêu vẹo)
   - "broken_wooden_bridge" (Cầu gỗ gãy nhịp)
   - "scarecrow_of_the_damned" (Bù nhìn quỷ ám)
   - "hospital_operating_bed" (Giường mổ bệnh viện)
   - "hotel_reception_desk" (Quầy lễ tân khách sạn)
   - "supermarket_shelf_aisle" (Kệ hàng siêu thị)
   - "creepy_elevator_doors" (Cửa thang máy rùng rợn)
   - "dining_table_chairs" (Bàn ăn nhà hàng)
   - "bus_interior" (Nội thất xe bus đêm bỏ hoang)
   - "creepy_bathtub" (Bồn tắm rỉ sét ngập máu)
   - "market_stall_tent" (Quầy hàng / lều bạt chợ đêm)
   - "abandoned_subway_station" (Cổng ga tàu điện ngầm bỏ hoang)
   - "rusty_train_tracks_tunnel" (Đường ray tàu & đường hầm rỉ sét)
   - "structure_old_apartment_gate" (Cổng sắt chung cư cũ)
   - "structure_wooden_sampan" (Xuồng ba lá / ghe nước miền Tây)
   - "structure_monkey_bridge" (Cầu khỉ tre miền Tây)
   - "structure_wooden_coffin" (Cỗ quan tài gỗ trong nhà)
   - "structure_bamboo_bed_net" (Giường tre nông thôn giăng mùng)
   - "structure_wooden_latch_door" (Cánh cửa gỗ cài then ngang)
   - "structure_rural_passenger_bus" (Xe đò khách cũ vùng quê)
   - "structure_coconut_banana_grove" (Rặng dừa nước & bụi chuối)
   - "structure_wooden_chair" (Ghế gỗ tựa gia đình - ngồi vừa khít)
   - "structure_wooden_bed" (Giường ngủ gỗ gia đình - nằm vừa khít)
   - "structure_small_wooden_table" (Bàn gỗ nhỏ nông thôn)
   - "structure_wooden_window" (Cửa sổ gỗ ván nông thôn)

6. ĐẠO CỤ BỐI CẢNH (Details - 11 đạo cụ):
   - "detail_black_crow" (Quạ đen)
   - "detail_will_o_wisp" (Đốm ma trơi)
   - "detail_blood_lantern" (Lồng đèn máu)
   - "detail_incense_bowl" (Bát hương tàn)
   - "detail_skull_pile" (Đống sọ người)
   - "detail_hanging_talisman" (Dây bùa treo)
   - "detail_iv_drip_stand" (Cột truyền dịch)
   - "detail_shopping_cart" (Xe đẩy siêu thị)
   - "detail_surveillance_camera" (Camera an ninh)
   - "detail_flickering_ceiling_lamp" (Đèn huỳnh quang trần)
   - "detail_broken_mirror" (Gương nhà tắm vỡ nứt vấy máu)

7. THEMES & SKY PRESETS:
   - Themes: rural_graveyard, abandoned_village, cursed_swamp, modern_indoor, vehicle_interior, urban_night_market (Chợ đêm & phố xá đô thị ngoài trời dùng urban_night_market, bên trong xe buýt/tàu xe dùng vehicle_interior)
   - Sky: blood_moon, foggy_night, stormy_dark, eclipse_abyss, flickering_fluorescent, dim_indoor_night

YÊU CẦU KIỂM TRA ĐỐI CHIẾU:
1. KIỂM TRA TÍNH TƯƠNG THÍCH THỜI ĐẠI & VĂN HÓA (EPOCH & CULTURAL CONSISTENCY - BẮT BUỘC):
   - Đánh giá bối cảnh cốt truyện (ví dụ: Đồng quê Việt Nam / Dân gian Nam Bộ vs. Đô thị hiện đại).
   - NẾU CỐT TRUYỆN LÀ ĐỒNG QUÊ / DÂN GIAN (nhà lá, bãi tha ma, ruộng đồng, bờ kênh, then cài, người bệnh ở thôn quê...):
     * TUYỆT ĐỐI KHÔNG ĐƯỢC gán các asset đô thị/hiện đại (như 'hospital_operating_bed', 'creepy_elevator_doors', 'supermarket_shelf_aisle', 'outfit_doctor_coat', 'outfit_patient_gown', 'detail_iv_drip_stand', 'detail_surveillance_camera') làm asset thay thế!
     * Không được coi 'giường mổ bệnh viện hiện đại' là đáp ứng cho 'giường tre / chõng tre / giường người bệnh ở quê'.
     * Nếu câu chuyện cần giường tre / chõng tre nông thôn hoặc cánh cửa gỗ then cài nhà lá mà hệ thống chưa có, BẮT BUỘC BÁO THIẾU ASSET (isSufficient = false) để người dùng nắm được, hoặc nhắc nhở cảnh báo.
2. PHÂN BIỆT RÕ RÀNG HÀNH ĐỘNG TRỰC TIẾP TRƯỚC ỐNG KÍNH (ON-SCREEN) VS. LỜI KỂ NỘI TÂM (OFF-SCREEN / BACKSTORY):
   - Những chi tiết chỉ nằm trong suy nghĩ, ký ức hay lời thuyết minh nền (ví dụ: nhân vật đứng nép bên cửa nhà lá nhớ về người bệnh ở đầu xóm) thì KHÔNG bắt buộc bối cảnh phân cảnh phải dựng phòng bệnh. Bối cảnh phải bám theo địa điểm thực tế nhân vật đang đứng hành động.
3. Phân tích xem trong cốt truyện có chi tiết nào mà hệ thống CHƯA CÓ asset phù hợp không.
- Ví dụ nếu truyện có "cung tên", "súng săn", "chó săn", "ngựa ma", "rìu đốn củi", "thuyền gỗ", "mặt nạ quỷ", v.v. -> đây là các asset mà hệ thống chưa có.
- Nếu phát hiện thiếu asset:
  * "isSufficient": false
  * "missingAssets": mảng các asset thiếu. Mỗi asset gồm:
    - "category": "actor_base" | "costume" | "face" | "held_item" | "structure" | "detail" | "theme" | "sky_preset"
    - "categoryLabel": Tên tiếng Việt phân loại (vd: "Đồ vật cầm tay", "Khung nhân vật", "Công trình bối cảnh")
    - "name": Tên tiếng Việt của thực thể thiếu (vd: "Cung tên gỗ", "Chó săn ma")
    - "suggestedId": ID kỹ thuật đề xuất theo chuẩn hệ thống (vd: "item_wooden_bow", "beast_hunting_dog")
    - "reason": Lý do tại sao cốt truyện cần asset này
    - "replacementAvailable": Gợi ý asset có sẵn gần nhất trong kho có thể tạm thời thay thế (CHỈ gợi ý asset cùng thời đại/văn hóa, KHÔNG gợi ý asset hiện đại cho truyện dân gian!)
- Nếu toàn bộ thực thể trong câu chuyện đều đã có thể đáp ứng trọn vẹn bằng các asset trên:
  * "isSufficient": true
  * "missingAssets": []
  * "summary": "Tất cả các nhân vật, công trình và đạo cụ cho câu chuyện này đều đã có sẵn trong GEMINI_DIRECTOR_ASSETS.md!"

TRẢ VỀ CHÍNH XÁC MỘT ĐỐI TƯỢNG JSON DUY NHẤT:
{
  "isSufficient": true,
  "summary": "Tóm tắt đánh giá mức độ đầy đủ của tài nguyên...",
  "missingAssets": []
}`;

  try {
    const res = await callGeminiApiWithRetry(
      apiKey,
      model,
      GEMINI_DIRECTOR_SYSTEM_INSTRUCTION,
      userPrompt,
      { responseMimeType: "application/json", temperature: 0.2 }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return {
        success: false,
        isSufficient: false,
        missingAssets: [],
        summary: "Lỗi kết nối Gemini API",
        error: formatApiError(res, errBody),
      };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);

    const isSufficient = Boolean(parsed.isSufficient && (!parsed.missingAssets || parsed.missingAssets.length === 0));
    const missingAssets: MissingAssetItem[] = Array.isArray(parsed.missingAssets) ? parsed.missingAssets : [];

    return {
      success: true,
      isSufficient,
      missingAssets,
      summary: parsed.summary || (isSufficient ? "Tài nguyên đầy đủ 100%!" : `Phát hiện ${missingAssets.length} asset cần bổ sung.`),
      rawText,
    };
  } catch (err: any) {
    return {
      success: false,
      isSufficient: false,
      missingAssets: [],
      summary: "Lỗi kiểm tra tài nguyên",
      error: `Lỗi kiểm tra tài nguyên: ${err.message}`,
    };
  }
}

/**
 * AUTO-FILL ASSISTANT:
 * Breaks down raw user story into scene specifications with reusable environments
 * based on dramatic visual scene beats (nhịp thị giác & trường đoạn hành động),
 * while strictly preserving 100% of the user's raw text for voice-over subtitles.
 */
export async function breakdownStoryToSceneDrafts(
  storyPrompt: string,
  availableEnvironments: NamedEnvironmentPreset[],
  options: {
    targetSceneCount?: number | "auto";
    apiKey?: string;
    model?: string;
    voicePace?: VoicePacePreset | number;
    availableCharacters?: NamedCharacterPreset[];
  } = {}
): Promise<BreakdownStoryResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key.",
    };
  }

  const rawCleaned = storyPrompt.trim();
  if (!rawCleaned) {
    return {
      success: false,
      error: "Vui lòng nhập nội dung cốt truyện để phân tích.",
    };
  }

  const envsSummary = availableEnvironments
    .map(
      (env) =>
        `- ID: "${env.id}" | Tên: "${env.name}" | Theme: "${env.theme}" | Sky: "${env.lighting.sky_preset}" | Mô tả: "${env.description || ""}"`
    )
    .join("\n");

  const charsSummary = (options.availableCharacters || [])
    .map(
      (c) =>
        `- Diễn Viên: "${c.name}" | Khung Thân (Base): "${c.base}" | Trang Phục (Costume): "${c.costume}" | Mặt: "${c.face || "face_calm"}" | Đồ Vật: "${c.defaultHeldItem || "none"}" | Vai Trò: "${c.description || ""}"`
    )
    .join("\n");

  const isExactCount =
    typeof options.targetSceneCount === "number" &&
    options.targetSceneCount >= 1 &&
    options.targetSceneCount <= 10;
  const targetCountNum = isExactCount ? (options.targetSceneCount as number) : undefined;

  const sceneCountGuidance = isExactCount
    ? `SỐ LƯỢNG PHÂN CẢNH CHỈ ĐỊNH (BẮT BUỘC): Bạn BẮT BUỘC phải chia toàn bộ câu chuyện thành ĐÚNG ${targetCountNum} phân cảnh.`
    : `SỐ LƯỢNG PHÂN CẢNH TỰ ĐỘNG: Phân tích các nhịp kịch tính và hành động trực quan (Scene Beats) của câu chuyện để chia thành từ 3 đến 6 phân cảnh phù hợp nhất.`;

  const userPrompt = `BẠN LÀ TỔNG ĐẠO DIỄN HOẠT HÌNH KINH DỊ BÓNG ĐEN 2D (LIMBO HORROR ENGINE DIRECTOR).
Nhiệm vụ của bạn là đọc toàn bộ cốt truyện dưới đây, phân tích các nhịp kịch tính và trường đoạn hành động trực quan (Scene Beats), rồi chia thành các phân cảnh hoạt hình 2D sống động tương ứng 1:1 với lời thoại.

CỐT TRUYỆN GỐC CỦA NGƯỜI DÙNG:
"""
${rawCleaned}
"""

DANH SÁCH BỐI CẢNH DÙNG LẠI HIỆN CÓ TRONG THƯ VIỆN CỦA HỆ THỐNG:
${envsSummary}
${charsSummary ? `
DANH SÁCH DÀN DIỄN VIÊN CỐ ĐỊNH CỦA BỘ PHIM (BẮT BUỘC KHÓA RẮC-CO 100%):
${charsSummary}

QUY TẮC RẮC-CO DIỄN VIÊN (BẮT BUỘC):
- Khi viết mô tả hoạt hình (actionDescription), nếu phân cảnh có sự xuất hiện của nhân vật trong danh sách diễn viên trên, BẮT BUỘC phải mô tả đúng ngoại hình (base) và trang phục (costume) của diễn viên đó.
- TUYỆT ĐỐI KHÔNG tự tiện đổi sang trang phục hay vóc dáng khác giữa các phân cảnh để đảm bảo tính liên tục (raccord) của phim!
` : ""}
${sceneCountGuidance}

QUY TẮC ĐẠO DIỄN BẮT BUỘC (TUYỆT ĐỐI TUÂN THỦ):

1. PHÂN CẢNH THEO ĐÚNG NHỊP THỊ GIÁC & HÀNH ĐỘNG (SCENE BEATS):
   - TUYỆT ĐỐI KHÔNG ngắt máy móc theo dấu phẩy hay số lượng từ ngẫu nhiên!
   - Hãy ngắt theo đúng TRƯỜNG ĐOẠN HÀNH ĐỘNG / SỰ KIỆN mà video đang thể hiện trên màn ảnh:
     * Cảnh 1: Khởi đầu, thiết lập nhân vật và bối cảnh (ví dụ: nhân vật đến miếu hoang trong mưa gió).
     * Cảnh 2: Biến cố / Phát hiện hiện tượng ma quái hoặc chạm trán sinh vật bóng đêm (ví dụ: thắp nến, nhìn thấy bóng ma trần nhà).
     * Cảnh 3: Cao trào rùng rợn / Hoảng loạn, rượt đuổi thoát thân hoặc kết cục ám ảnh (ví dụ: đánh rơi đèn, bỏ chạy vào màn đêm).
   - Mỗi phân cảnh phải là một trường đoạn hành động độc lập, có mở đầu và kết thúc trọn vẹn về mặt hình ảnh.

2. BẢO TOÀN 100% NGUYÊN VĂN BẢN GỐC CHO PHẦN LỒNG TIẾNG (dialogue) - TUYỆT ĐỐI QUAN TRỌNG:
   - Người dùng sẽ copy chính xác đoạn text trong trường "dialogue" để đưa vào công cụ lồng tiếng (TTS/ElevenLabs/Vbee), do đó:
   - Trường "dialogue" của mỗi phân cảnh BẮT BUỘC LÀ ĐOẠN TRÍCH NGUYÊN VĂN từ cốt truyện gốc của người dùng tương ứng với hành động diễn ra trong cảnh đó.
   - TUYỆT ĐỐI KHÔNG được tóm tắt!
   - TUYỆT ĐỐI KHÔNG tự ý viết lại (paraphrase) hay đổi từ ngữ!
   - TUYỆT ĐỐI KHÔNG chế thêm lời thoại mới ngoài cốt truyện!
   - NGUYÊN TẮC LIÊN TỤC 100%: Khi ghép "dialogue" của tất cả các cảnh theo thứ tự từ đầu đến cuối (Cảnh 1 + Cảnh 2 + Cảnh 3 + ...), BẮT BUỘC PHẢI KHỚP 100% TỪNG CÂU CHỮ VỚI CÂU CHUYỆN GỐC CỦA NGƯỜI DÙNG! Không một câu nào bị rơi rớt, không một từ nào bị thêm bớt.

3. MÔ TẢ HOẠT HÌNH 2D CHI TIẾT (actionDescription) - TỪ 25 ĐẾN 50 TỪ:
   - Đây là chỉ đạo diễn xuất và bố trí sân khấu đồ họa 2D Limbo Engine.
   - Mô tả hành động BẮT BUỘC PHẢI THỂ HIỆN ĐÚNG nội dung câu chuyện trong đoạn "dialogue" của cảnh đó.
   - BẮT BUỘC nêu rõ 5 yếu tố:
     * Nhân vật (base): ví dụ 'male_adult', 'female_adult', 'elder_hunched', 'demon_shadow', 'ghost_wraith', 'creepy_child'... (NẾU CÓ TRONG DANH SÁCH DIỄN VIÊN CỐ ĐỊNH, BẮT BUỘC DÙNG ĐÚNG BASE VÀ COSTUME CỦA DIỄN VIÊN ĐÓ ĐỂ KHÓA RẮC-CO!).
     * Trang phục (costume), biểu cảm mặt (face), đồ vật cầm tay (heldItem, heldHand).
     * Chuyển động A -> B: vị trí bắt đầu (slot) và vị trí đích đến.
   - TUYỆT ĐỐI CẤM KHÔNG ĐƯỢC VIẾT TÓM TẮT CHUNG CHUNG như "Nhân vật làm theo lời kể" hay "Nhân vật rời khỏi...".

4. BỐI CẢNH DÙNG LẠI (environmentId):
   - Chọn đúng bối cảnh phù hợp trong danh sách. Các cảnh cùng địa điểm BẮT BUỘC dùng chung environmentId để giữ đúng rắc-co cảnh nền.

5. GÓC MÁY ĐIỆN ẢNH (cameraShot):
   - Mặc định đặt "cameraShot": "auto" để AI Đạo diễn ở bước dàn dựng tự do suy luận và bố trí **đa góc máy (camera.keyframes)** linh hoạt cho từng nhịp hành động trong cảnh (chỉ chọn 1 cỡ cảnh cố định nếu cảnh đó thực sự bắt buộc phải khóa duy nhất 1 góc máy từ đầu tới cuối).

TRẢ VỀ CHÍNH XÁC MỘT JSON ARRAY GỒM CÁC ĐỐI TƯỢNG AutoFillSceneDraft (KHÔNG kèm lời giải thích):
[
  {
    "title": "Cảnh 1: Tiêu đề ngắn gọn phản ánh hành động",
    "environmentId": "id_bối_cảnh",
    "cameraShot": "auto",
    "actionDescription": "Mô tả đạo diễn hoạt hình 2D chi tiết từ 25-50 từ...",
    "dialogue": "Đoạn trích nguyên văn câu chuyện gốc tương ứng với cảnh này..."
  }
]`;

  try {
    const res = await callGeminiApiWithRetry(
      apiKey,
      model,
      GEMINI_DIRECTOR_SYSTEM_INSTRUCTION,
      userPrompt,
      { responseMimeType: "application/json", temperature: 0.4 }
    );

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: formatApiError(res, errBody) };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);

    let rawScenes: any[] = [];
    if (Array.isArray(parsed)) {
      rawScenes = parsed;
    } else if (parsed && typeof parsed === "object") {
      if (Array.isArray(parsed.scenes)) {
        rawScenes = parsed.scenes;
      } else if (Array.isArray(parsed.drafts)) {
        rawScenes = parsed.drafts;
      }
    }

    if (rawScenes.length === 0) {
      return { success: false, error: "Không thể phân tách phân cảnh từ phản hồi của AI.", rawText };
    }

    // 1. LẤY TOÀN BỘ LỜI THOẠI ĐỀ XUẤT TỪ AI VÀ ĐỐI CHIẾU VỚI CÂU CHUYỆN GỐC
    const proposedDialogues = rawScenes.map((s) => String(s.dialogue || ""));

    // 2. KHÔI PHỤC NGUYÊN VĂN 100% CỐT TRUYỆN GỐC QUA BỘ HÒA GIẢI CHUẨN
    const reconciledDialogues = reconcileDialogueSlicesToStory(
      rawCleaned,
      proposedDialogues,
      targetCountNum
    );

    const validEnvIds = new Set(availableEnvironments.map((e) => e.id));
    const fallbackEnvId = availableEnvironments[0]?.id || "env_graveyard_foggy";

    const drafts: AutoFillSceneDraft[] = reconciledDialogues.map((dialogueText, idx) => {
      const item = rawScenes[idx] || rawScenes[rawScenes.length - 1] || {};
      let envId = item.environmentId;
      if (!envId || !validEnvIds.has(envId)) {
        envId = fallbackEnvId;
      }
      // Tính thời lượng chuẩn xác theo tốc độ đọc voice-over cho đoạn verbatim dialogue này
      const calculatedDuration = estimateVoiceDurationSec(
        dialogueText,
        options.voicePace || "normal_narrative",
        { minDuration: 4.0, maxDuration: 22.0 }
      );

      // Leave cameraShot as "auto" by default so the Film Director AI freely plans multi-shot camera.keyframes per scene
      const validShot: CameraShotType | "auto" =
        item.cameraShot === "auto"
          ? "auto"
          : item.cameraShot && VALID_CAMERA_SHOTS.includes(item.cameraShot) && calculatedDuration < 5.0
          ? item.cameraShot
          : "auto";

      let actionDesc = item.actionDescription && typeof item.actionDescription === "string"
        ? item.actionDescription.trim()
        : "";

      if (!actionDesc || actionDesc.length < 15 || /phù hợp với lời dẫn/i.test(actionDesc)) {
        const isModern = /phòng tắm|xe buýt|bệnh viện|khách sạn|siêu thị|quán|cà phê|hẻm|đường phố|hoodie|modern|hospital|hotel|bus/i.test(
          dialogueText + " " + envId
        );
        if (isModern) {
          actionDesc = `Người thanh niên mặc áo hoodie hiện đại tay cầm đèn pin bước đi cẩn trọng từ bên trái qua giữa khung hình, khuôn mặt hoảng sợ nhìn dáo dác vào bóng tối.`;
        } else {
          actionDesc = `Người nông dân mặc áo tơi sờn rách tay cầm đèn bão sắt bước đi run rẩy từ góc trái sang giữa khung hình, dè chừng tà khí ma quái xung quanh.`;
        }
      }

      return {
        title: item.title || `Cảnh ${idx + 1}: Diễn Biến Cốt Truyện`,
        environmentId: envId,
        actionDescription: actionDesc,
        dialogue: dialogueText,
        duration_sec: calculatedDuration,
        cameraShot: validShot,
      };
    });

    if (drafts.length === 0) {
      return { success: false, error: "Không thể phân tách phân cảnh từ cốt truyện.", rawText };
    }

    return { success: true, drafts, rawText };
  } catch (err: any) {
    return { success: false, error: `Lỗi phân tích cốt truyện: ${err.message}` };
  }
}
