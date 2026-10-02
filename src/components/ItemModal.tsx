import React, { useState } from 'react';
import type { RoutineItem, Day, TimeSlot, RoutineSettings } from '../types/routine';
import { COLOR_PALETTE, CATEGORIES } from '../constants/presets';
import { formatTimeRange } from '../utils/time';
import { X, Trash2, Check, BookOpen, MapPin, User, Tag, AlignLeft, Calendar, Clock } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<RoutineItem, 'id'> | RoutineItem) => void;
  onDelete?: (itemId: string) => void;
  initialItem?: RoutineItem | null;
  defaultDayId?: string;
  defaultTimeSlotId?: string;
  days: Day[];
  timeSlots: TimeSlot[];
  settings: RoutineSettings;
}

const ItemModalContent: React.FC<Omit<ItemModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  onDelete,
  initialItem,
  defaultDayId,
  defaultTimeSlotId,
  days,
  timeSlots,
  settings,
}) => {
  const [title, setTitle] = useState(initialItem?.title || '');
  const [subtitle, setSubtitle] = useState(initialItem?.subtitle || '');
  const [instructor, setInstructor] = useState(initialItem?.instructor || '');
  const [location, setLocation] = useState(initialItem?.location || '');
  const [color, setColor] = useState(initialItem?.color || 'indigo');
  const [category, setCategory] = useState(initialItem?.category || 'Lecture');
  const [notes, setNotes] = useState(initialItem?.notes || '');
  const [dayId, setDayId] = useState(initialItem?.dayId || defaultDayId || days[0]?.id || '');
  const [timeSlotId, setTimeSlotId] = useState(initialItem?.timeSlotId || defaultTimeSlotId || timeSlots[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dayId || !timeSlotId) return;

    if (initialItem) {
      onSave({
        ...initialItem,
        title: title.trim(),
        subtitle: subtitle.trim(),
        instructor: instructor.trim(),
        location: location.trim(),
        color,
        category,
        notes: notes.trim(),
        dayId,
        timeSlotId,
      });
    } else {
      onSave({
        title: title.trim(),
        subtitle: subtitle.trim(),
        instructor: instructor.trim(),
        location: location.trim(),
        color,
        category,
        notes: notes.trim(),
        dayId,
        timeSlotId,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialItem ? 'Edit Routine Item' : 'New Routine Item'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specify class, meeting, or activity details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Day & Time Slot Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Day of Week
              </label>
              <select
                value={dayId}
                onChange={(e) => setDayId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              >
                {days.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.isOffDay ? '(Off Day)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Time Slot
              </label>
              <select
                value={timeSlotId}
                onChange={(e) => setTimeSlotId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              >
                {timeSlots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label ? `${s.label}: ` : ''}
                    {formatTimeRange(s.startTime, s.endTime, settings.timeFormat)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title / Activity Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Data Structures & Algorithms, Sprint Standup"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              required
              autoFocus
            />
          </div>

          {/* Subtitle & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Code / Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. CSE-201, Sprint 24"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Instructor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                Location / Room / Link
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Auditorium 201, Zoom"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                Instructor / Presenter
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="e.g. Prof. Alan Turing"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Color Accent
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map((c) => {
                const isSelected = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected
                        ? 'border-slate-900 dark:border-white scale-110 shadow-md ring-2 ring-indigo-400'
                        : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-500" />
              Notes / Remarks
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bring lab coat, submit assignment before class"
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {initialItem && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialItem.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
              >
                {initialItem ? 'Save Changes' : 'Add to Routine'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ItemModal: React.FC<ItemModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <ItemModalContent key={props.initialItem?.id || `${props.defaultDayId}_${props.defaultTimeSlotId}`} {...props} />;
};
