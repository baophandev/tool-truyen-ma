import type {
  SlotAnchor,
  SlotId,
  GroundSlotId,
  AirSlotId,
  CharacterBaseId,
  CostumeId,
} from "./types";

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
export const GROUND_Y = 800;

export const COLOR_PALETTE = {
  silhouette_primary: "#0A0A0C",
  silhouette_secondary: "#141419",
  silhouette_highlight: "#1F1F26",
  accent_fog_white: "#E2E8F0",
  accent_blood_red: "#991B1B",
  accent_bright_red: "#DC2626",
  accent_eerie_gold: "#D4AF37",
  accent_talisman_yellow: "#FACC15",
  accent_swamp_green: "#10B981",
  accent_phantom_teal: "#06B6D4",
  ghost_glow: "rgba(180, 215, 235, 0.45)",
  skies: {
    blood_moon: {
      gradient_top: "#2B0808",
      gradient_bottom: "#0D0202",
      moon_color: "#DC2626",
      moon_glow: "rgba(220, 38, 38, 0.6)",
      cloud_color: "#180606",
      fog_color: "rgba(153, 27, 27, 0.28)",
    },
    foggy_night: {
      gradient_top: "#06070B",
      gradient_bottom: "#141724",
      moon_color: "#E2E8F0",
      moon_glow: "rgba(226, 232, 240, 0.5)",
      cloud_color: "#0E111A",
      fog_color: "rgba(226, 232, 240, 0.22)",
    },
    stormy_dark: {
      gradient_top: "#030408",
      gradient_bottom: "#0B0E17",
      moon_color: "#64748B",
      moon_glow: "rgba(100, 116, 139, 0.35)",
      cloud_color: "#08090E",
      fog_color: "rgba(30, 41, 59, 0.35)",
    },
    eclipse_abyss: {
      gradient_top: "#021A12",
      gradient_bottom: "#04090E",
      moon_color: "#06070A",
      moon_glow: "rgba(16, 185, 129, 0.45)",
      cloud_color: "#04120D",
      fog_color: "rgba(16, 185, 129, 0.25)",
    },
  },
};

export const GROUND_SLOTS: Record<GroundSlotId, SlotAnchor> = {
  far_left: {
    id: "far_left",
    x: 250,
    y: GROUND_Y,
    type: "ground",
    name: "Cực trái (Far Left)",
  },
  mid_left: {
    id: "mid_left",
    x: 600,
    y: GROUND_Y,
    type: "ground",
    name: "Nửa trái (Mid Left)",
  },
  center: {
    id: "center",
    x: 960,
    y: GROUND_Y,
    type: "ground",
    name: "Chính giữa (Center)",
  },
  mid_right: {
    id: "mid_right",
    x: 1320,
    y: GROUND_Y,
    type: "ground",
    name: "Nửa phải (Mid Right)",
  },
  far_right: {
    id: "far_right",
    x: 1670,
    y: GROUND_Y,
    type: "ground",
    name: "Cực phải (Far Right)",
  },
};

export const AIR_SLOTS: Record<AirSlotId, SlotAnchor> = {
  air_left: {
    id: "air_left",
    x: 400,
    y: 350,
    type: "air",
    name: "Trên không trái (Air Left)",
  },
  air_center: {
    id: "air_center",
    x: 960,
    y: 280,
    type: "air",
    name: "Trên không trung tâm (Air Center)",
  },
  air_right: {
    id: "air_right",
    x: 1520,
    y: 350,
    type: "air",
    name: "Trên không phải (Air Right)",
  },
};

export const ALL_SLOTS: Record<SlotId, SlotAnchor> = {
  ...GROUND_SLOTS,
  ...AIR_SLOTS,
};

export interface BaseAppearance {
  skin: string;
  skinShadow: string;
  hair: string;
  outline: string;
}

