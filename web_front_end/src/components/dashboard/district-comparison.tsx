"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Scale,
  Droplets,
  CloudRain,
  Sprout,
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { DistrictSummary } from "@/lib/types/district";
import { generateDistrictFullReport } from "@/lib/data/mock-nasa-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface DistrictComparisonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  districts: DistrictSummary[];
  defaultDistrictId?: string;
}

export function DistrictComparison({
  open,
  onOpenChange,
  districts,
  defaultDistrictId,
}: DistrictComparisonProps) {
  const [districtIdA, setDistrictIdA] = useState<string>(
    defaultDistrictId || "anuradhapura"
  );
  const [districtIdB, setDistrictIdB] = useState<string>("kurunegala");

  // Keep districtIdA in sync if defaultDistrictId changes
  React.useEffect(() => {
    if (defaultDistrictId) {
      setDistrictIdA(defaultDistrictId);
      if (defaultDistrictId === districtIdB) {
        setDistrictIdB(defaultDistrictId === "kurunegala" ? "polonnaruwa" : "kurunegala");
      }
    }
  }, [defaultDistrictId, districtIdB]);

  const reportA = useMemo(() => generateDistrictFullReport(districtIdA), [districtIdA]);
  const reportB = useMemo(() => generateDistrictFullReport(districtIdB), [districtIdB]);

  const chartData = [
    {
      metric: "Soil Moisture (SMAP)",
      [reportA.districtName]: Math.round(reportA.smapData.surfaceSoilMoistureM3M3 * 200), // scaled to 100
      [reportB.districtName]: Math.round(reportB.smapData.surfaceSoilMoistureM3M3 * 200),
    },
    {
      metric: "NDVI Vigor (Landsat)",
      [reportA.districtName]: Math.round(reportA.landsatData.currentNdvi * 100),
      [reportB.districtName]: Math.round(reportB.landsatData.currentNdvi * 100),
    },
    {
      metric: "Rainfall Rel. (GPM)",
      [reportA.districtName]: reportA.gpmData.rainfallReliabilityScore,
      [reportB.districtName]: reportB.gpmData.rainfallReliabilityScore,
    },
    {
      metric: "Climate Suitability",
      [reportA.districtName]: reportA.powerData.climateSuitabilityIndex,
      [reportB.districtName]: reportB.powerData.climateSuitabilityIndex,
    },
    {
      metric: "Adaptation Score",
      [reportA.districtName]: reportA.compositeAdaptationScore,
      [reportB.districtName]: reportB.compositeAdaptationScore,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <DialogTitle className="text-base font-bold">
              Multi-District Agricultural Comparison
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Side-by-side evaluation of satellite climate metrics and crop rotation strategies across Sri Lanka
          </DialogDescription>
        </DialogHeader>

        {/* District Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Selector A */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Primary District (A)
            </label>
            <Select value={districtIdA} onValueChange={setDistrictIdA}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select District A" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={`a-${d.id}`} value={d.id}>
                    {d.name} ({d.climateZone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selector B */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Comparison District (B)
            </label>
            <Select value={districtIdB} onValueChange={setDistrictIdB}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select District B" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem
                    key={`b-${d.id}`}
                    value={d.id}
                    disabled={d.id === districtIdA}
                  >
                    {d.name} ({d.climateZone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Side-by-Side Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Card A */}
          <Card className="p-4 bg-muted/20 border-border/80 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {reportA.districtName}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Current: {reportA.adaptationAdvice.currentCrop}
                </p>
              </div>
              <Badge
                variant={
                  reportA.compositeAdaptationScore < 50
                    ? "danger"
                    : reportA.compositeAdaptationScore < 75
                    ? "warning"
                    : "success"
                }
                className="text-xs"
              >
                Score: {reportA.compositeAdaptationScore}/100
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  SMAP Soil Moisture:
                </span>
                <span className="font-semibold text-foreground">
                  {reportA.smapData.surfaceSoilMoistureM3M3} m³/m³
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  GPM 30d Anomaly:
                </span>
                <span
                  className={`font-semibold ${
                    reportA.gpmData.historicalAnomalyPercentage < 0
                      ? "text-rose-500"
                      : "text-emerald-500"
                  }`}
                >
                  {reportA.gpmData.historicalAnomalyPercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  Landsat NDVI:
                </span>
                <span className="font-semibold text-foreground">
                  {reportA.landsatData.currentNdvi} ({reportA.landsatData.cropVigorStatus})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  ECOSTRESS LST:
                </span>
                <span className="font-semibold text-foreground">
                  {reportA.ecostressData.landSurfaceTemperatureC}°C
                </span>
              </div>
            </div>

            <div className="border-t border-border/50 pt-2 text-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                Target Crop Shift:
              </span>
              <span className="font-medium text-primary">
                {reportA.adaptationAdvice.recommendedRotationCrop}
              </span>
            </div>
          </Card>

          {/* Card B */}
          <Card className="p-4 bg-muted/20 border-border/80 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {reportB.districtName}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Current: {reportB.adaptationAdvice.currentCrop}
                </p>
              </div>
              <Badge
                variant={
                  reportB.compositeAdaptationScore < 50
                    ? "danger"
                    : reportB.compositeAdaptationScore < 75
                    ? "warning"
                    : "success"
                }
                className="text-xs"
              >
                Score: {reportB.compositeAdaptationScore}/100
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  SMAP Soil Moisture:
                </span>
                <span className="font-semibold text-foreground">
                  {reportB.smapData.surfaceSoilMoistureM3M3} m³/m³
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  GPM 30d Anomaly:
                </span>
                <span
                  className={`font-semibold ${
                    reportB.gpmData.historicalAnomalyPercentage < 0
                      ? "text-rose-500"
                      : "text-emerald-500"
                  }`}
                >
                  {reportB.gpmData.historicalAnomalyPercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  Landsat NDVI:
                </span>
                <span className="font-semibold text-foreground">
                  {reportB.landsatData.currentNdvi} ({reportB.landsatData.cropVigorStatus})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  ECOSTRESS LST:
                </span>
                <span className="font-semibold text-foreground">
                  {reportB.ecostressData.landSurfaceTemperatureC}°C
                </span>
              </div>
            </div>

            <div className="border-t border-border/50 pt-2 text-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                Target Crop Shift:
              </span>
              <span className="font-medium text-primary">
                {reportB.adaptationAdvice.recommendedRotationCrop}
              </span>
            </div>
          </Card>
        </div>

        {/* Normalized Comparative Bar Chart */}
        <div className="rounded-lg border border-border/80 p-4 bg-card/60 mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Normalized Comparative Indicators (0 - 100 Scale)
            </span>
            <span className="text-[10px] text-muted-foreground">
              NASA Multimodal Fusion
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="metric"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey={reportA.districtName} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey={reportB.districtName} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable Contrast Insight */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-foreground">
              Administrative Crop Policy Insight
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {reportA.districtName} exhibits a {Math.abs(reportA.smapData.rootZoneDeficitPercent - reportB.smapData.rootZoneDeficitPercent)}% variance in root zone deficit compared to {reportB.districtName}. Prioritize agricultural subsidy allocation and seed distribution for {reportA.adaptationAdvice.recommendedRotationCrop} in {reportA.districtName} prior to onset of the dry window.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
