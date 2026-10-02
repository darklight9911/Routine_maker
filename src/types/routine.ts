export type BreakType = 'lunch' | 'leisure' | 'sleep' | 'dinner' | 'snack' | 'other';

export interface TimeSlot {
  id: string;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  label?: string;    // e.g. "Lunch", "Deep Work"
  isBreak?: boolean; // Break / intermission divider
  breakType?: BreakType; // 'lunch' | 'leisure' | 'sleep' | 'dinner' | 'snack' | 'other'
}

export interface Day {
  id: string;
  name: string;      // "Monday"
  shortName: string; // "Mon"
  isOffDay?: boolean;// Weekend / Day off
}

export interface RoutineItem {
  id: string;
  dayId: string;
  timeSlotId: string;
  title: string;
  subtitle?: string;    // e.g. Course code "CSE-311"
  instructor?: string;  // e.g. "Dr. Adams"
  location?: string;    // e.g. "Lab 4", "Room 302"
  color: string;        // Hex or Tailwind color token
  category?: string;    // "Lecture", "Lab", "Meeting", "Self Study", "Break"
  notes?: string;
}

export interface RoutineSettings {
  dayColumnPosition: 'right' | 'left';
  theme: 'slate' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan';
  darkMode: boolean;
  compactMode: boolean;
  showLocation: boolean;
  showInstructor: boolean;
  showCategory: boolean;
  timeFormat: '12h' | '24h';
}

export interface RoutineData {
  version: number;
  title: string;
  subtitle: string;
  days: Day[];
  timeSlots: TimeSlot[];
  items: RoutineItem[];
  settings: RoutineSettings;
}

export type DragItemType = 'time-slot' | 'day-row' | 'routine-item';

export interface DragState {
  type: DragItemType | null;
  sourceId: string | null;
  sourceDayId?: string;
  sourceTimeSlotId?: string;
}
