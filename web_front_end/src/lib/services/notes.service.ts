import { CreateNoteInput, MapNote } from "../types/notes";

const STORAGE_KEY = "field_shift_district_notes_v1";

const DEFAULT_INITIAL_NOTES: MapNote[] = [
  {
    id: "note-1",
    districtId: "anuradhapura",
    districtName: "Anuradhapura",
    title: "Critical Root Zone Moisture Deficit",
    content:
      "SMAP soil moisture dropped to 0.14 m³/m³. Recommend agricultural extension officers alert farmers to transition Yala season away from paddy towards mung bean.",
    priority: "urgent",
    author: "Admin (Climate Resilience Unit)",
    createdAt: "2026-11-14T09:30:00Z",
    tag: "SMAP Alert",
    mapPosition: { xPercent: 44, yPercent: 32 },
  },
  {
    id: "note-2",
    districtId: "mannar",
    districtName: "Mannar",
    title: "GPM IMERG Severe Drought Anomaly",
    content:
      "Rainfall departure is -46% below 30-year average. Tank storage levels critically depleted. Drought relief subsidy protocol activated.",
    priority: "urgent",
    author: "Admin (Water Resource Board)",
    createdAt: "2026-11-13T14:15:00Z",
    tag: "Drought Warning",
    mapPosition: { xPercent: 24, yPercent: 25 },
  },
  {
    id: "note-3",
    districtId: "polonnaruwa",
    districtName: "Polonnaruwa",
    title: "Vegetation Stress Hotspots in Kaduruwela",
    content:
      "Landsat-9 NDVI imagery confirms patchy plant stress along secondary irrigation channels. Water rationing schedule proposed.",
    priority: "medium",
    author: "Agronomist Team",
    createdAt: "2026-11-12T11:00:00Z",
    tag: "Landsat NDVI",
    mapPosition: { xPercent: 62, yPercent: 38 },
  },
  {
    id: "note-4",
    districtId: "nuwara-eliya",
    districtName: "Nuwara Eliya",
    title: "Highland Slope Erosion Precautions",
    content:
      "GPM IMERG predicts heavy orographic precipitation over the next 48h. Soil erosion barriers recommended for terraced vegetable beds.",
    priority: "low",
    author: "Field Officer Central",
    createdAt: "2026-11-11T16:40:00Z",
    tag: "Soil Conservation",
    mapPosition: { xPercent: 52, yPercent: 66 },
  },
];

class NotesService {
  private notes: MapNote[] = DEFAULT_INITIAL_NOTES;
  private initialized = false;

  private initFromStorage(): void {
    if (typeof window === "undefined" || this.initialized) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.notes = JSON.parse(stored);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_NOTES));
      }
    } catch {
      // Fallback to in-memory notes
    }
    this.initialized = true;
  }

  private persist(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
    } catch {
      // Ignore write errors
    }
  }

  getAllNotes(): MapNote[] {
    this.initFromStorage();
    return [...this.notes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getNotesByDistrict(districtId: string): MapNote[] {
    this.initFromStorage();
    return this.notes
      .filter((n) => n.districtId === districtId)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  createNote(input: CreateNoteInput): MapNote {
    this.initFromStorage();
    const newNote: MapNote = {
      ...input,
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.notes.unshift(newNote);
    this.persist();
    return newNote;
  }

  deleteNote(noteId: string): boolean {
    this.initFromStorage();
    const initialLen = this.notes.length;
    this.notes = this.notes.filter((n) => n.id !== noteId);
    if (this.notes.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }
}

export const notesService = new NotesService();
