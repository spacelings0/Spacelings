"use client";

import React, { useState } from "react";
import {
  X,
  Droplets,
  CloudRain,
  Sprout,
  Flame,
  ArrowRight,
  PlusCircle,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Sparkles,
  PhoneCall,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { DistrictFullNasaReport } from "@/lib/types/nasa";
import { MapNote, NotePriority } from "@/lib/types/notes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DistrictDetailDrawerProps {
  report: DistrictFullNasaReport | null;
  onClose: () => void;
  notes: MapNote[];
  onAddNote: (
    districtId: string,
    districtName: string,
    title: string,
    content: string,
    priority: NotePriority,
    author: string
  ) => void;
  onDeleteNote: (noteId: string) => void;
}

export function DistrictDetailDrawer({
  report,
  onClose,
  notes,
  onAddNote,
  onDeleteNote,
}: DistrictDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>("rules");

  // New Note Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newPriority, setNewPriority] = useState<NotePriority>("medium");
  const [newAuthor, setNewAuthor] = useState("Agriculture Instructor (AI)");

  if (!report) return null;

  const districtNotes = notes.filter((n) => n.districtId === report.districtId);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddNote(
      report.districtId,
      report.districtName,
      newTitle.trim(),
      newContent.trim(),
      newPriority,
      newAuthor.trim() || "Agriculture Instructor"
    );

    setNewTitle("");
    setNewContent("");
    setNewPriority("medium");
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-background border-l border-border/80 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Drawer Header with Clean Whitespace */}
      <div className="flex items-start justify-between border-b border-border/60 p-5 sm:p-6 bg-muted/15">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                {report.districtName}
              </h2>
              <span className="text-sm font-medium text-muted-foreground">
                ({report.localNameSi} • {report.localNameTa})
              </span>
              {report.isPilotDistrict && (
                <Badge variant="outline" className="text-[10px] py-0.5 px-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold gap-1">
                  <Sparkles className="h-3 w-3" />
                  Space Apps 2026 Pilot District
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              NASA Agroclimate Decision Protocol • Agriculture Instructor (AI) Command
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-muted shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
        {/* Playbook Status Summary Card */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4.5 space-y-3.5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Season Status Card (Maha 2026/27)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  report.plantingWindowStatus === "Window Open"
                    ? "success"
                    : report.plantingWindowStatus === "Waiting for Onset"
                    ? "warning"
                    : "danger"
                }
                className="text-xs font-medium"
              >
                {report.plantingWindowStatus}
              </Badge>
              <Badge
                variant={
                  report.waterStressStatus === "Severe Deficit"
                    ? "danger"
                    : report.waterStressStatus === "Moderate Stress"
                    ? "warning"
                    : "success"
                }
                className="text-xs font-medium"
              >
                {report.waterStressStatus}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                Rain Onset Status
              </span>
              <span className="font-semibold text-foreground">
                {report.gpmData.onset50mmConsecutiveAchieved ? "Achieved (≥50mm / 5d)" : "Pending (Under 50mm)"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                SMAP Surface Soil
              </span>
              <span className="font-semibold text-foreground">
                {report.smapData.surfacePercentile}th percentile ({report.smapData.surfaceSoilMoistureM3M3} m³/m³)
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                SMAP Root-Zone
              </span>
              <span className="font-semibold text-foreground">
                {report.smapData.rootZonePercentile}th percentile ({report.smapData.waterAvailabilityCategory})
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                GPM vs 2001 Normal
              </span>
              <span
                className={`font-semibold ${
                  report.gpmData.historicalAnomalyPercentage < 0
                    ? "text-rose-500"
                    : "text-emerald-500"
                }`}
              >
                {report.gpmData.historicalAnomalyPercentage}% departure
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full h-9 text-xs rounded-lg p-1 bg-muted/30">
            <TabsTrigger value="rules" className="text-[11px]">Decision Rules</TabsTrigger>
            <TabsTrigger value="timeseries" className="text-[11px]">2001 Normal</TabsTrigger>
            <TabsTrigger value="farmer_alerts" className="text-[11px]">Farmer Texts</TabsTrigger>
            <TabsTrigger value="satellite" className="text-[11px]">NASA Telemetry</TabsTrigger>
            <TabsTrigger value="notes" className="text-[11px]">Field Notes</TabsTrigger>
          </TabsList>

          {/* TAB 1: DECISION RULES & ADVISORY LOGIC */}
          <TabsContent value="rules" className="space-y-4 pt-3">
            {/* Rule 1: Planting Window Condition Evaluation */}
            <Card className="p-4.5 bg-card/70 border-border/70 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Rule 1: Planting Window Open (All 3 Conditions Required)
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      NASA IMERG rainfall & SMAP surface moisture threshold protocol
                    </p>
                  </div>
                </div>
                <Badge
                  variant={report.plantingWindowStatus === "Window Open" ? "success" : "warning"}
                  className="text-xs"
                >
                  {report.plantingWindowStatus === "Window Open" ? "Criteria Satisfied" : "Pending Onset"}
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                {/* Condition 1 */}
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/20">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      report.gpmData.onset50mmConsecutiveAchieved
                        ? "text-emerald-500"
                        : "text-muted-foreground/40"
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-foreground">
                      Condition A: Rain Onset Threshold
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      At least 50 mm of IMERG satellite rainfall over 5 consecutive days after the season start date. (Current 7d: {report.gpmData.last7DaysAccumulationMm} mm).
                    </p>
                  </div>
                </div>

                {/* Condition 2 */}
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">
                      Condition B: No False Start (Historical Probability)
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      In past satellite records since 2001, no dry spell longer than 10 days followed within 21 days of onset. (Historical hold rate: 79% / 19 of 24 years).
                    </p>
                  </div>
                </div>

                {/* Condition 3 */}
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/20">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      report.smapData.surfacePercentile >= 50
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-foreground">
                      Condition C: Soil Ready
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      SMAP surface soil moisture is at or above the 50th percentile for this division ({report.smapData.surfacePercentile}th percentile measured).
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Rule 2 & 3: Water Stress & Crop Switch Advisory */}
            <Card className="p-4.5 bg-card/70 border-border/70 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                    2 & 3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Rule 2 & 3: Water-Stress & Crop-Switch Guidance
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Short-age paddy vs other field crops (mung bean, cowpea, sesame)
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    report.adaptationAdvice.urgencyLevel === "Immediate Action"
                      ? "danger"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {report.adaptationAdvice.urgencyLevel}
                </Badge>
              </div>

              {/* Crop Switch Details */}
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sprout className="h-4 w-4" />
                  <span>Recommended Action for Extension Officers & Farmers:</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="line-through text-muted-foreground">
                    {report.adaptationAdvice.currentCrop}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-bold text-foreground">
                    {report.adaptationAdvice.recommendedRotationCrop}
                  </span>
                </div>

                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {report.adaptationAdvice.rotationRationale}
                </p>

                <div className="flex items-center gap-4 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+{report.adaptationAdvice.droughtResilienceGainPercent}% Resilience Gain</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-semibold">
                    <Droplets className="h-3.5 w-3.5" />
                    <span>{report.adaptationAdvice.estimatedWaterSavingsPercent}% Water Savings</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Backtest Validation Card (Playbook Page 9 & 10) */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                <span>Historical Backtest Validation ({report.backtestSummary.event})</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {report.backtestSummary.evidenceNotes}
              </p>
              <div className="pt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Lead-time gained: {report.backtestSummary.warningLeadTimeDays} days before farmer harvest loss.
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: TIME SERIES VS 2001 NORMAL */}
          <TabsContent value="timeseries" className="space-y-4 pt-3">
            <Card className="p-4.5 bg-card/70 border-border/70 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Season Rainfall vs 2001-Onward Normal (GPM IMERG)
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Weekly precipitation accumulation compared to 24-year satellite baseline
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  2001 - 2025 Normal
                </Badge>
              </div>

              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={report.seasonTimeSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis
                      dataKey="week"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      unit="mm"
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line
                      type="monotone"
                      dataKey="currentSeasonRainMm"
                      name="Current Season Rain"
                      stroke="#3b82f6"
                      strokeWidth={2.2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="normalRainMm"
                      name="2001 Normal Baseline"
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4.5 bg-card/70 border-border/70 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Soil Moisture vs 2001-Onward Normal (SMAP 0-5cm)
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Tracking root zone infiltration against multi-year median
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  SMAP L-Band
                </Badge>
              </div>

              <div className="h-52 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={report.seasonTimeSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis
                      dataKey="week"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[10, 80]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      unit="%"
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line
                      type="monotone"
                      dataKey="currentSoilMoisturePct"
                      name="Current Soil Moisture"
                      stroke="#10b981"
                      strokeWidth={2.2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="normalSoilMoisturePct"
                      name="Normal Baseline (%)"
                      stroke="#64748b"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: WHAT FARMERS WERE TOLD (BILINGUAL BROADCASTS) */}
          <TabsContent value="farmer_alerts" className="space-y-4 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <PhoneCall className="h-4 w-4 text-primary" />
                  What Farmers Were Told (Push Alerts Log)
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Verified message templates dispatched via WhatsApp & SMS to smallholder farmers
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {report.farmerAlerts.length} Messages Dispatched
              </Badge>
            </div>

            <div className="space-y-3.5">
              {report.farmerAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-2">
                    <div>
                      <span className="font-bold text-foreground text-xs block">
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {alert.date} • {alert.status}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] py-0 border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                      Rule-Driven Alert
                    </Badge>
                  </div>

                  {/* Message in English */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      English SMS
                    </span>
                    <p className="text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40 leading-relaxed font-mono">
                      "{alert.messageEn}"
                    </p>
                  </div>

                  {/* Message in Sinhala */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      සිංහල (Sinhala WhatsApp)
                    </span>
                    <p className="text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40 leading-relaxed">
                      "{alert.messageSi}"
                    </p>
                  </div>

                  {/* Message in Tamil */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      தமிழ் (Tamil WhatsApp)
                    </span>
                    <p className="text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40 leading-relaxed">
                      "{alert.messageTa}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-2">
                    <span>{alert.historicalProbabilityNote}</span>
                    <span className="font-semibold text-primary">{alert.officerSignoff}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 4: SATELLITE TELEMETRY */}
          <TabsContent value="satellite" className="space-y-4 pt-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* NASA POWER */}
              <Card className="p-3.5 bg-card/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                  1. NASA POWER (Agroclimatology)
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Solar Radiation:</span>
                    <span className="font-semibold">{report.powerData.solarRadiationMJm2Day} MJ/m²/d</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Relative Humidity:</span>
                    <span className="font-semibold">{report.powerData.relativeHumidityPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days &gt; 35°C:</span>
                    <span className="font-semibold">{report.powerData.daysAbove35C} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suitability Index:</span>
                    <span className="font-semibold">{report.powerData.climateSuitabilityIndex}/100</span>
                  </div>
                </div>
              </Card>

              {/* SMAP */}
              <Card className="p-3.5 bg-card/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                  2. SMAP (Soil Moisture L3/L4)
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Surface Moisture:</span>
                    <span className="font-semibold">{report.smapData.surfaceSoilMoistureM3M3} m³/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Surface %ile:</span>
                    <span className="font-semibold">{report.smapData.surfacePercentile}th %ile</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Root-Zone %ile:</span>
                    <span className="font-semibold">{report.smapData.rootZonePercentile}th %ile</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Infiltration:</span>
                    <span className="font-semibold">{report.smapData.infiltrationPotentialScore}/100</span>
                  </div>
                </div>
              </Card>

              {/* GPM IMERG */}
              <Card className="p-3.5 bg-card/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                  3. GPM IMERG (Satellite Rainfall)
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">7-Day Total:</span>
                    <span className="font-semibold">{report.gpmData.last7DaysAccumulationMm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">30-Day Total:</span>
                    <span className="font-semibold">{report.gpmData.last30DaysAccumulationMm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">2001 Departure:</span>
                    <span className="font-semibold">{report.gpmData.historicalAnomalyPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reliability Score:</span>
                    <span className="font-semibold">{report.gpmData.rainfallReliabilityScore}%</span>
                  </div>
                </div>
              </Card>

              {/* Landsat & ECOSTRESS */}
              <Card className="p-3.5 bg-card/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                  4 & 5. Landsat NDVI & ECOSTRESS
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mean NDVI:</span>
                    <span className="font-semibold">{report.landsatData.currentNdvi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Crop Vigor:</span>
                    <span className="font-semibold">{report.landsatData.cropVigorStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Land Surface Temp:</span>
                    <span className="font-semibold">{report.ecostressData.landSurfaceTemperatureC}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Evapotranspiration:</span>
                    <span className="font-semibold">{report.ecostressData.evapotranspirationMmDay} mm/d</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 5: FIELD NOTES */}
          <TabsContent value="notes" className="space-y-4 pt-3">
            <div className="space-y-2.5">
              {districtNotes.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-3 text-center">
                  No active advisory notes for {report.districtName}. You can add one below.
                </p>
              ) : (
                districtNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl border border-border/80 bg-card text-xs flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {note.title}
                        </span>
                        <Badge
                          variant={
                            note.priority === "urgent"
                              ? "danger"
                              : note.priority === "medium"
                              ? "warning"
                              : "outline"
                          }
                          className="text-[9px] py-0"
                        >
                          {note.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
                        <span>{note.author}</span>
                        <span>•</span>
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteNote(note.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-rose-500 shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <Card className="p-4 border-dashed border-border/90 bg-card/50 space-y-3">
              <form onSubmit={handleCreateNote} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <PlusCircle className="h-3.5 w-3.5 text-primary" />
                    Add Advisory Pin to {report.districtName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Advisory Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="h-8 text-xs"
                  />

                  <Select
                    value={newPriority}
                    onValueChange={(val: NotePriority) => setNewPriority(val)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Info)</SelectItem>
                      <SelectItem value="medium">Medium (Advisory)</SelectItem>
                      <SelectItem value="urgent">Urgent (Action Required)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="Observations, water schedule adjustments, or farmer alert triggers..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  rows={2}
                  className="text-xs resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <Input
                    placeholder="Author / Division"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="h-8 text-xs max-w-[220px]"
                  />

                  <Button type="submit" size="sm" className="h-8 text-xs px-3">
                    Pin Note to Map
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
