export type NotePriority = "low" | "medium" | "urgent";

export interface MapNote {
  id: string;
  districtId: string;
  districtName: string;
  title: string;
  content: string;
  priority: NotePriority;
  author: string;
  createdAt: string;
  tag?: string; // e.g. "Drought Warning", "SMAP Alert", "Rotation Advisory"
  mapPosition?: {
    xPercent: number; // percentage coordinate on vector map
    yPercent: number;
  };
}

export interface CreateNoteInput {
  districtId: string;
  districtName: string;
  title: string;
  content: string;
  priority: NotePriority;
  author: string;
  tag?: string;
  mapPosition?: {
    xPercent: number;
    yPercent: number;
  };
}
