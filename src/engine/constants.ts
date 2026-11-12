import type { SlotAnchor, SlotId, GroundSlotId, AirSlotId } from "./types";

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
