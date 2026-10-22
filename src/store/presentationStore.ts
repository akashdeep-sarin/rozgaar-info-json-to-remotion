import { create } from 'zustand';
import { Presentation as PresentationType } from '../zod-presentation-schema';

interface Metadata {
  organizationName: string | null;
  organizationShortName: string | null;
  domain: string | null;
  qualificationExpected: string[] | null;
  totalPosts: number | null;
}

interface PresentationState {
  language: 'en' | 'hi';
  metadata: Metadata | null;
  setLanguage: (language: 'en' | 'hi') => void;
  setMetadata: (metadata: Metadata) => void;
}

export const usePresentationStore = create<PresentationState>((set) => ({
  language: 'en',
  metadata: null,
  setLanguage: (language) => set({ language }),
  setMetadata: (metadata) => set({ metadata }),
}));
