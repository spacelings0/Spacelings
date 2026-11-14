"use client";

import React from "react";
import { Satellite, FileText, BarChart3, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onOpenNotesManager: () => void;
  onOpenComparison: () => void;
  activeNotesCount: number;
}

export function Header({
  onOpenNotesManager,
  onOpenComparison,
  activeNotesCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto">
        {/* Left Branding */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Satellite className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-foreground">
                Field Shift
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground hidden sm:inline font-medium">
                Kethata Ida
              </span>
              <Badge
                variant="outline"
                className="hidden md:inline-flex text-[10px] py-0.5 px-2 font-medium text-muted-foreground border-border/70 bg-muted/20"
              >
                Space Apps 2026
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground/90 tracking-tight">
              Agricultural Extension Command Center • Adapting Farms with NASA Data
            </p>
          </div>
        </div>

        {/* Center Live Data Status */}
        <div className="hidden xl:flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border/40 bg-muted/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium tracking-tight">
              4 Data Streams: GPM IMERG • SMAP • Landsat NDVI • NASA POWER
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenComparison}
            className="h-8.5 gap-2 text-xs font-medium border-border/60 hover:bg-muted/50"
          >
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">District Comparison</span>
            <span className="sm:hidden">Compare</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenNotesManager}
            className="h-8.5 gap-2 text-xs font-medium border-border/60 hover:bg-muted/50 relative"
          >
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Advisories & Notes</span>
            <span className="sm:hidden">Notes</span>
            {activeNotesCount > 0 && (
              <span className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold px-1.5 py-0.2 text-[10px]">
                {activeNotesCount}
              </span>
            )}
          </Button>

          <div className="h-4 w-[1px] bg-border/60 mx-1 hidden sm:block" />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
