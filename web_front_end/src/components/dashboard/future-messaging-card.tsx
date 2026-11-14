"use client";

import React from "react";
import { Send, Smartphone, ShieldCheck, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FutureMessagingCard() {
  return (
    <Card className="p-4 border-dashed border-border/80 bg-muted/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
          <Smartphone className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              Farmer SMS & WhatsApp Broadcast Service
            </span>
            <Badge variant="outline" className="text-[10px] py-0 text-muted-foreground">
              Phase 2 Architecture Ready
            </Badge>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed max-w-2xl">
            Backend API integration hooks are structured in <code className="text-primary font-mono text-[10px]">lib/services</code>. Extension officers will be able to convert district advisory notes into bulk SMS messages dispatched via Sri Lanka Telco Gov Gateway.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] shrink-0 font-medium">
        <Clock className="h-3.5 w-3.5" />
        <span>Coming in Phase 2</span>
      </div>
    </Card>
  );
}
