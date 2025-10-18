export interface ChatTitle {
  threadId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'chat-titles';

export const titleStorage = {
  getTitle(threadId: string): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const titles: Record<string, ChatTitle> = JSON.parse(stored);
      const titleData = titles[threadId];
      
      return titleData?.title || null;
    } catch (error) {
      console.error('Error reading title from localStorage:', error);
      return null;
    }
  },

  saveTitle(threadId: string, title: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const titles: Record<string, ChatTitle> = stored ? JSON.parse(stored) : {};
      
      const now = Date.now();
      titles[threadId] = {
        threadId,
        title,
        createdAt: titles[threadId]?.createdAt || now,
        updatedAt: now,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(titles));
      
      window.dispatchEvent(new CustomEvent('chat-title-updated', { 
        detail: { threadId, title } 
      }));
    } catch (error) {
      console.error('Error saving title to localStorage:', error);
    }
  },

  getAllTitles(): ChatTitle[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const titles: Record<string, ChatTitle> = JSON.parse(stored);
      return Object.values(titles).sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error('Error reading titles from localStorage:', error);
      return [];
    }
  },

  deleteTitle(threadId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      
      const titles: Record<string, ChatTitle> = JSON.parse(stored);
      delete titles[threadId];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(titles));
    } catch (error) {
      console.error('Error deleting title from localStorage:', error);
    }
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing titles from localStorage:', error);
    }
  },
};
