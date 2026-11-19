import type {
  ActorConfig,
  NamedCharacterPreset,
} from "./types";
import { getDefaultCostumeForBase } from "./layoutRouter";
import { setProjectIsolated } from "./environmentPresets";

export const STORAGE_KEY_CHARACTERS = "limbo_project_characters_v2";

export const DEFAULT_NAMED_CHARACTERS: NamedCharacterPreset[] = [
  {
    id: "char_male_explorer",
    name: "Nam Thanh Niên (Nhà Báo / Lữ Khách)",
    description: "Nhân vật chính thời hiện đại, dấn thân vào các vùng đất cấm để tìm kiếm sự thật, luôn mang đèn pin rọi bóng tối.",
    base: "male_adult",
    costume: "outfit_modern_casual",
    face: "face_scared",
    defaultHeldItem: "item_flashlight",
    defaultHeldHand: "right",
    scale: 1.0,
  },
  {
    id: "char_female_ao_dai",
    name: "Thiếu Nữ Oan Hồn Áo Dài",
    description: "Bóng hồng u uất thời xưa, tà áo dài rách tả tơi bay trong gió đêm, nụ cười ma quái thoắt ẩn thoắt hiện.",
    base: "female_adult",
    costume: "outfit_flowing_ao_dai",
    face: "face_calm",
    defaultHeldItem: "item_tattered_umbrella",
    defaultHeldHand: "left",
    scale: 1.0,
  },
  {
    id: "char_taoist_master",
    name: "Vị Pháp Sư / Đạo Sĩ Trừ Tà",
    description: "Đạo sĩ khoác áo cà sa vàng đỏ, tay thủ kiếm gỗ đào và bùa chú trấn áp yêu ma.",
    base: "male_adult",
    costume: "outfit_monk_cassock",
    face: "face_calm",
    defaultHeldItem: "item_peach_wood_sword",
    defaultHeldHand: "right",
    scale: 1.0,
  },
  {
    id: "char_creepy_child",
    name: "Đứa Trẻ Ma Búp Bê",
    description: "Đứa trẻ ma nhỏ bé trong chiếc yếm hoa sẫm màu, ôm búp bê vải rách lang thang bên giếng cạn.",
    base: "creepy_child",
    costume: "outfit_child_pajamas",
    face: "face_creepy_smile",
    defaultHeldItem: "item_tattered_doll",
    defaultHeldHand: "right",
    scale: 0.85,
  },
  {
    id: "char_reaper_shroud",
    name: "Kẻ Hành Hương Áo Choàng Trùm Đầu",
    description: "Bóng người bí ẩn khoác áo choàng trùm đầu tăm tối, tay cầm chuông triệu hồn ngân vang từng hồi rợn người.",
    base: "male_adult",
    costume: "outfit_shrouded_cloak",
    face: "face_faceless",
    defaultHeldItem: "item_ritual_bell",
    defaultHeldHand: "right",
    scale: 1.05,
  },
  {
    id: "char_jiangshi_corpse",
    name: "Cương Thi Quan Triều Đình",
    description: "Tử thi quan chức phong kiến với quan phục bổ tử và bùa vàng dán trán, nhảy cứng đờ vươn hai tay.",
    base: "jiangshi_corpse",
    costume: "outfit_mandarin_court",
    face: "face_talisman_covered",
    defaultHeldItem: "none",
    scale: 1.0,
  },
  {
    id: "char_doctor_bloody",
    name: "Bác Sĩ Bệnh Viện Ám Khí",
    description: "Bác sĩ phẫu thuật khoác áo blouse trắng vấy máu loang lổ, tay lăm lăm dao mổ sắc lạnh.",
    base: "male_adult",
    costume: "outfit_doctor_coat",
    face: "face_creepy_smile",
    defaultHeldItem: "item_scalpel",
    defaultHeldHand: "right",
    scale: 1.0,
  },
  {
    id: "char_patient_runaway",
    name: "Bệnh Nhân Tâm Thần Trốn Viện",
    description: "Kẻ trốn viện trong bộ đồ bệnh nhân sọc xanh rách rưới, nét mặt hoảng loạn tột cùng cầm mẩu giấy bí ẩn vương máu.",
    base: "male_adult",
    costume: "outfit_patient_gown",
    face: "face_scared",
    defaultHeldItem: "item_mysterious_note",
    defaultHeldHand: "left",
    scale: 0.95,
  },
  {
    id: "char_elder_witch",
    name: "Bà Lão Trông Miếu Lưng Còng",
    description: "Cụ già lưng còng tóc hoa râm búi củ tỏi, mặc áo tơi sờn rách tay xách đèn bão sắt bước đi liêu xiêu.",
    base: "elder_hunched",
    costume: "outfit_tattered_tunic",
    face: "face_old_wrinkled",
    defaultHeldItem: "item_storm_lantern",
    defaultHeldHand: "right",
    scale: 0.9,
  },
  {
    id: "char_demon_general",
    name: "Quỷ Tướng Giáp Cổ Khổng Lồ",
    description: "Thực thể quỷ bóng đen to lớn mang giáp tướng cổ nứt nẻ, sừng cong nhọn hoắt và hào quang ma mị bốc lên.",
    base: "demon_shadow",
    costume: "outfit_ancient_armor",
    face: "face_glowing_hollow",
    defaultHeldItem: "item_rusty_sickle",
    defaultHeldHand: "right",
    scale: 1.25,
  },
  {
    id: "char_western_grandmother",
    name: "Bà Ngoại Miền Tây (Lưng Còng Áo Bà Ba)",
    description: "Cụ bà gần 80 tuổi hiền từ, lưng còng xuống, tóc bạc phơ búi gọn, mặc áo bà ba sẫm màu, tay cầm lát gừng tươi giữ khí.",
    base: "elder_hunched",
    costume: "outfit_traditional_ba_ba",
    face: "face_old_wrinkled",
    defaultHeldItem: "item_fresh_ginger",
    defaultHeldHand: "right",
    scale: 0.85,
  },
  {
    id: "char_hai_lua_ghost",
    name: "Vong Hồn Cô Hai Lụa (Áo Bà Ba Trắng)",
    description: "Oan hồn người mẹ nghèo miền Tây đi tìm con trong đêm mùa nước nổi, mặc áo bà ba trắng ướt sũng bùn non, tóc xõa dài rũ rượi bên mé kênh.",
    base: "female_adult",
    costume: "outfit_traditional_ba_ba",
    face: "face_weeping_ghost",
    defaultHeldItem: "none",
    scale: 1.0,
  },
  {
    id: "char_minh_mourning",
    name: "Minh (Áo Tang Trắng & Đèn Dầu Hột Vịt)",
    description: "Chàng trai trẻ thức dậy trong gian nhà tang vắng vẻ, chít khăn tang trắng trên đầu, tay run rẩy cầm đèn dầu hột vịt soi tỏ bóng đêm.",
    base: "male_adult",
    costume: "outfit_funeral_white",
    face: "face_scared",
    defaultHeldItem: "item_oil_lamp",
    defaultHeldHand: "right",
    scale: 1.0,
  },
];

