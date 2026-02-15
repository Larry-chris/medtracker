import { create } from 'zustand';
import { supabase } from '../utils/supabase';

export type RevisionStatus = 'Pas commencé' | 'Lu' | 'Appris' | 'Réviser 1' | 'Révisé 2' | 'Révisé 3';
export const STATUS_STEPS: RevisionStatus[] = ['Pas commencé', 'Lu', 'Appris', 'Réviser 1', 'Révisé 2', 'Révisé 3'];

interface AppState {
    theme: 'white' | 'navy' | 'black';
    ues: any[];
    setTheme: (t: 'white' | 'navy' | 'black') => void;
    fetchData: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
    theme: 'white',
    ues: [],
    setTheme: (theme) => {
        set({ theme });
        localStorage.setItem('med-theme', theme);
    },
    fetchData: async () => {
        const { data } = await supabase.from('ues').select(`
      id, name, 
      subjects (id, name, chapters (id, name, status))
    `).order('created_at', { ascending: true });
        set({ ues: data || [] });
    },
}));