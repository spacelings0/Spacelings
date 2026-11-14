export type ClimateZone = "Dry Zone" | "Intermediate Zone" | "Wet Zone";

export type ProvinceName =
  | "Northern"
  | "North Western"
  | "Western"
  | "North Central"
  | "Central"
  | "Sabaragamuwa"
  | "Eastern"
  | "Uva"
  | "Southern";

export type PlantingWindowStatus =
  | "Window Open"
  | "Waiting for Onset"
  | "Delayed"
  | "Closed";

export type WaterStressStatus =
  | "Optimal"
  | "Moderate Stress"
  | "Severe Deficit";

export type RiskLevel = "optimal" | "moderate" | "high" | "severe";

export interface DistrictSummary {
  id: string;
  name: string;
  localNameSi: string;
  localNameTa: string;
  province: ProvinceName;
  climateZone: ClimateZone;
  isPilotDistrict?: boolean; // Polonnaruwa is the Space Apps 2026 pilot district
  overallRisk: RiskLevel;
  plantingWindowStatus: PlantingWindowStatus;
  waterStressStatus: WaterStressStatus;
  soilMoistureScore: number; // 0-100%
  rainfallAnomalyPercent: number; // e.g. -38% vs 2001-onward normal
  ndviVigorScore: number; // 0-1.0
  heatStressCelsius: number; // e.g. 33.1°C
  activeAlertCount: number;
  dominantCrop: string;
  dsDivisionsCount: number;
}
