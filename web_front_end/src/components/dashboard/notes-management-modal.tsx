"use client";

import React, { useState } from "react";
import {
  FileText,
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { MapNote, NotePriority } from "@/lib/types/notes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotesManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: MapNote[];
  onDeleteNote: (noteId: string) => void;
  onFocusDistrict: (districtId: string) => void;
}

export function NotesManagementModal({
  open,
  onOpenChange,
  notes,
  onDeleteNote,
  onFocusDistrict,
}: NotesManagementModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.districtName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" || n.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <DialogTitle className="text-base font-bold">
              National Field Advisory Notes & Map Pins
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Manage administrative warnings, drought alerts, and field observations pinned to the Sri Lanka map
          </DialogDescription>
        </DialogHeader>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by title, district, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs">
              <SelectValue placeholder="Priority Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent Only</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low (Info)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes List */}
        <div className="space-y-2.5 mt-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              No advisory notes match your filter criteria.
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-border/80 bg-card p-3.5 text-xs shadow-2xs space-y-2 hover:border-border transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
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
                        className="text-[10px] py-0"
                      >
                        {note.priority}
                      </Badge>
                      {note.tag && (
                        <Badge variant="secondary" className="text-[10px] py-0">
                          {note.tag}
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        onFocusDistrict(note.districtId);
                        onOpenChange(false);
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                    >
                      <MapPin className="h-3 w-3" />
                      {note.districtName} District
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteNote(note.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-rose-500"
                    title="Delete Note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  {note.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-2">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {note.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(note.createdAt).toLocaleDateString()} at{" "}
                    {new Date(note.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
