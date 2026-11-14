import { RiskLevel, PlantingWindowStatus, WaterStressStatus } from "./district";

/**
 * 1. NASA POWER Agroclimatology & Meteorological Data
 */
export interface NasaPowerMetrics {
  avgTemperatureC: number;
  maxTemperatureC: number;
  minTemperatureC: number;
  relativeHumidityPercent: number;
  solarRadiationMJm2Day: number;
  growingSeasonDaysRemaining: number;
  heatStressRisk: RiskLevel;
  frostRisk: RiskLevel;
  climateSuitabilityIndex: number; // 0 - 100
  daysAbove35C: number;
}

/**
 * 2. Landsat & MODIS/VIIRS: Reflectance, NDVI, Vegetation Indices
 */
export interface NdviTrendPoint {
  month: string;
  ndvi: number;
  baseline: number; // 2001-onward normal
}

export interface LandsatNdviMetrics {
  currentNdvi: number;
  cropVigorStatus: "Low Vigor" | "Moderate" | "Healthy" | "Peak Vigor";
  bareGroundPercentage: number;
  plantStressDetected: boolean;
  seasonalTransitionPhase: "Maha Season Planting" | "Maha Maturation" | "Yala Season Planting" | "Fallow / Pre-Monsoon";
  historicalTrend: NdviTrendPoint[];
}

/**
 * 3. Global Precipitation Measurement (GPM) & IMERG
 */
export interface GpmImergMetrics {
  last7DaysAccumulationMm: number;
  last30DaysAccumulationMm: number;
  historicalAnomalyPercentage: number; // vs 2001-onward normal
  rainfallReliabilityScore: number;
  extremeStormFrequencyScore: RiskLevel;
  erosionRiskIndex: RiskLevel;
  soilMoistureRechargeRateMmDay: number;
  onset50mmConsecutiveAchieved: boolean; // Playbook rule: >=50mm over 5 days
}

/**
 * 4. Soil Moisture Active Passive (SMAP)
 */
export interface SmapSoilMoistureMetrics {
  surfaceSoilMoistureM3M3: number;
  surfacePercentile: number; // >= 50th percentile for planting window
  rootZoneDeficitPercent: number;
  rootZonePercentile: number; // < 20th percentile triggers water-stress alert
  droughtStressClass: RiskLevel;
  waterAvailabilityCategory: "Surplus" | "Adequate" | "Moderate Deficit" | "Critical Deficit";
  infiltrationPotentialScore: number;
  measurementIntervalDays: number;
}

/**
 * 5. ECOSTRESS and SRTM
 */
export interface EcostressMetrics {
  landSurfaceTemperatureC: number;
  evapotranspirationMmDay: number;
  plantStressHotspotCount: number;
  shallowRootVulnerability: RiskLevel;
  cropWaterDemandDeficitMm: number;
  elevationMeters: number;
}

/**
 * Historical 2001-onward Season Comparison (Playbook Page 3 & 9)
 */
export interface SeasonTimeSeriesPoint {
  week: string; // e.g. "Wk 1 (Oct)", "Wk 2 (Oct)"...
  currentSeasonRainMm: number;
  normalRainMm: number; // 2001-onward normal
  currentSoilMoisturePct: number;
  normalSoilMoisturePct: number;
}

/**
 * Actionable Crop Rotation & Adaptation Recommendations (Playbook Page 2 & 6)
 */
export interface CropAdaptationAdvice {
  currentCrop: string;
  recommendedRotationCrop: string;
  rotationRationale: string;
  droughtResilienceGainPercent: number;
  estimatedWaterSavingsPercent: number;
  urgencyLevel: "Immediate Action" | "Next Season Planning" | "Optimal Maintenance";
  shortAgeRiceVariety?: string; // e.g. "Bg 300 (3-month)" or "At 362" from DoA
  pulseAlternative?: string; // "Green Gram (MI-6)" or "Cowpea (Dhawala)"
}

/**
 * Farmer Push Notification Log (Playbook Page 3: "What farmers were told")
 */
export interface FarmerBroadcastMessage {
  id: string;
  date: string;
  type: "planting_window" | "water_stress" | "crop_switch" | "heat_warning";
  title: string;
  messageEn: string;
  messageSi: string;
  messageTa: string;
  status: "Broadcasted via SMS/WhatsApp" | "Scheduled" | "Draft";
  historicalProbabilityNote: string;
  officerSignoff: string;
}

/**
 * Consolidated District NASA Profile
 */
export interface DistrictFullNasaReport {
  districtId: string;
  districtName: string;
  localNameSi: string;
  localNameTa: string;
  isPilotDistrict: boolean;
  timestamp: string;
  plantingWindowStatus: PlantingWindowStatus;
  waterStressStatus: WaterStressStatus;
  compositeAdaptationScore: number; // 0 - 100
  powerData: NasaPowerMetrics;
  landsatData: LandsatNdviMetrics;
  gpmData: GpmImergMetrics;
  smapData: SmapSoilMoistureMetrics;
  ecostressData: EcostressMetrics;
  adaptationAdvice: CropAdaptationAdvice;
  seasonTimeSeries: SeasonTimeSeriesPoint[];
  farmerAlerts: FarmerBroadcastMessage[];
  backtestSummary: {
    event: string;
    warningLeadTimeDays: number;
    evidenceNotes: string;
  };
}