export const BASE_APPEARANCE: Record<CharacterBaseId, BaseAppearance> = {
  male_adult: {
    skin: "#C2ADA0",
    skinShadow: "#968072",
    hair: "#1F242E",
    outline: "#0A0B0F",
  },
  female_adult: {
    skin: "#D9CBC6",
    skinShadow: "#AD9C96",
    hair: "#151821",
    outline: "#0A0B0F",
  },
  ghost_wraith: {
    skin: "#CFDCE6",
    skinShadow: "#94A3B8",
    hair: "#1E293B",
    outline: "#334155",
  },
  creepy_child: {
    skin: "#C9B9B9",
    skinShadow: "#9B8B8B",
    hair: "#1E1B24",
    outline: "#0A0B0F",
  },
  jiangshi_corpse: {
    skin: "#7B8F80",
    skinShadow: "#586B5D",
    hair: "#1A1E29",
    outline: "#0A0B0F",
  },
  demon_shadow: {
    skin: "#3B171E",
    skinShadow: "#240D12",
    hair: "#140709",
    outline: "#090406",
  },
};

export interface CostumePalette {
  primary: string;
  secondary: string;
  accent: string;
  trim: string;
  pantsPrimary: string;
  pantsSecondary: string;
  sleeve: string;
  sleeveShadow: string;
}

export const COSTUME_PALETTES: Record<CostumeId, CostumePalette> = {
  outfit_tattered_tunic: {
    primary: "#5E4332",
    secondary: "#422E21",
    accent: "#B89352",
    trim: "#8C6D46",
    pantsPrimary: "#362E2A",
    pantsSecondary: "#26201D",
    sleeve: "#563D2D",
    sleeveShadow: "#3F2C20",
  },
  outfit_flowing_ao_dai: {
    primary: "#D6D3D1",
    secondary: "#A8A29E",
    accent: "#881D1D",
    trim: "#B91C1C",
    pantsPrimary: "#1E222B",
    pantsSecondary: "#14171F",
    sleeve: "#CCC8C6",
    sleeveShadow: "#9E9996",
  },
  outfit_shrouded_cloak: {
    primary: "#2D2A3E",
    secondary: "#413C57",
    accent: "#7F1D1D",
    trim: "#5B5478",
    pantsPrimary: "#232030",
    pantsSecondary: "#191724",
    sleeve: "#292638",
    sleeveShadow: "#1D1B29",
  },
  outfit_mandarin_court: {
    primary: "#1F3B5C",
    secondary: "#14263D",
    accent: "#D4AF37",
    trim: "#8B1D1D",
    pantsPrimary: "#182D47",
    pantsSecondary: "#101E30",
    sleeve: "#1C3554",
    sleeveShadow: "#13243B",
  },
  outfit_monk_cassock: {
    primary: "#A67326",
    secondary: "#7D5218",
    accent: "#8C2620",
    trim: "#FACC15",
    pantsPrimary: "#3B2D1F",
    pantsSecondary: "#2B2016",
    sleeve: "#996A22",
    sleeveShadow: "#734E17",
  },
  outfit_shredded_burial: {
    primary: "#CBD5E1",
    secondary: "#94A3B8",
    accent: "#882222",
    trim: "#E2E8F0",
    pantsPrimary: "#B8C4D4",
    pantsSecondary: "#8D9BAE",
    sleeve: "#C2CDD9",
    sleeveShadow: "#8E9DAE",
  },
  outfit_ancient_armor: {
    primary: "#475569",
    secondary: "#334155",
    accent: "#B4893E",
    trim: "#7F1D1D",
    pantsPrimary: "#3B4657",
    pantsSecondary: "#27303D",
    sleeve: "#4A5568",
    sleeveShadow: "#323B4A",
  },
  outfit_child_pajamas: {
    primary: "#8F2626",
    secondary: "#661919",
    accent: "#D6D3D1",
    trim: "#B89352",
    pantsPrimary: "#3B4354",
    pantsSecondary: "#2A303D",
    sleeve: "#7D2121",
    sleeveShadow: "#5C1616",
  },
};
