"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore, STATUS_STEPS, RevisionStatus } from "../../../hooks/useStore";
import { supabase } from "../../../utils/supabase";
import { ArrowLeft, Plus, Trash2, BookOpen, Loader2 } from "lucide-react";

export default function UEDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { ues, fetchData, theme } = useStore();

    const [newSubject, setNewSubject] = useState("");
    const [newChapters, setNewChapters] = useState<Record<string, string>>({});
    const [isSyncing, setIsSyncing] = useState(false);

    const ue = ues.find((u) => u.id === id);

    useEffect(() => {
        if (ues.length === 0) fetchData();
        document.body.className = `theme-${theme}`;
    }, [ues, fetchData, theme]);

    if (!ue) return <div className="p-10 text-center animate-pulse">Chargement de l'unité...</div>;

    const addSubject = async () => {
        if (!newSubject.trim()) return;
        setIsSyncing(true);
        await supabase.from('subjects').insert([{ name: newSubject, ue_id: id }]);
        setNewSubject("");
        await fetchData();
        setIsSyncing(false);
    };

    const addChapter = async (subId: string) => {
        const name = newChapters[subId];
        if (!name?.trim()) return;
        setIsSyncing(true);
        await supabase.from('chapters').insert([{ name, subject_id: subId, status: 'Pas commencé' }]);
        setNewChapters({ ...newChapters, [subId]: "" });
        await fetchData();
        setIsSyncing(false);
    };

    const updateStatus = async (chapId: string, status: RevisionStatus) => {
        await supabase.from('chapters').update({ status }).eq('id', chapId);
        fetchData();
    };

    const deleteItem = async (table: string, itemId: string) => {
        if (confirm("Supprimer définitivement ?")) {
            await supabase.from(table).delete().eq('id', itemId);
            fetchData();
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header avec syntaxe v4 */}
            <header className="sticky top-0 z-30 bg-(--bg-main)/90 backdrop-blur-md border-b border-(--border) px-4 py-4 flex items-center gap-4">
                <button onClick={() => router.push('/')} className="p-2 hover:bg-(--bg-card) rounded-full transition">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="font-black text-lg truncate leading-tight">{ue.name}</h1>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                        {isSyncing ? <Loader2 size={10} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-green-500" />}
                        Cloud Sync
                    </div>
                </div>
            </header>

            <main className="p-4 max-w-xl mx-auto space-y-8">
                {/* Ajouter une Matière */}
                <section className="bg-(--bg-card) p-5 rounded-3xl border border-(--border) shadow-sm">
                    <h2 className="text-xs font-black uppercase tracking-tighter mb-3 opacity-50 text-(--text-main)">Nouvelle Matière</h2>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 bg-(--bg-main) border border-(--border) rounded-2xl p-3 text-sm outline-none focus:border-(--accent) transition"
                            placeholder="Ex: Anatomie, Pharmacologie..."
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                        />
                        <button onClick={addSubject} className="bg-(--accent) text-(--bg-main) px-4 rounded-2xl font-bold">
                            <Plus size={20} />
                        </button>
                    </div>
                </section>

                {/* Liste des Matières */}
                <div className="space-y-6">
                    {ue.subjects?.length === 0 && (
                        <div className="text-center py-20 opacity-30">
                            <BookOpen size={48} className="mx-auto mb-2" />
                            <p className="text-sm font-bold uppercase">Aucune matière enregistrée</p>
                        </div>
                    )}

                    {ue.subjects?.map((sub: any) => (
                        <div key={sub.id} className="bg-(--bg-card) rounded-[2.5rem] border border-(--border) overflow-hidden shadow-lg">
                            {/* Titre Matière */}
                            <div className="p-5 bg-(--bg-main)/30 border-b border-(--border) flex justify-between items-center">
                                <h3 className="font-black text-sm uppercase tracking-widest text-(--accent) italic">{sub.name}</h3>
                                <button onClick={() => deleteItem('subjects', sub.id)} className="text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Liste Chapitres */}
                            <div className="p-5 space-y-3">
                                {sub.chapters?.map((chap: any) => (
                                    <div key={chap.id} className="flex items-center gap-3 bg-(--bg-main) p-3 rounded-2xl border border-(--border) group">
                                        <select
                                            value={chap.status}
                                            onChange={(e) => updateStatus(chap.id, e.target.value as RevisionStatus)}
                                            className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg outline-none cursor-pointer border-none
                        ${chap.status === 'Pas commencé' ? 'bg-gray-500/10 text-gray-500' :
                                                    chap.status === 'Lu' ? 'bg-blue-500/20 text-blue-500' :
                                                        'bg-emerald-500/20 text-emerald-500'}`}
                                        >
                                            {STATUS_STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>

                                        <span className="flex-1 text-xs font-bold leading-tight">{chap.name}</span>

                                        <button onClick={() => deleteItem('chapters', chap.id)} className="opacity-0 group-hover:opacity-100 text-red-400 p-1 transition">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Ajout Chapitre Rapide */}
                                <div className="flex gap-2 pt-2 mt-2 border-t border-(--border) border-dashed">
                                    <input
                                        className="flex-1 bg-transparent text-xs p-2 outline-none"
                                        placeholder="Nouveau chapitre..."
                                        value={newChapters[sub.id] || ""}
                                        onChange={(e) => setNewChapters({ ...newChapters, [sub.id]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && addChapter(sub.id)}
                                    />
                                    <button onClick={() => addChapter(sub.id)} className="text-[10px] font-black uppercase text-(--accent) tracking-widest px-2">
                                        Ajouter
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}