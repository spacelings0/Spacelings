"use client";

import React, { useState, useMemo } from "react";
import districtsData from "@/lib/data/districts-projected.json";
import { DistrictSummary } from "@/lib/types/district";
import { MapNote } from "@/lib/types/notes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Layers,
  MapPin,
  PlusCircle,
  Eye,
  EyeOff,
  Droplets,
  CloudRain,
  Sprout,
  Flame,
  Sparkles,
  Compass,
} from "lucide-react";

export type MetricLayer =
  | "overview"
  | "planting_window"
  | "water_stress"
  | "rainfall_normal"
  | "ndvi_vigor"
  | "heat_stress";

interface SriLankaMapProps {
  districts: DistrictSummary[];
  selectedDistrictId: string | null;
  onSelectDistrict: (districtId: string) => void;
  notes: MapNote[];
  onAddNoteAtDistrict: (districtId: string, districtName: string) => void;
}

export function SriLankaMap({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  notes,
  onAddNoteAtDistrict,
}: SriLankaMapProps) {
  const [activeLayer, setActiveLayer] = useState<MetricLayer>("planting_window");
  const [showNotesPins, setShowNotesPins] = useState<boolean>(true);
  const [isAddNoteMode, setIsAddNoteMode] = useState<boolean>(false);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);

  // Quick lookup map
  const summaryMap = useMemo(() => {
    const map = new Map<string, DistrictSummary>();
    districts.forEach((d) => map.set(d.id, d));
    return map;
  }, [districts]);

  // Group notes by district
  const notesByDistrict = useMemo(() => {
    const map = new Map<string, MapNote[]>();
    notes.forEach((n) => {
      const list = map.get(n.districtId) || [];
      list.push(n);
      map.set(n.districtId, list);
    });
    return map;
  }, [notes]);

  // Determine fill color for each district based on active metric layer
  const getDistrictColor = (districtId: string): string => {
    const summary = summaryMap.get(districtId);
    if (!summary) return "hsl(var(--muted))";

    switch (activeLayer) {
      case "planting_window": {
        // Playbook Rule 1: Planting Window Status
        if (summary.plantingWindowStatus === "Window Open") {
          return "rgba(16, 185, 129, 0.40)"; // green / onset achieved
        } else if (summary.plantingWindowStatus === "Waiting for Onset") {
          return "rgba(245, 158, 11, 0.35)"; // amber / waiting for 50mm
        }
        return "rgba(239, 68, 68, 0.40)"; // rose / delayed onset
      }

      case "water_stress": {
        // Playbook Rule 2: SMAP Root-Zone Water Stress (<20th percentile)
        if (summary.waterStressStatus === "Severe Deficit") {
          return "rgba(239, 68, 68, 0.48)";
        } else if (summary.waterStressStatus === "Moderate Stress") {
          return "rgba(245, 158, 11, 0.38)";
        }
        return "rgba(14, 165, 233, 0.32)"; // optimal
      }

      case "rainfall_normal": {
        // GPM IMERG 30-Day Rainfall vs 2001-onward normal
        if (summary.rainfallAnomalyPercent < -30) {
          return "rgba(225, 29, 72, 0.45)";
        } else if (summary.rainfallAnomalyPercent < -10) {
          return "rgba(217, 119, 6, 0.38)";
        } else if (summary.rainfallAnomalyPercent <= 15) {
          return "rgba(16, 185, 129, 0.35)";
        }
        return "rgba(59, 130, 246, 0.42)";
      }

      case "ndvi_vigor": {
        // Landsat & MODIS NDVI Vigor Score
        if (summary.ndviVigorScore < 0.45) {
          return "rgba(244, 63, 94, 0.40)";
        } else if (summary.ndviVigorScore < 0.65) {
          return "rgba(234, 179, 8, 0.35)";
        }
        return "rgba(16, 185, 129, 0.45)";
      }

      case "heat_stress": {
        // NASA POWER & ECOSTRESS Heat
        if (summary.heatStressCelsius > 34.0) {
          return "rgba(239, 68, 68, 0.48)";
        } else if (summary.heatStressCelsius > 31.5) {
          return "rgba(249, 115, 22, 0.38)";
        }
        return "rgba(14, 165, 233, 0.30)";
      }

      case "overview":
      default: {
        // Climatic agricultural zones
        if (summary.climateZone === "Dry Zone") {
          return summary.overallRisk === "severe"
            ? "rgba(244, 63, 94, 0.32)"
            : "rgba(245, 158, 11, 0.25)";
        }
        if (summary.climateZone === "Intermediate Zone") {
          return "rgba(14, 165, 233, 0.22)";
        }
        return "rgba(34, 197, 94, 0.24)";
      }
    }
  };

  const hoveredSummary = hoveredDistrictId ? summaryMap.get(hoveredDistrictId) : null;
  const hoveredDistrictGeo = hoveredDistrictId
    ? districtsData.districts.find((d) => d.id === hoveredDistrictId)
    : null;

  return (
    <div className="relative flex flex-col h-full w-full rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs">
      {/* Top Map Toolbar with Clean Pill Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b border-border/50 bg-muted/15">
        {/* Layer Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            Layer:
          </span>
          <Button
            variant={activeLayer === "planting_window" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveLayer("planting_window")}
            className="h-7.5 text-xs px-3 rounded-full"
          >
            Planting Window
          </Button>
          <Button
            variant={activeLayer === "water_stress" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveLayer("water_stress")}
            className="h-7.5 text-xs px-3 rounded-full gap-1.5"
          >
            <Droplets className="h-3 w-3 text-sky-500" />
            Water Stress (SMAP)
          </Button>
          <Button
            variant={activeLayer === "rainfall_normal" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveLayer("rainfall_normal")}
            className="h-7.5 text-xs px-3 rounded-full gap-1.5"
          >
            <CloudRain className="h-3 w-3 text-blue-500" />
            Rain vs 2001 (GPM)
          </Button>
          <Button
            variant={activeLayer === "ndvi_vigor" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveLayer("ndvi_vigor")}
            className="h-7.5 text-xs px-3 rounded-full gap-1.5"
          >
            <Sprout className="h-3 w-3 text-emerald-500" />
            Landsat NDVI
          </Button>
          <Button
            variant={activeLayer === "overview" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveLayer("overview")}
            className="h-7.5 text-xs px-2.5 rounded-full"
          >
            Zones
          </Button>
        </div>

        {/* Map Notes & Pin Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={showNotesPins ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowNotesPins(!showNotesPins)}
            className="h-7.5 text-xs px-2.5 rounded-full gap-1 text-muted-foreground"
            title="Toggle advisory note pins on map"
          >
            {showNotesPins ? (
              <Eye className="h-3.5 w-3.5 text-primary" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Pins</span>
          </Button>

          <Button
            variant={isAddNoteMode ? "destructive" : "outline"}
            size="sm"
            onClick={() => setIsAddNoteMode(!isAddNoteMode)}
            className="h-7.5 text-xs px-3 rounded-full gap-1.5"
            title="Click a district to pin a new agricultural note"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{isAddNoteMode ? "Cancel Pinning" : "Add Note Pin"}</span>
          </Button>
        </div>
      </div>

      {/* Mode Indicator Banner when Pinning Mode is Active */}
      {isAddNoteMode && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-xs flex items-center justify-between text-primary font-medium animate-pulse">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Click any district on the map to attach an advisory note.</span>
          </div>
          <button
            onClick={() => setIsAddNoteMode(false)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main SVG Map Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-6 min-h-[500px] lg:min-h-[620px] bg-background/50 select-none">
        <svg
          viewBox={districtsData.viewBox}
          className="w-full h-full max-h-[76vh] object-contain drop-shadow-xs"
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sri Lanka 25 Districts Polygons */}
          <g className="districts-layer">
            {districtsData.districts.map((district) => {
              const isSelected = selectedDistrictId === district.id;
              const isHovered = hoveredDistrictId === district.id;
              const isPilot = district.id === "polonnaruwa";
              const fillColor = getDistrictColor(district.id);

              return (
                <path
                  key={district.id}
                  d={district.path}
                  fill={fillColor}
                  className="transition-all duration-200 cursor-pointer"
                  stroke={
                    isSelected
                      ? "hsl(var(--primary))"
                      : isPilot
                      ? "rgba(16, 185, 129, 0.9)"
                      : isHovered
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--border))"
                  }
                  strokeWidth={isSelected ? 2.8 : isPilot ? 1.8 : isHovered ? 1.5 : 0.8}
                  strokeDasharray={isPilot && !isSelected ? "4 2" : undefined}
                  strokeLinejoin="round"
                  filter={isSelected ? "url(#glow)" : undefined}
                  onMouseEnter={() => setHoveredDistrictId(district.id)}
                  onMouseLeave={() => setHoveredDistrictId(null)}
                  onClick={() => {
                    if (isAddNoteMode) {
                      onAddNoteAtDistrict(district.id, district.name);
                      setIsAddNoteMode(false);
                    } else {
                      onSelectDistrict(district.id);
                    }
                  }}
                />
              );
            })}
          </g>

          {/* District Name Labels with Background Halo Stroke */}
          <g className="labels-layer pointer-events-none">
            {districtsData.districts.map((d) => {
              const isPilot = d.id === "polonnaruwa";
              const isSelected = selectedDistrictId === d.id;

              return (
                <text
                  key={`lbl-${d.id}`}
                  x={d.centroid[0]}
                  y={d.centroid[1]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isSelected ? "11.5" : isPilot ? "11" : "9.5"}
                  fontWeight={isSelected || isPilot ? "700" : "600"}
                  stroke="hsl(var(--card))"
                  strokeWidth="2.5"
                  paintOrder="stroke fill"
                  className={`select-none transition-all ${
                    isSelected
                      ? "fill-primary"
                      : isPilot
                      ? "fill-emerald-600 dark:fill-emerald-400 font-bold"
                      : "fill-foreground/90"
                  }`}
                >
                  {d.name} {isPilot ? "★" : ""}
                </text>
              );
            })}
          </g>

          {/* Map Note Pins Overlay */}
          {showNotesPins && (
            <g className="notes-pins-layer">
              {districtsData.districts.map((district) => {
                const districtNotes = notesByDistrict.get(district.id);
                if (!districtNotes || districtNotes.length === 0) return null;

                const hasUrgent = districtNotes.some((n) => n.priority === "urgent");
                const pinX = district.centroid[0] + 12;
                const pinY = district.centroid[1] - 10;

                return (
                  <g
                    key={`pin-${district.id}`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDistrict(district.id);
                    }}
                  >
                    {/* Pulsing ring for urgent notes */}
                    {hasUrgent && (
                      <circle
                        cx={pinX}
                        cy={pinY}
                        r="11"
                        className="fill-rose-500/30 animate-ping opacity-75"
                      />
                    )}

                    {/* Main Pin Icon Circle */}
                    <circle
                      cx={pinX}
                      cy={pinY}
                      r="8"
                      className={`${
                        hasUrgent
                          ? "fill-rose-500 stroke-rose-200 dark:stroke-rose-900"
                          : "fill-amber-500 stroke-amber-200 dark:stroke-amber-900"
                      } stroke-2 transition-transform duration-200 group-hover:scale-125`}
                    />

                    {/* Note Count Text */}
                    <text
                      x={pinX}
                      y={pinY + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="9"
                      fontWeight="700"
                      className="fill-white pointer-events-none"
                    >
                      {districtNotes.length}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Information Card (Floating in Top-Right Corner) */}
        {hoveredSummary && hoveredDistrictGeo && (
          <div className="absolute top-4 right-4 z-20 w-72 rounded-xl border border-border/80 bg-popover/95 p-4 shadow-lg backdrop-blur-md animate-in fade-in-0 duration-150 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-foreground">
                    {hoveredSummary.name}
                  </h4>
                  {hoveredSummary.isPilotDistrict && (
                    <Badge variant="outline" className="text-[9px] py-0 px-1 border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                      Pilot
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {hoveredSummary.localNameSi} • {hoveredSummary.climateZone}
                </p>
              </div>
              <Badge
                variant={
                  hoveredSummary.plantingWindowStatus === "Window Open"
                    ? "success"
                    : hoveredSummary.plantingWindowStatus === "Waiting for Onset"
                    ? "warning"
                    : "danger"
                }
                className="text-[10px] uppercase py-0"
              >
                {hoveredSummary.plantingWindowStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-2.5">
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  SMAP Moisture:
                </span>
                <span className="font-semibold text-foreground">
                  {hoveredSummary.soilMoistureScore}% (0-5cm)
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  Rain vs 2001 Normal:
                </span>
                <span
                  className={`font-semibold ${
                    hoveredSummary.rainfallAnomalyPercent < 0
                      ? "text-rose-500"
                      : "text-emerald-500"
                  }`}
                >
                  {hoveredSummary.rainfallAnomalyPercent > 0 ? "+" : ""}
                  {hoveredSummary.rainfallAnomalyPercent}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  Water Stress:
                </span>
                <span className="font-semibold text-foreground">
                  {hoveredSummary.waterStressStatus}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  Landsat NDVI:
                </span>
                <span className="font-semibold text-foreground">
                  {hoveredSummary.ndviVigorScore}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
              <span className="truncate max-w-[170px]">
                {hoveredSummary.dominantCrop}
              </span>
              {notesByDistrict.get(hoveredSummary.id)?.length ? (
                <span className="text-amber-500 font-semibold text-[10px]">
                  {notesByDistrict.get(hoveredSummary.id)?.length} note(s)
                </span>
              ) : null}
            </div>
            <p className="text-[10px] text-primary/80 italic text-center pt-0.5">
              Click to view Playbook decision rules & telemetry
            </p>
          </div>
        )}

        {/* Minimal Bottom-Left Map Legend */}
        <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-border/70 bg-background/95 p-3 backdrop-blur-md text-[11px] shadow-sm">
          <div className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px] mb-2">
            {activeLayer === "planting_window" && "Planting Window Status (Playbook Rule 1)"}
            {activeLayer === "water_stress" && "SMAP Water Stress (<20th Percentile)"}
            {activeLayer === "rainfall_normal" && "GPM IMERG Rain vs 2001 Normal"}
            {activeLayer === "ndvi_vigor" && "Landsat / MODIS NDVI Crop Vigor"}
            {activeLayer === "heat_stress" && "NASA POWER & ECOSTRESS Heat"}
            {activeLayer === "overview" && "Agricultural Climate Zones"}
          </div>

          <div className="flex items-center gap-3">
            {activeLayer === "planting_window" && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>Window Open (≥50mm onset)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Waiting for Onset</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span>Onset Delayed</span>
                </div>
              </>
            )}

            {activeLayer === "water_stress" && (
              <>
                <span className="text-rose-500 font-semibold">&lt;20th %ile (Alert)</span>
                <span className="h-1.5 w-20 rounded-full bg-linear-to-r from-rose-500 via-amber-400 to-sky-500" />
                <span className="text-sky-500 font-semibold">&gt;50th %ile (Optimal)</span>
              </>
            )}

            {activeLayer === "rainfall_normal" && (
              <>
                <span className="text-rose-500 font-semibold">-45% (Deficit)</span>
                <span className="h-1.5 w-20 rounded-full bg-linear-to-r from-rose-500 via-emerald-400 to-blue-600" />
                <span className="text-blue-500 font-semibold">+25% (Surplus)</span>
              </>
            )}

            {activeLayer === "ndvi_vigor" && (
              <>
                <span className="text-rose-500 font-semibold">0.3 (Stress)</span>
                <span className="h-1.5 w-20 rounded-full bg-linear-to-r from-rose-400 via-yellow-400 to-emerald-600" />
                <span className="text-emerald-500 font-semibold">0.9 (Vigor)</span>
              </>
            )}

            {activeLayer === "heat_stress" && (
              <>
                <span className="text-sky-500 font-semibold">20°C (Cool)</span>
                <span className="h-1.5 w-20 rounded-full bg-linear-to-r from-sky-400 via-amber-400 to-rose-600" />
                <span className="text-rose-500 font-semibold">36°C (Hotspot)</span>
              </>
            )}

            {activeLayer === "overview" && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-rose-500/40 border border-rose-500" />
                  <span>Dry Zone (High Risk)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-sky-500/30 border border-sky-500" />
                  <span>Intermediate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500/30 border border-emerald-500" />
                  <span>Wet Zone</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
