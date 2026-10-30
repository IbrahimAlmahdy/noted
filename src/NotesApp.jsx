import { useEffect, useMemo, useState } from 'react'
import { FileText, Folder, Menu, Moon, Plus, Search, Star, Sun, Tag, Trash2, X } from 'lucide-react'

const NOTES_KEY = 'noted-notes'
const THEME_KEY = 'noted-theme'
const filters = ['All notes', 'Favorites', 'Work', 'Personal', 'Reading']

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY)) ?? [] } catch { return [] }
}

export default function NotesApp() {
  const [notes, setNotes] = useState(loadNotes)
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')
  const [filter, setFilter] = useState('All notes')
  const [query, setQuery] = useState('')
  const [editor, setEditor] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem(THEME_KEY, theme) }, [theme])

  const shownNotes = useMemo(() => notes.filter((note) => {
    const matchesFilter = filter === 'All notes' || (filter === 'Favorites' ? note.favorite : note.category === filter)
    return matchesFilter && `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase())
  }), [notes, filter, query])

  function saveNote(draft) {
    if (!draft.title.trim()) return
    if (draft.id) setNotes((items) => items.map((note) => note.id === draft.id ? { ...note, ...draft, title: draft.title.trim(), updated: 'Just now' } : note))
    else setNotes((items) => [{ ...draft, id: crypto.randomUUID(), favorite: false, updated: 'Just now' }, ...items])
    setEditor(null)
  }

  function updateNotes(update) { setNotes((items) => update(items)) }
  const isDark = theme === 'dark'
  const surface = isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-100 text-stone-900'
  const panel = isDark ? 'border-white/10 bg-zinc-900' : 'border-stone-200 bg-white'
  const muted = isDark ? 'text-zinc-500' : 'text-stone-500'

  return <main className={`min-h-screen transition-colors ${surface}`}><div className="mx-auto flex min-h-screen max-w-[1600px]">
    <Sidebar notes={notes} filter={filter} theme={theme} panel={panel} muted={muted} open={menuOpen} close={() => setMenuOpen(false)} onNew={() => setEditor({ title: '', content: '', category: 'Personal' })} onFilter={(value) => { setFilter(value); setMenuOpen(false) }} />
    {menuOpen && <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-20 bg-black/50 lg:hidden" />}
    <section className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-10 lg:py-8"><header className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><button type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)} className={`rounded-xl border p-2 lg:hidden ${panel}`}><Menu className="size-5" /></button><div><p className={`text-sm ${muted}`}>My workspace</p><h1 className="text-2xl font-bold sm:text-3xl">{filter}</h1></div></div><div className="flex gap-2"><button type="button" onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`rounded-xl border p-2.5 ${panel}`} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>{isDark ? <Sun className="size-5 text-amber-300" /> : <Moon className="size-5 text-indigo-600" />}</button><button type="button" onClick={() => setEditor({ title: '', content: '', category: 'Personal' })} className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-teal-300"><Plus className="size-4" />New note</button></div></header>
      <label className={`mt-8 flex items-center gap-3 rounded-2xl border px-4 py-3 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-400/10 ${panel} ${muted}`}><Search className="size-5" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your notes" className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500" /></label><p className={`mt-4 text-sm ${muted}`}>{shownNotes.length} notes</p>
      {shownNotes.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{shownNotes.map((note) => <NoteCard key={note.id} note={note} panel={panel} muted={muted} edit={() => setEditor(note)} favorite={() => updateNotes((items) => items.map((item) => item.id === note.id ? { ...item, favorite: !item.favorite } : item))} remove={() => updateNotes((items) => items.filter((item) => item.id !== note.id))} />)}</div> : <EmptyState panel={panel} muted={muted} onNew={() => setEditor({ title: '', content: '', category: 'Personal' })} />}</section></div>{editor && <Editor note={editor} theme={theme} close={() => setEditor(null)} save={saveNote} />}</main>
}

function Sidebar({ notes, filter, theme, panel, muted, open, close, onNew, onFilter }) { const dark = theme === 'dark'; return <aside className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r p-4 transition-transform lg:static lg:translate-x-0 ${panel} ${open ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between px-2"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-teal-400 text-zinc-950"><FileText className="size-5" /></div><b className="text-lg">Noted</b></div><button type="button" onClick={close} className="rounded-xl p-2 lg:hidden"><X className="size-5" /></button></div><button type="button" onClick={onNew} className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-400 px-4 py-3 text-sm font-bold text-zinc-950 hover:bg-teal-300"><Plus className="size-4" />New note</button><nav className="mt-8 space-y-1">{filters.map((item) => <button type="button" key={item} onClick={() => onFilter(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium ${filter === item ? (dark ? 'bg-white/10' : 'bg-stone-100') : `hover:bg-black/5 ${muted}`}`}>{item === 'Favorites' ? <Star className="size-4" /> : item === 'All notes' ? <FileText className="size-4" /> : <Folder className="size-4" />}{item}{item === 'All notes' && <span className="ml-auto rounded-lg bg-black/10 px-2 py-0.5 text-xs">{notes.length}</span>}</button>)}</nav></aside> }
function NoteCard({ note, panel, muted, edit, favorite, remove }) { return <article className={`group flex min-h-56 flex-col rounded-3xl border p-5 shadow-lg shadow-black/5 transition hover:-translate-y-1 ${panel}`}><div className="flex justify-between"><span className="size-3 rounded-full bg-teal-400" /><div className="flex gap-1"><IconButton label="Favorite note" click={favorite}><Star className={`size-4 ${note.favorite ? 'fill-amber-300 text-amber-300' : ''}`} /></IconButton><IconButton label="Delete note" click={remove}><Trash2 className="size-4 text-rose-400" /></IconButton></div></div><button type="button" onClick={edit} className="mt-5 text-left"><h2 className="text-lg font-bold">{note.title}</h2><p className={`mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 ${muted}`}>{note.content || 'No additional text'}</p></button><div className={`mt-auto flex justify-between pt-5 text-xs ${muted}`}><span className="rounded-lg bg-black/5 px-2.5 py-1"><Tag className="mr-1 inline size-3" />{note.category}</span><span>{note.updated}</span></div></article> }
function IconButton({ label, click, children }) { return <button type="button" aria-label={label} onClick={click} className="rounded-xl p-2 hover:bg-black/5">{children}</button> }
function EmptyState({ panel, muted, onNew }) { return <div className={`mt-4 grid min-h-80 place-items-center rounded-3xl border border-dashed p-8 text-center ${panel}`}><div><FileText className={`mx-auto size-8 ${muted}`} /><h2 className="mt-4 text-lg font-bold">Your notes are empty</h2><p className={`mt-2 text-sm ${muted}`}>Create your first note to begin.</p><button type="button" onClick={onNew} className="mt-5 rounded-xl bg-teal-400 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-teal-300">Create note</button></div></div> }
function Editor({ note, theme, close, save }) { const [title, setTitle] = useState(note.title); const [content, setContent] = useState(note.content); const [category, setCategory] = useState(note.category); const input = theme === 'dark' ? 'border-white/10 bg-zinc-950' : 'border-stone-200 bg-stone-50'; const modal = theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-stone-900'; return <div className="fixed inset-0 z-40 grid place-items-end bg-black/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-6"><form onSubmit={(event) => { event.preventDefault(); save({ ...note, title, content, category }) }} className={`w-full max-w-2xl rounded-t-3xl border p-5 shadow-2xl sm:rounded-3xl sm:p-7 ${modal} ${input}`}><div className="flex justify-between"><div><p className="text-sm opacity-60">{note.id ? 'Update your note' : 'Capture a thought'}</p><h2 className="mt-1 text-xl font-bold">{note.id ? 'Edit note' : 'New note'}</h2></div><button type="button" onClick={close} className="rounded-xl p-2" aria-label="Close editor"><X className="size-5" /></button></div><div className="mt-6 space-y-4"><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" className={`w-full rounded-2xl border px-4 py-3 text-lg font-semibold outline-none focus:border-teal-400 ${input}`} /><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start writing..." rows="7" className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm leading-6 outline-none focus:border-teal-400 ${input}`} /><select value={category} onChange={(event) => setCategory(event.target.value)} className={`rounded-xl border px-3 py-2 text-sm ${input}`}><option>Work</option><option>Personal</option><option>Reading</option></select></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={close} className="rounded-xl px-4 py-2.5 text-sm opacity-70 hover:bg-black/5">Cancel</button><button className="rounded-xl bg-teal-400 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-teal-300">Save note</button></div></form></div> }
