import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // On ajoute createJSONStorage
import { supabase } from '../utils/supabase';

export type RevisionStatus = 'Pas commencé' | 'Lu' | 'Appris' | 'Réviser 1' | 'Révisé 2' | 'Révisé 3';
export const STATUS_STEPS: RevisionStatus[] = ['Pas commencé', 'Lu', 'Appris', 'Réviser 1', 'Révisé 2', 'Révisé 3'];

interface AppState {
    theme: 'white' | 'navy' | 'black';
    ues: any[];
    setTheme: (t: 'white' | 'navy' | 'black') => void;
    fetchData: () => Promise<void>;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            theme: 'white',
            ues: [],
            setTheme: (theme) => {
                set({ theme });
                // On garde le localStorage manuel ici pour la compatibilité immédiate
                if (typeof window !== 'undefined') {
                    localStorage.setItem('med-theme', theme);
                }
            },
            fetchData: async () => {
                const { data } = await supabase.from('ues').select(`
          id, name, 
          subjects (id, name, chapters (id, name, status))
        `).order('created_at', { ascending: true });
                set({ ues: data || [] });
            },
        }),
        {
            name: 'med-settings',
            // 👇 C'EST ICI QUE LA MAGIE OPÈRE POUR RÉPARER LE BUILD 👇
            storage: createJSONStorage(() => {
                // Si on est sur le serveur (build Vercel), on renvoie un faux stockage vide pour ne pas planter
                if (typeof window === 'undefined') {
                    return {
                        getItem: () => null,
                        setItem: () => { },
                        removeItem: () => { },
                    };
                }
                // Sinon (sur ton téléphone), on utilise le vrai localStorage
                return localStorage;
            }),
        }
    )
);