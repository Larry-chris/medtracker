// src/app/page.tsx
"use client";

// ON CHANGE ICI : On utilise des ".." au lieu de "@"
import { useEffect, useState, useMemo } from "react";
import { useStore } from "../hooks/useStore";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";
import { Settings, Plus, Trash2, GraduationCap, Activity, ChevronRight } from "lucide-react";

// ... le reste du code ne change pas ...
export default function Home() {
  const { theme, setTheme, ues, fetchData } = useStore();
  const [newUE, setNewUE] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('med-theme') as any;
    if (savedTheme) setTheme(savedTheme);
    fetchData();
    document.body.className = `theme-${theme}`;
  }, [theme, setTheme, fetchData]);

  const addUE = async () => {
    if (!newUE.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('ues').insert([{ name: newUE, user_id: user?.id }]);
    setNewUE("");
    fetchData();
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="p-6 flex justify-between items-center border-b border-[var(--border)] bg-[var(--bg-main)]/80 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-xl font-black italic text-[var(--accent)] flex items-center gap-2">
          <GraduationCap /> MEDTRACKER
        </h1>
        <div className="flex gap-2">
          {['white', 'navy', 'black'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t as any)}
              className={`w-6 h-6 rounded-full border-2 ${theme === t ? 'border-[var(--accent)]' : 'border-transparent'}`}
              style={{ backgroundColor: t === 'white' ? '#fff' : t === 'navy' ? '#0a192f' : '#000' }}
            />
          ))}
        </div>
      </header>

      <main className="p-4 max-w-xl mx-auto space-y-6">
        {/* Dashboard Stat */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl p-6 text-white shadow-xl">
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Ma Progression</p>
          <div className="text-4xl font-black my-2 tracking-tighter">Prêt pour les compos</div>
          <p className="text-xs opacity-70">Sélectionne une UE pour gérer tes matières.</p>
        </div>

        {/* Input Ajout */}
        <div className="flex gap-2">
          <input
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 outline-none focus:border-[var(--accent)] transition"
            placeholder="Nouvelle UE (ex: Cardio)..."
            value={newUE}
            onChange={(e) => setNewUE(e.target.value)}
          />
          <button onClick={addUE} className="bg-[var(--accent)] text-white px-6 rounded-2xl font-bold active:scale-95 transition">
            <Plus />
          </button>
        </div>

        {/* Liste des UE */}
        <div className="grid gap-3">
          {ues.map((ue) => (
            <div
              key={ue.id}
              onClick={() => router.push(`/ue/${ue.id}`)}
              className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border)] flex justify-between items-center cursor-pointer hover:border-[var(--accent)] transition-all group"
            >
              <div>
                <h3 className="font-bold text-lg">{ue.name}</h3>
                <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-tighter">
                  {ue.subjects?.length || 0} Matières enregistrées
                </p>
              </div>
              <ChevronRight className="text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}