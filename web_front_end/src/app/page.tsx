"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { NationalKpiBar } from "@/components/dashboard/national-kpi-bar";
import { SriLankaMap } from "@/components/map/sri-lanka-map";
import { DistrictDetailDrawer } from "@/components/dashboard/district-detail-drawer";
import { DistrictComparison } from "@/components/dashboard/district-comparison";
import { NotesManagementModal } from "@/components/dashboard/notes-management-modal";
import { FutureMessagingCard } from "@/components/dashboard/future-messaging-card";
import { DISTRICT_SUMMARIES, generateDistrictFullReport } from "@/lib/data/mock-nasa-data";
import { DistrictSummary } from "@/lib/types/district";
import { DistrictFullNasaReport } from "@/lib/types/nasa";
import { MapNote, NotePriority } from "@/lib/types/notes";
import { notesService } from "@/lib/services/notes.service";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Scale,
  Sparkles,
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [districts] = useState<DistrictSummary[]>(DISTRICT_SUMMARIES);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>("polonnaruwa");
  const [selectedReport, setSelectedReport] = useState<DistrictFullNasaReport | null>(null);
  const [notes, setNotes] = useState<MapNote[]>([]);
  const [districtSearch, setDistrictSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState<string>("all");

  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [notesManagerOpen, setNotesManagerOpen] = useState(false);

  // Load notes on client mount and set default pilot district
  useEffect(() => {
    setNotes(notesService.getAllNotes());
    setSelectedReport(generateDistrictFullReport("polonnaruwa"));
  }, []);

  // Handle selecting a district
  const handleSelectDistrict = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const report = generateDistrictFullReport(districtId);
    setSelectedReport(report);
  };

  // Handle adding a note
  const handleAddNote = (
    districtId: string,
    districtName: string,
    title: string,
    content: string,
    priority: NotePriority,
    author: string
  ) => {
    notesService.createNote({
      districtId,
      districtName,
      title,
      content,
      priority,
      author,
    });
    setNotes(notesService.getAllNotes());
  };

  // Handle deleting a note
  const handleDeleteNote = (noteId: string) => {
    notesService.deleteNote(noteId);
    setNotes(notesService.getAllNotes());
  };

  // Filtered districts
  const filteredDistricts = districts.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.province.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.dominantCrop.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.localNameSi.includes(districtSearch) ||
      d.localNameTa.includes(districtSearch);

    const matchesZone = zoneFilter === "all" || d.climateZone === zoneFilter;

    return matchesSearch && matchesZone;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        onOpenNotesManager={() => setNotesManagerOpen(true)}
        onOpenComparison={() => setComparisonOpen(true)}
        activeNotesCount={notes.length}
      />

      {/* Main Content Area with Generous Whitespace */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto w-full">
        {/* National Metric KPI Bar */}
        <NationalKpiBar
          districts={districts}
          onSelectPilot={() => handleSelectDistrict("polonnaruwa")}
        />

        {/* Core Layout: Interactive Map + District Explorer Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Sri Lanka Interactive Vector Map (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[600px] lg:h-[750px]">
            <SriLankaMap
              districts={districts}
              selectedDistrictId={selectedDistrictId}
              onSelectDistrict={handleSelectDistrict}
              notes={notes}
              onAddNoteAtDistrict={(districtId) => {
                handleSelectDistrict(districtId);
              }}
            />
          </div>

          {/* District Explorer & Quick Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col h-[600px] lg:h-[750px] rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border/50 bg-muted/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-primary" />
                  Sri Lanka 25 Districts
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {filteredDistricts.length} districts
                </span>
              </div>

              {/* Search & Zone Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search district, crop, or division..."
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    className="pl-8 h-8 text-xs bg-background/80"
                  />
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  <Button
                    variant={zoneFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setZoneFilter("all")}
                    className="h-6.5 text-[10px] px-2.5 py-0 rounded-full"
                  >
                    All Zones
                  </Button>
                  <Button
                    variant={zoneFilter === "Dry Zone" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setZoneFilter("Dry Zone")}
                    className="h-6.5 text-[10px] px-2.5 py-0 rounded-full text-amber-500"
                  >
                    Dry Zone
                  </Button>
                  <Button
                    variant={zoneFilter === "Intermediate Zone" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setZoneFilter("Intermediate Zone")}
                    className="h-6.5 text-[10px] px-2.5 py-0 rounded-full text-sky-500"
                  >
                    Intermediate
                  </Button>
                  <Button
                    variant={zoneFilter === "Wet Zone" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setZoneFilter("Wet Zone")}
                    className="h-6.5 text-[10px] px-2.5 py-0 rounded-full text-emerald-500"
                  >
                    Wet Zone
                  </Button>
                </div>
              </div>
            </div>

            {/* Scrollable District List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40 p-2 space-y-1">
              {filteredDistricts.map((district) => {
                const isSelected = selectedDistrictId === district.id;
                const isPilot = district.id === "polonnaruwa";
                const districtNotesCount = notes.filter(
                  (n) => n.districtId === district.id
                ).length;

                return (
                  <div
                    key={district.id}
                    onClick={() => handleSelectDistrict(district.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30 shadow-2xs"
                        : isPilot
                        ? "bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">
                          {district.name}
                        </span>
                        {isPilot && (
                          <Badge variant="outline" className="text-[9px] py-0 px-1 border-emerald-500/30 text-emerald-600 bg-emerald-500/10 font-bold">
                            Space Apps Pilot
                          </Badge>
                        )}
                        <Badge
                          variant={
                            district.plantingWindowStatus === "Window Open"
                              ? "success"
                              : district.plantingWindowStatus === "Waiting for Onset"
                              ? "warning"
                              : "danger"
                          }
                          className="text-[9px] py-0"
                        >
                          {district.plantingWindowStatus}
                        </Badge>
                        {districtNotesCount > 0 && (
                          <span className="text-[10px] text-amber-500 font-bold">
                            • {districtNotesCount} pin{districtNotesCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                        {district.province} • {district.dominantCrop}
                      </p>
                    </div>

                    <div className="text-right space-y-0.5 shrink-0 pl-2">
                      <div className="text-xs font-semibold text-foreground">
                        SMAP: {district.soilMoistureScore}%
                      </div>
                      <div
                        className={`text-[10px] font-medium ${
                          district.rainfallAnomalyPercent < 0
                            ? "text-rose-500"
                            : "text-emerald-500"
                        }`}
                      >
                        GPM: {district.rainfallAnomalyPercent > 0 ? "+" : ""}
                        {district.rainfallAnomalyPercent}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Footer inside sidebar */}
            <div className="p-3.5 border-t border-border/50 bg-muted/10 flex items-center justify-between text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setComparisonOpen(true)}
                className="w-full text-xs h-8.5 gap-2 rounded-lg"
              >
                <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                Compare Districts Side-by-Side
              </Button>
            </div>
          </div>
        </div>

        {/* Future Farmer Messaging Placeholder Card */}
        <FutureMessagingCard />
      </main>

      {/* District Detail Drawer / Inspector */}
      {selectedReport && (
        <DistrictDetailDrawer
          report={selectedReport}
          onClose={() => {
            setSelectedDistrictId(null);
            setSelectedReport(null);
          }}
          notes={notes}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      )}

      {/* Multi-District Comparison Modal */}
      <DistrictComparison
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        districts={districts}
        defaultDistrictId={selectedDistrictId || "polonnaruwa"}
      />

      {/* Full Field Notes Manager Dialog */}
      <NotesManagementModal
        open={notesManagerOpen}
        onOpenChange={setNotesManagerOpen}
        notes={notes}
        onDeleteNote={handleDeleteNote}
        onFocusDistrict={(districtId) => handleSelectDistrict(districtId)}
      />
    </div>
  );
}
