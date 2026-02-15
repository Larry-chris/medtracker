"use client";
export const dynamic = "force-dynamic"; // <--- AJOUTE CETTE LIGNE

import { useEffect, useState } from "react";
import { useStore } from "../hooks/useStore";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";
import { Plus, GraduationCap, ChevronRight } from "lucide-react";

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
      {/* Header avec la nouvelle syntaxe v4 */}
      <header className="p-6 flex justify-between items-center border-b border-(--border) bg-(--bg-main)/80 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-xl font-black italic text-(--accent) flex items-center gap-2">
          <GraduationCap /> MEDTRACKER
        </h1>
        <div className="flex gap-2">
          {['white', 'navy', 'black'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t as any)}
              className={`w-6 h-6 rounded-full border-2 ${theme === t ? 'border-(--accent)' : 'border-transparent'}`}
              style={{ backgroundColor: t === 'white' ? '#fff' : t === 'navy' ? '#0a192f' : '#000' }}
            />
          ))}
        </div>
      </header>

      <main className="p-4 max-w-xl mx-auto space-y-6">
        {/* Dashboard Stat */}
        <div className="bg-linear-to-br from-indigo-600 to-blue-500 rounded-3xl p-6 text-white shadow-xl">
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Ma Progression</p>
          <div className="text-4xl font-black my-2 tracking-tighter">Prêt pour les compos</div>
          <p className="text-xs opacity-70">Sélectionne une UE pour gérer tes matières.</p>
        </div>

        {/* Input Ajout avec syntaxe v4 */}
        <div className="flex gap-2">
          <input
            className="flex-1 bg-(--bg-card) border border-(--border) rounded-2xl p-4 outline-none focus:border-(--accent) transition"
            placeholder="Nouvelle UE (ex: Cardio)..."
            value={newUE}
            onChange={(e) => setNewUE(e.target.value)}
          />
          <button onClick={addUE} className="bg-(--accent) text-white px-6 rounded-2xl font-bold active:scale-95 transition">
            <Plus />
          </button>
        </div>

        {/* Liste des UE avec syntaxe v4 */}
        <div className="grid gap-3">
          {ues.map((ue) => (
            <div
              key={ue.id}
              onClick={() => router.push(`/ue/${ue.id}`)}
              className="bg-(--bg-card) p-5 rounded-2xl border border-(--border) flex justify-between items-center cursor-pointer hover:border-(--accent) transition-all group"
            >
              <div>
                <h3 className="font-bold text-lg">{ue.name}</h3>
                <p className="text-xs text-(--text-muted) font-medium uppercase tracking-tighter">
                  {ue.subjects?.length || 0} Matières enregistrées
                </p>
              </div>
              <ChevronRight className="text-(--text-muted) group-hover:translate-x-1 transition-transform" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}