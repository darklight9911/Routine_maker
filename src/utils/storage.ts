import type { RoutineData } from '../types/routine';
import { DEFAULT_UNIVERSITY_ROUTINE } from '../constants/presets';
import { toPng } from 'html-to-image';

const STORAGE_KEY = 'routine_maker_data_v1';

export function loadRoutineFromStorage(): RoutineData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_UNIVERSITY_ROUTINE;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.days) && Array.isArray(parsed.timeSlots)) {
      // Ensure dayColumnPosition is present, defaulting to right as per user request
      return {
        ...DEFAULT_UNIVERSITY_ROUTINE,
        ...parsed,
        settings: {
          ...DEFAULT_UNIVERSITY_ROUTINE.settings,
          ...(parsed.settings || {}),
          dayColumnPosition: parsed.settings?.dayColumnPosition || 'left',
        },
      };
    }
    return DEFAULT_UNIVERSITY_ROUTINE;
  } catch (err) {
    console.error('Failed to load routine from storage:', err);
    return DEFAULT_UNIVERSITY_ROUTINE;
  }
}

export function saveRoutineToStorage(data: RoutineData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save routine to storage:', err);
  }
}

export function exportRoutineAsJSON(data: RoutineData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const sanitizedTitle = data.title.toLowerCase().replace(/[^a-z0-9]/gi, '_') || 'routine';
  a.download = `${sanitizedTitle}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportTableAsImage(elementId: string, filename: string): Promise<boolean> {
  const node = document.getElementById(elementId);
  if (!node) return false;
  try {
    const dataUrl = await toPng(node, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      filter: (domNode) => {
        if (domNode instanceof HTMLElement && domNode.classList.contains('no-export')) {
          return false;
        }
        return true;
      },
    });
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (err) {
    console.error('Error generating image export:', err);
    return false;
  }
}
