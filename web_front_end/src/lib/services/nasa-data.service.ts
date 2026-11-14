import { DistrictSummary } from "../types/district";
import { DistrictFullNasaReport } from "../types/nasa";
import { DISTRICT_SUMMARIES, generateDistrictFullReport } from "../data/mock-nasa-data";

/**
 * NASA Data Service
 * Decoupled data-access layer for NASA POWER, Landsat, GPM, SMAP, and ECOSTRESS datasets.
 * This can easily be connected to a live Python/FastAPI backend or NASA Earthdata APIs.
 */
class NasaDataService {
  /**
   * Retrieves summary indicators for all 25 Sri Lankan districts
   */
  async getAllDistrictsSummary(): Promise<DistrictSummary[]> {
    // Simulated network delay for realistic async behavior
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DISTRICT_SUMMARIES);
      }, 50);
    });
  }

  /**
   * Retrieves full NASA scientific report for a specific district
   */
  async getDistrictFullReport(districtId: string): Promise<DistrictFullNasaReport> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateDistrictFullReport(districtId));
      }, 50);
    });
  }

  /**
   * Retrieves multi-district comparative analytics
   */
  async getMultiDistrictComparison(
    districtIds: string[]
  ): Promise<DistrictFullNasaReport[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reports = districtIds.map((id) => generateDistrictFullReport(id));
        resolve(reports);
      }, 80);
    });
  }

  /**
   * National Agroclimate Aggregates
   */
  async getNationalOverview() {
    const districts = DISTRICT_SUMMARIES;
    const severeCount = districts.filter((d) => d.overallRisk === "severe").length;
    const highCount = districts.filter((d) => d.overallRisk === "high").length;
    const avgSoilMoisture = Math.round(
      districts.reduce((acc, d) => acc + d.soilMoistureScore, 0) / districts.length
    );
    const avgRainfallAnomaly = Math.round(
      districts.reduce((acc, d) => acc + d.rainfallAnomalyPercent, 0) / districts.length
    );

    return {
      totalDistricts: districts.length,
      severeDroughtDistricts: severeCount,
      highStressDistricts: highCount,
      averageSoilMoistureScore: avgSoilMoisture,
      nationalRainfallDeparturePercent: avgRainfallAnomaly,
      currentMonsoonPhase: "Northeast Monsoon (Maha)",
      activeSatellitePasses: "SMAP (Active), Landsat-9 (T-2h), GPM (Continuous)",
    };
  }
}

export const nasaDataService = new NasaDataService();
