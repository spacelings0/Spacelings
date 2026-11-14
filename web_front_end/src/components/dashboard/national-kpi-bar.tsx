"use client";

import React from "react";
import {
  AlertTriangle,
  Droplets,
  CloudRain,
  Sprout,
  Compass,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { DistrictSummary } from "@/lib/types/district";

interface NationalKpiBarProps {
  districts: DistrictSummary[];
  onSelectPilot?: () => void;
}

export function NationalKpiBar({ districts, onSelectPilot }: NationalKpiBarProps) {
  const windowOpen = districts.filter((d) => d.plantingWindowStatus === "Window Open");
  const delayed = districts.filter((d) => d.plantingWindowStatus === "Delayed");
  const waterStressAlerts = districts.filter(
    (d) => d.waterStressStatus === "Severe Deficit" || d.waterStressStatus === "Moderate Stress"
  );

  const avgSoilMoisture = Math.round(
    districts.reduce((sum, d) => sum + d.soilMoistureScore, 0) / (districts.length || 1)
  );

  const avgRainfallAnomaly = Math.round(
    districts.reduce((sum, d) => sum + d.rainfallAnomalyPercent, 0) /
      (districts.length || 1)
  );

  const polonnaruwa = districts.find((d) => d.id === "polonnaruwa");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
      {/* KPI 1: Space Apps 2026 Pilot District (Polonnaruwa) */}
      <Card
        onClick={onSelectPilot}
        className="p-4 bg-primary/5 border-primary/20 hover:border-primary/40 cursor-pointer transition-all shadow-2xs group"
      >
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Pilot District
          </span>
          <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">
            Inspect →
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Polonnaruwa
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Planting Window Open (7 DS Divisions)</span>
        </div>
      </Card>

      {/* KPI 2: Planting Window Status */}
      <Card className="p-4 bg-card/60 backdrop-blur-xs border-border/50 hover:border-border transition-colors shadow-2xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Planting Window
          </span>
          <Sprout className="h-3.5 w-3.5 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            {windowOpen.length}
          </span>
          <span className="text-xs text-muted-foreground">districts open</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          {delayed.length} delayed by weak onset (<span className="text-amber-500 font-medium">Rule 1</span>)
        </p>
      </Card>

      {/* KPI 3: Water Stress Alerts (SMAP Root-Zone) */}
      <Card className="p-4 bg-card/60 backdrop-blur-xs border-border/50 hover:border-border transition-colors shadow-2xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Water Stress Warning
          </span>
          <Droplets className="h-3.5 w-3.5 text-sky-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            {waterStressAlerts.length}
          </span>
          <span className="text-xs text-muted-foreground">districts flagged</span>
        </div>
        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1.5 truncate">
          SMAP root zone &lt; 20th percentile
        </p>
      </Card>

      {/* KPI 4: 30-Day Rainfall Departure (GPM IMERG) */}
      <Card className="p-4 bg-card/60 backdrop-blur-xs border-border/50 hover:border-border transition-colors shadow-2xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            GPM IMERG Departure
          </span>
          <CloudRain className="h-3.5 w-3.5 text-blue-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-xl font-bold tracking-tight ${
              avgRainfallAnomaly < 0 ? "text-amber-500" : "text-emerald-500"
            }`}
          >
            {avgRainfallAnomaly > 0 ? `+${avgRainfallAnomaly}%` : `${avgRainfallAnomaly}%`}
          </span>
          <span className="text-xs text-muted-foreground">vs 2001-onward</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          National average soil moisture: {avgSoilMoisture}%
        </p>
      </Card>

      {/* KPI 5: Season & Cycle */}
      <Card className="col-span-2 md:col-span-4 lg:col-span-1 p-4 bg-card/60 backdrop-blur-xs border-border/50 hover:border-border transition-colors shadow-2xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Current Season
          </span>
          <Compass className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold tracking-tight text-foreground">
            Maha Season
          </span>
          <span className="text-xs text-emerald-500 font-medium">Active</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Northeast monsoon & inter-monsoon
        </p>
      </Card>
    </div>
  );
}