/**
 * Load named characters from localStorage.
 * Brand new projects start with 0 characters (empty []) so they are not polluted with unrelated presets.
 */
export function loadStoredNamedCharacters(): NamedCharacterPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHARACTERS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Explicitly loads the official demo characters library (12 diễn viên demo) ONLY when requested
 */
export function loadDemoNamedCharacters(): NamedCharacterPreset[] {
  saveStoredNamedCharacters(DEFAULT_NAMED_CHARACTERS);
  return DEFAULT_NAMED_CHARACTERS;
}

/**
 * Save named characters list to localStorage
 */
export function saveStoredNamedCharacters(chars: NamedCharacterPreset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CHARACTERS, JSON.stringify(chars));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Sets project-scoped isolated characters (clears out pollution from other projects)
 */
export function setProjectNamedCharacters(chars: NamedCharacterPreset[]): void {
  setProjectIsolated(true);
  saveStoredNamedCharacters(chars);
}

/**
 * Add or update a named character in the shared cast library
 */
export function addOrUpdateNamedCharacter(char: NamedCharacterPreset): NamedCharacterPreset[] {
  const current = loadStoredNamedCharacters();
  const existingIdx = current.findIndex((c) => c.id === char.id);
  let next: NamedCharacterPreset[];
  if (existingIdx >= 0) {
    next = [...current];
    next[existingIdx] = char;
  } else {
    next = [char, ...current];
  }
  saveStoredNamedCharacters(next);
  return next;
}

/**
 * Delete a character preset from the library
 */
export function deleteNamedCharacter(id: string): NamedCharacterPreset[] {
  const current = loadStoredNamedCharacters();
  const next = current.filter((c) => c.id !== id);
  saveStoredNamedCharacters(next);
  return next;
}

/**
 * Reset stored named characters back to empty state (used when starting a clean new film)
 */
export function resetStoredNamedCharacters(): NamedCharacterPreset[] {
  try {
    localStorage.removeItem(STORAGE_KEY_CHARACTERS);
    setProjectIsolated(true);
  } catch {
    // Ignore storage errors
  }
  return [];
}

/**
 * Extract an ActorConfig from a scene into a reusable NamedCharacterPreset
 */
export function extractCharacterFromActor(actor: ActorConfig, customName?: string): NamedCharacterPreset {
  const base = actor.base || "male_adult";
  const costume = actor.costume || getDefaultCostumeForBase(base);
  const face = actor.face || "face_calm";
  const defaultHeldItem = actor.heldItem || "none";
  const defaultHeldHand = actor.heldHand || "right";
  const scale = actor.scale || 1.0;

  const id = `char_custom_${Date.now().toString().slice(-6)}`;
  const name = customName?.trim() || `Diễn Viên (${actor.id || "Mới"})`;

  return {
    id,
    name,
    description: `Diễn viên trích xuất từ kịch bản: ${base} mang trang phục ${costume}.`,
    base,
    costume,
    face,
    defaultHeldItem,
    defaultHeldHand,
    scale,
  };
}

/**
 * Apply a NamedCharacterPreset to an existing ActorConfig, preserving position & motion
 */
export function applyCharacterToActor(actor: ActorConfig, char: NamedCharacterPreset): ActorConfig {
  return {
    ...actor,
    base: char.base,
    costume: char.costume,
    face: char.face || actor.face,
    scale: char.scale !== undefined ? char.scale : actor.scale,
    heldItem: char.defaultHeldItem && char.defaultHeldItem !== "none" ? char.defaultHeldItem : actor.heldItem,
    heldHand: char.defaultHeldHand || actor.heldHand || "right",
  };
}
