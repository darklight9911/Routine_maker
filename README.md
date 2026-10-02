# RoutineCraft 📅✨
> A vibrant, interactive, and responsive Routine & Timetable Maker built with React 19, TypeScript, and Tailwind CSS v4 — runs completely client-side without any backend.

---

## 🚀 Key Highlights & Layout Architecture

- **Upper Row = Time Slots**: Columns along the top row display the time periods with durations and custom labels (e.g. `08:30 - 09:45 Period 1`).
- **Rightmost Column = Days**: Each row represents a day of the week, with the **Day Name and Off-Day badge pinned to the rightmost column** (with an optional toggle to swap to the left if preferred).
- **Partitioned Drag & Drop Mechanics**:
  - ↔ **Time Slots**: Drag top-row time headers horizontally to reorder columns. Time slots can only swap or reorder with other time slots.
  - ↕ **Days**: Drag rightmost day headers vertically to reorder rows. Days can only swap or reorder with other days.
  - ✥ **Routine Events**: Drag event cards freely between any cell in the routine grid — swap positions with existing cards or drop into empty slots.
- **Pure Client-Side**:
  - Zero backend or database setup required.
  - Automatic persistence to browser `localStorage`.
  - Export as high-resolution **PNG image**, print or save as **PDF**, backup & restore with **JSON**.
- **Modern & Vibrant Design**:
  - Smooth dark / light mode toggle.
  - 10+ modern pastel & neon color palettes for courses and activities.
  - Tag badges (Lecture, Lab, Tutorial, Deep Work, Meeting, Workout, Break).
  - Search & instant filter by title, room, teacher, or category.
  - Complete **Undo & Redo** history support (`Ctrl+Z` / `Ctrl+Y`).
  - Workload analytics & hours breakdown drawer.
  - Pre-packaged templates: *University Academic Timetable*, *Developer Work & Sprint Schedule*, and *Blank 7-Day Timetable*.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Exporting**: `html-to-image`
- **Effects**: `canvas-confetti`
- **Linter**: `oxlint`

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/darklight9911/Routine_maker.git
cd Routine_maker

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit the local server URL (usually `http://localhost:5173`) in your browser.

### Building for Production

```bash
npm run build
```

The static bundle will be generated in the `dist/` directory, ready to be deployed to GitHub Pages, Vercel, Netlify, or Cloudflare Pages.

---

## 📋 Features Walkthrough

1. **Adding & Editing Activities**:
   - Click any empty cell or the **+ Add Event** button to specify course name, code, instructor, room, category tag, color accent, and notes.
   - Click any card to edit, duplicate, or delete.
2. **Reordering Columns & Rows**:
   - Grab the grip handle on any time header to rearrange the schedule horizontally.
   - Grab the grip handle on any day header to reorder days vertically.
3. **Templates**:
   - Access pre-made schedules (University, Engineering sprint, 7-day canvas) with one click from the top bar.
4. **Analytics Drawer**:
   - View total weekly scheduled hours, category distribution, and peak day.
5. **Image & PDF Export**:
   - Download a crisp PNG image of your routine or open print-preview formatted for letter/A4 paper.
