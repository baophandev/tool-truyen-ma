import type { DirectorSceneScript, NamedEnvironmentPreset } from "./types";
import { validateDirectorScript } from "./layoutRouter";

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

export function getStoredModel(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MODEL);
    return saved && saved.trim() ? saved.trim() : "gemini-2.5-flash";
  } catch {
    return "gemini-2.5-flash";
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
- Themes: "rural_graveyard" | "abandoned_village" | "cursed_swamp" | "modern_indoor"
- Sky presets (Bầu trời & Chiếu sáng):
  * "blood_moon" (Trăng máu đỏ rực)
  * "foggy_night" (Đêm sương mù lạnh buốt)
  * "stormy_dark" (Bão đêm sấm chớp)
  * "eclipse_abyss" (Nhật thực lửa xanh lân tinh)
  * "flickering_fluorescent" (Đèn huỳnh quang chập chờn - trong nhà: bệnh viện, siêu thị)
  * "dim_indoor_night" (Ánh vàng mờ ảo đêm muộn - trong nhà: khách sạn, nhà hàng)
- Structures (Công trình & Vùng được phép):
  * "creepy_banyan_tree", "haunted_gallows_tree" -> CHỈ ĐẶT Ở: "far_left" | "far_right"
  * "ancient_tomb", "abandoned_shrine", "creepy_well", "hospital_operating_bed", "hotel_reception_desk", "creepy_elevator_doors", "dining_table_chairs" -> CHỈ ĐẶT Ở: "mid_left" | "center" | "mid_right"
  * "dilapidated_hut", "broken_wooden_bridge", "supermarket_shelf_aisle" -> CHỈ ĐẶT Ở: "far_left" | "center" | "far_right"
  * "scarecrow_of_the_damned" -> Đặt ở mọi ground slot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right"
- Details (Đạo cụ cảnh):
  * "detail_black_crow" -> Tất cả 5 ground slots và 3 air slots
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
- Actor Faces (Khuôn mặt):
  * "face_calm", "face_scared", "face_creepy_smile", "face_bleeding_eyes", "face_old_wrinkled", "face_rage_furious", "face_pale_corpse", "face_weeping_ghost", "face_sewn_mouth", "face_haggard_gaunt", "face_faceless", "face_glowing_hollow", "face_talisman_covered"
- Actor Facing (BẮT BUỘC có trên mỗi actor):
  * "facing": "left" | "right" (hướng mặt quay sang trái hoặc sang phải)
- Actor Poses (Tư thế & Quy định vùng):
  * "pose_standing", "pose_holding", "pose_shivering", "pose_walking", "pose_crawling", "pose_reaching" -> BẮT BUỘC ở 5 Ground Slots (offsetY = 0)
  * "pose_floating", "pose_hanging" -> BẮT BUỘC ở 3 Air Slots ("air_left" | "air_center" | "air_right")
- Actor Handheld Items (Đồ vật cầm tay qua Hand Socket):
  * "heldItem": "none" | "item_storm_lantern" | "item_paper_lantern" | "item_soul_candle" | "item_peach_wood_sword" | "item_yellow_talisman" | "item_rusty_sickle" | "item_ritual_bell" | "item_tattered_doll" | "item_tattered_umbrella" | "item_flashlight" | "item_scalpel"
  * "heldHand": "right" (tay trước) | "left" (tay sau)
- Chuyển động A -> B (motion tweening):
  * NẾU NHÂN VẬT ĐỨNG YÊN KHÔNG DI CHUYỂN: BỎ HẲN trường "motion" (TUYỆT ĐỐI KHÔNG để null hay {}).
  * CHỈ KHI nhân vật thực sự di chuyển từ điểm A sang điểm B mới thêm:
    "motion": { "targetSlot": SlotId, "targetOffsetX": number, "targetOffsetY": 0, "startTimeSec": number, "endTimeSec": number, "easing": "linear"|"ease_in_out"|"ease_in"|"ease_out", "autoFaceTarget": true, "movingPose": "pose_walking"|"pose_floating"|"pose_crawling"|"pose_reaching" }

3. QUY ĐỊNH ĐỊNH DẠNG ĐẦU RA:
- BẮT BUỘC xuất ra CHÍNH XÁC MỘT JSON ARRAY gồm danh sách các cảnh (hoặc 1 JSON object nếu chỉ yêu cầu 1 cảnh duy nhất).
- KHÔNG thêm bất kỳ lời giải thích ngoài lề nào, chỉ trả về chuỗi JSON thuần.`;

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
  const model = options.model || getStoredModel() || "gemini-2.5-flash";

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
   - theme: "rural_graveyard" | "abandoned_village" | "cursed_swamp"
   - lighting (sky_preset: "blood_moon" | "foggy_night" | "stormy_dark" | "eclipse_abyss", fog_density: 0.5 - 0.9, thunder_flash: boolean)
   - structures & details tuân thủ tuyệt đối quy tắc vị trí neo (Ground Slots vs Air Slots, cây đa/cây gallows chỉ ở far_left/far_right, miếu/mộ/giếng ở giữa...)
   - actors: base, costume, face, pose, facing, slot, continuous offsetX, heldItem, heldHand
   - motion: chuyển động A -> B (nếu nhân vật di chuyển từ vị trí xuất phát tới vị trí đích)
3. Mỗi cảnh có tiêu đề (title), thời lượng (duration_sec: 5-8), phụ đề lời thoại rùng rợn (dialogue) và ghi chú đạo diễn (narrative_note).
4. Đảm bảo nhân vật và trang phục nhất quán giữa các cảnh nếu cùng một nhân vật xuất hiện xuyên suốt.

Trả về một JSON ARRAY gồm đúng ${effectiveSceneCount} đối tượng DirectorSceneScript:
[
  { "scene_id": "scene_01_...", "title": "...", "duration_sec": 6, "theme": "...", "lighting": { ... }, "environment_items": [ ... ], "actors": [ ... ], "details": [ ... ], "dialogue": "...", "narrative_note": "..." },
  ...
]`;
  } else {
    userPrompt = `Hãy đạo diễn một chuỗi ${effectiveSceneCount} phân cảnh hoạt hình kinh dị (mỗi cảnh dài 5-7 giây) từ kịch bản sau:
"""
${storyPrompt}
"""

Yêu cầu cho chuỗi ${effectiveSceneCount} cảnh:
1. Các cảnh phải có sự liên kết cốt truyện liền mạch, căng thẳng dồn dập (Cảnh 1 thiết lập bối cảnh, Cảnh 2 phát hiện điều bất thường/chạm trán, Cảnh 3 cao trào rùng rợn/bị rượt đuổi).
2. Tận dụng tối đa nhân vật, trang phục, khuôn mặt, đồ vật cầm tay (đèn bão, kiếm gỗ đào, nến, bùa...) và chuyển động Điểm A -> Điểm B để câu chuyện sống động.
3. Mỗi cảnh có tiêu đề (title), thời lượng (duration_sec: 5-8), phụ đề lời thoại rùng rợn (dialogue) và ghi chú đạo diễn (narrative_note).
4. Tuân thủ 100% quy tắc vị trí neo (Ground Slots cho dáng tiếp đất, Air Slots cho dáng bay; cây đa/cây treo cổ chỉ ở rìa; mộ/giếng/miếu ở giữa...).

Trả về một JSON ARRAY gồm đúng ${effectiveSceneCount} đối tượng DirectorSceneScript:
[
  { "scene_id": "scene_01_...", "title": "...", "duration_sec": 6, "theme": "...", "lighting": { ... }, "environment_items": [ ... ], "actors": [ ... ], "details": [ ... ], "dialogue": "...", "narrative_note": "..." },
  ...
]`;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: GEMINI_DIRECTOR_SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      let errorMsg = `Lỗi Gemini API (Mã HTTP ${res.status})`;
      try {
        const errJson = JSON.parse(errBody);
        if (errJson.error && errJson.error.message) {
          errorMsg = errJson.error.message;
        }
      } catch {
        // use raw error
      }
      return { success: false, error: errorMsg };
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
        validScenes.push(val.normalized);
      } else {
        validationErrors.push(`Cảnh ${idx + 1}: ${val.errors.join("; ")}`);
        // If normalization is still salvageable, push it
        if (val.normalized) {
          validScenes.push(val.normalized);
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
  const model = options.model || getStoredModel() || "gemini-2.5-flash";

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
Trả về CHÍNH XÁC MỘT JSON OBJECT duy nhất:`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: GEMINI_DIRECTOR_SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: `Lỗi Gemini API: ${errBody}` };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);
    const targetObj = Array.isArray(parsed) ? parsed[0] : parsed;

    const val = validateDirectorScript(targetObj);
    if (val.valid && val.normalized) {
      return { success: true, scene: val.normalized, rawText };
    } else if (val.normalized) {
      return { success: true, scene: val.normalized, rawText };
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
  } = {}
): Promise<GenerateSceneResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || "gemini-2.5-flash";
  const duration = options.duration_sec || 6;
  const idx = options.sceneIndex !== undefined ? options.sceneIndex + 1 : 1;

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key.",
    };
  }

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
   - Chọn đúng costume: "outfit_tattered_tunic" | "outfit_flowing_ao_dai" | "outfit_shrouded_cloak" | "outfit_mandarin_court" | "outfit_monk_cassock" | "outfit_shredded_burial" | "outfit_ancient_armor" | "outfit_child_pajamas" | "outfit_doctor_coat" | "outfit_patient_gown" | "outfit_modern_casual"
   - Chọn đúng face: "face_calm" | "face_scared" | "face_creepy_smile" | "face_bleeding_eyes" | "face_old_wrinkled" | "face_rage_furious" | "face_pale_corpse" | "face_weeping_ghost" | "face_sewn_mouth" | "face_haggard_gaunt" | "face_faceless" | "face_glowing_hollow" | "face_talisman_covered"
   - BẮT BUỘC có "facing": "left" | "right" (hướng mặt nhìn trái hoặc phải).
   - Chọn đúng pose và vị trí slot tiếp đất (offsetY = 0): "far_left" (250) | "mid_left" (600) | "center" (960) | "mid_right" (1320) | "far_right" (1670). (Nếu pose_floating/pose_hanging dùng air_left | air_center | air_right).
   - Chọn đúng heldItem & heldHand: "item_storm_lantern" | "item_paper_lantern" | "item_soul_candle" | "item_peach_wood_sword" | "item_yellow_talisman" | "item_rusty_sickle" | "item_ritual_bell" | "item_tattered_doll" | "item_tattered_umbrella" | "item_flashlight" | "item_scalpel" | "none".
   - Nếu có di chuyển A -> B: gắn khối "motion" { targetSlot, targetOffsetX: 0, startTimeSec: 0.2, endTimeSec: ${duration - 0.5}, easing: "ease_in_out", autoFaceTarget: true, movingPose: "pose_walking"|"pose_floating"|"pose_crawling" }.
   - Nếu nhân vật ĐỨNG YÊN KHÔNG DI CHUYỂN: BỎ HẲN trường "motion" (TUYỆT ĐỐI KHÔNG để null hay {}).
2. Đặt tiêu đề ngắn gọn (title) phản ánh đúng hành động.
3. Sinh 1 câu phụ đề lời thoại rùng rợn (dialogue) phù hợp với hành động.
4. GIỮ NGUYÊN 100% theme, lighting, environment_items và details từ bối cảnh đã cố định.

TRẢ VỀ CHÍNH XÁC MỘT ĐỐI TƯỢNG JSON DUY NHẤT:
{
  "scene_id": "scene_${Date.now().toString().slice(-4)}",
  "title": "${options.title || `Cảnh ${idx}: Hành Động Mới`}",
  "duration_sec": ${duration},
  "theme": "${environment.theme}",
  "lighting": ${JSON.stringify(environment.lighting)},
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: GEMINI_DIRECTOR_SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.5 },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: `Lỗi Gemini API: ${errBody}` };
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
      return { success: true, scene: val.normalized, rawText };
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
  } = {}
): Promise<GenerateFilmResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || "gemini-2.5-flash";

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

  const promptSections = sceneSpecs.map((spec, i) => {
    return `[CẢNH ${i + 1}]:
- Bối Cảnh Cố Định: "${spec.environment.name}" (Theme: "${spec.environment.theme}", Sky: "${spec.environment.lighting.sky_preset}")
- Công trình cố định: ${JSON.stringify(spec.environment.environment_items.map((e) => e.asset_id))}
- Mô Tả Hành Động & Nhân Vật: """${spec.actionDescription.trim() || "Nhân vật bước đi cẩn trọng trong màn đêm."}"""
- Lời thoại / Phụ đề: """${spec.dialogue ? spec.dialogue.trim() : "..."}"""
- Thời lượng: ${spec.duration_sec || 6}s`;
  }).join("\n\n");

  const userPrompt = `BẠN LÀ CỖ MÁY ĐẠO DIỄN HOẠT HÌNH 2D THEO MÔ TẢ TRỰC TIẾP.
Dưới đây là danh sách ${sceneSpecs.length} phân cảnh. Mỗi phân cảnh đã được gán sẵn một BỐI CẢNH CỐ ĐỊNH và MÔ TẢ HÀNH ĐỘNG NHÂN VẬT cụ thể:

${promptSections}

YÊU CẦU ĐẠO DIỄN:
1. Bạn KHÔNG tự bịa cốt truyện hay thay đổi bối cảnh. Hãy đọc mô tả hành động của từng cảnh và tạo mảng "actors" cùng chuyển động "motion" khớp chính xác 100%.
2. Giữ nguyên 100% theme, lighting, environment_items và details của bối cảnh được chỉ định cho mỗi cảnh. Các cảnh có chung bối cảnh BẮT BUỘC PHẢI CÓ BỐI CẢNH Y HỆT NHAU.
3. QUY ĐỊNH CHO MỖI ACTOR TRONG DANH SÁCH "actors":
   - "id": id duy nhất ví dụ "actor_1", "actor_2"
   - "facing": "left" | "right" (BẮT BUỘC CÓ trên mọi actor).
   - "base": "male_adult" | "female_adult" | "elder_hunched" | "brute_hulking" | "skeletal_emaciated" | "ghost_wraith" | "creepy_child" | "jiangshi_corpse" | "demon_shadow"
   - "costume": "outfit_tattered_tunic" | "outfit_flowing_ao_dai" | "outfit_shrouded_cloak" | "outfit_mandarin_court" | "outfit_monk_cassock" | "outfit_shredded_burial" | "outfit_ancient_armor" | "outfit_child_pajamas" | "outfit_doctor_coat" | "outfit_patient_gown" | "outfit_modern_casual"
   - "face": "face_calm" | "face_scared" | "face_creepy_smile" | "face_bleeding_eyes" | "face_old_wrinkled" | "face_rage_furious" | "face_pale_corpse" | "face_weeping_ghost" | "face_sewn_mouth" | "face_haggard_gaunt" | "face_faceless" | "face_glowing_hollow" | "face_talisman_covered"
   - "pose": "pose_standing" | "pose_holding" | "pose_shivering" | "pose_walking" | "pose_crawling" | "pose_reaching" (ở ground slots) | "pose_floating" | "pose_hanging" (ở air slots)
   - "slot": "far_left" | "mid_left" | "center" | "mid_right" | "far_right" (hoặc "air_left" | "air_center" | "air_right")
   - "offsetX": 0, "offsetY": 0 (nếu tiếp đất thì offsetY bắt buộc bằng 0)
   - "heldItem": "none" | "item_storm_lantern" | "item_paper_lantern" | "item_soul_candle" | "item_peach_wood_sword" | "item_yellow_talisman" | "item_rusty_sickle" | "item_ritual_bell" | "item_tattered_doll" | "item_tattered_umbrella" | "item_flashlight" | "item_scalpel"
   - "heldHand": "right" | "left"
   - "motion": NẾU NHÂN VẬT ĐỨNG YÊN THÌ BỎ HẲN TRƯỜNG NÀY (TUYỆT ĐỐI KHÔNG để null hay {}). Chỉ khi nhân vật di chuyển từ điểm A sang điểm B mới thêm khối: { "targetSlot": "mid_right", "targetOffsetX": 0, "startTimeSec": 0.2, "endTimeSec": 5, "easing": "ease_in_out", "autoFaceTarget": true, "movingPose": "pose_walking" }.
4. Xuất ra một JSON ARRAY gồm đúng ${sceneSpecs.length} đối tượng DirectorSceneScript:
[
  {
    "scene_id": "scene_01",
    "title": "...",
    "duration_sec": 6,
    "theme": "...",
    "lighting": { ... },
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: GEMINI_DIRECTOR_SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.5 },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: `Lỗi Gemini API: ${errBody}` };
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

      const val = validateDirectorScript(sc);
      if (val.normalized) {
        validScenes.push(val.normalized);
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
  const model = options.model || getStoredModel() || "gemini-2.5-flash";

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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: GEMINI_DIRECTOR_SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.6 },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: `Lỗi Gemini API: ${errBody}` };
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
 * AUTO-FILL STORY BREAKDOWN ASSISTANT SPECIFICATION
 */
export interface AutoFillSceneDraft {
  title: string;
  environmentId: string;
  actionDescription: string;
  dialogue?: string;
  duration_sec: number;
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
  const model = options.model || getStoredModel() || "gemini-2.5-flash";

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

2. TRANG PHỤC (Costumes - 11 bộ):
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

3. BIỂU CẢM KHUÔN MẶT (Faces - 13 mặt):
   - "face_calm", "face_scared", "face_creepy_smile", "face_bleeding_eyes", "face_old_wrinkled", "face_rage_furious", "face_pale_corpse", "face_weeping_ghost", "face_sewn_mouth", "face_haggard_gaunt", "face_faceless", "face_glowing_hollow", "face_talisman_covered"

4. ĐỒ VẬT CẦM TAY (Held Items - 12 món):
   - "none" (tay không)
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

5. CÔNG TRÌNH BỐI CẢNH (Structures - 13 công trình):
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

6. ĐẠO CỤ BỐI CẢNH (Details - 10 đạo cụ):
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

7. THEMES & SKY PRESETS:
   - Themes: rural_graveyard, abandoned_village, cursed_swamp, modern_indoor
   - Sky: blood_moon, foggy_night, stormy_dark, eclipse_abyss, flickering_fluorescent, dim_indoor_night

YÊU CẦU KIỂM TRA ĐỐI CHIẾU:
- Phân tích xem trong cốt truyện có chi tiết nào mà hệ thống CHƯA CÓ asset phù hợp không.
- Ví dụ nếu truyện có "cung tên", "súng săn", "chó săn", "ngựa ma", "rìu đốn củi", "thuyền gỗ", "mặt nạ quỷ", v.v. -> đây là các asset mà hệ thống chưa có.
- Nếu phát hiện thiếu asset:
  * "isSufficient": false
  * "missingAssets": mảng các asset thiếu. Mỗi asset gồm:
    - "category": "actor_base" | "costume" | "face" | "held_item" | "structure" | "detail" | "theme" | "sky_preset"
    - "categoryLabel": Tên tiếng Việt phân loại (vd: "Đồ vật cầm tay", "Khung nhân vật", "Công trình bối cảnh")
    - "name": Tên tiếng Việt của thực thể thiếu (vd: "Cung tên gỗ", "Chó săn ma")
    - "suggestedId": ID kỹ thuật đề xuất theo chuẩn hệ thống (vd: "item_wooden_bow", "beast_hunting_dog")
    - "reason": Lý do tại sao cốt truyện cần asset này
    - "replacementAvailable": Gợi ý asset có sẵn gần nhất trong kho có thể tạm thời thay thế (vd: "Có thể tạm dùng 'item_rusty_sickle'")
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: GEMINI_DIRECTOR_SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return {
        success: false,
        isSufficient: false,
        missingAssets: [],
        summary: "Lỗi kết nối Gemini API",
        error: `Lỗi Gemini API: ${errBody}`,
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
 * and audits if any required asset is missing from GEMINI_DIRECTOR_ASSETS.md.
 */
export async function breakdownStoryToSceneDrafts(
  storyPrompt: string,
  availableEnvironments: NamedEnvironmentPreset[],
  options: {
    targetSceneCount?: number | "auto";
    apiKey?: string;
    model?: string;
  } = {}
): Promise<BreakdownStoryResult> {
  const apiKey = (options.apiKey || getStoredApiKey()).trim();
  const model = options.model || getStoredModel() || "gemini-2.5-flash";

  if (!apiKey) {
    return {
      success: false,
      error: "Chưa có Gemini API Key. Vui lòng cấu hình API Key.",
    };
  }

  if (!storyPrompt.trim()) {
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

  const countRequirement =
    options.targetSceneCount && options.targetSceneCount !== "auto"
      ? `BẮT BUỘC phân chia thành đúng ${options.targetSceneCount} phân cảnh.`
      : `Hãy tự động phân tích nhịp điệu cốt truyện và chia thành từ 2 đến 5 phân cảnh phù hợp nhất.`;

  const userPrompt = `BẠN LÀ TRỢ THỦ BIÊN KỊCH HOẠT HÌNH KINH DỊ BÓNG ĐEN 2D (LIMBO ENGINE SCRIPT BREAKDOWN ASSISTANT).
Nhiệm vụ của bạn là nhận cốt truyện thô từ người dùng, phân tích và tự động bóc tách thành các phân cảnh hoàn chỉnh để ĐIỀN TỰ ĐỘNG VÀO CÁC TRƯỜNG THÔNG TIN (AUTO-FILL).

CỐT TRUYỆN CỦA NGƯỜI DÙNG:
"""
${storyPrompt.trim()}
"""

DANH SÁCH BỐI CẢNH DÙNG LẠI HIỆN CÓ TRONG THƯ VIỆN CỦA HỆ THỐNG:
${envsSummary}

YÊU CẦU ĐẶC BIỆT DÀNH CHO TRỢ THỦ BIÊN KỊCH:
1. SỐ LƯỢNG PHÂN CẢNH: ${countRequirement}
2. QUY TẮC KHÓA BỐI CẢNH DÙNG LẠI (CRITICAL - SCENE CONTINUITY):
   - Mọi cảnh BẮT BUỘC phải chọn 1 "environmentId" từ danh sách bối cảnh trên (chính xác ID, không tự bịa).
   - NGUYÊN TẮC VÀNG: Nếu các cảnh liên tiếp diễn ra ở cùng một không gian / địa điểm (ví dụ lữ khách bước đi trong bãi tha ma rồi gặp ma hiện hình, hoặc ở miếu hoang rồi đối đầu cương thi), BẮT BUỘC PHẢI DÙNG CHUNG 1 "environmentId" để bối cảnh được giữ nguyên 100%, không bị lệch hay nhảy bối cảnh!
   - Chỉ đổi sang "environmentId" khác khi cốt truyện thực sự chuyển địa điểm (ví dụ từ bãi tha ma chạy tới miếu hoang).
3. MÔ TẢ HÀNH ĐỘNG NHÂN VẬT (actionDescription):
   - Viết mô tả hành động trực tiếp, chi tiết, sống động theo đúng tài nguyên của Limbo Engine:
     * Nhân vật (bases): "male_adult" (lữ khách, nam thanh niên), "female_adult" (thiếu nữ tóc dài), "elder_hunched" (bà lão, cụ già), "brute_hulking" (đồ tể, hộ pháp), "skeletal_emaciated" (kẻ gầy trơ xương, ngạ quỷ), "ghost_wraith" (bóng ma lơ lửng), "creepy_child" (đứa trẻ ma), "jiangshi_corpse" (cương thi phong kiến), "demon_shadow" (quỷ bóng đen sừng cong).
     * Trang phục (costumes): "outfit_tattered_tunic" (áo tơi nông phu), "outfit_flowing_ao_dai" (áo dài ma mị), "outfit_shrouded_cloak" (áo choàng trùm đầu), "outfit_mandarin_court" (quan phục triều đình), "outfit_monk_cassock" (áo cà sa pháp sư), "outfit_shredded_burial" (vải liệm tử thi), "outfit_ancient_armor" (giáp tướng cổ), "outfit_child_pajamas" (yếm hoa trẻ thơ), "outfit_doctor_coat" (áo blouse bác sĩ), "outfit_patient_gown" (áo bệnh nhân), "outfit_modern_casual" (đồ hiện đại).
     * Đồ vật cầm tay (held items): đèn bão sắt ("item_storm_lantern"), lồng đèn giấy ("item_paper_lantern"), nến triệu hồn ("item_soul_candle"), kiếm gỗ đào ("item_peach_wood_sword"), bùa vàng ("item_yellow_talisman"), liềm rỉ sét ("item_rusty_sickle"), chuông đồng ("item_ritual_bell"), búp bê vải ("item_tattered_doll"), ô rách ("item_tattered_umbrella"), đèn pin ("item_flashlight"), dao mổ ("item_scalpel").
     * Hướng nhìn và di chuyển A -> B: bước đi từ trái qua phải, bước lùi hoảng sợ, sà xuống rượt đuổi, nhảy cứng đờ...
4. TIÊU ĐỀ (title): Ngắn gọn, có số thứ tự (ví dụ: "Cảnh 1: Lạc Bước Bãi Tha Ma", "Cảnh 2: Hồn Ma Áo Liệm Xuất Hiện").
5. LỜI THOẠI / PHỤ ĐỀ (dialogue): Một câu phụ đề rùng rợn, ma quái hoặc độc thoại nội tâm gắn liền với diễn biến cảnh.
6. THỜI LƯỢNG (duration_sec): Từ 5 đến 8 giây.
7. KIỂM ĐỊNH ASSET (CRITICAL): Rà soát xem cốt truyện có yêu cầu nhân vật, trang phục, đồ vật cầm tay hay công trình nào mà hệ thống CHƯA CÓ không (ví dụ cung tên, súng săn, chó săn, ngựa, rìu, đò gỗ, v.v.). Nếu có chi tiết nào thiếu so với kho asset trong GEMINI_DIRECTOR_ASSETS.md thì báo vào mảng missingAssets trong đối tượng assetAudit!

TRẢ VỀ CHÍNH XÁC MỘT ĐỐI TƯỢNG JSON DUY NHẤT:
{
  "assetAudit": {
    "isSufficient": true,
    "summary": "Đánh giá mức độ đầy đủ của tài nguyên...",
    "missingAssets": []
  },
  "scenes": [
    {
      "title": "Cảnh 1: ...",
      "environmentId": "id_bối_cảnh_chọn_từ_danh_sách",
      "actionDescription": "Mô tả chi tiết nhân vật làm gì...",
      "dialogue": "Lời thoại rùng rợn...",
      "duration_sec": 6
    }
  ]
}
(Nếu phát hiện thiếu asset thì isSufficient = false và liệt kê chi tiết trong missingAssets).`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: GEMINI_DIRECTOR_SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.6 },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: `Lỗi Gemini API: ${errBody}` };
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = JSON.parse(rawText);

    let rawScenes: any[] = [];
    let assetAudit: AssetAuditResult | undefined = undefined;

    if (Array.isArray(parsed)) {
      rawScenes = parsed;
    } else if (parsed && typeof parsed === "object") {
      if (Array.isArray(parsed.scenes)) {
        rawScenes = parsed.scenes;
      } else if (Array.isArray(parsed.drafts)) {
        rawScenes = parsed.drafts;
      }
      if (parsed.assetAudit && typeof parsed.assetAudit === "object") {
        const missing = Array.isArray(parsed.assetAudit.missingAssets) ? parsed.assetAudit.missingAssets : [];
        const isSufficient = Boolean(parsed.assetAudit.isSufficient && missing.length === 0);
        assetAudit = {
          success: true,
          isSufficient,
          missingAssets: missing,
          summary: parsed.assetAudit.summary || (isSufficient ? "Tài nguyên đầy đủ 100%!" : `Phát hiện ${missing.length} asset cần bổ sung.`),
        };
      }
    }

    const validEnvIds = new Set(availableEnvironments.map((e) => e.id));
    const fallbackEnvId = availableEnvironments[0]?.id || "env_graveyard_foggy";

    const drafts: AutoFillSceneDraft[] = rawScenes.map((item, idx) => {
      let envId = item.environmentId;
      if (!envId || !validEnvIds.has(envId)) {
        envId = fallbackEnvId;
      }
      return {
        title: item.title || `Cảnh ${idx + 1}: Diễn Biến Cốt Truyện`,
        environmentId: envId,
        actionDescription: item.actionDescription || "Nhân vật bước đi cẩn trọng trong bóng tối.",
        dialogue: item.dialogue || undefined,
        duration_sec: Math.max(3, Math.min(20, Number(item.duration_sec) || 6)),
      };
    });

    if (drafts.length === 0) {
      return { success: false, error: "Không thể phân tách phân cảnh từ cốt truyện.", rawText };
    }

    return { success: true, drafts, assetAudit, rawText };
  } catch (err: any) {
    return { success: false, error: `Lỗi phân tích cốt truyện: ${err.message}` };
  }
}
