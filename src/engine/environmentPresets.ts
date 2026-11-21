import type {
  DirectorSceneScript,
  NamedEnvironmentPreset,
} from "./types";

export const DEFAULT_NAMED_ENVIRONMENTS: NamedEnvironmentPreset[] = [
  {
    id: "env_graveyard_foggy",
    name: "Bãi Tha Ma Sương Đêm",
    description: "Bãi tha ma cổ hoang vắng, cây đa nghìn năm ở bìa trái, mộ cổ ở trung tâm, quạ đen và sọ người rải rác trong màn sương mù dày đặc.",
    theme: "rural_graveyard",
    lighting: {
      sky_preset: "foggy_night",
      fog_density: 0.7,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "creepy_banyan_tree",
        slot: "far_left",
        scale: 1.05,
      },
      {
        asset_id: "ancient_tomb",
        slot: "center",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_crow_1",
        asset_id: "detail_black_crow",
        slot: "air_left",
      },
      {
        id: "detail_incense_1",
        asset_id: "detail_incense_bowl",
        slot: "center",
        offsetX: 70,
      },
      {
        id: "detail_skulls_1",
        asset_id: "detail_skull_pile",
        slot: "mid_right",
      },
    ],
  },
  {
    id: "env_abandoned_shrine_blood_moon",
    name: "Miếu Cổ Trăng Máu",
    description: "Ngôi miếu hoang cô hồn dưới ánh trăng máu đỏ rực, lều tranh xiêu vẹo ở bìa trái, bùa vàng treo phấp phới và lồng đèn máu rực lửa ma.",
    theme: "abandoned_village",
    lighting: {
      sky_preset: "blood_moon",
      fog_density: 0.65,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "abandoned_shrine",
        slot: "center",
        scale: 1.0,
      },
      {
        asset_id: "dilapidated_hut",
        slot: "far_left",
        scale: 0.95,
      },
    ],
    details: [
      {
        id: "detail_talisman_1",
        asset_id: "detail_hanging_talisman",
        slot: "air_center",
      },
      {
        id: "detail_lantern_1",
        asset_id: "detail_blood_lantern",
        slot: "far_right",
      },
      {
        id: "detail_incense_2",
        asset_id: "detail_incense_bowl",
        slot: "center",
        offsetX: -60,
      },
    ],
  },
  {
    id: "env_cursed_swamp_eclipse",
    name: "Đầm Lầy U Minh Nhật Thực",
    description: "Đầm lầy ma quái dưới nhật thực mặt trời đen rực lửa lân tinh, cây cầu gỗ gãy nhịp và giếng cạn oan hồn, đốm ma trơi xanh lập lòe.",
    theme: "cursed_swamp",
    lighting: {
      sky_preset: "eclipse_abyss",
      fog_density: 0.8,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "broken_wooden_bridge",
        slot: "far_left",
        scale: 1.0,
      },
      {
        asset_id: "creepy_well",
        slot: "center",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_wisp_1",
        asset_id: "detail_will_o_wisp",
        slot: "air_left",
      },
      {
        id: "detail_wisp_2",
        asset_id: "detail_will_o_wisp",
        slot: "air_right",
      },
      {
        id: "detail_skulls_2",
        asset_id: "detail_skull_pile",
        slot: "center",
        offsetX: 80,
      },
    ],
  },
  {
    id: "env_haunted_gallows_graveyard",
    name: "Cây Treo Cổ Bãi Tha Ma",
    description: "Cây treo cổ rủ cành liễu ma quái ở bìa phải bãi tha ma, mộ cổ sừng sững bên trái, quạ đen lượn vòng trên không trung.",
    theme: "rural_graveyard",
    lighting: {
      sky_preset: "foggy_night",
      fog_density: 0.75,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "haunted_gallows_tree",
        slot: "far_right",
        scale: 1.05,
      },
      {
        asset_id: "ancient_tomb",
        slot: "mid_left",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_crow_2",
        asset_id: "detail_black_crow",
        slot: "air_right",
      },
      {
        id: "detail_skulls_3",
        asset_id: "detail_skull_pile",
        slot: "center",
      },
    ],
  },
  {
    id: "env_stormy_village_hut",
    name: "Lều Tranh Bão Tố Sấm Chớp",
    description: "Thôn làng bỏ hoang trong cơn bão sấm chớp dữ dội, lều tranh xiêu vẹo ở trung tâm, bù nhìn rơm ma quái đứng canh bãi hoang.",
    theme: "abandoned_village",
    lighting: {
      sky_preset: "stormy_dark",
      fog_density: 0.6,
      thunder_flash: true,
    },
    environment_items: [
      {
        asset_id: "dilapidated_hut",
        slot: "center",
        scale: 1.0,
      },
      {
        asset_id: "scarecrow_of_the_damned",
        slot: "mid_right",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_lantern_2",
        asset_id: "detail_blood_lantern",
        slot: "mid_left",
      },
    ],
  },
  {
    id: "env_dark_swamp_well",
    name: "Giếng Cạn Oan Hồn Đầm Lầy",
    description: "Miệng giếng cạn u ám ở trung tâm đầm lầy, cây đa ma quái vươn rễ ở bìa trái, bùa chú giăng mắc giữa không trung.",
    theme: "cursed_swamp",
    lighting: {
      sky_preset: "stormy_dark",
      fog_density: 0.85,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "creepy_well",
        slot: "center",
        scale: 1.05,
      },
      {
        asset_id: "creepy_banyan_tree",
        slot: "far_left",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_talisman_2",
        asset_id: "detail_hanging_talisman",
        slot: "air_center",
      },
      {
        id: "detail_wisp_3",
        asset_id: "detail_will_o_wisp",
        slot: "air_right",
      },
    ],
  },
  {
    id: "env_haunted_hospital",
    name: "Bệnh Viện Bỏ Hoang Rùng Rợn",
    description: "Hành lang bệnh viện hoang tàn ánh đèn huỳnh quang chập chờn, giường mổ rỉ sét ở trung tâm, cột truyền dịch y tế và camera an ninh chớp đỏ.",
    theme: "modern_indoor",
    lighting: {
      sky_preset: "flickering_fluorescent",
      fog_density: 0.55,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "hospital_operating_bed",
        slot: "center",
        scale: 1.0,
      },
      {
        asset_id: "creepy_elevator_doors",
        slot: "mid_right",
        scale: 0.95,
      },
    ],
    details: [
      {
        id: "detail_iv_hosp",
        asset_id: "detail_iv_drip_stand",
        slot: "mid_left",
      },
      {
        id: "detail_cam_hosp",
        asset_id: "detail_surveillance_camera",
        slot: "air_left",
      },
      {
        id: "detail_lamp_hosp",
        asset_id: "detail_flickering_ceiling_lamp",
        slot: "air_center",
      },
    ],
  },
  {
    id: "env_creepy_hotel_corridor",
    name: "Hành Lang Khách Sạn Ám Khí",
    description: "Hành lang khách sạn cổ kính ánh vàng mờ ảo, quầy lễ tân u tịch bên trái, cửa thang máy số 13 hé mở khe đen ngòm ở trung tâm.",
    theme: "modern_indoor",
    lighting: {
      sky_preset: "dim_indoor_night",
      fog_density: 0.45,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "hotel_reception_desk",
        slot: "mid_left",
        scale: 1.0,
      },
      {
        asset_id: "creepy_elevator_doors",
        slot: "center",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_cam_hotel",
        asset_id: "detail_surveillance_camera",
        slot: "air_right",
      },
      {
        id: "detail_lamp_hotel",
        asset_id: "detail_flickering_ceiling_lamp",
        slot: "air_left",
      },
    ],
  },
  {
    id: "env_abandoned_supermarket",
    name: "Siêu Thị Hoang Tàn Đêm Tối",
    description: "Dãy kệ hàng siêu thị đổ nát trong bóng tối, xe đẩy gỉ sét bỏ rơi trên sàn nhà lạnh lẽo, bóng đèn huỳnh quang chập chờn đứt đoạn.",
    theme: "modern_indoor",
    lighting: {
      sky_preset: "flickering_fluorescent",
      fog_density: 0.6,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "supermarket_shelf_aisle",
        slot: "far_left",
        scale: 1.0,
      },
      {
        asset_id: "supermarket_shelf_aisle",
        slot: "far_right",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_cart_super",
        asset_id: "detail_shopping_cart",
        slot: "center",
      },
      {
        id: "detail_lamp_super",
        asset_id: "detail_flickering_ceiling_lamp",
        slot: "air_center",
      },
      {
        id: "detail_cam_super",
        asset_id: "detail_surveillance_camera",
        slot: "air_right",
      },
    ],
  },
  {
    id: "env_dark_restaurant",
    name: "Nhà Hàng U Linh Đêm Muộn",
    description: "Sảnh nhà hàng u ám ánh đèn vàng hiu hắt, bàn ăn phủ khăn rách nát ở trung tâm, quầy lễ tân u tịch trong góc tối.",
    theme: "modern_indoor",
    lighting: {
      sky_preset: "dim_indoor_night",
      fog_density: 0.5,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "dining_table_chairs",
        slot: "center",
        scale: 1.0,
      },
      {
        asset_id: "hotel_reception_desk",
        slot: "mid_right",
        scale: 0.95,
      },
    ],
    details: [
      {
        id: "detail_lamp_rest",
        asset_id: "detail_flickering_ceiling_lamp",
        slot: "air_left",
      },
      {
        id: "detail_cam_rest",
        asset_id: "detail_surveillance_camera",
        slot: "air_right",
      },
    ],
  },
  {
    id: "env_midnight_bus",
    name: "Chuyến Xe Bus Nửa Đêm",
    description: "Khoang xe bus đêm hoang tàn, ánh đèn huỳnh quang chập chờn xanh lạnh, dãy ghế rách nát và bóng tối đặc quánh ngoài ô cửa sổ.",
    theme: "vehicle_interior",
    lighting: {
      sky_preset: "flickering_fluorescent",
      fog_density: 0.35,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "bus_interior",
        slot: "mid_left",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_cam_bus",
        asset_id: "detail_surveillance_camera",
        slot: "air_left",
      },
      {
        id: "detail_lamp_bus",
        asset_id: "detail_flickering_ceiling_lamp",
        slot: "air_right",
      },
    ],
  },
  {
    id: "env_creepy_bathroom",
    name: "Phòng Tắm Ma Ám Nửa Đêm",
    description: "Phòng tắm ẩm ướt rùng rợn, bồn tắm rỉ sét ngập nước máu ở trung tâm, gương nứt mạng nhện vấy dấu tay máu trên tường và đèn huỳnh quang chập chờn xanh lạnh.",
    theme: "modern_indoor",
    lighting: {
      sky_preset: "flickering_fluorescent",
      fog_density: 0.65,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "creepy_bathtub",
        slot: "center",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_mirror_bath",
        asset_id: "detail_broken_mirror",
        slot: "mid_left",
        offsetX: -30,
      },
      {
        id: "detail_lamp_bath",
        asset_id: "detail_flickering_ceiling_lamp",
        slot: "air_center",
      },
    ],
  },
  {
    id: "env_urban_night_market_rain",
    name: "Chợ Đêm Đô Thị Mưa Neon",
    description: "Khu chợ đêm đô thị rực rỡ ánh đèn neon chớp giật trong cơn mưa đêm rả rích, quầy lều bạt bày bán cổ vật bí ẩn ven đường, mặt đường nhựa bóng loáng phản chiếu ánh sáng ma mị.",
    theme: "urban_night_market",
    lighting: {
      sky_preset: "foggy_night",
      fog_density: 0.75,
      thunder_flash: false,
      weather: "heavy_rain",
    },
    environment_items: [
      {
        asset_id: "market_stall_tent",
        slot: "center",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_lantern_market",
        asset_id: "detail_blood_lantern",
        slot: "mid_left",
        offsetX: -50,
      },
    ],
  },
  {
    id: "env_abandoned_subway_tracks",
    name: "Trạm Ga & Đường Hầm Tàu Điện Ngầm Bỏ Hoang",
    description: "Lối vào trạm tàu điện ngầm rỉ sét bị niêm phong và đường hầm sâu hun hút ẩm mốc với đường ray rỉ sét, đèn tín hiệu đỏ chập chờn và nước rỉ tí tách.",
    theme: "urban_night_market",
    lighting: {
      sky_preset: "dim_indoor_night",
      fog_density: 0.7,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "abandoned_subway_station",
        slot: "mid_left",
        scale: 1.0,
      },
      {
        asset_id: "rusty_train_tracks_tunnel",
        slot: "mid_right",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_camera_subway",
        asset_id: "detail_surveillance_camera",
        slot: "air_left",
      },
      {
        id: "detail_lamp_subway",
        asset_id: "detail_flickering_ceiling_lamp",
        slot: "air_right",
      },
    ],
  },
  {
    id: "env_old_apartment_gate",
    name: "Cổng Sắt Chung Cư Cũ & Khối Nhà Hoang Phế",
    description: "Cánh cổng sắt hoen gỉ khóa xích của khu chung cư cũ u ám, đèn tường lập lòe ánh vàng hổ phách, sương đêm cuộn xoáy và bóng người bí ẩn sau ô cửa sổ.",
    theme: "urban_night_market",
    lighting: {
      sky_preset: "dim_indoor_night",
      fog_density: 0.72,
      thunder_flash: false,
      weather: "haunted_mist",
    },
    environment_items: [
      {
        asset_id: "structure_old_apartment_gate",
        slot: "center",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_crow_gate",
        asset_id: "detail_black_crow",
        slot: "air_right",
        offsetX: -60,
        offsetY: 20,
      },
      {
        id: "detail_camera_gate",
        asset_id: "detail_surveillance_camera",
        slot: "air_left",
        offsetX: 40,
      },
    ],
  },
  {
    id: "env_western_canal_dock",
    name: "Bến Sông & Cầu Khỉ Ven Kênh",
    description: "Khúc sông ven kênh miền Tây mùa nước nổi u tịch, cây cầu khỉ tre bắc ngang dòng nước chảy xiết, chiếc xuồng ba lá chất đầy bông súng bông điên điển nép bên mé bờ và đốm ma trơi xanh lập lòe trong sương đêm.",
    theme: "cursed_swamp",
    lighting: {
      sky_preset: "foggy_night",
      fog_density: 0.75,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "structure_monkey_bridge",
        slot: "center",
        scale: 0.95,
      },
      {
        asset_id: "structure_wooden_sampan",
        slot: "far_right",
        offsetX: -30,
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_wisp_canal_1",
        asset_id: "detail_will_o_wisp",
        slot: "air_left",
      },
      {
        id: "detail_crow_canal_1",
        asset_id: "detail_black_crow",
        slot: "air_right",
      },
    ],
  },
  {
    id: "env_rural_thatched_house",
    name: "Căn Nhà Lá Miền Tây Đêm Tối",
    description: "Căn nhà lá lợp ngói máng cũ của bà ngoại nép mình trong đêm oi bức, lều tranh xiêu vẹo ánh đèn dầu đỏ leo lét và bát hương tàn nghi ngút khói lạnh.",
    theme: "abandoned_village",
    lighting: {
      sky_preset: "stormy_dark",
      fog_density: 0.65,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "dilapidated_hut",
        slot: "center",
        scale: 1.0,
      },
    ],
    details: [
      {
        id: "detail_lantern_hut",
        asset_id: "detail_blood_lantern",
        slot: "mid_left",
        offsetX: -20,
      },
      {
        id: "detail_incense_hut",
        asset_id: "detail_incense_bowl",
        slot: "mid_right",
        offsetX: 30,
      },
    ],
  },
  {
    id: "env_thatched_house_interior",
    name: "Bên Trong Gian Nhà Lá U Tịch",
    description: "Không gian bên trong căn nhà lá vách nứa đơn sơ rách nát, mái tranh xơ xác rủ vì kèo tre, bàn thờ tổ tiên nghi ngút khói trầm, giường tre rách và cửa gỗ then cài u tối.",
    theme: "thatched_house_interior",
    lighting: {
      sky_preset: "dim_indoor_night",
      fog_density: 0.5,
      thunder_flash: false,
    },
    environment_items: [
      {
        asset_id: "structure_ancestor_altar",
        slot: "center",
        scale: 1.0,
      },
      {
        asset_id: "structure_bamboo_bed_net",
        slot: "far_left",
        scale: 0.95,
      },
      {
        asset_id: "structure_wooden_latch_door",
        slot: "far_right",
        scale: 1.0,
      },
      {
        asset_id: "structure_small_wooden_table",
        slot: "mid_right",
        scale: 0.9,
        offsetX: -30,
      },
    ],
    details: [
      {
        id: "detail_oil_lamp_hut",
        asset_id: "detail_oil_lamp",
        slot: "mid_right",
        offsetX: -30,
        offsetY: -75,
      },
      {
        id: "detail_talisman_hut_ceiling",
        asset_id: "detail_hanging_talisman",
        slot: "air_center",
      },
    ],
  },
];

