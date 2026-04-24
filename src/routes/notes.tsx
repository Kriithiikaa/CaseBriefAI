import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import {
  Search,
  Pin,
  PinOff,
  Trash2,
  Plus,
  StickyNote,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
  head: () => ({
    meta: [
      { title: "CareSync — Notes" },
      { name: "description", content: "Caseworker quick notes, Google Keep style." },
    ],
  }),
});

type NoteColor = "default" | "yellow" | "green" | "blue" | "pink" | "purple";

type Note = {
  id: string;
  title: string;
  body: string;
  color: NoteColor;
  pinned: boolean;
  updatedAt: number;
};

const COLOR_CLASSES: Record<NoteColor, string> = {
  default: "bg-card border-border",
  yellow: "bg-[oklch(0.97_0.06_95)] border-[oklch(0.88_0.1_95)]",
  green: "bg-[oklch(0.96_0.05_150)] border-[oklch(0.86_0.09_150)]",
  blue: "bg-[oklch(0.96_0.04_240)] border-[oklch(0.86_0.08_240)]",
  pink: "bg-[oklch(0.96_0.04_10)] border-[oklch(0.88_0.09_10)]",
  purple: "bg-[oklch(0.96_0.04_300)] border-[oklch(0.88_0.08_300)]",
};

const SWATCHES: { key: NoteColor; bg: string }[] = [
  { key: "default", bg: "bg-card border-border" },
  { key: "yellow", bg: "bg-[oklch(0.92_0.1_95)]" },
  { key: "green", bg: "bg-[oklch(0.9_0.09_150)]" },
  { key: "blue", bg: "bg-[oklch(0.9_0.08_240)]" },
  { key: "pink", bg: "bg-[oklch(0.9_0.09_10)]" },
  { key: "purple", bg: "bg-[oklch(0.9_0.08_300)]" },
];

const SEED: Note[] = [
  {
    id: "n1",
    title: "Follow up — Maria G.",
    body: "Call shelter coordinator before 4pm. Confirm beds for 3.",
    color: "yellow",
    pinned: true,
    updatedAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: "n2",
    title: "Supervisor sync",
    body: "Discuss high-risk intake queue and weekend coverage.",
    color: "blue",
    pinned: true,
    updatedAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: "n3",
    title: "Food pantry vouchers",
    body: "Restock issued vouchers — 12 left in drawer.",
    color: "green",
    pinned: false,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: "n4",
    title: "Document request",
    body: "Email translated lease form to J. Alvarez. Cc: legal aid.",
    color: "default",
    pinned: false,
    updatedAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: "n5",
    title: "Training",
    body: "Trauma-informed care refresher — Tue 10am.",
    color: "pink",
    pinned: false,
    updatedAt: Date.now() - 1000 * 60 * 60 * 22,
  },
  {
    id: "n6",
    title: "Ideas",
    body: "Build a shared template for housing intakes — reuse Maria's outline.",
    color: "purple",
    pinned: false,
    updatedAt: Date.now() - 1000 * 60 * 60 * 30,
  },
];

function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(SEED);
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState<{ title: string; body: string; color: NoteColor }>({
    title: "",
    body: "",
    color: "default",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
    );
  }, [notes, query]);

  const pinned = filtered.filter((n) => n.pinned);
  const others = filtered.filter((n) => !n.pinned);

  const addNote = () => {
    if (!draft.title.trim() && !draft.body.trim()) {
      setComposerOpen(false);
      return;
    }
    setNotes((prev) => [
      {
        id: `n${Date.now()}`,
        title: draft.title.trim(),
        body: draft.body.trim(),
        color: draft.color,
        pinned: false,
        updatedAt: Date.now(),
      },
      ...prev,
    ]);
    setDraft({ title: "", body: "", color: "default" });
    setComposerOpen(false);
  };

  const togglePin = (id: string) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const remove = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const setColor = (id: string, color: NoteColor) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, color } : n)));

  return (
    <AuthGuard>
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 px-8 py-6">
        <div className="mb-6 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-foreground">Notes</span>
        </div>

        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <StickyNote className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Notes</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Quick caseworker notes — pin the important ones.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-64 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={() => setComposerOpen(true)}
              className="flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> New note
            </button>
          </div>
        </header>

        {/* Composer */}
        <div className="mx-auto mb-8 max-w-2xl">
          {!composerOpen ? (
            <button
              onClick={() => setComposerOpen(true)}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left text-sm text-muted-foreground shadow-sm hover:bg-secondary"
            >
              <Plus className="h-4 w-4" /> Take a note...
            </button>
          ) : (
            <div
              className={`rounded-xl border p-4 shadow-md transition-colors ${COLOR_CLASSES[draft.color]}`}
            >
              <input
                autoFocus
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Title"
                className="w-full bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground"
              />
              <textarea
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                placeholder="Take a note..."
                rows={3}
                className="mt-2 w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div className="mt-3 flex items-center justify-between">
                <ColorPicker
                  value={draft.color}
                  onChange={(c) => setDraft((d) => ({ ...d, color: c }))}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setDraft({ title: "", body: "", color: "default" });
                      setComposerOpen(false);
                    }}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNote}
                    className="rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center text-muted-foreground">
            <StickyNote className="mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm">No notes match your search.</p>
          </div>
        ) : (
          <>
            {pinned.length > 0 && (
              <Section
                title="Pinned"
                notes={pinned}
                onPin={togglePin}
                onDelete={remove}
                onColor={setColor}
              />
            )}
            {others.length > 0 && (
              <Section
                title={pinned.length > 0 ? "Others" : "All notes"}
                notes={others}
                onPin={togglePin}
                onDelete={remove}
                onColor={setColor}
              />
            )}
          </>
        )}
      </main>
    </div>
    </AuthGuard>
  );
}

function Section({
  title,
  notes,
  onPin,
  onDelete,
  onColor,
}: {
  title: string;
  notes: Note[];
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onColor: (id: string, color: NoteColor) => void;
}) {
  return (
    <section className="mb-8">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="[column-fill:_balance] gap-4 [column-count:1] sm:[column-count:2] lg:[column-count:3] xl:[column-count:4]">
        {notes.map((n) => (
          <NoteCard key={n.id} note={n} onPin={onPin} onDelete={onDelete} onColor={onColor} />
        ))}
      </div>
    </section>
  );
}

function NoteCard({
  note,
  onPin,
  onDelete,
  onColor,
}: {
  note: Note;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onColor: (id: string, color: NoteColor) => void;
}) {
  return (
    <div
      className={`mb-4 inline-block w-full break-inside-avoid rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md ${COLOR_CLASSES[note.color]}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{note.title || "Untitled"}</h3>
        <button
          onClick={() => onPin(note.id)}
          aria-label={note.pinned ? "Unpin" : "Pin"}
          className="text-muted-foreground hover:text-foreground"
        >
          {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </button>
      </div>
      {note.body && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
          {note.body}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <ColorPicker value={note.color} onChange={(c) => onColor(note.id, c)} compact />
        <button
          onClick={() => onDelete(note.id)}
          aria-label="Delete note"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        {timeAgo(note.updatedAt)}
      </p>
    </div>
  );
}

function ColorPicker({
  value,
  onChange,
  compact = false,
}: {
  value: NoteColor;
  onChange: (c: NoteColor) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {SWATCHES.map((s) => {
        const active = value === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            aria-label={`Color ${s.key}`}
            className={`${compact ? "h-4 w-4" : "h-5 w-5"} rounded-full border ${s.bg} ${
              active ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : "border-border"
            }`}
          />
        );
      })}
    </div>
  );
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
