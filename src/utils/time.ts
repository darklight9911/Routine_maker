export function formatTimeString(time24: string, format: '12h' | '24h'): string {
  if (!time24) return '';
  if (format === '24h') return time24;

  const parts = time24.split(':');
  if (parts.length < 2) return time24;

  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  if (isNaN(hour)) return time24;

  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
}

export function formatTimeRange(start: string, end: string, format: '12h' | '24h'): string {
  if (!start && !end) return '';
  if (!end) return formatTimeString(start, format);
  if (!start) return formatTimeString(end, format);
  return `${formatTimeString(start, format)} - ${formatTimeString(end, format)}`;
}

export function calculateDurationMinutes(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return 0;
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const diff = endMin - startMin;
  return diff > 0 ? diff : diff + 1440; // in case overnight
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}