export const STORAGE_KEY_ISOLATED = "limbo_project_isolated";
const STORAGE_KEY_ENVIRONMENTS = "limbo_named_environments_v1";

/**
 * Checks if the current project is isolated to clean custom raccord sets (no auto-merging unrelated defaults)
 */
export function isProjectIsolated(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_ISOLATED) === "true";
  } catch {
    return false;
  }
}

/**
 * Sets project isolation flag
 */
export function setProjectIsolated(isolated: boolean): void {
  try {
    if (isolated) {
      localStorage.setItem(STORAGE_KEY_ISOLATED, "true");
    } else {
      localStorage.removeItem(STORAGE_KEY_ISOLATED);
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hard-resets named environments stored in localStorage back to empty state for a new clean project
 */
export function resetStoredNamedEnvironments(): NamedEnvironmentPreset[] {
  try {
    localStorage.removeItem(STORAGE_KEY_ENVIRONMENTS);
    setProjectIsolated(true);
  } catch {
    // Ignore storage errors
  }
  return [];
}

/**
 * Load named environments from localStorage.
 * Brand new projects start with 0 environments (empty []) so they are not polluted with unrelated presets.
 */
export function loadStoredNamedEnvironments(): NamedEnvironmentPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENVIRONMENTS);
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
 * Explicitly loads the official demo environments library (17 bối cảnh demo) ONLY when requested
 */
export function loadDemoNamedEnvironments(): NamedEnvironmentPreset[] {
  saveStoredNamedEnvironments(DEFAULT_NAMED_ENVIRONMENTS);
  return DEFAULT_NAMED_ENVIRONMENTS;
}

/**
 * Save named environments list to localStorage
 */
export function saveStoredNamedEnvironments(envs: NamedEnvironmentPreset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ENVIRONMENTS, JSON.stringify(envs));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Sets project-scoped isolated environments (clears out pollution from other projects)
 */
export function setProjectNamedEnvironments(envs: NamedEnvironmentPreset[]): void {
  setProjectIsolated(true);
  saveStoredNamedEnvironments(envs);
}

/**
 * Add or update a named environment in the shared library
 */
export function addOrUpdateNamedEnvironment(env: NamedEnvironmentPreset): NamedEnvironmentPreset[] {
  const current = loadStoredNamedEnvironments();
  const existingIdx = current.findIndex((e) => e.id === env.id);
  let next: NamedEnvironmentPreset[];
  if (existingIdx >= 0) {
    next = [...current];
    next[existingIdx] = env;
  } else {
    next = [env, ...current];
  }
  saveStoredNamedEnvironments(next);
  return next;
}

/**
 * Delete a named environment from the shared library
 */
export function deleteNamedEnvironment(id: string): NamedEnvironmentPreset[] {
  const current = loadStoredNamedEnvironments();
  const filtered = current.filter((e) => e.id !== id);
  const next = filtered.length > 0 ? filtered : DEFAULT_NAMED_ENVIRONMENTS;
  saveStoredNamedEnvironments(next);
  return next;
}

/**
 * Reset named environments to factory defaults
 */
export function resetNamedEnvironmentsToDefault(): NamedEnvironmentPreset[] {
  saveStoredNamedEnvironments(DEFAULT_NAMED_ENVIRONMENTS);
  return DEFAULT_NAMED_ENVIRONMENTS;
}

/**
 * Apply a Named Environment to a Scene Script
 * Locks the environment (theme, lighting, structures, details) to the exact preset
 * while keeping all actors, actions, motion, and dialogue intact!
 */
export function applyEnvironmentToScene(
  scene: DirectorSceneScript,
  env: NamedEnvironmentPreset
): DirectorSceneScript {
  return {
    ...scene,
    theme: env.theme,
    lighting: JSON.parse(JSON.stringify(env.lighting)),
    environment_items: JSON.parse(JSON.stringify(env.environment_items)),
    details: env.details ? JSON.parse(JSON.stringify(env.details)) : [],
  };
}

/**
 * Extract a new Named Environment from an existing Scene Script
 */
export function extractEnvironmentFromScene(
  scene: DirectorSceneScript,
  name: string,
  description?: string
): NamedEnvironmentPreset {
  const safeId = `env_custom_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  return {
    id: safeId,
    name: name.trim() || `Bối Cảnh Tùy Chỉnh (${new Date().toLocaleTimeString("vi-VN")})`,
    description: description?.trim() || `Trích xuất từ cảnh "${scene.title || scene.scene_id}"`,
    theme: scene.theme,
    lighting: JSON.parse(JSON.stringify(scene.lighting)),
    environment_items: JSON.parse(JSON.stringify(scene.environment_items)),
    details: scene.details ? JSON.parse(JSON.stringify(scene.details)) : [],
  };
}

